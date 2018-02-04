/*!
 * Webogram v0.7.0 - messaging web application for MTProto
 * https://github.com/zhukov/webogram
 * Copyright (C) 2014 Igor Zhukov <igor.beatle@gmail.com>
 * https://github.com/zhukov/webogram/blob/master/LICENSE
 */

// angular.module('izhukov.mtproto.wrapper', ['izhukov.utils', 'izhukov.mtproto'])

	// function MtpApiManager (Storage, MtpAuthorizer, MtpNetworkerFactory, MtpSingleInstanceService, AppRuntimeManager, ErrorService, qSync, $rootScope, $q, WebPushApiManager, TelegramMeWebService) {
	function MtpApiManager () {
		var cachedNetworkers = {}
		var cachedUploadNetworkers = {}
		var cachedExportPromise = {}
		var baseDcID = false

		var telegramMeNotified;

		Storage().get('dc').then(function (dcID) {
			if (dcID) {
				baseDcID = dcID
			}
		})

		function telegramMeNotify (newValue) {
			if (telegramMeNotified !== newValue) {
				telegramMeNotified = newValue
				// TelegramMeWebService.setAuthorized(telegramMeNotified)
			}
		}

		function mtpSetUserAuth (dcID, userAuth) {
			var fullUserAuth = angular.extend({dcID: dcID}, userAuth)
			Storage.set({
				dc: dcID,
				user_auth: fullUserAuth
			})
			telegramMeNotify(true)
			$rootScope.$broadcast('user_auth', fullUserAuth)

			baseDcID = dcID
		}

		function mtpLogOut () {
			var storageKeys = []
			for (var dcID = 1; dcID <= 5; dcID++) {
				storageKeys.push('dc' + dcID + '_auth_key')
			}
			WebPushApiManager.forceUnsubscribe()
			return Storage.get(storageKeys).then(function (storageResult) {
				var logoutPromises = []
				for (var i = 0; i < storageResult.length; i++) {
					if (storageResult[i]) {
						logoutPromises.push(mtpInvokeApi('auth.logOut', {}, {dcID: i + 1, ignoreErrors: true}))
					}
				}
				return $q.all(logoutPromises).then(function () {
					Storage.remove('dc', 'user_auth')
					baseDcID = false
					telegramMeNotify(false)
					return mtpClearStorage()
				}, function (error) {
					storageKeys.push('dc', 'user_auth')
					Storage.remove(storageKeys)
					baseDcID = false
					error.handled = true
					telegramMeNotify(false)
					return mtpClearStorage()
				})
			})
		}

		function mtpClearStorage () {
			var saveKeys = ['user_auth', 't_user_auth', 'dc', 't_dc']
			for (var dcID = 1; dcID <= 5; dcID++) {
				saveKeys.push('dc' + dcID + '_auth_key')
				saveKeys.push('t_dc' + dcID + '_auth_key')
			}
			Storage.noPrefix()
			Storage.get(saveKeys).then(function (values) {
				Storage.clear().then(function () {
					var restoreObj = {}
					angular.forEach(saveKeys, function (key, i) {
						var value = values[i]
						if (value !== false && value !== undefined) {
							restoreObj[key] = value
						}
					})
					Storage.noPrefix()
					return Storage.set(restoreObj)
				})
			})
		}

		function mtpGetNetworker (dcID, options) {
			options = options || {}

			var cache = (options.fileUpload || options.fileDownload)
				? cachedUploadNetworkers
				: cachedNetworkers
			if (!dcID) {
				throw new Exception('get Networker without dcID')
			}

			if (cache[dcID] !== undefined) {
				return qSync.when(cache[dcID])
			}

			var akk = 'dc' + dcID + '_auth_key'
			var ssk = 'dc' + dcID + '_server_salt'

			return Storage().get(akk, ssk).then(function (result) {
				if (cache[dcID] !== undefined) {
					return cache[dcID]
				}

				var authKeyHex = result[0]
				var serverSaltHex = result[1]
				// console.log('ass', dcID, authKeyHex, serverSaltHex)
				if (authKeyHex && authKeyHex.length == 512) {
					if (!serverSaltHex || serverSaltHex.length != 16) {
						serverSaltHex = 'AAAAAAAAAAAAAAAA'
					}
					var authKey = bytesFromHex(authKeyHex)
					var serverSalt = bytesFromHex(serverSaltHex)

					return cache[dcID] = MtpNetworkerFactory.getNetworker(dcID, authKey, serverSalt, options)
				}

				if (!options.createNetworker) {
					return $q.reject({type: 'AUTH_KEY_EMPTY', code: 401})
				}

				return MtpAuthorizer().auth(dcID).then(function (auth) {
					var storeObj = {}
					storeObj[akk] = bytesToHex(auth.authKey)
					storeObj[ssk] = bytesToHex(auth.serverSalt)
					Storage.set(storeObj)

					return cache[dcID] = MtpNetworkerFactory.getNetworker(dcID, auth.authKey, auth.serverSalt, options)
				}, function (error) {
					console.log('Get networker error', error, error.stack)
					return $q.reject(error)
				})
			})
		}

		function mtpInvokeApi (method, params, options) {
			options = options || {}

			let res, rej, promise = new Promise((_res, _rej) => {
				res = _res;
				rej = _rej;
			});

			var rejectPromise = function (error) {
					if (!error) {
						error = {type: 'ERROR_EMPTY'}
					// } else if (!angular.isObject(error)) {
					} else {
						error = {message: error}
					}
					
					rej(error);
					
					if (options.ignoreErrors) { return; }
					if (error.code == 406) { error.handled = true; }

					if (!options.noErrorBox) {
						error.input = method
						error.stack = stack || (error.originalError && error.originalError.stack) || error.stack || (new Error()).stack;
						setTimeout(function () {
							if (!error.handled) {
								if (error.code == 401) {
									mtpLogOut()['finally'](function () {
										if (location.protocol == 'http:' &&
											!Config.Modes.http &&
											Config.App.domains.indexOf(location.hostname) != -1) {
											// location.href = location.href.replace(/^http:/, 'https:')
											console.log(' SMTH strange goes HERE ');
										} else {
											// location.hash = '/login';
											// AppRuntimeManager.reload()
											console.log('we came to:', '/login');
										}
									})
								} else {
									// ErrorService.show({error: error})
									console.error( error );
								}
								error.handled = true
							}
						}, 100)
					}
				},
				dcID,
				networkerPromise;

			var cachedNetworker
			var stack = (new Error()).stack || 'empty stack'
			var performRequest = function (networker) {
				return (cachedNetworker = networker).wrapApiCall(method, params, options).then(
					function (result) {
						res(result);
					},
					function (error) {
						console.error(dT(), 'Error', error.code, error.type, baseDcID, dcID);
						if (error.code == 401 && baseDcID == dcID) {
							Storage().remove('dc', 'user_auth');
							// telegramMeNotify(false)
							rejectPromise(error);
						}
						else if (error.code == 401 && baseDcID && dcID != baseDcID) {
							if (cachedExportPromise[dcID] === undefined) {
								
								var exportDeferred = new Promise((exp_res, exp_rej) => {

									mtpInvokeApi('auth.exportAuthorization', {dc_id: dcID}, {noErrorBox: true}).then(function (exportedAuth) {
										mtpInvokeApi('auth.importAuthorization', {
											id: exportedAuth.id,
											bytes: exportedAuth.bytes
										}, {dcID: dcID, noErrorBox: true}).then(function () {
											exp_res();
										}, function (e) {
											exp_rej(e);
										})
									}, function (e) {
										exp_rej(e);
									})
								});

								cachedExportPromise[dcID] = exportDeferred;
							}

							cachedExportPromise[dcID].then(function () {
								(cachedNetworker = networker).wrapApiCall(method, params, options).then(function (result) {
									res(result);
								}, rejectPromise)
							}, rejectPromise)
						}
						else if (error.code == 303) {
							var newDcID = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2]
							if (newDcID != dcID) {
								if (options.dcID) {
									options.dcID = newDcID
								} else {
									Storage().set({dc: baseDcID = newDcID})
								}

								mtpGetNetworker(newDcID, options).then(function (networker) {
									networker.wrapApiCall(method, params, options).then(function (result) {
										res(result);
									}, rejectPromise)
								}, rejectPromise)
							}
						}
						else if (!options.rawError && error.code == 420) {
							var waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10
							if (waitTime > (options.timeout || 60)) {
								return rejectPromise(error)
							}
							setTimeout(function () {
								performRequest(cachedNetworker)
							}, waitTime * 1000)
						}
						else if (!options.rawError && (error.code == 500 || error.type == 'MSG_WAIT_FAILED')) {
							var now = tsNow()
							if (options.stopTime) {
								if (now >= options.stopTime) {
									return rejectPromise(error)
								}
							} else {
								options.stopTime = now + (options.timeout !== undefined ? options.timeout : 10) * 1000
							}
							options.waitTime = options.waitTime ? Math.min(60, options.waitTime * 1.5) : 1
							setTimeout(function () {
								performRequest(cachedNetworker)
							}, options.waitTime * 1000)
						} else {
							rejectPromise(error)
						}
					})
			}

			if (dcID = (options.dcID || baseDcID)) {
				mtpGetNetworker(dcID, options).then(performRequest, rejectPromise);
			} else {
				Storage.get('dc').then(function (baseDcID) {
					mtpGetNetworker(dcID = baseDcID || 2, options).then(performRequest, rejectPromise);
				})
			}

			return promise;
		}

		function mtpGetUserID () {
			return Storage().get('user_auth').then(function (auth) {
				telegramMeNotify(auth && auth.id > 0 || false)
				return auth.id || 0
			})
		}

		function getBaseDcID () {
			return baseDcID || false
		}

		return {
			getBaseDcID: getBaseDcID,
			getUserID: mtpGetUserID,
			invokeApi: mtpInvokeApi,
			getNetworker: mtpGetNetworker,
			setUserAuth: mtpSetUserAuth,
			logOut: mtpLogOut
		}
	};

	// .factory('MtpApiFileManager', function (MtpApiManager, $q, qSync, FileManager, IdbFileStorage, TmpfsFileStorage, MemoryFileStorage, WebpManager) {
	//   var cachedFs = false
	//   var cachedFsPromise = false
	//   var cachedSavePromises = {}
	//   var cachedDownloadPromises = {}
	//   var cachedDownloads = {}

	//   var downloadPulls = {}
	//   var downloadActives = {}

	//   function downloadRequest (dcID, cb, activeDelta) {
	//     if (downloadPulls[dcID] === undefined) {
	//       downloadPulls[dcID] = []
	//       downloadActives[dcID] = 0
	//     }
	//     var downloadPull = downloadPulls[dcID]
	//     var deferred = $q.defer()
	//     downloadPull.push({cb: cb, deferred: deferred, activeDelta: activeDelta})
	//     setZeroTimeout(function () {
	//       downloadCheck(dcID)
	//     })

	//     return deferred.promise
	//   }

	//   var index = 0

	//   function downloadCheck (dcID) {
	//     var downloadPull = downloadPulls[dcID]
	//     var downloadLimit = dcID == 'upload' ? 11 : 5

	//     if (downloadActives[dcID] >= downloadLimit || !downloadPull || !downloadPull.length) {
	//       return false
	//     }

	//     var data = downloadPull.shift()
	//     var activeDelta = data.activeDelta || 1

	//     downloadActives[dcID] += activeDelta

	//     var a = index++
	//     data.cb()
	//       .then(function (result) {
	//         downloadActives[dcID] -= activeDelta
	//         downloadCheck(dcID)

	//         data.deferred.resolve(result)
	//       }, function (error) {
	//         downloadActives[dcID] -= activeDelta
	//         downloadCheck(dcID)

	//         data.deferred.reject(error)
	//       })
	//   }

	//   function getFileName (location) {
	//     switch (location._) {
	//       case 'inputDocumentFileLocation':
	//         var fileName = (location.file_name || '').split('.', 2)
	//         var ext = fileName[1] || ''
	//         if (location.sticker && !WebpManager.isWebpSupported()) {
	//           ext += '.png'
	//         }
	//         var versionPart = location.version ? ('v' + location.version) : ''
	//         return fileName[0] + '_' + location.id + versionPart + '.' + ext

	//       default:
	//         if (!location.volume_id) {
	//           console.trace('Empty location', location)
	//         }
	//         var ext = 'jpg'
	//         if (location.sticker) {
	//           ext = WebpManager.isWebpSupported() ? 'webp' : 'png'
	//         }
	//         return location.volume_id + '_' + location.local_id + '_' + location.secret + '.' + ext
	//     }
	//   }

	//   function getTempFileName (file) {
	//     var size = file.size || -1
	//     var random = nextRandomInt(0xFFFFFFFF)
	//     return '_temp' + random + '_' + size
	//   }

	//   function getCachedFile (location) {
	//     if (!location) {
	//       return false
	//     }
	//     var fileName = getFileName(location)

	//     return cachedDownloads[fileName] || false
	//   }

	//   function getFileStorage () {
	//     if (!Config.Modes.memory_only) {
	//       if (TmpfsFileStorage.isAvailable()) {
	//         return TmpfsFileStorage
	//       }
	//       if (IdbFileStorage.isAvailable()) {
	//         return IdbFileStorage
	//       }
	//     }
	//     return MemoryFileStorage
	//   }

	//   function saveSmallFile (location, bytes) {
	//     var fileName = getFileName(location)
	//     var mimeType = 'image/jpeg'

	//     if (!cachedSavePromises[fileName]) {
	//       cachedSavePromises[fileName] = getFileStorage().saveFile(fileName, bytes).then(function (blob) {
	//         return cachedDownloads[fileName] = blob
	//       }, function (error) {
	//         delete cachedSavePromises[fileName]
	//       })
	//     }
	//     return cachedSavePromises[fileName]
	//   }

	//   function downloadSmallFile (location) {
	//     if (!FileManager.isAvailable()) {
	//       return $q.reject({type: 'BROWSER_BLOB_NOT_SUPPORTED'})
	//     }
	//     var fileName = getFileName(location)
	//     var mimeType = location.sticker ? 'image/webp' : 'image/jpeg'
	//     var cachedPromise = cachedSavePromises[fileName] || cachedDownloadPromises[fileName]

	//     if (cachedPromise) {
	//       return cachedPromise
	//     }

	//     var fileStorage = getFileStorage()

	//     return cachedDownloadPromises[fileName] = fileStorage.getFile(fileName).then(function (blob) {
	//       return cachedDownloads[fileName] = blob
	//     }, function () {
	//       var downloadPromise = downloadRequest(location.dc_id, function () {
	//         var inputLocation = location
	//         if (!inputLocation._ || inputLocation._ == 'fileLocation') {
	//           inputLocation = angular.extend({}, location, {_: 'inputFileLocation'})
	//         }
	//         // console.log('next small promise')
	//         return MtpApiManager.invokeApi('upload.getFile', {
	//           location: inputLocation,
	//           offset: 0,
	//           limit: 1024 * 1024
	//         }, {
	//           dcID: location.dc_id,
	//           fileDownload: true,
	//           createNetworker: true,
	//           noErrorBox: true
	//         })
	//       })

	//       var processDownloaded = function (bytes) {
	//         if (!location.sticker || WebpManager.isWebpSupported()) {
	//           return qSync.when(bytes)
	//         }
	//         return WebpManager.getPngBlobFromWebp(bytes)
	//       }

	//       return fileStorage.getFileWriter(fileName, mimeType).then(function (fileWriter) {
	//         return downloadPromise.then(function (result) {
	//           return processDownloaded(result.bytes).then(function (proccessedResult) {
	//             return FileManager.write(fileWriter, proccessedResult).then(function () {
	//               return cachedDownloads[fileName] = fileWriter.finalize()
	//             })
	//           })
	//         })
	//       })
	//     })
	//   }

	//   function getDownloadedFile (location, size) {
	//     var fileStorage = getFileStorage()
	//     var fileName = getFileName(location)

	//     return fileStorage.getFile(fileName, size)
	//   }

	//   function downloadFile (dcID, location, size, options) {
	//     if (!FileManager.isAvailable()) {
	//       return $q.reject({type: 'BROWSER_BLOB_NOT_SUPPORTED'})
	//     }

	//     options = options || {}

	//     var processSticker = false
	//     if (location.sticker && !WebpManager.isWebpSupported()) {
	//       if (options.toFileEntry || size > 524288) {
	//         delete location.sticker
	//       } else {
	//         processSticker = true
	//         options.mime = 'image/png'
	//       }
	//     }

	//     // console.log(dT(), 'Dload file', dcID, location, size)
	//     var fileName = getFileName(location)
	//     var toFileEntry = options.toFileEntry || null
	//     var cachedPromise = cachedSavePromises[fileName] || cachedDownloadPromises[fileName]

	//     var fileStorage = getFileStorage()

	//     // console.log(dT(), 'fs', fileStorage.name, fileName, cachedPromise)

	//     if (cachedPromise) {
	//       if (toFileEntry) {
	//         return cachedPromise.then(function (blob) {
	//           return FileManager.copy(blob, toFileEntry)
	//         })
	//       }
	//       return cachedPromise
	//     }

	//     var deferred = $q.defer()
	//     var canceled = false
	//     var resolved = false
	//     var mimeType = options.mime || 'image/jpeg',
	//       cacheFileWriter
	//     var errorHandler = function (error) {
	//       deferred.reject(error)
	//       errorHandler = angular.noop
	//       if (cacheFileWriter &&
	//         (!error || error.type != 'DOWNLOAD_CANCELED')) {
	//         cacheFileWriter.truncate(0)
	//       }
	//     }

	//     fileStorage.getFile(fileName, size).then(function (blob) {
	//       if (toFileEntry) {
	//         FileManager.copy(blob, toFileEntry).then(function () {
	//           deferred.resolve()
	//         }, errorHandler)
	//       } else {
	//         deferred.resolve(cachedDownloads[fileName] = blob)
	//       }
	//     }, function () {
	//       var fileWriterPromise = toFileEntry ? FileManager.getFileWriter(toFileEntry) : fileStorage.getFileWriter(fileName, mimeType)

	//       var processDownloaded = function (bytes) {
	//         if (!processSticker) {
	//           return qSync.when(bytes)
	//         }
	//         return WebpManager.getPngBlobFromWebp(bytes)
	//       }

	//       fileWriterPromise.then(function (fileWriter) {
	//         cacheFileWriter = fileWriter
	//         var limit = 524288,
	//           offset
	//         var startOffset = 0
	//         var writeFilePromise = $q.when(),
	//           writeFileDeferred
	//         if (fileWriter.length) {
	//           startOffset = fileWriter.length
	//           if (startOffset >= size) {
	//             if (toFileEntry) {
	//               deferred.resolve()
	//             } else {
	//               deferred.resolve(cachedDownloads[fileName] = fileWriter.finalize())
	//             }
	//             return
	//           }
	//           fileWriter.seek(startOffset)
	//           deferred.notify({done: startOffset, total: size})
	//         }
	//         for (offset = startOffset; offset < size; offset += limit) {
	//           writeFileDeferred = $q.defer()
	//           ;(function (isFinal, offset, writeFileDeferred, writeFilePromise) {
	//             return downloadRequest(dcID, function () {
	//               if (canceled) {
	//                 return $q.when()
	//               }
	//               return MtpApiManager.invokeApi('upload.getFile', {
	//                 location: location,
	//                 offset: offset,
	//                 limit: limit
	//               }, {
	//                 dcID: dcID,
	//                 fileDownload: true,
	//                 singleInRequest: window.safari !== undefined,
	//                 createNetworker: true
	//               })
	//             }, 2).then(function (result) {
	//               writeFilePromise.then(function () {
	//                 if (canceled) {
	//                   return $q.when()
	//                 }
	//                 return processDownloaded(result.bytes).then(function (processedResult) {
	//                   return FileManager.write(fileWriter, processedResult).then(function () {
	//                     writeFileDeferred.resolve()
	//                   }, errorHandler).then(function () {
	//                     if (isFinal) {
	//                       resolved = true
	//                       if (toFileEntry) {
	//                         deferred.resolve()
	//                       } else {
	//                         deferred.resolve(cachedDownloads[fileName] = fileWriter.finalize())
	//                       }
	//                     } else {
	//                       deferred.notify({done: offset + limit, total: size})
	//                     }
	//                   })
	//                 })
	//               })
	//             })
	//           })(offset + limit >= size, offset, writeFileDeferred, writeFilePromise)
	//           writeFilePromise = writeFileDeferred.promise
	//         }
	//       })
	//     })

	//     deferred.promise.cancel = function () {
	//       if (!canceled && !resolved) {
	//         canceled = true
	//         delete cachedDownloadPromises[fileName]
	//         errorHandler({type: 'DOWNLOAD_CANCELED'})
	//       }
	//     }

	//     if (!toFileEntry) {
	//       cachedDownloadPromises[fileName] = deferred.promise
	//     }

	//     return deferred.promise
	//   }

	//   function uploadFile (file) {
	//     var fileSize = file.size,
	//       isBigFile = fileSize >= 10485760,
	//       canceled = false,
	//       resolved = false,
	//       doneParts = 0,
	//       partSize = 262144, // 256 Kb
	//       activeDelta = 2

	//     if (fileSize > 67108864) {
	//       partSize = 524288
	//       activeDelta = 4
	//     }
	//     else if (fileSize < 102400) {
	//       partSize = 32768
	//       activeDelta = 1
	//     }
	//     var totalParts = Math.ceil(fileSize / partSize)

	//     if (totalParts > 3000) {
	//       return $q.reject({type: 'FILE_TOO_BIG'})
	//     }

	//     var fileID = [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)]
	//     var deferred = $q.defer()
	//     var errorHandler = function (error) {
	//         // console.error('Up Error', error)
	//         deferred.reject(error)
	//         canceled = true
	//         errorHandler = angular.noop
	//       },
	//       part = 0,
	//       offset,
	//       resultInputFile = {
	//         _: isBigFile ? 'inputFileBig' : 'inputFile',
	//         id: fileID,
	//         parts: totalParts,
	//         name: file.name,
	//         md5_checksum: ''
	//     }

	//     for (offset = 0; offset < fileSize; offset += partSize) {
	//       (function (offset, part) {
	//         downloadRequest('upload', function () {
	//           var uploadDeferred = $q.defer()

	//           var reader = new FileReader()
	//           var blob = file.slice(offset, offset + partSize)

	//           reader.onloadend = function (e) {
	//             if (canceled) {
	//               uploadDeferred.reject()
	//               return
	//             }
	//             if (e.target.readyState != FileReader.DONE) {
	//               return
	//             }
	//             MtpApiManager.invokeApi(isBigFile ? 'upload.saveBigFilePart' : 'upload.saveFilePart', {
	//               file_id: fileID,
	//               file_part: part,
	//               file_total_parts: totalParts,
	//               bytes: e.target.result
	//             }, {
	//               startMaxLength: partSize + 256,
	//               fileUpload: true,
	//               singleInRequest: true
	//             }).then(function (result) {
	//               doneParts++
	//               uploadDeferred.resolve()
	//               if (doneParts >= totalParts) {
	//                 deferred.resolve(resultInputFile)
	//                 resolved = true
	//               } else {
	//                 console.log(dT(), 'Progress', doneParts * partSize / fileSize)
	//                 deferred.notify({done: doneParts * partSize, total: fileSize})
	//               }
	//             }, errorHandler)
	//           }

	//           reader.readAsArrayBuffer(blob)

	//           return uploadDeferred.promise
	//         }, activeDelta)
	//       })(offset, part++)
	//     }

	//     deferred.promise.cancel = function () {
	//       console.log('cancel upload', canceled, resolved)
	//       if (!canceled && !resolved) {
	//         canceled = true
	//         errorHandler({type: 'UPLOAD_CANCELED'})
	//       }
	//     }

	//     return deferred.promise
	//   }

	//   return {
	//     getCachedFile: getCachedFile,
	//     getDownloadedFile: getDownloadedFile,
	//     downloadFile: downloadFile,
	//     downloadSmallFile: downloadSmallFile,
	//     saveSmallFile: saveSmallFile,
	//     uploadFile: uploadFile
	//   }
	// })