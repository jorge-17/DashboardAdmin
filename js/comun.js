//@jrodarte Declaración de URL y metodos
//var rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
var rootURL = "http://localhost:26010/Dashboard.svc/";
var TramitesDia = "ConsultarTramitesDia";
var TramitesDiaUpdate = "ConsultarTramitesDiaUpdate";
var TramitesHorario = "ConsultarTramitesHorario";
var TramitesDiaLast30 = "ConsultarTramitesLast30";
var CerrarSesion = "CerrarSesion";
var TramitesHorarioxDia = "ConsultarTramitesHorarioxDia";
var mapRutas = "ConsultarRutas";
var ciudadesRutas = "ConsultarCiudades";
var guardarRutas = "GuardarRuta";
var consultarRutasId = "ConsultarRutaId";
var consultarTrazo = "ConsultarTrazo";
var consultarRutasUpdate = "ConsultarRutasUpdate";
var consultarModalidades = "ConsultarModalidades";
var consultarReporte = "ObtenerReporte";
var tokenSession = sessionStorage.getItem('token');

$("#btnLogOut").on('click', function () {
    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + CerrarSesion,
        data: JSON.stringify({
            token: tokenSession
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {
            //console.log("Saliendo...");
            sessionStorage.removeItem('token');
            window.location.replace("http://localhost/dashboard/views/");
            //window.location.replace("https://wsi01.sctslp.gob.mx/wcf/Dashboard/views/");
        }
    });
});

Highcharts.setOptions({
    lang: {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Nomviembre', 'Diciembre'],
        weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        shortMonths: ['En.', 'Febr.', 'Mzo.', 'Abr.', 'My.', 'Jun.', 'Jul.', 'Agto.', 'Sept.', 'Oct.', 'Nov.', 'Dic.']
    },
    colors: ['#00C853'],
    legend: false,
    credits: {
        enabled: false
    }
});

$("#btnAdmin").on('click', function(){
    $("#iframeMain").attr('src', 'graficas.html');
});

$("#btnReportes").on('click', function(){
    $("#iframeMain").attr('src', 'Reportes.html');
});

$("#btnMapeoRutas").on('click', function(){
    $("#iframeMain").attr('src', 'MapeoRutas.html');
});