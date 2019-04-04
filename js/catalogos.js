(function (a) {
    a(window.jQuery, window, document);
}(function ($, window, document) {
    var tablaCat = $("#tablaCatalogos");
    var etiquetas = [];
    var tablaPF;
    var idPrestador = "";
    var idConsecion;
    var tipoUstring = localStorage.getItem("tipoUstring");
    //@jrodarte Declaración de URL y metodos
    const rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
    //const rootURL = "http://localhost:26010/Dashboard.svc/";
    const obtenerTiposU = "ObtenerTiposUsuarios";
    const obtenerPF = "ObtenerPersonasFisicas";
    const BorrarRelacionCon = "BorrarRelacionConcesiones";
    const GuardartPF = "GuardarPersonaFisica";
    const ObtenerCamposForm = "ObtenerCamposFromulario";
    const tokenSession = sessionStorage.getItem('token');
    const obtenerNomTitilar = "ObtenerNombreTitular";

    var validateFront = function () {
        if (true === $('#formDiv').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
            $("#alertaVali").hide();
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            $("#alertaVali").show();
        }
    };

    function guardarPersonaFisica(ev) {
        ev.preventDefault();
        var tipoU = localStorage.getItem("tipoU");
        //TODO: Modificar los ID´s de los campos a agregar
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
            FechaNombraRC: fechaNombra,
            codigoPostalPS: codigoPostal,
            observaRC: observa,
            claveElePF: claveEle,
            rfcPS: rfc,
            ordenPreRC: ordenPrel,
            tipoUPF: tipoU
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

            if (info === "null") {
                $("#alertExito").hide();
                $("#alertDelete").hide();
                $("#alertError").show();
                $("#modalSmall").modal('toggle');
                //alert("No se puede guardar la relacion que intentaste crear.");
            } else {
                $("#alertDelete").hide();
                $("#alertError").hide();
                $("#alertExito").show();
                $("#modalSmall").modal('toggle');
                //alert("Se ha guardado la informacion correctamente.");                
            }
        });
    }

    $("#formDiv").on("click", "#btnSaveData", function (ev) {
        $('#formDiv').parsley().validate();
        validateFront();

        if (true === $('#formDiv').parsley().isValid()) {
            guardarPersonaFisica(ev);
        }
    });

    function getEtiquetasForm() {
        $.getJSON("../js/labels.json", function (data) {
            $.each(data, function (key, val) {
                etiquetas.push(key + "_" + val);
            });
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
            var psFG = $("<div></div>").addClass("form-group col-md-6");
            var psL = $("<label></label>").addClass("control-label").attr("id", "lblpsInput").attr("for", "psInput").text("ID prestador servicio");
            var psDI = $("<div></div>");
            var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", "psInput").attr("disabled", true);
            psDI.append(psI);
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
                    var psFG = $("<div></div>").addClass("form-group col-md-6");
                    var psL = $("<label></label>").addClass("control-label").attr("id", "lbl" + idCampo).attr("for", idCampo).text(lblCampo);
                    var psDI = $("<div></div>");
                    if (campoName.includes("Sexo")) {
                        var psI = $("<select>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        var seIopt = $("<option></option>").attr("value", "");
                        var seIoptH = $("<option>Hombre</option>").attr("value", "h");
                        var seIoptM = $("<option>Mujer</option>").attr("value", "m");
                        var seIoptO = $("<option>Otros</option>").attr("value", "o");
                        psI.append(seIopt, seIoptH, seIoptM, seIoptO);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                    } else if (campoName.includes("TipoVi")) {
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
                    } else if (campoName.includes("EdoCivil")) {
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
                    } else if (campoName.includes("OrdenPre")) {
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
                    } else if (campoName.includes("NoEco")) {
                        var psI = $("<input>").addClass("form-control").attr("type", "number").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                        if (tipoU === "4") {
                            var lblNombreTitular = $("<label></label>").attr("id", "lblNombreTitular");
                            psDI.append(lblNombreTitular);
                        }
                    } else if (campoName.includes("obser")) {
                        var psI = $("<textarea></textarea>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                    } else {
                        var psI = $("<input>").addClass("form-control").attr("type", "text").attr("id", idCampo);
                        psDI.append(psI);
                        psFG.append(psL, psDI);
                    }
                    $("#formDiv").append(psFG);
                } else if (campoName[campoName.length - 1] === "O") {
                    $("#" + idCampo).attr("required", true);
                    $("#lbl" + idCampo).text(lblCampo + "*");
                }
            });
            var alertValidation = $("<div>Complete los campos obligatorios</div>").addClass("alert alert-danger col-md-12").attr("role", "alert").attr("id", "alertaVali");
            var btnGuardar = $("<button>Guardar datos</button>").attr("id", "btnSaveData").addClass("btn btn-success col-md-12")
            $("#formDiv").append(alertValidation, btnGuardar);
            $("#FechaNom" + tipoUstring).datetimepicker({
                format: 'DD/MM/YYYY',
                defaultDate: new Date()
            });
        });
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
                    $("#NoEco" + tipoUstring).val(usuario[0]['IdConcesion']);
                    if ($("#NoEco" + tipoUstring).val() !== "" && tipoUsua === "4") {
                        cargaTitularConsecion();
                    }
                    var fechaNom;
                    usuario[0]['FechaNombramiento'] == null ? fechaNom = [""] : fechaNom = usuario[0]['FechaNombramiento'].split("T");
                    $("#FechaNom" + tipoUstring).val(fechaNom[0]);
                    $("#lblNombreTitular").html("");
                }, 500);
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
    //Carga las tablas de tipos de usuario
    async function cargaTablaTipoUsuarios() {
        const idTipoUsuario = localStorage.getItem("tipoU");
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
            usuarios.forEach(usuario => {
                $("#TblCatBody").append("<tr id='tblCataUsuaRow" + contador + "'></tr>");
                const fila = $("#tblCataUsuaRow" + contador);
                fila.append("<td style='display:none'>" + usuario['IdPrestadorServicio'] + "</td>");
                fila.append("<td>" + usuario['IdConcesion'] + "</td>");
                fila.append("<td>" + usuario['NombreCompleto'] + "</td>");
                var curp = usuario['CURP'] == null ? "-" : usuario['CURP'];
                fila.append("<td>" + curp + "</td>");
                var fechaN = usuario['FechaNombramiento'] == null ? ["-"] : usuario['FechaNombramiento'].split("T");
                fila.append("<td>" + fechaN[0] + "</td>");
                fila.append("<td><button id='btnEditPJ" + contador + "' class='btn btn-warning'><i class='fas fa-edit'></i></button></td>")
                fila.append("<td><button id='btnDeletePJ" + contador + "' class='btn btn-danger'><i class='fas fa-trash-alt'></i></button></td>")
                contador++;
            });
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
                    const fila = $("#tblPFRow" + contador);
                    fila.append("<td style='display: none;'>" + usuario['IdPrestadorServicio'] + "</td>")
                    fila.append("<td>" + usuario['NombreCompleto'] + "</td>");
                    var curp = usuario['CURP'] == null ? "-" : usuario['CURP'];
                    fila.append("<td>" + curp + "</td>");
                    var calle = usuario['Calle'] == null ? "" : usuario['Calle'];
                    var colonia = usuario['Colonia'] == null ? "" : usuario['Colonia'];
                    var numE = usuario['NumeroExterior'] == null ? "" : usuario['NumeroExterior'];
                    var numI = usuario['NumeroInterior'] == null ? "" : usuario['NumeroInterior'];
                    fila.append("<td>" + calle + " " + colonia + " " + numE + " " + numI + "</td>");
                    contador++;
                });


                tablaPF = $("#tablaPerFisicas").DataTable({
                    dom: 'p'
                })
            });
        }
    }
    //Caraga el nombre del titular de la consecion insertada
    async function cargaTitularConsecion() {
        var numConse = $("#NoEco" + tipoUstring).val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            idConsesion: numConse
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
    cargaTablaTipoUsuarios();
    //Evento de click donde se realiza la busqueda de una persona Juridica
    $("#btnBuscar").on("click", function () {
        $("#TblCatBody tr").remove();
        cargaTablaTipoUsuarios();

        //TODO:  Falta agregar la validacion en boton de nuevo en caso de no devolver ningun resultado

        /*if($("#TblCatBody tr").length == 0){
            $("#btnNuevo").attr('disabled', false);
        }else{
            $("#btnNuevo").attr('disabled', true);
        }*/
    });
    //Evento de click donde se muestra el modal donde se buscaran y/o agregaran personas fisicas y sus relaciones
    $("#btnNuevo").on("click", function () {
        $("#modalLarge").modal('toggle');
        $("#formularioDiv").hide();
        $("#fromularioNuevaPF").hide();
        $("#tablaPFdiv").show();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").show();
        $("#btnNuevaPF").show();
        $("#btnNuevaPF").hide();
        //formularioPJ.empty();
    })
    //Evento de click donde realiza la busqueda dentro de las persona fisicas
    $("#btnBuscarPF").on("click", function () {
        if ($.fn.dataTable.isDataTable('#tablaPerFisicas')) {
            tablaPF.destroy();
            $("#TblPerFisBody").empty();
        }
        cargaTablaPersonasFisica();
        if ($("#TblPerFisBody tr").length == 0) {
            $("#btnNuevaPF").attr('disabled', false);
        } else {
            $("#btnNuevaPF").attr('disabled', true);
        }
    });
    //Evento de click donde se selecciona una persona fisica dentro de la tabla de personas fisicas
    $("#tablaPFdiv").on("click", "#tablaPerFisicas tr", function () {
        var idRow = $(this).attr("id");
        $("#tablaPerFisicas tr").css("background-color", "#FFFFFF");
        $(this).css("background-color", "#dedede");
        var child = $(this).children("td");
        idPrestador = child[0].innerText;
        $("#btnAgregarPF").attr("disabled", false);
    });
    //Evento de click donde se muestra la informacion de la persona fisica seleccionada en el fomulario
    $("#btnAgregarPF").on("click", function () {
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#fromularioNuevaPF").hide();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").show();
        $("#btnAgregarPF").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        $("#formDiv").find("input[type=text], select, input[type=number]").val("");
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
        cargaInfoPersonaFisica(idPrestador, tipoUsua);
        $('#formDiv').parsley().reset();
        $("#alertaVali").hide()
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
        //formularioPJ.empty();
    });
    //Evento de click donde muestra la informacion de la presona juridica para ser editada
    $("#TblCatBody").on("click", "tr .btn-warning", function (ev) {
        $("#modalLarge").modal('toggle');
        $("#tablaPFdiv").hide();
        $("#formularioDiv").show();
        $("#btnGuardarPJ").hide();
        $("#btnRegresarBPF").hide();
        $("#btnAgregarPF").hide();
        $("#btnNuevaPF").hide();
        $("#btnEditarPJ").hide();
        //formularioPJ.empty();
        var parent = $(this).parent("td").parent("tr");
        var child = parent.children("td");
        idPrestador = child[0].innerText;
        $("#formDiv").find("input[type=text], select, input[type=number]").val("");
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
        $("#alertaVali").hide()
    });
    //Evento de click donde se muestra el modal para la eliminacion de la relacion de PF y conceciones
    $("#TblCatBody").on("click", "tr .btn-danger", function () {
        $("#alertExito").hide();
        $("#alertError").hide();
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
        /*generateForm(idPrestador, tipoUsua);
        cargaInfocConcesionPF(idPrestador, tipoUsua);*/
    });

    $("#btnSuccess").on("click", function () {
        $("#modalSmall").modal('toggle');
        $("#alertExito").hide();
        $("#modalLarge").modal('toggle');
        $("#TblCatBody tr").remove();
        cargaTablaTipoUsuarios();
    })
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
            $("#modalSmall").modal('toggle');
            $("#TblCatBody tr").remove();
            cargaTablaTipoUsuarios();
        })
    });
    //Evento de click donde se abre el formulario para crear una nueva persona fisica y crear la relacion con concesiones
    $("#btnNuevaPF").on("click", function () {
        $("#formularioDiv").show();
        $("#tablaPFdiv").hide();
        $("#btnAgregarPF").hide();
        $("#btnRegresarBPF").show();
        $("#btnNuevaPF").hide();
        $("#formDiv").find("input[type=text], select, input[type=number]").val("");
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
        $('#formDiv').parsley().reset();
        $("#alertaVali").hide()
    });
    //Evento de teclado donde se verifica si hay algun campo obligatorio si completar
    $("#formDiv").on("keydown", function () {
        if ($(".parsley-error").length === 0) {
            $("#alertaVali").hide();
        } else {
            $("#alertaVali").show();
        }
    });
    //Evento de quitar el foco en el campo del numero economico para mostrar el nombre del titular
    $("#formDiv").on("focusout", "#NoEco" + tipoUstring, function () {
        var tipoU = localStorage.getItem("tipoU");
        if (tipoU === "4" && $("#NoEco" + tipoUstring).val() !== "") {
            cargaTitularConsecion();
        } else if (tipoU === "4" && $("#NoEco" + tipoUstring).val() === "") {
            $("#lblNombreTitular").html("");
        }
    });
}));
