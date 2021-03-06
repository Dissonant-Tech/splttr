// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'chart.js'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required

      StatusBar.style(1);

    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })

  .state('profile-picture', {
    url: '/profile-picture',
    templateUrl: 'templates/profile-picture.html',
    controller: 'ProfilePictureCtrl',
    params: { signupInfo: null }
  })

  .state('forgot-password', {
    url: '/forgot-password',
    templateUrl: 'templates/forgot-password.html',
    controller: 'ForgotPasswordCtrl'
  })

  .state('tab.tab-detail-view', {
    url: '/home/:tabId',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-detail-view.html',
        controller: 'TabDetailViewCtrl'
      }
    }
  })

  .state('tab.tab-detail-view-account', {
    url: '/home/account/:userId',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.expense-detail-view', {
    url: '/home/:tabId/:expenseId',
    views: {
      'tab-home': {
        templateUrl: 'templates/expense-detail.html',
        controller: 'ExpenseDetailCtrl'
      }
    }
  })

  .state('tab.activity', {
      url: '/activity',
      views: {
        'tab-activity': {
          templateUrl: 'templates/tab-activity.html',
          controller: 'ActivityCtrl'
        }
      }
    })

    .state('tab.activity-expense-detail-view', {
      url: '/activity/:tabId/:expenseId',
      views: {
        'tab-activity': {
          templateUrl: 'templates/expense-detail.html',
          controller: 'ExpenseDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account/:userId',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });


  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
