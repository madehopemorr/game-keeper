$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text("Welcome " + data.firstName);
  });
});
$(function(){
$("#heartBtn").on("click", function(event) {
  event.preventDefault();

  var newGame = {
    title: req.body.name,
  }
  console.log(newGame)
  //Send the POST request.
  $.ajax("/api/games", {
    type: "POST",
    data: newGame
  }).then(
    function() {
      console.log(newGame)
      // Reload the page to get the updated list
      location.reload();
    }
  );
});
});

$.get("/api/games", function(data){
  console.log("games", data);
  games = data;
  

})