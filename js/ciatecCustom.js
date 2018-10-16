var fechaNow = new Date();
var yearN = fechaNow.getFullYear();
var monthN = fechaNow.getMonth();
var dayN = fechaNow.getDate();
var spl, slp2, time;
var datos = [];
var AllData = [];
var TotalRegistros = 0;
var totRegTD = 0;
var totRegTH = 0;
var totRegTD30 = 0;
var l = 0;
var m = 0;
var x = 0;
var j = 0;
var v = 0;
$('#myDatepicker2').datetimepicker({
    format: 'DD/MM/YYYY'
});
$("#dateRangePicker").daterangepicker({
    "maxDate": (monthN + 1) + "/" + dayN + "/" + yearN,
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    }
});
$(window).on("load", function () {
    postG1();
    postG2();
    postG3();
});


/**
 * Cargas iniciales de las graficas G1, G2 y G3
 *  
 */
//Grafica Tramites por Semana
function postG1() {
    if ($("#dateRangePicker").val() == "") {
        //Carga inicial grafica de Tramites por día
        $.getJSON({
            type: "POST",
            url: rootURL + TramitesDia,
            data: JSON.stringify({
                token: tokenSession
            }),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD = datos['iRegistros'];
                TotalRegistros = totRegTD;
                $(".count").html(totRegTD);
                for (var i = 0; i < totRegTD; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['FechaTramite'];
                    //console.log(item);
                    slp = FechaTramite.split("-");
                    slp2 = slp[2].split("T");
                    var anio = slp[0];
                    var mes = slp[1];
                    var dia = slp2[0];
                    var dateItem = new Date(anio, mes - 1, dia);
                    var numDia = dateItem.getDay();
                    switch (numDia) {
                        case 1:
                            l++;
                            break;
                        case 2:
                            m++;
                            break;
                        case 3:
                            x++;
                            break;
                        case 4:
                            j++;
                            break;
                        case 5:
                            v++;
                            break;
                    }
                }
                Highcharts.chart('tramitesDia', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Trámites por día'
                    },
                    xAxis: {
                        categories: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
                    },
                    yAxis: {
                        title: {
                            text: 'Numero de trámites'
                        },
                        tickInterval: 2,
                        gridLineWidth: 1
                    },
                    tooltip: {
                        crosshairs: true
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{
                        name: 'No. de trámites',
                        data: [l, m, x, j, v]
                    }]
                });
                l = 0;
                m = 0;
                x = 0;
                j = 0;
                v = 0;
            },
            error: function () {
                $("#viewData").html("<p>Ocurrio un error</p>");
            }
        });
    } else {
        var dateRange = $("#dateRangePicker").val().split(" - ");
        var dateInicial = dateRange[0];
        var dateFinal = dateRange[1];

        var dataJson = JSON.stringify({
            token: tokenSession,
            fechaInit: dateInicial,
            fechaEnd: dateFinal
        });

        $.getJSON({
            type: "POST",
            url: rootURL + TramitesDia,
            data: dataJson,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD = datos['iRegistros'];
                $(".count").html(totRegTD);
                for (var i = 0; i < totRegTD; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['FechaTramite'];
                    //console.log(item);
                    slp = FechaTramite.split("-");
                    slp2 = slp[2].split("T");
                    var anio = slp[0];
                    var mes = slp[1];
                    var dia = slp2[0];
                    var dateItem = new Date(anio, mes - 1, dia);
                    var numDia = dateItem.getDay();
                    switch (numDia) {
                        case 1:
                            l++;
                            break;
                        case 2:
                            m++;
                            break;
                        case 3:
                            x++;
                            break;
                        case 4:
                            j++;
                            break;
                        case 5:
                            v++;
                            break;
                    }
                }
                Highcharts.chart('tramitesDia', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Trámites por día'
                    },
                    xAxis: {
                        categories: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
                    },
                    yAxis: {
                        title: {
                            text: 'Numero de trámites'
                        },
                        tickInterval: 2,
                        gridLineWidth: 1
                    },
                    tooltip: {
                        crosshairs: true
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{
                        name: 'No. de trámites',
                        data: [l, m, x, j, v]
                    }]
                });
                l = 0;
                m = 0;
                x = 0;
                j = 0;
                v = 0;
            },
            error: function () {
                $("#viewData").html("<p>Ocurrio un error</p>");
            }
        });
    }

}
//Grafica Tramites por Mes
function postG2() {
    if ($("#dateRangePicker").val() == "") {
        //Carga inicial grafica tramites ultimos 30 días
        $.getJSON({
            type: "POST",
            url: rootURL + TramitesDiaLast30,
            data: JSON.stringify({
                token: tokenSession
            }),
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD30 = datos['iRegistros'];
                for (var i = 0; i < totRegTD30; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['fechaStr'];
                    var valor = item['numRegistrosFecha'];
                    //console.log(FechaTramite);
                    slp = FechaTramite.split("T");
                    slp2 = slp[0].split("-");
                    var anio = slp2[0];
                    var mes = slp2[1];
                    var dia = slp2[2];
                    //console.log(dateItem);
                    AllData.push([
                        Date.UTC(anio, (mes - 1), dia),
                        valor
                    ]);
                }
                //console.log(AllData);
                Highcharts.chart('tramitesDiaUlt30', {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: 'Trámites al mes'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%e. %b',
                            year: '%b'
                        },
                        max: fechaNow,
                        tickInterval: 5 * 24 * 3600 * 1000
                    },
                    yAxis: {
                        title: {
                            text: 'Numero de trámites'
                        },
                        tickInterval: 2,
                        gridLineWidth: 1
                    },
                    tooltip: {
                        crosshairs: true
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{
                        name: 'No. de trámites',
                        data: AllData
                    }]
                });
                AllData = [];
            },
            error: function () {
                $("#viewData").html("<p>Ocurrio un error</p>");
            }
        });
    } else {
        var dateRange = $("#dateRangePicker").val().split(" - ");
        var dateInicial = dateRange[0];
        var dateFinal = dateRange[1];
        var dateFinalArr = dateFinal.split('/');
        var fechaMax = new Date(parseInt(dateFinalArr[2]), parseInt(dateFinalArr[1])-1, parseInt(dateFinalArr[0]));        
        console.log(fechaMax);
        var dataJson = JSON.stringify({
            token: tokenSession,
            fechaInit: dateInicial,
            fechaEnd: dateFinal
        });

        //Carga inicial grafica tramites ultimos 30 días
        $.getJSON({
            type: "POST",
            url: rootURL + TramitesDiaLast30,
            data: dataJson,
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD30 = datos['iRegistros'];
                for (var i = 0; i < totRegTD30; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['fechaStr'];
                    var valor = item['numRegistrosFecha'];
                    //console.log(FechaTramite);
                    slp = FechaTramite.split("T");
                    slp2 = slp[0].split("-");
                    var anio = slp2[0];
                    var mes = slp2[1];
                    var dia = slp2[2];
                    var dateItem = new Date(anio, mes - 1, dia);
                    //console.log(dateItem);
                    AllData.push([
                        Date.UTC(anio, (mes - 1), dia),
                        valor
                    ]);
                }
                //console.log(AllData);
                Highcharts.chart('tramitesDiaUlt30', {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: 'Trámites al mes'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%e. %b',
                            year: '%b'
                        },
                        max: fechaMax,
                        tickInterval: 5 * 24 * 3600 * 1000
                    },
                    yAxis: {
                        title: {
                            text: 'Numero de trámites'
                        },
                        tickInterval: 2,
                        gridLineWidth: 1
                    },
                    tooltip: {
                        crosshairs: true
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{
                        name: 'No. de trámites',
                        data: AllData
                    }]
                });
                AllData = [];
            },
            error: function () {
                $("#viewData").html("<p>Ocurrio un error</p>");
            }
        });
    }
}
//Grafica Tramites por Horario
function postG3() {
    if ($("#datePicker").val() == "") {
        //Carga inicial grafica tramites por Horario
        $.getJSON({
            type: "POST",
            url: rootURL + TramitesHorario,
            data: JSON.stringify({
                token: tokenSession
            }),
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                var h9 = 0;
                var h10 = 0;
                var h11 = 0;
                var h12 = 0;
                var h13 = 0;
                var h14 = 0;
                var h15 = 0;
                var meses = [];
                var dias = [];
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTH = datos['iRegistros'];
                for (var i = 0; i < totRegTH; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['FechaTramite'];
                    slp = FechaTramite.split("-");
                    slp2 = slp[2].split("T");
                    var horaio = slp2[1].split(":");
                    var hora = parseInt(horaio[0]);
                    var minuto = horaio[1];
                    if (hora < 9) {
                        h9++;
                    } else if (hora < 10) {
                        h10++;
                    } else if (hora < 11) {
                        h11++;
                    } else if (hora < 12) {
                        h12++;
                    } else if (hora < 13) {
                        h13++;
                    } else if (hora < 14) {
                        h14++;
                    } else if (hora < 15) {
                        h15++;
                    }
                }
                Highcharts.chart('traitesHorario', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Trámites por horario'
                    },
                    xAxis: {
                        categories: ['8am-9am', '9am-10am', '10am-11am', '11am-12pm', '12pm-13pm', '13pm-14pm', '14pm-15pm']
                    },
                    yAxis: {
                        title: {
                            text: 'Numero de trámites'
                        },
                        tickInterval: 2,
                        gridLineWidth: 1
                    },
                    tooltip: {
                        crosshairs: true
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'No. de trámites',
                        data: [h9, h10, h11, h12, h13, h14, h15]
                    }]
                });
                var h9 = 0;
                var h10 = 0;
                var h11 = 0;
                var h12 = 0;
                var h13 = 0;
                var h14 = 0;
                var h15 = 0;
            },
            error: function () {
                $("#viewData").html("<p>Ocurrio un error</p>");
            }
        });
    } else {
        var val = $("#datePicker").val();
        var dateArr = val.split("/");
        var diaR = dateArr[0];
        var mesR = dateArr[1];
        var anioR = dateArr[2];
        //console.log(diaR + "-" + mesR + "-" + anioR);
        $.getJSON({
            type: "POST",
            url: rootURL + TramitesHorarioxDia,
            data: JSON.stringify({
                token: tokenSession,
                dia: diaR,
                mes: mesR,
                anio: anioR
            }),
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                var h9 = 0;
                var h10 = 0;
                var h11 = 0;
                var h12 = 0;
                var h13 = 0;
                var h14 = 0;
                var h15 = 0;
                var meses = [];
                var dias = [];
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTH = datos['iRegistros'];
                for (var i = 0; i < totRegTH; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['FechaTramite'];
                    slp = FechaTramite.split("-");
                    slp2 = slp[2].split("T");
                    var horaio = slp2[1].split(":");
                    var hora = parseInt(horaio[0]);
                    var minuto = horaio[1];
                    if (hora < 9) {
                        h9++;
                    } else if (hora < 10) {
                        h10++;
                    } else if (hora < 11) {
                        h11++;
                    } else if (hora < 12) {
                        h12++;
                    } else if (hora < 13) {
                        h13++;
                    } else if (hora < 14) {
                        h14++;
                    } else if (hora < 15) {
                        h15++;
                    }
                }
                Highcharts.chart('traitesHorario', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Trámites por horario'
                    },
                    xAxis: {
                        categories: ['8am-9am', '9am-10am', '10am-11am', '11am-12pm', '12pm-13pm', '13pm-14pm', '14pm-15pm']
                    },
                    yAxis: {
                        title: {
                            text: 'Numero de trámites'
                        },
                        tickInterval: 2,
                        gridLineWidth: 1
                    },
                    tooltip: {
                        crosshairs: true
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'No. de trámites',
                        data: [h9, h10, h11, h12, h13, h14, h15]
                    }]
                });
                var h9 = 0;
                var h10 = 0;
                var h11 = 0;
                var h12 = 0;
                var h13 = 0;
                var h14 = 0;
                var h15 = 0;
            },
            error: function () {
                $("#viewData").html("<p>Ocurrio un error</p>");
            }
        });
    }
}



/**Ciclo de actualizacion de graficas */
setInterval(function () {
    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + TramitesDiaUpdate,
        data: JSON.stringify({
            TotalRegistros: TotalRegistros,
            token: tokenSession
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {
            datos = JSON.parse(data.d);
            var item = datos['aoData'];
            //console.log(item);
            if (item == true) {
                postG1();
                postG2();
                postG3();
            } else {
                //No hacer nada
            }
        }
    });
}, 3000);



/** Seleccion de fecha para grafica G3 */
$("#datePicker").on("focusout", function () {
    postG3();
});
/** Seleccion de rango de fechas para graficas G1 y G2 */
$('input[name="dateRangePicker"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    postG1();
    postG2();
});


