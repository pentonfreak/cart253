/**
 * CrossFrogCross - A Variation Jam Game
 * Khuong Nguyen
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
let frameRate = 60;
let gameStarted = false;
// Player score
let score = 0;


// Add timer
let gameStartTime = 0;
const GAME_DURATION = 60 * 1000;
let gameOver = false;

// new: which frog is currently active (true = lower frog shown first)
let lowerActive = true;

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
        speed: 30,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }, 
};
// Upside down frog
const upsideDownfrog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: -40,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 80,
        size: 20,
        speed: 30,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }, 
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 15,
    speed: 3
};

// start target that the frog must eat to start the game
const startTarget = {
    x: undefined,
    y: undefined,
    size: 80,
    eaten: false
}

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();

    // center the start target
    startTarget.x = width / 2;
    startTarget.y = height / 2;
}

function draw() {
    background("#87ceeb");

    // If the game hasn't started yet, show the start screen
    if (!gameStarted) {
        // Allow the player to move the frog and fire the tongue on the start screen
        moveFrog();
        moveTongue();

        // Draw a static scene behind the start overlay so the canvas isn't empty
        drawBackground();
        drawFly();
        // draw only the lower frog on the start screen
        if (lowerActive) {
            drawFrog();
        } else {
            drawupsideDownFrog();
        }

        // Draw the eat-to-start target and check for tongue overlap
        if (!startTarget.eaten) {
            drawStartTarget();
            checkStartTargetOverlap();
        }

        if (!gameOver) {
            startScreen();
        }
        else {
            endScreen();
        }
        return;
    }

    if (!gameOver && millis() - gameStartTime >= GAME_DURATION) {
        gameOver = true;
        gameStarted = false;

        frog.tongue.state = "idle";
        frog.tongue.y = frog.body.y - frog.body.size / 2;
        upsideDownfrog.tongue.state = "idle";
        upsideDownfrog.tongue.y = upsideDownfrog.body.y + upsideDownfrog.body.size / 2;
    }

    // Draw score on top of game
    drawScore();

    // Show remaining time
    drawTimer();
    
    // Main game loop
    drawBackground();
    moveFly();
    drawFly();

    // Only move/draw the active frog and its tongue
    if (lowerActive) {
        moveFrog();
        moveTongue();
        drawFrog();
    } else {
        moveupsideDownFrog();
        moveupsideDownTongue();
        drawupsideDownFrog();
    }

    // Check overlap only for the active frog
    checkActiveTongueFlyOverlap();
    
    endScreen();
}

/**
 * Draw background (sky and ground, moving clouds)
 */
function drawBackground() {
    //Ground
    push();
    noStroke();
    fill("#018d01ff");
    rect(0, height - 100, width, 100);
    //upper ground
    noStroke();
    fill("#0ead00ff");
    rect(0, height - 480, width, 100);
    pop();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed + random(1, 10);
    //Move the fly in a sine wave pattern
    fly.y += sin(frameCount * 1) * 5;
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
    fill("#7a7a7aff");
    ellipse(fly.x - 5, fly.y - 3, fly.size + 5, fly.size / 2);
    fill("#7a7a7aff");
    ellipse(fly.x - 5, fly.y + 3, fly.size + 5, fly.size / 2);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(100, 375);
}

/**
 * Moves the frog to the keyboard's x position
 */
