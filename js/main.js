let arr = [];
let arrLength = 1e2;

const lengthInput = document.getElementById('length');

function main() {

    let s = new Sort();
    let d = new Draw('canv');

    lengthInput.value = arrLength;

    lengthInput.addEventListener('focusout', function() {
        arrLength = lengthInput.value;
    });

    Array.prototype.forEach.call(document.getElementsByClassName('button'), function(elem) {
        elem.addEventListener('click', function() {
            arr = [];
            for (let i = 0; i < arrLength; i++) {
                arr.push(Math.trunc(Math.random() * 490 + 5));
            }

            s.sort(this.id, arr, true, { io: false, timer: true });
        });
    });
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