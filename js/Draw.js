// Draw class

class Draw {

    // setting up
    constructor(canvId, dq) {

        // set canvas
        let canv = document.getElementById(canvId);

        // set context
        this.context = canv.getContext('2d');

        // set canvas width and height
        this.context.canvas.width = document.body.offsetWidth;
        this.context.canvas.height = 500;

        // set drawing queue ref
        this.drawingQueue = dq;

        // will be used later for clearing interval
        this.drawingInterval = null;

        // stats
        this.comparisons = 0;
        this.swaps = 0;

        // audio output
        this.audio = null;
        this.oscillator = null;
    }

    // draw a rectangle with upper left corner in A(x, y), with width {width}, height {height} and background color {color}
    drawRectangle(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    // draw a circle with the center in A(x, y), radius {r} and filled with color {color}
    drawCircle(x, y, r, color) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
    }

    draw(arr, params) {

        // setting up audio
        if (params.audioEnabled) {
            this.audio = new Audio();
            this.oscillator = this.audio.createOscillator();
        }

        // stats DOM elements
        let comparisonsStats = document.querySelector('.stats #comparisons');
        let swapsStats = document.querySelector('.stats #swaps');

        // copying initial array to drawingArray
        // drawingArray will be modified using the drawingQueue
        let drawingArray = [];
        for (let i = 0; i < arr.length; i++) {
            drawingArray.push( { val: arr[i], swapped: false, compared: false });
        }

        // width of one array element (column, square, etc.)
        let cellWidth;
        
        // variable for clearing interval
        let sorted = false;

        // drawing
        this.drawingInterval = setInterval(function(th) {
            
            // drawing background
            th.drawRectangle(0, 0, document.body.offsetWidth, 500, '#000');

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
                    th.drawRectangle(x, y, cellWidth, -drawingArray[i].val + cellWidth / 2, '#ff5500');
                }
                // if this element was compared...
                else if (drawingArray[i].compared) {

                    // ...playing audio,
                    if (params.audioEnabled) {
                        th.oscillator.frequency.value = Audio.getHighFreq(arr, drawingArray[i].val);
                    }

                    //highlighting element
                    th.drawRectangle(x, y, cellWidth, -drawingArray[i].val + cellWidth / 2, '#fffb00');
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
                        th.drawRectangle(x, y - drawingArray[i].val, cellWidth, cellWidth, col);
                    }

                    // if no, we draw a column
                    else {
                        th.drawRectangle(x, y, cellWidth, -drawingArray[i].val, col);
                    }
                }
                //  drawing squares
                else if (params.shape === 'squares') {
                    th.drawRectangle(x, y - drawingArray[i].val, cellWidth, cellWidth, col);
                }
                //  drawing circles
                else if (params.shape === 'circles') {
                    th.drawCircle(x + cellWidth / 2, y - drawingArray[i].val + cellWidth / 2, cellWidth / 2, col);
                }

                // setting 'compared' and 'swapped' attributes to default values
                drawingArray[i].compared = false;
                drawingArray[i].swapped = false;
            }
            // if there are unprocessed changes
            if (th.drawingQueue.length > th.drawingQueue.iterator) {

                // elements that have been swapped, compared, etc.
                let front = th.drawingQueue.front();
                let i = front.elements.i;
                let j = front.elements.j;

                // if they were swapped...
                if (front.op === 'swap') {
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
                else if (front.op === 'comp') {
                    // ...they will be highlighted on next iteration
                    drawingArray[i].compared = true;
                    drawingArray[j].compared = true;

                    //changing stats
                    th.comparisons++;
                }
                // when the array is sorted we set the sorted attribute to true
                else if (front.op === 'sorted') {
                    th.comparisons++;
                    drawingArray[i].sorted = true;
                }
            }
            // if the array is sorted and we drew it (made everything blue)...
            else if (sorted) {

                // ...we clear draw loop...
                clearInterval(th.drawingInterval);

                // ...and stop audio
                if (params.audioEnabled) {
                    th.oscillator.stop(th.audio.context.currentTime + 0.1);
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

        }, params.delay, this);
    }

    // normalize arr[i] in range [70; 220] (to get color based on value of array element)
    static getColor(arr, x) {
        let minMax = arr.minMax();

        let mn = minMax.mn;
        let mx = minMax.mx;
        
        let range = mx - mn;

        return (x - mn) / range * 150 + 70;
    }
}