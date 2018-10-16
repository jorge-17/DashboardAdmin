/** Variables Globales */
var g;
var map = null;
var mapVR = null;
var polyLine;
var tmpPolyLine;
var flightPath;
var markers = [];
var vmarkers = [];
var nomRuta;
var ciudadRuta;
var modalidadRuta;
var trazo = '';

var imageNormal;
var imageHover;


var totRegMR = 0;
function cargaInfo() {
    $.getJSON({
        type: "POST",
        url: rootURL + ciudadesRutas,
        data: JSON.stringify({
            token: tokenSession
        }),
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegCR = datos['iRegistros'];
            for (var i = 0; i < totRegCR; i++) {
                var item = datos['aoData'][i];
                var idCiudad = item['IdCiudad'];
                var nombreCiudad = item['Nombre'];
                $('#lstCiudades').append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
            }
        },
        error: function () {
            console.log("ERROR en carga");
        }
    });

    $.getJSON({
        type: "POST",
        url: rootURL + mapRutas,
        data: JSON.stringify({
            token: tokenSession
        }),
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegMR = datos['iRegistros'];
            for (var i = 0; i < totRegMR; i++) {
                var item = datos['aoData'][i];
                var idRuta = item['IdRuta'];
                var nombreRuta = item['Nombre'];
                $('#lstRutas').append('<option value="' + idRuta + '">' + nombreRuta + '</option>');
                $('#lstRutas2').append('<option value="' + idRuta + '">' + nombreRuta + '</option>');
            }
        },
        error: function () {
            console.log("ERROR en carga");
        }
    });

    $.getJSON({
        type: "POST",
        url: rootURL + consultarModalidades,
        data: JSON.stringify({
            token: tokenSession
        }),
        contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegMR = datos['iRegistros'];
            for (var i = 0; i < totRegMR; i++) {
                var item = datos['aoData'][i];
                var idModalidad = item['IdModalidad'];
                var nombreModalidad = item['Nombre'];
                $('#modalidad').append('<option value="' + idModalidad + '">' + nombreModalidad + '</option>');                
            }
        },
        error: function () {
            console.log("ERROR en carga");
        }
    });    
}
var initMapCR = function (mapHolder) {
    g = google.maps;
    imageNormal = new g.MarkerImage("../img/square_transparent.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
    imageHover = new g.MarkerImage("../img/square_transparent_over.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
    markers = [];
    vmarkers = [];
    var mapOptions = {
        zoom: 14,
        center: new g.LatLng(21.256712, -98.786337),
        mapTypeId: g.MapTypeId.HYBRID,
        draggableCursor: 'auto',
        draggingCursor: 'move',
        disableDoubleClickZoom: true
    };
    map = new g.Map(document.getElementById(mapHolder), mapOptions);
    g.event.addListener(map, "click", mapLeftClick);
    mapHolder = null;
    mapOptions = null;
};

var initMapVR = function (mapHolder) {
    g = google.maps;
    imageNormal = new g.MarkerImage("../img/square_transparent.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
    imageHover = new g.MarkerImage("../img/square_transparent_over.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
    markers = [];
    vmarkers = [];
    var mapOptions = {
        zoom: 14,
        center: new g.LatLng(21.256712, -98.786337),
        mapTypeId: g.MapTypeId.HYBRID,
        draggableCursor: 'auto',
        draggingCursor: 'move',
        disableDoubleClickZoom: true
    };
    mapVR = new g.Map(document.getElementById(mapHolder), mapOptions);
    g.event.addListener(map, "click", mapLeftClick);
    mapHolder = null;
    mapOptions = null;
};

function addItemList(lat, lng) {
    var lista = document.getElementById("itemsLst");
    var string = lat.toFixed(5) + ", " + lng.toFixed(5);
    //console.log(string);
    var item = document.createElement("li");
    item.appendChild(document.createTextNode(string));
    lista.appendChild(item);
}
var initPolyline = function () {
    var polyOptions = {
        strokeColor: "#3355FF",
        strokeOpacity: 0.8,
        strokeWeight: 4
    };
    var tmpPolyOptions = {
        strokeColor: "#3355FF",
        strokeOpacity: 0.4,
        strokeWeight: 4
    };
    polyLine = new g.Polyline(polyOptions);
    polyLine.setMap(map);
    tmpPolyLine = new g.Polyline(tmpPolyOptions);
    tmpPolyLine.setMap(map);
};
var mapLeftClick = function (event) {
    if (event.latLng) {
        var marker = createMarker(event.latLng);
        //console.log(marker);
        markers.push(marker);
        if (markers.length != 1) {
            var vmarker = createVMarker(event.latLng);
            //console.log(vmarker);
            vmarkers.push(vmarker);
            vmarker = null;
        }
        var path = polyLine.getPath();
        path.push(event.latLng);
        marker = null;
    }
    event = null;
};
var createMarker = function (point) {
    var marker = new g.Marker({
        position: point,
        map: map,
        icon: imageNormal,
        draggable: true
    });    
    //addItemList(marker.getPosition().lat(), marker.getPosition().lng());
    g.event.addListener(marker, "mouseover", function () {
        marker.setIcon(imageNormal);
    });
    g.event.addListener(marker, "mouseout", function () {
        marker.setIcon(imageNormal);
    });
    g.event.addListener(marker, "drag", function () {
        for (var m = 0; m < markers.length; m++) {
            if (markers[m] == marker) {
                polyLine.getPath().setAt(m, marker.getPosition());
                moveVMarker(m);
                break;
            }
        }
        m = null;
    });
    g.event.addListener(marker, "click", function () {
        for (var m = 0; m < markers.length; m++) {
            if (markers[m] == marker) {
                marker.setMap(null);
                markers.splice(m, 1);
                polyLine.getPath().removeAt(m);
                removeVMarkers(m);
                break;
            }
        }
        m = null;
    });
    return marker;
};
var createVMarker = function (point) {
    var prevpoint = markers[markers.length - 2].getPosition();
    //console.log(prevpoint.latLng);
    var marker = new g.Marker({
        position: new g.LatLng(point.lat() - (0.5 * (point.lat() - prevpoint.lat())), point.lng() - (0.5 * (point.lng() - prevpoint.lng()))),
        map: map,
        icon: imageNormal,
        draggable: true
    });
    g.event.addListener(marker, "mouseover", function () {
        //marker.setIcon(imageHover);
    });
    g.event.addListener(marker, "mouseout", function () {
        marker.setIcon(imageNormal);
    });
    g.event.addListener(marker, "dragstart", function () {
        for (var m = 0; m < vmarkers.length; m++) {
            if (vmarkers[m] == marker) {
                var tmpPath = tmpPolyLine.getPath();
                tmpPath.push(markers[m].getPosition());
                tmpPath.push(vmarkers[m].getPosition());
                tmpPath.push(markers[m + 1].getPosition());
                break;
            }
        }
        m = null;
    });
    g.event.addListener(marker, "drag", function () {
        for (var m = 0; m < vmarkers.length; m++) {
            if (vmarkers[m] == marker) {
                tmpPolyLine.getPath().setAt(1, marker.getPosition());
                break;
            }
        }
        m = null;
    });
    g.event.addListener(marker, "dragend", function () {
        for (var m = 0; m < vmarkers.length; m++) {
            if (vmarkers[m] == marker) {
                var newpos = marker.getPosition();
                var startMarkerPos = markers[m].getPosition();
                var firstVPos = new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())), newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng())));
                var endMarkerPos = markers[m + 1].getPosition();
                var secondVPos = new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - endMarkerPos.lat())), newpos.lng() - (0.5 * (newpos.lng() - endMarkerPos.lng())));
                var newVMarker = createVMarker(secondVPos);
                newVMarker.setPosition(secondVPos); //for some reason the wrong position is applied when creating the vmarker
                var newMarker = createMarker(newpos);
                markers.splice(m + 1, 0, newMarker);
                polyLine.getPath().insertAt(m + 1, newpos);
                marker.setPosition(firstVPos);
                vmarkers.splice(m + 1, 0, newVMarker);
                tmpPolyLine.getPath().removeAt(2);
                tmpPolyLine.getPath().removeAt(1);
                tmpPolyLine.getPath().removeAt(0);
                newpos = null;
                startMarkerPos = null;
                firstVPos = null;
                endMarkerPos = null;
                secondVPos = null;
                newVMarker = null;
                newMarker = null;
                break;
            }
        }
    });
    return marker;
};
var moveVMarker = function (index) {
    var newpos = markers[index].getPosition();
    if (index != 0) {
        var prevpos = markers[index - 1].getPosition();
        vmarkers[index - 1].setPosition(new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())), newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))));
        prevpos = null;
    }
    if (index != markers.length - 1) {
        var nextpos = markers[index + 1].getPosition();
        vmarkers[index].setPosition(new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())), newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))));
        nextpos = null;
    }
    newpos = null;
    index = null;
};
var removeVMarkers = function (index) {
    if (markers.length > 0) { //clicked marker has already been deleted
        if (index != markers.length) {
            vmarkers[index].setMap(null);
            vmarkers.splice(index, 1);
        } else {
            vmarkers[index - 1].setMap(null);
            vmarkers.splice(index - 1, 1);
        }
    }
    if (index != 0 && index != markers.length) {
        var prevpos = markers[index - 1].getPosition();
        var newpos = markers[index].getPosition();
        vmarkers[index - 1].setPosition(new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())), newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))));
        prevpos = null;
        newpos = null;
    }
    index = null;
};

