(function (a){
    a(window.jQuery, window, document);
}(function ($, window, document) {
    //console.log("Init...");
    //@jrodarte Declaración de URL y metodos
    //const rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
    const rootURL = "http://localhost:26010/Dashboard.svc/";
    const TramitesDia = "ConsultarTramitesDia";
    const TramitesDiaUpdate = "ConsultarTramitesDiaUpdate";
    const TramitesHorario = "ConsultarTramitesHorario";
    const TramitesDiaLast30 = "ConsultarTramitesLast30";
    const TramitesHorarioxDia = "ConsultarTramitesHorarioxDia";
    const TramitesxMeses = "ObtenerTramitesxMeses";
    const tokenSession = sessionStorage.getItem('token');
    const fechaNow = new Date();
    const yearN = fechaNow.getFullYear();
    const monthN = fechaNow.getMonth();
    const dayN = fechaNow.getDate();
    var spl, slp2, time;
    var datos = [];
    var AllData = [];
    var DataGraficaG4 = [];
    var TotalRegistros = 0;
    var totRegTD = 0;
    var totRegTH = 0;
    var totRegTD30 = 0;
    var l = 0;
    var m = 0;
    var x = 0;
    var j = 0;
    var v = 0;

    const fechaPicker = $('#myDatepicker2').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date()
    });
    let fechaRange = $("#dateRangePicker").daterangepicker({
        "maxDate": (monthN + 1) + "/" + dayN + "/" + yearN,
        autoUpdateInput: false,
        "locale": {
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "De",
            "toLabel": "A",
            "daysOfWeek": [
                "Dom.",
                "Lun.",
                "Mar.",
                "Mie.",
                "Jue.",
                "Vie.",
                "Sab."
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agusto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
        }
    });
    $(window).on("load", function () {
        postG1();
        postG2();
        postG3();
        postG4();
    });
    /**
     * Cargas iniciales de las graficas G1, G2 y G3
     *
     */
//Grafica Tramites por Semana
    async function postG1() {
        var resultado;
        const fechaRange = $("#dateRangePicker input").val();
        if (fechaRange === "") {
            //Carga inicial grafica de Tramites por día
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesDia,
                    data: JSON.stringify({
                        token: tokenSession
                    }),
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
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
                            text: 'Número de trámites'
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
            });
        } else {
            var dateRange = fechaRange.split(" - ");
            var dateInicial = dateRange[0];
            var dateFinal = dateRange[1];
            var dataJson = JSON.stringify({
                token: tokenSession,
                fechaInit: dateInicial,
                fechaEnd: dateFinal
            });
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesDia,
                    data: dataJson,
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
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
                            text: 'Número de trámites'
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
            });
        }
    }
//Grafica Tramites por Mes
    async function postG2() {
        var resultado;
        const fechaRange = $("#dateRangePicker input").val();
        if (fechaRange === "") {
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesDiaLast30,
                    data: JSON.stringify({
                        token: tokenSession
                    }),
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD30 = datos['iRegistros'];
                for (var i = 0; i < totRegTD30; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['fechaStr'];
                    var valor = item['numRegistrosFecha'];
                    slp = FechaTramite.split("T");
                    slp2 = slp[0].split("-");
                    var anio = slp2[0];
                    var mes = slp2[1];
                    var dia = slp2[2];
                    AllData.push([
                        Date.UTC(anio, (mes - 1), dia),
                        valor
                    ]);
                }
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
                            text: 'Número de trámites'
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
            });
        } else {
            var dateRange = fechaRange.split(" - ");
            var dateInicial = dateRange[0];
            var dateFinal = dateRange[1];
            var fechaF = dateFinal.split("/");
            var fechaMax = new Date(fechaF[2], fechaF[1]-1, fechaF[0]);
            var dateFinalArr = dateFinal.split('/');
            var dataJson = JSON.stringify({
                token: tokenSession,
                fechaInit: dateInicial,
                fechaEnd: dateFinal
            });
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesDiaLast30,
                    data: dataJson,
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD30 = datos['iRegistros'];
                for (var i = 0; i < totRegTD30; i++) {
                    var item = datos['aoData'][i];
                    var FechaTramite = item['fechaStr'];
                    var valor = item['numRegistrosFecha'];
                    slp = FechaTramite.split("T");
                    slp2 = slp[0].split("-");
                    var anio = slp2[0];
                    var mes = slp2[1];
                    var dia = slp2[2];
                    var dateItem = new Date(anio, mes - 1, dia);
                    AllData.push([
                        Date.UTC(anio, (mes - 1), dia),
                        valor
                    ]);
                }
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
                            text: 'Número de trámites'
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
            })
        }
    }
