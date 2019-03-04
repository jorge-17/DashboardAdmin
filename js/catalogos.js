(function (a){
    a(window.jQuery, window, document);
}(function ($, window, document) {
    //console.log("Init...");
    var tablaCat =  $("#tablaCatalogos");
    var tablaPF;
    var idPrestador = "";
    //Boton para busqueda de Personas Juridicas
    var btnBuscarPJ = $("#btnBuscar");
    //Bonton para agregar nueva Persona Juridica
    var btnNuevoPJ = $("#btnNuevo");
    //Boton para buscar persona fisica
    var btnBuscarPF = $("#btnBuscarPF");
    //Boton para agregar una persona fisica existente
    var btnAgregarPF = $("#btnAgregarPF");
    //Boton para agregar una persona fisica nueva
    var btnNuevaPF = $("#btnNuevaPF");
    //Boton para regresar a la lista de busqueda de personas fisicas
    var btnRegresarBPF = $("#btnRegresarBPF");
    //Boton para guardar la persona la persona juridica
    var btnGuardarPJ = $("#btnGuardarPJ");
    //Formulario para añadir o ver personas juridicas
    var formularioPJ = $("#formDiv");
    //@jrodarte Declaración de URL y metodos
    //const rootURL = "https://wsi01.sctslp.gob.mx/wcf/Dashboard.svc/";
    const rootURL = "http://localhost:26010/Dashboard.svc/";
    const obtenerTiposU = "ObtenerTiposUsuarios";
    const obtenerPF = "ObtenerPersonasFisicas";
    const tokenSession = sessionStorage.getItem('token');

    function generateForm(tipoU){
        //Apellido P.
        var apFG = $("<div></div>").addClass("form-group");
        var apL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "apInput").text("Apellido paterno");
        var apDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var apI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "apInput");
        apDI.append(apI);
        apFG.append(apL, apDI);
        //Apellido M.
        var amFG = $("<div></div>").addClass("form-group");
        var amL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "amInput").text("Apellido materno");
        var amDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var amI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "amInput");
        amDI.append(amI);
        amFG.append(amL, amDI);
        //Nombres
        var nomFG = $("<div></div>").addClass("form-group");
        var nomL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "nomInput").text("Nombres");
        var nomDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var nomI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "nomInput");
        nomDI.append(nomI);
        nomFG.append(nomL, nomDI);
        //Domicilio
        var domFG = $("<div></div>").addClass("form-group");
        var domL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "domInput").text("Domicilio");
        var domDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var domI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "domInput");
        domDI.append(domI);
        domFG.append(domL, domDI);
        //Telefono
        var telFG = $("<div></div>").addClass("form-group");
        var telL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "telInput").text("Telefono");
        var telDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var telI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "telInput");
        telDI.append(telI);
        telFG.append(telL, telDI);
        //Curp
        var cuFG = $("<div></div>").addClass("form-group");
        var cuL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "cuInput").text("CURP");
        var cuDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var cuI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "cuInput");
        cuDI.append(cuI);
        cuFG.append(cuL, cuDI);
        formularioPJ.append(apFG, amFG, nomFG, domFG, telFG, cuFG);
        //Numero eco a repre.
        var nerFG = $("<div></div>").addClass("form-group");
        var nerL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "nerInput").text("Número económico a representar");
        var nerDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var nerI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "number").attr("id", "nerInput");
        nerDI.append(nerI);
        nerFG.append(nerL, nerDI);
        //Fecha nomb.
        var fnFG = $("<div></div>").addClass("form-group");
        var fnL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "fnInput").text("Fecha de nombramiento");
        var fnDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
        var fnI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "fnInput");
        fnDI.append(fnI);
        fnFG.append(fnL, fnDI);
        switch (tipoU) {
            case "3":
                //Representante Legal
                //Correo Elctronico
                var emFG = $("<div></div>").addClass("form-group");
                var emL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "emInput").text("Correo electrónico");
                var emDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
                var emI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "emInput");
                emDI.append(emI);
                emFG.append(emL, emDI);
                formularioPJ.append(emFG, nerFG, fnFG);
                break;
            case "4":
                //Beneficiario
                //Orden de Pre.
                var opFG = $("<div></div>").addClass("form-group");
                var opL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "opInput").text("Orden de prelación (prioridad)");
                var opDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
                var opI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "opInput");
                opDI.append(opI);
                opFG.append(opL, opDI);
                //Numero eco.
                var neFG = $("<div></div>").addClass("form-group");
                var neL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "neInput").text("Número económico del titular");
                var neDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
                var neI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "neInput");
                neDI.append(neI);
                neFG.append(neL, neDI);
                //Obsevaciones
                var obFG = $("<div></div>").addClass("form-group");
                var obL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "obInput").text("Observaciones");
                var obDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
                var obI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "obInput");
                obDI.append(obI);
                obFG.append(obL, obDI);
                formularioPJ.append(opFG, neFG, obFG);
                break;
            case "5":
                //Tutor
                formularioPJ.append(nerFG, fnFG);
                break;
            case "6":
                //Albacea
                //RFC
                var rfcFG = $("<div></div>").addClass("form-group");
                var rfcL = $("<label></label>").addClass("control-label col-md-3 col-sm-3 col-xs-12").attr("for", "rfcInput").text("RFC");
                var rfcDI = $("<div></div>").addClass("col-md-6 col-sm-6 col-xs-12");
                var rfcI = $("<input>").addClass("form-control col-md-7 col-xs-12").attr("type", "text").attr("id", "rfcInput");
                rfcDI.append(rfcI);
                rfcFG.append(rfcL, rfcDI);
                formularioPJ.append(rfcFG, nerFG, fnFG);
                break;
        }
        //

    }
    async function cargaTablaTipoUsuarios(){
        const idTipoUsuario = localStorage.getItem("tipoU");
        var inputTexto = $("#inputBusqueda").val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            tipoU: idTipoUsuario,
            textoBus: inputTexto
        });
        var resultado;
        try{
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerTiposU,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        }catch (e) {
            console.log(e.message)
        }

        $.when(resultado).then(function (data) {
            var datos = JSON.parse(data.d);
            var usuarios = datos['aoData'];
            var contador = 0;
            usuarios.forEach(usuario => {
                $("#TblCatBody").append("<tr id='tblCataUsuaRow" + contador +"'></tr>");
                const fila = $("#tblCataUsuaRow" + contador);
                fila.append("<td>"+ usuario['IdConcesion']+"</td>");
                fila.append("<td>"+ usuario['NombreCompleto']+"</td>");
                fila.append("<td>"+ usuario['CURP']+"</td>");
                fila.append("<td>"+ usuario['FechaNombramiento']+"</td>");
                fila.append("<td><button class='btn btn-warning'><i class='fas fa-edit'></i></button></td>")
                fila.append("<td><button class='btn btn-danger'><i class='fas fa-trash-alt'></i></button></td>")
                contador++;
            });
        });
    }

    async function cargaTablaPersonasFisica(){
        var inputTexto = $("#inputBusquedaPF").val();
        var dataJson = JSON.stringify({
            token: tokenSession,
            textoBus: inputTexto
        });
        var resultado;
        try{
            resultado = await $.ajax({
                type: "POST",
                url: rootURL + obtenerPF,
                data: dataJson,
                contentType: "application/json; charset=utf-8"
            });
        }catch (e) {
            console.log(e.message)
        }

        $.when(resultado).then(function (data) {
            var datos = JSON.parse(data.d);
            var usuarios = datos['aoData'];
            var contador = 0;
            usuarios.forEach(usuario => {
                $("#TblPerFisBody").append("<tr id='tblPFRow" + contador +"'></tr>");
                const fila = $("#tblPFRow" + contador);
                fila.append("<td>"+ usuario['IdPrestadorServicio'] + "</td>")
                fila.append("<td>"+ usuario['NombreCompleto']+"</td>");
                fila.append("<td>"+ usuario['CURP']+"</td>");
                fila.append("<td>"+ usuario['Calle']+ " " + usuario['Colonia'] + " " + usuario['NumeroExterior'] + " " + usuario['NumeroInterior'] + "</td>");
                contador++;
            });


            tablaPF = $("#tablaPerFisicas").DataTable({
                dom: 'p'
            })
        });
    }


    btnBuscarPJ.on("click", function () {
        $("#TblCatBody tr").remove();
        cargaTablaTipoUsuarios();

        //TODO:  Falta agregar la validacion en boton de nuevo en caso de no devolver ningun resultado

        /*if($("#TblCatBody tr").length == 0){
            btnNuevo.attr('disabled', false);
        }else{
            btnNuevo.attr('disabled', true);
        }*/
    });

    btnBuscarPF.on("click", function () {
        if ($.fn.dataTable.isDataTable('#tablaPerFisicas')) {
            tablaPF.destroy();
            $("#TblPerFisBody").empty();
        }
       cargaTablaPersonasFisica();
    });

    $("#tablaPFdiv").on("click", "#tablaPerFisicas tr", function(){
        var idRow = $(this).attr("id");
        $("#tablaPerFisicas tr").css("background-color", "#FFFFFF");
        $(this).css("background-color", "#dedede");
        var child = $(this).children("td");
        idPrestador = child[0].innerText;
        console.log(idPrestador);
        $("#btnAgregarPF").attr("disabled", false);
    });

    btnAgregarPF.on("click", function () {
        $("#tablaPFdiv").css("display", "none");
        $("#formularioDiv").css("display", "block");
        btnGuardarPJ.css("display", "block");
        btnRegresarBPF.css("display", "block");
        btnAgregarPF.css("display", "none");
        btnNuevaPF.css("display", "none");
        generateForm(localStorage.getItem("tipoU"));
    });

    btnRegresarBPF.on("click", function () {
        $("#formularioDiv").css("display", "none");
        $("#tablaPFdiv").css("display", "block");
        btnGuardarPJ.css("display", "none");
        btnRegresarBPF.css("display", "none");
        btnAgregarPF.css("display", "block");
        btnNuevaPF.css("display", "block");
        formularioPJ.empty();
    });


}));