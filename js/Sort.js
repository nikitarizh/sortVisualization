class Sort {

    d;
    drawingQueue = null;

    sort(algorithm, arr, setTimer = false, log = null) {

        this.d = new Draw('canv');
        this.drawingQueue = [];
        let drawingIterator = 0;
        
        // array verification
        if (arr === undefined || arr === null || arr.length === 0) {
            throw new Error('Incorrect array');
        }

        if (log.io) {
            console.log('input array:');
            console.log(arr);
        }

        let t0;
        let drawingArray = arr.slice(0);
        let cellWidth;
        let th = this;
            
        let draw = setInterval(function(th) {
            th.d.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');
            for (let i = 0; i < drawingArray.length; i++) {
                cellWidth = document.body.offsetWidth / drawingArray.length;
                let x = i * cellWidth;
                let y = 500;
                th.d.drawRectangle(x, y, cellWidth, -drawingArray[i], '#00ff8c');
            }
            if (th.drawingQueue.length > drawingIterator) {
                th.swap(drawingArray, th.drawingQueue[drawingIterator].i, th.drawingQueue[drawingIterator].j);
                drawingIterator++;
            }
                
        }, 1, th);
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
            default:
                throw new Error('Incorrect alrgorithm');
        }

        if (log.io) {
            console.log('output array:');
            console.log(arr);
        }

        if (setTimer) {
            let execTime = performance.now() - t0;

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

            
            return execTime;
        }
    }

    bubbleSort(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[i]) {
                    this.swap(arr, i, j);
                    this.drawingQueue.push( {i, j} );
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
                    this.drawingQueue.push( { i, j: i + 1 } );
                }
            }
            right--;

            for (let i = right; i > left; i--) {
                if (arr[i - 1] > arr[i]) {
                    this.swap(arr, i, i - 1);
                    this.drawingQueue.push( { i, j: i - 1 } );
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
                    this.drawingQueue.push( { i, j: i + step } );
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
                    this.drawingQueue.push( { i, j: i + 1 } );
                    swapped = true;
                }
            }
        }
    }

    insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            for (let j = i; j > 0 && arr[j - 1] > arr[j]; j--) {
                this.swap(arr, j, j - 1);
                this.drawingQueue.push( { i: j, j: j - 1 } );
            }
        }
    }

    shellSort(arr) {
        let step = Math.floor(arr.length / 2);
        while (step > 0) {
            for (let i = step; i < arr.length; i++) {
                for (let j = i - step; j >= 0 && arr[j + step] < arr[j]; j -= step) {
                    this.swap(arr, j, j + step);
                    this.drawingQueue.push( { i: j, j: j + step } );
                }
            }

            step = Math.floor(step / 2);
        }
    }

    swap(arr, i, j) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}