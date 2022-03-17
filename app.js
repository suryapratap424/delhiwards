var m = L.map("map").setView([28.5915128, 77.2192949], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  minZoom: 5,
  noWrap: true,
}).addTo(m);
var southWest = L.latLng(-90, -180),
  northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);

m.setMaxBounds(bounds);
//-------------------------------------------------------------------------------------------

var prevLayerClicked = null;
function createLayer(theme) {
  let shpfile = new L.Shapefile(`${theme}.zip`, {
    onEachFeature: function (feature, layer) {
      layer.setStyle({ color: "blue" });
      if (feature.properties) {
        layer.bindPopup(
          Object.keys(feature.properties)
            .map(function (k) {
              return k + ": " + feature.properties[k];
            })
            .join("<br />"),
          {
            maxHeight: 200,
          }
        );
      }
      let li = document.createElement("li");
      li.classList.add("listitem");
      li.innerHTML = createList(theme,feature);
      li.addEventListener("click", () => layer.fireEvent("click"));
      document.getElementById("list").appendChild(li);
      layer.on({
        click: function (e) {
          if (prevLayerClicked !== null) {
            prevLayerClicked.setStyle({ color: "blue", fillOpacity: 0.2 });
          }
          m.flyToBounds(e.target.getBounds());
          var layer = e.target;
          layer.setStyle({
            color: "yellow",
            fillOpacity: 0.4,
          });
          prevLayerClicked = layer;
        },
      });
    },
  });
  return shpfile;
}
let tg = document.getElementById("toggle");
let prevLayer = null;
tg.addEventListener("click", () => {
  document.getElementById("load").style.display = "block";
  let theme = document.querySelector('input[name="type"]:checked').id;
  console.log(theme);
  if (prevLayer !== null) m.removeLayer(prevLayer);
  document.getElementById("list").innerHTML = "";
  let shpfile = createLayer(theme);
  prevLayer = shpfile;
  shpfile.addTo(m);
  shpfile.once("data:loaded", function () {
    document.getElementById("load").style.display = "none";
    console.log("finished loaded shapefile");
  });
});
tg.click();
function createList(theme,feature){
  if(theme == 'ward'){
    return `<h3>Name : ${feature.properties.Ward_Name}</h3><p>Number : ${feature.properties.Ward_No}</p>`
  }
  if(theme == 'dist'){
    return `<h3>Name : ${feature.properties.DISTRICT}</h3><p>district code :${feature.properties.DT_CEN_CD}</p>`
  }
  if(theme == 'states'){
    return `<h3>Name : ${feature.properties.ST_NM}</h3>`
  }
}