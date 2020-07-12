// array to sort
let arr = [];
// length of this array
let arrLength = 1e2;

// frame time
let delay = 20;

// params inputs
const lengthInput = document.getElementById('length');
const delayInput = document.getElementById('delay');

function main() {

    // push random elements to arr and draw it
    init();

    // setting up audio
    let audio = new AudioContext();
    let audioEnabled = false;
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

    // default values in inputs
    lengthInput.value = arrLength;
    delayInput.value = 20;

    // change length of array
    lengthInput.addEventListener('focusout', function() {
        arrLength = lengthInput.value;
    });

    // change frame time
    delayInput.addEventListener('focusout', function() {
        delay = delayInput.value;
    });

    // initializing Sort class
    let s = new Sort();
    // setting event listeners for sorting algorithms buttons
    Array.prototype.forEach.call(document.getElementsByClassName('button'), function(elem) {
        elem.addEventListener('click', function() {

            // if the array is sorted, empty it and fill with new elements
            if (isSorted(arr)) {
                arr = [];
                for (let i = 0; i < arrLength; i++) {
                    arr.push(Math.trunc(Math.random() * 490 + 5));
                }
            }

            // sort it
            s.sort(this.id, arr, delay, { audio: audio, enabled: audioEnabled }, true, { io: false, timer: true });
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
        d.drawRectangle(x, y, cellWidth, -arr[i], col);
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