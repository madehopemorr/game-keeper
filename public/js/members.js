$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text("Welcome " + data.firstName);
  });
});

$(".heartBtn").on("click", function(event) {
  var id = $(this).data("id");
  var savedGame = $(this).data("savedgame");
  var newGame = {
    title: req.body.name,
  }
  // Send the PUT request.
  $.ajax("/api/wishlist" + id, {
    type: "POST",
    data: newGame
  }).then(
    function() {
      // Reload the page to get the updated list
      location.reload();
    }
  );
});