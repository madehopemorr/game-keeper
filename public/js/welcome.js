
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
            var gameItem = $(`
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <img src = "${game.images.small}"></img>
            <p class="card-text">${game.description}
                Players:${game.min_players}-${game.max_players}
            </p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>`)
            $(".list-group").append(gameItem)
          })
        })
    }