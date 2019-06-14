var MapLyon = {
  // Element du DOM
  stationAddressElt: document.getElementById("adresse_station"),
  stationNameElt: document.getElementById("nom_station"),
  stationPlacesElt: document.getElementById("places_station"),
  veloDispoElt: document.getElementById("velo_dispo"),
  userNameElt: document.getElementById("nom"),
  userForNameElt: document.getElementById("prenom"),
  formElt: document.querySelector("form"),
  latElt: 45.75,
  lngElt: 4.825,
  regexElt: /^[a-zA-ZéêëïËÊÏ][a-zA-ZéêëïËÊÏ\-]+$/,


  init () {
    /*
    *Affichage de la carte et du tile layer
    */
    var myMap = L.map("map_velo").setView([this.latElt, this.lngElt], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 12,
        maxZoom: 20
    }).addTo(myMap);

    var reservationNom;
    var reservationPrenom;
    // Appel ajax des données de JC. Decaux
    ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=ec0b0c27fce8658ab74b43deabc9f4155809d60c", function (reponse) {
      // Transforme la réponse en tableau d'objets JS
      var stations = JSON.parse(reponse);
      var toggleForm = document.getElementsByClassName("info_form");
      var clusters = new L.markerClusterGroup();

      /*
      * Gestion des informations liées aux stations
      */
      stations.forEach(function (station) {
        /*
        * Création des icones avec gestion du statut de la station
        */
        var LeafIcon = L.Icon.extend({
          options: {
            iconSize: [30,40],
            iconAnchor: [30,40],
            popupAnchor: [-15,-40]
          }
        });
        var greenIcon = new LeafIcon({iconUrl: "../images/1x/icon_green.png"}),
            orangeIcon = new LeafIcon({iconUrl: "../images/1x/icon_orange.png"}),
            redIcon = new LeafIcon({iconUrl: "../images/1x/icon_red.png"}),
            greyIcon = new LeafIcon({iconUrl: "../images/1x/icon_gray.png"});

        var iconStatus = ""; // Valeur de retour
        /*
        * Gestion des statut, et renvoie la valeur retour
        */
        if (station.status === "OPEN") {
          if (station.available_bikes === 0) {
            iconStatus = redIcon;
          } else if (station.available_bikes <= 3) {
            iconStatus = orangeIcon;
          } else if (station.available_bikes > 3) {
            iconStatus = greenIcon;
          }
        } else {
          iconStatus = greyIcon
        }
        var markers = L.marker([station.position.lat, station.position.lng], {icon: iconStatus}); // Implante les markers en fonction de leur statut
        markers.bindPopup("<b>" + station.name + "</b><br>" + station.address); // Attache un popup à chaque marker avec le station.name et le station.address
        clusters.addLayer(markers); // Ajout des markers au cluster

        markers.addEventListener("click", function(marker) { // Remplissage du formulaire si vélo à la station choisie
          if (station.available_bikes > 0) {  // Affiche le formulaire de réservation
            for (i = 0; i < toggleForm.length; i++) {
              toggleForm[i].style.display = "block";
            }
            var getNom = window.localStorage.getItem("veloLyonNomValue");
            var getPrenom = window.localStorage.getItem("veloLyonPrenomValue");
            document.getElementById("selection").style.display = "none";
            MapLyon.stationNameElt.textContent = station.name;
            window.sessionStorage.setItem("veloLyonStationName", station.name); // Enregistrement en session de la station réservée
            MapLyon.stationAddressElt.textContent = station.address;
            MapLyon.stationPlacesElt.textContent = station.available_bike_stands;
            MapLyon.veloDispoElt.textContent = station.available_bikes;
            MapLyon.formElt.elements.nom.value = getNom;
            MapLyon.formElt.elements.prenom.value = getPrenom;
          } else {  // Affiche la demande de séléction de station
            for (i = 0; i < toggleForm.length; i++) {
              toggleForm[i].style.display = "none";
            }
            document.getElementById("selection").style.display = "block";
          }
        });
        myMap.addLayer(clusters); // Affiche les markers dans les cluster
      });
      MapLyon.formElt.addEventListener("submit", function (e) {
        if ((MapLyon.regexElt.test(MapLyon.formElt.elements.nom.value)) && (MapLyon.regexElt.test(MapLyon.formElt.elements.prenom.value))) {
          register();
          Timer.initTimer();
        } else {
          registerFalse();
        }
        e.preventDefault();
      });
      restoreSession();
    });

    document.getElementById("annulation").addEventListener("click", cancel)

    function register() {
      reservationStation = MapLyon.stationNameElt.textContent;
      reservationNom = MapLyon.formElt.elements.nom.value;
      reservationPrenom = MapLyon.formElt.elements.prenom.value;
      /*
      * Mise en forme de la page
      */
      document.getElementById("resa_complete").style.display = "block";
      document.getElementById("annulation").style.display = "block";
      document.getElementById("resa_over").style.display = "none";
      document.getElementById("resa_station").textContent = reservationStation;
      document.getElementById("resa_name").textContent = reservationNom + " " + reservationPrenom;
      document.getElementById("help_resa").style.display = "none";
      /*
      * Gestion du stockage
      */
      window.sessionStorage.setItem("resaOn", true); // Enregistrement en session de la station réservée
      window.localStorage.setItem("veloLyonNomValue", reservationNom); // Enregistrement en local du nom
      window.localStorage.setItem("veloLyonPrenomValue", reservationPrenom); // Enregistrement en local du prénom
    }
    function registerFalse() {
      document.getElementById("help_resa").style.display = "block";
      document.getElementById("resa_complete").style.display = "none";
      document.getElementById("resa_over").style.display = "block";
      document.getElementById("resa_station").textContent = "";
      document.getElementById("resa_name").textContent = "";
    }
    function cancel() {
      document.getElementById("resa_complete").style.display = "none";
      document.getElementById("annulation").style.display = "none";
      document.getElementById("resa_over").style.display = "block";
      document.getElementById("resa_station").textContent = "";
      document.getElementById("resa_name").textContent = "";
      window.sessionStorage.clear();
    }
    function restoreSession() {
      var getEtatResa = window.sessionStorage.getItem("resaOn");
      var getSavedStation = window.sessionStorage.getItem("veloLyonStationName");
      if (getEtatResa === "true") {
        register();
        document.getElementById("resa_station").textContent = getSavedStation;
        Timer.initTimer();
      }
    }
  }
}


let onReady_2 = function () {
  MapLyon.init();

}
if (document.readyState !== "loading") {
  onReady_2();
}

document.addEventListener("DOMContentLoaded", onReady_2);
