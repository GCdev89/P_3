var MapLyon = {
  // Element du DOM
  stationAddressElt: document.getElementById("adresse_station"),
  stationNameElt: document.getElementById("nom_station"),
  stationPlacesElt: document.getElementById("places_station"),
  veloDispoElt: document.getElementById("velo_dispo"),
  userNameElt: document.getElementById("nom"),
  userForNameElt: document.getElementById("prenom"),
  latElt: 45.75,
  lngElt: 4.825,
  regexElt: /^[a-zA-Z][a-zA-Z]+$/,

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
      * Gestion des markers
      */
      stations.forEach(function (station) {
        var markers = L.marker([station.position.lat, station.position.lng]).addTo(myMap);
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
        var formElt = document.querySelector("form");
        formElt.addEventListener("submit", function (e) {
          if ((MapLyon.regexElt.test(formElt.elements.nom.value)) && (MapLyon.regexElt.test(formElt.elements.prenom.value))) {
            document.getElementById("resa_recap").style.display = "block";
            document.getElementById("resa_station").textContent = MapLyon.stationNameElt.textContent;
            document.getElementById("resa_name").textContent = formElt.elements.nom.value + " " + formElt.elements.prenom.value;
            document.getElementById("help_resa").style.display = "none";
          } else {
            document.getElementById("help_resa").style.display = "block";
            document.getElementById("resa_recap").style.display = "none";
            document.getElementById("resa_station").textContent = "";
            document.getElementById("resa_name").textContent = "";
          }
          e.preventDefault();
        });
      });
    });
  }
}


let onReady_2 = function () {
  MapLyon.init();
}
if (document.readyState !== "loading") {
  onReady_2();
}

document.addEventListener("DOMContentLoaded", onReady_2);
