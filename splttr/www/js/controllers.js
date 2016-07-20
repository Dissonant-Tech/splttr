angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $http, Popups) {
  
  console.log("In login controller");
  $scope.loginParams = {
    username: "",
    password: ""
  }

  $scope.loginUser = function(){
    console.log("Loging in...", $scope.loginParams);
    $http.post("http://localhost:8000/users/login/", $scope.loginParams)
      .success(function(data) {
        console.log("Successfully logged in");
        $state.go("tab.home")
      })
      .error(function(data) {
        console.log("Invalid login");
        Popups.showPopup("Invalid Login", "Sorry, an account with the provided username and password was not found");
      })
  };

})

.controller('SignupCtrl', function($scope, $state, Popups, $http) {
  
  console.log("In signup controller");

  $scope.signupPostParams = {
      name: "",
      email: "",
      username: "",
      password: ""
  }

  $scope.signupUser = function() {
    console.log("Signing up...");
    $http.post("http://localhost:8000/users/", $scope.signupPostParams)
      .success(function(data) {
        console.log("Successfully signed up user", data);

        // On successful signup, login user
        $http.post("http://localhost:8000/users/login/", {username: $scope.signupPostParams.username, password: $scope.signupPostParams.password})
          .success(function(data) {
            console.log("Successfully logged in");
            $state.go("tab.home")
          })

          .error(function(data) {
            console.log("Invalid login");
            Popups.showPopup("Invalid Login", "Sorry, an account with the provided username and password was not found");
          })
      })
      .error(function(data) {
        Popups.showPopup("Error", "Could not create account. Try again later.")
      })
  };

})

.controller('ForgotPasswordCtrl', function($scope, $http) {
  
  console.log("In forgot password controller");

  $scope.user = {
    username: ""
  }

  $scope.forgotPassword = function() {
    console.log("User forogt password", $scope.user.username);
  }

})

.controller('HomeCtrl', function($scope, $ionicModal, $state, $http, Tabs) {

  console.log("In home controller");

  // get all tabs
  $scope.tabs = Tabs.all();
  console.log($scope.tabs);

  // calculate total balance for each tab based on expense balances
  $scope.tabs.forEach(function(tab) {
    var totalBalance = 0;
    tab.expenses.forEach(function(expense) {
      totalBalance += expense.balance;
    });
    tab.balance = totalBalance;
  });

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
        balance: 0,
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

.controller('TabDetailViewCtrl', function($scope, $stateParams, $ionicModal, Popups, Tabs) {
  
  console.log("In tab detail view controller");
  $scope.tab = Tabs.get($stateParams.tabId);
  console.log($scope.tab);

  $scope.getImageUrl = function() {
    return "url(" + $scope.tab.bg_img + ")";
  }


  // load expense modal
  $ionicModal.fromTemplateUrl('templates/add-expense-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(expenseModal) {
    $scope.expenseModal = expenseModal;
    console.log("Expense Modal loaded");
  });

  // load Payment modal
  $ionicModal.fromTemplateUrl('templates/add-payment-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(PaymentModal) {
    $scope.PaymentModal = PaymentModal;
    console.log("Payment Modal loaded");
  });

  // modal functions
  $scope.openPaymentModal = function() {
    if($scope.tab.balance <= 0){
      Popups.showPopup("Whoops!", "This tab currently has an empty balance. Try adding an expense first!");
      return;
    }
    $scope.PaymentModal.show();
    console.log("Payment Modal opened");
    $scope.newPayment = {
      member_id: 0,
      expense: "",
      ammount_paid: ""
    }
  };

  $scope.closePaymentModal = function() {
    $scope.PaymentModal.hide();
    console.log("Payment Modal closed");
  };

  $scope.openExpenseModal = function() {
    $scope.expenseModal.show();
    console.log("Expense Modal opened");
    $scope.newExpense = {
      member_ids: [],
      expense_title: "",
      expense_ammount: ""
    }
  };

  $scope.closeExpenseModal = function() {
    $scope.expenseModal.hide();
    console.log("Expence Modal closed");
  };

  $scope.addPayment = function() {
    console.log("New payment added");
    console.log($scope.newPayment);
    $scope.tab.balance = ($scope.tab.balance - $scope.newPayment.ammount_paid).toFixed(2);
    $scope.closePaymentModal();
  }

  $scope.addExpense = function() {
    console.log("New expense added");
    console.log($scope.newExpense);
    $scope.tab.balance = (parseFloat($scope.tab.balance) + parseFloat($scope.newExpense.expense_ammount)).toFixed(2);
    $scope.closeExpenseModal();
  }

})

.controller('ExpenseDetailCtrl', function($scope, $stateParams) {
  
  console.log("In expense controller", $stateParams);

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
