// Draw class

class Draw {
    // context;


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
}