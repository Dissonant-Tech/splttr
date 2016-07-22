angular.module('starter.controllers', ['ion-image-search'])

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
    Tabs.getTotalBalance(tab.id);
  });

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
        bg_img: "",
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
    Tabs.addTab($scope.newTab);
    $scope.closeModal();
  }

})

.controller('TabDetailViewCtrl', function($scope, $ionicActionSheet, $webImageSelector, $stateParams, $ionicModal, Popups, Tabs) {
  
  console.log("In tab detail view controller");
  $scope.tab = Tabs.get($stateParams.tabId);
  console.log($scope.tab);

  // web image search modal
  $scope.openImageChooserModal = function(){
    $webImageSelector.show().then(function(image){
      Tabs.edit($scope.tab.id, "bg_img", image.image.url);
    });
  }

  $scope.getImageUrl = function() {
    return "url(" + $scope.tab.bg_img + ")";
  }

  // action sheet
  $scope.openActionSheet = function() {
    $ionicActionSheet.show({
        titleText: $scope.tab.title,
        buttons: [
          { text: 'Add Cover Photo' }
        ],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          console.log('BUTTON CLICKED', index);
          if(index == 0){
            $scope.openImageChooserModal();
          }
          return true;
        },
        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          return true;
        }
      });    
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
      title: "",
      balance: ""
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
    Tabs.addExpense($scope.tab.id, $scope.newExpense);
    console.log("New expense added");
    Tabs.getTotalBalance($scope.tab.id);
    // $scope.tab.balance = (parseFloat($scope.tab.balance) + parseFloat($scope.newExpense.expense_ammount)).toFixed(2);
    $scope.closeExpenseModal();
  }

})

.controller('ExpenseDetailCtrl', function($scope, $stateParams) {
  
  console.log("In expense controller", $stateParams);

})

.controller('AnalyticsCtrl', function($scope, Tabs) {

  
  console.log("In analytics controller");
  $scope.tabs = Tabs.all();

  // for chart legends
  $scope.labels = [];
  $scope.data = [
    []
  ];
  $scope.series = ['Expenses'];

  $scope.tabs.forEach(function(tab) {
    tab.expenses.forEach(function(expense) {
      $scope.labels.push(expense.title);
      $scope.data[0].push(expense.balance);
    });
  });



  console.log($scope.labels, $scope.data);

//   $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    
//     $scope.data = [
//         [65, 59, 80, 81, 56, 55, 40]
//     ];
})

.controller('AccountCtrl', function($scope, $ionicModal, $rootScope, User) {

  // $scope.$on("$ionicView.beforeEnter", function(event, data){
  //   // get user data from API
  //   $scope.user = User.get("12").then(function(user){
  //     $scope.user = user.data;
  //   }); 
  // });

  // get user from API
  User.get("12");
  console.log("In account controller");
  console.log($rootScope.user);

  // load modal
  $ionicModal.fromTemplateUrl('templates/edit-profile-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("Edit profile modal loaded");
  });

  // profile edit button clicked
  $scope.editProfile = function() {
    $scope.openModal();
    $scope.newProfileDetails = {
      username: $scope.user.username,
      name: $scope.user.name
    }
  }

  $scope.saveProfileEdits = function() {
    var validProfileEdit = true;
    
    // validation of new profile details
    console.log("saving edits", $scope.newProfileDetails)
    if(validProfileEdit){
      $scope.closeModal();
    }
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    console.log("Edit profile modal closed");
  };

  $scope.openModal = function() {
    $scope.modal.show();
    console.log("Edit profile modal opened");
  };

});
