// position we will use later
var lat = 44.4922377;
var lon = 11.3519345;
// initialize map
map = L.map('mapDiv').setView([lat, lon], 14);
// set map tiles source
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 22,
    maxNativeZoom: 18
}).addTo(map);
// add marker to the map
marker = L.marker([lat, lon]).addTo(map);
// add popup to the marker
marker.bindPopup("<b>Nomisma Spa</b><br />Strada Maggiore, 44<br />Bologna").openPopup();