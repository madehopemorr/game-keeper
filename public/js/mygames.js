const gameInfo = {};
//gets token for current user, returns their name
$.ajax({
  url: `
  /api/user_data?secret_token=${sessionStorage.getItem(
    "myToken"
  )}`,
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
});

const ownListId = [];
//checks the user then returns a list of their games they own by storing Game_IDs in our database then running an AJAX call to board game API, if they have no games stored, will load a message

$.ajax({
  url: `
  /api/mygames?secret_token=${sessionStorage.getItem(
    "myToken"
  )}`,
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

  for (let i = 0; i < data.length; i++) {
    ownListId.push(data[i].game_ID);
  }
  if (ownListId.length === 0) {
    const nolist = $(`

    <h2>Uh Oh!<br> No games saved to your games.</h2>
    <p>go back <a href="/members">Here</a> to save games</p>`);
    $(".ownlist").append(nolist);
  } else {

    showOwnlist();
  }

});
console.log(ownListId);

function showOwnlist() {
  $(".ownlist").empty();
  //search for game from board game geeks API.
  const queryURL =
    "https://api.boardgameatlas.com/api/search?ids=" +
    ownListId +
    "&client_id=P8IGQ6iTCi";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(response => {
    console.log(response);

    for (let i = 0; i < response.games.length; i++) {
      const gameCard = $(`
      <div class="each-own-card">
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
      </div>
      `)

      // Dynamically create a card for each game
      $(".ownlist").append(gameCard);

        //creates a delete button to remove from list and take out of database
        var deleteButton = $('<button class = "deleteBtn mygamesBtn btn btn-primary"><i class="far fa-trash-alt"></i></button>');
        deleteButton.attr("data-id", response.games[i].game_id);
        var customID2 = "deleteBtn-" + String(i);
        deleteButton.attr("id", customID2);
        $(".ownlist").append(deleteButton);
        gameInfo[customID2] = response.games[i].id;
      }


    $(".deleteBtn").on("click", function (event) {
      event.preventDefault();


      console.log("ButtonId is: " + this.id);
      console.log("Game ID is: " + gameInfo[this.id]);
      const chosenID2 = gameInfo[this.id];
      console.log(chosenID2);
      deleteGame(chosenID2);
    });
    const acc = document.getElementsByClassName("wishlistItem");
    $(acc).on("click", function () {
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


function deleteGame(id) {
  $.ajax({
    url: `
    /api/mygames/${id}?secret_token=${sessionStorage.getItem(
      "myToken"
    )}`,
    type: "DELETE",

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

  }).then(() => {
    window.location.replace("/mygames");
    // If there's an error, handle it by throwing up a bootstrap alert
  });

}