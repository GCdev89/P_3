var Canvas = {
  canvas: document.getElementById("canvas"),
  ctx: document.getElementById("canvas").getContext("2d"),
  color: "#000",
  dragging: false,
  drawing: false,
  radius: 2,



  initCanvas() {
    document.getElementById("canvas_container").style.display = "block";
    this.canvas.addEventListener("touchstart", this.engage);
    this.canvas.addEventListener("touchmove", this.putPointTactile);
    this.canvas.addEventListener("touchend", this.disengage);
    this.canvas.addEventListener("mousedown", this.engage);
    this.canvas.addEventListener("mousemove", this.putPoint);
    this.canvas.addEventListener("mouseup", this.disengage);
    this.canvas.addEventListener("mouseleave", this.disengage);
  },
  engage(e){
    Canvas.dragging = true;
    Canvas.putPoint(e);
  },
  disengage() {
    Canvas.dragging = false;
    Canvas.ctx.beginPath();
  },
  putPoint(e) {
    Canvas.ctx.lineWidth = this.radius*2;

    if (Canvas.dragging) {
      Canvas.ctx.lineTo(e.offsetX, e.offsetY);
      Canvas.ctx.stroke();
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(e.offsetX, e.offsetY, Canvas.radius, 0, Math.PI*2);
      Canvas.ctx.fill();
      Canvas.ctx.beginPath();
      Canvas.ctx.moveTo(e.offsetX, e.offsetY);
      Canvas.drawing = true;
    }
  },
  putPointTactile(e) {
    Canvas.ctx.lineWidth = this.radius*2;
    e.preventDefault();

    if (Canvas.dragging) {
      Canvas.ctx.lineTo(e.offsetX, e.offsetY);
      Canvas.ctx.stroke();
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(e.offsetX, e.offsetY, Canvas.radius, 0, Math.PI*2);
      Canvas.ctx.fill();
      Canvas.ctx.beginPath();
      Canvas.ctx.moveTo(e.offsetX, e.offsetY);
      Canvas.drawing = true;
    }
  },
  clearCanvas() {
    Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    Canvas.drawing = false;
  },
  validateCanvas() {
    if (Canvas.drawing) {
      var data = Canvas.canvas.toDataURL();
      window.sessionStorage.setItem("signature", data);
      return Canvas.drawing;
    }
  }

}
document.getElementById("effacer_canvas").addEventListener("click", Canvas.clearCanvas)
