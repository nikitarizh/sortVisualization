class Sort {

    d;
    drawingQueue = null;
    draw;
    audio;
    oscillator;
    comparisons = 0;
    swaps = 0;

    sort(algorithm, arr, delay, audio, setTimer = false, log = null) {

        this.clear();

        this.d = new Draw('canv');
        this.drawingQueue = [];
        let drawingIterator = 0;

        this.audio = audio.audio;
        
        // array verification
        if (arr === undefined || arr === null || arr.length === 0) {
            throw new Error('Incorrect array');
        }

        if (log.io) {
            console.log('input array:');
            console.log(arr);
        }

        let t0;
        let drawingArray = [];
        for (let i = 0; i < arr.length; i++) {
            drawingArray.push( { val: arr[i], swapped: false, compared: false });
        }

        let cellWidth;
        let th = this;

        let comparisonsStats = document.querySelector('.stats #comparisons');
        let swapsStats = document.querySelector('.stats #swaps');

        if (audio.enabled) {
            this.oscillator = this.audio.createOscillator();
            this.oscillator.connect(this.audio.destination);
            this.oscillator.type = 'triangle';
            this.oscillator.start(0);
        }
        
        let sorted = false;
        this.draw = setInterval(function(th) {
            th.d.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');
            for (let i = 0; i < drawingArray.length; i++) {
                cellWidth = document.body.offsetWidth / drawingArray.length;
                let x = i * cellWidth;
                let y = 500;
                if (drawingArray[i].swapped) {
                    if (audio.enabled) {
                        th.oscillator.frequency.value = drawingArray[i].val / 2;
                    }

                    th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val, '#ff5500');

                    drawingArray[i].swapped = false;
                }
                else if (drawingArray[i].compared) {
                    if (audio.enabled) {
                        th.oscillator.frequency.value = drawingArray[i].val * 2;
                    }

                    th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val, '#fffb00');

                    drawingArray[i].compared = false;
                }
                else if (drawingArray[i].sorted) {
                    th.oscillator.frequency.value = drawingArray[i].val * 2;
                    let col = 'rgb(0, 0, ' + th.constructor.getColor(arr, drawingArray[i].val);
                    th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val, col);
                }
                else {
                    let col = 'rgb(0, ' + th.constructor.getColor(arr, drawingArray[i].val) + ', 0)';

                    th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val, col);
                }
            }
            if (th.drawingQueue.length > drawingIterator) {
                let i = th.drawingQueue[drawingIterator].elements.i;
                let j = th.drawingQueue[drawingIterator].elements.j;
                if (th.drawingQueue[drawingIterator].op === 'swap') {
                    th.swap(drawingArray, i, j);
                    drawingArray[i].swapped = true;
                    drawingArray[j].swapped = true;
                    th.swaps++;
                    th.comparisons++;
                }
                else if (th.drawingQueue[drawingIterator].op === 'comp') {
                    drawingArray[i].compared = true;
                    drawingArray[j].compared = true;
                    th.comparisons++;
                }
                else if (th.drawingQueue[drawingIterator].op === 'sorted') {
                    th.comparisons++;
                    drawingArray[i].sorted = true;
                }
                
                drawingIterator++;
            }
            else if (sorted) {
                clearInterval(th.draw);
                th.oscillator.stop(th.audio.currentTime + 0.1);
            }
            else if (th.isSorted(drawingArray)) {
                for (let i = 0; i < drawingArray.length; i++) {
                    th.drawingQueue.push({
                        elements: { i, j: i},
                        op: 'sorted'
                    });
                }
                sorted = true;
            }
            comparisonsStats.innerHTML = th.comparisons;
            swapsStats.innerHTML = th.swaps;
        }, delay, th);
        // calling sorting algorithm
        switch (algorithm) {
            case 'bubble':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.bubbleSort(arr);
                break;
            case 'shaker':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.shakerSort(arr);
                break;
            case 'comb':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.combSort(arr);
                break;
            case 'insertion':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.insertionSort(arr);
                break;
            case 'shell':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.shellSort(arr);
                break;
            case 'gnome':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.gnomeSort(arr);
                break;
            case 'selection':
                if (setTimer) {
                    t0 = performance.now();
                }
                this.selectionSort(arr);
                break;
            case 'merge':
                if (setTimer) {
                    t0 = performance.now();
                }
                arr = this.mergeSort(arr);
                break;
            default:
                throw new Error('Incorrect alrgorithm');
        }

        if (log.io) {
            console.log('output array:');
            console.log(arr);
        }

        let execTime = 0;
        if (setTimer) {
            execTime = performance.now() - t0;

            let time;
            if (log.timer) {
                if (execTime < 1000) {
                    time = execTime + 'ms';
                }
                else if (execTime < 60000) {
                    time = (Math.trunc(execTime * 1000) / 1e6) + 's';
                }
                else {
                    time = ((Math.trunc(execTime * 1000) / 1e6) / 60) + 'm';
                }
                console.log('%c%s%c sort took ' + time, 'background: #242424; color: #fac916', algorithm, 'background: #242424; color: #bada55');
            }
        }
        return execTime;
    }

    bubbleSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[i]) {
                    this.swap(arr, i, j);
                    this.swapPush(i, j);
                }
                else {
                    this.compPush(i, j);
                }
            }
        }
    }

    shakerSort(arr) {
        let left = 0, right = arr.length - 1;
        while (left < right) {
            for (let i = left; i < right; i++) {
                if (arr[i + 1] < arr[i]) {
                    this.swap(arr, i, i + 1);
                    this.swapPush(i, i + 1);
                }
                else {
                    this.compPush(i, i + 1);
                }
            }
            right--;

            for (let i = right; i > left; i--) {
                if (arr[i - 1] > arr[i]) {
                    this.swap(arr, i, i - 1);
                    this.swapPush(i, i - 1);
                }
                else {
                    this.compPush(i, i - 1);
                }
            }
            left++;
        }
    }

    combSort(arr) {
        let k = 1.2473309;
        let step = arr.length - 1;
        while (step > 1) {
            for (let i = 0; i + step < arr.length; i++) {
                if (arr[i + step] < arr[i]) {
                    this.swap(arr, i, i + step);
                    this.swapPush(i, i + step);
                }
                else {
                    this.compPush(i, i + step);
                }
            }
            step = Math.floor(step / k);
        }

        let swapped = true;
        while (swapped) {
            swapped = false;
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i + 1] < arr[i]) {
                    this.swap(arr, i, i + 1);
                    this.swapPush(i, i + 1);
                    swapped = true;
                }
                else {
                    this.compPush(i, i + 1);
                }
            }
        }
    }

    insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            for (let j = i; j > 0 && arr[j - 1] > arr[j]; j--) {
                this.swap(arr, j, j - 1);
                this.swapPush(j, j - 1);
            }
        }
    }

    shellSort(arr) {
        let step = Math.floor(arr.length / 2);
        while (step > 0) {
            for (let i = step; i < arr.length; i++) {
                for (let j = i - step; j >= 0 && arr[j + step] < arr[j]; j -= step) {
                    this.swap(arr, j, j + step);
                    this.swapPush(j, j + step);
                }
            }

            step = Math.floor(step / 2);
        }
    }

    gnomeSort(arr) {
        let i = 0;
        while (i < arr.length) {
            if (i == 0 || arr[i] >= arr[i - 1]) {
                i++;
            }
            else {
                this.swap(arr, i, i - 1);
                this.swapPush(i, i - 1);
                i--;
            }
        }
    }

    selectionSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            let minInd = i;
            for (let j = i + 1; j < arr.length; j++) {
                this.compPush(j, minInd);
                if (arr[j] < arr[minInd]) {
                    minInd = j;
                }
            }
            this.swap(arr, i, minInd);
            this.swapPush(i, minInd);
        }
    }

    // TODO: visualize
    mergeSort(arr) {

        if (arr.length <= 1) {
            return arr;
        }

        let arr1 = this.mergeSort(arr.slice(0, arr.length / 2));
        let arr2 = this.mergeSort(arr.slice(arr.length / 2, arr.length));

        let output = [];
        let i1 = 0, i2 = 0;
        while (i1 < arr1.length && i2 < arr2.length) {
            if (arr1[i1] < arr2[i2]) {
                output.push(arr1[i1]);
                i1++;
            }
            else {
                output.push(arr2[i2]);
                i2++;
            }
        }

        if (i1 != arr1.length) {
            for (let i = i1; i < arr1.length; i++) {
                output.push(arr1[i]);
            }
        }
        if (i2 != arr2.length) {
            for (let i = i2; i < arr2.length; i++) {
                output.push(arr2[i]);
            }
        }

        return output;
    }

    swap(arr, i, j) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].val < arr[i - 1].val) {
                return false;
            }
        }
    
        return true;
    }

    clear() {
        if (this.draw !== undefined) {
            clearInterval(this.draw);
            this.drawingQueue = null;
            this.d = null;

            this.swaps = 0;
            this.comparisons = 0;

            try {
                this.oscillator.stop(this.audio.currentTime);
            }
            catch (e) {}
            this.audio = null;
        }
    }

    swapPush(i, j) {
        this.drawingQueue.push({
            elements: { i, j },
            op: 'swap'
        });
    }
    compPush(i, j) {
        this.drawingQueue.push({
            elements: { i, j },
            op: 'comp'
        });
    }

    static getColor(arr, x) {
        let mn = 1e9;
        let mx = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > mx) {
                mx = arr[i];
            }
            if (arr[i] < mn) {
                mn = arr[i];
            }
        }
        
        let range = mx - mn;

        return (x - mn) / range * 150 + 70;
    }
}