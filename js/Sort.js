// Sort class

class Sort {

    constructor() {
        // Draw class instance
        this.d = null;

        // Audio class instance
        this.a = null;

        // queue which contains order of sorting (for drawing)
        this.drawingQueue = [];

        // drawing interval
        this.draw = null;

        // audio output
        this.oscillator = null;

        // stats
        this.comparisons = 0;
        this.swaps = 0;
    }

    sort(algorithm, arr, params, log = null) {

        // clearing previous sorting
        this.clear();

        // setting up audio
        if (params.audioEnabled) {
            this.a = new Audio();
            this.oscillator = this.a.createOscillator();
        }
        
        // array verification
        if (arr === undefined || arr === null || arr.length === 0) {
            throw new Error('Incorrect array');
        }

        // logging
        if (log.io) {
            console.log('input array:');
            console.log(arr);
        }

        // stats DOM elements
        let comparisonsStats = document.querySelector('.stats #comparisons');
        let swapsStats = document.querySelector('.stats #swaps');

        // initializing drawing class
        this.d = new Draw('canv');

        // copying initial array to drawingArray
        // drawingArray will be modified using the drawingQueue
        let drawingArray = [];
        for (let i = 0; i < arr.length; i++) {
            drawingArray.push( { val: arr[i], swapped: false, compared: false });
        }

        // width of one array element (column, square, etc.)
        let cellWidth;

        // defining this for setInterval
        let th = this;

        // variable for clearing interval
        let sorted = false;

        // drawingQueue iterator
        let drawingIterator = 0;

        // drawing
        this.draw = setInterval(function(th) {

            // drawing background
            th.d.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');

            //drawing elements
            for (let i = 0; i < drawingArray.length; i++) {

                // calculating width of elements
                cellWidth = document.body.offsetWidth / drawingArray.length;

                // calculating coordinates
                let x = i * cellWidth;
                let y = 500;

                // setting default color (green)
                let col = 'rgb(0, ' + Draw.getColor(arr, drawingArray[i].val) + ', 0';

                // if this element was swapped...
                if (drawingArray[i].swapped) {

                    // ...playing audio,
                    if (params.audioEnabled) {
                        th.oscillator.frequency.value = Audio.getLowFreq(arr, drawingArray[i].val);
                    }

                    // highlighting element
                    th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val + cellWidth / 2, '#ff5500');
                }
                // if this element was compared...
                else if (drawingArray[i].compared) {

                    // ...playing audio,
                    if (params.audioEnabled) {
                        th.oscillator.frequency.value = Audio.getHighFreq(arr, drawingArray[i].val);
                    }

                    //highlighting element
                    th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val + cellWidth / 2, '#fffb00');
                }
                // if the array is sorted, all the elements have 'sorted' attribute set true
                else if (drawingArray[i].sorted) {

                    // playing audio
                    if (params.audioEnabled) {
                        th.oscillator.frequency.value = Audio.getHighFreq(arr, drawingArray[i].val);
                    }

                    // setting color to blue
                    col = 'rgb(0, 0, ' + Draw.getColor(arr, drawingArray[i].val) + ')';
                }
                
                // drawing elements
                //  drawing columns
                if (params.shape === 'columns') {

                    // if element is highlighted we draw a little square on top (otherwise highlight will be invisible)
                    if (drawingArray[i].compared || drawingArray[i].swapped) {
                        th.d.drawRectangle(x, y - drawingArray[i].val, cellWidth, cellWidth, col);
                    }

                    // if no, we draw a column
                    else {
                        th.d.drawRectangle(x, y, cellWidth, -drawingArray[i].val, col);
                    }
                }
                //  drawing squares
                else if (params.shape === 'squares') {
                    th.d.drawRectangle(x, y - drawingArray[i].val, cellWidth, cellWidth, col);
                }
                //  drawing circles
                else if (params.shape === 'circles') {
                    th.d.drawCircle(x + cellWidth / 2, y - drawingArray[i].val + cellWidth / 2, cellWidth / 2, col);
                }

                // setting 'compared' and 'swapped' attributes to default values
                drawingArray[i].compared = false;
                drawingArray[i].swapped = false;
            }
            // if there are unprocessed changes
            if (th.drawingQueue.length > drawingIterator) {

                // elements that have been swapped, compared, etc.
                let i = th.drawingQueue[drawingIterator].elements.i;
                let j = th.drawingQueue[drawingIterator].elements.j;

                // if they were swapped...
                if (th.drawingQueue[drawingIterator].op === 'swap') {
                    // ...swap them in the drawingArray
                    drawingArray.swap(i, j);

                    // they will be highlighted on next iteration
                    drawingArray[i].swapped = true;
                    drawingArray[j].swapped = true;

                    //changing stats
                    th.swaps++;
                    th.comparisons++;
                }
                // if they were compared...
                else if (th.drawingQueue[drawingIterator].op === 'comp') {
                    // ...they will be highlighted on next iteration
                    drawingArray[i].compared = true;
                    drawingArray[j].compared = true;

                    //changing stats
                    th.comparisons++;
                }
                // when the array is sorted we set the sorted attribute to true
                else if (th.drawingQueue[drawingIterator].op === 'sorted') {
                    th.comparisons++;
                    drawingArray[i].sorted = true;
                }
                
                // proceed to next element in queue
                drawingIterator++;
            }
            // if the array is sorted and we drew it (made everything blue)...
            else if (sorted) {

                // ...we clear draw loop...
                clearInterval(th.draw);

                // ...and stop audio
                if (params.audioEnabled) {
                    th.oscillator.stop(th.a.context.currentTime + 0.1);
                }
            }
            // if the array is sorted but isn't drew (it isn't blue)...
            else if (drawingArray.isSorted()) {

                // ...push all the elements to drawingQueue
                for (let i = 0; i < drawingArray.length; i++) {
                    th.drawingQueue.push({
                        elements: { i, j: i},
                        op: 'sorted'
                    });
                }
                
                // and clear draw loop on next iteration
                sorted = true;
            }

            // changing stats
            comparisonsStats.innerHTML = th.comparisons;
            swapsStats.innerHTML = th.swaps;
        }, params.delay, th);


        // timer initial value
        let t0;
        if (params.setTimer) {
            t0 = performance.now();
        }

        // calling sorting algorithm
        try {
            let algo = algorithm + 'Sort';
            this[algo](arr);
        } 
        catch (e) {
            console.log(e);
            throw new Error('Incorrect alrgorithm');
        }

        // logging
        if (log.io) {
            console.log('output array:');
            console.log(arr);
        }

        // logging
        let execTime = 0;
        if (params.setTimer) {
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

    // ***** SORTING ALGORITHMS BEGIN *****

    bubbleSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[i]) {
                    arr.swap(i, j);
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
                    arr.swap(i, i + 1);
                    this.swapPush(i, i + 1);
                }
                else {
                    this.compPush(i, i + 1);
                }
            }
            right--;

            for (let i = right; i > left; i--) {
                if (arr[i - 1] > arr[i]) {
                    arr.swap(i, i - 1);
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
                    arr.swap(i, i + step);
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
                    arr.swap(i, i + 1);
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
                arr.swap(j, j - 1);
                this.swapPush(j, j - 1);
            }
        }
    }

    shellSort(arr) {
        let step = Math.floor(arr.length / 2);
        while (step > 0) {
            for (let i = step; i < arr.length; i++) {
                for (let j = i - step; j >= 0 && arr[j + step] < arr[j]; j -= step) {
                    arr.swap(j, j + step);
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
                arr.swap(i, i - 1);
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
            arr.swap(i, minInd);
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

    // ***** SORTING ALGORITHMS END *****

    // clear previous sorting
    clear() {

        // if there was a sorting
        if (this.draw !== undefined) {

            // we stop it
            clearInterval(this.draw);

            // stop audio
            try {
                this.oscillator.stop(this.a.context.currentTime);
            }
            catch (e) {
                // yeah
                // i'll fix it
            }
            
            // set everything to null/0
            this.drawingQueue = [];
            this.d = null;
            this.swaps = 0;
            this.comparisons = 0;
            this.a = null;

        }
    }

    // push 'swap' operation to the drawingQueue
    swapPush(i, j) {
        this.drawingQueue.push({
            elements: { i, j },
            op: 'swap'
        });
    }

    // push 'compare' operation to the drawingQueue
    compPush(i, j) {
        this.drawingQueue.push({
            elements: { i, j },
            op: 'comp'
        });
    }
}