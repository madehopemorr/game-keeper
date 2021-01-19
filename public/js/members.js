$(document).ready(() => {
  // Create an obj to store game name data every time each button is clicked
  var gameInfo = {};

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text("Welcome " + data.firstName);
  });

  popularGame()
  // showWishlist()

  // This boolean var is used to control the appearance of suggestions dropdown list
  var hasBeenClicked = false;

  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var searchWord = $("#search-word").val().trim()
    console.log(searchWord)
    runSearchBar(searchWord);

    // autocomplete(searchWord);
    hasBeenClicked = true;
  })
  //runs search when user presses enter
  $('#search-word').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      event.preventDefault();
      var searchWord = $("#search-word").val().trim()
      runSearchBar(searchWord);

      // autocomplete(searchWord);
      hasBeenClicked = true;
    }
  });

  function runSearchBar(searchWord) {
    $(".searchGame").removeClass("hide")
    $(".popularGame").addClass("hide")
    $(".searchGame").empty();
    //search for game from board game geeks API.
    var queryURL = "https://api.boardgameatlas.com/api/search?name=" +
      searchWord + "&client_id=3KZbL84alX";
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        console.log(response)

        for (var i = 0; i < response.games.length; i++) {
          var gameCard = $(`    
          <div class="card" style="width: 24rem;">
              <div class="card-body">
                  <h4 class="card-title">${response.games[i].name}</h4>
                  <div class="row">
                      <div class="col-4">
                          <img src = "${response.games[i].images.small}"></img>
                      </div>
                      <div class="col">
                          <ul class="card-text">
                              <li><i class="fas fa-star"></i> Avg User Rating:${(response.games[i].average_user_rating).toFixed(2)}</li>
                              <li><i class="fas fa-users"></i> Players:${response.games[i].min_players}-${response.games[i].max_players}</li>
                              <li><i class="fas fa-hourglass-start"></i> Game Time: ${response.games[i].min_playtime}-${response.games[i].max_playtime}</li>
                              <li><i class="fas fa-child"></i> Age: ${response.games[i].min_age} + </li>
                              <li><i class="fas fa-dice-d20"></i> <a href=${response.games[i].rules_url}>Rules</a></li>
                              <li><i class="fas fa-tag"></i>Price: ${response.games[i].price}</li>
                              <br>

                          </ul>
                      </div>
                  </div>
              </div
          </div>`)

          // Dynamically create a card for each game
          $(".searchGame").append(gameCard);

          // Dynamically asign an id for each heart button and add to each game card
          var heartButton = $('<button class = "heartBtn btn btn-primary"><i class="far fa-heart"></i></button>');
          heartButton.attr("data-games", response.games[i].name);
          var customID = "heartBtn-" + String(i);
          heartButton.attr("id", customID);
          $(".searchGame").append(heartButton);

          // Assign key values to each data retrieved from each buton clicked
          gameInfo[customID] = response.games[i].id;
        };
        // This console shows how the line above looks like
        // Console the values of the gameInfo obj (for debugging purpose)
        console.log("KeyValue: " + JSON.stringify(gameInfo));

        // As this point, this function shows in the console what button is clicked and the data value attached to it
        // Will be modified...
        $(".heartBtn").on("click", function (event) {
          event.preventDefault();

          console.log("ButtonId is: " + this.id);
          console.log("Game ID is: " + gameInfo[this.id]);
          // var chosenName = gameInfo[this.id];
        });
      })
  };

  function popularGame() {
    $(".searchGame").addClass("hide")
    $(".popGames").empty();
    //search for game from board game geeks API.
    var queryURL = "https://api.boardgameatlas.com/api/search?order_by=reddit_day_count&limit=10&client_id=3KZbL84alX";
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        console.log(response);

        for (var i = 0; i < response.games.length; i++) {
          var gameCard = $(`    
          <div class="card" style="width: 24rem;">
              <div class="card-body">
                  <h4 class="card-title">${response.games[i].name}</h4>
                  <div class="row">
                      <div class="col-4">
                          <img src = "${response.games[i].images.small}"></img>
                      </div>
                      <div class="col">
                          <ul class="card-text">
                              <li><i class="fas fa-star"></i> Avg User Rating:${(response.games[i].average_user_rating).toFixed(2)}</li>
                              <li><i class="fas fa-users"></i> Players:${response.games[i].min_players}-${response.games[i].max_players}</li>
                              <li><i class="fas fa-hourglass-start"></i> Game Time: ${response.games[i].min_playtime}-${response.games[i].max_playtime}</li>
                              <li><i class="fas fa-child"></i> Age: ${response.games[i].min_age} + </li>
                              <li><i class="fas fa-dice-d20"></i> <a href=${response.games[i].rules_url}>Rules</a></li>
                              <li><i class="fas fa-tag"></i>Price: ${response.games[i].price}</li>
                              <br>

                          </ul>
                      </div>
                  </div>
              </div
          </div>`)

          // Dynamically create a card for each game
          $(".popGames").append(gameCard);

          // Dynamically asign an id for each heart button and add to each game card
          var heartButton = $('<button class = "heartBtn btn btn-primary"><i class="far fa-heart"></i></button>');
          heartButton.attr("data-games", response.games[i].name);
          var customID = "heartBtn-" + String(i);
          heartButton.attr("id", customID);
          $(".popGames").append(heartButton);

          // Assign key values to each data retrieved from each buton clicked
          gameInfo[customID] = response.games[i].id;
        };
        // This console shows how the line above looks like
        // Console the values of the gameInfo obj (for debugging purpose)
        console.log("KeyValue: " + JSON.stringify(gameInfo));

        // As this point, this function shows in the console what button is clicked and the data value attached to it
        // Will be modified...
        $(".heartBtn").on("click", function (event) {
          event.preventDefault();

          console.log("ButtonId is: " + this.id);
          console.log("Game ID is: " + gameInfo[this.id]);
          // var chosenName = gameInfo[this.id];
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // Testing code, please don't mind this - Uyen
          /*
          // Make a newGame object
          var newGame = {
            title: chosenName,
            own: false
            // created_at: new Date(),
          };

          console.log("Front end: " + newGame);

          saveGameToDB(newGame.title, newGame.own);

          function saveGameToDB(title, own) {
            $.post("/api/wishlist", {
              title: title,
              own: false
            })
          }
          */

        });
      });
  };

  
  
  
  var game_ID = [];
  $.get("/api/wishlist").then(data => {
    for (var i = 0; i < data.length; i++)
    game_ID.push(data[i].game_ID)
    showWishlist()
  });
  console.log(game_ID)
  function showWishlist() {
    $(".searchGame").removeClass("hide")
    // $(".popularGame").addClass("hide")
    $(".wishlist").empty();
    //search for game from board game geeks API.
    var queryURL = "https://api.boardgameatlas.com/api/search?ids=" +
      game_ID + "&client_id=3KZbL84alX";
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        console.log(response)

        for (var i = 0; i < response.games.length; i++) {
          var gameCard = $(`    
          <div class="card" style="width: 24rem;">
              <div class="card-body">
                  <h4 class="card-title">${response.games[i].name}</h4>
                  <div class="row">
                      <div class="col-4">
                          <img src = "${response.games[i].images.small}"></img>
                      </div>
                      <div class="col">
                          <ul class="card-text">
                              <li><i class="fas fa-star"></i> Avg User Rating:${(response.games[i].average_user_rating).toFixed(2)}</li>
                              <li><i class="fas fa-users"></i> Players:${response.games[i].min_players}-${response.games[i].max_players}</li>
                              <li><i class="fas fa-hourglass-start"></i> Game Time: ${response.games[i].min_playtime}-${response.games[i].max_playtime}</li>
                              <li><i class="fas fa-child"></i> Age: ${response.games[i].min_age} + </li>
                              <li><i class="fas fa-dice-d20"></i> <a href=${response.games[i].rules_url}>Rules</a></li>
                              <li><i class="fas fa-tag"></i>Price: ${response.games[i].price}</li>
                              <br>

                          </ul>
                      </div>
                  </div>
              </div
          </div>`)

          // Dynamically create a card for each game
          $(".wishlist").append(gameCard);

          // Dynamically asign an id for each heart button and add to each game card
          var heartButton = $('<button class = "heartBtn btn btn-primary"><i class="far fa-heart"></i></button>');
          heartButton.attr("data-games", response.games[i].name);
          var customID = "heartBtn-" + String(i);
          heartButton.attr("id", customID);
          $(".wishlist").append(heartButton);

          // Assign key values to each data retrieved from each buton clicked
          gameInfo[customID] = response.games[i].id;
        };
        // This console shows how the line above looks like
        // Console the values of the gameInfo obj (for debugging purpose)
        console.log("KeyValue: " + JSON.stringify(gameInfo));

        // As this point, this function shows in the console what button is clicked and the data value attached to it
        // Will be modified...
        $(".heartBtn").on("click", function (event) {
          event.preventDefault();

          console.log("ButtonId is: " + this.id);
          console.log("Game ID is: " + gameInfo[this.id]);
          // var chosenName = gameInfo[this.id];
        });
      })
  };
  
  
  var game_ID = [];
  $.get("/api/owned").then(data => {
    for (var i = 0; i < data.length; i++)
    game_ID.push(data[i].game_ID)
    showOwnlist()
  });
  console.log(game_ID)
  function showOwnlist() {
    $(".searchGame").removeClass("hide")
    // $(".popularGame").addClass("hide")
    $(".ownlist").empty();
    //search for game from board game geeks API.
    var queryURL = "https://api.boardgameatlas.com/api/search?ids=" +
      game_ID + "&client_id=3KZbL84alX";
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        console.log(response)

        for (var i = 0; i < response.games.length; i++) {
          var gameCard = $(`    
          <div class="card" style="width: 24rem;">
              <div class="card-body">
                  <h4 class="card-title">${response.games[i].name}</h4>
                  <div class="row">
                      <div class="col-4">
                          <img src = "${response.games[i].images.small}"></img>
                      </div>
                      <div class="col">
                          <ul class="card-text">
                              <li><i class="fas fa-star"></i> Avg User Rating:${(response.games[i].average_user_rating).toFixed(2)}</li>
                              <li><i class="fas fa-users"></i> Players:${response.games[i].min_players}-${response.games[i].max_players}</li>
                              <li><i class="fas fa-hourglass-start"></i> Game Time: ${response.games[i].min_playtime}-${response.games[i].max_playtime}</li>
                              <li><i class="fas fa-child"></i> Age: ${response.games[i].min_age} + </li>
                              <li><i class="fas fa-dice-d20"></i> <a href=${response.games[i].rules_url}>Rules</a></li>
                              <li><i class="fas fa-tag"></i>Price: ${response.games[i].price}</li>
                              <br>

                          </ul>
                      </div>
                  </div>
              </div
          </div>`)

          // Dynamically create a card for each game
          $(".ownlist").append(gameCard);
        }
      })
  };


  // Function for autocomplete search
  function autocomplete() {

    // var queryURL = "https://api.boardgameatlas.com/api/search?name=" +
    //   searchWord + "&client_id=3KZbL84alX";
    var queryURL = "https://api.boardgameatlas.com/api/search?fuzzy_match=" +
      "fuzzy_match=true" + "&client_id=3KZbL84alX";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      // Response is an object
      // We need to convert it into an array
      var responseArr = response.games;
      console.log(responseArr);

      function findMatches(wordToMatch, responseArr) {
        return responseArr.filter(games => {
          // In "gi", g means glocal (looking through the entire string), and i means insensitive
          const regex = new RegExp(wordToMatch, "gi");
          return games.name.match(regex);
        });
      };

      function displayMatches() {
        console.log(this.value);
        var matchArr = findMatches(this.value, responseArr);
        console.log(matchArr);

        var liEl = matchArr.map(games => {
          // The RegExp object is used for matching text with a pattern
          // Replace the matching parts of the search results with highlighted parts
          const regex = new RegExp(this.value, "gi");
          // The highlighted const will replace ${games.name} in the span
          const highlighted = games.name.replace(regex, `<span class="highlight">${this.value}</span>`);

          return `
        <li>
          <span class="name">${highlighted}</span>
        </li>
        `;
        }).join("");

        var suggestions = document.querySelector(".suggestions");
        suggestions.innerHTML = liEl;
        // Only show suggestions list when the search box is not empty
        if (!this.value || hasBeenClicked) {
          $(".suggestions").empty();
          hasBeenClicked = false;
        }
      };

      $("#search-word").on("keyup", displayMatches);
      $("#search-word").on("change", displayMatches);
    });
  };

  autocomplete();

  // Testing code to pull data from clicking heart button to database - Uyen
  // Save chosen game to wishlist after the heart button is clicked
  // function saveGamesData() {
  // $(".heartBtn").on("click", function (event) {
  //   event.preventDefault();
  //   console.log("clicked")
  //   // Make a new Games object
  //   var newGame = {
  //     title: $(".card-title").text()
  //   };
  //   console.log(newGame);


  // });
  // };
  // saveGamesData();

});




