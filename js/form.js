let Form = {
  /*
  * Elément du DOM
  */
  helpResa: document.getElementById("help_resa"),
  resaComplete: document.getElementById("resa_complete"),
  annulation: document.getElementById("annulation"),
  resaOver: document.getElementById("resa_over"),
  resaStation: document.getElementById("resa_station"),
  resaName: document.getElementById("resa_name"),
  canvasContainer: document.getElementById("canvas_container"),

  regexElt: /^[a-zA-ZéêëïËÊÏ][a-zA-ZéêëïËÊÏ\s\-]+$/, // Permet de vérifier si les champs de  saisie respectent le format attendu

  init() {
    /*
    * Gère la validation du formulaire appelle le canvas signature et clear un éventuel canvas déjà existant
    */
    MapLyon.formElt.addEventListener("submit", function(e){
      if ((Form.regexElt.test(MapLyon.formElt.elements.nom.value)) && (Form.regexElt.test(MapLyon.formElt.elements.prenom.value))) {
        if (Timer.resaOn) {
          Form.helpResa.style.display = "block";
        } else {
          Form.helpResa.style.display = "none";
          Canvas.clearCanvas();
          Canvas.initCanvas();
          window.scrollTo(0,1200);
        }
      } else {
        Form.registerFalse();
      }
      e.preventDefault();
    });
    /*
    * Gère la validation de la réservation si les données du form sont en ordre
    */
    document.getElementById("valider_canvas").addEventListener("click", function(e) {
      if (Canvas.drawing) {
        Form.register();
        Timer.initTimer();
        Timer.resaOn = true;
        window.sessionStorage.setItem("resaOn", Timer.resaOn); // Enregistrement en session de l'état de la réservation
        window.sessionStorage.setItem("veloLyonStationName", Form.resaStation.textContent); // Enregistrement en session de la station réservée

      } else {
        Form.helpResa.style.display = "block";
      }
    });
    /*
    * Gère l'annulation de la validation
    */
    document.getElementById("annuler_validation").addEventListener("click", function (e) {
      Form.helpResa.style.display = "none";
      Form.canvasContainer.style.display = "none";
      Canvas.clearCanvas();
    });
    /*
    * Gère l'effacement du canvas
    */
    document.getElementById("effacer_canvas").addEventListener("click", Canvas.clearCanvas);
    /*
    * Gère l'annulation de la réservation
    */
    Form.annulation.addEventListener("click", function() {
      Timer.cancel();
      Timer.resaOn = false;
      // window.sessionStorage.setItem("resaOn", Timer.resaOn); // Enregistrement en session de l'état de la réservation
    });
    Form.restoreSession();
  },
  /*
  * Gère la réservation
  */
  register() {
    let reservationStation = MapLyon.stationNameElt.textContent,
        reservationNom = MapLyon.formElt.elements.nom.value,
        reservationPrenom = MapLyon.formElt.elements.prenom.value;
    /*
    * Appel des fonctions
    */
    Canvas.validateCanvas();
    /*
    * Manipulation du DOM
    */
    this.resaComplete.style.display = "block";
    this.annulation.style.display = "block";
    this.resaOver.style.display = "none";
    this.resaStation.textContent = reservationStation;
    this.resaName.textContent = `${reservationNom} ${reservationPrenom}`;
    this.helpResa.style.display = "none";
    this.canvasContainer.style.display = "none";
    /*
    * Gestion du storage
    */
    window.localStorage.setItem("veloLyonNomValue", reservationNom); // Enregistrement en local du nom
    window.localStorage.setItem("veloLyonPrenomValue", reservationPrenom); // Enregistrement en local du prénom

  },
  /*
  * Bloque la réservation en cas de saisie erronée
  */
  registerFalse() {
    this.helpResa.style.display = "block";
    this.resaComplete.style.display = "none";
    this.resaOver.style.display = "block";
    this.resaStation.textContent = "";
    this.resaName.textContent = "";
  },
  /*
  * Gère la restauration de sesion
  */
  restoreSession() {
    let getEtatResa = window.sessionStorage.getItem("resaOn"); // Récupère l'état de la réservation dans le sessionStorage
    Timer.resaOn = getEtatResa;
    let getSavedStation = window.sessionStorage.getItem("veloLyonStationName");
    if (Timer.resaOn) { // Relance la réservation si elle est d'actualité
      this.register();
      this.resaStation.textContent = getSavedStation;
      Timer.initTimer();
    }
  }
}

let onReady = function() {
  new Carousel(document.getElementById("carousel_pano"), {
    slidesToScroll: 1,
    slidesVisible: 1,
    loop: true,
    pagination: true
  });
  MapLyon.init();
  Form.init();
}

document.addEventListener("DOMContentLoaded", onReady); // Lance la fonction onReady qui initialise l'appli si la page est chargée
if (document.readyState !== "loading") { // Lance le script si l'état est différent de loading
  onReady();
}
