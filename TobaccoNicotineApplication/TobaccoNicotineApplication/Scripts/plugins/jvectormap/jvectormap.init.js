/**
* VectorMap
*/

// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

!function($) {
    "use strict";

    var VectorMap = function() {};

    VectorMap.prototype.init = function () {

        $('#world-map-markers').vectorMap({
            map: 'world_mill_en',
            // cambio colore degli stati che non sono presenti nel database
            series: {
                regions: [{
                    values: {
                        "GL": '#D3D2D0',
                        "TF": '#D3D2D0',
                        "FK": '#D3D2D0',
                        "NC": '#D3D2D0',
                        "EH": '#D3D2D0',
                        "_0": '#D3D2D0', // kosovo
                        "_1": '#D3D2D0', // somaliad
                        "TW": '#D3D2D0'
                    }
                }]
            },
            onRegionClick: function (event, code) {
                var map = $('#world-map-markers').vectorMap('get', 'mapObject');
                var name = map.getRegionName(code);
                getValueNotNull(event, name);
            },
            onMarkerClick: function (event, code) {
                var mapObj = $("#world-map-markers").vectorMap("get", "mapObject");
                var idx = parseInt(code); // optional
                var name = mapObj.markers[idx].config.name;
                //var latitude = mapObj.markers[idx].config.latLng[0];
                //var longitude = mapObj.markers[idx].config.latLng[1];
                getValueNotNull(event, name);
            },
			scaleColors : ['#03a9f4', '#03a9f4'],
            normalizeFunction: 'polynomial',
            hoverOpacity: 0.7,
			hoverColor : false,
			regionStyle : {
				initial : {
					fill : '#5cb45b'
				}
            },
			 markerStyle: {
                initial: {
                    r: 9,
                    'fill': '#03a9f4',
                    'fill-opacity': 0.9,
                    'stroke': '#fff',
                    'stroke-width' : 7,
                    'stroke-opacity': 0.4
                },

                hover: {
                    'stroke': '#fff',
                    'fill-opacity': 1,
                    'stroke-width': 1.5
                }
            },
            backgroundColor: 'transparent',
			markers : [{
				latLng : [-0.52, 166.93],
				name : 'Nauru'
            }, {
                    latLng: [43.73, 7.41],
                    name: 'Monaco'
            }, {
				latLng : [-8.51, 179.21],
				name : 'Tuvalu'
			}, {
				latLng : [43.93, 12.46],
				name : 'San Marino'
			}, {
				latLng : [7.11, 171.06],
				name : 'Marshall Islands'
			}, {
				latLng : [17.3, -62.73],
				name : 'Saint Kitts and Nevis'
			}, {
				latLng : [3.2, 73.22],
				name : 'Maldives'
			}, {
				latLng : [35.88, 14.5],
				name : 'Malta'
			}, {
				latLng : [12.05, -61.75],
				name : 'Grenada'
			}, {
				latLng : [13.16, -61.23],
				name : 'Saint Vincent and the Grenadines'
			}, {
				latLng : [13.16, -59.55],
				name : 'Barbados'
			}, {
				latLng : [17.11, -61.85],
				name : 'Antigua and Barbuda'
			}, {
				latLng : [-4.61, 55.45],
				name : 'Seychelles'
			}, {
				latLng : [7.35, 134.46],
				name : 'Palau'
			}, {
				latLng : [42.5, 1.51],
				name : 'Andorra'
			}, {
				latLng : [14.01, -60.98],
				name : 'Saint Lucia'
			}, {
				latLng : [6.91, 158.18],
                name: 'Micronesia (Federated States of)'
			}, {
				latLng : [1.3, 103.8],
				name : 'Singapore'
			}, {
				latLng : [1.46, 173.03],
				name : 'Kiribati'
			}, {
				latLng : [-21.13, -175.2],
				name : 'Tonga'
			}, {
				latLng : [-19.13, -170.2],
				name : 'Niue'
			}, {
				latLng : [-14.13, -173.2],
				name : 'Samoa'
			}, {
				latLng : [-21.13, -165.2],
				name : 'Cook Islands'
			}, {
				latLng : [15.3, -61.38],
				name : 'Dominica'
			}, {
				latLng : [-20.2, 57.5],
				name : 'Mauritius'
			}, {
				latLng : [26.02, 50.55],
				name : 'Bahrain'
			}, {
				latLng : [17.33, -24.73],
				name : 'Cabo Verde'
			}, {
				latLng : [-12.2, 44.5],
                name: 'Comoros'
			}, {
				latLng : [0.33, 6.73],
				name : 'Sao Tome and Principe'
			}]
        });

  },
    //init
    $.VectorMap = new VectorMap, $.VectorMap.Constructor = VectorMap
}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.VectorMap.init()
}(window.jQuery);

