(function (a){
    a(window.jQuery, window, document);
}(function ($, window, document) {
    var datos;
    var resultado;
    var resultadoP;
    var arrayP = [];
    //@jrodarte Declaración de URL y metodos
    const rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
    //const rootURL = "http://localhost:26010/Dashboard.svc/";
    const autenticacion = "Autenticacion";
    const permisos = "ObtenerPermisos";
    const consultarPermisos = "ObtenerPermisosG";
    $("#btnLogin").on('click', async function () {
        var user = $("#user").val();
        var pass = $("#pass").val();
        //pass = md5(pass).substring(0, 20);

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
                    /*if(element === 7){
                        $.cookie(cPrefix+'Admin', 1);
                    }
                    if(element === 8){
                        $.cookie(cPrefix+'ARutas', 1);
                    }
                    if(element === 9){
                        $.cookie(cPrefix+'AReportes', 1);
                    }
                    if(element === 10){
                        $.cookie(cPrefix+'STramites', 1);
                    }*/
                });
                sessionStorage.setItem('permisos', arrayPer);
                sessionStorage.setItem('roles', arrayRol);
            } else {

            }
        });

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
            if (item != null) {
                var tokenS = item.split("|");
                sessionStorage.setItem('token', tokenS[0]);
                sessionStorage.setItem('NombreU', tokenS[1]);
                //window.location.replace("http://localhost/dashboard/views/home.html");
                window.location.replace("https://wsi01.sctslp.gob.mx/wcf/Dashboard/views/home.html");
            } else {
                new PNotify({
                    title: 'Datos incorrectos',
                    text: 'Verifica que las credenciales sean correctas',
                    type: 'error',
                    styling: 'bootstrap3'
                });
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

    });
}));


