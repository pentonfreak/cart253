/**
 * The Only Move Is Not To Play
 * Khuong Nguyen
 *
 * A game where your score increases so long as you do nothing.
 */

"use strict";

// Current score
let score = 0;

// Is the game over?
let gameOver = false;

/**
 * Create the canvas
 */
function setup() {
  createCanvas(400, 400);
}

/**
 * Update the score and display the UI
 */
function draw() {
  background("#87ceeb");
  
  // Only increase the score if the game is not over
  if (!gameOver) {
    // Score increases relatively slowly
    score += 0.05;
  }
  displayUI();
}

/**
 * Show the game over message if needed, and the current score
 */
function displayUI() {
  if (gameOver) {
    push();
    textSize(48);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("You lose!", width/2, height/3);
    pop();
  }
  displayScore();
}

/**
 * Display the score
 */
function displayScore() {
  push();
  textSize(48);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(floor(score), width/2, height/2);
  pop();
}

// End the game if the mouse is pressed
function mousePressed() {
  gameOver = true;
}

//End the game if the mouse is moved
function mouseMoved() {
  gameOver = true;
}

//End the game if the middle mouse is scrolled
function mouseWheel() {
  gameOver = true;
}

// End the game if any key is pressed
function keyPressed() {
  gameOver = true;
}

// Check if the user is online or offline
if (navigator.online) {
  console.log("You are online");
}
else {
  console.log("You are offline");
}

//If the user goes offline, end the game
window.addEventListener('offline', () => {
    console.log("You lost connection");
    gameOver = true;
});

window.addEventListener('online', () => {
    console.log("You are back online");
});

//If the user goes online, restart the game
window.addEventListener('online', () => {
    score = 0;
    gameOver = false;
}
);

//If lose, restart the game if the user clicks the mouse
function mouseClicked() {
  if (gameOver) {
    score = 0;
    gameOver = false;
  }
}

//End the game if the user switches to another tab
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    console.log("You switched to another tab");
    gameOver = true;
  }
});


