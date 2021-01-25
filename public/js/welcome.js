//animate the header on page load
gsap.from(".welcome", {duration:1.5, opacity:0, scale:0.3, ease: "bounce"});

// This variable is for autocomplete function
var suggestions = document.querySelector(".suggestions");

// This boolean var is used to control the appearance of suggestions dropdown list
var hasBeenClicked = false;

// Prevent menu button change to blue after toggle
var menuBtn = document.querySelector("#menu-toggle");
menuBtn.addEventListener("click", function(event) {
  event.preventDefault();

  menuBtn.style.background = "rgb(173,255,47)";
  menuBtn.style.color = "rgb(0,0,0)";
  // menuBtn.style.border = "rgba(255, 255, 255, .5)";
});

popularGame()

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  var searchWord = $("#search-word").val().trim()
  
  
  if ($("#checkboxMinPlayers").is(":checked")) {
    var playerMin = $("#playerMin").val()
    console.log("player min: " + playerMin)
  } else {
    var playerMin = ""
  }
  
  if ($("#checkboxMaxPlayers").is(":checked")) {
    var playerMax = $("#playerMax").val()
    console.log("player Max: " + playerMax)
  } else {
    var playerMax = ""
  }
  
  if ($("#checkboxTime").is(":checked")) {
    var gameTime = $("#gameTime").val()
    console.log("game time: " + gameTime)
  } else {
    var gameTime = ""
  }
  
  if ($("#checkboxAge").is(":checked")) {
    var playerAge = $("#playerAge").val()
    console.log("player Age: " + playerAge)
  } else {
    var playerAge = ""
  }
  
  console.log(`pMin: ${playerMin} | pMax: ${playerMax} | time: ${gameTime} | age: ${playerAge}`)
  // autocomplete(searchWord);
  runSearchBar(searchWord);
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

  console.log("search word is a " + typeof(searchWord))
  
  var queryURL = "https://api.boardgameatlas.com/api/search?name=" +
    searchWord + "&min_players=" + parseInt(playerMin.value) + "max_players=" + parseInt(playerMax.value) + "max_playtime=" + parseInt(gameTime.value) + "min_age=" + parseInt(playerAge.value) + "&client_id=3KZbL84alX";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      console.log(response)
      response.games.forEach(function (game) {
        //template to automatically generate card styling for each game in search
        var gameCard = $(`    
    <div class="card" style="width: 24rem;">
        <div class="card-body">
            <h4 class="card-title">${game.name}</h4>
            <div class="row">
                <div class="col-4">
                    <img src = "${game.images.small}"></img>
                </div>
                <div class="col">
                    <ul class="card-text">
                        <li><i class="fas fa-star"></i> Avg User Rating:${(game.average_user_rating).toFixed(2)}
                        <li><i class="fas fa-users"></i> Players:${game.min_players}-${game.max_players}</li>
                        <li><i class="fas fa-hourglass-start"></i> Game Time: ${game.min_playtime}-${game.max_playtime}</li>
                        <li><i class="fas fa-child"></i> Age: ${game.min_age} + </li>
                        <li><i class="fas fa-dice-d20"></i> <a href=${game.rules_url}>Rules</a></li>
                        <li><i class="fas fa-tag"></i>Price: ${game.price}</li>
                    
                </div>
            </div>
        </div
    </div>`)
        $(".searchGames").append(gameCard)
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
      //console.log(response)
      const popGames = response.games
      popGames.forEach(function (popGame) {
        //template to automatically generate card styling for each game in search
        var popularGameCard = $(`    
    <div class="card" style="width: 24rem;">
        <div class="card-body">
            <h4 class="card-title">${popGame.name}</h4>
            <div class="row">
                <div class="col-4">
                    <img src = "${popGame.images.small}"></img>
                </div>
                <div class="col">
                    <ul class="card-text">
                        <li><i class="fas fa-star"></i> Avg User Rating:${(popGame.average_user_rating).toFixed(2)}</li>
                        <li><i class="fas fa-users"></i> Players:${popGame.min_players}-${popGame.max_players}</li>
                        <li><i class="fas fa-hourglass-start"></i> Game Time: ${popGame.min_playtime}-${popGame.max_playtime}</li>
                        <li><i class="fas fa-child"></i> Age: ${popGame.min_age} + </li>
                        <li><i class="fas fa-dice-d20"></i> <a href=${popGame.rules_url}>Rules</a></li>
                        <li><i class="fas fa-tag"></i>Price: ${popGame.price}</li>
                    
                </div>
            </div>
        </div
    </div>`)
        $(".popGames").append(popularGameCard)
      })
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
        <li class="autocompleteLi">
          <div class="autocomplete">
            <span class="name">${highlighted}</span>
          </div>
        </li>
        `;
      }).join("");

      // var searchInput = document.querySelector("#search-word");
      // var eachName = document.querySelector(".name");
      // for (var i = 0; i < liEl.length; i++) {
      // var customAutoID = "autoBtn-" + String(i);
      // liEl.attr("id", customAutoID);
      // }
      // eachName.addEventListener("click", function(event) {
      //   event.preventDefault();

      //   // searchInput.value = this.value;
      //   console.log(this.value)
      // });

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
