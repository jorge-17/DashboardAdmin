(function (a){
    a(window.jQuery, window, document);
}(function ($, window, document) {
    var datos;
    var resultado;
    var resultadoP;
    var arrayP = [];
    //@jrodarte Declaración de URL y metodos
    var rootURL;
    var urlDasboard;
    function getConfig() {
        $.getJSON("../js/config_Dashboard.json", function (data) {
            var ambiente = data['ambiente_Server'];
            rootURL = data[ambiente];
            sessionStorage.setItem("rootURL", rootURL);
            var ambienteD = data['ambiente_Dashboard'];
            urlDasboard = data[ambienteD];
            sessionStorage.setItem("urlDashboard", urlDasboard);
        });
    }
    const autenticacion = "Autenticacion";
    const permisos = "ObtenerPermisos";
    const consultarPermisos = "ObtenerPermisosG";

    var validateFront = function () {
        if (true === $('#formLogin').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    async function  Login(){
        var user = $("#user").val();
        var pass = $("#pass").val();
        pass = md5(pass).substring(0, 20);

        try {
            resultado = await $.ajax({
                type: "POST",
                async: false,
                url: rootURL + autenticacion,
                data: JSON.stringify({
                    usuario: user,
                    password: pass
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
            if (item != "-0|") {
                var tokenS = item.split("|");
                sessionStorage.setItem('token', tokenS[0]);
                sessionStorage.setItem('NombreU', tokenS[1]);
                window.location.replace(urlDasboard + "home.html");
            } else {
                PNotify.notice({
                    title: 'Acceso incorrecto',
                    text: 'Verifique que las credenciales son correctas',
                    styling: 'bootstrap4',
                    delay: 5000
                });
            }
        });

        try {
            resultadoP = await $.ajax({
                type: "POST",
                async: false,
                url: rootURL + permisos,
                data: JSON.stringify({
                    usuario: user,
                    password: pass
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            });
        } catch (error) {
            console.log(error);
        }
        $.when(resultadoP).then(function (data) {
            const cPrefix = 'permit_';
            datos = JSON.parse(data.d);
            const arrayPer = [];
            const arrayRol = [];
            const arrarRolDes = [];
            const itemS = datos['aoData'];
            if (itemS != null) {
                //console.log(itemS);
                itemS.forEach(element => {
                    arrayPer.push(element["permiso"]);
                    arrayRol.push(element["rol"]);
                    arrarRolDes.push(element["des_rol"]);
                });
                arrayPer.forEach(element => {
                    $.cookie(cPrefix+ element, 1);
                });
                sessionStorage.setItem('permisos', arrayPer);
                sessionStorage.setItem('roles', arrayRol);
            } else {

            }
        });

        

        try {
            var result = await $.ajax({
                type: "POST",
                async: false,
                url: rootURL + consultarPermisos,
                data: JSON.stringify({
                    token: sessionStorage.getItem('token')
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
                arrayP.push(element["clavePer"]);
            });
            sessionStorage.setItem("perG", arrayP);
        });
    }

    $("#btnLogin").on('click', async function () {

        $('#formLogin').parsley().validate();
        validateFront();

        if (true === $('#formLogin').parsley().isValid()) {
            Login();
        }
    });
    $(window).on('load', function(){
        getConfig();
    });
}));


