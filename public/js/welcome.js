
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
      })
    }