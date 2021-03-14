const { createClient } = require("node-thinkgear-sockets");
const debounce = require('debounce');
const robot = require("robotjs");

const brain = createClient({ enableRawOutput: false });

// focus mode is on by default
let focus = true;
let blink = false;
let debugLogging = true;

if(process.argv.length > 2){
    blink = process.argv[2] === '-blink';
    focus = !blink;
}

/**
 * Debounce toggle by 1/4th sec
 * to keep from spamming click.
 */
const click = debounce(()=>{
    console.log("Mouse Click");
    robot.mouseClick();
}, 250, true);

brain.connect();

// Focus logic
if(focus){
    console.log("Focus mode active. Concentrate to click.");
    brain.on('data', data=>{
        const attention = data && data.eSense && data.eSense.attention;
        debugLogging && console.log("Attention: ", attention);
        if(attention >= 60){
            click();
        }
    })
}

// Blink logic
if(blink){
    console.log("Blink mode active. Blink to click.");
    brain.on('blink_data', data=>{
        const blinkStrength = data && data.blinkStrength;
        debugLogging && console.log("Blink Strength: ", blinkStrength);
        if(blinkStrength > 40){
            click();
        }
    })
}
