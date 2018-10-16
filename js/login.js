var user;
var pass;
var datos;

//@jrodarte Declaración de URL y metodos
//var rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
var rootURL = "http://localhost:26010/Dashboard.svc/";
var autenticacion = "Autenticacion";

$("#btnLogin").on('click', function(){    
    user = $("#user").val();
    pass = $("#pass").val();

    $.ajax({
        type: "POST",
        async: false,
        url: rootURL + autenticacion,
        data: JSON.stringify({
            usuario: user,
            password: pass
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, status) {   
            datos = JSON.parse(data.d);
            var item = datos['aoData'];
            if (item != null) {
                //console.log("Success...");
                sessionStorage.setItem('token', item);
                window.location.replace("http://localhost/dashboard/views/admin.html");
                //window.location.replace("https://wsi01.sctslp.gob.mx/wcf/Dashboard/views/admin.html");
            } else {
                new PNotify({
                    title: 'Datos incorrectos',
                    text: 'Verifica que las credenciales sean correctas',
                    type: 'error',
                    styling: 'bootstrap3'
                });
            }
        }
    });
});