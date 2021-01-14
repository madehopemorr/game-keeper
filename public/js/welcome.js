
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
  //search for game from board game geeks API.
  var queryURL = "https://api.boardgameatlas.com/api/search?name=" +
  searchWord + "&client_id=3KZbL84alX";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
        console.log(response)
        var game = $(`
        <div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${response.games[0].name}</h5>
    <p class="card-text">${response.games[0].description_preview}
      Players:${response.games[0].min_players}-${response.games[0].max_players}
    </p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>`)
        $(".list-group").append(game)
      })
    }