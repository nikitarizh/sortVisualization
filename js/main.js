// array to sort
let arr = [];
// length of this array
let arrLength = 1e2;

// frame time
let delay = 20;

// shape
let shape = 'circles';

// params inputs
const lengthInput = document.getElementById('length');
const delayInput = document.getElementById('delay');
const shapesInputs = document.getElementsByClassName('shape');

function main() {


    // ***** INITIALIZATION *****


    // initializing Drawing queue
    let dq = new DrawingQueue();

    // initializing Sort class
    let s = new Sort(dq);

    // initializing Draw class
    let d = new Draw('canv', dq);

    // push random elements to arr and draw it
    fillArray(d);


    // ***** INITIALIZATION END *****


    // ***** AUDIO *****


    // setting up audio
    let audioEnabled = false;

    // Audio is currently supported only in Chrome
    if (window.navigator.userAgent.indexOf('Chrome') !== -1) {

        // enabling it by user input
        document.getElementById('enableAudio').addEventListener('click', function() {

            // disabling button
            this.disabled = 'true';
            this.classList.add('disabled');

            // enabling audio
            new AudioContext().resume().then(function() {
                audioEnabled = true;
            });
        });
    }
    else {
        document.getElementById('enableAudio').disabled = 'true';
        document.getElementsByClassName('chromeOnly')[0].style.display = 'inline';
    }

    // ***** AUDIO END *****


    // ***** PARAMETERS INPUTS *****
    

    // default values in inputs
    lengthInput.value = arrLength;
    delayInput.value = 20;
    document.querySelector('.shape#' + shape).classList.add('selected');

    // change length of array
    lengthInput.addEventListener('focusout', function() {
        arrLength = lengthInput.value;
    });

    // change frame time
    delayInput.addEventListener('focusout', function() {
        delay = delayInput.value;
    });

    // change shapes
    Array.prototype.forEach.call(shapesInputs, function(elem) {
        elem.addEventListener('click', function() {
            
            // make previous shape input unselected
            document.getElementById(shape).classList.remove('selected');

            // change shape
            shape = this.id;

            // make current shape input selected
            this.classList.add('selected');
        })
    });


    // ***** PARAMETERS INPUTS END *****


    // ***** LAUNCHING SORTING ALGORITHMS

    // setting event listeners for sorting algorithms buttons
    Array.prototype.forEach.call(document.getElementsByClassName('button'), function(elem) {
        elem.addEventListener('click', function() {

            // clearing previous sorting
            clear(d, dq);

            // scrolling to the top
            window.scrollTo(0, 0);

            // if the array is sorted, then empty it and fill with new elements
            if (arr.isSorted() || arrLength !== 100) {
                arr = [];
                for (let i = 0; i < arrLength; i++) {
                    arr.push(Math.trunc(Math.random() * 490 + 5));
                }
            }

            // build params
            let params = {
                delay,
                audioEnabled,
                shape,
                setTimer: true
            }

            // build logging params
            let loggingParams = {
                io: false, 
                timer: true
            }

            // start drawing (setting draw interval)
            d.draw(arr, params);

            // start sorting
            s.sort(this.id, arr, params, loggingParams);
        });
    });
}

// is called on page load
function fillArray(d) {
    // fill the array with random elements
    for (let i = 0; i < arrLength; i++) {
        arr.push(Math.trunc(Math.random() * 490 + 5));
    }

    // draw the array
    d.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');
    for (let i = 0; i < arr.length; i++) {
        console.log('call');
        cellWidth = document.body.offsetWidth / arr.length;
        let x = i * cellWidth;
        let y = 500;
        let col = 'rgb(0, ' + Draw.getColor(arr, arr[i]) + ', 0)';

        if (shape === 'columns') {
            d.drawRectangle(x, y, cellWidth, -arr[i], col);
        }
        else if (shape === 'squares') {
            d.drawRectangle(x, y - arr[i], cellWidth, cellWidth, col);
        }
        else if (shape === 'circles') {
            d.drawCircle(x + cellWidth / 2, y - arr[i] + cellWidth / 2, cellWidth / 2, col);
        }
    }
}

// clears previous sorting
function clear(draw, dq) {
    if (draw.drawingInterval !== undefined) {

        // stop drawing
        clearInterval(draw.drawingInterval);

        // stop audio
        try {
            draw.oscillator.stop(draw.audio.context.currentTime);
        }
        catch (e) {
            // yeah
            // i'll fix it
        }

        // set everything to null/0
        dq.clear();
        draw.swaps = 0;
        draw.comparisons = 0;
        draw.audio = null;
        draw.oscillator = null;
    }
}