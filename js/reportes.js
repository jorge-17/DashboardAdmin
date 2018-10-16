var registrosRep;
$(window).on("load", function () {
    cargaTablaReporte();
    /*$("#tablaReportes").DataTable({
        'order': [[0, 'asc']]
    });*/
});



function cargaTablaReporte() {
    $.getJSON({
        type: "POST",
        url: rootURL + consultarReporte,
        data: JSON.stringify({
            token: tokenSession
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegRep = datos['iRegistros'];
            TotalRegistros = totRegRep;
            console.log(TotalRegistros);
            registrosRep = datos['aoData'];
            console.log(registrosRep);
            var cont = 0;
            registrosRep.forEach(element => {
                $("#TblRepBody").append("<tr id='tblReporteFila" + cont + "'></tr>");
                $("#tblReporteFila" + cont).append("<td>" + element['IdTramiteExpediente'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['IdTipoTramite'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['IdExpediente'] + "</td>");
                var arrayFechaT = element['FechaTramite'].split('T');
                $("#tblReporteFila" + cont).append("<td>" + arrayFechaT + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['MotivoIncompleto'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Ubicacion'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['NumGafete'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['NombreCompleto'] + "</td>");
                var arrayFechaN = element['FechaNacimiento'].split('T');
                $("#tblReporteFila" + cont).append("<td>" + arrayFechaN[0] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Modalidad'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Descripcion'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['AniosGafete'] + "</td>");
                var arrayFechaTG = element['FechaExpedicionGafete'].split('T');
                $("#tblReporteFila" + cont).append("<td>" + arrayFechaTG[0] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['AniosLicencia'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['TipoLicencia'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Nombre'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['IdLinea'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Clave'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['LineaNombre'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Concesiones'] + "</td>");
                cont++;
            });
            var table = $("#tablaReportes").DataTable({
                'order': [[0, 'asc']],
                dom: 'Bfrtip',
                buttons: [
                     'excel', 'print'
                ]
            });
            table.column(1).visible(false);
            table.column(2).visible(false);
            table.column(4).visible(false);
            table.column(5).visible(false);
            table.column(8).visible(false);
            table.column(9).visible(false);
            table.column(10).visible(false);
            table.column(11).visible(false);
            table.column(12).visible(false);
            table.column(13).visible(false);
            table.column(14).visible(false);
            table.column(15).visible(false);
            table.column(16).visible(false);
            table.column(17).visible(false);
            table.column(18).visible(false);
            table.column(19).visible(false);
        },
        error: function () {
            $("#viewData").html("<p>Ocurrio un error</p>");
        }
    });
}
