var registrosRep = [];
var registrosRep2 = [];
var table1;
var table2;
var flagTbl1, flagTbl2 = false;
// $(window).on("load", function () {
//     $("#modSelDate").modal();
// });
function paddingDates(date){
    var pad = "00";
    var str = "" + date;
    var ans = pad.substring(0, pad.length - str.length) + str;
    return ans;
}

$("#dateRangePicker1").daterangepicker({
    "maxDate": (monthN + 1) + "/" + dayN + "/" + yearN,
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    }
});
$("#dateRangePicker2").daterangepicker({
    "maxDate": (monthN + 1) + "/" + dayN + "/" + yearN,
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    }
});
async function cargaTablaReporte1() {
    if ($("#dateRangePicker1").val() != "") {
        var dateRange = $("#dateRangePicker1").val().split(" - ");
        var dateInicial = dateRange[0];
        var dateFinal = dateRange[1];
        var dateFinalArr = dateFinal.split('/');
        var dataJson = JSON.stringify({
            token: tokenSession,
            fechaInit: dateInicial,
            fechaEnd: dateFinal
        });

        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarReporte1,
                data: dataJson,                
                contentType: "application/json; charset=utf-8"
            })
        } catch (error) {
            console.log(error);
        }

        $.when(resultado).then(function (data) {
            $("#tablaReportes1 thead").show();
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegRep = datos['iRegistros'];
            TotalRegistros = totRegRep;
            registrosRep = datos['aoData'];
            var cont = 0;
            registrosRep.forEach(element => {
                $("#TblRep1Body").append("<tr id='tblReporteFila" + cont + "'></tr>");
                $("#tblReporteFila" + cont).append("<td>" + element['NumGafete'] + "</td>");
                var arrayFechaT = element['FechaTramite'].split('T');
                $("#tblReporteFila" + cont).append("<td>" + arrayFechaT[0] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['MotivoIncompleto'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Ubicacion'] + "</td>");
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

            table1 = $("#tablaReportes1").DataTable({
                dom: 'Bfrtlip',
                buttons: [
                    'excel'
                ]
            });


            flagTbl1 = true;
            table1.column(2).visible(false);
            table1.column(3).visible(false);
            table1.column(5).visible(false);
            table1.column(8).visible(false);
            table1.column(9).visible(false);
            table1.column(10).visible(false);
            table1.column(11).visible(false);
            table1.column(12).visible(false);
            table1.column(13).visible(false);
            table1.column(14).visible(false);
            table1.column(15).visible(false);
            table1.column(16).visible(false);
        });
    }
}

async function cargaTablaReporte2() {
    if ($("#dateRangePicker2").val() != "") {
        var dateRange = $("#dateRangePicker2").val().split(" - ");
        var dateInicial = dateRange[0];
        var dateFinal = dateRange[1];
        var dateFinalArr = dateFinal.split('/');
        var dataJson = JSON.stringify({
            token: tokenSession,
            fechaInit: dateInicial,
            fechaEnd: dateFinal
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + consultarReporte2,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            $("#tablaReportes2 thead").show();
            resultado = data;
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegRep = datos['iRegistros'];
            TotalRegistros = totRegRep;
            registrosRep2 = datos['aoData'];
            var cont = 0;
            registrosRep2.forEach(element => {
                var tt = parseInt(element['IdTipoTramite']);

                $("#TblRep2Body").append("<tr id='tblReporteFila" + cont + "'></tr>");
                $("#tblReporteFila" + cont).append("<td>" + element['NoGafete'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['IdTramiteExpediente'] + "</td>");
                var fechaTramite = element['FechaTramite'].split("-");                
                $("#tblReporteFila" + cont).append("<td>" + paddingDates(fechaTramite[2]) + "/" + paddingDates(fechaTramite[1]) + "/" + fechaTramite[0] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['TramiteRealizado'] + "</td>");
                var cadena;
                element['AniosTipos'] == null ? cadena = "" : cadena = element['AniosTipos'].split("|")
                if (tt < 6) {
                    var fechat = new Date(element['FechaTramite']);
                    if (cadena != "") {
                        if (tt == 4 || tt == 5) {
                            var tipo = cadena[0].split(",");
                            var anio = "";
                            var fvl = "";
                        } else {
                            var anios = cadena[0].split(",");
                            var anio = parseInt(anios[1]);
                            var tipo = cadena[1].split(",");
                            var fvl = paddingDates(fechat.getDate()) + "/" + paddingDates(fechat.getMonth() + 1) + "/" + (fechat.getFullYear() + anio);
                        }
                    } else {
                        var anio = "";
                        var tipo = ["", ""];
                        var fvl = "";
                    }
                    $("#tblReporteFila" + cont).append("<td>" + anio + "</td>");
                    $("#tblReporteFila" + cont).append("<td>" + tipo[1] + "</td>");
                    $("#tblReporteFila" + cont).append("<td>" + fvl + "</td>");
                    $("#tblReporteFila" + cont).append("<td></td>");
                    $("#tblReporteFila" + cont).append("<td></td>");
                    $("#tblReporteFila" + cont).append("<td></td>");
                } else {
                    if (cadena != "") {
                        if (tt == 9 || tt == 10 || tt == 11) {
                            //variable temporar ya que año no esta en string a tratar
                            var anio = "";
                            //console.log(cadena);
                            var fechaV = cadena[0].split(",");
                            //console.log(fechaV[1]);
                            var dateVG = [];
                            dateVG[0] = fechaV[1];
                            dateVG[0] == "dd/MM/yyyy" ? dateVG[0] = "" : dateVG[0]
                            var anioV = fechaV[1].split("/");
                            //console.log(anioV[2]);
                            var fechaX = new Date(anioV[2], anioV[1], anioV[0]);
                            //var fvl = fechaX.getDate() + "/" + (fechaX.getMonth() + 1) + "/" + (fechaX.getFullYear());
                            var fvl = "";
                        } else {
                            var anios = cadena[0].split(",");
                            var anio = parseInt(anios[1]);
                            var Vgafete = [""];
                            if (cadena[1] != undefined) var Vgafete = cadena[1].split(",");
                            var dateVG = Vgafete[1].split(" ");
                            var anioV = dateVG[0].split("/");
                            var fechaX = new Date(anioV[2], anioV[1], anioV[0]);
                            var fvl = anioV[0] + "/" + (anioV[1]) + "/" + (parseInt(anioV[2]) - anio);
                        }
                    } else {
                        var anio = "";
                        var dateVG = [""];
                        var fvl = "";
                    }
                    $("#tblReporteFila" + cont).append("<td></td>");
                    $("#tblReporteFila" + cont).append("<td></td>");
                    $("#tblReporteFila" + cont).append("<td></td>");
                    $("#tblReporteFila" + cont).append("<td>" + anio + "</td>");
                    $("#tblReporteFila" + cont).append("<td>" + dateVG[0] + "</td>");
                    $("#tblReporteFila" + cont).append("<td>" + fvl + "</td>");
                }
                $("#tblReporteFila" + cont).append("<td>" + element['Nombres'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['ApellidoPaterno'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['ApellidoMaterno'] + "</td>");
                var fToxi = element['FechaToxicologico'];
                var valor;
                if (fToxi[0] == undefined) {
                    var stringv = "";
                } else {
                    valor = fToxi[0]["FechaExpedicion"];
                    if (valor == null) {
                        var stringv = "";
                    } else {
                        var arrValor = valor.split("T");
                        if (arrValor[0] == "1999-10-03") {
                            var stringv = "";
                        } else {
                            valor = arrValor[0].split("-");
                            //var d = new Date(valor[0],valor[1],valor[2]);
                            var stringv = valor[2] + "/" + valor[1] + "/" + valor[0];
                            //var stringv = d.setDate((d.getDate()-90));
                            //var stringv = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
                        }
                    }
                }
                $("#tblReporteFila" + cont).append("<td>" + stringv + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['MunicipioAdscripcion'] + "</td>");
                var valFN = element['FechaNacimiento'] == "//" ? "" : element["FechaNacimiento"];
                $("#tblReporteFila" + cont).append("<td>" + valFN + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Clave'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Linea'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Modalidad'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Concesiones'] + "</td>");
                $("#tblReporteFila" + cont).append("<td>" + element['Usuario'] + "</td>");
                cont++;
            });
            table2 = $("#tablaReportes2").DataTable({
                dom: 'Bfrtlip',
                buttons: [
                    'excel'
                ]
            });

            flagTbl2 = true;
            table2.column(14).visible(false);
            table2.column(15).visible(false);
            table2.column(16).visible(false);
            table2.column(17).visible(false);
            table2.column(18).visible(false);
            table2.column(20).visible(false);
        });
        return resultado;
    }
}

/** Seleccion de rango de fechas para reportes R1 y R2 */
$('input[name="dateRangePicker1"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    if ($.fn.dataTable.isDataTable('#tablaReportes1')) {
        table1.destroy();
        $("#TblRep1Body").empty();
    }
    cargaTablaReporte1();
});

$('input[name="dateRangePicker2"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    if ($.fn.dataTable.isDataTable('#tablaReportes2')) {
        table2.destroy();
        $("#TblRep2Body").empty();
    }
    cargaTablaReporte2();
});
