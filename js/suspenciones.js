(function (a) {
    a(window.jQuery, window, document);
}(function ($, window, document) {
    //console.log("Init...");
    var arrayIdDocumentos = [];
    if (sessionStorage.getItem("idDocs") !== null) {
        var idDocuemntosArr = sessionStorage.getItem("idDocs");
        idDocuemntosArr = idDocuemntosArr.split(",");
    }
    //@jrodarte Declaración de URL y metodos
    const rootURL = sessionStorage.getItem("rootURL");
    const urlDashboard = sessionStorage.getItem("urlDashboard");
    const GuardarPFfile = "GuardarPersonaFisicaFile";
    const obtenerExpedientes = "ObtenerExpedientes";
    const obtenerIdDocumentos = "ObtenerIdDocumentos";
    const tokenSession = sessionStorage.getItem('token');
    const NombreUsuario = sessionStorage.getItem('NombreU');
    var resultado;
    var tablaOperadores;

    var validateFront = function (fromName) {
        if (true === $('.formDivExp').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
            $(".alertaVali").hide();
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            $(".alertaVali").show();
        }
    };

    async function cargaIdDocumentos(ev) {
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerIdDocumentos,
                data: JSON.stringify({
                    token: tokenSession
                }),
                contentType: "application/json; charset=utf-8",
            })
        } catch (error) {
            console.log(error);
        }
        $.when(resultado).then(function (data) {
            datos = JSON.parse(data.d);
            //Obtiene el total de registros retornados
            var datos = datos['aoData'];
            if (datos != null) {
                //console.log(itemS);
                datos.forEach(element => {
                    arrayIdDocumentos.push(element["Valor"]);
                });
                sessionStorage.setItem('idDocs', arrayIdDocumentos);
                var idDocuemntosArr = sessionStorage.getItem("idDocs");
                idDocuemntosArr = idDocuemntosArr.split(",");
            }
        });
    }

    async function cargaTablaOperadores() {
        $("#loader").show();
        $("#loader_bkg").show();
        var inputTexto = $("#inputBusqueda").val();
        if (inputTexto !== "") {
            var dataJson = JSON.stringify({
                token: tokenSession,
                textoBus: inputTexto,
                idPrestadorServicio: 0
            });
            var resultado;
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + obtenerExpedientes,
                    data: dataJson,
                    contentType: "application/json; charset=utf-8"
                });
            } catch (e) {
                console.log(e.message)
            }

            $.when(resultado).done(function (data) {
                var datos = JSON.parse(data.d);
                var usuarios = datos['aoData'];
                var contador = 0;
                usuarios.forEach(usuario => {
                    $("#tablaExpOperadores").append("<tr id='tblExOpRow" + contador + "'></tr>");
                    const fila = $("#tblExOpRow" + contador);
                    fila.append("<td style='display: none;'>" + usuario['IdExpediente'] + "</td>")
                    fila.append("<td style='display: none;'>" + usuario['IdPrestadorServicio'] + "</td>")
                    fila.append("<td>" + usuario['IdSCT'] + "</td>");
                    fila.append("<td>" + usuario['NombreCompleto'] + "</td>");
                    var fechaCreacion = usuario['FechaCreacion'] == null ? ["-"] : usuario['FechaCreacion'].split("T");
                    fila.append("<td>" + fechaCreacion[0] + "</td>");
                    var MunAds = usuario['MunAds'] == null ? "" : usuario['MunAds'];
                    fila.append("<td>" + MunAds[0] + "</td>");
                    var curp = usuario['CURP'] == null ? "-" : usuario['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var rfc = usuario['RFC'] == null ? "-" : usuario['RFC'];
                    fila.append("<td>" + rfc + "</td>");
                    var suspendido = usuario['Suspendido'];
                    if (suspendido == false) {
                        fila.append("<td><button id='btnSuspencion' class='btn btn-success'><i class='fas fa-lock-open'></i></button></td>");
                    } else {
                        fila.append("<td><button id='btnActivacion' class='btn btn-danger'><i class='fas fa-lock'></i></button></td>");
                    }
                    fila.append("<td style='display: none;'>" + usuario['ModalidadDesc'] + "</td>")
                    contador++;
                });
                tablaOperadores = $("#tablaExpOperadores").DataTable({
                    dom: 'p'
                });
            });

        }
        $("#loader").hide();
        $("#loader_bkg").hide();
    }

    $("#btnBuscarExp").on("click", function () {
        if ($.fn.dataTable.isDataTable('#tablaExpOperadores')) {
            tablaOperadores.destroy();
            $("#TblCatBodyExpOperadores").empty();
        }
        cargaTablaOperadores();
    });

    $("#tablaExpOperadores").on("click", "#btnSuspencion", function () {
        $("#loader").show();
        $("#loader_bkg").show();
        $(".formDivExp").find("input[type=file], textarea").val("");
        $("#modalLarge").modal({ backdrop: 'static', keyboard: false });
        $("#formularioDivExp").show();
        $(".lblMovimiento").html("Suspensión");
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        var idSCT = child[2].innerText;
        var modalidad = child[9].innerText;
        var nombre = child[3].innerText;
        var idPrestador = child[1].innerText;
        var idExpediente = child[0].innerText;
        var idDocumentoSuspencion = idDocuemntosArr[4];
        //var idDocumentoSuspencion = "00117";
        localStorage.setItem("values", idPrestador + "_" + idExpediente + "_" + idDocumentoSuspencion + "_" + 0);
        $("#lbl_IdSCT").html(idSCT);
        $("#lbl_Modalidad").html(modalidad);
        $("#lbl_nombre").html(nombre);
        $("#loader").hide();
        $("#loader_bkg").hide();
    });

    $("#tablaExpOperadores").on("click", "#btnActivacion", function () {
        $("#loader").show();
        $("#loader_bkg").show();
        $(".formDivExp").find("input[type=file], textarea").val("");
        $("#modalLarge").modal({ backdrop: 'static', keyboard: false });
        $("#formularioDivExp").show();
        $(".lblMovimiento").html("Activación");
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        var idSCT = child[2].innerText;
        var modalidad = child[9].innerText;
        var nombre = child[3].innerText;
        var idPrestador = child[1].innerText;
        var idExpediente = child[0].innerText;
        var idDocumentoActivacion = idDocuemntosArr[5];
        localStorage.setItem("values", idPrestador + "_" + idExpediente + "_" + idDocumentoActivacion + "_" + 1);
        $("#lbl_IdSCT").html(idSCT);
        $("#lbl_Modalidad").html(modalidad);
        $("#lbl_nombre").html(nombre);
        $("#loader").hide();
        $("#loader_bkg").hide();
    });

    $("#tablaCatalogos").on("click", ".btnSuspencion", function () {
        $("#loader").show();
        $("#loader_bkg").show();
        $(".formDivExp").find("input[type=file], textarea").val("");
        $("#formSuspencion").show();
        $("#tablaPFdiv").hide();
        $("#formularioDiv").hide();
        $("#fromularioNuevaPF").hide();
        $("#btnSaveDataCon").hide();
        $(".btnSaveDataExpConce").show();
        $(".lblMovimiento").html("Suspensión");
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        var idSCT = child[2].innerText;
        var modalidad = child[13].innerText;
        var nombre = child[4].innerText;
        var idPrestador = child[0].innerText;
        var idExpediente = child[1].innerText;
        var idDocumentoSuspencion = idDocuemntosArr[4];
        localStorage.setItem("values", idPrestador + "_" + idExpediente + "_" + idDocumentoSuspencion + "_" + 0);
        $(".lbl_IdSCT").html(idSCT);
        $(".lbl_Modalidad").html(modalidad);
        $(".lbl_nombre").html(nombre);
        $("#loader").hide();
        $("#loader_bkg").hide();
    });

    $("#tablaCatalogos").on("click", ".btnActivacion", function () {
        $("#loader").show();
        $("#loader_bkg").show();
        $(".formDivExp").find("input[type=file], textarea").val("");
        $("#modalLarge").modal({ backdrop: 'static', keyboard: false });
        $("#formularioDiv").hide();
        $("#btnSaveData").hide();
        $("#btnSaveDataCon").hide();
        $("#fromularioNuevaPF").hide();
        $("#tablaPFdiv").hide();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").hide();
        $("#btnAgregarPFCon").hide();
        $("#btnNuevaPF").hide();
        $("#formSuspencion").show();
        $(".btnSaveDataExpConce").show();
        $(".lblMovimiento").html("Activación");
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        var idSCT = child[2].innerText;
        var modalidad = child[13].innerText;
        var nombre = child[4].innerText;
        var idPrestador = child[0].innerText;
        var idExpediente = child[1].innerText;
        var idDocumentoActivacion = idDocuemntosArr[5];
        localStorage.setItem("values", idPrestador + "_" + idExpediente + "_" + idDocumentoActivacion + "_" + 1);
        $(".lbl_IdSCT").html(idSCT);
        $(".lbl_Modalidad").html(modalidad);
        $(".lbl_nombre").html(nombre);
        $("#loader").hide();
        $("#loader_bkg").hide();
    });

    $(".btnSaveDataExp").on("click", function () {
        $('.formDivExp').parsley().validate();
        validateFront();

        if (true === $('.formDivExp').parsley().isValid()) {
            //alert("valido");
            var values = localStorage.getItem("values");
            var valuesArr = values.split("_");
            $("#modalLarge").modal('toggle');
            var files = $("#fileupload").get(0).files;
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append(valuesArr[2], files[i]);
            }
            formData.append("motivo", $(".txt_motivo").val());
            formData.append("token", sessionStorage.getItem("token"));

            formData.append("idPrestador", valuesArr[0]);
            formData.append("idExpediente", valuesArr[1]);
            formData.append("movimiento", valuesArr[3]);
            var resultado;
            try {
                resultado = $.ajax({
                    type: "POST",
                    url: rootURL + GuardarPFfile,
                    data: formData,
                    contentType: false,
                    processData: false
                });
            } catch (e) {
                console.log(e.message)
            }
            $.when(resultado).done(function (data) {
                var datos = JSON.parse(data.d);
                var info = datos['aoData'];
                //alert(info);

                if (info === "x0004") {
                    //Error x0004
                    PNotify.notice({
                        title: 'Error',
                        text: 'No se puede guardar se puede guardar el archivo que intentaste subir',
                        styling: 'bootstrap4',
                        hide: false,
                        modules: {
                            Confirm: {
                                confirm: true,
                                buttons: [
                                    {
                                        text: 'Entendido',
                                        primary: true,
                                        click: function (notice) {
                                            notice.close();
                                        }
                                    }
                                ]
                            },
                            Buttons: {
                                closer: true
                            },
                            History: {
                                history: false
                            },
                        }
                    });
                    //alert("No se puede guardar la relacion que intentaste crear.");
                } else if (info === "x0002") {
                    //Error x0002
                    PNotify.notice({
                        title: 'Error',
                        text: 'No se puede guardar la relacion que intentaste crear ...',
                        styling: 'bootstrap4',
                        hide: false,
                        modules: {
                            Confirm: {
                                confirm: true,
                                buttons: [
                                    {
                                        text: 'Entendido',
                                        primary: true,
                                        click: function (notice) {
                                            notice.close();
                                        }
                                    }
                                ]
                            },
                            Buttons: {
                                closer: true
                            },
                            History: {
                                history: false
                            },
                        }
                    });
                } else {
                    PNotify.success({
                        title: 'Exito',
                        text: 'Se ha guardado la informacion correctamente.',
                        styling: 'bootstrap4',
                        delay: 2000
                    });
                    if ($.fn.dataTable.isDataTable('#tablaExpOperadores')) {
                        tablaOperadores.destroy();
                        $("#TblCatBodyExpOperadores").empty();
                    }
                    cargaTablaOperadores();
                }
            });
        }
    });

    $(window).on("load", function () {
        cargaIdDocumentos()
    });
}));