function moveFrog() {
    frog.body.x = mouseX;
}
function moveupsideDownFrog() {
    upsideDownfrog.body.x = mouseX;
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
function moveupsideDownTongue() {
    // Tongue matches the frog's x
    upsideDownfrog.tongue.x = upsideDownfrog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (upsideDownfrog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves down
    else if (upsideDownfrog.tongue.state === "outbound") {
        upsideDownfrog.tongue.y += upsideDownfrog.tongue.speed;
        // The tongue bounces back if it hits the bottom
        if (upsideDownfrog.tongue.y >= height) {
            upsideDownfrog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves up
    else if (upsideDownfrog.tongue.state === "inbound") {
        upsideDownfrog.tongue.y += -upsideDownfrog.tongue.speed;
        // The tongue stops if it hits the top
        if (upsideDownfrog.tongue.y <= 0) {
            upsideDownfrog.tongue.state = "idle";
        }
    }
}



/**
 * Displays the tongue (tip and line connection) and the frog (body) and let score hover over it
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

function drawupsideDownFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(upsideDownfrog.tongue.x, upsideDownfrog.tongue.y, upsideDownfrog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(upsideDownfrog.tongue.size);
    line(upsideDownfrog.tongue.x, upsideDownfrog.tongue.y, upsideDownfrog.body.x, upsideDownfrog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(upsideDownfrog.body.x, upsideDownfrog.body.y, upsideDownfrog.body.size);
    pop();

    // Draw the frog's eyes (flipped vertically)
    push();
    fill("#ffffff");
    noStroke();
    // For an upside-down frog the eyes sit below the body center
    ellipse(upsideDownfrog.body.x - 30, upsideDownfrog.body.y + 50, 40);
    ellipse(upsideDownfrog.body.x + 30, upsideDownfrog.body.y + 50, 40);

    // Pupils that follow the fly, constrained inside each eye
    const eyeOffsetX = 30;
    const eyeOffsetY = 50; // positive for upside-down
    const pupilDiameter = 12;
    const maxOffset = 8;

    // Left eye center
    const leftEyeX = upsideDownfrog.body.x - eyeOffsetX;
    const leftEyeY = upsideDownfrog.body.y + eyeOffsetY;
    let dx = fly.x - leftEyeX;
    let dy = fly.y - leftEyeY;
    let d = dist(leftEyeX, leftEyeY, fly.x, fly.y);
    let scale = d > 0 ? Math.min(1, maxOffset / d) : 0;
    const leftPupilX = leftEyeX + dx * scale;
    const leftPupilY = leftEyeY + dy * scale;

    // Right eye center
    const rightEyeX = upsideDownfrog.body.x + eyeOffsetX;
    const rightEyeY = upsideDownfrog.body.y + eyeOffsetY;
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
        // Play fly buzz sound
        if (flyBuzzSound && flyBuzzSound.isLoaded()) {
            flyBuzzSound.setVolume(0.6);
            flyBuzzSound.play();
        }
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Increase score when fly is caught
        score += 1;
    }
}

/**
 * Preload assets
 */

let tongueSound;

let flyBuzzSound;

let myFont;

function preload() {
    tongueSound = loadSound('assets/sounds/cartoon-slurp.wav');
    flyBuzzSound = loadSound('assets/sounds/fly-buzzin.wav');
    myFont = loadFont('assets/font/Frogotype.ttf');
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    // Always use click to launch the active frog's tongue (even on start screen)
    if (lowerActive) {
        if (frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }
    } else {
        if (upsideDownfrog.tongue.state === "idle") {
            // ensure tongue starts just below the upside-down frog so it shoots downward
            upsideDownfrog.tongue.y = upsideDownfrog.body.y + upsideDownfrog.body.size / 2 + 8;
            upsideDownfrog.tongue.state = "outbound";
        }
    }

    if (tongueSound.isLoaded()) {
        tongueSound.setVolume(0.5);
        tongueSound.play();
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
    textFont(myFont);
    fill(255, alpha);
    noStroke();
    textSize(50);
    text("CLICK TO START", width / 2, height / 2 - 20);

    textSize(20);
    fill(255, 200);
    text("Move the frog with your mouse & click to launch the tongue", width / 2, height / 2 + 10);
    pop();

    textAlign(CENTER, CENTER);
    textSize(30);
    textFont(myFont);
    fill(255, 200);
    text("YOU HAVE SIXTY SECONDS", width / 2, height / 2 + 60);
    pop();
}

// Point gain when fly is caught
function drawScore() {
    push();
    textAlign(CENTER, LEFT);
    textSize(50);
    textFont(myFont);
    fill(255);
    noStroke();
    text(`${score}`, 20, 250);
    pop();
}

/**
 * End game screen
 */
function endScreen() {
    if (score >= 999 || gameOver) {
    push();
    // Semi-transparent overlay
    fill(0, 0, 0, 120);
    rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    textFont(myFont);
    fill(255);
    noStroke();
    textSize(48);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(24);
    text(`Final Score: ${score}`, width / 2, height / 2 + 30);
    textSize(24);
    text("Click to restart", width / 2, height / 2 + 60);
    pop();

    tongueSound.stop();
    flyBuzzSound.stop();
    }
}

function mouseClicked() {
    if (score >= 999 || gameOver) {
        score = 0;
        gameStarted = false;
        gameOver = false;
        resetFly();
        frog.tongue.state = "idle";
        frog.tongue.y = frog.body.y - frog.body.size / 2;
        startTarget.eaten = false;
    }
}

/**
 * Show game time limit
 */

function drawTimer() {
    const timeElapsed = millis() - gameStartTime;
    const timeLeft = max(0, GAME_DURATION - timeElapsed);
    const secondsLeft = ceil(timeLeft / 1000);

    push();
    const pulse = (sin(frameCount * 0.09) + 1) / 2;
    const alpha = lerp(150, 255, pulse);
    textAlign(CENTER, CENTER);
    textSize(200);
    textFont(myFont);
    fill(255, alpha);
    noStroke();
    text(`${secondsLeft}`, width / 2, height / 2);
    pop();
}

// New: draw the start target (a little circle with label)
function drawStartTarget() {
    push();
    noStroke();
    fill("#ffcc00ff");
    ellipse(startTarget.x, startTarget.y, startTarget.size);
    pop();
}

// check overlap between tongue and start target, start the game when eaten
function checkStartTargetOverlap() {
    // Only check if tongue is active (outbound or inbound)
    if (frog.tongue.state === "idle") return;

    const d = dist(frog.tongue.x, frog.tongue.y, startTarget.x, startTarget.y);
    const overlap = d < frog.tongue.size / 2 + startTarget.size / 2;
    if (overlap) {
        startTarget.eaten = true;
        // begin the game
        gameStarted = true;
        gameOver = false;
        gameStartTime = millis();
        // pull tongue back
        frog.tongue.state = "inbound";
    }
}

/**
 * Checks overlap between the active frog's tongue and the fly.
 * If eaten, reset fly, play SFX, toggle which frog is active, reset tongues.
 */
function checkActiveTongueFlyOverlap() {
    const activeTongue = lowerActive ? frog.tongue : upsideDownfrog.tongue;

    // ensure tongue has valid coords before checking
    if (typeof activeTongue.x === 'undefined' || typeof activeTongue.y === 'undefined') return;

    const d = dist(activeTongue.x, activeTongue.y, fly.x, fly.y);
    const eaten = (d < activeTongue.size/2 + fly.size/2);
    if (!eaten) return;

    // Play fly buzz sound
    if (flyBuzzSound && flyBuzzSound.isLoaded()) {
        flyBuzzSound.setVolume(0.6);
        flyBuzzSound.play();
    }

    // Reset the fly
    resetFly();

    // Bring back the active tongue
    activeTongue.state = "inbound";

    // Increase score
    score += 1;

    // Toggle which frog is active
    lowerActive = !lowerActive;

    // Reset both tongues to safe starting positions for the new active frog
    frog.tongue.state = "idle";
    frog.tongue.y = frog.body.y - frog.body.size / 2;
    upsideDownfrog.tongue.state = "idle";
    upsideDownfrog.tongue.y = upsideDownfrog.body.y + upsideDownfrog.body.size / 2;
}




