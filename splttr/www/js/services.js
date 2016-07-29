angular.module('starter.services', [])

.factory('Tabs', function($http, Popups, $state){

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

    // Remove Tab from DB
    remove: function(tab_id) {
      return $http.delete("http://localhost:8000/tabs/"+tab_id+"/")
        .success(function(data){
          console.log("Deleted tab from DB. Response: ", data);
        })
        .error(function(data){
          Popups.showPopup("Error", "Sorry, we couldn't delete your Tab right now. Try again later!");
        })
    },

    // Get all Tabs that match User by its ID
    get: function(user_id) {
      return $http.get("http://localhost:8000/tabs/?members="+JSON.stringify(user_id))
        .success(function(data){
          console.log("Getting all tabs for user with ID: " + user_id);
          console.log("Tabs retreived from DB. Response:", data);
          return data;
        })
        .error(function(data){
          console.log("No tabs returned from DB. Response:", data);
          return null;
        })
      
    },

    // Get specific Tab by its ID
    getWithId: function(tab_id) {
      return $http.get("http://localhost:8000/tabs/"+tab_id)
        .success(function(data){
            console.log("Retreived tab detail from DB. Response:", data);
            return data;
        })
        .error(function(data){
            console.log("tried: " + tab_id);
            console.log("Could not get tab from DB. Response: ", data);
            $state.go("tab.home");
        })

    },

    // Add new Tab to DB
    addTab: function(tab) {
      return $http.post("http://localhost:8000/tabs/", tab)
        .success(function(data) {
          console.log("Successfully added tab to DB", data);
          return data;
        })
        .error(function(data) {
          console.log("sdlkjf", tab);
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

.factory('Events', function($ionicPopup, $http){

  return {

    // Get all events for a specific tab
    getAll: function(tab_id) {
      return $http.get("http://localhost:8000/events/?tab="+tab_id)
        .success(function(data){
            console.log("Getting all events for Tab ID: " + tab_id);
            console.log("Retrieved all events. Response: ", data);
            return data;
        })
        .error(function(data){
          console.log("Could not get all events. Reponse: ", data);
        })
    },

    // Add event to a Tab in the DB
    addExpense: function(event){
      return $http.post("http://localhost:8000/events/", event)
        .success(function(data){
          console.log("Added events to DB. Response: ", data);
          return data;
        })
        .error(function(data){
          console.log("Could not add events to DB. Response: ", data);
        })
    }

  };

})

.factory('Bills', function($ionicPopup, $http){
  return {

      // Get bill for a specific event
      getBill: function(event_id) {
        return $http.get("http://localhost:8000/bills/?event="+event_id)
          .success(function(data){
              console.log("Getting bill for event: " + event_id);
              console.log("Retrieved bill. Response: ", data);
              return data;
          })
          .error(function(data){
            console.log("Could not get bill. Reponse: ", data);
          })
      },

      // Add bill to event
      addBill: function(bill){
        return $http.post("http://localhost:8000/bills/", bill)
          .success(function(data){
            console.log("Added bill to event in DB. Response: ", data);
            return data;
          })
          .error(function(data){
            console.log("Could not add bill to DB. Response: ", data);
          })
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
