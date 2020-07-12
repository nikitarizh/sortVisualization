// DrawingQueue class

class DrawingQueue extends Array {
    constructor() {
        super();
        this.iterator = 0;
    }

    // get front element of queue
    front() {
        let output = this[this.iterator];
        this.iterator++;
        return output;
    }

    // clears queue
    clear() {
        this.length = 0;
        this.iterator = 0;
    }

    // push 'swap' operation to the drawingQueue
    swapPush(i, j) {
        this.push({
            elements: { i, j },
            op: 'swap'
        });
    }

    // push 'compare' operation to the drawingQueue
    compPush(i, j) {
        this.push({
            elements: { i, j },
            op: 'comp'
        });
    }
}
