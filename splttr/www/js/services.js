angular.module('starter.services', [])

.factory('Tabs', function(){

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
      squad: [
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
      squad: [
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
    },
    get: function(tabId) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === parseInt(tabId)) {
          return tabs[i];
        }
      }
      return null;
    },
    add: function(tab) {
      tabs.push(tab);
      console.log(tabs);
    }
  };

})

.factory('Popups', function($ionicPopup){

  return {
    showPopup: function(title, message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function(res) {
        console.log('User acknoloedged popup');
      });
    }
  };

})

.factory('User', function(){

	var user = {
		id: "0",
		img: "./img/alan.jpg",
    name: "Alan Kopetman"
	};

	return {
		get: function() {
			return user;
		}
	};
});
