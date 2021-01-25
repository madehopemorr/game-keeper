// Create an obj to store game name data every time each button is clicked
const gameInfo = {};
console.log(sessionStorage.getItem("myToken"));
$.ajax({
  url: `http://localhost:8080/api/user_data?secret_token=${sessionStorage.getItem(
    "myToken"
  )}`,
  type: "GET",
  error: function(err) {
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
});
//gets game IDs from data base for current user then makes ajax call to API to retrieve info on those games
const wishlistId = [];
//gets user then shows users stored wishlsit. If no games stored, loads message saying to add games.
$.ajax({
  url: `http://localhost:8080/api/wishlist?secret_token=${sessionStorage.getItem(
    "myToken"
  )}`,
  type: "GET",
  error: function(err) {
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

  console.log(data);
  for (let i = 0; i < data.length; i++) {
    wishlistId.push(data[i].game_ID);
  }
  if (wishlistId.length === 0) {
    const noWishlist = $(`
      <h2>Uh Oh!<br> No games saved to your wishlists.</h2>
      <p>go back <a href="/members">Here</a> to save games</p>`);
    $(".wishlist").append(noWishlist);
  } else {
    showWishlist();

  }
});
console.log(wishlistId);

function showWishlist() {
  $(".wishlist").empty();
  //search for game from board game geeks API.
  const queryURL =
    "https://api.boardgameatlas.com/api/search?ids=" +
    wishlistId +
    "&client_id=P8IGQ6iTCi";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(response => {
    console.log(response);

    for (let i = 0; i < response.games.length; i++) {
      const gameCard = $(`
    <div class="each-wish-card">  
    <button class="wishlistItem">
      <img src="${response.games[i].images.thumb}">  ${response.games[i].name}
    </button>
    <div class="panel">
    <div class="row">
    <div class="col">
    <h3>${response.games[i].name}</h3>
    </div></div>
    <div class="row">
    <div class="col">
        <img src = "${response.games[i].images.small}"></img>
    </div>
    <div class="col">
        <ul class="card-text">
            <li><i class="fas fa-star"></i> Avg User Rating:${response.games[
              i
            ].average_user_rating.toFixed(2)}</li>
            <li><i class="fas fa-users"></i> Players:${
              response.games[i].min_players
            }-${response.games[i].max_players}</li>
            <li><i class="fas fa-hourglass-start"></i> Game Time: ${
              response.games[i].min_playtime
            }-${response.games[i].max_playtime}</li>
            <li><i class="fas fa-child"></i> Age: ${
              response.games[i].min_age
            } + </li>
            <li><i class="fas fa-dice-d20"></i> <a href=${
              response.games[i].rules_url
            }>Rules</a></li>
            <li><i class="fas fa-tag"></i>Price: ${response.games[i].price}</li>
            <br>
        </ul>
    </div>
</div>
</div>
 `);

      // Dynamically create a card for each game
      $(".wishlist").append(gameCard);

      // Dynamically asign an id for each own button and add to each game card
      const ownButton = $(
        '<button class = "ownBtn wishlistBtn btn btn-primary">Own</button>'
      );
      ownButton.attr("data-id", response.games[i].game_id);
      const customID = "ownBtn-" + String(i);
      ownButton.attr("id", customID);
      $(".wishlist").append(ownButton);

      // Assign key values to each data retrieved from each buton clicked
      gameInfo[customID] = response.games[i].id;

      //creates a delete button to remove from list and take out of database
      const deleteButton = $(
        '<button class = "deleteBtn wishlistBtn btn btn-primary"><i class="far fa-trash-alt"></i></button>'
      );
      deleteButton.attr("data-id", response.games[i].game_id);
      const customID2 = "deleteBtn-" + String(i);
      deleteButton.attr("id", customID2);
      $(".wishlist").append(deleteButton);
      gameInfo[customID2] = response.games[i].id;
    }

    $(".ownBtn").on("click", function(event) {
      event.preventDefault();

      console.log("ButtonId is: " + this.id);
      console.log("Game ID is: " + gameInfo[this.id]);
      const chosenID = gameInfo[this.id];
      const own = { own: true };
      console.log(chosenID);
      updateGame(chosenID, own);
    });

    $(".deleteBtn").on("click", function(event) {
      event.preventDefault();

      console.log("ButtonId is: " + this.id);
      console.log("Game ID is: " + gameInfo[this.id]);
      const chosenID2 = gameInfo[this.id];
      console.log(chosenID2);
      deleteGame(chosenID2);
    });
    //toggles buttons for each game to show or hide thier card
    const acc = document.getElementsByClassName("wishlistItem");
    $(acc).on("click", function() {
      console.log(this);
      console.log("clicked");
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  });
}

//updates game in database from own false to own true which moves games from wishlist to own list
function updateGame(id, own) {
  $.ajax({
    url: `http://localhost:8080/api/wishlist/${id}?secret_token=${sessionStorage.getItem(
      "myToken"
    )}`,
    type: "PUT",
    data: own,
    error: function(err) {
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
  }).then(() => {
    window.location.replace("/wishlist");
    // If there's an error, handle it by throwing up a bootstrap alert
  });
}
//deletes games from users lists of games
function deleteGame(id) {
  $.ajax({
    url: `http://localhost:8080/api/wishlist/${id}?secret_token=${sessionStorage.getItem(
      "myToken"
    )}`,
    type: "DELETE",

    error: function(err) {
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
  }).then(() => {
    window.location.replace("/wishlist");
    // If there's an error, handle it by throwing up a bootstrap alert
  });
}
