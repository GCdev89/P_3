let Canvas = {

  /**
  *@param {boolean} dragging vérrifie si l'utilisateur effectue une action
  *@param {boolean} drawing vérrifie si l'utilisateur a dessiné
  */
  canvas: document.getElementById("canvas"),
  ctx: document.getElementById("canvas").getContext("2d"),
  dragging: false,
  drawing: false,
  radius: 2,



  initCanvas() {
    document.getElementById("canvas_container").style.display = "block";
    // Gestion du tactile
    this.canvas.addEventListener("touchstart", this.engageTactile);
    this.canvas.addEventListener("touchmove", this.putPointTactile);
    this.canvas.addEventListener("touchend", this.disengage);
    // Gestion de la souris
    this.canvas.addEventListener("mousedown", this.engage);
    this.canvas.addEventListener("mousemove", this.putPoint);
    this.canvas.addEventListener("mouseup", this.disengage);
    this.canvas.addEventListener("mouseleave", this.disengage);
  },
  /*
  * Détecte le début du dessin
  */
  engage(e){
    Canvas.dragging = true;
    Canvas.putPoint(e);
  },
  /*
  * Détecte le début du dessin sur tactile
  */
  engageTactile(e){
    e.preventDefault();
    Canvas.dragging = true;
    Canvas.putPointTactile(e);
  },
  /*
  * Détecte l'arrêt du dessin
  */
  disengage() {
    Canvas.dragging = false;
    Canvas.ctx.beginPath();
  },
  /*
  * Place un point à l'emplacement du pointeur, et relie les points si plusieurs sont disponnibles
  */
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
  /*
  * De même que la version desktop, mais corrige les comportements lié aux smartphones et tablettes
  */
  putPointTactile(e) {
    e.preventDefault(); // Empêche le comportement par défaut
    Canvas.ctx.lineWidth = this.radius*2;
    let rect = Canvas.canvas.getBoundingClientRect(); // Lie Canvas à une zone du viewport
    let touch = e.touches[0]; // Récupère les informations lié aux touches
      // Calcule les coordonnées sur le canvas en corrigeant les écarts
        touchX = (touch.clientX - rect.left) / (rect.right - rect.left) * Canvas.canvas.width;
        touchY = (touch.clientY - rect.top) / (rect.bottom - rect.top) * Canvas.canvas.height;
    if (Canvas.dragging) {
      Canvas.ctx.lineTo(touchX, touchY);
      Canvas.ctx.stroke();
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(touchX, touchY, Canvas.radius, 0, Math.PI*2);
      Canvas.ctx.fill();
      Canvas.ctx.beginPath();
      Canvas.ctx.moveTo(touchX, touchY);
      Canvas.drawing = true;
    }
  },
  /*
  * Réinitialise le canvas
  */
  clearCanvas() {
    Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    Canvas.drawing = false;
  },
  /*
  * Vérifie que le canvas a été signé et le valide
  */
  validateCanvas() {
    if (Canvas.drawing) {
      let data = Canvas.canvas.toDataURL();
      window.sessionStorage.setItem("signature", data);
      return Canvas.drawing;
    }
  }

}