// $(function(){
// $("#heartBtn").on("click", function(event) {
//   event.preventDefault();

//   var newGame = {
//     title: req.body.name,
//   }
//   console.log(newGame)
//   //Send the POST request.
//   $.ajax("/api/games", {
//     type: "POST",
//     data: newGame
//   }).then(
//     function() {
//       console.log(newGame)
//       // Reload the page to get the updated list
//       location.reload();
//     }
//   );
// });
// });

// $.get("/api/games", function(data){
//   console.log("games", data);
//   games = data;


// })



/*
<div class="card" style="width: 24rem;">
  <div class="card-body">
    <h4 class="card-title">${popGame.name}</h4>
    <div class="row">
      <div class="col-4">
        <img src="${popGame.images.small}"></img>
      </div>
      <div class="col">
        <ul class="card-text">
          <li><i class="fas fa-star"></i> Avg User Rating:${(popGame.average_user_rating).toFixed(2)}
            <li><i class="fas fa-users"></i> Players:${popGame.min_players}-${popGame.max_players}</li>
            <li><i class="fas fa-hourglass-start"></i> Game Time: ${popGame.min_playtime}-${popGame.max_playtime}
            </li>
            <li><i class="fas fa-child"></i> Age: ${popGame.min_age} + </li>
            <li><i class="fas fa-dice-d20"></i> <a href=${popGame.rules_url}>Rules</a></li>
            <li><i class="fas fa-tag"></i>Price: ${popGame.price}</li>

            </div>
          </div>
      </div>
*/