let Timer = {
  /**
  *@param {number} timeElt Défini le temps restant en minutes
  *@param {boolean} resaOn Vérifie l'état de la réservation, par défaut false
  */
  timeElt: 20,
  intervalCountDown: "",
  resaOn: false,


  initTimer() {
    let timeMs = (this.timeElt * 60 * 1000) + 1000; // Ajout de 1 seconde pour prendre en compte le délai d'activation du timer.
    let now = new Date().getTime(); // Recherche la date en ms à l'init
    let timeTo = now + timeMs; // Donne la durée en ms que l'on veut atteindre
    let getSavedTimeTo = window.sessionStorage.getItem("savedTimeTo");
    if ( getSavedTimeTo < timeTo && getSavedTimeTo > now) {
      timeTo = getSavedTimeTo;
    }
    window.sessionStorage.setItem("savedTimeTo", timeTo); // Enregistre dans le sessionStorage le timeTo
    /*
    * Interval qui recalcule le temps restant chaque seconde
    */
    this.intervalCountDown = setInterval( function() {
      let nowInterval = new Date().getTime(); // Actualise la date en ms chaque seconde
      let distance = timeTo - nowInterval; // Calcule la distance en ms vers le point à atteindre
      let minutes = Math.floor((distance % (1000 *60 *60)) / (1000 *60)); // Calcule les minutes
      let secondes = Math.floor((distance % (1000 * 60)) / 1000); // Calcule les secondes
      document.getElementById("resa_temps").textContent = `${minutes} minutes ${secondes} secondes.`;
      if (distance < 0 ) { // Arrête linterval quand le temps est écoulé
        clearInterval(this.intervalCountDown);
        registerOver();
      }
    }, 1000);

    function registerOver() {
      Form.resaComplete.style.display = "none";
      Form.resaOver.style.display = "block";
      Form.resaStation.textContent = "";
      Form.resaName.textContent = "";
      document.getElementById("resa_temps").textContent = "";
      document.getElementById("annulation").style.display = "none";
      Timer.resaOn = false;
      clearInterval(Timer.intervalCountDown);
      window.sessionStorage.clear();
    }


  },
  cancel() {
    document.getElementById("resa_complete").style.display = "none";
    document.getElementById("annulation").style.display = "none";
    document.getElementById("resa_over").style.display = "block";
    document.getElementById("resa_station").textContent = "";
    document.getElementById("resa_name").textContent = "";
    document.getElementById("resa_temps").textContent = "";
    window.sessionStorage.clear();
    clearInterval(Timer.intervalCountDown);
    Canvas.clearCanvas();
  },


}
