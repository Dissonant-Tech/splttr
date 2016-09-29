angular.module('starter.services', [])

.factory('Tabs', function($http, Popups, $state, $rootScope){

  return {

    // Remove Tab from DB
    remove: function(tab_id) {
      return $http.delete("http://localhost:8000/api/tabs/"+tab_id+"/")
        .success(function(data){
          // console.log("Deleted tab from DB. Response: ", data);
        })
        .error(function(data){
          Popups.showPopup("Error", "Sorry, we couldn't delete your Tab right now. Try again later!");
        })
    },

    // Get all Tabs that match User by its ID
    get: function(user_id) {
      return $http.get("http://localhost:8000/api/tabs/?members="+JSON.stringify(user_id))
        .success(function(data){
          // console.log("Getting all tabs for user with ID: " + user_id);
          // console.log("Tabs retreived from DB. Response:", data);
          return data;
        })
        .error(function(data){
          // console.log("No tabs returned from DB. Response:", data);
          return null;
        })

    },

    // Get specific Tab by its ID
    getWithId: function(tab_id) {
      return $http.get("http://localhost:8000/api/tabs/"+tab_id+'/')
        .success(function(data){
            // console.log("Retreived tab detail from DB. Response:", data);
            return data;
        })
        .error(function(data){
            // console.log("Could not get tab from DB. Response: ", data);
            $state.go("tab.home");
        })

    },

    // Get a Tab's remaining balance
    getRemainingBalance: function(tab_id) {
      return $http.get("http://localhost:8000/api/tabs/"+tab_id+'/total/')
        .success(function(data){
            // console.log("Retreived tab detail from DB. Response:", data);
            return data;
        })
        .error(function(data){
            // console.log("Could not get tab from DB. Response: ", data);
        })

    },

    // Add new Tab to DB
    addTab: function(tab) {
      return $http.post("http://localhost:8000/api/tabs/", tab)
        .success(function(data) {
          // console.log("Successfully added tab to DB", data);
          return data;
        })
        .error(function(data) {
          // console.log("sdlkjf", tab);
          Popups.showPopup("Could not add tab", "Sorry, you cannot currently add a tab.");
        })
    },


    // Get tabs in common between two users
    getCommon: function(id1, id2) {
      return $http.get("http://localhost:8000/api/tabs/?members=" + id1 + "," + id2)
        .success(function(data) {
          // console.log("Successfully added tab to DB", data);
          return data;
        })
        .error(function(data) {
          // console.log("sdlkjf", tab);
          Popups.showPopup("Could not add tab", "Sorry, you cannot currently add a tab.");
        })

    },


    // Add new Tab to DB
    addTab: function(tab) {
      return $http.post("http://localhost:8000/api/tabs/", tab)
        .success(function(data) {
          // console.log("Successfully added tab to DB", data);
          return data;
        })
        .error(function(data) {
          // console.log("sdlkjf", tab);
          Popups.showPopup("Could not add tab", "Sorry, you cannot currently add a tab.");
        })

    },

    edit: function(tabId, attr, newValue) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === parseInt(tabId)) {
          var tab = tabs[i];
        }
      }

      tab[attr] = newValue;
      // console.log(tab);
    }
  };

})

.factory('Events', function($ionicPopup, $http, Popups){

  return {

    // Get all events for a specific tab
    getAll: function(tab_id) {
      return $http.get("http://localhost:8000/api/events/?tab="+tab_id)
        .success(function(data){
            return data;
        })
        .error(function(data){
        })
    },

    // Get all bills for a specific event
    getBills: function(event_id) {
      return $http.get("http://localhost:8000/api/events/"+event_id+"/bills/")
        .success(function(data){
            // console.log("Getting all events for Tab ID: " + tab_id);
            // console.log("Retrieved all events. Response: ", data);
            return data;
        })
        .error(function(data){
          // console.log("Could not get all events. Reponse: ", data);
        })
    },

    // Get event remaining balance
    getRemainingBalance: function(event_id) {
      return $http.get("http://localhost:8000/api/events/"+event_id+"/total/")
        .success(function(data){
            // console.log("Getting all events for Tab ID: " + tab_id);
            // console.log("Retrieved all events. Response: ", data);
            return data;
        })
        .error(function(data){
          // console.log("Could not get all events. Reponse: ", data);
        })
    },

    // Get specific event
    get: function(event_id) {
      return $http.get("http://localhost:8000/api/events/"+event_id+"/")
        .success(function(data){
            // console.log("Getting all events for Tab ID: " + tab_id);
            // console.log("Retrieved all events. Response: ", data);
            return data;
        })
        .error(function(data){
          // console.log("Could not get all events. Reponse: ", data);
        })
    },

    // Add event to a Tab
    addExpense: function(event){
      return $http.post("http://localhost:8000/api/events/", event)
        .success(function(data){
          console.log("Added events to tab. Response: ", data);
          return data;
        })
        .error(function(data){
          console.log("Could not add events to DB. Response: ", data);
        })
    },

    // Remove Event
    remove: function(event_id) {
      return $http.delete("http://localhost:8000/api/events/"+event_id+"/")
        .success(function(data){
          // console.log("Deleted event from DB. Response: ", data);
        })
        .error(function(data){
          Popups.showPopup("Error", "Sorry, we couldn't delete your Expense right now. Try again later!");
        })
    }

  };

})

