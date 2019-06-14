var Timer = {
  timeElt: 20, // Temps restant en minutes

  initTimer() {
    var timeMs = (this.timeElt * 60 * 1000) + 1000; // Ajout de 1 seconde pour prendre en compte le délai d'activation du timer.
    var now = new Date().getTime();
     // Recherche la date en ms à l'init
    var timeTo = now + timeMs; // Donne la durée en ms que l'on veut atteindre
    var getSavedTimeTo = window.sessionStorage.getItem("savedTimeTo");
    if ( getSavedTimeTo < timeTo && getSavedTimeTo > now) {
      timeTo = getSavedTimeTo;
    }
    window.sessionStorage.setItem("savedTimeTo", timeTo);
    var intervalCountDown = setInterval( function() {
      // Lance l'interval qui calculera le temps restant chaque secondes
      var nowInterval = new Date().getTime(); // Actualise la date en ms chaque seconde
      var distance = timeTo - nowInterval; // Calcule la distance en ms vers le point à atteindre
      var minutes = Math.floor((distance % (1000 *60 *60)) / (1000 *60)); // Convertit le temps en minutes
      var secondes = Math.floor((distance % (1000 * 60)) / 1000); // Convertit le temps en secondes
      document.getElementById("resa_temps").textContent = minutes + " minutes " + secondes + " secondes.";
      if (distance < 0 ) {
        clearInterval(intervalCountDown);
        registerOver();
      }
    }, 1000);

    function registerOver() {
      document.getElementById("resa_complete").style.display = "none";
      document.getElementById("resa_over").style.display = "block";
      document.getElementById("resa_station").textContent = "";
      document.getElementById("resa_name").textContent = "";
      etatResa = false;
      window.sessionStorage.setItem("resaOn", etatResa);

    }
  }
}
