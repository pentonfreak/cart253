/**
 * Variable Challenge
 * Khuong
 */

"use strict";

/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

const rate = 20
// Our friend Mr. Furious
let mrFurious = {
    // Position and size
    x: 200,
    y: 200,
    size: 100,
    // Colour
    fill: {
        r: 50,
        g: 0,
        b: 0
    }
};

// The sky
let sky = {
    r: 0,
    g: 0,
    b: 255
};

// A bird
let bird = {
    x: undefined,
    y: undefined,
    size: 20,
    speed: 10

};


//Create the canvas
function setup() {
    createCanvas(400, 400);
    //sets framerate
    frameRate(rate);
    //sets bird position
    bird.x = 50;
    bird.y = 50;
}


/**
 
Draw (and update) Mr. Furious*/
function draw() {
    background(sky.r, sky.g, sky.b);

    //makes sky change colour
    sky.b = sky.b - 10;
    // makes him redder
    mrFurious.fill.r = mrFurious.fill.r + 5;


    //makes sky loop
    if (sky.b <= 0) {
        sky.b = 255;
    }

    //makes him loop
    if (mrFurious.fill.r >= 500) {
        mrFurious.fill.r = 50;
        mrFurious.size = 100;
    }

    //makes bird reappear
    if (bird.x > width) {
        bird.x = 50;
    }

    // Draw Mr. Furious as a coloured circle
    push();
    noStroke();

//makes him shake
    mrFurious.x += random(1, 20);
    mrFurious.x -= random(1, 20);

//makes him bigger
    fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
    mrFurious.size = mrFurious.size + 1;

    ellipse(mrFurious.x, mrFurious.y, mrFurious.size);
    pop();

    //Moves bird
    bird.x += bird.speed;

    ellipse(bird.x, bird.y, bird.size);
}