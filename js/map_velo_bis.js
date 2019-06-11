var CarteLyon = {

  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({}, {
      latElt: 45.75,
      lngElt: 4.825,
    }, options);
    this.resaOn = false;
    this.map = L.map("map_velo").setView([CarteLyon.latElt, CarteLyon.lngElt], 13.5);
    this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                        // Il est toujours bien de laisser le lien vers la source des données
                        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
                        minZoom: 12,
                        maxZoom: 20
                    }).addTo(myMap);



  }

}

let onReady_2 = function() {
  CarteLyon;
}

if (document.readyState !== "loading") {
  onReady_2();
}

document.addEventListener("DOMContentLoaded", onReady_2);
