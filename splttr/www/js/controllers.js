angular.module('starter.controllers', ['ion-image-search'])

.controller('LoginCtrl', function($scope, $http, User) {
  
  console.log("In login controller");
  $scope.loginParams = {
    username: "",
    password: ""
  }

  $scope.loginUser = function(){
    console.log("Loging in...", $scope.loginParams);
    User.login($scope.loginParams);
  };


})

.controller('SignupCtrl', function($scope, User, $http) {
  
  console.log("In signup controller");

  $scope.signupPostParams = {
      password: "",
      username: "",
      email: ""
  }

  $scope.signupUser = function() {
    User.signup($scope.signupPostParams).then(function(){

      // if signup was successful, log in user
      var loginParams = {
        username: $scope.signupPostParams.username,
        password: $scope.signupPostParams.password
      }

      User.login(loginParams);
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

.controller('HomeCtrl', function($scope, $ionicModal, $state, $http, User, Tabs) {

  // load user data before entering home state
  $scope.$on("$ionicView.beforeEnter", function(event, data){
      
      // get user data from API
      User.get().then(function(user){
        $scope.user = user.data;
      }); 

  });

  console.log("In home controller");

  // get all tabs
  $scope.tabs = Tabs.all();

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

    $scope.newTabParams = {
        name: "",
        description: "",
        members: [13]
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
    console.log("Saving new tab", $scope.newTabParams);
    Tabs.addTab($scope.newTabParams).then(function(){
      $scope.closeModal();
    })
  }

})

.controller('TabDetailViewCtrl', function($scope, $state, $ionicActionSheet, $webImageSelector, $stateParams, $ionicModal, Popups, Tabs) {
  
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
          switch(index){
            case 0:
              $scope.openImageChooserModal();
          }
          if(index == 0){
            
          }
          return true;
        },
        destructiveButtonClicked: function() {
          console.log("Removing tab..")
          Tabs.remove($scope.tab);
          $state.go('tab.home');
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

})

.controller('AccountCtrl', function($scope, $ionicModal, $state, $rootScope, Popups, User) {

  // load user data before entering home state
  $scope.$on("$ionicView.beforeEnter", function(event, data){
      
      // get user data from API
      User.get().then(function(user){
        $scope.user = user.data;
        console.log("In account controller")
      }); 

  });
  

  // Delete User from DB
  $scope.deleteAccount = function(){
    Popups.showConfirm("Delete Account", "Are you sure you want to delete your account?", function(){
      
      // user clicked "OK"
      User.delete($scope.user.id);
      $scope.closeModal();

      // return to login state
      $state.go("login");
    }, function(){

      // user clicked "Cancel"
      $scope.closeModal();
      console.log("Did not delete account");
    })
  }

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

  // update User data in DB
  $scope.saveProfileEdits = function() {
    
    console.log("saving edits", $scope.newProfileDetails)
    User.edit($scope.user.id, $scope.newProfileDetails);
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
