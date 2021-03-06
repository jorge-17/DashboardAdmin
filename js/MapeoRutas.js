(function (a) {
    a(window.jQuery, window, document);
}(function ($, window, document) {
    //console.log("Init...");
    //@jrodarte Declaración de URL y metodos
    const rootURL = sessionStorage.getItem("rootURL");
    const urlDashboard = sessionStorage.getItem("urlDashboard");
    const mapRutas = "ConsultarRutas";
    const ciudadesRutas = "ConsultarCiudades";
    const guardarRutas = "GuardarRuta";
    const actualizarRutas = "ActualizarRuta";
    const consultarRutasId = "ConsultarRutaId";
    const consultarTrazo = "ConsultarTrazo";
    const consultarRutasUpdate = "ConsultarRutasUpdate";
    const consultarModalidades = "ConsultarModalidades";
    const consultarLineas = "ConsultarLineas";
    const tokenSession = sessionStorage.getItem('token');
    /** Variables Globales */
    var g;
    var map = null;
    var polyLine;
    var tmpPolyLine;
    var flightPath;
    var markers;
    var vmarkers;
    var nomRuta;
    var ciudadRuta;
    var modalidadRuta;
    var des;
    var trazo = '';
    const latGlobal = 21.256712;
    const lngGlobal = -98.786337;

    var imageNormal;
    var imageHover;
    $('#horaInit').datetimepicker({
        format: 'HH:mm'
    });
    $('#horaEnd').datetimepicker({
        format: 'HH:mm'
    });
    $('#horaInitEditar').datetimepicker({
        format: 'HH:mm'
    });
    $('#horaEndEditar').datetimepicker({
        format: 'HH:mm'
    });


    var totRegMR = 0;
    async function cargaInfo() {
        var resultado;


        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + ciudadesRutas,
                data: JSON.stringify({
                    token: tokenSession,
                    idEstado: 24
                }),
                contentType: "application/json; charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegCR = datos['iRegistros'];
            for (var i = 0; i < totRegCR; i++) {
                const item = datos['aoData'][i];
                const idCiudad = item['IdCiudad'];
                const nombreCiudad = item['Nombre'];
                $('#lstCiudades').append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
                $('#lstCiudadesVer').append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
                $('#lstCiudadesEditar').append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
            }
        });



        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + mapRutas,
                data: JSON.stringify({
                    token: tokenSession
                }),
                contentType: "application/json; charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegMR = datos['iRegistros'];
            for (var i = 0; i < totRegMR; i++) {
                var item = datos['aoData'][i];
                var idRuta = item['IdRuta'];
                var nombreRuta = item['Nombre'];
                $('#lstRutas').append('<option value="' + idRuta + '">' + nombreRuta + '</option>');
                $('#lstRutasVer').append('<option value="' + idRuta + '">' + nombreRuta + '</option>');
                $('#lstRutasEditar').append('<option value="' + idRuta + '">' + nombreRuta + '</option>');
            }
        })



        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarModalidades,
                data: JSON.stringify({
                    token: tokenSession
                }),
                contentType: "application/json; charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegMRModalidad = datos['iRegistros'];
            for (var i = 0; i < totRegMRModalidad; i++) {
                var item = datos['aoData'][i];
                var idModalidad = item['IdModalidad'];
                var nombreModalidad = item['Nombre'];
                $('#lstModalidad').append('<option value="' + idModalidad + '">' + nombreModalidad + '</option>');
                $('#lstModalidadVer').append('<option value="' + idModalidad + '">' + nombreModalidad + '</option>');
                $('#lstModalidadEditar').append('<option value="' + idModalidad + '">' + nombreModalidad + '</option>');
            }
        })

        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarLineas,
                data: JSON.stringify({
                    token: tokenSession
                }),
                contentType: "application/json; charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegMRLinea = datos['iRegistros'];
            for (var i = 0; i < totRegMRLinea; i++) {
                const item = datos['aoData'][i];
                const idLinea = item['IdLinea'];
                const claveLinea = item['Clave'];
                const nombreLinea = item['Nombre'];
                $('#lstLineas').append('<option value="' + idLinea + '">' + claveLinea + ' - ' + nombreLinea + '</option>');
                $('#lstLineasVer').append('<option value="' + idLinea + '">' + claveLinea + ' - ' + nombreLinea + '</option>');
                $('#lstLineasEditar').append('<option value="' + idLinea + '">' + claveLinea + ' - ' + nombreLinea + '</option>');
            }
        })

    }


    var initMap = function (mapHolder, lat, lng) {
        g = google.maps;
        markers = [];
        vmarkers = [];
        var mapOptions = {
            zoom: 15,
            center: new g.LatLng(lat, lng),
            mapTypeId: g.MapTypeId.roadmap,
            draggableCursor: 'auto',
            draggingCursor: 'move',
            disableDoubleClickZoom: true
        };
        map = new g.Map(document.getElementById(mapHolder), mapOptions);
        g.event.addListener(map, "click", mapLeftClick);
        mapHolder = null;
        mapOptions = null;
    };

    function addItemList(lat, lng) {
        const lista = document.getElementById("itemsLst");
        const string = lat.toFixed(5) + ", " + lng.toFixed(5);
        console.log(string);
        const item = document.createElement("li");
        item.appendChild(document.createTextNode(string));
        lista.appendChild(item);
    }
    var initPolyline = function (mapHolder) {
        const polyOptions = {
            strokeColor: "#3355ff",
            strokeOpacity: 0.8,
            strokeWeight: 4
        };
        const tmpPolyOptions = {
            strokeColor: "#3355FF",
            strokeOpacity: 0.4,
            strokeWeight: 4
        };
        polyLine = new g.Polyline(polyOptions);
        polyLine.setMap(mapHolder);
        tmpPolyLine = new g.Polyline(tmpPolyOptions);
        tmpPolyLine.setMap(mapHolder);
    };

    var mapLeftClick = function (event) {
        if (event.latLng) {
            var marker = createMarker(event.latLng);
            markers.push(marker);
            if (markers.length !== 1) {
                var vmarker = createVMarker(event.latLng);
                vmarkers.push(vmarker);
                vmarker = null;
            }
            const path = polyLine.getPath();
            path.push(event.latLng);
            marker = null;
        }
        event = null;
    };
    var createMarker = function (point) {
        const imageNormal = new g.MarkerImage("../img/square.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
        const imageHover = new g.MarkerImage("../img/square_over.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
        const marker = new g.Marker({
            position: point,
            map: map,
            icon: imageNormal,
            draggable: true
        });
        //addItemList(marker.getPosition().lat(), marker.getPosition().lng());
        g.event.addListener(marker, "mouseover", function () {
            marker.setIcon(imageHover);
        });
        g.event.addListener(marker, "mouseout", function () {
            marker.setIcon(imageNormal);
        });
        g.event.addListener(marker, "drag", function () {
            for (var m = 0; m < markers.length; m++) {
                if (markers[m] === marker) {
                    polyLine.getPath().setAt(m, marker.getPosition());
                    moveVMarker(m);
                    break;
                }
            }
            m = null;
        });
        g.event.addListener(marker, "click", function () {
            for (var m = 0; m < markers.length; m++) {
                if (markers[m] === marker) {
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
        const imageNormal = new g.MarkerImage("../img/square_transparent.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
        const imageHover = new g.MarkerImage("../img/square_transparent_over.png", new g.Size(11, 11), new g.Point(0, 0), new g.Point(6, 6));
        const prevpoint = markers[markers.length - 2].getPosition();
        var marker = new g.Marker({
            position: new g.LatLng(point.lat() - (0.5 * (point.lat() - prevpoint.lat())), point.lng() - (0.5 * (point.lng() - prevpoint.lng()))),
            map: map,
            icon: imageNormal,
            draggable: true
        });
        g.event.addListener(marker, "mouseover", function () {
            marker.setIcon(imageHover);
        });
        g.event.addListener(marker, "mouseout", function () {
            marker.setIcon(imageNormal);
        });
        g.event.addListener(marker, "dragstart", function () {
            for (var m = 0; m < vmarkers.length; m++) {
                if (vmarkers[m] === marker) {
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
                if (vmarkers[m] === marker) {
                    tmpPolyLine.getPath().setAt(1, marker.getPosition());
                    break;
                }
            }
            m = null;
        });
        g.event.addListener(marker, "dragend", function () {
            for (var m = 0; m < vmarkers.length; m++) {
                if (vmarkers[m] === marker) {
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
        if (index !== 0) {
            var prevpos = markers[index - 1].getPosition();
            vmarkers[index - 1].setPosition(new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())), newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))));
            prevpos = null;
        }
        if (index !== markers.length - 1) {
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
        if (index !== 0 && index !== markers.length) {
            var prevpos = markers[index - 1].getPosition();
            var newpos = markers[index].getPosition();
            vmarkers[index - 1].setPosition(new g.LatLng(newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())), newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))));
            prevpos = null;
            newpos = null;
        }
        index = null;
    };

    $("#btnsaveRuta").on('click', async function () {
        const path = polyLine.getPath();
        const ptnsPath = path.length;
        if (ptnsPath !== 0) {
            nomRuta = $("#nombreRuta").val();
            ciudadRuta = $("#lstCiudades").val();
            modalidadRuta = $("#lstModalidad").val();
            lineaRuta = $("#lstLineas").val();
            horaInicio = ($("#horaInit").val()).split(" ");
            horaFin = ($("#horaEnd").val()).split(" ");
            des = $("#descrip").val();
            for (var i = 0; i < ptnsPath; i++) {
                const item = path.getAt(i);
                const lat = item.lat().toFixed(5);
                const lng = item.lng().toFixed(5);
                var string = lat + ", " + lng;
                if (i === ptnsPath - 1) {
                    trazo = trazo + lat + ',' + lng;
                } else {
                    trazo = trazo + lat + ',' + lng + '|';
                }
            }
            var dataJson = JSON.stringify({
                nomRuta: nomRuta,
                idCiudad: ciudadRuta,
                idModalidad: modalidadRuta,
                puntos: trazo,
                idLinea: lineaRuta,
                horaInicio: horaInicio[0],
                horaFin: horaFin[0],
                descripcion: des,
                token: tokenSession
            });
            var resultado;
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + guardarRutas,
                    data: dataJson,
                    contentType: "application/json;charset=utf-8",
                })
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
                $("#formCreateRuta")[0].reset();
                initMap('mapcontainer', latGlobal, lngGlobal);
                new PNotify.success({
                    title: 'Exito!',
                    text: 'La ruta se ha registrado correctamente',
                    styling: 'bootstrap4',
                    delay: 2000
                });
            })
            trazo = '';
        } else {
            new PNotify.error({
                title: 'La ruta no ha sido definida',
                text: 'Verifica que hayas ingresado una ruta en el mapa',
                styling: 'bootstrap4',
                hide: false,
                            modules: {
                                Confirm: {
                                    confirm: true,
                                    buttons: [
                                        {
                                            text: 'Entendido',
                                            primary: true,
                                            click: function (notice) {
                                                notice.close();
                                            }
                                        }
                                    ]
                                },
                                Buttons: {
                                    closer: true
                                },
                                History: {
                                    history: false
                                },
                            }
            });
        }

    });

    $("#btnupdateRuta").on('click', async function () {
        var path = polyLine.getPath();
        var ptnsPath = path.length;
        var idRutaGet = $("#lstRutasEditar").val();
        nomRuta = $("#nombreRutaEditar").val();
        ciudadRuta = $("#lstCiudadesEditar").val();
        modalidadRuta = $("#lstModalidadEditar").val();
        lineaRuta = $("#lstLineasEditar").val();
        horaInicio = ($("#horaInitEditar").val()).split(" ");
        horaFin = ($("#horaEndEditar").val()).split(" ");
        des = $("#descripEditar").val();
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
        var dataJson = JSON.stringify({
            idRuta: idRutaGet,
            nomRuta: nomRuta,
            idCiudad: ciudadRuta,
            idModalidad: modalidadRuta,
            puntos: trazo,
            idLinea: lineaRuta,
            horaInicio: horaInicio[0],
            horaFin: horaFin[0],
            descripcion: des,
            token: tokenSession
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + actualizarRutas,
                data: dataJson,
                contentType: "application/json;charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }

        $.when(resultado).then(function (data) {
            $("#formEditRuta")[0].reset();
            initMap('mapcontainer', latGlobal, lngGlobal);
            new PNotify.success({
                title: 'Exito!',
                text: 'La ruta se ha actualizado correctamente',
                styling: 'bootstrap4',
                delay: 2000
            });
        });
        trazo = '';

    });


    $("#lstRutas").on('change', async function () {
        var idRutaGet = $("#lstRutas").val();
        flightPath = new google.maps.Polyline({
            geodesic: true,
            strokeColor: '#3355FF',
            strokeOpacity: 0.8,
            strokeWeight: 3
        });
        var dataJson = JSON.stringify({
            idRuta: idRutaGet,
            token: tokenSession
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarRutasId,
                data: dataJson,
                contentType: "application/json;charset=utf-8"
            })
        }
        catch (error) {
            console.log(error);
        }

        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            var itemData = datos['aoData'];
            $("#nombreRutaVer").val(itemData[0]["Nombre"]);
            $("#lstLineasVer").val(itemData[0]["IdLinea"]);
            $("#lstCiudadesVer").val(itemData[0]["IdCiudad"]);
            $("#lstModalidadVer").val(itemData[0]["IdModalidad"]);
            $("#horaInitVer").val(itemData[0]["HoraInicio"]);
            $("#horaEndVer").val(itemData[0]["HoraFin"]);
            $("#descripVer").val(itemData[0]["Descripcion"]);
        });

        var dataJson1 = JSON.stringify({
            idRuta: idRutaGet,
            token: tokenSession
        });
        var resultado1;

        try {
            resultado1 = await $.ajax({
                type: "POST",
                url: rootURL + consultarTrazo,
                data: dataJson1,
                contentType: "application/json;charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }

        $.when(resultado1).then(function (data) {
            datos = JSON.parse(data.d);
            var itemData = datos['aoData'];
            var arrayLat = [], arrayLng = [];
            var i = 0;
            var bounds = new google.maps.LatLngBounds();
            itemData.forEach(function (item) {
                arrayLat[i] = parseFloat(item.lat);
                arrayLng[i] = parseFloat(item.lng);
                var punto = new g.LatLng(arrayLat[i], arrayLng[i]);
                bounds.extend(punto);
                i++;
            });
            var minLat = Math.min(...arrayLat);
            var maxLat = Math.max(...arrayLat);
            var pLat = ((maxLat - minLat) / 2) + minLat;
            var minLng = Math.min(...arrayLng);
            var maxLng = Math.max(...arrayLng);
            var pLng = ((maxLng - minLng) / 2) + minLng;
            initMap('mapcontainer', pLat, pLng);
            flightPath.setPath(itemData);
            flightPath.setMap(map);
            map.fitBounds(bounds);
        });
    });

    $("#lstRutasEditar").on('change', async function () {
        var idRutaGet = $("#lstRutasEditar").val();
        flightPath = new google.maps.Polyline({
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        var dataJson = JSON.stringify({
            idRuta: idRutaGet,
            token: tokenSession
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarRutasId,
                data: dataJson,
                contentType: "application/json;charset=utf-8"
            })
        }
        catch (error) {
            console.log(error);
        }

        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            var itemData = datos['aoData'];
            $("#nombreRutaEditar").val(itemData[0]["Nombre"]);
            $("#horaInitEditar").val(itemData[0]["HoraInicio"]);
            $("#horaEndEditar").val(itemData[0]["HoraFin"]);
            $("#lstLineasEditar").val(itemData[0]["IdLinea"]);
            $("#lstCiudadesEditar").val(itemData[0]["IdCiudad"]);
            $("#lstModalidadEditar").val(itemData[0]["IdModalidad"]);
            $("#descripEditar").val(itemData[0]["Descripcion"]);
        });

        var dataJson1 = JSON.stringify({
            idRuta: idRutaGet,
            token: tokenSession
        });
        var resultado1;

        try {
            resultado1 = await $.ajax({
                type: "POST",
                url: rootURL + consultarTrazo,
                data: dataJson1,
                contentType: "application/json;charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }

        $.when(resultado1).then(function (data) {
            datos = JSON.parse(data.d);
            var itemData = datos['aoData'];
            var arrayLat = [], arrayLng = [];
            var j = 0;
            itemData.forEach(function (item) {
                arrayLat[j] = parseFloat(item.lat);
                arrayLng[j] = parseFloat(item.lng);
                j++;
            });
            var minLat = Math.min(...arrayLat);
            var maxLat = Math.max(...arrayLat);
            var pLat = ((maxLat - minLat) / 2) + minLat;
            var minLng = Math.min(...arrayLng);
            var maxLng = Math.max(...arrayLng);
            var pLng = ((maxLng - minLng) / 2) + minLng;
            initMap('mapcontainer', pLat, pLng);
            initPolyline(map);
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < arrayLat.length; i++) {
                var punto = new g.LatLng(arrayLat[i], arrayLng[i]);
                var marker = createMarker(punto);
                markers.push(marker);
                if (markers.length != 1) {
                    var vmarker = createVMarker(punto);
                    vmarkers.push(vmarker);
                    vmarker = null;
                }
                var path = polyLine.getPath();
                path.push(punto);
                marker = null;
                bounds.extend(punto);
            }
            map.fitBounds(bounds);
        });
    });

    setInterval(async function () {
        var dataJson = JSON.stringify({
            TotalRegistros: totRegMR,
            token: tokenSession
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarRutasUpdate,
                data: dataJson,
                contentType: "application/json;charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }

        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            var item = datos['aoData'];
            if (item != null) {
                $('#lstRutas')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option></option>');
                $('#lstRutasEditar')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option></option>');
                cargaInfo();
            } else {
                //No hacer nada
            }
        });
    }, 3000);
    $("#tabSeeRoute").on('click', function () {
        initMap('mapcontainer', 21.256712, -98.786337);
        initPolyline(map);
        $("#formSeeRuta").find('input:text, select, textarea').val("");
    });
    $("#tabCreateRoute").on('click', function () {
        initMap('mapcontainer', 21.256712, -98.786337);
        initPolyline(map);
        $("#formCreateRuta").find('input:text, select, textarea').val("");
    });
    $("#tabEditRoute").on('click', function () {
        initMap('mapcontainer', 21.256712, -98.786337);
        initPolyline(map);
        $("#formEditRuta").find('input:text, select, textarea').val("");
    });

    window.onload = function () {
        initMap('mapcontainer', 21.256712, -98.786337);
        /*initMapVR('mapcontainerVR', latGlobal, lngGlobal);
        initMapER('mapcontainerER', latGlobal, lngGlobal);*/
        initPolyline(map);
        //initPolylineER(mapER);

        cargaInfo();
    };
}));
