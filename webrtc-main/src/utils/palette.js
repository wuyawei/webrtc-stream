/**
 * Created by wyw on 2019/3/28.
 */
class Palette {
    constructor(canvas, {drawType = 'line', drawColor = 'rgba(19, 206, 102, 1)', lineWidth = 5, allowCallback}) {
        this.canvas = canvas;
        this.width = canvas.width; // 宽
        this.height = canvas.height; // 高
        this.paint = canvas.getContext('2d');
        this.isClickCanvas = false; // 是否点击canvas内部
        this.imgData = []; // 存储上一次的图像，用于撤回
        this.index = 0; // 记录当前显示的是第几帧
        this.x = 0; // 鼠标按下时的 x 坐标
        this.y = 0; // 鼠标按下时的 y 坐标
        this.last = [this.x, this.y]; // 鼠标按下及每次移动后的坐标
        this.drawType = drawType; // 绘制形状
        this.drawColor = drawColor; // 绘制颜色
        this.lineWidth = lineWidth; // 线条宽度
        this.bindCall = function () {}; // 解决 eventlistener 不能bind
        this.allowCallback = allowCallback || function () {}; // 允许操作的回调
        this.init();
    }
    init() {
        this.paint.fillStyle = '#fff';
        this.paint.fillRect(0, 0, this.width, this.height);
        this.gatherImage();
        this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        document.addEventListener('mouseup', this.onmouseup.bind(this));
        this.bindCall = this.onmousemove.bind(this); // 解决 eventlistener 不能bind
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
    gatherImage() { // 采集图像
        this.imgData = this.imgData.slice(0, this.index + 1); // 每次鼠标抬起时，将储存的imgdata截取至index处
        let imgData = this.paint.getImageData(0, 0, this.width, this.height);
        this.imgData.push(imgData);
        this.index = this.imgData.length - 1; // 储存完后将 index 重置为 imgData 最后一位
        this.allowCallback(this.index > 0, this.index < this.imgData.length - 1);
    }
    reSetImage() { // 重置为上一帧
        this.paint.clearRect(0, 0, this.width, this.height);
        if(this.imgData.length >= 1){
            this.paint.putImageData(this.imgData[this.imgData.length-1], 0, 0);
        }
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
            case 'rect' :
                this.rect(width, height);
                break;
            case 'poly' :
                this.poly();
                break;
            case 'arc' :
                this.arc(width, height);
                break;
            case 'eraser' :
                this.eraser();
                break;
            case 'cancel' :
                this.cancel();
                break;
            case 'go' :
                this.go();
                break;
            case 'clear' :
                this.clear();
                break;
        }
    }
    onmouseup() { // 鼠标抬起
        if (this.isClickCanvas) {
            this.isClickCanvas = false;
            this.canvas.removeEventListener('mousemove', this.bindCall);
            this.gatherImage();
        }
    }
    line(now) { // 绘制线性
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
    rect(width, height) { // 绘制矩形
        // this.paint.fillRect(this.x, this.y,  width, height);
        this.reSetImage();
        this.paint.lineWidth = this.lineWidth;
        this.paint.strokeStyle = this.drawColor;
        this.paint.strokeRect(this.x, this.y, width, height);
    }
    poly() { // 绘制多边形

    }
    arc(width, height) { // 绘制圆形
        this.reSetImage();
        this.paint.beginPath();
        this.paint.lineWidth = this.lineWidth;
        let r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.paint.arc(this.x, this.y, r, 0, Math.PI*2, false);
        this.paint.strokeStyle = this.drawColor;
        this.paint.closePath();
        this.paint.stroke();
    }
    eraser() { // 橡皮擦

    }
    cancel() { // 撤回
        if (--this.index <0) {
            this.index = 0;
            return;
        }
        this.allowCallback(this.index > 0, this.index < this.imgData.length - 1);
        this.paint.putImageData(this.imgData[this.index], 0, 0);
    }
    go () { // 前进
        if (++this.index > this.imgData.length -1) {
            this.index = this.imgData.length -1;
            return;
        }
        this.allowCallback(this.index > 0, this.index < this.imgData.length - 1);
        this.paint.putImageData(this.imgData[this.index], 0, 0);
    }
    clear() { // 清屏
        this.imgData = [];
        this.paint.clearRect(0, 0, this.width, this.height);
        this.paint.fillStyle = '#fff';
        this.paint.fillRect(0, 0, this.width, this.height);
        this.gatherImage();
    }
    changeWay(type, color, lineWidth) { // 绘制条件
        this.drawType = type !== 'color' && type; // 绘制形状
        this.drawColor = color; // 绘制颜色
        this.lineWidth = lineWidth; // 线宽
    }
}
export {
    Palette
}