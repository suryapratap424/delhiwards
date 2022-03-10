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
var prevLayerClicked = null;
var shpfile = new L.Shapefile("Delhi_Wards-SHP.zip", {
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
    li.innerHTML = `<h3>Name : ${feature.properties.Ward_Name}</h3><p>Number : ${feature.properties.Ward_No}</p>`;
    li.addEventListener('click',()=>layer.fireEvent('click'))
    document.getElementById("list").appendChild(li);
    layer.on({
      click: function (e) {
        console.log(layer);
        if (prevLayerClicked !== null) {
          prevLayerClicked.setStyle({ color: "blue",fillOpacity:0.2});
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
shpfile.addTo(m);
shpfile.once("data:loaded", function () {
  console.log("finished loaded shapefile");
});
