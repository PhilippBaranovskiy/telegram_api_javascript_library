/*!
 * Webogram v0.7.0 - messaging web application for MTProto
 * https://github.com/zhukov/webogram
 * Copyright (C) 2014 Igor Zhukov <igor.beatle@gmail.com>
 * https://github.com/zhukov/webogram/blob/master/LICENSE
 */

'use strict'

function getUserID() {
	MtpApiManager().getUserID().then(function (id) {
		if (id) {
		  // $location.url('/im')
		  console.info(`[ authorized with ${id} id ]`);
		  return;
		}
		// $location.url('/login')
		console.info('is going to:', '/login', '…');
		AppLoginController();
	})
};

// angular.module('myApp.controllers')

  function AppLoginController () {
  //   $modalStack.dismissAll()
  //   IdleManager.start()

  //   MtpApiManager.getUserID().then(function (id) {
  //     if (id) {
  //       $location.url('/im')
  //       return
  //     }
  //     if (location.protocol == 'http:' &&
  //       !Config.Modes.http &&
  //       Config.App.domains.indexOf(location.hostname) != -1) {
  //       location.href = location.href.replace(/^http:/, 'https:')
  //       return
  //     }
  //     TelegramMeWebService.setAuthorized(false)
  //     WebPushApiManager.forceUnsubscribe()
  //   })

    var options = {dcID: 2, createNetworker: true}
    var countryChanged = false
    var selectedCountry = false

    function initPhoneCountry () {

      MtpApiManager().invokeApi('help.getNearestDc',
      							{},
      							options)
      	.then(function (nearestDcResult) {
      		console.log( nearestDcResult );
			// MtpApiManager.getNetworker(nearestDcResult.nearest_dc, {createNetworker: true});
		})
    }

    initPhoneCountry();

  //   function selectPhoneCountryByIso2 (countryIso2) {
  //     if (countryIso2) {
  //       var i, country
  //       for (i = 0; i < Config.CountryCodes.length; i++) {
  //         country = Config.CountryCodes[i]
  //         if (country[0] == countryIso2) {
  //           return selectCountry({name: _(country[1] + '_raw'), code: country[2]})
  //         }
  //       }
  //     }
  //     return selectCountry({name: _('country_select_modal_country_us_raw'), code: '+1'})
  //   }

  //   function selectCountry (country) {
  //     selectedCountry = country
  //     if ($scope.credentials.phone_country != country.code) {
  //       $scope.credentials.phone_country = country.code
  //     } else {
  //       updateCountry()
  //     }
  //     $scope.$broadcast('country_selected')
  //     $scope.$broadcast('value_updated')
  //   }

  //   function updateCountry () {
  //     var phoneNumber = (
  //       ($scope.credentials.phone_country || '') +
  //       ($scope.credentials.phone_number || '')
  //         ).replace(/\D+/g, '')
  //     var i, j, code
  //     var maxLength = 0
  //     var maxName = false

  //     if (phoneNumber.length) {
  //       if (selectedCountry && !phoneNumber.indexOf(selectedCountry.code.replace(/\D+/g, ''))) {
  //         maxName = selectedCountry.name
  //       } else {
  //         for (i = 0; i < Config.CountryCodes.length; i++) {
  //           for (j = 2; j < Config.CountryCodes[i].length; j++) {
  //             code = Config.CountryCodes[i][j].replace(/\D+/g, '')
  //             if (code.length > maxLength && !phoneNumber.indexOf(code)) {
  //               maxLength = code.length
  //               maxName = _(Config.CountryCodes[i][1] + '_raw')
  //             }
  //           }
  //         }
  //       }
  //     }

  //     $scope.credentials.phone_full = phoneNumber
  //     $scope.credentials.phone_country_name = maxName || _('login_controller_unknown_country_raw')
  //   }

  //   $scope.$watch('credentials.phone_country', updateCountry)
  //   $scope.$watch('credentials.phone_number', updateCountry)
  //   initPhoneCountry()

  //   var nextTimeout
  //   var updatePasswordTimeout = false

  //   function saveAuth (result) {
  //     MtpApiManager.setUserAuth(options.dcID, {
  //       id: result.user.id
  //     })
  //     $timeout.cancel(nextTimeout)

  //     $location.url('/im')
  //   }

  //   $scope.sendCode = function () {
  //     $timeout.cancel(nextTimeout)

  //     var fullPhone = ($scope.credentials.phone_country || '') + ($scope.credentials.phone_number || '')
  //     var badPhone = !fullPhone.match(/^[\d\-+\s]+$/)
  //     if (!badPhone) {
  //       fullPhone = fullPhone.replace(/\D/g, '')
  //       if (fullPhone.length < 7) {
  //         badPhone = true
  //       }
  //     }
  //     if (badPhone) {
  //       $scope.progress.enabled = false
  //       $scope.error = {field: 'phone'}
  //       return
  //     }

  //     ErrorService.confirm({
  //       type: 'LOGIN_PHONE_CORRECT',
  //       country_code: $scope.credentials.phone_country,
  //       phone_number: $scope.credentials.phone_number
  //     }).then(function () {
  //       $scope.progress.enabled = true

  //       onContentLoaded(function () {
  //         $scope.$broadcast('ui_height')
  //       })

  //       var authKeyStarted = tsNow()
  //       MtpApiManager.invokeApi('auth.sendCode', {
  //         flags: 0,
  //         phone_number: $scope.credentials.phone_full,
  //         api_id: Config.App.id,
  //         api_hash: Config.App.hash,
  //         lang_code: navigator.language || 'en'
  //       }, options).then(function (sentCode) {
  //         $scope.progress.enabled = false

  //         $scope.error = {}
  //         $scope.about = {}
  //         $scope.credentials.phone_code_hash = sentCode.phone_code_hash
  //         applySentCode(sentCode)
  //       }, function (error) {
  //         $scope.progress.enabled = false
  //         console.log('sendCode error', error)
  //         switch (error.type) {
  //           case 'PHONE_NUMBER_INVALID':
  //             $scope.error = {field: 'phone'}
  //             error.handled = true
  //             break

  //           case 'PHONE_NUMBER_APP_SIGNUP_FORBIDDEN':
  //             $scope.error = {field: 'phone'}
  //             break
  //         }
  //       })['finally'](function () {
  //         if ($rootScope.idle.isIDLE || tsNow() - authKeyStarted > 60000) {
  //           NotificationsManager.notify({
  //             title: 'Telegram',
  //             message: 'Your authorization key was successfully generated! Open the app to log in.',
  //             tag: 'auth_key'
  //           })
  //         }
  //       })
  //     })
  //   }

  //   function applySentCode (sentCode) {
  //     $scope.credentials.type = sentCode.type
  //     $scope.nextPending.type = sentCode.next_type || false
  //     $scope.nextPending.remaining = sentCode.timeout || false
  //     delete $scope.nextPending.progress

  //     nextTimeoutCheck()

  //     onContentLoaded(function () {
  //       $scope.$broadcast('ui_height')
  //     })
  //   }

  //   $scope.sendNext = function () {
  //     if (!$scope.nextPending.type ||
  //       $scope.nextPending.remaining > 0) {
  //       return
  //     }
  //     $scope.nextPending.progress = true
  //     MtpApiManager.invokeApi('auth.resendCode', {
  //       phone_number: $scope.credentials.phone_full,
  //       phone_code_hash: $scope.credentials.phone_code_hash
  //     }, options).then(applySentCode)
  //   }

  //   function nextTimeoutCheck () {
  //     $timeout.cancel(nextTimeout)
  //     if (!$scope.nextPending.type ||
  //       $scope.nextPending.remaining === false) {
  //       return
  //     }
  //     if ((--$scope.nextPending.remaining) > 0) {
  //       nextTimeout = $timeout(nextTimeoutCheck, 1000)
  //     }
  //   }

  //   $scope.editPhone = function () {
  //     $timeout.cancel(nextTimeout)

  //     if ($scope.credentials.phone_full &&
  //       $scope.credentials.phone_code_hash) {
  //       MtpApiManager.invokeApi('auth.cancelCode', {
  //         phone_number: $scope.credentials.phone_full,
  //         phone_code_hash: $scope.credentials.phone_code_hash
  //       }, options)
  //     }

  //     delete $scope.credentials.phone_code_hash
  //     delete $scope.credentials.phone_unoccupied
  //     delete $scope.credentials.phone_code_valid
  //     delete $scope.nextPending.remaining
  //   }

  //   $scope.$watch('credentials.phone_code', function (newVal) {
  //     if (newVal &&
  //       newVal.match(/^\d+$/) &&
  //       $scope.credentials.type &&
  //       $scope.credentials.type.length &&
  //       newVal.length == $scope.credentials.type.length) {
  //       $scope.logIn()
  //     }
  //   })

  //   $scope.logIn = function (forceSignUp) {
  //     if ($scope.progress.enabled &&
  //         $scope.progress.forceSignUp == forceSignUp) {
  //       return
  //     }
  //     var method = 'auth.signIn'
  //     var params = {
  //       phone_number: $scope.credentials.phone_full,
  //       phone_code_hash: $scope.credentials.phone_code_hash,
  //       phone_code: $scope.credentials.phone_code
  //     }
  //     if (forceSignUp) {
  //       method = 'auth.signUp'
  //       angular.extend(params, {
  //         first_name: $scope.credentials.first_name || '',
  //         last_name: $scope.credentials.last_name || ''
  //       })
  //     }

  //     $scope.progress.forceSignUp = forceSignUp
  //     $scope.progress.enabled = true
  //     MtpApiManager.invokeApi(method, params, options).then(saveAuth, function (error) {
  //       $scope.progress.enabled = false
  //       if (error.code == 400 && error.type == 'PHONE_NUMBER_UNOCCUPIED') {
  //         error.handled = true
  //         $scope.credentials.phone_code_valid = true
  //         $scope.credentials.phone_unoccupied = true
  //         $scope.about = {}
  //         return
  //       } else if (error.code == 400 && error.type == 'PHONE_NUMBER_OCCUPIED') {
  //         error.handled = true
  //         return $scope.logIn(false)
  //       } else if (error.code == 401 && error.type == 'SESSION_PASSWORD_NEEDED') {
  //         $scope.progress.enabled = true
  //         updatePasswordState().then(function () {
  //           $scope.progress.enabled = false
  //           $scope.credentials.phone_code_valid = true
  //           $scope.credentials.password_needed = true
  //           $scope.about = {}
  //         })
  //         error.handled = true
  //         return
  //       }

  //       switch (error.type) {
  //         case 'FIRSTNAME_INVALID':
  //           $scope.error = {field: 'first_name'}
  //           error.handled = true
  //           break
  //         case 'LASTNAME_INVALID':
  //           $scope.error = {field: 'last_name'}
  //           error.handled = true
  //           break
  //         case 'PHONE_CODE_INVALID':
  //           $scope.error = {field: 'phone_code'}
  //           delete $scope.credentials.phone_code_valid
  //           error.handled = true
  //           break
  //         case 'PHONE_CODE_EXPIRED':
  //           $scope.editPhone()
  //           error.handled = true
  //           break
  //       }
  //     })
  //   }

  //   $scope.checkPassword = function () {
  //     $scope.progress.enabled = true
  //     return PasswordManager.check($scope.password, $scope.credentials.password, options).then(saveAuth, function (error) {
  //       $scope.progress.enabled = false
  //       switch (error.type) {
  //         case 'PASSWORD_HASH_INVALID':
  //           $scope.error = {field: 'password'}
  //           error.handled = true
  //           break
  //       }
  //     })
  //   }

  //   $scope.forgotPassword = function (event) {
  //     PasswordManager.requestRecovery($scope.password, options).then(function (emailRecovery) {
  //       var scope = $rootScope.$new()
  //       scope.recovery = emailRecovery
  //       scope.options = options
  //       var modal = $modal.open({
  //         scope: scope,
  //         templateUrl: templateUrl('password_recovery_modal'),
  //         controller: 'PasswordRecoveryModalController',
  //         windowClass: 'md_simple_modal_window mobile_modal'
  //       })

  //       modal.result.then(function (result) {
  //         if (result && result.user) {
  //           saveAuth(result)
  //         } else {
  //           $scope.canReset = true
  //         }
  //       })
  //     }, function (error) {
  //       switch (error.type) {
  //         case 'PASSWORD_EMPTY':
  //           $scope.logIn()
  //           error.handled = true
  //           break
  //         case 'PASSWORD_RECOVERY_NA':
  //           $timeout(function () {
  //             $scope.canReset = true
  //           }, 1000)
  //           error.handled = true
  //           break
  //       }
  //     })

  //     return cancelEvent(event)
  //   }

  //   $scope.resetAccount = function () {
  //     ErrorService.confirm({
  //       type: 'RESET_ACCOUNT'
  //     }).then(function () {
  //       $scope.progress.enabled = true
  //       MtpApiManager.invokeApi('account.deleteAccount', {
  //         reason: 'Forgot password'
  //       }, options).then(function () {
  //         delete $scope.progress.enabled
  //         delete $scope.credentials.password_needed
  //         $scope.credentials.phone_unoccupied = true
  //       }, function (error) {
  //         if (error.type &&
  //                  error.type.substr(0, 17) == '2FA_CONFIRM_WAIT_') {
  //           error.waitTime = error.type.substr(17)
  //           error.type = '2FA_CONFIRM_WAIT_TIME'
  //         }

  //         delete $scope.progress.enabled
  //       })
  //     })
  //   }

  //   function updatePasswordState () {
  //     // $timeout.cancel(updatePasswordTimeout)
  //     // updatePasswordTimeout = false
  //     return PasswordManager.getState(options).then(function (result) {
  //       return $scope.password = result
  //     // if (result._ == 'account.noPassword' && result.email_unconfirmed_pattern) {
  //     //   updatePasswordTimeout = $timeout(updatePasswordState, 5000)
  //     // }
  //     })
  //   }

  //   ChangelogNotifyService.checkUpdate()
  //   LayoutSwitchService.start()
  }

  // .controller('AppIMController', function ($q, qSync, $scope, $location, $routeParams, $modal, $rootScope, $modalStack, MtpApiManager, AppUsersManager, AppChatsManager, AppMessagesManager, AppPeersManager, ContactsSelectService, ChangelogNotifyService, ErrorService, AppRuntimeManager, HttpsMigrateService, LayoutSwitchService, LocationParamsService, AppStickersManager) {
  //   $scope.$on('$routeUpdate', updateCurDialog)

  //   var pendingParams = false
  //   var pendingAttachment = false
  //   $scope.$on('history_focus', function (e, peerData) {
  //     if (peerData.peerString == $scope.curDialog.peer &&
  //         (peerData.messageID ? peerData.messageID == $scope.curDialog.messageID : !$scope.curDialog.messageID) &&
  //         !peerData.startParam &&
  //         !peerData.attachment) {
  //       if (peerData.messageID) {
  //         $scope.$broadcast('ui_history_change_scroll', true)
  //       } else {
  //         $scope.$broadcast('ui_history_focus')
  //       }
  //       $modalStack.dismissAll()
  //     } else {
  //       var peerID = AppPeersManager.getPeerID(peerData.peerString)
  //       var username = AppPeersManager.getPeer(peerID).username
  //       var peer = username ? '@' + username : peerData.peerString
  //       if (peerData.messageID || peerData.startParam) {
  //         pendingParams = {
  //           messageID: peerData.messageID,
  //           startParam: peerData.startParam
  //         }
  //       } else {
  //         pendingParams = false
  //       }
  //       if (peerData.attachment) {
  //         pendingAttachment = peerData.attachment
  //       }
  //       if ($routeParams.p != peer) {
  //         $location.url('/im?p=' + peer)
  //       } else {
  //         updateCurDialog()
  //       }
  //     }
  //   })

  //   $scope.$on('esc_no_more', function () {
  //     $rootScope.$apply(function () {
  //       $location.url('/im')
  //     })
  //   })

  //   $scope.isLoggedIn = true
  //   $scope.isEmpty = {}
  //   $scope.search = {}
  //   $scope.historyFilter = {mediaType: false}
  //   $scope.historyPeer = {}
  //   $scope.historyState = {
  //     selectActions: false,
  //     botActions: false,
  //     channelActions: false,
  //     canReply: false,
  //     canDelete: false,
  //     canEdit: false,
  //     actions: function () {
  //       return $scope.historyState.selectActions ? 'selected' : ($scope.historyState.botActions ? 'bot' : ($scope.historyState.channelActions ? 'channel' : false))
  //     },
  //     typing: [],
  //     missedCount: 0,
  //     skipped: false
  //   }

  //   $scope.openSettings = function () {
  //     $modal.open({
  //       templateUrl: templateUrl('settings_modal'),
  //       controller: 'SettingsModalController',
  //       windowClass: 'settings_modal_window mobile_modal',
  //       backdrop: 'single'
  //     })
  //   }

  //   $scope.isHistoryPeerGroup = function () {
  //     return $scope.historyPeer.id < 0 && !AppPeersManager.isBroadcast($scope.historyPeer.id)
  //   }

  //   // setTimeout($scope.openSettings, 1000)

  //   $scope.openFaq = function () {
  //     var url = 'https://telegram.org/faq'
  //     switch (Config.I18n.locale) {
  //       case 'es-es':
  //         url += '/es'
  //         break
  //       case 'it-it':
  //         url += '/it'
  //         break
  //       case 'de-de':
  //         url += '/de'
  //         break
  //       case 'ko-ko':
  //         url += '/ko'
  //         break
  //       case 'pt-br':
  //         url += '/br'
  //         break
  //     }
  //     var popup = window.open(url, '_blank')
  //     try {
  //       popup.opener = null;
  //     } catch (e) {}
  //   }

  //   $scope.openContacts = function () {
  //     ContactsSelectService.selectContact().then(function (userID) {
  //       $scope.dialogSelect(AppUsersManager.getUserString(userID))
  //     })
  //   }

  //   $scope.openGroup = function () {
  //     ContactsSelectService.selectContacts({action: 'new_group'}).then(function (userIDs) {
  //       if (userIDs && 
  //           userIDs.length) {
  //         var scope = $rootScope.$new()
  //         scope.userIDs = userIDs

  //         $modal.open({
  //           templateUrl: templateUrl('chat_create_modal'),
  //           controller: 'ChatCreateModalController',
  //           scope: scope,
  //           windowClass: 'md_simple_modal_window mobile_modal',
  //           backdrop: 'single'
  //         })
  //       }
  //     })
  //   }

  //   $scope.importContact = function () {
  //     AppUsersManager.openImportContact().then(function (foundContact) {
  //       if (foundContact) {
  //         $rootScope.$broadcast('history_focus', {
  //           peerString: AppUsersManager.getUserString(foundContact)
  //         })
  //       }
  //     })
  //   }

  //   $scope.searchClear = function () {
  //     $scope.search.query = ''
  //     $scope.$broadcast('search_clear')
  //   }

  //   $scope.dialogSelect = function (peerString, messageID) {
  //     var params = {peerString: peerString}
  //     if (messageID) {
  //       params.messageID = messageID
  //     } else if ($scope.search.query) {
  //       $scope.searchClear()
  //     }
  //     var peerID = AppPeersManager.getPeerID(peerString)
  //     var converted = AppMessagesManager.convertMigratedPeer(peerID)
  //     if (converted) {
  //       params.peerString = AppPeersManager.getPeerString(converted)
  //     }
  //     $rootScope.$broadcast('history_focus', params)
  //   }

  //   $scope.logOut = function () {
  //     ErrorService.confirm({type: 'LOGOUT'}).then(function () {
  //       MtpApiManager.logOut().then(function () {
  //         location.hash = '/login'
  //         AppRuntimeManager.reload()
  //       })
  //     })
  //   }

  //   $scope.openChangelog = function () {
  //     ChangelogNotifyService.showChangelog(false)
  //   }

  //   $scope.showPeerInfo = function () {
  //     if ($scope.curDialog.peerID > 0) {
  //       AppUsersManager.openUser($scope.curDialog.peerID)
  //     } else if ($scope.curDialog.peerID < 0) {
  //       AppChatsManager.openChat(-$scope.curDialog.peerID)
  //     }
  //   }

  //   $scope.toggleEdit = function () {
  //     $scope.$broadcast('history_edit_toggle')
  //   }
  //   $scope.selectedFlush = function () {
  //     $scope.$broadcast('history_edit_flush')
  //   }
  //   $scope.toggleMedia = function (mediaType) {
  //     $scope.$broadcast('history_media_toggle', mediaType)
  //   }
  //   $scope.returnToRecent = function () {
  //     $scope.$broadcast('history_return_recent')
  //   }
  //   $scope.toggleSearch = function () {
  //     $scope.$broadcast('dialogs_search_toggle')
  //   }

  //   updateCurDialog()

  //   function updateCurDialog () {
  //     $modalStack.dismissAll()
  //     var addParams = pendingParams || {}
  //     pendingParams = false
  //     addParams.messageID = parseInt(addParams.messageID) || false
  //     addParams.startParam = addParams.startParam

  //     var peerStringPromise
  //     if ($routeParams.p && $routeParams.p.charAt(0) == '@') {
  //       if ($scope.curDialog === undefined) {
  //         $scope.curDialog = {
  //           peer: '',
  //           peerID: 0
  //         }
  //       }
  //       peerStringPromise = AppPeersManager.resolveUsername($routeParams.p.substr(1)).then(function (peerID) {
  //         return qSync.when(AppPeersManager.getPeerString(peerID))
  //       })
  //     } else {
  //       peerStringPromise = qSync.when($routeParams.p)
  //     }
  //     peerStringPromise.then(function (peerString) {
  //       $scope.curDialog = angular.extend({
  //         peer: peerString,
  //         peerID: AppPeersManager.getPeerID(peerString || '')
  //       }, addParams)
  //       if (pendingAttachment) {
  //         $scope.$broadcast('peer_draft_attachment', pendingAttachment)
  //         pendingAttachment = false
  //       }
  //     })
  //   }

  //   ChangelogNotifyService.checkUpdate()
  //   HttpsMigrateService.start()
  //   LayoutSwitchService.start()
  //   LocationParamsService.start()
  //   AppStickersManager.start()
  // })

  // .controller('AppImDialogsController', function ($scope, $location, $q, $timeout, $routeParams, MtpApiManager, AppUsersManager, AppChatsManager, AppMessagesManager, AppProfileManager, AppPeersManager, PhonebookContactsService, ErrorService, AppRuntimeManager) {
  //   $scope.dialogs = []
  //   $scope.myResults = []
  //   $scope.foundPeers = []
  //   $scope.foundMessages = []

  //   if ($scope.search === undefined) {
  //     $scope.search = {}
  //   }
  //   if ($scope.isEmpty === undefined) {
  //     $scope.isEmpty = {}
  //   }
  //   $scope.phonebookAvailable = PhonebookContactsService.isAvailable()

  //   var searchMessages = false
  //   var offsetIndex = 0
  //   var maxID = 0
  //   var hasMore = false
  //   var jump = 0
  //   var contactsJump = 0
  //   var peersInDialogs = {}
  //   var typingTimeouts = {}
  //   var contactsShown

  //   $scope.$on('dialogs_need_more', function () {
  //     // console.log('on need more')
  //     showMoreDialogs()
  //   })

  //   $scope.$on('dialog_unread', function (e, dialog) {
  //     angular.forEach($scope.dialogs, function (curDialog) {
  //       if (curDialog.peerID == dialog.peerID) {
  //         curDialog.unreadCount = dialog.count
  //       }
  //     })
  //   })

  //   $scope.$on('history_search', function (e, peerID) {
  //     $scope.setSearchPeer(peerID)
  //   })

  //   $scope.$on('esc_no_more', function () {
  //     $scope.setSearchPeer(false)
  //   })

  //   $scope.$on('dialogs_multiupdate', function (e, dialogsUpdated) {
  //     if (searchMessages) {
  //       return false
  //     }
  //     if ($scope.search.query !== undefined &&
  //         $scope.search.query.length) {
  //       return false
  //     }

  //     var i
  //     var dialog
  //     var newPeer = false
  //     var len = $scope.dialogs.length
  //     for (i = 0; i < len; i++) {
  //       dialog = $scope.dialogs[i]
  //       if (dialogsUpdated[dialog.peerID]) {
  //         $scope.dialogs.splice(i, 1)
  //         i--
  //         len--
  //         AppMessagesManager.clearDialogCache(dialog.mid)
  //       }
  //     }

  //     angular.forEach(dialogsUpdated, function (dialog, peerID) {
  //       if ($scope.noUsers && peerID > 0) {
  //         return
  //       }
  //       if (!peersInDialogs[peerID]) {
  //         peersInDialogs[peerID] = true
  //         newPeer = true
  //       }
  //       $scope.dialogs.unshift(
  //         AppMessagesManager.wrapForDialog(dialog.top_message, dialog)
  //       )
  //     })

  //     sortDialogs()

  //     if (newPeer) {
  //       delete $scope.isEmpty.dialogs
  //       if (contactsShown) {
  //         showMoreConversations()
  //       }
  //     }
  //   })

  //   function deleteDialog (peerID) {
  //     for (var i = 0; i < $scope.dialogs.length; i++) {
  //       if ($scope.dialogs[i].peerID == peerID) {
  //         $scope.dialogs.splice(i, 1)
  //         break
  //       }
  //     }
  //   }

  //   function sortDialogs () {
  //     var myID = false
  //     if ($scope.forPeerSelect) {
  //       myID = AppUsersManager.getSelf().id
  //     }
  //     $scope.dialogs.sort(function (d1, d2) {
  //       if (d1.peerID == myID) {
  //         return -1
  //       }
  //       else if (d2.peerID == myID) {
  //         return 1
  //       }
  //       return d2.index - d1.index
  //     })
  //   }

  //   $scope.$on('dialog_top', function (e, dialog) {
  //     var curDialog, i, wrappedDialog
  //     var len = $scope.dialogs.length
  //     for (i = 0; i < len; i++) {
  //       curDialog = $scope.dialogs[i]
  //       if (curDialog.peerID == dialog.peerID) {
  //         wrappedDialog = AppMessagesManager.wrapForDialog(dialog.top_message, dialog)
  //         $scope.dialogs.splice(i, 1, wrappedDialog)
  //         break
  //       }
  //     }
  //     sortDialogs()
  //     if (wrappedDialog == $scope.dialogs[len - 1]) {
  //       $scope.dialogs.splice(len - 1, 1)
  //     }
  //   })
  //   $scope.$on('dialog_flush', function (e, update) {
  //     var curDialog, i
  //     for (i = 0; i < $scope.dialogs.length; i++) {
  //       curDialog = $scope.dialogs[i]
  //       if (curDialog.peerID == update.peerID) {
  //         curDialog.deleted = true
  //         break
  //       }
  //     }
  //   })
  //   $scope.$on('dialog_drop', function (e, dialog) {
  //     deleteDialog(dialog.peerID)
  //   })

  //   $scope.$on('dialog_draft', function (e, draftUpdate) {
  //     var curDialog, i
  //     for (i = 0; i < $scope.dialogs.length; i++) {
  //       curDialog = $scope.dialogs[i]
  //       if (curDialog.peerID == draftUpdate.peerID) {
  //         curDialog.draft = draftUpdate.draft
  //         if (draftUpdate.index) {
  //           curDialog.index = draftUpdate.index
  //         }
  //         sortDialogs()
  //         break
  //       }
  //     }
  //   })

  //   $scope.$on('history_delete', function (e, historyUpdate) {
  //     for (var i = 0; i < $scope.dialogs.length; i++) {
  //       if ($scope.dialogs[i].peerID == historyUpdate.peerID) {
  //         if (historyUpdate.msgs[$scope.dialogs[i].mid]) {
  //           $scope.dialogs[i].deleted = true
  //         }
  //         break
  //       }
  //     }
  //   })

  //   $scope.$on('apiUpdate', function (e, update) {
  //     switch (update._) {
  //       case 'updateUserTyping':
  //       case 'updateChatUserTyping':
  //         if (!AppUsersManager.hasUser(update.user_id)) {
  //           if (update.chat_id &&
  //             AppChatsManager.hasChat(update.chat_id) &&
  //             !AppChatsManager.isChannel(update.chat_id)) {
  //             AppProfileManager.getChatFull(update.chat_id)
  //           }
  //           return
  //         }
  //         var peerID = update._ == 'updateUserTyping' ? update.user_id : -update.chat_id
  //         AppUsersManager.forceUserOnline(update.user_id)
  //         for (var i = 0; i < $scope.dialogs.length; i++) {
  //           if ($scope.dialogs[i].peerID == peerID) {
  //             $scope.dialogs[i].typing = update.user_id
  //             $timeout.cancel(typingTimeouts[peerID])

  //             typingTimeouts[peerID] = $timeout(function () {
  //               for (var i = 0; i < $scope.dialogs.length; i++) {
  //                 if ($scope.dialogs[i].peerID == peerID) {
  //                   if ($scope.dialogs[i].typing == update.user_id) {
  //                     delete $scope.dialogs[i].typing
  //                   }
  //                 }
  //               }
  //             }, 6000)
  //             break
  //           }
  //         }
  //         break
  //     }
  //   })

  //   $scope.$watchCollection('search', function () {
  //     $scope.dialogs = []
  //     $scope.foundMessages = []
  //     searchMessages = !!$scope.searchPeer
  //     contactsJump++
  //     loadDialogs()
  //   })

  //   if (Config.Mobile) {
  //     $scope.$watch('curDialog.peer', function () {
  //       $scope.$broadcast('ui_dialogs_update')
  //     })
  //   }

  //   $scope.importPhonebook = function () {
  //     PhonebookContactsService.openPhonebookImport()
  //   }

  //   $scope.setSearchPeer = function (peerID) {
  //     $scope.searchPeer = peerID || false
  //     $scope.searchClear()
  //     if (peerID) {
  //       $scope.dialogs = []
  //       $scope.foundPeers = []
  //       searchMessages = true
  //       $scope.toggleSearch()
  //     } else {
  //       searchMessages = false
  //     }
  //     loadDialogs(true)
  //   }

  //   $scope.$on('contacts_update', function () {
  //     if (contactsShown) {
  //       showMoreConversations()
  //     }
  //   })

  //   $scope.$on('ui_dialogs_search_clear', $scope.searchClear)

  //   if (!$scope.noMessages) {
  //     $scope.$on('dialogs_search', function (e, data) {
  //       $scope.search.query = data.query || ''
  //       $scope.toggleSearch()
  //     })
  //   }

  //   var searchTimeoutPromise
  //   function getDialogs (force) {
  //     var curJump = ++jump

  //     $timeout.cancel(searchTimeoutPromise)

  //     if (searchMessages) {
  //       searchTimeoutPromise = (force || maxID) ? $q.when() : $timeout(angular.noop, 500)
  //       return searchTimeoutPromise.then(function () {
  //         var searchPeerID = $scope.searchPeer || false
  //         return AppMessagesManager.getSearch(searchPeerID, $scope.search.query, {_: 'inputMessagesFilterEmpty'}, maxID).then(function (result) {
  //           if (curJump != jump) {
  //             return $q.reject()
  //           }
  //           var dialogs = []
  //           angular.forEach(result.history, function (messageID) {
  //             var message = AppMessagesManager.getMessage(messageID)
  //             var peerID = AppMessagesManager.getMessagePeer(message)

  //             dialogs.push({
  //               peerID: peerID,
  //               top_message: messageID,
  //               unread_count: -1
  //             })
  //           })

  //           return {
  //             dialogs: dialogs
  //           }
  //         })
  //       })
  //     }

  //     var query = $scope.search.query || ''
  //     if ($scope.noUsers) {
  //       query = '%pg ' + query
  //     }
  //     return AppMessagesManager.getConversations(query, offsetIndex).then(function (result) {
  //       if (curJump != jump) {
  //         return $q.reject()
  //       }
  //       if (!query && !offsetIndex && $scope.forPeerSelect) {
  //         var myID = AppUsersManager.getSelf().id
  //         return AppMessagesManager.getConversation(myID).then(function (dialog) {
  //           result.dialogs.unshift(dialog)
  //           return result
  //         })
  //       }
  //       return result
  //     })
  //   }

  //   function loadDialogs (force) {
  //     offsetIndex = 0
  //     maxID = 0
  //     hasMore = false
  //     if (!searchMessages) {
  //       peersInDialogs = {}
  //       contactsShown = false
  //     }

  //     getDialogs(force).then(function (dialogsResult) {
  //       if (!searchMessages) {
  //         $scope.dialogs = []
  //         $scope.myResults = []
  //         $scope.foundPeers = []
  //       }
  //       $scope.foundMessages = []

  //       var dialogsList = searchMessages ? $scope.foundMessages : $scope.dialogs

  //       if (dialogsResult.dialogs.length) {
  //         angular.forEach(dialogsResult.dialogs, function (dialog) {
  //           if ($scope.canSend &&
  //               AppPeersManager.isChannel(dialog.peerID) &&
  //               !AppChatsManager.hasRights(-dialog.peerID, 'send')) {
  //             return
  //           }
  //           var wrapDialog = searchMessages ? undefined : dialog
  //           var wrappedDialog = AppMessagesManager.wrapForDialog(dialog.top_message, wrapDialog)

  //           if (searchMessages &&
  //               $scope.searchPeer) {
  //             var message = AppMessagesManager.getMessage(dialog.top_message)
  //             if (message.fromID > 0) {
  //               wrappedDialog.peerID = message.fromID
  //               wrappedDialog.foundInHistory = true
  //             }
  //           }

  //           if (searchMessages) {
  //             wrappedDialog.unreadCount = -1
  //           } else {
  //             if (peersInDialogs[dialog.peerID]) {
  //               return
  //             } else {
  //               peersInDialogs[dialog.peerID] = true
  //             }
  //           }
  //           dialogsList.push(wrappedDialog)
  //         })

  //         if (searchMessages) {
  //           maxID = dialogsResult.dialogs[dialogsResult.dialogs.length - 1].top_message
  //         } else {
  //           offsetIndex = dialogsResult.dialogs[dialogsResult.dialogs.length - 1].index
  //           delete $scope.isEmpty.dialogs
  //         }
  //         hasMore = true
  //       } else {
  //         hasMore = false
  //       }

  //       $scope.$broadcast('ui_dialogs_change')

  //       if (!$scope.search.query) {
  //         AppMessagesManager.getConversations('', offsetIndex, 100)
  //         if (!dialogsResult.dialogs.length) {
  //           $scope.isEmpty.dialogs = true
  //           showMoreDialogs()
  //         }
  //       } else {
  //         showMoreDialogs()
  //       }
  //     })
  //   }

  //   function showMoreDialogs () {
  //     if (contactsShown && (!hasMore || (!offsetIndex && !maxID))) {
  //       return
  //     }

  //     if (!hasMore &&
  //       !searchMessages &&
  //       !$scope.noUsers &&
  //       ($scope.search.query || !$scope.dialogs.length)) {
  //       showMoreConversations()
  //       return
  //     }

  //     getDialogs().then(function (dialogsResult) {
  //       if (dialogsResult.dialogs.length) {
  //         var dialogsList = searchMessages ? $scope.foundMessages : $scope.dialogs

  //         angular.forEach(dialogsResult.dialogs, function (dialog) {
  //           if ($scope.canSend &&
  //               AppPeersManager.isChannel(dialog.peerID) &&
  //               !AppChatsManager.hasRights(-dialog.peerID, 'send')) {
  //             return
  //           }
  //           var wrapDialog = searchMessages ? undefined : dialog
  //           var wrappedDialog = AppMessagesManager.wrapForDialog(dialog.top_message, wrapDialog)

  //           if (searchMessages) {
  //             wrappedDialog.unreadCount = -1
  //           } else {
  //             if (peersInDialogs[dialog.peerID]) {
  //               return
  //             } else {
  //               peersInDialogs[dialog.peerID] = true
  //             }
  //           }

  //           if (searchMessages &&
  //               $scope.searchPeer) {
  //             var message = AppMessagesManager.getMessage(dialog.top_message)
  //             if (message.fromID > 0) {
  //               wrappedDialog.peerID = message.fromID
  //             }
  //           }

  //           dialogsList.push(wrappedDialog)
  //         })

  //         if (searchMessages) {
  //           maxID = dialogsResult.dialogs[dialogsResult.dialogs.length - 1].top_message
  //         } else {
  //           offsetIndex = dialogsResult.dialogs[dialogsResult.dialogs.length - 1].index
  //         }

  //         $scope.$broadcast('ui_dialogs_append')

  //         hasMore = true
  //       } else {
  //         hasMore = false
  //       }
  //     })
  //   }

  //   function showMoreConversations () {
  //     contactsShown = true

  //     var curJump = ++contactsJump
  //     AppUsersManager.getContacts($scope.search.query).then(function (contactsList) {
  //       if (curJump != contactsJump) return
  //       $scope.myResults = []
  //       angular.forEach(contactsList, function (userID) {
  //         if (peersInDialogs[userID] === undefined) {
  //           $scope.myResults.push({
  //             id: userID,
  //             peerString: AppUsersManager.getUserString(userID)
  //           })
  //         }
  //       })

  //       if (contactsList.length) {
  //         delete $scope.isEmpty.contacts
  //       } else if (!$scope.search.query) {
  //         $scope.isEmpty.contacts = true
  //       }
  //       $scope.$broadcast('ui_dialogs_append')
  //     })

  //     if ($scope.search.query && $scope.search.query.length >= 2) {
  //       $timeout(function () {
  //         if (curJump != contactsJump) return
  //         MtpApiManager.invokeApi('contacts.search', {q: $scope.search.query, limit: 10}).then(function (result) {
  //           AppUsersManager.saveApiUsers(result.users)
  //           AppChatsManager.saveApiChats(result.chats)
  //           if (curJump != contactsJump) return
  //           var alreadyPeers = []
  //           angular.forEach($scope.myResults, function (peerFound) {
  //             alreadyPeers.push(peerFound.id)
  //           })
  //           angular.forEach(result.my_results, function (peerFound) {
  //             var peerID = AppPeersManager.getPeerID(peerFound)
  //             if (peersInDialogs[peerID] === undefined &&
  //                 alreadyPeers.indexOf(peerID) == -1) {
  //               alreadyPeers.push(peerID)
  //               if ($scope.canSend &&
  //                 AppPeersManager.isChannel(peerID) &&
  //                 !AppChatsManager.hasRights(-peerID, 'send')) {
  //                 return
  //               }
  //               $scope.myResults.push({
  //                 id: peerID,
  //                 peerString: AppPeersManager.getPeerString(peerID)
  //               })
  //             }
  //           })

  //           $scope.foundPeers = []
  //           angular.forEach(result.results, function (peerFound) {
  //             var peerID = AppPeersManager.getPeerID(peerFound)
  //             if (peersInDialogs[peerID] === undefined &&
  //                 alreadyPeers.indexOf(peerID) == -1) {
  //               if ($scope.canSend &&
  //                 AppPeersManager.isChannel(peerID) &&
  //                 !AppChatsManager.hasRights(-peerID, 'send')) {
  //                 return
  //               }
  //               alreadyPeers.push(peerID)
  //               $scope.foundPeers.push({
  //                 id: peerID,
  //                 username: AppPeersManager.getPeer(peerID).username,
  //                 peerString: AppUsersManager.getUserString(peerID)
  //               })
  //             }
  //           })
  //         }, function (error) {
  //           if (error.code == 400) {
  //             error.handled = true
  //           }
  //         })
  //       }, 500)
  //     }

  //     if ($scope.search.query && !$scope.noMessages) {
  //       searchMessages = true
  //       loadDialogs()
  //     }
  //   }
  // })

  // .controller('AppImHistoryController', function ($scope, $location, $timeout, $modal, $rootScope, toaster, _, MtpApiManager, AppUsersManager, AppChatsManager, AppMessagesManager, AppPeersManager, ApiUpdatesManager, PeersSelectService, IdleManager, StatusManager, NotificationsManager, ErrorService, GeoLocationManager) {
  //   $scope.$watchCollection('curDialog', applyDialogSelect)

  //   ApiUpdatesManager.attach()
  //   IdleManager.start()
  //   StatusManager.start()

  //   $scope.peerHistories = []
  //   $scope.selectedMsgs = {}
  //   $scope.selectedCount = 0
  //   $scope.historyState.selectActions = false
  //   $scope.historyState.botActions = false
  //   $scope.historyState.channelActions = false
  //   $scope.historyState.canDelete = false
  //   $scope.historyState.canReply = false
  //   $scope.historyState.missedCount = 0
  //   $scope.historyState.skipped = false
  //   $scope.state = {}

  //   $scope.toggleMessage = toggleMessage
  //   $scope.selectedDelete = selectedDelete
  //   $scope.selectedForward = selectedForward
  //   $scope.selectedReply = selectedReply
  //   $scope.selectedEdit = selectedEdit
  //   $scope.selectedCancel = selectedCancel
  //   $scope.selectedFlush = selectedFlush
  //   $scope.selectInlineBot = selectInlineBot

  //   $scope.startBot = startBot
  //   $scope.cancelBot = cancelBot
  //   $scope.joinChannel = joinChannel
  //   $scope.togglePeerMuted = togglePeerMuted

  //   $scope.toggleEdit = toggleEdit
  //   $scope.toggleMedia = toggleMedia
  //   $scope.returnToRecent = returnToRecent

  //   $scope.$on('history_edit_toggle', toggleEdit)
  //   $scope.$on('history_edit_flush', selectedFlush)
  //   $scope.$on('history_media_toggle', function (e, mediaType) {
  //     toggleMedia(mediaType)
  //   })

  //   $scope.$on('history_return_recent', returnToRecent)

  //   var peerID
  //   var peerHistory = false
  //   var unreadAfterIdle = false
  //   var hasMore = false
  //   var hasLess = false
  //   var maxID = 0
  //   var minID = 0
  //   var lastSelectID = false
  //   var inputMediaFilters = {
  //     photos: 'inputMessagesFilterPhotos',
  //     video: 'inputMessagesFilterVideo',
  //     documents: 'inputMessagesFilterDocument',
  //     audio: 'inputMessagesFilterVoice',
  //     round: 'inputMessagesFilterRoundVideo',
  //     music: 'inputMessagesFilterMusic',
  //     urls: 'inputMessagesFilterUrl',
  //     mentions: 'inputMessagesFilterMyMentions'
  //   }
  //   var jump = 0
  //   var moreJump = 0
  //   var moreActive = false
  //   var morePending = false
  //   var lessJump = 0
  //   var lessActive = false
  //   var lessPending = false

  //   function applyDialogSelect (newDialog, oldDialog) {
  //     peerID = $rootScope.selectedPeerID = newDialog.peerID
  //     $scope.historyFilter.mediaType = false

  //     AppPeersManager.getInputPeer(newDialog.peer || $scope.curDialog.peer || '')

  //     updateBotActions()
  //     selectedCancel(true)

  //     if (oldDialog.peer &&
  //       oldDialog.peer == newDialog.peer &&
  //       newDialog.messageID) {
  //       messageFocusHistory()
  //     } else if (peerID) {
  //       updateHistoryPeer(true)
  //       loadHistory()
  //     } else {
  //       showEmptyHistory()
  //     }
  //   }

  //   function historiesQueuePush (peerID) {
  //     var pos = -1
  //     var maxLen = 10
  //     var i, history, diff

  //     for (i = 0; i < $scope.peerHistories.length; i++) {
  //       if ($scope.peerHistories[i].peerID == peerID) {
  //         pos = i
  //         break
  //       }
  //     }
  //     if (pos > -1) {
  //       history = $scope.peerHistories[pos]
  //       return history
  //     }
  //     history = {peerID: peerID, messages: [], ids: []}
  //     $scope.peerHistories.unshift(history)
  //     diff = $scope.peerHistories.length - maxLen
  //     if (diff > 0) {
  //       $scope.peerHistories.splice(maxLen - 1, diff)
  //     }

  //     return history
  //   }

  //   function historiesQueueFind (peerID) {
  //     var i
  //     for (i = 0; i < $scope.peerHistories.length; i++) {
  //       if ($scope.peerHistories[i].peerID == peerID) {
  //         return $scope.peerHistories[i]
  //       }
  //     }
  //     return false
  //   }

  //   function historiesQueuePop (peerID) {
  //     var i
  //     for (i = 0; i < $scope.peerHistories.length; i++) {
  //       if ($scope.peerHistories[i].peerID == peerID) {
  //         $scope.peerHistories.splice(i, 1)
  //         return true
  //       }
  //     }
  //     return false
  //   }

  //   function updateHistoryPeer (preload) {
  //     var peerData = AppPeersManager.getPeer(peerID)
  //     // console.log('update', preload, peerData)
  //     if (!peerData || peerData.deleted) {
  //       safeReplaceObject($scope.state, {loaded: false})
  //       return false
  //     }

  //     peerHistory = historiesQueuePush(peerID)

  //     safeReplaceObject($scope.historyPeer, {
  //       id: peerID,
  //       data: peerData
  //     })

  //     MtpApiManager.getUserID().then(function (myID) {
  //       $scope.ownID = myID
  //     })

  //     if (preload) {
  //       $scope.historyState.typing.splice(0, $scope.historyState.typing.length)
  //       $scope.$broadcast('ui_peer_change')
  //       $scope.$broadcast('ui_history_change')
  //       safeReplaceObject($scope.state, {loaded: true, empty: !peerHistory.messages.length, mayBeHasMore: true})

  //       updateBotActions()
  //       updateChannelActions()
  //     }
  //   }

  //   function updateBotActions () {
  //     var wasBotActions = $scope.historyState.botActions
  //     if (!peerID ||
  //       peerID < 0 ||
  //       !AppUsersManager.isBot(peerID) ||
  //       $scope.historyFilter.mediaType ||
  //       $scope.curDialog.messageID) {
  //       $scope.historyState.botActions = false
  //     } else if (
  //       $scope.state.empty || (
  //       peerHistory &&
  //       peerHistory.messages.length == 1 &&
  //       peerHistory.messages[0].action &&
  //       peerHistory.messages[0].action._ == 'messageActionBotIntro'
  //       )
  //     ) {
  //       $scope.historyState.botActions = 'start'
  //     } else if ($scope.curDialog.startParam) {
  //       $scope.historyState.botActions = 'param'
  //     } else {
  //       $scope.historyState.botActions = false
  //     }
  //     if (wasBotActions != $scope.historyState.botActions) {
  //       $scope.$broadcast('ui_panel_update')
  //     }
  //   }

  //   function updateChannelActions () {
  //     var wasChannelActions = $scope.historyState.channelActions
  //     var channel
  //     if (peerID &&
  //       AppPeersManager.isChannel(peerID) &&
  //       (channel = AppChatsManager.getChat(-peerID))) {
  //       var canSend = AppChatsManager.hasRights(-peerID, 'send')
  //       if (!canSend) {
  //         if (channel.pFlags.left) {
  //           $scope.historyState.channelActions = 'join'
  //         } else {
  //           if (!$scope.historyState.channelActions) {
  //             $scope.historyState.channelActions = 'mute'
  //           }
  //           NotificationsManager.getPeerMuted(peerID).then(function (muted) {
  //             $scope.historyState.channelActions = muted ? 'unmute' : 'mute'
  //           })
  //         }
  //       } else {
  //         $scope.historyState.channelActions = false
  //       }
  //       $scope.historyState.canReply = canSend
  //       $scope.historyState.canDelete = canSend || channel.pFlags.moderator
  //     } else {
  //       $scope.historyState.channelActions = false
  //       $scope.historyState.canReply = true
  //       $scope.historyState.canDelete = true
  //     }
  //     if (wasChannelActions != $scope.historyState.channelActions) {
  //       $scope.$broadcast('ui_panel_update')
  //     }
  //   }

  //   function messageFocusHistory () {
  //     var history = historiesQueueFind(peerID)

  //     if (history &&
  //       history.ids.indexOf($scope.curDialog.messageID) != -1) {
  //       $scope.historyUnread = {}
  //       var focusedMsgID = $scope.curDialog.messageID || 0
  //       $scope.$broadcast('messages_focus', focusedMsgID)
  //       $scope.$broadcast('ui_history_change_scroll', true)
  //     } else {
  //       loadHistory()
  //     }
  //   }

  //   function showLessHistory () {
  //     if (!hasLess) {
  //       return
  //     }
  //     if (moreActive) {
  //       lessPending = true
  //       return
  //     }
  //     lessPending = false
  //     $scope.state.lessActive = lessActive = true

  //     var curJump = jump
  //     var curLessJump = ++lessJump
  //     var limit = 0
  //     var backLimit = 20
  //     AppMessagesManager.getHistory($scope.curDialog.peerID, minID, limit, backLimit).then(function (historyResult) {
  //       $scope.state.lessActive = lessActive = false
  //       if (curJump != jump || curLessJump != lessJump) return

  //       var i, id
  //       for (i = historyResult.history.length - 1; i >= 0; i--) {
  //         id = historyResult.history[i]
  //         if (id > minID) {
  //           peerHistory.messages.push(AppMessagesManager.wrapForHistory(id))
  //           peerHistory.ids.push(id)
  //         }
  //       }

  //       if (historyResult.history.length) {
  //         minID = historyResult.history.length >= backLimit
  //           ? historyResult.history[0]
  //           : 0
  //         if (AppMessagesManager.regroupWrappedHistory(peerHistory.messages, -backLimit)) {
  //           $scope.$broadcast('messages_regroup')
  //         }
  //         delete $scope.state.empty
  //         $scope.$broadcast('ui_history_append')
  //       } else {
  //         minID = 0
  //       }
  //       $scope.historyState.skipped = hasLess = minID > 0

  //       if (morePending) {
  //         showMoreHistory()
  //       }
  //     })
  //   }

  //   function showMoreHistory () {
  //     if (!hasMore) {
  //       return
  //     }
  //     if (lessActive) {
  //       morePending = true
  //       return
  //     }
  //     morePending = false
  //     $scope.state.moreActive = moreActive = true

  //     var curJump = jump
  //     var curMoreJump = ++moreJump
  //     var inputMediaFilter = $scope.historyFilter.mediaType && {_: inputMediaFilters[$scope.historyFilter.mediaType]}
  //     var limit = Config.Mobile ? 20 : 0
  //     var getMessagesPromise = inputMediaFilter
  //       ? AppMessagesManager.getSearch($scope.curDialog.peerID, '', inputMediaFilter, maxID, limit)
  //       : AppMessagesManager.getHistory($scope.curDialog.peerID, maxID, limit)

  //     getMessagesPromise.then(function (historyResult) {
  //       $scope.state.moreActive = moreActive = false
  //       if (curJump != jump || curMoreJump != moreJump) return

  //       angular.forEach(historyResult.history, function (id) {
  //         peerHistory.messages.unshift(AppMessagesManager.wrapForHistory(id))
  //         peerHistory.ids.unshift(id)
  //       })

  //       hasMore = historyResult.count === null ||
  //         (historyResult.history.length && peerHistory.messages.length < historyResult.count)

  //       if (historyResult.history.length) {
  //         delete $scope.state.empty
  //         maxID = historyResult.history[historyResult.history.length - 1]
  //         $scope.$broadcast('ui_history_prepend')
  //         if (AppMessagesManager.regroupWrappedHistory(peerHistory.messages, historyResult.history.length + 1)) {
  //           $scope.$broadcast('messages_regroup')
  //         }
  //       }

  //       if (lessPending) {
  //         showLessHistory()
  //       }
  //     })
  //   }

  //   function loadHistory (forceRecent) {
  //     $scope.historyState.missedCount = 0

  //     hasMore = false
  //     $scope.historyState.skipped = hasLess = false
  //     maxID = 0
  //     minID = 0
  //     peerHistory = historiesQueuePush(peerID)

  //     var limit = 0
  //     var backLimit = 0

  //     if ($scope.curDialog.messageID) {
  //       maxID = parseInt($scope.curDialog.messageID)
  //       limit = 20
  //       backLimit = 20
  //     } else if (forceRecent) {
  //       limit = 10
  //     }

  //     $scope.state.moreActive = moreActive = false
  //     morePending = false
  //     $scope.state.lessActive = lessActive = false
  //     lessPending = false

  //     var prerenderedLen = peerHistory.messages.length
  //     if (prerenderedLen && (maxID || backLimit)) {
  //       prerenderedLen = 0
  //       peerHistory.messages = []
  //       peerHistory.ids = []
  //       $scope.state.empty = true
  //     }

  //     var curJump = ++jump
  //     var inputMediaFilter = $scope.historyFilter.mediaType && {_: inputMediaFilters[$scope.historyFilter.mediaType]}
  //     var getMessagesPromise = inputMediaFilter
  //       ? AppMessagesManager.getSearch($scope.curDialog.peerID, '', inputMediaFilter, maxID)
  //       : AppMessagesManager.getHistory($scope.curDialog.peerID, maxID, limit, backLimit, prerenderedLen)

  //     $scope.state.mayBeHasMore = true
  //     // console.log(dT(), 'start load history', $scope.curDialog)
  //     getMessagesPromise.then(function (historyResult) {
  //       if (curJump != jump) return
  //       // console.log(dT(), 'history loaded', angular.copy(historyResult))

  //       var fetchedLength = historyResult.history.length

  //       minID = (historyResult.unreadSkip || (maxID && historyResult.history.indexOf(maxID) >= backLimit - 1))
  //         ? historyResult.history[0]
  //         : 0
  //       maxID = historyResult.history[historyResult.history.length - 1]

  //       $scope.historyState.skipped = hasLess = minID > 0
  //       hasMore = historyResult.count === null ||
  //         (fetchedLength && fetchedLength < historyResult.count)

  //       updateHistoryPeer()
  //       safeReplaceObject($scope.state, {loaded: true, empty: !fetchedLength})

  //       peerHistory.messages = []
  //       peerHistory.ids = []
  //       angular.forEach(historyResult.history, function (id) {
  //         var message = AppMessagesManager.wrapForHistory(id)
  //         if ($scope.historyState.skipped) {
  //           delete message.pFlags.unread
  //         }
  //         if (historyResult.unreadOffset) {
  //           message.unreadAfter = true
  //         }
  //         peerHistory.messages.push(message)
  //         peerHistory.ids.push(id)
  //       })
  //       peerHistory.messages.reverse()
  //       peerHistory.ids.reverse()

  //       if (AppMessagesManager.regroupWrappedHistory(peerHistory.messages)) {
  //         $scope.$broadcast('messages_regroup')
  //       }

  //       if (historyResult.unreadOffset) {
  //         $scope.historyUnreadAfter = historyResult.history[historyResult.unreadOffset - 1]
  //       } else if ($scope.historyUnreadAfter) {
  //         delete $scope.historyUnreadAfter
  //       }
  //       $scope.$broadcast('messages_unread_after')
  //       var focusedMsgID = $scope.curDialog.messageID || 0
  //       onContentLoaded(function () {
  //         $scope.$broadcast('messages_focus', focusedMsgID)
  //       })
  //       $scope.$broadcast('ui_history_change')

  //       if (!$rootScope.idle.isIDLE) {
  //         AppMessagesManager.readHistory($scope.curDialog.peerID)
  //       }

  //       updateBotActions()
  //       updateChannelActions()
  //     }, function () {
  //       safeReplaceObject($scope.state, {error: true, loaded: true})
  //     })
  //   }

  //   function showEmptyHistory () {
  //     jump++
  //     safeReplaceObject($scope.historyPeer, {})
  //     safeReplaceObject($scope.state, {notSelected: true})
  //     peerHistory = false
  //     hasMore = false

  //     $scope.$broadcast('ui_history_change')
  //   }

  //   function startBot () {
  //     AppMessagesManager.startBot(peerID, 0, $scope.curDialog.startParam)
  //     $scope.curDialog.startParam = false
  //   }

  //   function cancelBot () {
  //     delete $scope.curDialog.startParam
  //   }

  //   function joinChannel () {
  //     MtpApiManager.invokeApi('channels.joinChannel', {
  //       channel: AppChatsManager.getChannelInput(-peerID)
  //     }).then(function (result) {
  //       ApiUpdatesManager.processUpdateMessage(result)
  //     })
  //   }

  //   function togglePeerMuted (muted) {
  //     NotificationsManager.getPeerSettings(peerID).then(function (settings) {
  //       settings.mute_until = !muted ? 0 : 2000000000
  //       NotificationsManager.updatePeerSettings(peerID, settings)
  //     })
  //   }

  //   function toggleMessage (messageID, $event) {
  //     if ($scope.historyState.botActions ||
  //       $rootScope.idle.afterFocus) {
  //       return false
  //     }
  //     var message = AppMessagesManager.getMessage(messageID)
  //     if (message._ == 'messageService') {
  //       return false
  //     }

  //     if (!$scope.historyState.selectActions) {
  //       if (getSelectedText()) {
  //         return false
  //       }

  //       var target = $event.target
  //       while (target) {
  //         if (target instanceof SVGElement) {
  //           target = target.parentNode
  //           continue
  //         }
  //         if (target.className && target.className.indexOf('im_message_outer_wrap') != -1) {
  //           if (Config.Mobile) {
  //             return false
  //           }
  //           break
  //         }
  //         if (target.className &&
  //           target.className.indexOf('im_message_date') != -1) {
  //           if ($scope.historyFilter.mediaType) {
  //             $rootScope.$broadcast('history_focus', {
  //               peerString: $scope.curDialog.peer,
  //               messageID: messageID
  //             })
  //             return
  //           }
  //           if (AppPeersManager.isBroadcast(peerID)) {
  //             quickForward(messageID)
  //           } else {
  //             selectedReply(messageID)
  //           }
  //           return false
  //         }
  //         if (Config.Mobile &&
  //           target.className &&
  //           target.className.indexOf('im_message_body') != -1) {
  //           break
  //         }
  //         if (target.tagName == 'A' || hasOnclick(target)) {
  //           return false
  //         }
  //         target = target.parentNode
  //       }

  //       if (Config.Mobile) {
  //         $scope.historyState.canEdit = AppMessagesManager.canEditMessage(messageID)

  //         $modal.open({
  //           templateUrl: templateUrl('message_actions_modal'),
  //           windowClass: 'message_actions_modal_window',
  //           scope: $scope.$new()
  //         }).result.then(function (action) {
  //           switch (action) {
  //             case 'reply':
  //               selectedReply(messageID)
  //               break

  //             case 'edit':
  //               selectedEdit(messageID)
  //               break

  //             case 'delete':
  //               selectedDelete(messageID)
  //               break

  //             case 'forward':
  //               selectedForward(messageID)
  //               break

  //             case 'select':
  //               $scope.historyState.selectActions = 'selected'
  //               $scope.$broadcast('ui_panel_update')
  //               toggleMessage(messageID)
  //               break
  //           }
  //         })
  //         return false
  //       }
  //     }

  //     var shiftClick = $event && $event.shiftKey
  //     if (shiftClick) {
  //       $scope.$broadcast('ui_selection_clear')
  //     }

  //     if ($scope.selectedMsgs[messageID]) {
  //       lastSelectID = false
  //       delete $scope.selectedMsgs[messageID]
  //       $scope.selectedCount--
  //       if (!$scope.selectedCount) {
  //         $scope.historyState.selectActions = false
  //         $scope.$broadcast('ui_panel_update')
  //       }
  //     } else {
  //       if (!shiftClick) {
  //         lastSelectID = messageID
  //       } else if (lastSelectID != messageID) {
  //         var dir = lastSelectID > messageID
  //         var i, startPos, curMessageID

  //         for (i = 0; i < peerHistory.messages.length; i++) {
  //           if (peerHistory.messages[i].mid == lastSelectID) {
  //             startPos = i
  //             break
  //           }
  //         }

  //         i = startPos
  //         while (peerHistory.messages[i] &&
  //           (curMessageID = peerHistory.messages[i].mid) != messageID) {
  //           if (!$scope.selectedMsgs[curMessageID]) {
  //             $scope.selectedMsgs[curMessageID] = true
  //             $scope.selectedCount++
  //           }
  //           i += dir ? -1 : +1
  //         }
  //       }

  //       $scope.selectedMsgs[messageID] = true
  //       $scope.selectedCount++
  //       if (!$scope.historyState.selectActions) {
  //         $scope.historyState.selectActions = 'selected'
  //         $scope.$broadcast('ui_panel_update')
  //       }
  //     }
  //     if ($scope.selectedCount == 1) {
  //       angular.forEach($scope.selectedMsgs, function (t, messageID) {
  //         $scope.historyState.canEdit = AppMessagesManager.canEditMessage(messageID)
  //       })
  //     }
  //     $scope.$broadcast('messages_select')
  //   }

  //   function selectInlineBot (botID, $event) {
  //     if ($scope.historyState.canReply) {
  //       $scope.$broadcast('inline_bot_select', botID)
  //     }
  //     return cancelEvent($event)
  //   }

  //   function selectedCancel (noBroadcast) {
  //     $scope.selectedMsgs = {}
  //     $scope.selectedCount = 0
  //     $scope.historyState.selectActions = false
  //     lastSelectID = false
  //     if (!noBroadcast) {
  //       $scope.$broadcast('ui_panel_update')
  //     }
  //     $scope.$broadcast('messages_select')
  //   }

  //   function selectedFlush () {
  //     ErrorService.confirm({type: 'HISTORY_FLUSH'}).then(function () {
  //       AppMessagesManager.flushHistory($scope.curDialog.peerID, true).then(function () {
  //         selectedCancel()
  //       })
  //     })
  //   }

  //   function selectedDelete (selectedMessageID) {
  //     var selectedMessageIDs = []
  //     if (selectedMessageID) {
  //       selectedMessageIDs.push(selectedMessageID)
  //     } else if ($scope.selectedCount > 0) {
  //       angular.forEach($scope.selectedMsgs, function (t, messageID) {
  //         selectedMessageIDs.push(messageID)
  //       })
  //     }
  //     if (selectedMessageIDs.length) {
  //       var peerID = $scope.curDialog.peerID
  //       var isUser = peerID > 0
  //       var isChannel = AppPeersManager.isChannel(peerID)
  //       var isBroadcast = AppPeersManager.isBroadcast(peerID)
  //       var isMegagroup = AppPeersManager.isMegagroup(peerID)
  //       var isUsualGroup = !isChannel && !isUser
  //       var isSavedMessages = peerID == AppUsersManager.getSelf().id

  //       var revocable = !isChannel
  //       for (var i = 0; revocable && i < selectedMessageIDs.length; i++) {
  //         var messageID = selectedMessageIDs[i]
  //         if (!AppMessagesManager.canRevokeMessage(messageID)) {
  //           revocable = false
  //         }
  //       }

  //       ErrorService.confirm({
  //         type: 'MESSAGES_DELETE',
  //         count: selectedMessageIDs.length,
  //         revocable: revocable,
  //         isUser: isUser,
  //         peerID: peerID,
  //         isSavedMessages: isSavedMessages,
  //         isChannel: isBroadcast,
  //         isSupergroup: isMegagroup,
  //         isUsualGroup: isUsualGroup
  //       }, {}, { revoke: false }).then(function (data) {
  //         AppMessagesManager.deleteMessages(selectedMessageIDs, data.revoke).then(function () {
  //           selectedCancel()
  //         })
  //       })
  //     }
  //   }

  //   function quickForward (msgID) {
  //     PeersSelectService.selectPeers({
  //       canSend: true,
  //       confirm_type: 'FORWARD_PEER',
  //       shareLinkPromise: AppMessagesManager.getMessageShareLink(msgID)
  //     }).then(function (peerStrings) {
  //       angular.forEach(peerStrings, function (peerString) {
  //         var peerID = AppPeersManager.getPeerID(peerString)
  //         AppMessagesManager.forwardMessages(peerID, [msgID])
  //       })
  //       var toastData = toaster.pop({
  //         type: 'info',
  //         body: _('confirm_modal_forward_to_peer_success'),
  //         bodyOutputType: 'trustedHtml',
  //         clickHandler: function () {
  //           $rootScope.$broadcast('history_focus', {
  //             peerString: peerStrings[0]
  //           })
  //           toaster.clear(toastData)
  //         },
  //         showCloseButton: false
  //       })
  //     })
  //   }

  //   function selectedForward (selectedMessageID) {
  //     var selectedMessageIDs = []
  //     if (selectedMessageID) {
  //       selectedMessageIDs.push(selectedMessageID)
  //     } else if ($scope.selectedCount > 0) {
  //       angular.forEach($scope.selectedMsgs, function (t, messageID) {
  //         selectedMessageIDs.push(messageID)
  //       })
  //     }
  //     if (selectedMessageIDs.length) {
  //       PeersSelectService.selectPeer({canSend: true}).then(function (peerStrings) {
  //         selectedCancel()
  //         if (Array.isArray(peerStrings) && peerStrings.length > 1) {
  //           angular.forEach(peerStrings, function (peerString) {
  //             var peerID = AppPeersManager.getPeerID(peerString)
  //             AppMessagesManager.forwardMessages(peerID, selectedMessageIDs)
  //           })
  //           var toastData = toaster.pop({
  //             type: 'info',
  //             body: _('confirm_modal_forward_to_peer_success'),
  //             bodyOutputType: 'trustedHtml',
  //             clickHandler: function () {
  //               $rootScope.$broadcast('history_focus', {
  //                 peerString: peerStrings[0]
  //               })
  //               toaster.clear(toastData)
  //             },
  //             showCloseButton: false
  //           })
  //         } else {            
  //           $rootScope.$broadcast('history_focus', {
  //             peerString: peerStrings,
  //             attachment: {
  //               _: 'fwd_messages',
  //               id: selectedMessageIDs
  //             }
  //           })
  //         }    
  //       })
  //     }
  //   }

  //   function selectedReply (selectedMessageID) {
  //     if (!selectedMessageID && $scope.selectedCount == 1) {
  //       angular.forEach($scope.selectedMsgs, function (t, messageID) {
  //         selectedMessageID = messageID
  //       })
  //     }
  //     if (selectedMessageID) {
  //       selectedCancel()
  //       $scope.$broadcast('reply_selected', selectedMessageID)
  //     }
  //   }

  //   function selectedEdit (selectedMessageID) {
  //     if (!selectedMessageID && $scope.selectedCount == 1) {
  //       angular.forEach($scope.selectedMsgs, function (t, messageID) {
  //         selectedMessageID = messageID
  //       })
  //     }
  //     if (selectedMessageID) {
  //       selectedCancel()
  //       $scope.$broadcast('edit_selected', selectedMessageID)
  //     }
  //   }

  //   function toggleEdit () {
  //     if ($scope.historyState.selectActions) {
  //       selectedCancel()
  //     } else {
  //       $scope.historyState.selectActions = 'selected'
  //       $scope.$broadcast('ui_panel_update')
  //     }
  //   }

  //   function toggleMedia (mediaType) {
  //     if (mediaType == 'search') {
  //       $rootScope.$broadcast('history_search', $scope.curDialog.peerID)
  //       return
  //     }
  //     $scope.historyFilter.mediaType = mediaType || false
  //     if (mediaType) {
  //       $scope.curDialog.messageID = false
  //     }
  //     peerHistory.messages = []
  //     peerHistory.ids = []
  //     $scope.state.empty = true
  //     loadHistory()
  //   }

  //   function returnToRecent () {
  //     if ($scope.historyFilter.mediaType) {
  //       toggleMedia()
  //     } else {
  //       if ($scope.curDialog.messageID) {
  //         $rootScope.$broadcast('history_focus', {peerString: $scope.curDialog.peer})
  //       } else {
  //         loadHistory(true)
  //       }
  //     }
  //   }

  //   $scope.$on('history_update', angular.noop)

  //   var loadAfterSync = false
  //   $scope.$on('stateSynchronized', function () {
  //     if (!loadAfterSync) {
  //       return
  //     }
  //     if (loadAfterSync == $scope.curDialog.peerID) {
  //       loadHistory()
  //     }
  //     loadAfterSync = false
  //   })

  //   $scope.$on('reply_button_press', function (e, button) {
  //     var replyKeyboard = $scope.historyState.replyKeyboard
  //     if (!replyKeyboard) {
  //       return
  //     }
  //     var sendOptions = {
  //       replyToMsgID: peerID < 0 && replyKeyboard.mid
  //     }
  //     switch (button._) {
  //       case 'keyboardButtonRequestPhone':
  //         ErrorService.confirm({type: 'BOT_ACCESS_PHONE'}).then(function () {
  //           var user = AppUsersManager.getSelf()
  //           AppMessagesManager.sendOther(peerID, {
  //             _: 'inputMediaContact',
  //             phone_number: user.phone,
  //             first_name: user.first_name,
  //             last_name: user.last_name
  //           }, sendOptions)
  //         })
  //         break

  //       case 'keyboardButtonRequestGeoLocation':
  //         ErrorService.confirm({type: 'BOT_ACCESS_GEO'}).then(function () {
  //           return GeoLocationManager.getPosition().then(function (coords) {
  //             AppMessagesManager.sendOther(peerID, {
  //               _: 'inputMediaGeoPoint',
  //               geo_point: {
  //                 _: 'inputGeoPoint',
  //                 'lat': coords['lat'],
  //                 'long': coords['long']
  //               }
  //             }, sendOptions)
  //           }, function (error) {
  //             ErrorService.alert(
  //               _('error_modal_bad_request_title_raw'),
  //               _('error_modal_gelocation_na_raw')
  //             )
  //           })
  //         })
  //         break

  //       default:
  //         AppMessagesManager.sendText(peerID, button.text, sendOptions)
  //     }
  //   })

  //   $scope.$on('history_reload', function (e, updPeerID) {
  //     if (updPeerID == $scope.curDialog.peerID) {
  //       loadHistory()
  //     }
  //   })

  //   $scope.$on('history_forbidden', function (e, updPeerID) {
  //     if (updPeerID == $scope.curDialog.peerID) {
  //       $location.url('/im')
  //     }
  //     historiesQueuePop(updPeerID)
  //   })

  //   $scope.$on('dialog_migrate', function (e, data) {
  //     if (data.migrateFrom == $scope.curDialog.peerID) {
  //       var peerString = AppPeersManager.getPeerString(data.migrateTo)
  //       $rootScope.$broadcast('history_focus', {peerString: peerString})
  //     }
  //     historiesQueuePop(data.migrateFrom)
  //   })

  //   $scope.$on('notify_settings', function (e, data) {
  //     if (data.peerID == $scope.curDialog.peerID) {
  //       updateChannelActions()
  //     }
  //   })

  //   $scope.$on('channel_settings', function (e, data) {
  //     if (data.channelID == -$scope.curDialog.peerID) {
  //       updateChannelActions()
  //     }
  //   })

  //   var typingTimeouts = {}
  //   $scope.$on('history_append', function (e, addedMessage) {
  //     var history = historiesQueueFind(addedMessage.peerID)
  //     if (!history) {
  //       return
  //     }
  //     var curPeer = addedMessage.peerID == $scope.curDialog.peerID
  //     if (curPeer) {
  //       if ($scope.historyFilter.mediaType ||
  //         $scope.historyState.skipped) {
  //         if (addedMessage.my) {
  //           returnToRecent()
  //         } else {
  //           $scope.historyState.missedCount++
  //         }
  //         return
  //       }
  //       if ($scope.curDialog.messageID && addedMessage.my) {
  //         returnToRecent()
  //       }
  //       delete $scope.state.empty
  //     }
  //     // console.log('append', addedMessage)
  //     // console.trace()
  //     var historyMessage = AppMessagesManager.wrapForHistory(addedMessage.messageID)
  //     history.messages.push(historyMessage)
  //     history.ids.push(addedMessage.messageID)
  //     if (AppMessagesManager.regroupWrappedHistory(history.messages, -3)) {
  //       $scope.$broadcast('messages_regroup')
  //     }

  //     if (curPeer) {
  //       $scope.historyState.typing.splice(0, $scope.historyState.typing.length)
  //       $scope.$broadcast('ui_history_append_new', {
  //         my: addedMessage.my,
  //         idleScroll: unreadAfterIdle && !historyMessage.pFlags.out && $rootScope.idle.isIDLE
  //       })
  //       if (addedMessage.my && $scope.historyUnreadAfter) {
  //         delete $scope.historyUnreadAfter
  //         $scope.$broadcast('messages_unread_after')
  //       }

  //       // console.log('append check', $rootScope.idle.isIDLE, addedMessage.peerID, $scope.curDialog.peerID, historyMessage, history.messages[history.messages.length - 2])
  //       if ($rootScope.idle.isIDLE) {
  //         if (historyMessage.pFlags.unread &&
  //           !historyMessage.pFlags.out &&
  //           !(history.messages[history.messages.length - 2] || {}).pFlags.unread) {
  //           $scope.historyUnreadAfter = historyMessage.mid
  //           unreadAfterIdle = true
  //           $scope.$broadcast('messages_unread_after')
  //         }
  //       } else {
  //         $timeout(function () {
  //           AppMessagesManager.readHistory($scope.curDialog.peerID)
  //         })
  //       }

  //       updateBotActions()
  //       updateChannelActions()
  //     }
  //   })

  //   $scope.$on('history_multiappend', function (e, historyMultiAdded) {
  //     // console.log(dT(), 'multiappend', angular.copy(historyMultiAdded))
  //     var regroupped = false
  //     var unreadAfterChanged = false
  //     var isIDLE = $rootScope.idle.isIDLE
  //     angular.forEach(historyMultiAdded, function (msgs, peerID) {
  //       var history = historiesQueueFind(peerID)
  //       // var history = historiesQueuePush(peerID)
  //       if (!history) {
  //         return
  //       }
  //       var curPeer = peerID == $scope.curDialog.peerID
  //       var exlen = history.messages.length
  //       var len = msgs.length

  //       if (curPeer) {
  //         if ($scope.historyFilter.mediaType ||
  //           $scope.historyState.skipped) {
  //           $scope.historyState.missedCount += len
  //           return
  //         }
  //         delete $scope.state.empty
  //       }

  //       if ((!curPeer || isIDLE) &&
  //         exlen > (len > 10 ? 10 : 100)) {
  //         console.warn(dT(), 'Drop too many messages', len, exlen, isIDLE, curPeer, peerID)
  //         if (curPeer) {
  //           minID = history.messages[exlen - 1].mid
  //           $scope.historyState.skipped = hasLess = minID > 0
  //           if (hasLess) {
  //             loadAfterSync = peerID
  //             $scope.$broadcast('ui_history_append')
  //           }
  //         } else {
  //           historiesQueuePop(peerID)
  //         }
  //         return
  //       }

  //       var messageID, i
  //       var hasOut = false
  //       var unreadAfterNew = false
  //       var historyMessage = history.messages[history.messages.length - 1]
  //       var lastIsRead = !historyMessage || !historyMessage.pFlags.unread
  //       for (i = 0; i < len; i++) {
  //         messageID = msgs[i]
  //         if (messageID > 0 && messageID < maxID ||
  //             history.ids.indexOf(messageID) !== -1) {
  //           continue
  //         }
  //         historyMessage = AppMessagesManager.wrapForHistory(messageID)
  //         history.messages.push(historyMessage)
  //         history.ids.push(messageID)
  //         if (!unreadAfterNew && isIDLE) {
  //           if (historyMessage.pFlags.unread &&
  //             !historyMessage.pFlags.out &&
  //             lastIsRead) {
  //             unreadAfterNew = messageID
  //           } else {
  //             lastIsRead = !historyMessage.pFlags.unread
  //           }
  //         }
  //         if (!hasOut && historyMessage.pFlags.out) {
  //           hasOut = true
  //         }
  //       }
  //       // console.log('after append', angular.copy(history.messages), angular.copy(history.ids))

  //       if (AppMessagesManager.regroupWrappedHistory(history.messages, -len - 2)) {
  //         regroupped = true
  //       }

  //       if (curPeer) {
  //         if ($scope.historyState.typing.length) {
  //           $scope.historyState.typing.splice(0, $scope.historyState.typing.length)
  //         }
  //         $scope.$broadcast('ui_history_append_new', {
  //           idleScroll: unreadAfterIdle && !hasOut && isIDLE
  //         })

  //         if (isIDLE) {
  //           if (unreadAfterNew) {
  //             $scope.historyUnreadAfter = unreadAfterNew
  //             unreadAfterIdle = true
  //             unreadAfterChanged = true
  //           }
  //         } else {
  //           $timeout(function () {
  //             AppMessagesManager.readHistory($scope.curDialog.peerID)
  //           })
  //         }

  //         updateBotActions()
  //         updateChannelActions()
  //       }
  //     })

  //     if (regroupped) {
  //       $scope.$broadcast('messages_regroup')
  //     }
  //     if (unreadAfterChanged) {
  //       $scope.$broadcast('messages_unread_after')
  //     }
  //   })

  //   $scope.$on('history_delete', function (e, historyUpdate) {
  //     var history = historiesQueueFind(historyUpdate.peerID)
  //     if (!history) {
  //       return
  //     }
  //     var newMessages = []
  //     var i

  //     for (i = 0; i < history.messages.length; i++) {
  //       if (!historyUpdate.msgs[history.messages[i].mid]) {
  //         newMessages.push(history.messages[i])
  //       }
  //     }
  //     history.messages = newMessages
  //     AppMessagesManager.regroupWrappedHistory(history.messages)
  //     $scope.$broadcast('messages_regroup')
  //     if (historyUpdate.peerID == $scope.curDialog.peerID) {
  //       $scope.state.empty = !newMessages.length
  //       updateBotActions()
  //     }
  //   })

  //   $scope.$on('dialog_flush', function (e, dialog) {
  //     var history = historiesQueueFind(dialog.peerID)
  //     if (history) {
  //       history.messages = []
  //       history.ids = []
  //       if (dialog.peerID == $scope.curDialog.peerID) {
  //         $scope.state.empty = true
  //         updateBotActions()
  //       }
  //     }
  //   })

  //   $scope.$on('history_focus', function (e, peerData) {
  //     if ($scope.historyFilter.mediaType) {
  //       toggleMedia()
  //     }
  //   })

  //   $scope.$on('apiUpdate', function (e, update) {
  //     switch (update._) {
  //       case 'updateUserTyping':
  //       case 'updateChatUserTyping':
  //         AppUsersManager.forceUserOnline(update.user_id)
  //         if (AppUsersManager.hasUser(update.user_id) &&
  //           $scope.curDialog.peerID == (update._ == 'updateUserTyping'
  //             ? update.user_id
  //             : -update.chat_id
  //           )) {
  //           if ($scope.historyState.typing.indexOf(update.user_id) == -1) {
  //             $scope.historyState.typing.push(update.user_id)
  //           }
  //           $timeout.cancel(typingTimeouts[update.user_id])

  //           typingTimeouts[update.user_id] = $timeout(function () {
  //             var pos = $scope.historyState.typing.indexOf(update.user_id)
  //             if (pos !== -1) {
  //               $scope.historyState.typing.splice(pos, 1)
  //             }
  //           }, 6000)
  //         }
  //         break
  //     }
  //   })

  //   $scope.$on('history_need_less', showLessHistory)
  //   $scope.$on('history_need_more', showMoreHistory)

  //   $rootScope.$watch('idle.isIDLE', function (newVal) {
  //     if (!newVal &&
  //         $scope.curDialog &&
  //         $scope.curDialog.peerID &&
  //         !$scope.historyFilter.mediaType &&
  //         !$scope.historyState.skipped) {
  //       AppMessagesManager.readHistory($scope.curDialog.peerID)
  //     }
  //     if (!newVal) {
  //       unreadAfterIdle = false
  //       if (loadAfterSync &&
  //         loadAfterSync == $scope.curDialog.peerID) {
  //         loadHistory()
  //         loadAfterSync = false
  //       }
  //     }
  //   })
  // })

  // .controller('AppImSendController', function ($rootScope, $q, $scope, $timeout, MtpApiManager, Storage, AppProfileManager, AppChatsManager, AppUsersManager, AppPeersManager, AppDocsManager, AppStickersManager, AppMessagesManager, AppInlineBotsManager, MtpApiFileManager, DraftsManager, RichTextProcessor) {
  //   $scope.$watch('curDialog.peer', resetDraft)
  //   $scope.$on('user_update', angular.noop)
  //   $scope.$on('peer_draft_attachment', applyDraftAttachment)
  //   $scope.$on('reply_selected', function (e, messageID) {
  //     replySelect(messageID, true)
  //   })
  //   $scope.$on('edit_selected', function (e, messageID) {
  //     setEditDraft(messageID, true)
  //   })

  //   $scope.$on('ui_typing', onTyping)

  //   $scope.draftMessage = {
  //     text: '',
  //     send: submitMessage,
  //     replyClear: replyClear,
  //     fwdsClear: fwdsClear,
  //     toggleSlash: toggleSlash,
  //     replyKeyboardToggle: replyKeyboardToggle,
  //     type: 'new'
  //   }
  //   $scope.mentions = {}
  //   $scope.commands = {}
  //   $scope.$watch('draftMessage.text', onMessageChange)
  //   $scope.$watch('draftMessage.files', onFilesSelected)
  //   $scope.$watch('draftMessage.sticker', onStickerSelected)
  //   $scope.$watch('draftMessage.command', onCommandSelected)
  //   $scope.$watch('draftMessage.inlineResultID', onInlineResultSelected)

  //   $scope.$on('history_reply_markup', function (e, peerData) {
  //     if (peerData.peerID == $scope.curDialog.peerID) {
  //       updateReplyKeyboard()
  //     }
  //   })

  //   $scope.$on('inline_bot_select', function (e, botID) {
  //     var bot = AppUsersManager.getUser(botID)
  //     $scope.draftMessage.text = '@' + bot.username + ' '
  //     $scope.$broadcast('ui_peer_draft', {focus: true})
  //   })

  //   $scope.$on('inline_bots_popular', updateMentions)

  //   $scope.$on('last_message_edit', setEditLastMessage)

  //   $rootScope.$watch('idle.isIDLE', function (newVal) {
  //     if ($rootScope.idle.initial) {
  //       return
  //     }
  //     if (newVal && $scope.curDialog.peerID) {
  //       $scope.$broadcast('ui_message_before_send')
  //       $timeout(function () {
  //         DraftsManager.syncDraft($scope.curDialog.peerID)
  //       })
  //     }
  //   })

  //   $scope.$on('draft_updated', function (e, draftUpdate) {
  //     if (draftUpdate.peerID == $scope.curDialog.peerID &&
  //         !draftUpdate.local &&
  //         (!$scope.draftMessage.text || $rootScope.idle.isIDLE)) {
  //       getDraft()
  //     }
  //   })

  //   var replyToMarkup = false
  //   var forceDraft = false
  //   var editMessageID = false

  //   function submitMessage (e) {
  //     $scope.$broadcast('ui_message_before_send')

  //     $timeout(function () {
  //       if (editMessageID) {
  //         editMessage()
  //       } else {
  //         sendMessage()
  //       }
  //     })

  //     return cancelEvent(e)
  //   }

  //   function sendMessage () {
  //     var text = $scope.draftMessage.text

  //     if (angular.isString(text) && text.length > 0) {
  //       text = RichTextProcessor.parseEmojis(text)

  //       var options = {
  //         replyToMsgID: $scope.draftMessage.replyToMsgID,
  //         clearDraft: true
  //       }
  //       do {
  //         AppMessagesManager.sendText($scope.curDialog.peerID, text.substr(0, 4096), options)
  //         text = text.substr(4096)
  //         options = angular.copy(options)
  //         delete options.clearDraft
  //       } while (text.length)
  //     }
  //     fwdsSend()

  //     if (forceDraft == $scope.curDialog.peer) {
  //       forceDraft = false
  //     }

  //     resetDraft()
  //     $scope.$broadcast('ui_message_send')
  //   }

  //   function editMessage () {
  //     var text = $scope.draftMessage.text
  //     text = RichTextProcessor.parseEmojis(text)

  //     AppMessagesManager.editMessage(editMessageID, text).then(function () {
  //       editMessageID = false

  //       resetDraft()
  //       $scope.$broadcast('ui_message_send')
  //       $timeout(function () {
  //         $scope.$broadcast('ui_peer_reply')
  //       })
  //     })
  //   }

  //   function updateMentions () {
  //     var peerID = $scope.curDialog.peerID

  //     if (!peerID) {
  //       safeReplaceObject($scope.mentions, {})
  //       $scope.$broadcast('mentions_update')
  //       return
  //     }

  //     var mentionUsers = []
  //     var mentionIndex = SearchIndexManager.createIndex()

  //     var inlineBotsPromise = AppInlineBotsManager.getPopularBots().then(function (inlineBots) {
  //       var ids = []
  //       angular.forEach(inlineBots, function (bot) {
  //         ids.push(bot.id)
  //       })
  //       return ids
  //     })
  //     var chatParticipantsPromise
  //     if (peerID < 0 && !AppPeersManager.isBroadcast(peerID)) {
  //       if (AppPeersManager.isChannel(peerID)) {
  //         chatParticipantsPromise = AppProfileManager.getChannelParticipants(-peerID)
  //       } else {
  //         chatParticipantsPromise = AppProfileManager.getChatFull(-peerID).then(function (chatFull) {
  //           return (chatFull.participants || {}).participants || []
  //         })
  //       }
  //       chatParticipantsPromise = chatParticipantsPromise.then(function (participantsVector) {
  //         var ids = []
  //         angular.forEach(participantsVector, function (participant) {
  //           ids.push(participant.user_id)
  //         })
  //         return ids
  //       })
  //     } else {
  //       chatParticipantsPromise = $q.when([])
  //     }

  //     $q.all({pop: inlineBotsPromise, chat: chatParticipantsPromise}).then(function (result) {
  //       var done = {}
  //       var ids = result.pop.concat(result.chat)
  //       angular.forEach(ids, function (userID) {
  //         if (done[userID]) {
  //           return
  //         }
  //         done[userID] = true
  //         mentionUsers.push(AppUsersManager.getUser(userID))
  //         SearchIndexManager.indexObject(userID, AppUsersManager.getUserSearchText(userID), mentionIndex)
  //       })

  //       safeReplaceObject($scope.mentions, {
  //         users: mentionUsers,
  //         index: mentionIndex
  //       })
  //       $scope.$broadcast('mentions_update')
  //     })
  //   }

  //   function updateCommands () {
  //     var peerID = $scope.curDialog.peerID
  //     if (!peerID) {
  //       safeReplaceObject($scope.commands, {})
  //       $scope.$broadcast('mentions_update')
  //       return
  //     }

  //     AppProfileManager.getPeerBots(peerID).then(function (peerBots) {
  //       if (!peerBots.length) {
  //         safeReplaceObject($scope.commands, {})
  //         $scope.$broadcast('mentions_update')
  //         return
  //       }

  //       var needMentions = peerID < 0
  //       var commandsList = []
  //       var commandsIndex = SearchIndexManager.createIndex()

  //       angular.forEach(peerBots, function (peerBot) {
  //         var mention = ''
  //         if (needMentions) {
  //           var bot = AppUsersManager.getUser(peerBot.id)
  //           if (bot && bot.username) {
  //             mention += '@' + bot.username
  //           }
  //         }
  //         var botSearchText = AppUsersManager.getUserSearchText(peerBot.id)
  //         angular.forEach(peerBot.commands, function (description, command) {
  //           var value = '/' + command + mention
  //           commandsList.push({
  //             botID: peerBot.id,
  //             value: value,
  //             rDescription: RichTextProcessor.wrapRichText(description, {noLinks: true, noLineBreaks: true})
  //           })
  //           SearchIndexManager.indexObject(value, botSearchText + ' ' + command + ' ' + description, commandsIndex)
  //         })
  //       })

  //       safeReplaceObject($scope.commands, {
  //         list: commandsList,
  //         index: commandsIndex
  //       })
  //       $scope.$broadcast('mentions_update')
  //     })
  //   }

  //   function resetDraft (newPeer, prevPeer) {
  //     var prevPeerID = prevPeer ? AppPeersManager.getPeerID(prevPeer) : 0
  //     if (newPeer != prevPeer && prevPeerID) {
  //       $scope.$broadcast('ui_message_before_send')
  //       $timeout(function () {
  //         DraftsManager.syncDraft(prevPeerID)
  //         resetDraft()
  //       })
  //       return
  //     }

  //     editMessageID = false

  //     updateMentions()
  //     updateCommands()
  //     replyClear()
  //     updateReplyKeyboard()

  //     delete $scope.draftMessage.inlineProgress
  //     $scope.$broadcast('inline_results', false)

  //     // console.log(dT(), 'reset draft', $scope.curDialog.peer, forceDraft)
  //     if (forceDraft) {
  //       if (forceDraft == $scope.curDialog.peer) {
  //         $scope.draftMessage.isBroadcast = AppPeersManager.isBroadcast($scope.curDialog.peerID)
  //         $scope.$broadcast('ui_peer_draft')
  //         return
  //       } else {
  //         forceDraft = false
  //       }
  //     }

  //     fwdsClear()
  //     getDraft()
  //   }

  //   function getDraft () {
  //     if ($scope.curDialog.peerID) {
  //       var draftDataPromise
  //       if (editMessageID) {
  //         draftDataPromise = AppMessagesManager.getMessageEditData(editMessageID).then(function (draftData) {
  //           draftData.replyToMsgID = editMessageID
  //           return draftData
  //         }, function (error) {
  //           console.warn(error)
  //           editMessageID = false
  //           getDraft()
  //           return $q.reject()
  //         })
  //       } else {
  //         draftDataPromise = DraftsManager.getDraft($scope.curDialog.peerID)
  //       }
  //       draftDataPromise.then(function (draftData) {
  //         $scope.draftMessage.type = editMessageID ? 'edit' : 'new'
  //         $scope.draftMessage.text = draftData ? draftData.text : ''
  //         $scope.draftMessage.isBroadcast = AppPeersManager.isBroadcast($scope.curDialog.peerID)
  //         if (draftData.replyToMsgID) {
  //           var replyToMsgID = draftData.replyToMsgID
  //           replySelect(replyToMsgID)
  //         } else {
  //           replyClear()
  //         }
  //         $scope.$broadcast('ui_peer_draft')
  //       })
  //     } else {
  //       // console.log('Reset peer')
  //       $scope.draftMessage.text = ''
  //       $scope.$broadcast('ui_peer_draft')
  //     }
  //   }

  //   function applyDraftAttachment (e, attachment) {
  //     console.log(dT(), 'apply draft attach', attachment)
  //     if (!attachment || !attachment._) {
  //       return
  //     }

  //     if (attachment._ == 'share_url') {
  //       var url = attachment.url
  //       var text = attachment.text || ' '
  //       forceDraft = $scope.curDialog.peer

  //       $timeout(function () {
  //         $scope.draftMessage.text = url + '\n' + text
  //         $scope.$broadcast('ui_peer_draft', {
  //           customSelection: [
  //             url + '\n',
  //             text,
  //             ''
  //           ]
  //         })
  //       }, 1000)
  //     } else if (attachment._ == 'fwd_messages') {
  //       forceDraft = $scope.curDialog.peer
  //       $timeout(function () {
  //         $scope.draftMessage.fwdMessages = attachment.id
  //         $scope.$broadcast('ui_peer_reply')
  //       }, 100)
  //     } else if (attachment._ == 'inline_query') {
  //       var mention = attachment.mention
  //       var query = attachment.query
  //       forceDraft = $scope.curDialog.peer

  //       $timeout(function () {
  //         $scope.draftMessage.text = mention + ' ' + query
  //         $scope.$broadcast('ui_peer_draft', {
  //           customSelection: [
  //             mention + ' ' + query,
  //             '',
  //             ''
  //           ]
  //         })
  //       }, 1000)
  //     }
  //   }

  //   function replySelect (messageID, byUser) {
  //     if (editMessageID && byUser) {
  //       replyClear()
  //       return
  //     }
  //     $scope.draftMessage.replyToMsgID = messageID
  //     $scope.$broadcast('ui_peer_reply')
  //     replyToMarkup = false

  //     if (byUser && !editMessageID) {
  //       DraftsManager.changeDraft($scope.curDialog.peerID, {
  //         text: $scope.draftMessage.text,
  //         replyToMsgID: messageID
  //       })
  //     }
  //   }

  //   function setEditDraft (messageID) {
  //     editMessageID = messageID
  //     getDraft()
  //   }

  //   function setEditLastMessage () {
  //     if (editMessageID ||
  //         !$scope.curDialog.peerID) {
  //       return false
  //     }
  //     AppMessagesManager.getHistory($scope.curDialog.peerID).then(function (historyResult) {
  //       for (var i = 0, messageID; i < historyResult.history.length; i++) {
  //         messageID = historyResult.history[i]
  //         if (AppMessagesManager.canEditMessage(messageID)) {
  //           setEditDraft(messageID)
  //           break
  //         }
  //       }
  //     })
  //   }

  //   function replyClear (byUser) {
  //     if (editMessageID) {
  //       editMessageID = false
  //       getDraft()
  //       return
  //     }
  //     var mid = $scope.draftMessage.replyToMsgID
  //     if (mid &&
  //       $scope.historyState.replyKeyboard &&
  //       $scope.historyState.replyKeyboard.mid == mid &&
  //       !$scope.historyState.replyKeyboard.pFlags.hidden) {
  //       $scope.historyState.replyKeyboard.pFlags.hidden = true
  //       $scope.$broadcast('ui_keyboard_update')
  //     }
  //     delete $scope.draftMessage.replyToMsgID
  //     $scope.$broadcast('ui_peer_reply')

  //     if (byUser) {
  //       DraftsManager.changeDraft($scope.curDialog.peerID, {
  //         text: $scope.draftMessage.text
  //       })
  //     }
  //   }

  //   function fwdsClear () {
  //     if ($scope.draftMessage.fwdMessages &&
  //       $scope.draftMessage.fwdMessages.length) {
  //       delete $scope.draftMessage.fwdMessages
  //       $scope.$broadcast('ui_peer_reply')

  //       if (forceDraft == $scope.curDialog.peer) {
  //         forceDraft = false
  //       }
  //     }
  //   }

  //   function fwdsSend () {
  //     if ($scope.draftMessage.fwdMessages &&
  //       $scope.draftMessage.fwdMessages.length) {
  //       var ids = $scope.draftMessage.fwdMessages.slice()
  //       fwdsClear()
  //       setZeroTimeout(function () {
  //         AppMessagesManager.forwardMessages($scope.curDialog.peerID, ids)
  //       })
  //     }
  //   }

  //   function toggleSlash ($event) {
  //     if ($scope.draftMessage.text &&
  //       $scope.draftMessage.text.charAt(0) == '/') {
  //       $scope.draftMessage.text = ''
  //     } else {
  //       $scope.draftMessage.text = '/'
  //     }
  //     $scope.$broadcast('ui_peer_draft', {focus: true})
  //     return cancelEvent($event)
  //   }

  //   function updateReplyKeyboard () {
  //     var peerID = $scope.curDialog.peerID
  //     var replyKeyboard = AppMessagesManager.getReplyKeyboard(peerID)
  //     if (replyKeyboard) {
  //       replyKeyboard = AppMessagesManager.wrapReplyMarkup(replyKeyboard)
  //     }
  //     // console.log('update reply markup', peerID, replyKeyboard)
  //     $scope.historyState.replyKeyboard = replyKeyboard

  //     var addReplyMessage =
  //     replyKeyboard &&
  //       !replyKeyboard.pFlags.hidden &&
  //       (replyKeyboard._ == 'replyKeyboardForceReply' ||
  //       (replyKeyboard._ == 'replyKeyboardMarkup' && peerID < 0))

  //     if (addReplyMessage) {
  //       replySelect(replyKeyboard.mid)
  //       replyToMarkup = true
  //     } else if (replyToMarkup) {
  //       replyClear()
  //     }
  //     var enabled = replyKeyboard &&
  //       !replyKeyboard.pFlags.hidden &&
  //       replyKeyboard._ == 'replyKeyboardMarkup'
  //     $scope.$broadcast('ui_keyboard_update', {enabled: enabled})
  //     $scope.$emit('ui_panel_update', {blur: enabled})
  //   }

  //   function replyKeyboardToggle ($event) {
  //     var replyKeyboard = $scope.historyState.replyKeyboard
  //     if (replyKeyboard) {
  //       replyKeyboard.pFlags.hidden = !replyKeyboard.pFlags.hidden
  //       updateReplyKeyboard()
  //     }
  //     return cancelEvent($event)
  //   }

  //   function onMessageChange (newVal, prevVal, a) {
  //     // console.log('ctrl text changed', newVal, prevVal);
  //     if (newVal === '' && prevVal === '') {
  //       return
  //     }

  //     if (newVal && newVal.length) {
  //       if (!$scope.historyFilter.mediaType && !$scope.historyState.skipped) {
  //         AppMessagesManager.readHistory($scope.curDialog.peerID)
  //       }
  //     }
  //     if ($scope.curDialog.peerID) {
  //       if (!editMessageID) {
  //         var replyToMsgID = $scope.draftMessage.replyToMsgID
  //         if (replyToMsgID &&
  //             $scope.historyState.replyKeyboard &&
  //             $scope.historyState.replyKeyboard.mid == replyToMsgID) {
  //           replyToMsgID = 0
  //         }
  //         DraftsManager.changeDraft($scope.curDialog.peerID, {
  //           text: newVal,
  //           replyToMsgID: replyToMsgID
  //         })
  //       }
  //       checkInlinePattern(newVal)
  //     }
  //   }

  //   var inlineUsernameRegex = /^@([a-zA-Z\d_]{1,32})( | )([\s\S]*)$/
  //   var inlineStickersEmojiRegex = /^\s*:(\S+):\s*$/
  //   var getInlineResultsTO = false
  //   var lastInlineBot = false
  //   var jump = 0

  //   function checkInlinePattern (message) {
  //     if (getInlineResultsTO) {
  //       $timeout.cancel(getInlineResultsTO)
  //     }
  //     var curJump = ++jump
  //     if (!message || !message.length) {
  //       delete $scope.draftMessage.inlineProgress
  //       $scope.$broadcast('inline_results', false)
  //       return
  //     }
  //     var matches = message.match(inlineUsernameRegex)
  //     if (!matches) {
  //       matches = message.match(inlineStickersEmojiRegex)
  //       if (matches) {
  //         var emojiCode = EmojiHelper.shortcuts[matches[1]]
  //         if (emojiCode) {
  //           $scope.draftMessage.inlineProgress = true
  //           AppStickersManager.searchStickers(emojiCode).then(function (docs) {
  //             var inlineResults = []
  //             angular.forEach(docs, function (doc) {
  //               inlineResults.push({
  //                 _: 'botInlineMediaResult',
  //                 qID: '_sticker_' + doc.id,
  //                 pFlags: {sticker: true},
  //                 id: doc.id,
  //                 type: 'sticker',
  //                 document: doc,
  //                 send_message: {_: 'botInlineMessageMediaAuto'}
  //               })
  //             })
  //             var botResults = {
  //               pFlags: {gallery: true},
  //               query_id: 0,
  //               results: inlineResults
  //             }
  //             botResults.text = message
  //             $scope.$broadcast('inline_results', botResults)
  //             delete $scope.draftMessage.inlineProgress
  //           })
  //         } else {
  //           delete $scope.draftMessage.inlineProgress
  //           $scope.$broadcast('inline_results', false)
  //           return
  //         }
  //       }
  //       delete $scope.draftMessage.inlineProgress
  //       $scope.$broadcast('inline_results', false)
  //       return
  //     }
  //     var username = matches[1]
  //     var inlineBotPromise
  //     $scope.draftMessage.inlineProgress = true
  //     if (lastInlineBot && lastInlineBot.username == username) {
  //       inlineBotPromise = $q.when(lastInlineBot)
  //     } else {
  //       inlineBotPromise = AppInlineBotsManager.resolveInlineMention(username)
  //     }
  //     inlineBotPromise.then(function (inlineBot) {
  //       if (curJump != jump) {
  //         return
  //       }
  //       lastInlineBot = inlineBot
  //       $scope.$broadcast('inline_placeholder', {
  //         prefix: '@' + username + matches[2],
  //         placeholder: inlineBot.placeholder
  //       })
  //       if (getInlineResultsTO) {
  //         $timeout.cancel(getInlineResultsTO)
  //       }
  //       getInlineResultsTO = $timeout(function () {
  //         var query = RichTextProcessor.parseEmojis(matches[3])
  //         AppInlineBotsManager.getInlineResults($scope.curDialog.peerID, inlineBot.id, query, inlineBot.geo, '').then(function (botResults) {
  //           getInlineResultsTO = false
  //           if (curJump != jump) {
  //             return
  //           }
  //           botResults.text = message
  //           $scope.$broadcast('inline_results', botResults)
  //           delete $scope.draftMessage.inlineProgress
  //         }, function () {
  //           $scope.$broadcast('inline_results', false)
  //           delete $scope.draftMessage.inlineProgress
  //         })
  //       }, 500)
  //     }, function (error) {
  //       $scope.$broadcast('inline_results', false)
  //       delete $scope.draftMessage.inlineProgress
  //     })
  //   }

  //   function onTyping () {
  //     if (AppPeersManager.isBroadcast($scope.curDialog.peerID)) {
  //       return false
  //     }
  //     MtpApiManager.invokeApi('messages.setTyping', {
  //       peer: AppPeersManager.getInputPeerByID($scope.curDialog.peerID),
  //       action: {_: 'sendMessageTypingAction'}
  //     })['catch'](function (error) {
  //       error.handled = true
  //     })
  //   }

  //   function onFilesSelected (newVal) {
  //     if (!angular.isArray(newVal) || !newVal.length) {
  //       return
  //     }
  //     var options = {
  //       replyToMsgID: $scope.draftMessage.replyToMsgID,
  //       isMedia: $scope.draftMessage.isMedia
  //     }

  //     delete $scope.draftMessage.replyToMsgID

  //     if (newVal[0].lastModified) {
  //       newVal.sort(function (file1, file2) {
  //         return file1.lastModified - file2.lastModified
  //       })
  //     }

  //     for (var i = 0; i < newVal.length; i++) {
  //       AppMessagesManager.sendFile($scope.curDialog.peerID, newVal[i], options)
  //       $scope.$broadcast('ui_message_send')
  //     }
  //     fwdsSend()
  //   }

  //   function onStickerSelected (newVal) {
  //     if (!newVal) {
  //       return
  //     }

  //     var doc = AppDocsManager.getDoc(newVal)
  //     if (doc.id && doc.access_hash) {
  //       var inputMedia = {
  //         _: 'inputMediaDocument',
  //         id: {
  //           _: 'inputDocument',
  //           id: doc.id,
  //           access_hash: doc.access_hash
  //         }
  //       }
  //       var options = {
  //         replyToMsgID: $scope.draftMessage.replyToMsgID
  //       }
  //       AppMessagesManager.sendOther($scope.curDialog.peerID, inputMedia, options)
  //       $scope.$broadcast('ui_message_send')

  //       fwdsSend()
  //       replyClear(true)
  //     }
  //     delete $scope.draftMessage.sticker
  //   }

  //   function onCommandSelected (command) {
  //     if (!command) {
  //       return
  //     }
  //     AppMessagesManager.sendText($scope.curDialog.peerID, command, {
  //       clearDraft: true
  //     })

  //     if (forceDraft == $scope.curDialog.peer) {
  //       forceDraft = false
  //     }

  //     fwdsSend()
  //     resetDraft()
  //     delete $scope.draftMessage.sticker
  //     delete $scope.draftMessage.text
  //     delete $scope.draftMessage.command
  //     delete $scope.draftMessage.inlineResultID
  //     $scope.$broadcast('ui_message_send')
  //     $scope.$broadcast('ui_peer_draft')
  //   }

  //   function onInlineResultSelected (qID) {
  //     if (!qID) {
  //       return
  //     }

  //     if (qID.substr(0, 11) == '_switch_pm_') {
  //       var botID = lastInlineBot.id
  //       var startParam = qID.substr(11)
  //       return AppInlineBotsManager.switchToPM($scope.curDialog.peerID, botID, startParam)
  //     }

  //     var options = {
  //       replyToMsgID: $scope.draftMessage.replyToMsgID,
  //       clearDraft: true
  //     }

  //     if (qID.substr(0, 9) == '_sticker_') {
  //       var docID = qID.substr(9)
  //       var doc = AppDocsManager.getDoc(docID)
  //       if (doc.id && doc.access_hash) {
  //         var inputMedia = {
  //           _: 'inputMediaDocument',
  //           id: {
  //             _: 'inputDocument',
  //             id: doc.id,
  //             access_hash: doc.access_hash
  //           }
  //         }
  //         AppMessagesManager.sendOther($scope.curDialog.peerID, inputMedia, options)
  //       }
  //     }
  //     else {
  //       AppInlineBotsManager.sendInlineResult($scope.curDialog.peerID, qID, options)
  //     }


  //     if (forceDraft == $scope.curDialog.peer) {
  //       forceDraft = false
  //     }

  //     fwdsSend()
  //     resetDraft()
  //     delete $scope.draftMessage.sticker
  //     delete $scope.draftMessage.text
  //     delete $scope.draftMessage.command
  //     delete $scope.draftMessage.inlineResultID
  //     $scope.$broadcast('ui_message_send')
  //     $scope.$broadcast('ui_peer_draft')
  //   }
  // })