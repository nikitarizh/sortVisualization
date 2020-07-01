let arr = [];

function main() {

    for (let i = 0; i < 1e2; i++) {
        arr.push(Math.trunc(Math.random() * 490 + 5));
    }

    let s = new Sort();
    let d = new Draw('canv');

    s.sort('shaker', arr, true, { io: false, timer: true });

    // shuffle(arr);

    // s.sort('bubble', arr, true, { io: false, timer: true });

    // shuffle(arr);

    // s.sort('comb', arr, true, { io: false, timer: true });
    // console.log(isSorted(arr));

    // shuffle(arr);

    // s.sort('insertion', arr, true, { io: false, timer: true });
    // console.log(isSorted(arr));

    // shuffle(arr);

    // s.sort('shell', arr, true, { io: false, timer: true });
    // console.log(isSorted(arr));

    // shuffle(arr);

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