.factory('Bills', function($ionicPopup, $http){
  return {

      // Get all bills for user
      get: function(user_id){
        return $http.get('http://localhost:8000/api/bills/?debtor=' + user_id)
          .success(function(res){
            return res.data
          })
          .error(function(res){
            console.log("Could not get bills for user");
          })
      },

      // Get bills for a specific event
      getBill: function(event_id) {
        return $http.get("http://localhost:8000/api/bills/?event="+event_id)
          .success(function(data){
              // console.log("Getting bill for event: " + event_id);
              // console.log("Retrieved bill. Response: ", data);
              return data;
          })
          .error(function(data){
            // console.log("Could not get bill. Reponse: ", data);
          })
      },

      // Add bill to event
      addBill: function(bill){
        return $http.post("http://localhost:8000/api/bills/", bill)
          .success(function(data){
            console.log("Added bill to event in DB. Response: ", data);
            return data;
          })
          .error(function(data){
            console.log("Could not add bill to DB. Response: ", data);
          })
      },

      // Pay a bill
      payBill: function(bill_id, params){
        console.log('bill_id', bill_id);
        console.log('params', params);
        return $http.patch('http://localhost:8000/api/bills/' + bill_id + "/", params)
          .success(function(res){
            return res.data
          })
          .error(function(res){
            console.log("Could not get bills for user");
          })
      }

  };

})

.factory('Popups', function($ionicPopup){

  /*

      Set of functions designed to display Ionic Popup modals

  */


  return {

    // Display alert Popup modal
    showPopup: function(title, message, alertCallback) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function(res) {
        // console.log('User acknowledged popup');
        if(alertCallback){
          alertCallback();
        }
      });
    },

    // Display OK/Cancel Popup modal
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

	return {

    // Returns current User
		get: function() {
        return $http.get('http://localhost:8000/api/auth/user/')
          .success(function(data) {
            // console.log("Got user from api. Response:", data);
          })
          .error(function(data) {
            // console.log("Could not get user from api. Response:", data);
          })
		},

    // Returns list of all Users
    getAll: function() {
      return $http.get('http://localhost:8000/api/users/')
        .success(function(data) {
            // console.log("Successfully retreived response from server");
        })
        .error(function(err){
            // console.log("Error: ", err);
        })
    },

    // Returns User by its ID
    getWithId: function(user_id) {
        return $http.get('http://localhost:8000/api/users/'+user_id+'/', {})
          .success(function(data) {
            // console.log("Got user from api. Response:", data);
          })
          .error(function(data) {
            // console.log("Could not get user from api. Response:", data);
          })

    },

    // Logs in User. Sets common Authentication header
    login: function(params) {
      $http.post("http://localhost:8000/api/auth/login/", params)
        .success(function(token, status, some, config) {
          // console.log("Successfully logged in. Response:", token);

          // Set global header auth token for each subsequent request
          $http.defaults.headers.common.Authorization = 'Token ' + token.key;
          $state.go("tab.home")
        })
        .error(function(data) {
          // console.log("Could not login. Response: ", data);
          Popups.showPopup("Invalid Login", data.non_field_errors[0]);
        })
    },


    // Registers new User
    signup: function(params) {
       return $http.post("http://localhost:8000/api/auth/registration/", params)
         .success(function(data) {
           // console.log("Successfully signed up. Response:", data);
         })
         .error(function(data) {
           // console.log("Could not sign up. Repsonse: ", data);
           var err = Object.keys(data)[0];
           Popups.showPopup("Error", data[err]);
         })
    },

    // Creates anonymous User
    createAnonymousUser: function(user) {

        user.is_anonymous = true;

        return $http.post("http://localhost:8000/api/auth/registration/", user)
          .success(function(data) {
            // console.log("Successfully created anonymous user. Response:", data);
          })
          .error(function(data) {
            // console.log("Could not create anonymous user. Repsonse: ", data);
          })
    },

    // Edits User properties
    edit: function(user_id, params) {
        return $http.patch('http://localhost:8000/api/users/'+user_id+'/', params)
          .success(function(data) {
            // console.log("Successfully edited user. Response:", data);
          })
          .error(function(data) {
            var err = Object.keys(data)[0]
            Popups.showPopup("Error", data[err]);
            // console.log("Could not edit user. Response:", data);
          })
    },

    // Gets User activity
    getActivity: function(user_id) {
        return $http.get('http://localhost:8000/api/users/'+user_id+'/activity/')
          .success(function(data) {
            // console.log("Successfully edited user. Response:", data);
          })
          .error(function(data) {
          })
    },

    // Deletes user
    delete: function(user_id) {
        return $http.delete('http://localhost:8000/api/users/'+user_id+'/', {})
          .success(function(data) {
            // console.log("Deleted user from DB. Response:", data);
          })
          .error(function(data) {
            // console.log("Could not delete user from DB. Response:", data);
          })
    },

    // Signs out User and deletes Auth token
    signOut: function() {
      $http.post('http://localhost:8000/api/auth/logout/')
        .success(function(data){

          // Remove previous Auth token
          $http.defaults.headers.common.Authorization = undefined;
          // console.log("Successfully logged out. Response: ", data);
          $state.go("login");
        })
        .error(function(data){
          // console.log("Could not logout", data);
          Popups.showPopup("Error", "Sorry, there seems to be a problem. Try again later")
        })
    }

	};

});
