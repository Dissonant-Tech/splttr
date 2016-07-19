angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {
  
  console.log("In login controller");

})

.controller('SignupCtrl', function($scope, $http) {
  
  console.log("In signup controller");

  $scope.signupPostParams = {
      name: "",
      email: "",
      username: "",
      password: ""
  }

  $scope.signupUser = function() {
    console.log("Signing up...");
    $http.post("http://localhost:8888/users/", $scope.signupPostParams)
      .success(function(data) {
        console.log(data);
      })
      .error(function(data) {
        alert("Could not create account");
      })
  };

})

.controller('HomeCtrl', function($scope, $ionicModal, $state, $http, Tabs) {

  console.log("In home controller");

  // get all tabs
  $scope.tabs = Tabs.all();
  console.log($scope.tabs);

  $scope.getUsers = function() {
    $http.get("http://localhost:8888/users/", { params: {"key1" : "value1", "key2" : "value2"} })
      .success(function(data) {
        console.log(data);
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

.controller('TabDetailViewCtrl', function($scope, $stateParams, $ionicModal, Tabs) {
  
  console.log("In tab detail view controller");
  $scope.tab = Tabs.get($stateParams.tabId);
  console.log($scope.tab);

  $scope.getImageUrl = function() {
    return "url(" + $scope.tab.bg_img + ")";
  }

  // load modal
  $ionicModal.fromTemplateUrl('templates/add-expense-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(expenseModal) {
    $scope.expenseModal = expenseModal;
    console.log("Expense Modal loaded");
  });

  $scope.openExpenseModal = function() {
    $scope.expenseModal.show();
    console.log("Expense Modal opened");
  };

  $scope.closeExpenseModal = function() {
    $scope.expenseModal.hide();
    console.log("Expence Modal closed");
  };



})

.controller('AnalyticsCtrl', function($scope) {
  
  console.log("In analytics controller");

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
})

.controller('AccountCtrl', function($scope, User) {

  console.log("In account controller");
  $scope.user = User.get();
  console.log($scope.user);

});
