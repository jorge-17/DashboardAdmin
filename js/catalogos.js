(function (a) {
    a(window.jQuery, window, document);
}(function ($, window, document) {

    var tablaCat = $("#tablaCatalogos");
    var etiquetas = [], arrayIdDocumentos = [];
    var tablaPF, tablaCatalogos;
    var idPrestador = "";
    var idConsecion;
    var tipoUstring = localStorage.getItem("tipoUstring");
    var tipoU = localStorage.getItem("tipoU");
    var ciu_noEco = [];
    //@jrodarte Declaración de URL y metodos
    var rootURL = sessionStorage.getItem("rootURL");
    var urlDashboard = sessionStorage.getItem("urlDashboard");
    var obtenerTiposU = "ObtenerTiposUsuarios";
    var obtenerPF = "ObtenerPersonasFisicas";
    var BorrarRelacionCon = "BorrarRelacionConcesiones";
    var GuardartPF = "GuardarPersonaFisica";
    var GuardarPFfile = "GuardarPersonaFisicaFile";
    var GuardartConce = "GuardarConcesionario";
    var ObtenerCamposForm = "ObtenerCamposFromulario";
    var tokenSession = sessionStorage.getItem('token');
    var obtenerNomTitilar = "ObtenerNombreTitular";
    var obtenerCiudades = "ConsultarCiudades";
    var obtenerEstados = "ConsultarEstados";
    var obtenerNoEconomicos = "ObtenerNoEconomicoCiudad";
    var obtenerIdDocumentos = "ObtenerIdDocumentos";
    var notice;

    var validateFront = function () {
        if (true === $('#formDiv').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
            $(".alertaVali").hide();
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            $(".alertaVali").show();
            $("#loader_conce").hide();
            $("#loader_bkg_conce").hide();
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
            }
        });
    }

    function guardarConcesionario(ev) {
        ev.preventDefault();
        var tipoU = localStorage.getItem("tipoU");
        var idPrestadorSer = $("#psInput").val() === "" ? "0" : $("#psInput").val();
        var nombres = $("#NombreDG" + tipoUstring).val();
        var apellidoP = $("#ApellidoPDG" + tipoUstring).val();
        var apellidoM = $("#ApellidoMDG" + tipoUstring).val();
        var sexo = $("#SexoDG" + tipoUstring).val();
        var edoCivil = $("#EdoCivilDG" + tipoUstring).val() === "" ? "8" : $("#EdoCivilDG" + tipoUstring).val();
        var nacionalidad = $("#NacionalidadDG" + tipoUstring).val();
        var curp = $("#curpDG" + tipoUstring).val();
        var correoE = $("#emailDG" + tipoUstring).val();
        var calle = $("#CalleDC" + tipoUstring).val();
        var noExt = $("#NoExtDC" + tipoUstring).val();
        var noInt = $("#NoIntDC" + tipoUstring).val();
        var colonia = $("#ColoniaDC" + tipoUstring).val();
        var tipoCasa = tipoU === "3" && $("#TipoViCD" + tipoUstring).val() !== "" ? $("#TipoViCD" + tipoUstring).val() : "6";
        var telefono = $("#TelCD" + tipoUstring).val();
        var noEconomico = $("#NoEcoCD" + tipoUstring).val();
        var codigoPostal = $("#codigoPDC" + tipoUstring).val();
        var observa = $("#obserCD" + tipoUstring).val();
        var claveEle = $("#claveEleDG" + tipoUstring).val();
        var rfc = $("#rfcDG" + tipoUstring).val();
        var tipoPer = $("#TipoPerDG" + tipoUstring).val();
        var fechaNac = $("#FechaNacDG" + tipoUstring).val();
        var cdNac = $("#CdNacLN" + tipoUstring).val();
        var cdDom = $("#CdDomDC" + tipoUstring).val();
        var telParLada = $("#telParLadaCD" + tipoUstring).val();
        var telParNum = $("#telParNumCD" + tipoUstring).val();
        var telParExt = $("#telParExtCD" + tipoUstring).val();
        var telCelLada = $("#telCelLadaCD" + tipoUstring).val();
        var telCelNum = $("#telCelNumCD" + tipoUstring).val();
        var munAds = $("#MunAdsCD" + tipoUstring).val();
        var noConce = $("#NoConceCD" + tipoUstring).val();
        var fechaConce = $("#FechaConceCD" + tipoUstring).val();
        var noConceAnt = $("#NoConceAntCD" + tipoUstring).val();
        var idModalidad = $("#ModalidadCD" + tipoUstring).val();
        var justi = $("#JustiCD" + tipoUstring).val() !== "" ? $("#JustiCD" + tipoUstring).val() : "";


        var dataJson = JSON.stringify({
            token: tokenSession,
            idPrestadorServicio: idPrestadorSer,
            nombresPF: nombres,
            apellidoPPF: apellidoP,
            apellidoMPF: apellidoM,
            sexoPF: sexo,
            edoCivilPF: edoCivil,
            nacionalidadPF: nacionalidad,
            curpPF: curp,
            correoEPF: correoE,
            callePS: calle,
            noExtPS: noExt,
            noIntPS: noInt,
            coloniaPS: colonia,
            tipoCasaPF: tipoCasa,
            telefonoPS: telefono,
            noEconomicoRC: noEconomico,
            codigoPostalPS: codigoPostal,
            observaRC: observa,
            claveElePF: claveEle,
            rfcPS: rfc,
            tipoUPF: tipoU,
            tipoPerPS: tipoPer,
            FechaNacPF: fechaNac,
            cdNacPF: cdNac,
            cdDomPS: cdDom,
            telParLadaPS: telParLada,
            telParNumPS: telParNum,
            telParExtPS: telParExt,
            telCelLadaPS: telCelLada,
            telCelNumPS: telCelNum,
            munAdsPS: munAds,
            noConce: noConce,
            fechaConce: fechaConce,
            noConceAnt: noConceAnt,
            idModalidad: idModalidad,
            justificacion: justi
        });
        var resultado;
        try {
            resultado = $.ajax({
                type: "POST",
                url: rootURL + GuardartConce,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        } catch (e) {
            console.log(e.message)
        }
        $.when(resultado).done(function (data) {
            var datos = JSON.parse(data.d);
            var info = datos == null ? "x0005" : datos['aoData'];
            //alert(info);            

            if (info === "x0001") {
                $("#loader_conce").hide();
                $("#loader_bkg_conce").hide();
                $("#MunAdsCD" + tipoUstring).addClass('parsley-error');
                $("#NoEcoCD" + tipoUstring).addClass('parsley-error');
                $("#MunAdsCD" + tipoUstring).focus();
                $("#NoEcoCD" + tipoUstring).focus();
                //Error x0001
                PNotify.notice({
                    title: 'Error',
                    text: 'No se puede guardar la relación que intentaste crear debido a que ese No. Económico ya existe es esa ciudad.',
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
                $("#loader_conce").hide();
                $("#loader_bkg_conce").hide();
                PNotify.notice({
                    title: 'Error',
                    text: 'No se puede guardar la relación que intentaste crear.',
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
            } else if (info === "x0005") {
                //Error x0005
                $("#loader_conce").hide();
                $("#loader_bkg_conce").hide();
                PNotify.notice({
                    title: 'Error',
                    text: 'No se puede crear la carpeta del expediente en el servidor.',
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
                $("#loader_conce").hide();
                $("#loader_bkg_conce").hide();
                PNotify.success({
                    title: 'Exito',
                    text: 'Se ha guardado la información correctamente.',
                    styling: 'bootstrap4',
                    delay: 5000
                });
                $("#modalLarge").modal('toggle');
                if ($.fn.dataTable.isDataTable('#tablaCatalogos')) {
                    tablaCatalogos.destroy();
                    $("#TblCatBodyConce").empty();
                }
                cargaTablaConcesionarios();
                //alert("Se ha guardado la informacion correctamente.");                
            }
        });
    }

    function guardarPersonaFisica(ev) {
        ev.preventDefault();
        //var formData = new FormData(document.getElementById("formDiv"));
        var tipoU = localStorage.getItem("tipoU");
        var idPrestadorSer = $("#psInput").val() === "" ? "0" : $("#psInput").val();
        var nombres = $("#Nombre" + tipoUstring).val();
        var apellidoP = $("#ApellidoP" + tipoUstring).val();
        var apellidoM = $("#ApellidoM" + tipoUstring).val();
        var sexo = $("#Sexo" + tipoUstring).val();
        var edoCivil = $("#EdoCivil" + tipoUstring).val() === "" ? "8" : $("#EdoCivil" + tipoUstring).val();
        var nacionalidad = $("#Nacionalidad" + tipoUstring).val();
        var curp = $("#curp" + tipoUstring).val();
        var correoE = $("#email" + tipoUstring).val();
        var calle = $("#Calle" + tipoUstring).val();
        var noExt = $("#NoExt" + tipoUstring).val();
        var noInt = $("#NoInt" + tipoUstring).val();
        var colonia = $("#Colonia" + tipoUstring).val();
        var tipoCasa = tipoU === "3" && $("#TipoVi" + tipoUstring).val() !== "" ? $("#TipoVi" + tipoUstring).val() : "6";
        var telefono = $("#Tel" + tipoUstring).val();
        var noEconomico = $("#NoEco" + tipoUstring).val();
        var noExpediente = ciu_noEco.find(obj => obj.IdSCT === noEconomico);
        var fechaNombra = $("#FechaNom" + tipoUstring).val();
        var codigoPostal = $("#codigoP" + tipoUstring).val();
        var observa = tipoU === "3" || tipoU === "4" ? $("#obser" + tipoUstring).val() : "";
        var claveEle = tipoU === "5" ? $("#claveEle" + tipoUstring).val() : "";
        var rfc = tipoU === "6" ? $("#rfc" + tipoUstring).val() : "";
        var ordenPrel;// = tipoU === "4" ? $("#OrdenPre" + tipoUstring).val() : "0";
        if (tipoU === "4") {
            for (var i = 1; i <= 3; i++) {
                if ($("#lblorPre" + i).hasClass("active")) {
                    ordenPrel = $("#orPre" + i).val();
                }
            }
        } else {
            ordenPrel = "0";
        }
        var CdConcesion = $("#CdConce" + tipoUstring).val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            idPrestadorServicio: idPrestadorSer,
            nombresPF: nombres,
            apellidoPPF: apellidoP,
            apellidoMPF: apellidoM,
            sexoPF: sexo,
            edoCivilPF: edoCivil,
            nacionalidadPF: nacionalidad,
            curpPF: curp,
            correoEPF: correoE,
            callePS: calle,
            noExtPS: noExt,
            noIntPS: noInt,
            coloniaPS: colonia,
            tipoCasaPF: tipoCasa,
            telefonoPS: telefono,
            noEconomicoRC: noExpediente.IdExpediente,
            FechaNombraRC: fechaNombra,
            codigoPostalPS: codigoPostal,
            observaRC: observa,
            claveElePF: claveEle,
            rfcPS: rfc,
            ordenPreRC: ordenPrel,
            tipoUPF: tipoU,
            CdConce: CdConcesion
        });
        var resultado;
        try {
            resultado = $.ajax({
                type: "POST",
                url: rootURL + GuardartPF,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        } catch (e) {
            console.log(e.message)
        }
        $.when(resultado).done(function (data) {
            var datos = JSON.parse(data.d);
            var info = datos['aoData'];
            //alert(info);            

            if (info === "x0003") {
                $("#CdConce" + tipoUstring).addClass('parsley-error');
                $("#NoEco" + tipoUstring).addClass('parsley-error');
                $("#CdConce" + tipoUstring).focus();
                $("#NoEco" + tipoUstring).focus();
                //Error x0003
                PNotify.notice({
                    title: 'Error',
                    text: 'No se puede guardar la relación que intentaste crear debido a que solo se puede tener una personalidad jurídica de este tipo por cada concesión.',
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
            } else {
                PNotify.success({
                    title: 'Exito',
                    text: 'Se ha guardado la información correctamente.',
                    styling: 'bootstrap4',
                    delay: 2000
                });
                $("#modalLarge").modal('toggle');
                if ($.fn.dataTable.isDataTable('#tablaCatalogos')) {
                    tablaCatalogos.destroy();
                    $("#TblCatBody").empty();
                }
                cargaTablaTipoUsuarios();
                $("#loader_conce").hide();
                $("#loader_bkg_conce").hide();
                //alert("Se ha guardado la informacion correctamente.");                
            }
        });
    }

    function guardarPersonaFisicaFile(ev) {
        ev.preventDefault();
        var idDocumento;
        var idDocuemntosArr = sessionStorage.getItem("idDocs");
        idDocuemntosArr = idDocuemntosArr.split(",");
        var formData = new FormData()
        var fileInput = $("#formDiv").find('input[type="file"]')
        for (var i = 0; i < fileInput.length; i++) {
            var file = fileInput[i];
            var idFile = file.id;
            if (idFile.includes("DocJuicioST")) {
                idDocumento = idDocuemntosArr[1];
            } else if (idFile.includes("DocJuicioSI")) {
                idDocumento = idDocuemntosArr[2];
            } else if (idFile.includes("DocPoderNotarial")) {
                idDocumento = idDocuemntosArr[0];
            } else if (idFile.includes("DocJuicioJV")) {
                idDocumento = idDocuemntosArr[3];
            }
            var data = file.files;
            for (var j = 0; j < data.length; j++) {
                formData.append(idDocumento, data[j]);
            }
        }
        var tipoU = localStorage.getItem("tipoU");
        var idPrestadorSer = $("#psInput").val() === "" ? "0" : $("#psInput").val();
        var nombres = $("#Nombre" + tipoUstring).val();
        var apellidoP = $("#ApellidoP" + tipoUstring).val();
        var apellidoM = $("#ApellidoM" + tipoUstring).val();
        var sexo = $("#Sexo" + tipoUstring).val();
        var edoCivil = $("#EdoCivil" + tipoUstring).val() === "" ? "8" : $("#EdoCivil" + tipoUstring).val();
        var nacionalidad = $("#Nacionalidad" + tipoUstring).val();
        var curp = $("#curp" + tipoUstring).val();
        var correoE = $("#email" + tipoUstring).val();
        var calle = $("#Calle" + tipoUstring).val();
        var noExt = $("#NoExt" + tipoUstring).val();
        var noInt = $("#NoInt" + tipoUstring).val();
        var colonia = $("#Colonia" + tipoUstring).val();
        var tipoCasa = tipoU === "3" && $("#TipoVi" + tipoUstring).val() !== "" ? $("#TipoVi" + tipoUstring).val() : "6";
        var telefono = $("#Tel" + tipoUstring).val();
        var noEconomico = $("#NoEco" + tipoUstring).val();
        var noExpediente = ciu_noEco.find(obj => obj.IdSCT === noEconomico);
        var fechaNombra = $("#FechaNom" + tipoUstring).val();
        var codigoPostal = $("#codigoP" + tipoUstring).val();
        var observa = tipoU === "3" || tipoU === "4" ? $("#obser" + tipoUstring).val() : "";
        var claveEle = tipoU === "5" ? $("#claveEle" + tipoUstring).val() : "";
        var rfc = tipoU === "6" ? $("#rfc" + tipoUstring).val() : "";
        var ordenPrel;// = tipoU === "4" ? $("#OrdenPre" + tipoUstring).val() : "0";
        if (tipoU === "4") {
            for (var i = 1; i <= 3; i++) {
                if ($("#lblorPre" + i).hasClass("active")) {
                    ordenPrel = $("#orPre" + i).val();
                }
            }
        } else {
            ordenPrel = "0";
        }
        var CdConcesion = $("#CdConce" + tipoUstring).val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            idPrestadorServicio: idPrestadorSer,
            nombresPF: nombres,
            apellidoPPF: apellidoP,
            apellidoMPF: apellidoM,
            sexoPF: sexo,
            edoCivilPF: edoCivil,
            nacionalidadPF: nacionalidad,
            curpPF: curp,
            correoEPF: correoE,
            callePS: calle,
            noExtPS: noExt,
            noIntPS: noInt,
            coloniaPS: colonia,
            tipoCasaPF: tipoCasa,
            telefonoPS: telefono,
            noEconomicoRC: noExpediente.IdExpediente,
            FechaNombraRC: fechaNombra,
            codigoPostalPS: codigoPostal,
            observaRC: observa,
            claveElePF: claveEle,
            rfcPS: rfc,
            ordenPreRC: ordenPrel,
            tipoUPF: tipoU,
            CdConce: CdConcesion
        });
        var resultado;
        try {
            resultado = $.ajax({
                type: "POST",
                url: rootURL + GuardartPF,
                data: dataJson,
                contentType: "application/json; charset=utf-8",
            });
        } catch (e) {
            console.log(e.message)
        }
        $.when(resultado).done(function (data) {
            var datos = JSON.parse(data.d);
            var info = datos['aoData'];
            console.log(info);
            var dataServ = info.split("_");
            var idPrestadorServicio = dataServ[1];
            //alert(info);

            if (info === "x0003") {
                $("#CdConce" + tipoUstring).addClass('parsley-error');
                $("#NoEco" + tipoUstring).addClass('parsley-error');
                $("#CdConce" + tipoUstring).focus();
                $("#NoEco" + tipoUstring).focus();
                //Error x0003
                PNotify.notice({
                    title: 'Error',
                    text: 'No se puede guardar la relación que intentaste crear debido a que solo se puede tener una personalidad jurídica de este tipo por cada concesión.',
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
                                        $("#loader_conce").hide();
                                        $("#loader_bkg_conce").hide();
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
            } else {
                $("#loader_conce").hide();
                $("#loader_bkg_conce").hide();
                PNotify.success({
                    title: 'Exito',
                    text: 'Se ha guardado la información correctamente.',
                    styling: 'bootstrap4',
                    delay: 2000
                });
                $("#modalLarge").modal('toggle');
                if ($.fn.dataTable.isDataTable('#tablaCatalogos')) {
                    tablaCatalogos.destroy();
                    $("#TblCatBody").empty();
                }
                cargaTablaTipoUsuarios();
                //alert("Se ha guardado la informacion correctamente.");
                formData.append("motivo", "");
                formData.append("token", sessionStorage.getItem("token"));
                formData.append("idPrestador", idPrestadorServicio);
                formData.append("idExpediente", noExpediente.IdExpediente);
                //formData.append("idDocumento", valuesArr[2]);
                formData.append("movimiento", "0");
                var resultadoFile;
                try {
                    resultadoFile = $.ajax({
                        type: "POST",
                        url: rootURL + GuardarPFfile,
                        data: formData,
                        contentType: false,
                        processData: false
                    });
                } catch (e) {
                    console.log(e.message)
                }
                $.when(resultadoFile).done(function (data) {
                    var datos = JSON.parse(data.d);
                    var info = datos['aoData'];
                    //alert(info);

                    if (info === "x0004") {
                        $("#MunAdsCD" + tipoUstring).addClass('parsley-error');
                        $("#NoEcoCD" + tipoUstring).addClass('parsley-error');
                        $("#MunAdsCD" + tipoUstring).focus();
                        $("#NoEcoCD" + tipoUstring).focus();
                        //Error x0004
                        PNotify.notice({
                            title: 'Error',
                            text: 'No se puede guardar el archivo que intentaste subir.',
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
                            text: 'No se puede guardar la relación que intentaste crear.',
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
                            text: 'Se ha guardado el archivo correctamente.',
                            styling: 'bootstrap4',
                            delay: 2000
                        });
                    }
                });
            }

        });
    }

    async function CargaNoEconomicos(idCiudad) {
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerNoEconomicos,
                data: JSON.stringify({
                    token: tokenSession,
                    IdCiudad: idCiudad
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
            ciu_noEco = datos['aoData'];
            for (var i = 0; i < totRegCR; i++) {
                var item = datos['aoData'][i];
                var idExpediente = item['IdExpediente'];
                var NoEconomico = item['IdSCT'];
                $('#noEconomicoList').append('<option>' + NoEconomico + '</option>');
            }
            $('#NoEco' + tipoUstring).attr("disabled", false);
        });
    }

    $("#formDivFooter").on("click", "#btnSaveData", function (ev) {
        $("#loader_conce").show();
        $("#loader_bkg_conce").show();
        $('#formDiv').parsley().validate();
        validateFront();

        if (true === $('#formDiv').parsley().isValid()) {
            if (tipoU === "3" || tipoU === "5" || tipoU === "6") {
                if (tipoU == "6") {
                    if ($("#DocJuicioST" + tipoUstring).val() == "" && $("#DocJuicioSI" + tipoUstring).val() == "") {
                        $("#DocJuicioST" + tipoUstring).addClass('parsley-error');
                        $("#DocJuicioSI" + tipoUstring).addClass('parsley-error');
                        $("#DocJuicioST" + tipoUstring).focus();
                        $("#DocJuicioSI" + tipoUstring).focus();
                        PNotify.notice({
                            title: 'Nota',
                            text: 'Es necesario adjuntar al menos un documento de los requeridos.',
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
                                                $("#loader_conce").hide();
                                                $("#loader_bkg_conce").hide();
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
                        var amValue = $("#ApellidoM" + tipoUstring).val();
                        if (amValue == "") {
                            $("#ApellidoM" + tipoUstring).addClass('parsley-error');
                            $("#ApellidoM" + tipoUstring).focus();
                            PNotify.notice({
                                title: 'Nota',
                                text: 'El campo de Apellido Materno esta vacío, ¿desea continuar el registro?',
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
                                                    guardarPersonaFisicaFile(ev);
                                                }
                                            },
                                            {
                                                text: 'Cancelar',
                                                primary: true,
                                                click: function (notice) {
                                                    notice.close();
                                                    $("#loader_conce").hide();
                                                    $("#loader_bkg_conce").hide();
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
                            guardarPersonaFisicaFile(ev);
                        }
                    }
                } else {
                    var amValue = $("#ApellidoM" + tipoUstring).val();
                    if (amValue == "") {
                        $("#ApellidoM" + tipoUstring).addClass('parsley-error');
                        $("#ApellidoM" + tipoUstring).focus();
                        PNotify.notice({
                            title: 'Nota',
                            text: 'El campo de Apellido Materno esta vacío, ¿desea continuar el registro?',
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
                                                guardarPersonaFisicaFile(ev);
                                            }
                                        },
                                        {
                                            text: 'Cancelar',
                                            primary: true,
                                            click: function (notice) {
                                                notice.close();
                                                $("#loader_conce").hide();
                                                $("#loader_bkg_conce").hide();
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
                        guardarPersonaFisicaFile(ev);
                    }
                }
            } else {
                var amValue = $("#ApellidoM" + tipoUstring).val();
                if (amValue == "") {
                    $("#ApellidoM" + tipoUstring).addClass('parsley-error');
                    $("#ApellidoM" + tipoUstring).focus();
                    PNotify.notice({
                        title: 'Nota',
                        text: 'El campo de Apellido Materno esta vacío, ¿desea continuar el registro?',
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
                                            guardarPersonaFisica(ev);
                                        }
                                    },
                                    {
                                        text: 'Cancelar',
                                        primary: true,
                                        click: function (notice) {
                                            notice.close();
                                            $("#loader_conce").hide();
                                            $("#loader_bkg_conce").hide();
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
                    guardarPersonaFisica(ev);
                }
            }
        }
    });

    $("#btnSaveDataCon").on("click", function (ev) {
        $("#loader_conce").show();
        $("#loader_bkg_conce").show();
        $('#formDiv').parsley().validate();
        validateFront();
        if (true === $('#formDiv').parsley().isValid()) {
            var amValue = $("#ApellidoMDG" + tipoUstring).val();
            if (amValue == "") {
                $("#ApellidoMDG" + tipoUstring).addClass('parsley-error');
                $("#ApellidoMDG" + tipoUstring).focus();
                PNotify.notice({
                    title: 'Nota',
                    text: 'El campo de Apellido Materno esta vacío, ¿desea continuar el registro?',
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
                                        guardarConcesionario(ev);
                                    }
                                },
                                {
                                    text: 'Cancelar',
                                    primary: true,
                                    click: function (notice) {
                                        notice.close();
                                        $("#loader_conce").hide();
                                        $("#loader_bkg_conce").hide();
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
                guardarConcesionario(ev);
            }
        }
    });


    function getEtiquetasForm() {
        $.getJSON("../js/labels.json", function (data) {
            $.each(data, function (key, val) {
                etiquetas.push(key + "_" + val);
            });
        });
    }

    //Agrega las ciudades a los combos
    function addCiudades(selector) {
        var selectorId = "#" + selector + tipoUstring;
        $(selectorId).empty().append('<option value=""></option>');
        arrCiudadesIDs = localStorage.getItem('arrCiudadesIDs');
        arrCiudadesIDs = arrCiudadesIDs.split(',');
        arrCiudadesNom = localStorage.getItem('arrCiudadesNom');
        arrCiudadesNom = arrCiudadesNom.split(',');
        setTimeout(function () {
            for (var i = 0; i < arrCiudadesIDs.length; i++) {
                var idCiudad = arrCiudadesIDs[i];
                var nombreCiudad = arrCiudadesNom[i];
                $(selectorId).append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
            }
        }, 500);
    }
    //carga combo estados
    async function cargaEstados() {
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerEstados,
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
            totRegCR = datos['iRegistros'];
            setTimeout(function () {
                for (var i = 0; i < totRegCR; i++) {
                    var item = datos['aoData'][i];
                    var idEstado = item['IdEstado'];
                    var nombreEstado = item['Nombre'];
                    $('#EdoNacLN' + tipoUstring).append('<option value="' + idEstado + '">' + nombreEstado + '</option>');
                    $('#EdoDomDC' + tipoUstring).append('<option value="' + idEstado + '">' + nombreEstado + '</option>');
                }
            }, 500);
        });
    }
    //carga combo ciudades
    async function cargaCiudades(idEstado, idSelector) {
        var selectorId = "#" + idSelector + tipoUstring;
        $(selectorId).empty().append('<option value=""></option>');
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerCiudades,
                data: JSON.stringify({
                    token: tokenSession,
                    idEstado: idEstado
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
            if (selectorId.includes('MunAdsCD') || selectorId.includes('CdConce')) {
                arrCiudadesNom = [];
                arrCiudadesIDs = [];
                for (var i = 0; i < totRegCR; i++) {
                    var item = datos['aoData'][i];
                    var idCiudad = item['IdCiudad'];
                    var nombreCiudad = item['Nombre'];
                    arrCiudadesNom.push(nombreCiudad);
                    arrCiudadesIDs.push(idCiudad);
                    localStorage.setItem('arrCiudadesNom', arrCiudadesNom);
                    localStorage.setItem('arrCiudadesIDs', arrCiudadesIDs);
                }
            } else {
                setTimeout(function () {
                    for (var i = 0; i < totRegCR; i++) {
                        var item = datos['aoData'][i];
                        var idCiudad = item['IdCiudad'];
                        var nombreCiudad = item['Nombre'];
                        $(selectorId).append('<option value="' + idCiudad + '">' + nombreCiudad + '</option>');
                    }
                }, 500);
            }
        });
    }
    //Genera de forma automatica el formulario dependiendo del tipo de usuario que sea
    async function generateForm(idPrestador, tipoU) {
        var dataJson = JSON.stringify({
            token: tokenSession,
            tipoU: tipoU
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + ObtenerCamposForm,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            })
        } catch (e) {
            console.log(e.message)
        }
        $.when(resultado).done(function (data) {
            var datos = JSON.parse(data.d);
            var campos = datos['aoData'];
            if (tipoU === "3" || tipoU === "5" || tipoU === "6") {
                $("#formDiv").attr("enctype", "multipart/form-data");
            }
            var psFG = $("<div></div>").addClass("form-group col-md-6");
            var psL = $("<label></label>").addClass("control-label").attr("id", "lblpsInput").attr("for", "psInput").text("ID prestador servicio");
            var psDI = $("<div></div>");
            var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", "psInput").attr("disabled", true);
            var psidMun = $("<input>").addClass("form-control").attr("type", "text").attr("id", "idMunAds").attr("disabled", true);
            psidMun.hide();
            psDI.append(psI, psidMun);
            psFG.append(psL, psDI);
            $("#formDiv").append(psFG);
            campos.forEach(element => {
                var campo = element['IdConfiguracion'];
                var campoName = (campo.split("-"))[1];
                var idCampo = campoName.substr(0, campoName.length - 1);
                var lblCampo;
                for (var i = 0; i <= etiquetas.length; i++) {
                    var label = etiquetas[i].split("_");
                    var nomLabel = label[0] + "" + tipoUstring;
                    if (nomLabel == idCampo) {
                        lblCampo = label[1];
                        break;
                    }
                }
                if (campoName[campoName.length - 1] === "V") {
                    if (campoName.includes("Sexo")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-3");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIoptH = $("<option>Hombre</option>").attr("value", "h");
                        var seIoptM = $("<option>Mujer</option>").attr("value", "m");
                        var seIoptO = $("<option>Otros</option>").attr("value", "o");
                        psI.append(seIopt, seIoptH, seIoptM, seIoptO);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        tipoU === 7 ? $("#formDiv").append(salto, psFG) : $("#formDiv").append(psFG);
                    } else if (campoName.includes("TipoVi")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIopt1 = $("<option>Propia</option>").attr("value", "1");
                        var seIopt2 = $("<option>Rentada</option>").attr("value", "2");
                        var seIopt3 = $("<option>Padres</option>").attr("value", "3");
                        var seIopt4 = $("<option>Familia</option>").attr("value", "4");
                        var seIopt5 = $("<option>Otros</option>").attr("value", "5");
                        var seIopt6 = $("<option>No especificado</option>").attr("value", "6");
                        psI.append(seIopt, seIopt1, seIopt2, seIopt3, seIopt4, seIopt5, seIopt6);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("EdoCivil")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-3");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIopt1 = $("<option>Soltero(a)</option>").attr("value", "1");
                        var seIopt2 = $("<option>Casado(a)</option>").attr("value", "2");
                        var seIopt3 = $("<option>Divorciado(a)</option>").attr("value", "3");
                        var seIopt4 = $("<option>Separado(a)</option>").attr("value", "4");
                        var seIopt5 = $("<option>Viudo(a)</option>").attr("value", "5");
                        var seIopt6 = $("<option>Unión libre</option>").attr("value", "6");
                        var seIopt7 = $("<option>Concubino(a)</option>").attr("value", "7");
                        var seIopt8 = $("<option>No especificado</option>").attr("value", "8");
                        psI.append(seIopt, seIopt1, seIopt2, seIopt3, seIopt4, seIopt5, seIopt6, seIopt7, seIopt8);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("TipoPer")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-4");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIopt1 = $("<option>Persona Física</option>").attr("value", "1");
                        var seIopt2 = $("<option>Persona Moral</option>").attr("value", "2");
                        psI.append(seIopt, seIopt1, seIopt2);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("OrdenPre")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<div></div>").addClass("btn-group").attr("data-toggle", "buttons");
                        var lblop1 = $("<label></label>").addClass("btn btn-default").attr("for", "orPre1").text("1").attr("id", "lblorPre1");
                        var lblop2 = $("<label></label>").addClass("btn btn-default").attr("for", "orPre2").text("2").attr("id", "lblorPre2");
                        var lblop3 = $("<label></label>").addClass("btn btn-default").attr("for", "orPre4").text("3").attr("id", "lblorPre3");
                        var salto = $("<br>");
                        var radio1 = $("<input>").attr("type", "radio").attr("id", "orPre1").attr("value", "1");
                        lblop1.append(radio1);
                        var radio2 = $("<input>").attr("type", "radio").attr("id", "orPre2").attr("value", "2");
                        lblop2.append(radio2);
                        var radio3 = $("<input>").attr("type", "radio").attr("id", "orPre3").attr("value", "3");
                        lblop3.append(radio3);
                        psI.append(lblop1, lblop2, lblop3);
                        psDI.append(psI);
                        psFG.append(psL, salto, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("NoEco") && !campoName.includes("CD")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-4");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var intputList = $("<input type='number'>").attr("name", "noEconomico").attr("list", "noEconomicoList").addClass("form-control").attr("id", idCampo);
                        var psI2 = $("<datalist>").attr("id", "noEconomicoList").attr("disabled", true);
                        var seIopt = $("<option></option>").attr("value", "");
                        psI2.append(seIopt);
                        psDI.append(intputList, psI2);
                        psFG.append(psL, psDI);
                        var lblNombreTitular = $("<label></label>").attr("id", "lblNombreTitular");
                        psDI.append(lblNombreTitular);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("obser") || campoName.includes("Justi")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<textarea></textarea>").addClass("form-control").attr("type", "text").attr("id", idCampo).attr("maxlength", 150);
                        campoName.includes("Justi") == true ? psI.hide() && psL.hide() : psI.show() && psL.show();
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("NoExt") || campoName.includes("NoInt")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-3");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("Lada")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-1");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("Num")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-3");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("telParExt")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-2");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("CdNac") || campoName.includes("CdDom") || campoName.includes("CdConce")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        psI.append(seIopt);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("MunAdsCD")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-3");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("EdoNac") || campoName.includes("EdoDom")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-3");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIopt2 = $("<option>AGUASCALIENTES</option>").attr("value", "1");
                        var seIopt3 = $("<option>BAJA CALIFORNIA</option>").attr("value", "2");
                        var seIopt4 = $("<option>BAJA CALIFORNIA SUR</option>").attr("value", "3");
                        var seIopt5 = $("<option>CAMPECHE</option>").attr("value", "4");
                        var seIopt8 = $("<option>CHIAPAS</option>").attr("value", "7");
                        var seIopt9 = $("<option>CHIHUAHUA</option>").attr("value", "8");
                        var seIopt10 = $("<option>CIUDAD DE MÉXICO</option>").attr("value", "9");
                        var seIopt6 = $("<option>COAHUILA DE ZARAGOZA</option>").attr("value", "5");
                        var seIopt7 = $("<option>COLIMA</option>").attr("value", "6");
                        var seIopt11 = $("<option>DURANGO</option>").attr("value", "10");
                        var seIopt12 = $("<option>GUANAJUATO</option>").attr("value", "11");
                        var seIopt13 = $("<option>GUERRERO</option>").attr("value", "12");
                        var seIopt14 = $("<option>HIDALGO</option>").attr("value", "13");
                        var seIopt15 = $("<option>JALISCO</option>").attr("value", "14");
                        var seIopt16 = $("<option>MÉXICO</option>").attr("value", "15");
                        var seIopt31 = $("<option>MICHOACÁN</option>").attr("value", "16");
                        var seIopt17 = $("<option>MORELOS</option>").attr("value", "17");
                        var seIopt18 = $("<option>NAYARIT</option>").attr("value", "18");
                        var seIopt19 = $("<option>NUEVO LEÓN</option>").attr("value", "19");
                        var seIopt20 = $("<option>OAXACA</option>").attr("value", "20");
                        var seIopt21 = $("<option>PUEBLA</option>").attr("value", "21");
                        var seIopt22 = $("<option>QUERÉTARO</option>").attr("value", "22");
                        var seIopt23 = $("<option>QUINTANA ROO</option>").attr("value", "23");
                        var seIopt1 = $("<option>SAN LUIS POTOSÍ</option>").attr("value", "24");
                        var seIopt24 = $("<option>SINALOA</option>").attr("value", "25");
                        var seIopt25 = $("<option>SONORA</option>").attr("value", "26");
                        var seIopt26 = $("<option>TABASCO</option>").attr("value", "27");
                        var seIopt27 = $("<option>TAMAULIPAS</option>").attr("value", "28");
                        var seIopt28 = $("<option>TLAXCALA</option>").attr("value", "29");
                        var seIopt32 = $("<option>VERACRUZ</option>").attr("value", "30");
                        var seIopt29 = $("<option>YUCATÁN</option>").attr("value", "31");
                        var seIopt30 = $("<option>ZACATECAS</option>").attr("value", "32");
                        psI.append(seIopt, seIopt2, seIopt3, seIopt4, seIopt5, seIopt8, seIopt9, seIopt10, seIopt6, seIopt7, seIopt11,
                            seIopt12, seIopt13, seIopt14, seIopt15, seIopt16, seIopt31, seIopt17, seIopt18, seIopt19, seIopt20, seIopt21, seIopt22, seIopt23, seIopt1,
                            seIopt24, seIopt25, seIopt26, seIopt27, seIopt28, seIopt32, seIopt29, seIopt30);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("rfc") || campoName.includes("curp") || campoName.includes("claveEle")) {
                        var psFG = $("<div></div>").addClass("form-group row col-md-4");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("Modalidad")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIopt1 = $("<option>Registro de concesionario del transporte " +
                            "urbano de automóvil de alquiler de ruleteo</option>").attr("value", "19");
                        psI.append(seIopt, seIopt1, seIopt2);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("Doc")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "file").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else if (campoName.includes("Nacionalidad")) {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo).attr("value", "MEXICANA");
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    } else {
                        var psFG = $("<div></div>").addClass("form-group col-md-6");
                        var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                        var psDI = $("<div></div>");
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        $("#formDiv").append(psFG);
                    }
                } else if (campoName[campoName.length - 1] === "O") {
                    $("#" + idCampo).attr("required", true);
                    $("#lbl" + idCampo).text(lblCampo + "*");
                }
            });

            //$("#formDiv").append(divDG, divLN, divDC, divCD);
            var alertValidation = $("<div>Complete los campos obligatorios</div>").addClass("alert alert-danger col-md-12 alertaVali").attr("role", "alert");
            //var btnGuardar = $("<input>").attr("value", "Guardar datos").attr("type", "submit").attr("form", "formDiv").attr("id", "").addClass("btn btn-success col-md-12")
            $("#formDiv").append(alertValidation/*, btnGuardar*/);
            $("#FechaNom" + tipoUstring).datetimepicker({
                format: 'DD/MM/YYYY',
                defaultDate: new Date(),
                locale: 'es'
            });
            $("#FechaConceCD" + tipoUstring).datetimepicker({
                format: 'DD/MM/YYYY',
                defaultDate: new Date(),
                locale: 'es'
            });
            $("#FechaNacDG" + tipoUstring).datetimepicker({
                format: 'DD/MM/YYYY',
                locale: 'es'
            })
        });
    }
    //Carga la informacion de la Persona Fisica y Concesiones en el fomutario de edicion
    /*Params:
    idPrestador - Id del prestador de servicio del que se conulstara la info
    tipoUsua - */
    async function cargaInfocConcesionPFConce(idPrestador, tipoUsua, controlID, ConcesionExist, idExpediente) {
        var uri;
        var dataJson;
        //Valida si se carga solo informacion de persona fisica o de personalidades juridicas
        if (controlID === "btnAgregarPFCon") {
            uri = rootURL + obtenerPF
            dataJson = JSON.stringify({
                token: tokenSession,
                textoBus: "",
                idPrestadorServicio: idPrestador
            });
        } else if (controlID === "btnContinuarConce") {
            uri = rootURL + obtenerPF
            dataJson = JSON.stringify({
                token: tokenSession,
                textoBus: "",
                idPrestadorServicio: idPrestador
            });
        } else {
            uri = rootURL + obtenerTiposU
            dataJson = JSON.stringify({
                token: tokenSession,
                tipoU: tipoUsua,
                textoBus: idExpediente
            });
        }

        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: uri,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            }).done(function (data, jqXHR) {
                var datos = JSON.parse(data.d);
                var usuario = datos['aoData'];
                setTimeout(function () {
                    //Validacion en caso de que ya tenga registrada una concesion el PrestadorServicio
                    if (ConcesionExist == true) {
                        $("#JustiCD" + tipoUstring).show();
                        $("#lblJustiCD" + tipoUstring).show()
                    } else {
                        $("#JustiCD" + tipoUstring).hide();
                        $("#lblJustiCD" + tipoUstring).hide();
                        $("#JustiCD" + tipoUstring).attr("required", false);
                    }
                    var ap, am, nom, calle, col, numE, numI, tel, cu, curp, rfc, claveEle;
                    var ce, se, nac, tp, fechaNac, fechaNom, ladaTP, extTP, ladaTC, telTC;
                    $("#psInput").val(idPrestador);
                    usuario[0]['TipoPersona'] == null ? tp = "0" : tp = usuario[0]['TipoPersona'];
                    $("#TipoPerDG" + tipoUstring).val(parseInt(tp)).attr("disabled", true);
                    usuario[0]['ApellidoPaterno'] == null ? ap = "" : ap = usuario[0]['ApellidoPaterno'];
                    $("#ApellidoPDG" + tipoUstring).val(ap);
                    usuario[0]['ApellidoMaterno'] == null ? am = "" : am = usuario[0]['ApellidoMaterno'];
                    $("#ApellidoMDG" + tipoUstring).val(am);
                    usuario[0]['Nombres'] == null ? nom = "" : nom = usuario[0]['Nombres'];
                    $("#NombreDG" + tipoUstring).val(nom);
                    usuario[0]['Nacionalidad'] == null ? nac = "" : nac = usuario[0]['Nacionalidad'];
                    $("#NacionalidadDG" + tipoUstring).val(nac)
                    usuario[0]['FechaNacimiento'] == null ? fechaNac = [""] : fechaNac = usuario[0]['FechaNacimiento'].split("T");
                    $("#FechaNacDG" + tipoUstring).val(fechaNac[0]);
                    usuario[0]['Calle'] == null ? calle = "" : calle = usuario[0]['Calle'];
                    $("#CalleDC" + tipoUstring).val(calle);
                    usuario[0]['Colonia'] == null ? col = "" : col = usuario[0]['Colonia'];
                    $("#ColoniaDC" + tipoUstring).val(col);
                    usuario[0]['NumeroExterior'] == null ? numE = "" : numE = usuario[0]['NumeroExterior'];
                    $("#NoExtDC" + tipoUstring).val(numE);
                    usuario[0]['NumeroInterior'] == null ? numI = "" : numI = usuario[0]['NumeroInterior'];
                    $("#NoIntDC" + tipoUstring).val(numI);
                    usuario[0]['ladaTP'] == null ? ladaTP = "" : ladaTP = usuario[0]['ladaTP'];
                    $("#telParLadaCD" + tipoUstring).val(ladaTP);
                    usuario[0]['numTP'] == null ? tel = "" : tel = usuario[0]['numTP'];
                    $("#telParNumCD" + tipoUstring).val(tel);
                    usuario[0]['extTP'] == null ? extTP = "" : extTP = usuario[0]['extTP'];
                    $("#telParExtCD" + tipoUstring).val(extTP);
                    usuario[0]['ladaTC'] == null ? ladaTC = "" : ladaTC = usuario[0]['ladaTC'];
                    $("#telCelLadaCD" + tipoUstring).val(ladaTC);
                    usuario[0]['numTC'] == null ? telTC = "" : telTC = usuario[0]['numTC'];
                    $("#telCelNumCD" + tipoUstring).val(telTC);
                    usuario[0]['CURP'] == null ? curp = "" : curp = usuario[0]['CURP'];
                    $("#curpDG" + tipoUstring).val(curp);
                    usuario[0]['RFC'] == null ? rfc = "" : rfc = usuario[0]['RFC'];
                    $("#rfcDG" + tipoUstring).val(rfc);
                    usuario[0]['ClaveElector'] == null ? claveEle = "" : claveEle = usuario[0]['ClaveElector'];
                    $("#claveEleDG" + tipoUstring).val(claveEle);
                    usuario[0]['edoNac'] == null ? cu = "" : cu = usuario[0]['edoNac'];
                    $("#EdoNacLN" + tipoUstring).val(cu);
                    if (cu != "") {
                        cargaCiudades(cu[0], 'CdNacLN');
                    }
                    usuario[0]['edoDom'] == null ? edoD = "" : edoD = usuario[0]['edoDom'];
                    $("#EdoDomDC" + tipoUstring).val(edoD);
                    if (edoD != "") {
                        cargaCiudades(edoD[0], 'CdDomDC');
                    }
                    usuario[0]['CorreoElectronico'] == null ? ce = "" : ce = usuario[0]['CorreoElectronico'];
                    $("#emailDG" + tipoUstring).val(ce);
                    usuario[0]['CodigoPostal'] == null ? cp = "" : cp = usuario[0]['CodigoPostal'];
                    $("#codigoPDC" + tipoUstring).val(cp);
                    usuario[0]['Sexo'] == null ? se = "" : se = usuario[0]['Sexo'];
                    $("#SexoDG" + tipoUstring).val(se);
                    usuario[0]['IdEstadoCivil'] == null ? se = "" : se = usuario[0]['IdEstadoCivil'];
                    $("#EdoCivilDG" + tipoUstring).val(se);
                    $("#NoEcoCD" + tipoUstring).val(usuario[0]['noEconomico']);
                    $("#NoConceCD" + tipoUstring).val(usuario[0]['NoConcesion']);
                    usuario[0]['FechaNombramiento'] == null ? fechaNom = [""] : fechaNom = usuario[0]['FechaNombramiento'].split("T");
                    $("#FechaConceCD" + tipoUstring).val(fechaNom[0]);
                    usuario[0]['IdTipoCasa'] == null ? se = "" : se = usuario[0]['IdTipoCasa'];
                    $("#TipoViCD" + tipoUstring).val(se);
                    usuario[0]['munNac'] == null ? cu = "" : cu = usuario[0]['munNac'];
                    setTimeout(function () {
                        $("#CdNacLN" + tipoUstring).val(usuario[0]['munNac']);
                        $("#CdDomDC" + tipoUstring).val(usuario[0]['munDom']);
                        $("#MunAdsCD" + tipoUstring).val(usuario[0]['IdCiudad']);
                    }, 800);
                    $("#idMunAds").val(usuario[0]['IdCiudad']);
                    $("#ModalidadCD" + tipoUstring).val(usuario[0]['IdModalidad']);
                    var valueJustificacion = usuario[0]['Justificacion'];
                    if (valueJustificacion != "" && valueJustificacion != undefined && valueJustificacion != null) {
                        $("#lblJustiCD" + tipoUstring).show()
                        $("#JustiCD" + tipoUstring).show();
                        $("#JustiCD" + tipoUstring).val(usuario[0]['Justificacion']);
                    }
                    $("#loader_conce").hide();
                    $("#loader_bkg_conce").hide();
                }, 500);
            });
        } catch (e) {
            console.log(e.message);
        }
    }
    //Carga la informacion de la Persona Fisica y Concesiones en el fomutario de edicion
    async function cargaInfocConcesionPF(idPrestador, tipoUsua) {
        var dataJson = JSON.stringify({
            token: tokenSession,
            tipoU: tipoUsua,
            textoBus: idPrestador
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerTiposU,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            }).done(function (data, jqXHR) {
                var datos = JSON.parse(data.d);
                var usuario = datos['aoData'];
                $("#noEconomicoList").empty();
                $("#noEconomicoList").append("<option value=''></option>");
                cargaCiudades(24, 'CdConce');
                setTimeout(function () {
                    CargaNoEconomicos(usuario[0]['IdCiudad']);
                }, 600);
                setTimeout(function () {
                    var ap, am, nom, calle, col, numE, numI, tel, cu, noE, fechaN;
                    var ce, se, nac;
                    $("#psInput").val(idPrestador);
                    usuario[0]['ApellidoPaterno'] == null ? ap = "" : ap = usuario[0]['ApellidoPaterno'];
                    $("#ApellidoP" + tipoUstring).val(ap);
                    usuario[0]['ApellidoMaterno'] == null ? am = "" : am = usuario[0]['ApellidoMaterno'];
                    $("#ApellidoM" + tipoUstring).val(am);
                    usuario[0]['Nombres'] == null ? nom = "" : nom = usuario[0]['Nombres'];
                    $("#Nombre" + tipoUstring).val(nom);
                    usuario[0]['Nacionalidad'] == null ? nac = "" : nac = usuario[0]['Nacionalidad'];
                    $("#Nacionalidad" + tipoUstring).val(nac);
                    usuario[0]['Calle'] == null ? calle = "" : calle = usuario[0]['Calle'];
                    $("#Calle" + tipoUstring).val(calle);
                    usuario[0]['Colonia'] == null ? col = "" : col = usuario[0]['Colonia'];
                    $("#Colonia" + tipoUstring).val(col);
                    usuario[0]['NumeroExterior'] == null ? numE = "" : numE = usuario[0]['NumeroExterior'];
                    $("#NoExt" + tipoUstring).val(numE);
                    usuario[0]['NumeroInterior'] == null ? numI = "" : numI = usuario[0]['NumeroInterior'];
                    $("#NoInt" + tipoUstring).val(numI);
                    usuario[0]['Telefono'] == null ? tel = "" : tel = usuario[0]['Telefono'];
                    $("#Tel" + tipoUstring).val(tel);
                    usuario[0]['CURP'] == null ? cu = "" : cu = usuario[0]['CURP'];
                    $("#curp" + tipoUstring).val(cu);
                    usuario[0]['CorreoElectronico'] == null ? ce = "" : ce = usuario[0]['CorreoElectronico'];
                    $("#email" + tipoUstring).val(ce);
                    usuario[0]['CodigoPostal'] == null ? cp = "" : cp = usuario[0]['CodigoPostal'];
                    $("#codigoP" + tipoUstring).val(cp);
                    usuario[0]['Sexo'] == null ? se = "" : se = usuario[0]['Sexo'];
                    $("#Sexo" + tipoUstring).val(se);
                    usuario[0]['IdEstadoCivil'] == null ? se = "" : se = usuario[0]['IdEstadoCivil'];
                    $("#EdoCivil" + tipoUstring).val(se);
                    switch (tipoUsua) {
                        case "3":
                            usuario[0]['IdTipoCasa'] == null ? se = "" : se = usuario[0]['IdTipoCasa'];
                            $("#TipoVi" + tipoUstring).val(se);
                            break;
                        case "4":
                            usuario[0]['OrdenPrelacion'] == null ? op = "" : op = usuario[0]['OrdenPrelacion'];
                            for (var i = 1; i <= 3; i++) {
                                if (op == i) {
                                    $("#lblorPre" + i).addClass("active");
                                    $("#orPre" + i).attr("checked", "true");
                                } else {
                                    $("#lblorPre" + i).removeClass("active");
                                    $("#orPre" + i).attr("checked", "false");
                                }
                            }
                            usuario[0]['Observaciones'] == null ? obs = "" : obs = usuario[0]['Observaciones'];
                            $("#obser" + tipoUstring).val(obs);
                            break;
                        case "5":
                            usuario[0]['ClaveElector'] == null ? se = "" : se = usuario[0]['ClaveElector'];
                            $("#claveEle" + tipoUstring).val(se);
                            break;
                        case "6":
                            usuario[0]['RFC'] == null ? se = "" : se = usuario[0]['RFC'];
                            $("#rfc" + tipoUstring).val(se);
                            break;
                    }

                    var fechaNom;
                    usuario[0]['FechaNombramiento'] == null ? fechaNom = [""] : fechaNom = usuario[0]['FechaNombramiento'].split("T");
                    $("#FechaNom" + tipoUstring).val(fechaNom[0]);
                    $("#CdConce" + tipoUstring).val(usuario[0]['IdCiudad']);
                    $("#NoEco" + tipoUstring).val(usuario[0]['noEconomico']);
                    if ($("#NoEco" + tipoUstring).val() !== "") {
                        setTimeout(function () {
                            cargaTitularConsecion();
                        }, 1000);
                    }
                    $("#lblNombreTitular").html("");
                }, 800);
            });
        } catch (e) {
            console.log(e.message)
        }


    }
    //Carga la informacion de la presona fisica en el formulario de agregar persona fisica a catalogo
    async function cargaInfoPersonaFisica(idPrestador, tipoUsua) {
        var dataJson = JSON.stringify({
            token: tokenSession,
            textoBus: "",
            idPrestadorServicio: idPrestador
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerPF,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        } catch (e) {
            console.log(e.message)
        }

        $.when(resultado).done(function (data) {
            var datos = JSON.parse(data.d);
            var usuario = datos['aoData'];
            setTimeout(function () {
                var ap, am, nom, calle, col, numE, tel, cu;
                var ce, se, nac;
                $("#psInput").val(idPrestador);
                usuario[0]['ApellidoPaterno'] == null ? ap = "-" : ap = usuario[0]['ApellidoPaterno'];
                $("#ApellidoP" + tipoUstring).val(ap);
                usuario[0]['ApellidoMaterno'] == null ? am = "-" : am = usuario[0]['ApellidoMaterno'];
                $("#ApellidoM" + tipoUstring).val(am);
                usuario[0]['Nombres'] == null ? nom = "-" : nom = usuario[0]['Nombres'];
                $("#Nombre" + tipoUstring).val(nom);
                usuario[0]['Nacionalidad'] == null ? nac = "-" : nac = usuario[0]['Nacionalidad'];
                $("#Nacionalidad" + tipoUstring).val(nac);
                usuario[0]['Calle'] == null ? calle = "-" : calle = usuario[0]['Calle'];
                $("#Calle" + tipoUstring).val(calle);
                usuario[0]['Colonia'] == null ? col = "-" : col = usuario[0]['Colonia'];
                $("#Colonia" + tipoUstring).val(col);
                usuario[0]['NumeroExterior'] == null ? numE = "-" : numE = usuario[0]['NumeroExterior'];
                $("#NoExt" + tipoUstring).val(numE);
                usuario[0]['Telefono'] == null ? tel = "-" : tel = usuario[0]['Telefono'];
                $("#Tel" + tipoUstring).val(tel);
                usuario[0]['CURP'] == null ? cu = "-" : cu = usuario[0]['CURP'];
                $("#curp" + tipoUstring).val(cu);
                usuario[0]['CorreoElectronico'] == null ? ce = "-" : ce = usuario[0]['CorreoElectronico'];
                $("#email" + tipoUstring).val(ce);
                usuario[0]['CodigoPostal'] == null ? ce = "-" : ce = usuario[0]['CorreoElectronico'];
                $("#codigoP" + tipoUstring).val(ce);
                usuario[0]['Sexo'] == null ? se = "-" : se = usuario[0]['Sexo'];
                $("#Sexo" + tipoUstring).val(se);
                usuario[0]['IdEstadoCivil'] == null ? se = "-" : se = usuario[0]['IdEstadoCivil'];
                $("#EdoCivil" + tipoUstring).val(se);
                switch (tipoUsua) {
                    case "3":
                        break;
                    case "4":
                        for (var i = 1; i <= 3; i++) {
                            $("#lblorPre" + i).removeClass("active");
                            $("#orPre" + i).attr("checked", "false");
                        }
                        break;
                    case "5":
                        break;
                    case "6":
                        break;
                }
            }, 500);
        })
    }
    //Carga las tablas de concesionarios
    async function cargaTablaConcesionarios() {
        var idTipoUsuario = localStorage.getItem("tipoU");
        var inputTexto = $("#inputBusqueda").val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            tipoU: idTipoUsuario,
            textoBus: inputTexto
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerTiposU,
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
            if (usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    $("#TblCatBodyConce").append("<tr id='tblCataUsuaRow" + contador + "'></tr>");
                    var fila = $("#tblCataUsuaRow" + contador);
                    fila.append("<td style='display:none'>" + usuario['IdPrestadorServicio'] + "</td>");
                    fila.append("<td style='display:none'>" + usuario['IdExpediente'] + "</td>");
                    fila.append("<td>" + usuario['noEconomico'] + "</td>");//Numero economico
                    fila.append("<td>" + usuario['NoConcesion'] + "</td>");
                    fila.append("<td>" + usuario['NombreCompleto'] + "</td>");
                    var fechaN = usuario['FechaNombramiento'] == null ? ["-"] : usuario['FechaNombramiento'].split("T");
                    fila.append("<td>" + fechaN[0] + "</td>");
                    fila.append("<td>" + usuario['MunAdscripcion'] + "</td>");
                    var curp = usuario['CURP'] == null ? "-" : usuario['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var rfc = usuario['RFC'] == null ? "-" : usuario['RFC'];
                    fila.append("<td>" + rfc + "</td>");
                    fila.append("<td><button id='btnAddConce" + contador + "' class='btn btn-success'><i class='fas fa-folder-plus'></i></button></td>")
                    fila.append("<td><button id='btnEditPJ" + contador + "' class='btn btn-warning'><i class='fas fa-edit'></i></button></td>")
                    fila.append("<td><button id='btnDeletePJ" + contador + "' class='btn btn-danger'><i class='fas fa-trash-alt'></i></button></td>")
                    var suspendido = usuario['Suspendido'];
                    if (suspendido == false) {
                        fila.append("<td><button id='btnSuspencion' class='permit permit-DSB015 btnSuspencion btn btn-success'><i class='fas fa-lock-open'></i></button></td>");
                    } else {
                        fila.append("<td><button id='btnActivacion' class='permit permit-DSB015 btnActivacion btn btn-danger'><i class='fas fa-lock'></i></button></td>");
                    }
                    fila.append("<td style='display: none;'>" + usuario['NombreModalidad'] + "</td>")
                    contador++;
                });
                tablaCatalogos = $("#tablaCatalogos").DataTable({
                    dom: 'p'
                });
            } else {
                PNotify.notice({
                    title: 'Nota',
                    text: 'La búsqueda no he regresado ningún resultado.',
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
            }
        });
    }
    //Carga las tablas de tipos de usuario
    async function cargaTablaTipoUsuarios() {
        var idTipoUsuario = localStorage.getItem("tipoU");
        var inputTexto = $("#inputBusqueda").val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            tipoU: idTipoUsuario,
            textoBus: inputTexto
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerTiposU,
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
            if(usuarios.length > 0){
                usuarios.forEach(usuario => {
                    $("#TblCatBody").append("<tr id='tblCataUsuaRow" + contador + "'></tr>");
                    var fila = $("#tblCataUsuaRow" + contador);
                    fila.append("<td style='display:none'>" + usuario['IdPrestadorServicio'] + "</td>");
                    fila.append("<td style='display:none'>" + usuario['IdExpediente'] + "</td>");
                    fila.append("<td>" + usuario['noEconomico'] + "</td>");
                    fila.append("<td>" + usuario['NombreCompleto'] + "</td>");
                    if (idTipoUsuario === "4") {
                        fila.append("<td>" + usuario['OrdenPrelacion'] + "</td>");
                    }
                    var curp = usuario['CURP'] == null ? "-" : usuario['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var fechaN = usuario['FechaNombramiento'] == null ? ["-"] : usuario['FechaNombramiento'].split("T");
                    fila.append("<td>" + fechaN[0] + "</td>");
                    fila.append("<td><button id='btnEditPJ" + contador + "' class='btn btn-warning'><i class='fas fa-edit'></i></button></td>")
                    fila.append("<td><button id='btnDeletePJ" + contador + "' class='btn btn-danger'><i class='fas fa-trash-alt'></i></button></td>")
                    contador++;
                });
                tablaCatalogos = $("#tablaCatalogos").DataTable({
                    dom: 'p'
                });
            }else{
                PNotify.notice({
                    title: 'Nota',
                    text: 'La búsqueda no he regresado ningún resultado.',
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
            }
        });
    }
    //Carga la tabla de personas fisicas
    async function cargaTablaPersonasFisica() {
        var inputTexto = $("#inputBusquedaPF").val();
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
                    url: rootURL + obtenerPF,
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
                    $("#TblPerFisBody").append("<tr id='tblPFRow" + contador + "'></tr>");
                    var fila = $("#tblPFRow" + contador);
                    fila.append("<td style='display: none;'>" + usuario['IdPrestadorServicio'] + "</td>")
                    fila.append("<td>" + usuario['NombreCompleto'] + "</td>");
                    var curp = usuario['CURP'] == null ? "-" : usuario['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var calle = usuario['Calle'] == null ? "" : usuario['Calle'];
                    var colonia = usuario['Colonia'] == null ? "" : usuario['Colonia'];
                    var numE = usuario['NumeroExterior'] == null ? "" : usuario['NumeroExterior'];
                    var numI = usuario['NumeroInterior'] == null ? "" : usuario['NumeroInterior'];
                    fila.append("<td>" + calle + " " + colonia + " " + numE + " " + numI + "</td>");
                    var idTipoInd = usuario['idTipoIndividuo'] == [] ? [0] : usuario['idTipoIndividuo'];
                    if (idTipoInd[0] == "7") {
                        if (tipoU == "7") {
                            var btnAddConce = $("<button><i class='fas fa-folder-plus'></i></button>").addClass("btn btn-success").attr("id", "btnNuevaConce");
                            var celdaBtnAdd = $("<td></td>");
                            celdaBtnAdd.append(btnAddConce);
                            fila.append(celdaBtnAdd);
                        } else {
                            fila.append("<td><span class='dot'></span></td>");
                        }
                    } else {
                        fila.append("<td></td>");
                    }
                    contador++;
                });


                tablaPF = $("#tablaPerFisicas").DataTable({
                    dom: 'p'
                });
                $("#btnNuevaPF").attr('disabled', false);
                $("#btnNuevaPFConce").attr('disabled', false);
            });
        }
    }
    //Caraga el nombre del titular de la consecion insertada
    async function cargaTitularConsecion() {
        var noEconomicoSelected = $("#NoEco" + tipoUstring).val();
        var idExpediente = ciu_noEco.find(obj => obj.IdSCT === noEconomicoSelected);
        if (idExpediente !== null) {
            var dataJson = JSON.stringify({
                token: tokenSession,
                idExpediente: idExpediente.IdExpediente
            });
            var resultado;
            try {
                resultado = await $.ajax({
                    type: "POST",
                    url: rootURL + obtenerNomTitilar,
                    data: dataJson,
                    contentType: "application/json; charset=utf-8"
                })
            } catch (e) {
                console.log(e.message)
            }

            $.when(resultado).done(function (data) {
                $("#lblNombreTitular").text("");
                var datos = JSON.parse(data.d);
                var usuario = datos['aoData'];
                $("#lblNombreTitular").text("Nombre del Concesionario: " + usuario[0]['NombreCompleto']);
            })
        }
    }
    //Evento de click donde se realiza la busqueda de una persona Juridica
    $("#btnBuscar").on("click", function () {
        if ($.fn.dataTable.isDataTable('#tablaCatalogos')) {
            tablaCatalogos.destroy();
            $("#TblCatBody").empty();
        }
        cargaTablaTipoUsuarios();
    });
    //Evento de click donde se realiza la busqueda de una persona Juridica
    $("#btnBuscarConce").on("click", function () {
        if ($.fn.dataTable.isDataTable('#tablaCatalogos')) {
            tablaCatalogos.destroy();
            $("#TblCatBodyConce").empty();
        }
        cargaTablaConcesionarios();
    });
    //Evento de click donde se muestra el modal donde se buscaran y/o agregaran personas fisicas y sus relaciones
    $("#btnNuevo").on("click", function () {
        $("#modalLarge").modal({ backdrop: 'static', keyboard: false });
        $("#formularioDiv").hide();
        $("#btnSaveData").hide();
        $("#btnSaveDataCon").hide();
        $(".btnSaveDataExpConce").hide();
        $("#fromularioNuevaPF").hide();
        $("#tablaPFdiv").show();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").show();
        $("#btnAgregarPFCon").show();
        $("#btnNuevaPF").show();
        $("#formSuspencion").hide();
    })
    //Evento de click donde realiza la busqueda dentro de las persona fisicas
    $("#btnBuscarPF").on("click", function () {
        if ($.fn.dataTable.isDataTable('#tablaPerFisicas')) {
            tablaPF.destroy();
            $("#TblPerFisBody").empty();
        }
        cargaTablaPersonasFisica();
    });
    //Evento de click donde se selecciona una persona fisica dentro de la tabla de personas fisicas
    $("#tablaPFdiv").on("click", "#tablaPerFisicas tr", function () {
        var idRow = $(this).attr("id");
        $("#tablaPerFisicas tr").css("background-color", "#FFFFFF");
        $(this).css("background-color", "#dedede");
        var child = $(this).children("td");
        idPrestador = child[0].innerText;
        $("#btnAgregarPF").attr("disabled", false);
        $("#btnAgregarPFCon").attr("disabled", false);
    });
    //Evento de click donde se muestra la informacion de la persona fisica seleccionada en el fomulario
    $("#btnAgregarPF").on("click", function () {
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnSaveData").show();
        $("#btnSaveDataCon").show();
        $("#fromularioNuevaPF").hide();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").show();
        $("#btnAgregarPF").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
            setTimeout(function(){
                addCiudades('CdConce');
            }, 300);
        }
        cargaInfoPersonaFisica(idPrestador, tipoUsua);
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
    });
    //Evento de click donde se muestra la informacion de la persona fisica seleccionada en el fomulario
    $("#btnAgregarPFCon").on("click", function () {
        $("#loader_conce").show();
        $("#loader_bkg_conce").show();
        var controlID = $(this).attr("id");
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnSaveData").show();
        $("#btnSaveDataCon").show();
        $("#fromularioNuevaPF").hide();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").show();
        $("#btnAgregarPFCon").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
            setTimeout(function(){
                addCiudades('MunAdsCD');
            },300);
        }
        cargaInfocConcesionPFConce(idPrestador, tipoUsua, controlID);
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
    });
    //Eevento de click donde regresa una pantalla antes de la actual
    $("#btnRegresarBPF").on("click", function () {
        $("#formularioDiv").hide();
        $("#tablaPFdiv").show();
        $("#fromularioNuevaPF").hide();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").show();
        $("#btnNuevaPF").show();
        $("#btnEditarPJ").hide();
    });
    //Evento de click donde muestra la informacion de la presona juridica para ser editada
    $("#TblCatBody").on("click", "tr .btn-warning", function (ev) {
        $("#modalLarge").modal({ backdrop: 'static', keyboard: false });
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").hide();
        $("#btnAgregarPFCon").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        idPrestador = child[0].innerText;
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
        }
        cargaInfocConcesionPF(idPrestador, tipoUsua);

        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
    });
    //Evento de click donde muestra la informacion de la presona juridica para ser editada
    $("#TblCatBodyConce").on("click", "tr .btn-warning", function (ev) {
        var controlID = $(this).attr("id");
        $("#modalLarge").modal('toggle');
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").hide();
        $("#btnAgregarPFCon").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        $("#formSuspencion").hide();
        $(".btnSaveDataExpConce").hide();
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        idPrestador = child[0].innerText;
        idConsecion = child[1].innerText;
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
        }
        cargaInfocConcesionPFConce(idPrestador, tipoUsua, controlID, undefined, idConsecion);
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
    });

    //Evento de click donde muestra la informacion de la presona juridica para ser editada
    $("#TblCatBodyConce").on("click", "tr .btn-success", function (ev) {
        var controlID = $(this).attr("id");
        $("#modalLarge").modal({ backdrop: 'static', keyboard: false });
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").hide();
        $("#btnAgregarPFCon").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        $("#formSuspencion").hide();
        $(".btnSaveDataExpConce").hide();
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        idPrestador = child[0].innerText;
        idConsecion = child[1].innerText;
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
        }
        cargaInfocConcesionPFConce(idPrestador, tipoUsua, 'btnAgregarPFCon', true);
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
    });
    //Evento de click donde se muestra el modal para la eliminacion de la relacion de PF y conceciones
    $("#TblCatBody").on("click", "tr .btn-danger", function () {
        $("#alertExito").hide();
        $("#alertError").hide();
        $("#alertNotiConcesion").hide();
        $("#alertDelete").show();
        $("#modalSmall").modal('toggle');
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        var nomPrestador = child[2].innerText;
        idPrestador = child[0].innerText;
        idConsecion = child[1].innerText;
        $("#nomUsuario").html(nomPrestador);
        var tipoUsua = localStorage.getItem("tipoU");
        var tipoUlabel = $("#tipoUlabel");
        switch (tipoUsua) {
            case "3":
                tipoUlabel.html("Representante Legal");
                break;
            case "4":
                tipoUlabel.html("Beneficiario");
                break;
            case "5":
                tipoUlabel.html("Tutores");
                break;
            case "6":
                tipoUlabel.html("Albacea");
                break;
        }
    });
    //Evento de click donde se muestra el modal para la eliminacion de la relacion de PF y conceciones
    $("#TblCatBodyConce").on("click", "tr .btn-danger", function () {
        if ($(this).attr("id") != "btnActivacion") {
            $("#alertExito").hide();
            $("#alertError").hide();
            $("#alertNotiConcesion").hide();
            $("#alertDelete").show();
            $("#modalSmall").modal('toggle');
            var parent = $(this).parent("td").parent("tr");
            var child = parent.children("td");
            var nomPrestador = child[4].innerText;
            idPrestador = child[0].innerText;
            idConsecion = child[1].innerText;
            $("#nomUsuario").html(nomPrestador);
            var tipoUlabel = $("#tipoUlabel");
            tipoUlabel.html("Concesionarios");
        }
    });

    $("#btnSuccess").on("click", function () {
        $("#modalSmall").modal('toggle');
        $("#alertExito").hide();
        $("#modalLarge").modal('toggle');
        $("#TblCatBody tr").remove();
        cargaTablaTipoUsuarios();
    })
    //Evento de click que elimina la relacion de la persona fisica y la consecion
    $("#btnElimitarPJConce").on("click", async function () {
        $("#modalSmall").modal('toggle');
        $("#alertDelete").hide();
        var tipoU = localStorage.getItem("tipoU");
        var dataJson = JSON.stringify({
            token: tokenSession,
            noE: idConsecion,
            idPrestador: idPrestador,
            idTipoUsuario: tipoU
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + BorrarRelacionCon,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        } catch (e) {
            console.log(e.message)
        }
        $.when(resultado).done(function (data) {
            //$("#modalSmall").modal('toggle');
            var datos = JSON.parse(data.d);
            var bandera = datos['aoData'];
            if (bandera == "true") {
                PNotify.success({
                    title: 'Eliminado',
                    text: 'Se ha eliminado correctamente la relación.',
                    styling: 'bootstrap4',
                    delay: 2000
                });
                $("#TblCatBodyConce tr").remove();
                cargaTablaConcesionarios();
            } else if (bandera == "x0006") {
                //Error x0006
                PNotify.error({
                    title: 'Error',
                    text: 'No se ha podido eliminar el expediente debido a que existen documentos asignados a este.',
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
            }
        })
    });
    //Evento de click que elimina la relacion de la persona fisica y la consecion
    $("#btnElimitarPJ").on("click", async function () {
        $("#modalSmall").modal('toggle');
        $("#alertDelete").hide();
        var tipoU = localStorage.getItem("tipoU");
        var dataJson = JSON.stringify({
            token: tokenSession,
            noE: idConsecion,
            idPrestador: idPrestador,
            idTipoUsuario: tipoU
        });
        var resultado;
        try {
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + BorrarRelacionCon,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        } catch (e) {
            console.log(e.message)
        }
        $.when(resultado).done(function (data) {
            PNotify.success({
                title: 'Eliminado',
                text: 'Se ha eliminado correctamente la relación.',
                styling: 'bootstrap4',
                delay: 2000
            });
            $("#TblCatBody tr").remove();
            cargaTablaTipoUsuarios();
        })
    });
    //Evento de click donde se abre el formulario para crear una nueva persona fisica y crear la relacion con concesiones
    $("#btnNuevaPF").on("click", function () {
        $("#formularioDiv").show();
        $("#btnSaveData").show();
        $("#btnSaveDataCon").show();
        $("#tablaPFdiv").hide();
        $("#btnAgregarPF").hide();
        $("#btnAgregarPFCon").hide();
        $("#btnRegresarBPF").show();
        $("#btnNuevaPF").hide();
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
            setTimeout(function(){
                addCiudades('CdConce');
            }, 300);
        }
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
    });
    //Evento de click donde se abre el formulario para crear una nueva persona fisica y crear la relacion con concesiones
    $("#btnNuevaPFConce").on("click", function () {
        $("#formularioDiv").show();
        $("#btnSaveData").show();
        $("#btnSaveDataCon").show();
        $("#tablaPFdiv").hide();
        $("#btnAgregarPF").hide();
        $("#btnAgregarPFCon").hide();
        $("#btnRegresarBPF").show();
        $("#btnNuevaPF").hide();
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#TipoPerDG" + tipoUstring).attr("disabled", false);
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
            setTimeout(function(){
                addCiudades('MunAdsCD');
            },300);
        }
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide()
        setTimeout(function () {
            $("#JustiCD" + tipoUstring).attr("required", false);
        }, 500);
    });
    //Evento de teclado donde se verifica si hay algun campo obligatorio si completar
    $("#formDiv").on("keydown", function () {
        if ($(".parsley-error").length === 0) {
            $(".alertaVali").hide();
        } else {
            $(".alertaVali").show();
        }
    });
    //Evento de quitar el foco en el campo del numero economico para mostrar el nombre del titular
    $("#formDiv").on("focusout", "#NoEco" + tipoUstring, function () {
        var tipoU = localStorage.getItem("tipoU");
        if ($("#NoEco" + tipoUstring).val() !== "") {
            cargaTitularConsecion();
        } else if ($("#NoEco" + tipoUstring).val() === "") {
            $("#lblNombreTitular").html("");
        }
    });

    $("#formDiv").on("change", "#EdoNacLN" + tipoUstring, function () {
        var idEdo = $(this).val();
        cargaCiudades(idEdo, "CdNacLN");
    });

    $("#formDiv").on("change", "#EdoDomDC" + tipoUstring, function () {
        var idEdo = $(this).val();
        cargaCiudades(idEdo, "CdDomDC");
    });

    $("#formDiv").on("change", "#CdConce" + tipoUstring, function () {
        var idCiudad = $(this).val();
        $("#NoEco" + tipoUstring).empty();
        $("#NoEco" + tipoUstring).append("<option value=''></option>");
        CargaNoEconomicos(idCiudad);
    });

    $("#tablaPFdiv").on("click", "#btnNuevaConce", function () {
        $("#modalSmall").modal('toggle');
        $("#alertNotiConcesion").show();
        $("#alertApellidoMaterno").hide();
    });

    $("#modalSmall").on("click", "#btnContinuarConce", function () {
        $("#modalSmall").modal('toggle');
        var controlID = "btnContinuarConce";
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnSaveData").show();
        $("#btnSaveDataCon").show();
        $("#fromularioNuevaPF").hide();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").show();
        $("#btnAgregarPFCon").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        $("#formDiv").find("input[type=text], select, input[type=number], textarea").val("");
        $("#lblNombreTitular").html("");
        for (var i = 1; i <= 3; i++) {
            $("#lblorPre" + i).removeClass("active");
            $("#orPre" + i).attr("checked", "false");
        }
        var tipoUsua = localStorage.getItem("tipoU");
        if ($("#formDiv").children().length === 0) {
            getEtiquetasForm();
            generateForm(idPrestador, tipoUsua);
        }
        cargaInfocConcesionPFConce(idPrestador, tipoUsua, controlID, true);
        $('#formDiv').parsley().reset();
        $(".alertaVali").hide();
    });

    $(".btnSaveDataExpConce").on("click", function () {
        $('.formDivExp').parsley().validate();
        validateFront();
        var values = localStorage.getItem("values");
        var valuesArr = values.split("_");

        if (true === $('.formDivExp').parsley().isValid()) {
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

                if (info === "x0004") {
                    $("#MunAdsCD" + tipoUstring).addClass('parsley-error');
                    $("#NoEcoCD" + tipoUstring).addClass('parsley-error');
                    $("#MunAdsCD" + tipoUstring).focus();
                    $("#NoEcoCD" + tipoUstring).focus();
                    //Error x0004
                    PNotify.notice({
                        title: 'Error',
                        text: 'No se puede guardar se puede guardar el archivo que intentaste subir.',
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
                } else if (info === "x0002") {
                    //Error x0002
                    PNotify.notice({
                        title: 'Error',
                        text: 'No se puede guardar la relación que intentaste crear.',
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
                    console.log(info);
                    PNotify.success({
                        title: 'Exito',
                        text: 'Se ha guardado la información correctamente.',
                        styling: 'bootstrap4',
                        delay: 2000
                    });
                    $("#TblCatBodyConce tr").remove();
                    cargaTablaConcesionarios();
                }
            });
        }
    });

    $(window).on('load', function () {
        var tipoU = localStorage.getItem("tipoU");
        if (tipoU !== "7") {
            cargaTablaTipoUsuarios();
            cargaCiudades('24', 'CdConce' + tipoUstring)

        } else {
            cargaTablaConcesionarios();
            cargaCiudades('24', 'MunAdsCD' + tipoUstring)
        }
        cargaIdDocumentos();
    });
}));
