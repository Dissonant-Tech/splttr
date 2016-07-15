angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicModal, Tabs) {

  console.log("In home controller");

  // get all tabs
  $scope.tabs = Tabs.all();
  console.log($scope.tabs);

  // setup modal for creating tab
  $ionicModal.fromTemplateUrl('templates/home-tab-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("Modal loaded");
  });

  // modal functions
  $scope.openModal = function() {
    $scope.modal.show();
    console.log("Modal opened");

    $scope.newTab = {
        id: 0,
        title: "",
        balance: "",
        debt: true,
        bg_img: "./img/tab3-background.jpg",
        desc: "",
        squad: []
    }


  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    console.log("Modal closed");
  };

  $scope.saveNewTab = function(){
    console.log("Saving new tab");
    Tabs.add($scope.newTab);
    $scope.closeModal();
  }


  // Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });

  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


$scope.chats = Chats.all();

$scope.remove = function(chat) {
  Chats.remove(chat);
};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
