//animate the header on page load
popularGame();
gsap.from(".welcome", {
  duration: 1.5,
  opacity: 0,
  scale: 0.3,
  ease: "bounce"
});

// This variable is for autocomplete function
var suggestions = document.querySelector(".suggestions");
// This boolean var is used to control the appearance of suggestions dropdown list
var hasBeenClicked = false;

// Prevent menu button change to blue after toggle
const menuBtn = document.querySelector("#menu-toggle");
menuBtn.addEventListener("click", event => {
  event.preventDefault();

  menuBtn.style.background = "rgb(173,255,47)";
  menuBtn.style.color = "rgb(0,0,0)";
});

$("#searchBtn").on("click", event => {
  event.preventDefault();
  const searchWord = $("#search-word")
    .val()
    .trim();

  if ($("#checkboxMinPlayers").is(":checked")) {
    var playerMin = $("#playerMin").val();
  } else {
    var playerMin = "";
  }

  if ($("#checkboxMaxPlayers").is(":checked")) {
    var playerMax = $("#playerMax").val();
  } else {
    var playerMax = "";
  }

  if ($("#checkboxTime").is(":checked")) {
    var gameTime = $("#gameTime").val();
  } else {
    var gameTime = "";
  }

  if ($("#checkboxAge").is(":checked")) {
    var playerAge = $("#playerAge").val();
  } else {
    var playerAge = "";
  }

  runSearchBar(searchWord);
  hasBeenClicked = true;
});

//runs search when user presses enter
$("#search-word").keypress(event => {
  const keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    event.preventDefault();
    const searchWord = $("#search-word")
      .val()
      .trim();
    runSearchBar(searchWord);

    hasBeenClicked = true;
  }
});

function runSearchBar(searchWord) {
  $(".searchGame").removeClass("hide");
  $(".popularGame").addClass("hide");
  $(".searchGames").empty();

  //search for game from board game geeks API.
  const queryURL =
    "https://api.boardgameatlas.com/api/search?name=" +
    searchWord +
    "&min_players=" +
    parseInt(playerMin.value) +
    "max_players=" +
    parseInt(playerMax.value) +
    "max_playtime=" +
    parseInt(gameTime.value) +
    "min_age=" +
    parseInt(playerAge.value) +
    "&client_id=3KZbL84alX";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(response => {
    response.games.forEach(game => {
      //template to automatically generate card styling for each game in search
      const gameCard = $(`    
    <div class="card" style="width: 24rem;">
        <div class="card-body">
            <h4 class="card-title">${game.name}</h4>
            <div class="row">
                <div class="col-4">
                    <img src = "${game.images.small}"></img>
                </div>
                <div class="col">
                    <ul class="card-text">
                        <li><i class="fas fa-star"></i> Avg User Rating:${game.average_user_rating.toFixed(2)}
                        <li><i class="fas fa-users"></i> Players:${game.min_players}-${game.max_players}</li>
                        <li><i class="fas fa-hourglass-start"></i> Game Time: ${game.min_playtime}-${game.max_playtime}</li>
                        <li><i class="fas fa-child"></i> Age: ${game.min_age} + </li>
                        <li><i class="fas fa-dice-d20"></i> <a href=${game.rules_url}>Rules</a></li>
                        <li><i class="fas fa-tag"></i>Price: ${game.price}</li>
                    </ul>
                </div>
            </div>
        </div
    </div>`);
      $(".searchGames").append(gameCard);
    });
  });
}

function popularGame() {
  $(".searchGame").addClass("hide");
  $(".popGames").empty();
  //search for game from board game geeks API.
  const queryURL =
    "https://www.boardgameatlas.com/api/search?order_by=popularity&ascending=false&limit=10&pretty=true&client_id=JLBr5npPhV";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {

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
                          </ul>
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
  const queryURL =
    "https://api.boardgameatlas.com/api/search?fuzzy_match=" +
    "fuzzy_match=true" +
    "&client_id=3KZbL84alX";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(response => {

    // Response is an object
    // We need to convert it into an array
    const responseArr = response.games;

    function findMatches(wordToMatch, responseArr) {
      return responseArr.filter(games => {
        // In "gi", g means glocal (looking through the entire string), and i means insensitive
        const regex = new RegExp(wordToMatch, "gi");
        return games.name.match(regex);
      });
    }

    function displayMatches() {

      const matchArr = findMatches(this.value, responseArr);

      const liEl = matchArr
        .map(games => {
          // The RegExp object is used for matching text with a pattern
          // Replace the matching parts of the search results with highlighted parts
          const regex = new RegExp(this.value, "gi");
          // The highlighted const will replace ${games.name} in the span
          const highlighted = games.name.replace(
            regex,
            `<span class="highlight">${this.value}</span>`
          );

          return `
          <li class="autocompleteLi">
            <div class="autocomplete">
              <span class="name">${highlighted}</span>
            </div>
          </li>
          `;
        })
        .join("");

      const suggestions = document.querySelector(".suggestions");

      suggestions.innerHTML = liEl;
      // Only show suggestions list when the search box is not empty
      if (!this.value || hasBeenClicked) {
        $(".suggestions").empty();
        hasBeenClicked = false;
      }

    }

    $("#search-word").on("keyup", displayMatches);
    $("#search-word").on("change", displayMatches);
  });
}

autocomplete();
