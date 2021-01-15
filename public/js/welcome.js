
$("#searchBtn").on("click", function(event){
    event.preventDefault();
  var searchWord = $("#search-word").val().trim()
  console.log(searchWord)
  runSearchBar(searchWord);
  
})
//runs search when user presses enter
$('#search-word').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    event.preventDefault();
    var searchWord = $("#search-word").val().trim()
    runSearchBar(searchWord);
  }
});
function runSearchBar(searchWord){
    $(".list-group").empty();
  //search for game from board game geeks API.
  var queryURL = "https://api.boardgameatlas.com/api/search?name=" +
  searchWord + "&client_id=3KZbL84alX";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
        console.log(response)
        response.games.forEach(function(game){
    //template to automatically generate card styling for each game in search
            var gameCard = $(`
    <div class="card" style="width: 24rem;">
        <div class="card-body">
            <h4 class="card-title">${game.name}</h5>
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
                    <a href="#" class="btn btn-primary"><i class="far fa-heart"></i></a>
                </div>
            </div>
        </div
    </div>`)
            $(".list-group").append(gameCard)
          })
        })
    }