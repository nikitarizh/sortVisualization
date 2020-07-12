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

    // push random elements to arr and draw it
    init();

    // setting up audio
    let audio = null;
    let audioEnabled = false;

    // Audio is currently supported only in Chrome
    if (window.navigator.userAgent.indexOf('Chrome') !== -1) {

        // initializing context
        audio = new AudioContext();

        // enabling it by user input
        document.getElementById('enableAudio').addEventListener('click', function() {

            // disabling button
            this.disabled = 'true';
            this.classList.add('disabled');

            // enabling audio
            audio.resume().then(function() {
                audioEnabled = true;
            });
        });
    }
    else {
        document.getElementById('enableAudio').disabled = 'true';
        document.getElementsByClassName('chromeOnly')[0].style.display = 'inline';
    }
    
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

    // initializing Sort class
    let s = new Sort();

    // setting event listeners for sorting algorithms buttons
    Array.prototype.forEach.call(document.getElementsByClassName('button'), function(elem) {
        elem.addEventListener('click', function() {

            window.scrollTo(0, 0);

            // if the array is sorted, empty it and fill with new elements
            if (isSorted(arr) || arrLength !== 1e2) {
                arr = [];
                for (let i = 0; i < arrLength; i++) {
                    arr.push(Math.trunc(Math.random() * 490 + 5));
                }
            }

            // sort it
            s.sort(this.id, arr, delay, { audio: audio, enabled: audioEnabled }, { setTimer: true, shape }, { io: false, timer: true });
        });
    });
}

// is called on page load
function init() {

    // fill the array with random elements
    for (let i = 0; i < arrLength; i++) {
        arr.push(Math.trunc(Math.random() * 490 + 5));
    }

    // initialize drawing class
    let d = new Draw('canv');

    // draw the array
    d.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');
    for (let i = 0; i < arr.length; i++) {
        cellWidth = document.body.offsetWidth / arr.length;
        let x = i * cellWidth;
        let y = 500;
        let col = 'rgb(0, ' + Sort.getColor(arr, arr[i]) + ', 0)';

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

// check if arr is sorted
function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }

    return true;
}