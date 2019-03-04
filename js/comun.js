(function (a){
    a(window.jQuery, window, document);
}(function ($, window, document) {
    //console.log("Init...");
    //@jrodarte Declaración de URL y metodos
    const rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
    //const rootURL = "http://localhost:26010/Dashboard.svc/";
    const CerrarSesion = "CerrarSesion";
    const consultarRoles = "ObtenerRoles";
    const tokenSession = sessionStorage.getItem('token');
    const NombreUsuario = sessionStorage.getItem('NombreU');
    var resultado;
    const arrayR = [];
    $(window).on('load', async function () {
        try {
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
        permits: ['Admin', 'ARutas', 'A' +
        'Reportes', 'STramites']
    });
//Se establece el nombre del usuario que ingreso al dashboard
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
            const cPrefix = 'permit_';
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('permisos');
            sessionStorage.removeItem('NombreU');
            const arrRol = sessionStorage.getItem('roles');
            const arrayRol = arrRol.split(",");
            arrayRol.forEach(element => {
                if (element === "7") {
                    $.removeCookie(cPrefix + 'Admin');
                }
                if (element === "8") {
                    $.removeCookie(cPrefix + 'ARutas');
                }
                if (element === "9") {
                    $.removeCookie(cPrefix + 'AReportes');
                }
                if (element === "10") {
                    $.removeCookie(cPrefix + 'STramites');
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
                'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
            shortMonths: ['En.', 'Febr.', 'Mzo.', 'Abr.', 'My.', 'Jun.', 'Jul.', 'Agto.', 'Sept.', 'Oct.', 'Nov.', 'Dic.']
        },
        colors: ['#00C853'],
        legend: false,
        credits: {
            enabled: false
        }
    });

    var linkRepLeg = $("#repLeg");
    var linkTutor = $("#tutor");
    var linkAlbacea = $("#albacea");
    var linkBeneficiario = $("#beneficiario");

    linkRepLeg.on("click", function () {
        localStorage.setItem("tipoU", "3");
    });
    linkTutor.on("click", function () {
        localStorage.setItem("tipoU", "5");
    });
    linkAlbacea.on("click", function () {
        localStorage.setItem("tipoU", "6");
    });
    linkBeneficiario.on("click", function () {
        localStorage.setItem("tipoU", "4");
    });
}));

