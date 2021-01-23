// Test wishlist logics here - Uyen
// Create an obj to store game name data every time each button is clicked
var gameInfo = {}

$.get("/api/user_data").then(data => {
    $(".member-name").text("Welcome " + data.firstName);
});
  
var accordianArr = ["collapseOne","collapseTwo","collapseThree","collapseFour","collapseFive","collapseSix","collapseSeven","collapseEight","collapseNine","collapseTen","collapseEleven","collapseTwelve","collapseThirteen","collapseFourteen", "collapseFifteen", "collapseSixteen", "collapseSeventeen", "collapseEightteen", "collapseNineteen", "collapseTwenty"];

  
var wishlistId = [];
$.get("/api/wishlist").then(data => {
  for (var i = 0; i < data.length; i++)
  wishlistId.push(data[i].game_ID)
  showWishlist()
});
console.log(wishlistId)
function showWishlist() {
  $(".wishlist").empty();
  //search for game from board game geeks API.
  var queryURL = "https://api.boardgameatlas.com/api/search?ids=" +
    wishlistId + "&client_id=P8IGQ6iTCi";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      console.log(response)
      var collapseVar = "collapse" + String(i); 
      for (var i = 0; i < response.games.length; i++) {
        var gameCard = $(`
        <div class="accordion-item">
  <h2 class="accordion-header" id="${response.games[i].name}">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseVar}" aria-expanded="true" aria-controls="${collapseVar}">
      <img src="${response.games[i].images.thumb}">  ${response.games[i].name}
    </button>
  </h2>
  <div id="${collapseVar}" class="accordion-collapse collapse" aria-labelledby="${response.games[i].name}" data-bs-parent="#accordionExample">
    <div class="accordion-body">
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
  </div>
</div>`)

        // Dynamically create a card for each game
        $(".wishlist").append(gameCard);

        // Dynamically asign an id for each own button and add to each game card
        var ownButton = $('<button class = "ownBtn btn btn-primary">Own</button>');
        ownButton.attr("data-id", response.games[i].game_id);
        var customID = "ownBtn-" + String(i);
        ownButton.attr("id", customID);
        $(".wishlist").append(ownButton);

        // Assign key values to each data retrieved from each buton clicked
        gameInfo[customID] = response.games[i].id;

        //creates a delete button to remove from list and take out of database
        var deleteButton = $('<button class = "deleteBtn btn btn-primary"><i class="far fa-trash-alt"></i></button>');
        deleteButton.attr("data-id", response.games[i].game_id);
        var customID2 = "deleteBtn-" + String(i);
        deleteButton.attr("id", customID2);
        $(".wishlist").append(deleteButton);
        gameInfo[customID2] = response.games[i].id;

      };
      // This console shows how the line above looks like
      // Console the values of the gameInfo obj (for debugging purpose)
      //console.log("KeyValue: " + JSON.stringify(gameInfo));

      // As this point, this function shows in the console what button is clicked and the data value attached to it
      // Will be modified...
      $(".ownBtn").on("click", function (event) {
        event.preventDefault();

        console.log("ButtonId is: " + this.id);
        console.log("Game ID is: " + gameInfo[this.id])
        var chosenID = gameInfo[this.id];
        var own = {own: true }
        console.log(chosenID)
        updateGame(chosenID, own)
      })
        $(".deleteBtn").on("click", function (event) {
          event.preventDefault();
  
          console.log("ButtonId is: " + this.id);
          console.log("Game ID is: " + gameInfo[this.id])
          var chosenID2 = gameInfo[this.id];
          console.log(chosenID2)
          deleteGame(chosenID2)
;
  
        // var chosenName = gameInfo[this.id];
       });
      })
};

function updateGame(id, own){
  $.ajax("/api/mygames/" + id, {
    method: "PUT",
    data: own,
}).then(() => {
  window.location.replace("/wishlist");
  // If there's an error, handle it by throwing up a bootstrap alert
  })
}

function deleteGame(id){
  $.ajax("/api/wishlist/" + id, {
    method: "DELETE"
  }).then(() => {
    window.location.replace("/wishlist");
    // If there's an error, handle it by throwing up a bootstrap alert
    })
}

/*var ownListId = [];
$.get("/api/owned").then(data => {
  for (var i = 0; i < data.length; i++)
  ownListId.push(data[i].game_ID)
  showOwnlist()
});
console.log(ownListId)
function showOwnlist() {
  // $(".searchGame").removeClass("hide")
  // $(".popularGame").addClass("hide")
  $(".ownlist").empty();
  //search for game from board game geeks API.
  var queryURL = "https://api.boardgameatlas.com/api/search?ids=" +
    ownListId + "&client_id=P8IGQ6iTCi";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      console.log(response)

      for (var i = 0; i < response.games.length; i++) {
        var gameCard = $(`
        <div class="accordion-item">
  <h2 class="accordion-header" id="${response.games[i].name}">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${accordianArr[i]}" aria-expanded="true" aria-controls="${accordianArr[i]}">
    <img src="${response.games[i].images.thumb}">  ${response.games[i].name}
    </button>
  </h2>
  <div id="${accordianArr[i]}" class="accordion-collapse collapse" aria-labelledby="${response.games[i].name}" data-bs-parent="#accordionExample">
    <div class="accordion-body">
    <div class="row">
    <div class="col">
        <img src = "${response.games[i].images.small}"></img>
    </div>
    <div class="col">
        <ul class="card-text">
            <li><i class="fas fa-users"></i> Players:${response.games[i].min_players}-${response.games[i].max_players}</li>
            <li><i class="fas fa-hourglass-start"></i> Game Time: ${response.games[i].min_playtime}-${response.games[i].max_playtime}</li>
            <li><i class="fas fa-child"></i> Age: ${response.games[i].min_age} + </li>
            <li><i class="fas fa-dice-d20"></i> <a href=${response.games[i].rules_url}>Rules</a></li>
            <br>
        </ul>
    </div>
</div>
    </div>
  </div>
</div>`)


        // Dynamically create a card for each game
        $(".ownlist").append(gameCard);

          //creates a delete button to remove from list and take out of database
          var deleteButton = $('<button class = "deleteBtn btn btn-primary"><i class="far fa-trash-alt"></i></button>');
          deleteButton.attr("data-id", response.games[i].game_id);
          var customID2 = "deleteBtn-" + String(i);
          deleteButton.attr("id", customID2);
          $(".wishlist").append(deleteButton);
          gameInfo[customID2] = response.games[i].id;
      }
  

      $(".deleteBtn").on("click", function (event) {
        event.preventDefault();

        console.log("ButtonId is: " + this.id);
        console.log("Game ID is: " + gameInfo[this.id])
        var chosenID2 = gameInfo[this.id];
        console.log(chosenID2)
        deleteGame(chosenID2)
      });
    })
};*/

