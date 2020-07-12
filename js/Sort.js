// Sort class

class Sort {

    constructor(dq) {

        // queue which contains order of sorting (for drawing)
        this.drawingQueue = dq;

    }

    sort(algorithm, arr, params, log = null) {
        
        // array verification
        if (arr === undefined || arr === null || arr.length === 0) {
            throw new Error('Incorrect array');
        }

        // logging
        if (log.io) {
            console.log('input array:');
            console.log(arr);
        }

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
                    this.drawingQueue.swapPush(i, j);
                }
                else {
                    this.drawingQueue.compPush(i, j);
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
                    this.drawingQueue.swapPush(i, i + 1);
                }
                else {
                    this.drawingQueue.compPush(i, i + 1);
                }
            }
            right--;

            for (let i = right; i > left; i--) {
                if (arr[i - 1] > arr[i]) {
                    arr.swap(i, i - 1);
                    this.drawingQueue.swapPush(i, i - 1);
                }
                else {
                    this.drawingQueue.compPush(i, i - 1);
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
                    this.drawingQueue.swapPush(i, i + step);
                }
                else {
                    this.drawingQueue.compPush(i, i + step);
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
                    this.drawingQueue.swapPush(i, i + 1);
                    swapped = true;
                }
                else {
                    this.drawingQueue.compPush(i, i + 1);
                }
            }
        }
    }

    insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            for (let j = i; j > 0 && arr[j - 1] > arr[j]; j--) {
                arr.swap(j, j - 1);
                this.drawingQueue.swapPush(j, j - 1);
            }
        }
    }

    shellSort(arr) {
        let step = Math.floor(arr.length / 2);
        while (step > 0) {
            for (let i = step; i < arr.length; i++) {
                for (let j = i - step; j >= 0 && arr[j + step] < arr[j]; j -= step) {
                    arr.swap(j, j + step);
                    this.drawingQueue.swapPush(j, j + step);
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
                this.drawingQueue.swapPush(i, i - 1);
                i--;
            }
        }
    }

    selectionSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            let minInd = i;
            for (let j = i + 1; j < arr.length; j++) {
                this.drawingQueue.compPush(j, minInd);
                if (arr[j] < arr[minInd]) {
                    minInd = j;
                }
            }
            arr.swap(i, minInd);
            this.drawingQueue.swapPush(i, minInd);
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
}