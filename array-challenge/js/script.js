/**
 * Boingo
 * Khuong Nguyen
 *
 * A ball that bounces around on the canvas
 */

 // Will create it with createBall()
 let balls = [];

/**
 * Create the canvas and the ball
*/
function setup() {
  // Create the canvas
  createCanvas(400, 400);
  // Create the ball
  for (let i = 0; i < 10 ; i++) {
    balls.push(createBalls());
  }
}

/**
 * Creates a random ball
 */
function createBalls() {
  // Create a ball object with appropriate properties
  const newBalls = {
    // Position and dimensions
    x: 200,
    y: 200,
    size: 20,
    // Colour
    fill: "#000000",
    // Movement
    velocity: {
      x: random(-5, 5),
      y: random(-5, 5)
    }
  };
  return newBalls;
}

/**
 * Moves and draws the ball
 */
function draw() {
  background("#87ceeb");
  
  for (let ball of balls){
  moveBall(ball);
  bounceBall(ball);
  drawBall(ball);
    }
}

/**
 * Moves the ball according to its velocity
 */
function moveBall(balls) {
  balls.x += balls.velocity.x;
  balls.y += balls.velocity.y;
}

/**
 * Bounces the ball off the walls
 */
function bounceBall(balls) {
  // Check if the ball has reached the left or right
  const bounceX = (balls.x > width || balls.x < 0);
  // Check if the ball has reached the top or bottom
  const bounceY = (balls.y > height || balls.y < 0);
  
  // Handle bouncing horizontally
  if (bounceX) {
    balls.velocity.x *= -1;
  }
  // Handle bouncing vertically
  if (bounceY) {
    balls.velocity.y *= -1;
  }
}

/**
 * Draw the ball on the canvas
 */
function drawBall(balls) {
  push();
  noStroke();
  fill(balls.fill);
  ellipse(balls.x, balls.y, balls.size);
  pop();
}

function mousePressed() {
    balls.push(createBalls());
}
