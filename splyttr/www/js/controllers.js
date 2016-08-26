angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, User) {
  
  $scope.$on("$ionicView.beforeEnter", function(event, data){
      
      // get user data from API
      console.log("In login controller");
      
      $scope.loginParams = {
        username: "user",
        password: "rojomartin95"
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
      email: ""
  }

  $scope.signupUser = function() {
    User.signup($scope.signupPostParams).then(function(){

      // if signup was successful, log in user
      var loginParams = {
        username: $scope.signupPostParams.username,
        password: $scope.signupPostParams.password1
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

          // Get balance for each tab
          $scope.tabs.forEach(function(tab, index, tabs){
            Tabs.getRemainingBalance(tab.id).then(function(res){
              tabs[index].total = res.data.total;
            })       
          })
        })
      }); 

  });

  // Pull to refresh tab list
  $scope.refreshTabList = function(){
    Tabs.get($scope.user.id).then(function(res){
      $scope.tabs = res.data
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

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

    $scope.newTabParams = {
        name: "",
        description: "",
        members: [JSON.stringify($scope.user.id)]
    }
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Add members to new Tab. If they have already been added, they will be removed
  $scope.addMemberToTab = function($event) {

    if($event.target.classList.contains('added')){
      $event.target.classList.remove('added');
      var members = $scope.newTabParams.members;
      members.splice(members.indexOf(this.result.id), 1);
      console.log(this.result.username + ' removed from tab');
      return;
    }

    $event.target.classList.add('added');
    $scope.newTabParams.members.push(this.result.id);
    console.log(this.result.username + ' added to tab');
  }

  // Add new Tab to DB
  $scope.saveNewTab = function(){
    console.log("Saving new tab", $scope.newTabParams);
    Tabs.addTab($scope.newTabParams).then(function(res){
      // init a tab with a balance of $0
      res.data.total = 0;
      $scope.tabs.push(res.data);
      $scope.closeModal();
    })
  }


  // ====== Search user functions =====

  $scope.search = {
    text: ''
  };

  $scope.searchUser = function(query) {
    
    // If user has erased search, remove search results from view
    if(query === ''){
      $scope.searchResults = [];
      return
    }

    var usersList = [];

    $scope.searchResults = [
      {
        username: query,
        bg_img: 'img/black-user.png',
        anonymous: true
      }
    ];

    // Search users on each keypress of the search bar
    User.getAll().then(function(res){
      usersList = res.data;

      // Fuzzy search users list with given query
      for(i in usersList){
        if (usersList[i].username.indexOf(query) !== -1) {
          $scope.searchResults.push(usersList[i]);
        }
      }

    })

  }

})

.controller('TabDetailViewCtrl', function($scope, $state, $ionicActionSheet, $ionicModal, $stateParams, $ionicModal, User, Popups, Tabs, Events, Bills) {

  $scope.$on("$ionicView.loaded", function(){
      var tabData = {};
      $scope.tab = {
        name: '',
        description: '',
        members: [],
        id: 0
      };

      // Get Tab details
      Tabs.getWithId($stateParams.tabId).then(function(res){
        var tabData = res.data;
        
        $scope.tab.name = tabData.name;
        $scope.tab.description = tabData.description;
        $scope.tab.id = tabData.id; 

        // Get Tab remaining balance
        Tabs.getRemainingBalance($scope.tab.id).then(function(res){
          $scope.tab.total = res.data.total;
        })

        // Get User info for each member
        tabData.members.forEach(function(userID){
          User.getWithId(userID).then(function(res){
            var user = res.data;
            $scope.tab.members.push(user);
          })
        });

        // Get Tab events and their totals
        Events.getAll($scope.tab.id).then(function(events){
          $scope.expenses = events.data;
  
          $scope.expenses.forEach(function(expense, index, expenses){
            Events.getRemainingBalance(expense.id).then(function(res){
              expenses[index].total = res.data.total;
            })
          });
        })
      });
  });

  // Open action sheet
  $scope.openActionSheet = function() {
    $ionicActionSheet.show({
        titleText: $scope.tab.title,
        buttons: [
          
        ],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
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
    $scope.newPayment = {
      member_id: 0,
      expense: "",
      ammount_paid: ""
    }
  };

  // Close Payment Modal
  $scope.closePaymentModal = function() {
    $scope.PaymentModal.hide();
  };

  // Open Expense Modal
  $scope.openExpenseModal = function() {
    $scope.expenseModal.show();

    $scope.newExpenseParams = {
      name: "",
      description: "",
      tab: $scope.tab.id
    }

    User.get().then(function(res){
      $scope.newBillParams = {
        a_debtor: false,
        amount: 0,
        creditor: res.data.id,
        debtor: 0,
        event: 0
      }
    });

  };

  // Close Expense Modal
  $scope.closeExpenseModal = function() {
    $scope.expenseModal.hide();
  };

  /* =========================

    ADD EXPENSE

    ==========================
  */

  $scope.search = '';
  $scope.newBillAmounts = [];

  $scope.addUserBill = function(index, userID) {
      $scope.newBillAmounts[index].id = userID;
  }

  $scope.addNewExpense = function() {
    $scope.newExpenseParams.tab = $scope.tab.id;

    // Add Event to Tab via api, then add each Bill to that exent
    Events.addExpense($scope.newExpenseParams).then(function(res){

      var createdExpense = res.data;

      // Tie each new bill to the event they belong to, which is the one we just created
      $scope.newBillParams.event = createdExpense.id;

      // Create Bill for each member in expense
      $scope.newBillAmounts.forEach(function(bill, index, bills){

        // Set new bill paramaters for API
        $scope.newBillParams.amount = bill.amount;
        $scope.newBillParams.debtor = bill.id;
        
        Bills.addBill($scope.newBillParams).then(function(){

          // After last bill is created, calculate total for event which was just created
          if(bills.length-1 === index){

            Events.getRemainingBalance(createdExpense.id).then(function(res){
              createdExpense.total = res.data.total;
              $scope.expenses.push(createdExpense)

              // Get Tab remaining balance
              Tabs.getRemainingBalance($scope.tab.id).then(function(res){
                $scope.tab.total = res.data.total;
              })

            })
          }
        })
      });

      $scope.closeExpenseModal();

    })
  }
 
  
})

.controller('ExpenseDetailCtrl', function($scope,$rootScope, $state, $ionicHistory, $stateParams, Tabs, Events, User) {

  // Get expense details
  Events.get($stateParams.expenseId).then(function(res){
    $scope.expense = res.data;

    // Get expense total
    Events.getRemainingBalance($scope.expense.id).then(function(res){
      $scope.expense.total = res.data.total;
    });

    // Get expense members and bills
    Events.getBills($scope.expense.id).then(function(res){
      $scope.bills = res.data;

      // Get user info for each bill
      $scope.bills.forEach(function(bill, index, bills){
        User.getWithId(bill.debtor).then(function(res){
          bill.username = res.data.username;
          bill.bg_img = res.data.bg_img;
        });
      })
    })
  })

  
  // Remove Expense and go back to parent tab 
  $scope.deleteExpense = function(){
    $ionicHistory.clearCache().then(function(){
      Events.remove($scope.expense.id).then(function(){
        $ionicHistory.goBack();
      })
    })
  }


})

.controller('ActivityCtrl', function($scope, Tabs) {

  
  console.log("In activity controller");

})

.controller('AccountCtrl', function($scope, $ionicModal, $state, Popups, User) {

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
