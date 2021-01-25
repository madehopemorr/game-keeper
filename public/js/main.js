//button to show and hide side bar
$("#menu-toggle").click(e => {
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
  y: 500,
  ease: "bounce"
});
