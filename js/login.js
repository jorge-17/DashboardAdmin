var user;
var pass;
var datos;
var resultado;
var resultadoP;
//@jrodarte Declaración de URL y metodos
//var rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
var rootURL = "http://localhost:26010/Dashboard.svc/";
var autenticacion = "Autenticacion";
var permisos = "ObtenerPermisos";
$("#btnLogin").on('click', async function () {
    user = $("#user").val();
    pass = $("#pass").val();

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
        var cPrefix = 'permit_';
        datos = JSON.parse(data.d);
        var arrayPer = [];
        var arrayRol = [];
        var itemS = datos['aoData'];
        if (itemS != null) {
            console.log(itemS);
            itemS.forEach(element => {
                arrayPer.push(element["permiso"]);
                arrayRol.push(element["rol"]);
            });
            arrayRol.forEach(element => {
                if(element == 7){
                    $.cookie(cPrefix+'Admin', 1);
                }
                if(element == 8){
                    $.cookie(cPrefix+'ARutas', 1);
                }
                if(element == 9){
                    $.cookie(cPrefix+'AReportes', 1);
                }
                if(element == 10){
                    $.cookie(cPrefix+'STramites', 1);
                }
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
            window.location.replace("http://localhost/dashboard/views/home.html");
            //window.location.replace("https://wsi01.sctslp.gob.mx/wcf/Dashboard/views/home.html");
        } else {
            new PNotify({
                title: 'Datos incorrectos',
                text: 'Verifica que las credenciales sean correctas',
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });

});