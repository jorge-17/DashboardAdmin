(function (a){
    a(window.jQuery, window, document);
}(function ($, window, document) {
    //console.log("Init...");
    //@jrodarte Declaración de URL y metodos
    //const rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
    const rootURL = "http://localhost:26010/Dashboard.svc/";
    const consultarReporte1 = "ObtenerReporte1";
    const consultarReporte2 = "ObtenerReporte2";
    const consultarReportePF = "ReportePersonasFisicas";
    const consultarReporteConce = "ObtenerConcesionarios";
    const obtenerCiudades = "ConsultarCiudades";
    const tokenSession = sessionStorage.getItem('token');
    const fechaNow = new Date();
    const yearN = fechaNow.getFullYear();
    const monthN = fechaNow.getMonth();
    const dayN = fechaNow.getDate();
    var registrosRep = [];
    var registrosRep2 = [];
    var table1;
    var table2;
    var table3;
    var table4;
    var flagTbl1, flagTbl2 = false;
    var permisos = sessionStorage.getItem("permisos");
    var btns;
// $(window).on("load", function () {
//     $("#modSelDate").modal();
// });
    function paddingDates(date){
        const pad = "00";
        const str = "" + date;
        return pad.substring(0, pad.length - str.length) + str;
    }

    $("#dateRangePicker1").daterangepicker({
        "maxDate": (monthN + 1) + "/" + dayN + "/" + yearN,
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Limpiar'
        }
    });
    $("#dateRangePicker2").daterangepicker({
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
    async function cargaTablaReporte1() {
        $("#loader").show();
        $("#loader_bkg").show();
        const fechaRep1 = $("#dateRangePicker1").val();
        if (fechaRep1 !== "") {
            var dateRange = fechaRep1.split(" - ");
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
                    const fila = $("#tblReporteFila" + cont);
                    fila.append("<td>" + element['NumGafete'] + "</td>");
                    var arrayFechaT = element['FechaTramite'].split('T');
                    fila.append("<td>" + arrayFechaT[0] + "</td>");
                    fila.append("<td>" + element['MotivoIncompleto'] + "</td>");
                    fila.append("<td>" + element['Ubicacion'] + "</td>");
                    fila.append("<td>" + element['NombreCompleto'] + "</td>");
                    var arrayFechaN = element['FechaNacimiento'].split('T');
                    fila.append("<td>" + arrayFechaN[0] + "</td>");
                    fila.append("<td>" + element['Modalidad'] + "</td>");
                    fila.append("<td>" + element['Descripcion'] + "</td>");
                    fila.append("<td>" + element['AniosGafete'] + "</td>");
                    var arrayFechaTG = element['FechaExpedicionGafete'].split('T');
                    fila.append("<td>" + arrayFechaTG[0] + "</td>");
                    fila.append("<td>" + element['AniosLicencia'] + "</td>");
                    fila.append("<td>" + element['TipoLicencia'] + "</td>");
                    fila.append("<td>" + element['Nombre'] + "</td>");
                    fila.append("<td>" + element['IdLinea'] + "</td>");
                    fila.append("<td>" + element['Clave'] + "</td>");
                    fila.append("<td>" + element['LineaNombre'] + "</td>");
                    fila.append("<td>" + element['Concesiones'] + "</td>");
                    cont++;
                });

                table1 = $("#tablaReportes1").DataTable({
                    dom: 'Bfrtlip',
                    buttons: [
                        'excel'
                    ],
                    scrollX: true
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
                $("#loader").hide();
                $("#loader_bkg").hide();
            });
        }
    }

    async function cargaTablaReporte2() {
        $("#loader").show();
        $("#loader_bkg").show();
        const fechaRep2 = $("#dateRangePicker2 input").val();
        if (fechaRep2 !== "") {
            var dateRange = fechaRep2.split(" - ");
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
                    const fila = $("#tblReporteFila" + cont);
                    fila.append("<td>" + element['NoGafete'] + "</td>");
                    fila.append("<td>" + element['IdTramiteExpediente'] + "</td>");
                    var fechaTramite = element['FechaTramite'].split("-");
                    fila.append("<td>" + paddingDates(fechaTramite[2]) + "/" + paddingDates(fechaTramite[1]) + "/" + fechaTramite[0] + "</td>");
                    fila.append("<td>" + element['TramiteRealizado'] + "</td>");
                    var cadena;
                    element['AniosTipos'] == null ? cadena = "" : cadena = element['AniosTipos'].split("|")
                    if (tt < 6) {
                        const fechat = new Date(element['FechaTramite']);
                        if (cadena !== "") {
                            if (tt === 4 || tt === 5) {
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
                        fila.append("<td>" + anio + "</td>");
                        fila.append("<td>" + tipo[1] + "</td>");
                        fila.append("<td>" + fvl + "</td>");
                        fila.append("<td></td>");
                        fila.append("<td></td>");
                        fila.append("<td></td>");
                    } else {
                        if (cadena !== "") {
                            if (tt === 9 || tt === 10 || tt === 11) {
                                //variable temporar ya que año no esta en string a tratar
                                var anio = "";
                                //console.log(cadena);
                                var fechaV = cadena[0].split(",");
                                //console.log(fechaV[1]);
                                var dateVG = [];
                                dateVG[0] = fechaV[1];
                                dateVG[0] === "dd/MM/yyyy" ? dateVG[0] = "" : dateVG[0];
                                var anioV = fechaV[1].split("/");
                                //console.log(anioV[2]);
                                var fechaX = new Date(anioV[2], anioV[1], anioV[0]);
                                //var fvl = fechaX.getDate() + "/" + (fechaX.getMonth() + 1) + "/" + (fechaX.getFullYear());
                                var fvl = "";
                            } else {
                                var anios = cadena[0].split(",");
                                var anio = parseInt(anios[1]);
                                var Vgafete = [""];
                                if (cadena[1] !== undefined) var Vgafete = cadena[1].split(",");
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
                        fila.append("<td></td>");
                        fila.append("<td></td>");
                        fila.append("<td></td>");
                        fila.append("<td>" + anio + "</td>");
                        fila.append("<td>" + dateVG[0] + "</td>");
                        fila.append("<td>" + fvl + "</td>");
                    }
                    fila.append("<td>" + element['Nombres'] + "</td>");
                    fila.append("<td>" + element['ApellidoPaterno'] + "</td>");
                    fila.append("<td>" + element['ApellidoMaterno'] + "</td>");
                    var fToxi = element['FechaToxicologico'];
                    var valor;
                    if (fToxi[0] === undefined) {
                        var stringv = "";
                    } else {
                        valor = fToxi[0]["FechaExpedicion"];
                        if (valor == null) {
                            var stringv = "";
                        } else {
                            var arrValor = valor.split("T");
                            if (arrValor[0] === "1999-10-03") {
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
                    fila.append("<td>" + stringv + "</td>");
                    fila.append("<td>" + element['MunicipioAdscripcion'] + "</td>");
                    var valFN = element['FechaNacimiento'] === "//" ? "" : element["FechaNacimiento"];
                    fila.append("<td>" + valFN + "</td>");
                    fila.append("<td>" + element['Clave'] + "</td>");
                    fila.append("<td>" + element['Linea'] + "</td>");
                    fila.append("<td>" + element['Modalidad'] + "</td>");
                    fila.append("<td>" + element['Concesiones'] + "</td>");
                    fila.append("<td>" + element['Usuario'] + "</td>");
                    cont++;
                });

                if(permisos.includes("DSB003")){
                    btns = [
                        {
                            extend: 'excelHtml5',
                            title: 'Reporte Transparencia'
                        }
                    ];
                }else{
                    btns = [];
                }
                table2 = $("#tablaReportes2").DataTable({
                    dom: 'Bfrtlip',
                    buttons: btns,
                    scrollX: true
                });
                $(".dt-button").addClass("btn btn-info");

                flagTbl2 = true;
                table2.column(14).visible(false);
                table2.column(15).visible(false);
                table2.column(16).visible(false);
                table2.column(17).visible(false);
                table2.column(18).visible(false);
                table2.column(20).visible(false);
                $("#loader").hide();
                $("#loader_bkg").hide();
            });
            return resultado;
        }
    }

    async function cargaTablaReportePersonasFisicas(){
        $("#loader").show();
        $("#loader_bkg").show();
        const idModalidad = $("#selModalidades").val();
        if(idModalidad !== ""){
            var dataJson = JSON.stringify({
                token: tokenSession,
                idModalidad: idModalidad
            });
            var resultado;
            try{
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + consultarReportePF,
                    data: dataJson,
                    contentType: "application/json; charset=utf-8"
                });
            }catch (error) {
                console.log(error);
            }

            $.when(resultado).done(function(data){
                $("#tablaReportesPF thead").show();
                var datos = JSON.parse(data.d);
                var pFisicias = datos['aoData'];
                var cont = 0;
                pFisicias.forEach(element => {
                    var fila = $("<tr></tr>").attr("id", "tblReporPF" + cont);
                    $("#TblRepPFBody").append(fila);
                    fila.append("<td>" + element['Nombres'] + "</td>");
                    fila.append("<td>" + element['ApellidoPaterno'] + "</td>");
                    fila.append("<td>" + element['ApellidoMaterno'] + "</td>");
                    var sexo = element['Sexo'] === null ? "-" : element['Sexo'];
                    fila.append("<td>" + sexo + "</td>");
                    fila.append("<td>" + element['Descripcion'] + "</td>");
                    fila.append("<td>" + element['Nacionalidad'] + "</td>");
                    var curp = element['CURP'] === null ? "-" : element['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var rfc = element['RFC'] === null ? "-" : element['RFC'];
                    fila.append("<td>" + rfc + "</td>");
                    var calle = element['Calle'] === null ? "" : element['Calle'];
                    var noExt = element['NumeroExterior'] === null ? "" : element['NumeroExterior'];
                    var colonia = element['Colonia'] === null ? "" : element['Colonia'];
                    fila.append("<td>" + calle + " " + noExt + " " + colonia + "</td>");
                    fila.append("<td>" + element['noEconomico'] + "</td>");
                });
                if(permisos.includes("DSB003")){
                    btns = [
                        {
                            extend: 'excelHtml5',
                            title: 'Reporte Personas Fisicas'
                        }
                    ];
                }else{
                    btns = [];
                }
                table3 = $("#tablaReportesPF").DataTable({
                    dom: 'Bfrtlip',
                    buttons: btns
                });
                $("#loader").hide();
                $("#loader_bkg").hide();
            })
        }
    }


    async function cargaTablaReporteConcesionarios(){
        $("#loader").show();
        $("#loader_bkg").show();
        const idModalidad = $("#selModalidadesConce").val();
        const idCiudad = $("#selCiudades").val();
        if(idModalidad !== ""){
            var dataJson = JSON.stringify({
                token: tokenSession,
                idModalidad: idModalidad,
                MunAdscipcion : idCiudad
            });
            var resultado;
            try{
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + consultarReporteConce,
                    data: dataJson,
                    contentType: "application/json; charset=utf-8"
                });
            }catch (error) {
                console.log(error);
            }

            $.when(resultado).done(function(data){
                $("#tablaReportesConce thead").show();
                var datos = JSON.parse(data.d);
                var pFisicias = datos['aoData'];
                var cont = 0;
                pFisicias.forEach(element => {
                    var fila = $("<tr></tr>").attr("id", "tblReporteConce" + cont);
                    $("#TblRepConceBody").append(fila);
                    fila.append("<td>" + element['Nombres'] + "</td>");
                    fila.append("<td>" + element['ApellidoPaterno'] + "</td>");
                    fila.append("<td>" + element['ApellidoMaterno'] + "</td>");
                    var sexo = element['Sexo'] === null ? "-" : element['Sexo'];
                    if(sexo === "h"){
                        sexo = "Hombre";
                    }else if(sexo === "m"){
                        sexo = "Mujer";
                    }else{
                        sexo = "Otro"
                    }
                    fila.append("<td>" + sexo + "</td>");
                    fila.append("<td>" + element['EdoCivil'] + "</td>");
                    fila.append("<td>" + element['ClaveElector'] + "</td>");
                    fila.append("<td>" + element['Nacionalidad'] + "</td>");
                    var curp = element['CURP'] === null ? "-" : element['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var fechaNac = element['FechaNacimiento'] === null ? ["-"] : element['FechaNacimiento'].split("T");
                    var fN = fechaNac[0].split("-");
                    fila.append("<td>" + fN[2] +"/" + fN[1] + "/" + fN[0] + "</td>");
                    var ciudad = element['Nombre'] === null ? "" : element['Nombre'];
                    fila.append("<td>" + ciudad + "</td>");
                    var tipoCasa = element['Descripcion'] === null ? "" : element['Descripcion'];
                    fila.append("<td>" + tipoCasa + "</td>");
                    var noEconomico = element['IdSCT'] === null ? "" : element['IdSCT'];
                    fila.append("<td>" + noEconomico + "</td>");
                    var noConcesion = element['NoConcesion'] === null ? "" : element['NoConcesion'];
                    fila.append("<td>" + noConcesion + "</td>");
                });
                if(permisos.includes("DSB003")){
                    btns = [
                        {
                            extend: 'excelHtml5',
                            title: 'Reporte Concesionarios'
                        }
                    ];
                }else{
                    btns = [];
                }
                table4 = $("#tablaReportesConce").DataTable({
                    dom: 'Bfrtlip',
                    buttons: btns,
                    language: {
                        lengthMenu: "Mostrar _MENU_ concesionarios por pagina",
                        zeroRecords: "No se encontraros concesionarios",
                        info: "Mostrando pagina _PAGE_ de _PAGES_",
                        infoEmpty: "No se encontraros concesionarios",
                        infoFiltered: "(filtradas de _MAX_ total de concesionarios)",
                        paginate: {
                            first:      "Primero",
                            last:       "Último",
                            next:       "Siguiente",
                            previous:   "Anterior"
                        },
                        search:         "Buscar:",
                    }
                });
                $("#loader").hide();
                $("#loader_bkg").hide();
            })
        }
    }

    //carga combo ciudades
    async function cargaCiudades(idEstado){
        $("#selCiudades").empty().append('<option value="">Seleccione la ciudad</option>');
        //TODO funcionalidad de carga de ciudades en combos
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerCiudades,
                data: JSON.stringify({
                    token: tokenSession,
                    idEstado : idEstado
                }),
                contentType: "application/json; charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            totRegCR = datos['iRegistros'];
            setTimeout(function(){
                for (var i = 0; i < totRegCR; i++) {
                    const item = datos['aoData'][i];
                    const idCiudad = item['IdCiudad'];
                    const nombreCiudad = item['Nombre'];
                    $("#selCiudades").append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
                }
            }, 300);
        });
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

    $('#dateRangePicker2').on('apply.daterangepicker', function (ev, picker) {
        $('#dateRangePicker2 input').val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        if ($.fn.dataTable.isDataTable('#tablaReportes2')) {
            table2.destroy();
            $("#TblRep2Body").empty();
        }
        cargaTablaReporte2();
    });

    $("#selModalidades").on("change", function(){
        if ($.fn.dataTable.isDataTable('#tablaReportesPF')) {
            table3.destroy();
            $("#TblRepPFBody").empty();
        }                
        cargaTablaReportePersonasFisicas();
    });

    /*$("#selModalidadesConce").on("change", function(){
        if ($.fn.dataTable.isDataTable('#tablaReportesConce')) {
            table4.destroy();
            $("#TblRepConceBody").empty();
        }                
        cargaTablaReporteConcesionarios();
    });*/

    $("#selCiudades").on("change", function(){
        if ($.fn.dataTable.isDataTable('#tablaReportesConce')) {
            table4.destroy();
            $("#TblRepConceBody").empty();
        }                
        cargaTablaReporteConcesionarios();
    });

    $(window).on("load", function(){
        cargaCiudades(24);
    });

}));
