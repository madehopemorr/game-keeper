$(document).ready(() => {
  // Prevent menu button change to blue after toggle
  var menuBtn = document.querySelector("#menu-toggle");
  menuBtn.addEventListener("click", function (event) {
    event.preventDefault();

    menuBtn.style.background = "rgb(173,255,47)";
    menuBtn.style.color = "rgb(0,0,0)";
    // menuBtn.style.border = "rgba(255, 255, 255, .5)";
  });

  // Create an obj to store game name data every time each button is clicked
  var gameInfo = {}

  var newGame = {}
  console.log(newGame)

  // This boolean var is used to control the appearance of suggestions dropdown list
  var hasBeenClicked = false;

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  // $.get("/api/user_data").then(data => {
  //   $(".member-name").text("Welcome " + data.firstName);
  // });
  $.ajax({
    url: `http://localhost:8080/api/user_data?secret_token=${sessionStorage.getItem("myToken")}`,
    type: "GET",
    error: function (err) {
      switch (err.status) {
        case "400":
          // bad request
          break;
        case "401":
          // unauthorized
          break;
        case "403":
          // forbidden
          break;
        default:
          //Something bad happened
          break;
      }
    }
  }).then(data => {
    $(".member-name").text("Welcome " + data.firstName);
    console.log("Success");
    console.log(data.id);
  });
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  popularGame()

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
    $(".searchGames").empty();
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
          $(".searchGames").append(gameCard);

          // Dynamically asign an id for each heart button and add to each game card
          var heartButton = $('<button class = "heartBtn btn btn-primary"><i class="far fa-heart"></i></button>');
          // var heartButtonClicked = $('<button class = "heartBtnClicked btn btn-primary"><i class="fas fa-check"></i></button>');

          heartButton.attr("data-games", response.games[i].id);
          var customID = "heartBtn-" + String(i);
          heartButton.attr("id", customID);
          $(".searchGames").append(heartButton);

          // Assign key values to each data retrieved from each buton clicked
          gameInfo[customID] = response.games[i].id;

          // Dynamically asign an id for each own button and add to each game card
          var ownButton = $('<button class = "ownBtn btn btn-primary">Own</button>');
          ownButton.attr("data-id", response.games[i].game_id);
          var customID2 = "ownBtn-" + String(i);
          ownButton.attr("id", customID2);
          $(".searchGames").append(ownButton);
          gameInfo[customID2] = response.games[i].id;
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
          var chosenID = gameInfo[this.id];

          $.ajax({
            url: `http://localhost:8080/api/user_data?secret_token=${sessionStorage.getItem("myToken")}`,
            type: "GET",
            error: function (err) {
              switch (err.status) {
                case "400":
                  // bad request
                  break;
                case "401":
                  // unauthorized
                  break;
                case "403":
                  // forbidden
                  break;
                default:
                  //Something bad happened
                  break;
              }
            }
          }).then(data => {
            var currentUserId = data.id;
            console.log(currentUserId);
            console.log(chosenID);

            // Make a newGame object
            newGame = {
              game_ID: chosenID,
              own: false,
              UserId: currentUserId
            };

            console.log(newGame)

            saveGame(newGame.game_ID, newGame.own, newGame.UserId)
          });
        });

        $(".ownBtn").on("click", function (event) {
          event.preventDefault();

          console.log("ButtonId is: " + this.id);
          console.log("Game ID is: " + gameInfo[this.id])
          var chosenID2 = gameInfo[this.id];
          // var own = {own: true }
          console.log(chosenID2)

          $.ajax({
            url: `http://localhost:8080/api/user_data?secret_token=${sessionStorage.getItem("myToken")}`,
            type: "GET",
            // headers: {
            //   Authorization: `Bearer ${sessionStorage.getItem("myToken")}`
            // },
            error: function (err) {
              switch (err.status) {
                case "400":
                  // bad request
                  break;
                case "401":
                  // unauthorized
                  break;
                case "403":
                  // forbidden
                  break;
                default:
                  //Something bad happened
                  break;
              }
            }
          }).then(data => {
            var currentUserId = data.id;
            console.log(currentUserId);
            console.log(chosenID2);

            // Make a newGame object
            newGame = {
              game_ID: chosenID2,
              own: true,
              UserId: currentUserId
            };

            console.log(newGame)

            saveGame(newGame.game_ID, newGame.own, newGame.UserId)
          });
        })
      })
  };

  function popularGame() {
    $(".searchGame").addClass("hide")
    $(".popGames").empty();
    //search for game from board game geeks API.
    var queryURL = "https://www.boardgameatlas.com/api/search?order_by=popularity&ascending=false&limit=10&pretty=true&client_id=JLBr5npPhV";
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
          // var heartButtonClicked = $('<button class = "heartBtnClicked hide btn btn-primary"><i class="fas fa-check"></i></button>');

          heartButton.attr("data-games", response.games[i].id);
          var customID = "heartBtn-" + String(i);
          heartButton.attr("id", customID);
          $(".popGames").append(heartButton);

          // Assign key values to each data retrieved from each buton clicked
          gameInfo[customID] = response.games[i].id;

          // Dynamically asign an id for each own button and add to each game card
          var ownButton = $('<button class = "ownBtn btn btn-primary">Own</button>');
          ownButton.attr("data-id", response.games[i].game_id);
          var customID2 = "ownBtn-" + String(i);
          ownButton.attr("id", customID2);
          $(".popGames").append(ownButton);
          gameInfo[customID2] = response.games[i].id;

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
          var chosenID = gameInfo[this.id];

          $.ajax({
            url: `http://localhost:8080/api/user_data?secret_token=${sessionStorage.getItem("myToken")}`,
            type: "GET",
            // headers: {
            //   Authorization: `Bearer ${sessionStorage.getItem("myToken")}`
            // },
            error: function (err) {
              switch (err.status) {
                case "400":
                  // bad request
                  break;
                case "401":
                  // unauthorized
                  break;
                case "403":
                  // forbidden
                  break;
                default:
                  //Something bad happened
                  break;
              }
            }
          }).then(data => {
            console.log(data)
            var currentUserId = data.id;
            console.log(currentUserId);
            console.log(chosenID);

            // Make a newGame object
            newGame = {
              game_ID: chosenID,
              own: false,
              UserId: currentUserId
            };

            console.log(newGame)

            saveGame(newGame.game_ID, newGame.own, newGame.UserId)
          });
        });

        $(".ownBtn").on("click", function (event) {
          event.preventDefault();

          console.log("ButtonId is: " + this.id);
          console.log("Game ID is: " + gameInfo[this.id])
          var chosenID2 = gameInfo[this.id];
          // var own = {own: true }
          console.log(chosenID2)

          $.ajax({
            url: `http://localhost:8080/api/user_data?secret_token=${sessionStorage.getItem("myToken")}`,
            type: "GET",
            // headers: {
            //   Authorization: `Bearer ${sessionStorage.getItem("myToken")}`
            // },
            error: function (err) {
              switch (err.status) {
                case "400":
                  // bad request
                  break;
                case "401":
                  // unauthorized
                  break;
                case "403":
                  // forbidden
                  break;
                default:
                  //Something bad happened
                  break;
              }
            }
          }).then(data => {
            var currentUserId = data.id;
            console.log(currentUserId);
            console.log(chosenID2);

            // Make a newGame object
            newGame = {
              game_ID: chosenID2,
              own: true,
              UserId: currentUserId
            };

            console.log(newGame)

            saveGame(newGame.game_ID, newGame.own, newGame.UserId)
          });
        })
      });
  };


  function saveGame(game_ID, own, UserId) {
    $.ajax({
      url: `http://localhost:8080/api/members?secret_token=${sessionStorage.getItem("myToken")}`,
      type: "POST",
      data: {
        game_ID: game_ID,
        own: own,
        UserId: UserId,
      },
      error: function (err) {
        switch (err.status) {
          case "400":
            // bad request
            break;
          case "401":
            // unauthorized
            break;
          case "403":
            // forbidden
            break;
          default:
            //Something bad happened
            break;
        }
      }

    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
  }

  // Function for autocomplete search
  function autocomplete() {
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
});