$("#btnsaveRuta").on('click', function () {
    var path = polyLine.getPath();
    var ptnsPath = path.length;
    nomRuta = $("#nombreRuta").val();
    ciudadRuta = $("#lstCiudades").val();
    modalidadRuta = $("#modalidad").val();
    for (var i = 0; i < ptnsPath; i++) {
        var item = path.getAt(i);
        var lat = item.lat().toFixed(5);
        var lng = item.lng().toFixed(5);
        var string = lat + ", " + lng;
        if (i == ptnsPath - 1) {
            trazo = trazo + lat + ',' + lng;
        } else {
            trazo = trazo + lat + ',' + lng + '|';
        }        
    }

    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + guardarRutas,
        data: JSON.stringify({
            nomRuta: nomRuta,
            idCiudad: ciudadRuta,
            idModalidad: modalidadRuta,
            puntos: trazo,
            token: tokenSession
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {
            //console.log("Success...");
            new PNotify({
                title: 'Ruta guardada',
                text: 'Se ha guardado correctamente la ruta creada',
                type: 'success',
                styling: 'bootstrap3'
            });
        }
    });
});


$("#lstRutas").on('change', function(){
    debugger;
    var idRutaGet = $("#lstRutas").val();
    console.log(idRutaGet);
    flightPath = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(null);
    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + consultarRutasId,
        data: JSON.stringify({
            idRuta: idRutaGet,
            token: tokenSession
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {
            datos = JSON.parse(data.d);
            var item = datos['aoData'];
            if (item != null) {
                //console.log();
            } else {
                //No hacer nada
            }
        }
    });
    
    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + consultarTrazo,
        data: JSON.stringify({
            idRuta: idRutaGet,
            token: tokenSession
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {            
            datos = JSON.parse(data.d);
            var itemData = datos['aoData'];
            itemData.forEach(function (item) {
                var lat = item.Latitud;
                var lng = item.Longitud;
            });
            flightPath.setPath(itemData);                                    
            flightPath.setMap(mapVR);

            new PNotify({
                title: 'Carga exitosa',
                text: 'Se ha cargado correctamente la ruta',
                type: 'success',
                styling: 'bootstrap3'
            })
        },
        error: function(status){
            new PNotify({
                title: 'Error al cargar puntos',
                text: status,
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });
    
});

setInterval(function () {
    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + consultarRutasUpdate,
        data: JSON.stringify({
            TotalRegistros: totRegMR,
            token: tokenSession
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {
            datos = JSON.parse(data.d);
            var item = datos['aoData'];
            if (item != null) {
                cargaInfo();
            } else {
                //No hacer nada
            }
        }
    });
}, 3000);

window.onload = function () {
    initMapCR('mapcontainerCR');
    initMapVR('mapcontainerVR');
    initPolyline();
    cargaInfo();
};