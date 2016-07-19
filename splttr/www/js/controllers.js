angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicModal, $state, $http, Tabs) {

  console.log("In home controller");

  // get all tabs
  $scope.tabs = Tabs.all();
  console.log($scope.tabs);

  $scope.getUsers = function() {
    $http.get("http://localhost:8888/users/", { params: {"key1" : "value1", "key2" : "value2"} })
      .success(function(data) {
        console.log(data);
        $scope.username = data[0].username;
      })
      .error(function(data) {
        alert("Could not retrieve users");
      })
  };

  // =======  MODAL FUNCTIONS =======

  // load modal
  $ionicModal.fromTemplateUrl('templates/home-tab-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("Modal loaded");
  });

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
        squad: [
          {
            user_id: 0,
            name: "Martin",
            img: "./img/ben.png",
            debt: false,
          },
          {
            user_id: 1,
            name: "Martin",
            img: "./img/adam.jpg",
            debt: false,
          }
        ]
    }
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    console.log("Modal closed");
  };

  $scope.addMemberToTab = function(member) {
    console.log("Member added");

  }

  $scope.saveNewTab = function(){
    console.log("Saving new tab");
    Tabs.add($scope.newTab);
    $scope.closeModal();
  }

})


.controller('LoginCtrl', function($scope) {
  
  console.log("In login controller");

})

.controller('TabDetailViewCtrl', function($scope, $stateParams, Tabs) {
  
  console.log("In tab detail view controller");
  $scope.tab = Tabs.get($stateParams.tabId);
  console.log($scope.tab);

  $scope.getImageUrl = function() {
    return "url(" + $scope.tab.bg_img + ")";
  }

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

.controller('AccountCtrl', function($scope, User) {

  console.log("In account controller");
  $scope.user = User.get();
  console.log($scope.user);

});
