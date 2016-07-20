angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

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
          title: "Hotel",
          balance: 145.23,
          members: []
        },
        {
          title: "Food",
          balance: 83.12,
          members: []
        },
        {
          title: "Gas",
          balance: 65.21,
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
          title: "Hotel",
          balance: 145.23,
          members: []
        },
        {
          title: "Food",
          balance: 83.12,
          members: []
        },
        {
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

  // calculate total balance for each tab based on expenses
  tabs.forEach(function(tab) {
    var totalBalance = 0;
    tab.expenses.forEach(function(expense) {
      totalBalance += expense.balance;
    });
    tab.balance = totalBalance;
  });
  


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
