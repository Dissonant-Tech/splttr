angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, Tabs) {




  console.log("In home controller");

  $scope.getSquadMemberOutlineColor = function(member){
    if(member.status === "in_debt"){
      return "#f04124";
    }
    else{
      return "#43AC6A";
    }
  }

  $scope.tabs = Tabs.all();
  console.log($scope.tabs);

  // $scope.tabs.forEach(function(tab){
  //   tab.squad.forEach($scope.getSquadMemberOutlineColor);
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
