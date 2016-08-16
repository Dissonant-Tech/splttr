angular.module('starter.controllers', ['ion-image-search'])

.controller('LoginCtrl', function($scope, $http, User) {
  
  $scope.$on("$ionicView.beforeEnter", function(event, data){
      
      // get user data from API
      console.log("In login controller");
      
      $scope.loginParams = {
        username: "",
        password: "",
        Authorization: "Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
      }   

  });

  $scope.loginUser = function(){
    User.login($scope.loginParams);
  };

})

.controller('SignupCtrl', function($scope, User, $http) {
  
  console.log("In signup controller");

  $scope.signupPostParams = {
      password1: "",
      password2: "",
      username: "",
      email: "",
      Authorization: "Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
  }

  $scope.signupUser = function() {
    User.signup($scope.signupPostParams).then(function(){

      // if signup was successful, log in user
      var loginParams = {
        username: $scope.signupPostParams.username,
        password: $scope.signupPostParams.password1,
        Authorization: "Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
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

  // Load home state from API
  $scope.$on("$ionicView.beforeEnter", function(event, data){
      
      // Get user data and Tabs from DB
      User.get().then(function(user){
        $scope.user = user.data;
        Tabs.get($scope.user.id).then(function(res){
          $scope.tabs = res.data;
        })
      }); 

  });

  console.log("In home controller");

  // =======  MODAL FUNCTIONS =======

  // load modal
  $ionicModal.fromTemplateUrl('templates/home-tab-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
    console.log("Modal opened");

    $scope.newTabParams = {
        name: "",
        description: "",
        members: [JSON.stringify($scope.user.id)]
    }
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    console.log("Modal closed");
  };

  // Add members to new Tab
  $scope.addMemberToTab = function(member) {
    console.log("Member added");

  }

  // Add new Tab to DB
  $scope.saveNewTab = function(){
    console.log("Saving new tab", $scope.newTabParams);
    Tabs.addTab($scope.newTabParams).then(function(res){
      $scope.tabs.push(res.data);
      $scope.closeModal();
    })
  }

})

.controller('TabDetailViewCtrl', function($scope, $state, $ionicActionSheet, $webImageSelector, $stateParams, $ionicModal, Popups, Tabs, Events, Bills) {
  
  // Get Tab details and events from DB
  Tabs.getWithId($stateParams.tabId).then(function(res){
    $scope.tab = res.data;

    // get all expenses
    Events.getAll($scope.tab.id).then(function(events){
      $scope.expenses = events.data;

      // get bill per expense
      $scope.expenses.forEach(function(expense){
         Bills.getBill(expense.id).then(function(bill){
            expense.amount = bill.amount;
         });
      })
    })
  });


  // Analytics chart legends
  $scope.labels = ['M','T','W','T','F','S','S'];
  $scope.data = [
    [45,12,65,12,76,16]
  ];
  $scope.series = ['Expenses'];

	$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
		$scope.options = {
			scales: {
				yAxes: [
					{
						id: 'y-axis-1',
						type: 'linear',
						display: true,
						position: 'left'
					},
					{
						id: 'y-axis-2',
						type: 'linear',
						display: true,
						position: 'right'
					}
				]
			}
		};
	  

  // Open web mage search modal
  $scope.openImageChooserModal = function(){
    $webImageSelector.show().then(function(image){
      Tabs.edit($scope.tab.id, "bg_img", image.image.url);
    });
  }

  // Open action sheet
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
              // Add Cover Photo Chosen
              $scope.openImageChooserModal();
          }
          return true;
        },
        destructiveButtonClicked: function() {
          console.log("Removing tab..")
          Tabs.remove($scope.tab.id).then(function(){
            $state.go("tab.home");
          })
          return true;
        }
      });    
  }

  // Load expense modal
  $ionicModal.fromTemplateUrl('templates/add-expense-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(expenseModal) {
    $scope.expenseModal = expenseModal;
  });

  // Load Payment modal
  $ionicModal.fromTemplateUrl('templates/add-payment-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(PaymentModal) {
    $scope.PaymentModal = PaymentModal;
  });

  // Open Payment Modal
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

  // Close Payment Modal
  $scope.closePaymentModal = function() {
    $scope.PaymentModal.hide();
    console.log("Payment Modal closed");
  };

  // Open Expense Modal
  $scope.openExpenseModal = function() {
    $scope.expenseModal.show();
    console.log("Expense Modal opened");
    $scope.newExpenseParams = {
      name: "",
      description: "Desc",
      tab: $scope.tab.id
    }

    $scope.newBillParams = {
      amount: 0,
      creditor: 30,
      event: ""
    }
  };

  // Close Expense Modal
  $scope.closeExpenseModal = function() {
    $scope.expenseModal.hide();
    console.log("Expence Modal closed");
  };

  // Add Payment to Tab
  $scope.addPayment = function() {
    $scope.tab.balance = ($scope.tab.balance - $scope.newPayment.ammount_paid).toFixed(2);
    $scope.closePaymentModal();
  }

  // Add Expense to Tab
  $scope.addExpense = function() {
    Events.addExpense($scope.newExpenseParams).then(function(res){
        var newEventId = res.data.id;
        $scope.newBillParams.event = newEventId;

        // Add bill to event
        Bills.addBill($scope.newBillParams).then(function(){
            $scope.closeExpenseModal();
        })
    });
  }

  	$scope.chart = "chart";

	$scope.toggleAnalytics = function(chart) {
      if ($scope.isAnalyticsShown(chart)) {
	        $scope.shownAnalytics = null;

	      } else {
		        $scope.shownAnalytics = chart;
		      }
    };
	$scope.isAnalyticsShown = function(chart) {
	    return $scope.shownAnalytics === chart;
	  };

})

.controller('ExpenseDetailCtrl', function($scope, $stateParams) {
  
  console.log("In expense controller", $stateParams);

})

.controller('ActivityCtrl', function($scope, Tabs) {

  
  console.log("In activity controller");

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

  // Load modal
  $ionicModal.fromTemplateUrl('templates/edit-profile-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("Edit profile modal loaded");
  });

  // Profile edit button clicked
  $scope.editProfile = function() {
    $scope.openModal();
    $scope.newProfileDetails = {
      username: $scope.user.username,
      name: $scope.user.name
    }
  }

  // Edit User data in DB
  $scope.saveProfileEdits = function() {
    
    console.log("saving edits", $scope.newProfileDetails)
    User.edit($scope.user.id, $scope.newProfileDetails).then(function(){
      User.get().then(function(user){
        $scope.user = user.data;
        $scope.closeModal();
      })
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    console.log("Edit profile modal closed");
  };

  $scope.openModal = function() {
    $scope.modal.show();
    console.log("Edit profile modal opened");
  };

  $scope.signOut = function() {
    User.signOut();
  }

});
