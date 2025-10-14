/**
 * Frogfrogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Whether the game has started (press any key or click to begin)
let gameStarted = false;
// Player score
let score = 0;

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }, 
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}

function draw() {
    background("#87ceeb");

    // If the game hasn't started yet, show the start screen
    if (!gameStarted) {
        // Draw a static scene behind the start overlay so the canvas isn't empty
        drawFly();
        drawFrog();
        startScreen();
        return;
    }

    // Main game loop
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    // Draw score on top of game
    drawScore();
    checkTongueFlyOverlap();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Draw the frog's eyes
    push();
    fill("#ffffff");
    noStroke();
    ellipse(frog.body.x - 30, frog.body.y - 50, 40);
    ellipse(frog.body.x + 30, frog.body.y - 50, 40);
    // Draw pupils that follow the fly, constrained inside each eye
    const eyeOffsetX = 30;
    const eyeOffsetY = -50;
    const pupilDiameter = 12;
    const maxOffset = 8; // how far pupil can move from eye center

    // Left eye center
    const leftEyeX = frog.body.x - eyeOffsetX;
    const leftEyeY = frog.body.y + eyeOffsetY;
    let dx = fly.x - leftEyeX;
    let dy = fly.y - leftEyeY;
    let d = dist(leftEyeX, leftEyeY, fly.x, fly.y);
    let scale = d > 0 ? Math.min(1, maxOffset / d) : 0;
    const leftPupilX = leftEyeX + dx * scale;
    const leftPupilY = leftEyeY + dy * scale;

    // Right eye center
    const rightEyeX = frog.body.x + eyeOffsetX;
    const rightEyeY = frog.body.y + eyeOffsetY;
    dx = fly.x - rightEyeX;
    dy = fly.y - rightEyeY;
    d = dist(rightEyeX, rightEyeY, fly.x, fly.y);
    scale = d > 0 ? Math.min(1, maxOffset / d) : 0;
    const rightPupilX = rightEyeX + dx * scale;
    const rightPupilY = rightEyeY + dy * scale;

    fill("#000000");
    noStroke();
    ellipse(leftPupilX, leftPupilY, pupilDiameter);
    ellipse(rightPupilX, rightPupilY, pupilDiameter);
    pop();
}


/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size/2 + fly.size/2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Increase score when fly is caught
        score += 1;
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    // If the game hasn't started yet, start it on any click
    if (!gameStarted) {
        gameStarted = true;
        return;
    }

    // Otherwise, use click to launch the tongue as before
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

/**
 * Start the game when any key is pressed
 */
function keyPressed() {
    if (!gameStarted) {
        gameStarted = true;
    }
}

/**
 * Draws the press-to-start overlay with a pulsing instruction
 */
function startScreen() {
    push();
    // Semi-transparent overlay
    fill(0, 0, 0, 120);
    rect(0, 0, width, height);
    // Pulsing text alpha (defines alpha used below)
    const pulse = (sin(frameCount * 0.06) + 1) / 2;
    const alpha = lerp(150, 255, pulse);

    textAlign(CENTER, CENTER);
    fill(255, alpha);
    noStroke();
    textSize(48);
    text("Press any key or click to start", width / 2, height / 2 - 20);

    textSize(18);
    fill(255, 200);
    text("Move the frog with your mouse — click to launch the tongue", width / 2, height / 2 + 30);
    pop();
}

// Point gain when fly is caught
function drawScore() {
    push();
    textAlign(LEFT, TOP);
    textSize(24);
    fill(255);
    noStroke();
    text(`Score: ${score}`, 10, 10);
    pop();
}
