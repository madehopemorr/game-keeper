var gameInfo = {}

$.get("/api/user_data").then(data => {
    $(".member-name").text("Welcome " + data.firstName);
});

var accordianArr = ["collapseOne","collapseTwo","collapseThree","collapseFour","collapseFive","collapseSix","collapseSeven","collapseEight","collapseNine","collapseTen","collapseEleven","collapseTwelve","collapseThirteen","collapseFourteen", "collapseFifteen", "collapseSixteen", "collapseSeventeen", "collapseEightteen", "collapseNineteen", "collapseTwenty"];

var ownListId = [];
$.get("/api/owned").then(data => {
  for (var i = 0; i < data.length; i++)
  ownListId.push(data[i].game_ID)
  showOwnlist()
});
console.log(ownListId)
function showOwnlist() {
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
        <button class="wishlistItem">
      <img src="${response.games[i].images.thumb}">  ${response.games[i].name}
    </button>
    <div class="panel">
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
 `)


        // Dynamically create a card for each game
        $(".ownlist").append(gameCard);

          //creates a delete button to remove from list and take out of database
          var deleteButton = $('<button class = "deleteBtn btn btn-primary"><i class="far fa-trash-alt"></i></button>');
          deleteButton.attr("data-id", response.games[i].game_id);
          var customID2 = "deleteBtn-" + String(i);
          deleteButton.attr("id", customID2);
          $(".ownlist").append(deleteButton);
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
      var acc = document.getElementsByClassName("wishlistItem")
        $(acc).on("click", function() {
          console.log(this)
          console.log("clicked")
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        });
    })
};

function deleteGame(id){
    $.ajax("/api/mygames/" + id, {
      method: "DELETE"
    }).then(() => {
      window.location.replace("/mygames");
      // If there's an error, handle it by throwing up a bootstrap alert
      })
  }

