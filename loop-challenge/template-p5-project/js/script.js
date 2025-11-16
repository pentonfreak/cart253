/**
 * Lines
 * Pippin Barr
 * 
 * A series of lines across the canvas
 */

"use strict";

/**
 * Creates the canvas
 */

const frameRate = 30;
function setup() {
    createCanvas(500, 500);
}

/**
 * Draws lines across the canvas with increasing thickness and
 * gradually lightening colour
 */
function draw() {

    // background("pink");

    let top = { r: 255, g: 0, b: 100 };
    let bottom = { r: 100, g: 200, b: 255 };

    
    for (let y = 0; y <= height; y ++) {
        let r = map(y, 0, height, top.r, bottom.r);
        let g = map(y, 0, height, top.g, bottom.g);
        let b = map(y, 0, height, top.b, bottom.b);
        stroke(r, g, b);
        line(0, y, width, y);
    }

    let x = 0;
    let strokeValue = 0;
    let thickness = 1;
    
   while (x <= width) {
        stroke(strokeValue);
        strokeWeight(thickness);
        line(x, 0, x, height);

        x += 30;
        strokeValue += 25;
        thickness += 0.3;
    }

    let y = 0;
    strokeValue = 0;
    thickness = 1;

    while (y <= height) {
        stroke(strokeValue);
        strokeWeight(thickness);
        line(0, y, width, y);

        y += 30;
        strokeValue += 25;
        thickness += 0.3;
    }

    strokeWeight(1);
}
