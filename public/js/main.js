
//button to show and hide side bar
$("#menu-toggle").click(function (e) {
  e.preventDefault();

  $("#wrapper").toggleClass("toggled");
});

//filter logic
function maxPlayerInput(val) {

  document.getElementById("maxPlayerInput").value = val;
}
function minPlayerInput(val) {
  document.getElementById("minPlayerInput").value = val;
}
function updateTimeInput(val) {
  document.getElementById("timeInput").value = val;
}
function updateAgeInput(val) {
  document.getElementById("ageInput").value = val;
}
gsap.to("#greendie", {
  scrollTrigger: "#greendie", // start the animation when ".box" enters the viewport (once)
  duration: 2,
  rotation: 360,
  y: 400,
  ease: "bounce"
});

// Function for popup when user clicks wishlist or my games
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});
