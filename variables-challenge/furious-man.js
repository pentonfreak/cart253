/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
const rate = 2;

let mrFurious = {
  // Position and size
  x: 200,
  y: 200,
  size: 100,
  // Colour
  fill: {
    r: 255,
    g: 225,
    b: 225
  }
};

// The sky
let sky = {
  r: 100,
  g: 150,
  b: 255
}; 

// A bird
let bird = {
  x: 0,
  y: 100,
  size: 50,
  speed: 2
};

/**
 * Create the canvas
 */
function setup() {
  createCanvas(400, 400);
}
// Set the frame rate
frameRate(rate);

// Position the bird
bird.x = 50;
bird.y = 50;

// Move the bird
bird.x = bird.x + bird.speed;

/**
 * Draw (and update) Mr. Furious
 */
function draw() {
  background(sky.r, sky.g, sky.b);

  
  // Draw Mr. Furious as a coloured circle
  push();
  stroke(0);
  strokeWeight(2);
  fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
  ellipse(mrFurious.x, mrFurious.y, mrFurious.size);
  pop();
}