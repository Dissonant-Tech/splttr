angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, User) {

  $scope.$on("$ionicView.beforeEnter", function(event, data){

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
          calculateTabTotal($scope.tabs);
        })
      });

  });

  // Get balance for each tab
  function calculateTabTotal(tabList){
    tabList.forEach(function(tab, index, tabs){
      Tabs.getRemainingBalance(tab.id).then(function(res){
        tabs[index].total = res.data.total;
      })
    })
  }

  // Pull to refresh
  $scope.refreshTabList = function(){
    Tabs.get($scope.user.id).then(function(res){
      $scope.tabs = res.data
      calculateTabTotal($scope.tabs);

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
        members: [$scope.user.id],
        owner: $scope.user.id
    }
    $scope.addedMembers = [{username: 'You', bg_img: null}];

  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Add members to new Tab. If they have already been added, they will be removed
  $scope.addMemberToTab = function($event) {

    // Case 0: member is already added to tab
    if($scope.newTabParams.members.indexOf(this.result.id) > 0){
      return;
    }

    // Case 1: member is not yet added to tab
    $scope.newTabParams.members.push(this.result.id);
    $scope.addedMembers.push(this.result);
  }

  $scope.removeMemberFromTab = function($index){
    if($index !== 0){
      $scope.addedMembers.splice($index, 1);
      $scope.newTabParams.members.splice($index, 1);
    }
  }

  // Add new Tab to DB
  $scope.saveNewTab = function(){
    console.log("Saving new tab", $scope.newTabParams);
    Tabs.addTab($scope.newTabParams).then(function(res){
      console.log(res);
      // init a tab with a balance of $0
      res.data.total = 0;
      $scope.tabs.push(res.data);
      $scope.closeModal();
      $scope.search.text = '';
      $scope.searchResults = [];
    })
  }


  // ====== Search user functions =====

  $scope.search = {
    text: ''
  };

  var usersList = [];

  $scope.searchUser = function(query) {

    // If user has erased search, remove search results from view
    if(query === ''){
      $scope.searchResults = [];
      return
    }

    $scope.searchResults = [
      {
        username: query,
        bg_img: 'img/anonymous-user.png',
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
          console.log($scope.searchResults)
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

      User.get().then(function(res){
        $scope.currentUser = res.data;
         return res.data;
      }).then(function(currentUser){
          // Get Tab details
          Tabs.getWithId($stateParams.tabId).then(function(res){
            var tabData = res.data;

            $scope.tab.name = tabData.name;
            $scope.tab.description = tabData.description;
            $scope.tab.id = tabData.id;
            $scope.tab.owner = tabData.owner;
            $scope.tab.owner_name = tabData.owner_name;

            if(currentUser.id === $scope.tab.owner){
              $scope.self = true;
            } else {
              $scope.self = false;
            }

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
      })
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
      member: "",
      expense: "",
    }
  };

  // Close Payment Modal
  $scope.closePaymentModal = function() {
    $scope.PaymentModal.hide();
  };

  // Open Expense Modal
  $scope.openExpenseModal = function() {
    $scope.expenseModal.show();
    $scope.search = {
      text: ''
    }
    $scope.newExpenseParams = {
      name: "",
      description: "",
      tab: $scope.tab.id
    }

    User.get().then(function(res){
      $scope.newCreditor = res.data.id;
    });

  };

  // Close Expense Modal
  $scope.closeExpenseModal = function() {
    $scope.expenseModal.hide();
    $scope.search.text = "";
    $scope.newExpenseParams = {
      name: "",
      description: "",
      tab: $scope.tab.id
    }
    $scope.newBillAmounts = [];
  };

  $scope.newPaymentExpenseSelected = function(){
    Events.get($scope.newPayment.expense.id).then(function(res){
      $scope.newPaymentMembers = res.data.event_bills.filter((bill) => {
        return !bill.is_paid
      })
    })
  }

  $scope.newPaymentMemberSelected = function(){
    $scope.newPaymentAmount = $scope.newPayment.member.amount;
  }

  $scope.addPayment = function(){
    console.log($scope.newPayment);
     Bills.payBill($scope.newPayment.member.id, {is_paid: true}).then(function(res){
      console.log(res);
      $scope.closePaymentModal();
     })
  }

  /* =========================

    ADD EXPENSE

    ==========================
  */

  $scope.search = '';
  $scope.newBillAmounts = [];

  $scope.addUserBill = function(index, user) {

      $scope.newBillAmounts[index].debtor = user.id;
      $scope.newBillAmounts[index].a_debtor = false;
      $scope.newBillAmounts[index].creditor = $scope.newCreditor;
  }

  $scope.addNewExpense = function() {
    $scope.newExpenseParams.tab = $scope.tab.id;
    $scope.newExpenseParams.owner = $scope.currentUser.id;

    // Add Event to Tab via api, then add each Bill to that exent
    Events.addExpense($scope.newExpenseParams).then(function(res){
      var createdExpense = res.data;

      console.log('newBillAmounts', $scope.newBillAmounts);


      // Add event ID to each new bill
      for(var i = 1; i < $scope.newBillAmounts.length; i++){
        $scope.newBillAmounts[i].event = createdExpense.id;
      }

      //Create Bill for each member in expense
      $scope.newBillAmounts.forEach(function(bill, index, bills){

        Bills.addBill(bill).then(function(res){
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
        });
      });

      $scope.closeExpenseModal();

    })
  }


})

.controller('ExpenseDetailCtrl', function($scope,$rootScope, $state, $ionicHistory, $stateParams, Tabs, Events, User) {

  // Get expense details
  User.get().then(function(res){
    return res.data;
  }).then(function(currentUser){
    Events.get($stateParams.expenseId).then(function(res){
      $scope.expense = res.data;
      if(currentUser.id === $scope.expense.owner){
        $scope.self = true;
      } else {
        $scope.self = false;
      }

      // Get expense total
      Events.getRemainingBalance($scope.expense.id).then(function(res){
        $scope.expense.total = res.data.total;
      });
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

.controller('ActivityCtrl', function($scope, User) {

  // Load home state from API
  $scope.$on("$ionicView.beforeEnter", function(event, data){

      // Get user data and Tabs from DB
      User.get().then(function(user){
        $scope.user = user.data;
        User.getActivity($scope.user.id).then(function(res){
          console.log(res.data)
          $scope.activities = res.data;
        })
      });

  });

  // Pull to refresh tab list
  $scope.refreshTabList = function(){
    User.getActivity($scope.user.id).then(function(res){
      $scope.activities = res.data
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

})

.controller('AccountCtrl', function($scope, Tabs, Bills, $stateParams, $ionicModal, $state, Popups, User) {

  // load user data before entering home state
  $scope.$on("$ionicView.beforeEnter", function(event, data){

    // Case 0: Current user account
    if($stateParams.userId === 'self'){
      $scope.self = true;
      User.get().then(function(user){
        $scope.user = user.data;
        return Tabs.get($scope.user.id)
      }).then(function(res){

        // Calculate chart data (tab name & total)
        var recentTabs = res.data.splice(0, 4);
        $scope.labels = [];
        $scope.data = [];

        console.log('Recent tabs:', recentTabs);

        recentTabs.forEach(function(tab, index, recentTabs){
          Tabs.getRemainingBalance(tab.id).then(function(res){
            recentTabs[index].total = res.data.total;
            $scope.labels.push(recentTabs[index].name.slice(0, 10));
            $scope.data.push(recentTabs[index].total);
          })
        })
      });
    }

    // Case 1: Not current user account
    else{
      User.getWithId($stateParams.userId).then(function(user){
        $scope.user = user.data;
        return User.get();
      }).then(function(user){
        $scope.currentUser = user.data;

        return Tabs.getCommon($scope.user.id, $scope.currentUser.id);
      }).then(function(commonData){
        $scope.commonTabs = commonData.data;
      });
    }
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
  };

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.signOut = function() {
    User.signOut();
  }

});
