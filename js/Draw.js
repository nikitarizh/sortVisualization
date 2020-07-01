class Draw {
    context;

    constructor(canvId) {
        let canv = document.getElementById(canvId);
        this.context = canv.getContext('2d');
        this.context.canvas.width = document.body.offsetWidth;
        this.context.canvas.height = 500;
    }

    drawRectangle(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
}