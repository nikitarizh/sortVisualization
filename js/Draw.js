// Draw class

class Draw {

    // setting up
    constructor(canvId) {
        let canv = document.getElementById(canvId);
        this.context = canv.getContext('2d');
        this.context.canvas.width = document.body.offsetWidth;
        this.context.canvas.height = 500;
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

    // normalize arr[i] in range [70; 220] (to get color based on value of array element)
    static getColor(arr, x) {
        let minMax = arr.minMax();

        let mn = minMax.mn;
        let mx = minMax.mx;
        
        let range = mx - mn;

        return (x - mn) / range * 150 + 70;
    }
}