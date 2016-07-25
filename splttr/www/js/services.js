angular.module('starter.services', [])

.factory('Tabs', function($http, Popups){

  // Collection of all tabs

  var tabs = [
  {
      id: 1,
      title: "Apartment",
      balance: 0,
      debt: true,
      bg_img: "./img/tab2-background.jpg",
      desc: "This is tab1's description",
      expenses: [
        {
          id: 0,
          title: "Groceries",
          balance: 68.98,
          members: []
        },
        {
          id: 1,
          title: "Utilities",
          balance: 90.12,
          members: []
        },
        {
          id: 2,
          title: "New TV",
          balance: 502.23,
          members: []
        }
      ],
      members: [
        {
          user_id: 0,
          name: "Martin",
          img: "./img/max.png",
          debt: true,
        },
        {
          user_id: 1,
          name: "Martin",
          img: "./img/ben.png",
          debt: false,
        },
        {
          user_id: 2,
          name: "Martin",
          img: "./img/adam.jpg",
          debt: false,
        }
      ]
    },
    {
      id: 2,
      title: "New York Trip",
      balance: 0,
      debt: true,
      bg_img: "./img/tab1-background.jpg",
      desc: "This is tab2's description",
      expenses: [
        {
          id: 0,
          title: "Hotel",
          balance: 145.23,
          members: []
        },
        {
          id: 1,
          title: "Food",
          balance: 83.12,
          members: []
        },
        {
          id: 2,
          title: "Gas",
          balance: 65.21,
          members: []
        }
      ],
      members: [
        {
          user_id: 0,
          name: "Martin",
          img: "./img/ben.png",
          debt: true,
        },
        {
          user_id: 1,
          name: "Martin",
          img: "./img/adam.jpg",
          debt: true,
        },
        {
          user_id: 2,
          name: "Martin",
          img: "./img/ben.png",
          debt: false,
        },
        {
          user_id: 3,
          name: "Martin",
          img: "./img/mike.png",
          debt: true,
        },
        {
          user_id: 4,
          name: "Martin",
          img: "./img/perry.png",
          debt: false,
        },
        {
          user_id: 5,
          name: "Martin",
          img: "./img/ben.png",
          debt: false,
        },
        {
          user_id: 6,
          name: "Martin",
          img: "./img/adam.jpg",
          debt: false,
        },
        {
          user_id: 7,
          name: "Martin",
          img: "./img/max.png",
          debt: true,
        }
      ]
    }
  ];

  return {
    all: function() {
      return tabs;
    },
    remove: function(tab) {
      tabs.splice(tabs.indexOf(tab), 1);
      console.log(tabs);
    },
    get: function(tabId) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === parseInt(tabId)) {
          return tabs[i];
        }
      }
      return null;
    },
    addTab: function(tab) {
      return $http.post("http://localhost:8000/tabs/", tab)
        .success(function(data) {
          console.log("Successfully added tab to DB", data);
        })
        .error(function(data) {
          console.log("Invalid login");
          Popups.showPopup("Could not add tab", "Sorry, you cannot currently add a tab.");
        })
      
    },
    addExpense: function(tabId, expense) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === parseInt(tabId)) {
          var tab = tabs[i];
        }
      }

      tab.expenses.push(expense);
    },
    getTotalBalance: function(tabId) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === parseInt(tabId)) {
          var tab = tabs[i];
          var totalBalance = 0;
          tab.expenses.forEach(function(expense) {
            totalBalance += expense.balance;
          });
          tab.balance = totalBalance;
        }
      }
    },
    edit: function(tabId, attr, newValue) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === parseInt(tabId)) {
          var tab = tabs[i];
        }
      }

      tab[attr] = newValue;
      console.log(tab);
    }
  };

})

.factory('Popups', function($ionicPopup){

  return {
    showPopup: function(title, message, alertCallback) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function(res) {
        console.log('User acknowledged popup');
        if(alertCallback){
          alertCallback();
        }
      });
    },
    
    showConfirm: function(title, message, confirmCallback, cancellCallback) {
       var confirmPopup = $ionicPopup.confirm({
         title: title,
         template: message
       });

       confirmPopup.then(function(res) {
         if(res) {
           confirmCallback();
         } else {
           cancellCallback();
         }
       });
     }
  };

})

.factory('User', function($http, $rootScope, Popups, $state, $rootScope){

  /*

    Set of API functions specific to retreiving and manipulating User data

  */

  // to be populated at login
  var currentUser = {};

	return {
		get: function() {
        return $http.get('http://localhost:8000/users/'+currentUser.user_id+'/', {})
          .success(function(data) {
            console.log("Got user from api. Response:", data);
          })
          .error(function(data) {
            console.log("Could not get user from api. Response:", data);
          })
		},

    getWithId: function(user_id) {
        return $http.get('http://localhost:8000/users/'+user_id+'/', {})
          .success(function(data) {
            console.log("Got user from api. Response:", data);
          })
          .error(function(data) {
            console.log("Could not get user from api. Response:", data);
          })

    },

    login: function(params) {
      $http.post("http://localhost:8000/users/login/", params)
        .success(function(data) {
          console.log("Successfully logged in. Response:", data);
          currentUser = data;
          $state.go("tab.home")
        })
        .error(function(data) {
          console.log("Could not login. Response: ", data);
          Popups.showPopup("Invalid Login", "Sorry, an account with the provided username and password was not found");
        })
    },

    signup: function(params) {
       return $http.post("http://localhost:8000/users/", params)
         .success(function(data) {
           console.log("Successfully signed up. Response:", data);
         })
         .error(function(data) {
           console.log("Could not sign up. Repsonse: ", data);
           Popups.showPopup("Error", "Could not create account. Try again later.")
         }) 
    },

    edit: function(user_id, params) {
        return $http.patch('http://localhost:8000/users/'+user_id+'/', params)
          .success(function(data) {
            console.log("Edited user in DB. Response:", data);
          })
          .error(function(data) {
            Popups.showPopup("Error", "Please make sure your name and username are valid");
            console.log("Could not edit user in DB. Response:", data);
          })
    },

    delete: function(user_id) {
        return $http.delete('http://localhost:8000/users/'+user_id+'/', {})
          .success(function(data) {
            console.log("Deleted user from DB. Response:", data);
          })
          .error(function(data) {
            console.log("Could not delete user from DB. Response:", data);
          })
    },

    signOut: function() {
      currentUser = null;
      console.log("Successfully logged out", currentUser);
      $state.go("login");
    }

	};

});