//Grafica Tramites por Horario
    async function postG3() {
        var resultado;
        const fechaPicker = $("#datePicker").val();
        if (fechaPicker === "") {
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesHorario,
                    data: JSON.stringify({
                        token: tokenSession
                    }),
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
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
                            text: 'Número de trámites'
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
                h9 = 0;
                h10 = 0;
                h11 = 0;
                h12 = 0;
                h13 = 0;
                h14 = 0;
                h15 = 0;
            });
        } else {
            var val = fechaPicker;
            var dateArr = val.split("/");
            var diaR = dateArr[0];
            var mesR = dateArr[1];
            var anioR = dateArr[2];
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesHorarioxDia,
                    data: JSON.stringify({
                        token: tokenSession,
                        dia: diaR,
                        mes: mesR,
                        anio: anioR
                    }),
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
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
                            text: 'Número de trámites'
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
            });
        }
    }

    async function postG4() {
        var resultado;
        const fechaRange = $("#dateRangePicker input").val();
        if (fechaRange === "") {
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + TramitesxMeses,
                    data: JSON.stringify({
                        token: tokenSession
                    }),
                    contentType: "application/json; charset=utf-8"
                });
            } catch (error) {
                console.log(error);
            }
            $.when(resultado).then(function (data) {
                datos = JSON.parse(data.d);
                //Obtiene el total de registros retornados
                totRegTD30 = datos['iRegistros'];
                var info = datos['aoData'];
                info.forEach(element => {
                    var anioFecha = element['fechaYear'];
                    var mesFecha = element['fechaMonth'];
                    var fechaRegistro = Date.UTC(anioFecha, (mesFecha - 1), 1);
                    var numRegistros = element['numRegistrosFecha'];
                    DataGraficaG4.push([
                        fechaRegistro,
                        numRegistros
                    ]);
                });                
                DataGraficaG4.sort();
                Highcharts.chart('tramitesxMes', {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: 'Trámites por mes'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { 
                            month: '%b %Y'
                        },
                        max: fechaNow
                    },
                    yAxis: {
                        title: {
                            text: 'Número de trámites'
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
                        data: DataGraficaG4
                    }]
                });
                DataGraficaG4 = [];
            });
        } 
    }


    /**Ciclo de actualizacion de graficas */
    setInterval(async function () {
        try {
            var resultado = await $.ajax({
                type: "POST",
                url: rootURL + TramitesDiaUpdate,
                data: JSON.stringify({
                    TotalRegistros: TotalRegistros,
                    token: tokenSession
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            });
        } catch (error) {
            console.log(error);
        }

        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            var item = datos['aoData'];
            if (item === true) {
                postG1();
                postG2();
                postG3();
                postG4();
            }
        });
    }, 3000);



    /** Seleccion de fecha para grafica G3 */
    $("#datePicker").on("focusout", function () {
        postG3();
    });
    /** Seleccion de rango de fechas para graficas G1 y G2 */
    $('#dateRangePicker').on('apply.daterangepicker', function (ev, picker) {
        $('#dateRangePicker input').val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        postG1();
        postG2();
    });
}));



