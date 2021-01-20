/*
 * @Author: your name
 * @Date: 2021-01-18 14:11:53
 * @LastEditTime: 2021-01-20 16:24:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \safety114\src\views\home\components\wifiChart.js
 */
export default class WifiChart {
  constructor(box, data, type, func) {
    this.data = {
      servers: data.data,
      round: 54,
      x: -50,
      y: 50,
      width: 400,
      height: 200,
      radius: 120,    //圆弧半径
      lineWidth: data.lineWidth || 20,  //圆弧线条宽度
      bgBase: data.bgBase || '#c1c1c1', //未填充背景色
      bgFill: data.bgFill || '#49d7ff', //填充背景色
      initColors: ['#FF0000', '#F97C45', '#FFCE00', '#007dee', '007dee'],
      centerColor: '#49d7ff',
      marginTop: data.marginTop || 60,
      marginLeft: '',
    };
    this.canvas = {},
      this.ctxArr = [],
      this.box = box;
    this.initCanvas(type, func);
  }
  /**
   * 初始化图像
   */
  initCanvas() {
    if (this.box) {
      let ctxArr = [];
      let canvasWidth = this.box.offsetWidth;
      let canvasHeight = this.box.offsetHeight;
      this.canvas = document.createElement('canvas');
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.box.appendChild(this.canvas)
      let ctx = this.canvas.getContext('2d');
      ctx.save();
      ctx.beginPath();
      ctx.translate((this.data.marginLeft || canvasWidth / 2), canvasHeight / 2 + this.data.marginTop);
      for (let i = 0; i < this.data.servers.length; i++) {
        let radius = ((canvasHeight / 2) - (this.data.lineWidth * (i + 1) + 1) - (i + 1)) + 30;
        let fillStyle = this.data.servers[i].fillStyle || this.data.initColors[i];
        let x = 0;
        let y = 0;
        ctx.lineWidth = this.data.lineWidth;
        ctx.arc(x, y, radius, 1.20 * Math.PI, 1.80 * Math.PI);
        ctx.strokeStyle = this.data.centerColor;
        ctx.stroke()
        ctx.beginPath();
        ctx.closePath();
        ctx.lineWidth = this.data.lineWidth;
        let endPint = 1.20 + (0.6 * (this.data.servers[i].value / this.data.servers[i].total));
        ctx.arc(x, y, radius, 1.20 * Math.PI, endPint * Math.PI);
        ctx.strokeStyle = fillStyle;
        ctx.stroke()
        ctx.beginPath();

        ctxArr.push({
          radius: radius,
          data: this.data.servers[i]
        })
      }
      // // 绘制图例
      for (let i = 0; i < this.data.servers.length; i++) {
        let radius = ((canvasHeight / 2) - (this.data.lineWidth * (i + 1) + 1) - (i + 1)) + 30;
        let fillStyle = this.data.servers[i].fillStyle || this.data.initColors[i];
        ctx.lineWidth = 1;
        let x = 0 + radius * Math.cos(Math.PI / 180 * (-145));
        let y = 0 + radius * Math.sin(Math.PI / 180 * (-145));
        ctx.arc(x - 10, y + 10, this.data.lineWidth / 4, 0, 2 * Math.PI);
        ctx.strokeStyle = fillStyle;
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.stroke()
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.rect(canvasWidth / 2 - 20, -20 * i + 1, 10, 10);
        ctx.strokeStyle = fillStyle;
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.stroke()
        ctx.beginPath();
        ctx.font = "10px Georgia";
        ctx.fillText(this.data.servers[i].name, canvasWidth / 2 - 70, -20 * i + 10);
      }

      ctx.lineWidth = 1;
      ctx.arc(0, 0, 18, 0, 2 * Math.PI);
      ctx.strokeStyle = this.data.centerColor;
      ctx.fillStyle = this.data.centerColor;
      ctx.fill();
      ctx.stroke()
      ctx.beginPath();
      this.ctxArr = ctxArr;

    }
  }
  /**
   * 图像事件
   * @param {*} type 事件类型 click  hover 
   * @param {*} func 返回数据 on('click', (data) => {})
   */
  on(type, func) {
    this.canvas.addEventListener('click', (e) => {
      const x = e.offsetX
      const y = e.offsetY
      const roundX = (this.canvas.width / 2);
      const roundY = (this.canvas.height / 2) + 40;
      var angle = Math.atan2((roundY - y), (roundX - x)) //弧度
      var theta = angle * (180 / Math.PI); //角度
      let pointJd = Math.abs(180 - 90 - theta);
      let site = Math.sqrt(Math.pow((x - roundX), 2) + Math.pow((y - roundY), 2)).toFixed(0) - 0;
      for (let i = 0; i < this.ctxArr.length; i++) {
        if (site > (this.ctxArr[i].radius - (this.data.lineWidth / 2)) && site < (this.ctxArr[i].radius + (this.data.lineWidth / 2)) && pointJd < 60) {
          if (type === 'click') {
            func(this.ctxArr[i].data)
          }

        }
      }
    })
    this.canvas.addEventListener('mousemove', (e) => {
      this.canvas.style.cursor = 'default'
      let divs = this.box.getElementsByTagName("div");
      if (divs.length > 0) {
        this.box.removeChild(divs[0])
      }
      const x = e.offsetX
      const y = e.offsetY
      const roundX = (this.canvas.width / 2);
      const roundY = (this.canvas.height / 2) + this.data.marginTop;
      let angle = Math.atan2((roundY - y), (roundX - x)) //弧度
      let theta = angle * (180 / Math.PI); //角度
      let pointJd = Math.abs(180 - 90 - theta);
      let site = Math.sqrt(Math.pow((x - roundX), 2) + Math.pow((y - roundY), 2)).toFixed(0) - 0;
      for (let i = 0; i < this.ctxArr.length; i++) {
        if (site > (this.ctxArr[i].radius - (this.data.lineWidth / 2)) && site < (this.ctxArr[i].radius + (this.data.lineWidth / 2)) && pointJd < 60) {
          this.canvas.style.cursor = 'pointer';
          // let tip = `<div class='tip'><div>${this.ctxArr[i].name}</div></div>`;
          let tip = document.createElement('div');
          let ratio = ((this.data.servers[i].value / this.data.servers[i].total) * 100).toFixed(2)
          tip.setAttribute('calss', 'tip');
          tip.style.position = 'absolute';
          tip.style.top = y + 'px';
          tip.style.left = x + 10 + 'px';
          tip.style.background = 'rgba(0, 0, 0, 0.5)';
          tip.style.padding = '10px 15px';
          tip.style.borderRadius = '5px';
          tip.style.fontSize = '10px';
          tip.innerHTML = `<div style="color: #fff">${this.ctxArr[i].data.name}(${this.data.servers[i].total})</div><div style="color: #fff; margin-top: 5px;">${this.ctxArr[i].data.tipName}：${this.ctxArr[i].data.value} (${ratio}%)</div>`
          this.box.appendChild(tip)
        }
      }
    })
  }
}
