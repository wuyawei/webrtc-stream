/**
 * Created by wyw on 2019/3/28.
 */
class Palette {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width; // 宽
        this.height = canvas.height; // 高
        this.paint = canvas.getContext('2d');
        this.isClickCanvas = false; // 是否点击canvas内部
        this.imgData = []; // 存储上一次的图像，用于撤回
        this.x = 0; // 鼠标按下时的 x 坐标
        this.y = 0; // 鼠标按下时的 y 坐标
        this.last = [this.x, this.y]; // 鼠标按下及每次移动后的坐标
        this.drawType = 'line'; // 绘制形状
        this.drawColor = '#000'; // 绘制颜色
        this.lineWidth = 10; // 线条宽度
        this.bindCall = function () {}; // 解决 eventlistener 不能bind
        this.init();
    }
    init() {
        this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        document.addEventListener('mouseup', this.onmouseup.bind(this));
        this.paint.fillStyle = '#fff';
        this.paint.fillRect(0, 0, this.width, this.height);
        this.bindCall = this.onmousemove.bind(this);
    }
    mousedown(e) { // 鼠标按下
        this.isClickCanvas = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.last = [this.x, this.y];
        if (this.drawType === 'line') {
            this.paint.beginPath();
            this.paint.arc(this.x, this.y, this.lineWidth / 2, 0, Math.PI*2, false);
            this.paint.closePath();
            this.paint.fillStyle = this.drawColor;
            this.paint.fill();
        }
        this.canvas.addEventListener('mousemove', this.bindCall);
    }
    onmousemove(e) { // 鼠标移动
        let endx = e.offsetX;
        let endy = e.offsetY;
        let width = endx - this.x;
        let height = endy - this.y;
        let now = [endx, endy]; // 当前移动到的位置
        switch (this.drawType) {
            case 'line' :
                this.line(now);
                break;
        }
    }
    onmouseup() { // 鼠标抬起
        if (this.isClickCanvas) {
            this.isClickCanvas = false;
            this.canvas.removeEventListener('mousemove', this.bindCall);
            let imgData = this.paint.getImageData(0, 0, this.width, this.height);
            this.imgData.push(imgData);
        }
    }
    line(now) { // 绘制矩形
        this.paint.beginPath();
        this.paint.lineCap = "round"; // 设定线条与线条间接合处的样式
        this.paint.lineJoin = "round";
        this.paint.lineWidth = this.lineWidth;
        this.paint.strokeStyle = this.drawColor;
        this.paint.moveTo(this.last[0], this.last[1]);
        this.paint.lineTo(now[0], now[1]);
        this.paint.closePath();
        this.paint.stroke(); // 进行绘制
        this.last = now;
    }
    rect() { // 绘制线性

    }
    poly() { // 绘制多边形

    }
    arc() { // 绘制圆形

    }
    eraser() { // 橡皮擦

    }
    cancel() { // 撤回
    }
    go () { // 前进

    }
    draw(type, color) { // 绘制
        this.drawType = type; // 绘制形状
        this.drawColor = color; // 绘制颜色
    }
}
export {
    Palette
}