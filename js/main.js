let arr = [];
let arrLength = 1e2;

let delay = 20;

const lengthInput = document.getElementById('length');
const delayInput = document.getElementById('delay');

function main() {

    init();

    let audio = new AudioContext();
    let audioEnabled = false;
    document.getElementById('enableAudio').addEventListener('click', function() {
        this.disabled = 'true';
        this.classList.add('disabled');
        audio.resume().then(function() {
            audioEnabled = true;
        });
    });

    lengthInput.value = arrLength;
    delayInput.value = 20;

    lengthInput.addEventListener('focusout', function() {
        arrLength = lengthInput.value;
    });

    delayInput.addEventListener('focusout', function() {
        delay = delayInput.value;
    });

    let s = new Sort();
    Array.prototype.forEach.call(document.getElementsByClassName('button'), function(elem) {
        elem.addEventListener('click', function() {
            
            if (isSorted(arr)) {
                arr = [];
                for (let i = 0; i < arrLength; i++) {
                    arr.push(Math.trunc(Math.random() * 490 + 5));
                }
            }

            s.sort(this.id, arr, delay, { audio: audio, enabled: audioEnabled }, true, { io: false, timer: true });
        });
    });
}

function init() {
    for (let i = 0; i < arrLength; i++) {
        arr.push(Math.trunc(Math.random() * 490 + 5));
    }

    let d = new Draw('canv');

    d.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');
    for (let i = 0; i < arr.length; i++) {
        cellWidth = document.body.offsetWidth / arr.length;
        let x = i * cellWidth;
        let y = 500;
        let col = 'rgb(0, ' + Sort.getColor(arr, arr[i]) + ', 0)';
        d.drawRectangle(x, y, cellWidth, -arr[i], col);
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }

    return true;
}