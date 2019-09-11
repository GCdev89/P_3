let MapLyon = {
  /*
  * Element du DOM
  */
  stationAddressElt: document.getElementById("adresse_station"),
  stationNameElt: document.getElementById("nom_station"),
  stationPlacesElt: document.getElementById("places_station"),
  veloDispoElt: document.getElementById("velo_dispo"),
  userNameElt: document.getElementById("nom"),
  userForNameElt: document.getElementById("prenom"),
  formElt: document.querySelector("form"),
  selection: document.getElementById("selection"),
  /*
  * Options
  */
  latElt: 45.75,
  lngElt: 4.825,


  init () {
    /*
    *Affichage de la carte et du tile layer
    */
    let myMap = L.map("map_velo").setView([this.latElt, this.lngElt], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 12,
        maxZoom: 20
    }).addTo(myMap);

    /*
    * Appel ajax des données de JC. Decaux
    */
    ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=ec0b0c27fce8658ab74b43deabc9f4155809d60c", function (reponse) {
      // Transforme la réponse en tableau d'objets JS
      let stations = JSON.parse(reponse);
      let toggleForm = document.getElementsByClassName("info_form");
      let clusters = new L.markerClusterGroup();

      /*
      * Gestion des informations liées aux stations
      */
      stations.forEach(function (station) {
        /*
        * Création des icones avec gestion du statut de la station
        */
        let LeafIcon = L.Icon.extend({
          options: {
            iconSize: [30,40],
            iconAnchor: [30,40],
            popupAnchor: [-15,-40]
          }
        });
        let greenIcon = new LeafIcon({iconUrl: "../images/1x/icon_green.png"}),
            orangeIcon = new LeafIcon({iconUrl: "../images/1x/icon_orange.png"}),
            redIcon = new LeafIcon({iconUrl: "../images/1x/icon_red.png"}),
            greyIcon = new LeafIcon({iconUrl: "../images/1x/icon_gray.png"});

        let iconStatus = ""; // Valeur de retour
        /*
        * Gestion des statut, et renvoie la valeur
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
        let markers = L.marker([station.position.lat, station.position.lng], {icon: iconStatus}); // Implante les markers en fonction de leur statut
        markers.bindPopup("<b>" + station.name + "</b><br>" + station.address); // Attache un popup à chaque marker avec le station.name et le station.address
        clusters.addLayer(markers); // Ajout des markers au cluster
        /*
        * Gestion du clique sur les markers
        */
        markers.addEventListener("click", function(marker) { // Remplissage du formulaire si vélo à la station choisie
          if (station.available_bikes > 0) {  // Affiche le formulaire de réservation
            for (i = 0; i < toggleForm.length; i++) {
              toggleForm[i].style.display = "block";
            }
            let getNom = window.localStorage.getItem("veloLyonNomValue");
            let getPrenom = window.localStorage.getItem("veloLyonPrenomValue");
            MapLyon.selection.style.display = "none";
            MapLyon.stationNameElt.textContent = station.name;
            MapLyon.stationAddressElt.textContent = station.address;
            MapLyon.stationPlacesElt.textContent = station.available_bike_stands;
            MapLyon.veloDispoElt.textContent = station.available_bikes;
            MapLyon.formElt.elements.nom.value = getNom;
            MapLyon.formElt.elements.prenom.value = getPrenom;
          } else {  // Affiche la demande de séléction de station
            for (i = 0; i < toggleForm.length; i++) {
              toggleForm[i].style.display = "none";
            }
            MapLyon.selection.style.display = "block";
          }
        });
      myMap.addLayer(clusters); // Affiche les markers dans les clusters
      });
    });
  }
}