function getValueNotNull(event, name) {
    // controllo se il paese è nel database
    var isPresent = CountryIsPresent(name);
    if (isPresent == false) {
        swal("Attention!", "This country isn't present in the database!", "warning");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/Home/GetInformation",
        data: { countryName: name },
        headers: { "__RequestVerificationToken": token },
        success: function (result) {
            if (result.status == true) {
                var obj = JSON.parse(result.data);

                document.getElementById("blockValuesNotNull").removeAttribute("style");

                var text = document.getElementById("textValuesNotNull");
                text.innerText = "Values Not Null - " + name;

                var div = document.getElementById("insertValuesNotNull");
                // cancello per prima cosa i figli
                div.innerHTML = '';

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var value = obj[key];

                        var perc = Math.round((value / result.total) * 100);

                        // creo nodo
                        var nodeP = document.createElement("p");
                        // aggiungo classi
                        nodeP.setAttribute("class", "font-600 m-b-5");
                        // aggiungo testo
                        var textnode = document.createTextNode(key);
                        nodeP.appendChild(textnode);

                        var nodeSpan = document.createElement("span");
                        // aggiungo classi
                        nodeSpan.setAttribute("class", "text-primary pull-right");

                        var nodeB = document.createElement("b");
                        // aggiungo testo
                        var textnode2 = document.createTextNode(perc + "%");
                        nodeB.appendChild(textnode2);
                        // aggiungo figlio al padre (b -> span)
                        nodeSpan.appendChild(nodeB);

                        // aggiungo figlio al padre (span -> p)
                        nodeP.appendChild(nodeSpan);

                        // aggiungo figlio al padre (p -> div)
                        div.appendChild(nodeP);

                        var nodeDiv = document.createElement("div");
                        // aggiungo classi
                        nodeDiv.setAttribute("class", "progress  m-b-20");

                        var nodeDiv2 = document.createElement("div");
                        // aggiungo classi
                        nodeDiv2.setAttribute("class", "progress-bar progress-bar-primary");
                        nodeDiv2.setAttribute("role", "progressbar");
                        nodeDiv2.setAttribute("aria-valuenow", perc);
                        nodeDiv2.setAttribute("aria-valuemin", 0);
                        nodeDiv2.setAttribute("aria-valuemax", 100);
                        nodeDiv2.setAttribute("style", "width: " + perc + "%;");
                        // aggiungo figlio al padre
                        nodeDiv.appendChild(nodeDiv2);

                        // aggiungo figlio al padre
                        div.appendChild(nodeDiv);

                    }
                } //for key (year=2010, 2011...)
            } // if status ok
            else {

            }
        }
    })
}

function CountryIsPresent(name) {
    if (name == 'Greenland')
        return false;
    else if (name == 'Taiwan')
        return false;
    else if (name == 'New Caledonia')
        return false;
    else if (name == 'Fr. S. Antarctic Lands')
        return false;
    else if (name == 'Falkland Is.')
        return false;
    else if (name == 'Kosovo')
        return false;
    else if (name == 'W. Sahara')
        return false;
    else if (name == 'Somaliland')
        return false;

    return true;
}