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
    var myMap = L.map("map_velo").setView([this.latElt, this.lngElt], 13.5);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                        // Il est toujours bien de laisser le lien vers la source des données
                        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
                        minZoom: 12,
                        maxZoom: 20
                    }).addTo(myMap);
    // Appel ajax des données de JC. Decaux
    ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=ec0b0c27fce8658ab74b43deabc9f4155809d60c", function (reponse) {
      // Transforme la réponse en tableau d'objets JS
      var stations = JSON.parse(reponse);
      var toggleForm = document.getElementsByClassName("info_form");


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

        var markers = L.marker([station.position.lat, station.position.lng], {icon: iconStatus}).addTo(myMap); // Implante les markers en fonction de leur statut
        markers.bindPopup("<b>" + station.name + "</b><br>" + station.address); // Attache un popup à chaque marker avec le station.name et le station.address
        markers.addEventListener("click", function(marker) { // Remplissage du formulaire si vélo à la station choisie
          if (station.available_bikes > 0) {  // Affiche le formulaire de réservation
            for (i = 0; i < toggleForm.length; i++) {
              toggleForm[i].style.display = "block";
            }
            document.getElementById("selection").style.display = "none";
            MapLyon.stationNameElt.textContent = station.name;
            MapLyon.stationAddressElt.textContent = station.address;
            MapLyon.stationPlacesElt.textContent = station.available_bike_stands;
            MapLyon.veloDispoElt.textContent = station.available_bikes;
          } else {  // Affiche la demande de séléction de station
            for (i = 0; i < toggleForm.length; i++) {
              toggleForm[i].style.display = "none";
            }
            document.getElementById("selection").style.display = "block";
          }
        });
        MapLyon.formElt.addEventListener("submit", function (e) {
          if ((MapLyon.regexElt.test(MapLyon.formElt.elements.nom.value)) && (MapLyon.regexElt.test(MapLyon.formElt.elements.prenom.value))) {
            MapLyon.register();
            Timer.initTimer();
          } else {
            MapLyon.registerFalse();
          }
          e.preventDefault();
        });
      });
    });
  },

  /*
  *Fonctions affichant et masquant les zones de réservation
  */
  register() {
    document.getElementById("resa_complete").style.display = "block";
    document.getElementById("resa_over").style.display = "none";
    document.getElementById("resa_station").textContent = MapLyon.stationNameElt.textContent;
    document.getElementById("resa_name").textContent = MapLyon.formElt.elements.nom.value + " " + MapLyon.formElt.elements.prenom.value;
    document.getElementById("help_resa").style.display = "none";
  },
  registerFalse() {
    document.getElementById("help_resa").style.display = "block";
    document.getElementById("resa_complete").style.display = "none";
    document.getElementById("resa_over").style.display = "block";
    document.getElementById("resa_station").textContent = "";
    document.getElementById("resa_name").textContent = "";
  },
}


let onReady_2 = function () {
  MapLyon.init();
}
if (document.readyState !== "loading") {
  onReady_2();
}

document.addEventListener("DOMContentLoaded", onReady_2);
