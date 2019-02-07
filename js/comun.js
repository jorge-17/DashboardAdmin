//@jrodarte Declaración de URL y metodos
var rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
//var rootURL = "http://localhost:26010/Dashboard.svc/";
var TramitesDia = "ConsultarTramitesDia";
var TramitesDiaUpdate = "ConsultarTramitesDiaUpdate";
var TramitesHorario = "ConsultarTramitesHorario";
var TramitesDiaLast30 = "ConsultarTramitesLast30";
var CerrarSesion = "CerrarSesion";
var TramitesHorarioxDia = "ConsultarTramitesHorarioxDia";
var mapRutas = "ConsultarRutas";
var ciudadesRutas = "ConsultarCiudades";
var guardarRutas = "GuardarRuta";
var actualizarRutas = "ActualizarRuta";
var consultarRutasId = "ConsultarRutaId";
var consultarTrazo = "ConsultarTrazo";
var consultarRutasUpdate = "ConsultarRutasUpdate";
var consultarModalidades = "ConsultarModalidades";
var consultarLineas = "ConsultarLineas";
var consultarReporte1 = "ObtenerReporte1";
var consultarReporte2 = "ObtenerReporte2";
var consultarRoles = "ObtenerRoles";
var tokenSession = sessionStorage.getItem('token');
var NombreUsuario = sessionStorage.getItem('NombreU');
var fechaNow = new Date();
var yearN = fechaNow.getFullYear();
var monthN = fechaNow.getMonth();
var dayN = fechaNow.getDate();
var resultado;
var arrayR = [];
$(window).on('load', async function(){
    try{
        var result = await $.ajax({
            type: "POST",
            url: rootURL + consultarRoles,
            data: JSON.stringify({
                token: tokenSession
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json"
        });
    } catch (error) {
        console.log(error);
    }
    $.when(result).then(function (data) {           
        var datos = JSON.parse(data.d);
        var itemData = datos['aoData']; 
        itemData.forEach(element => {
            arrayR.push(element["rol"]);
        });       
    });
});
//Roles establecidos para usuarios
$.permit({
    permits: ['Admin', 'ARutas', 'AReportes', 'STramites']
});
//Seestablece el nombre del usuario que ingreso al dashboard
$("#userName").append(NombreUsuario + '  <span class=" fa fa-angle-down"></span>');
//Se verifica si existe token de inicio de sesion, si no se encuentra se expulsa del dashboard
if (!sessionStorage.getItem('token')) {
    //window.location.replace("http://localhost/dashboard/views/");
    window.location.replace("https://wsi01.sctslp.gob.mx/wcf/Dashboard/views/");
}
//Funcionamiento del boton de Logout
$("#btnLogOut").on('click', async function () {    
    try {
        resultado = await $.ajax({
            type: "POST",
            url: rootURL + CerrarSesion,
            data: JSON.stringify({
                token: tokenSession
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json"
        });
    } catch (error) {
        console.log(error);
    }
    $.when(resultado).then(function () {           
        var cPrefix = 'permit_';
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('permisos');
        sessionStorage.removeItem('NombreU');
        var arrRol = sessionStorage.getItem('roles');
        var arrayRol = arrRol.split(",");
        arrayRol.forEach(element => {
            if(element == 7){
                $.removeCookie(cPrefix+'Admin');
            }
            if(element == 8){
                $.removeCookie(cPrefix+'ARutas');
            }
            if(element == 9){
                $.removeCookie(cPrefix+'AReportes');
            }
            if(element == 10){
                $.removeCookie(cPrefix+'STramites');
            }
        });        
        sessionStorage.removeItem('roles');
        //window.location.replace("http://localhost/dashboard/views/");
        window.location.replace("https://wsi01.sctslp.gob.mx/wcf/Dashboard/views/");
    });
});
//Opciones globales para graficas de tramites
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