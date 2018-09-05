/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

var API_KEY = '8b56f0b04c9fe338374fc211e6ac6827';


TrelloPowerUp.initialize({
  'card-buttons': function(t, options){

    return t.list('all')
    .then(function (list) {
      if (list.name === 'Encounters') {
        return t.get('member', 'private', 'token')
          .then(function(token) {
            return [{
              icon: BLACK_ROCKET_ICON,
              text: 'Add to Combat',
              callback: function(t) {
                return t.card('all')
                  .then(function (card) {
                    var contents = card.desc;
                    var cardKey = card.id;

                    t.lists('all')
                      .then(function (lists) {
                        lists.forEach(function(list) {
                        //for (var i in lists) {
                          if (list.name === 'Combatants') {

                            var chkListUrl = `https://api.trello.com/1/cards/${cardKey}/checklists?key=${API_KEY}&token=${token}`;
                            fetch(chkListUrl).then(function(response) {
                              return response.json();
                            })
                            .then(function(data) {
                              data.forEach(function(chkLst) {
                                if (chkLst.name.startsWith('Combatants')) {
                                  var groupName = (list.name.split('-')[2]);
                                  console.log(`Adding Group: ${groupName}`);

                                  var postData = {
                                      method: "POST",
                                      mode: "cors",
                                      cache: "no-cache",
                                      redirect: "follow",
                                      referrer: "no-referrer"
                                    }
/*                                    
                                  // TODO: Replace with actual initiative list
                                  var initListId = list.id;
                                  
                                  var newGroupUrl = `https://api.trello.com/1/cards?idList=${initListId}&name=${groupName}&key=${API_KEY}&token=${token}`;
                                  
                                  fetch(newGroupUrl, postData)
                                    .then(res => res.json())
                                    .then(response => console.log("Success:", JSON.stringify(response)))
                                    .catch(error => console.error("Error:", error));
                                  */
                                  chkLst.checkItems.forEach(function(item) {
                                    console.log(item.name);
                                    console.log(list);
                                    var newCardUrl = `https://api.trello.com/1/cards?idList=${list.id}&name=${item.name}&key=${API_KEY}&token=${token}`;
                                    
                                    postData = {
                                      method: "POST",
                                      mode: "cors", 
                                      cache: "no-cache",
                                      redirect: "follow",
                                      referrer: "no-referrer"
                                    };
                                    
                                    fetch(newCardUrl, postData)
                                      .then(res => res.json())
                                      .then(response => console.log('Success:', JSON.stringify(response)))
                                      .catch(error => console.error('Error:', error));


                                    
                                    /*
                                      .then(function(response) {
                                        return response.body.json()
                                      }).then(function(data) {
                                        console.log(data);
                                      });*/
                                  });
                                }
                              });
                            });            
                      }
                    });
                  });
              });
          }  
        }];
        })
      }
    });
  },
  'authorization-status': function(t, options){
    return t.get('member', 'private', 'token')
    .then(function(token){
      if(token){
        return { authorized: true };
      }
      return { authorized: false };
    });
  },
  'show-authorization': function(t, options){
    if (API_KEY) {
      return t.popup({
        title: 'Authorize',
        args: { apiKey: API_KEY }, // Pass in API key to the iframe
        url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});
