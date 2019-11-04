// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    loadFilter();

    // Bootstrap-MaxLength (Modal)
    $('input#VarName').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

});

// inserisco gli elementi nella table
function DataBind(VariableList) {

    $("#LoadingStatus").html("Loading....");

    var SetData = $("#SetVariableList");
    for (var i = 0; i < VariableList.length; i++) {

        var Data = "<tr class='row_" + VariableList[i].Number + "'>";

        if (boolAdmin || boolWriter) {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>"
                + "<td>" + "<input id=\"VarNameTable" + i + "\"" + "class=\"form-control\" minlength=" + variableNameMin + " maxlength=" + variableNameMax + " type=\"textbox\" value=\"" + VariableList[i].Name + "\" placeholder=\"Insert " + variableName + "*\" onkeypress=\"saveRow(event, 0, '" + VariableList[i].Number + "', VarNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"PhaseCodeTable" + i + "\"" + "class=\"form-control\" type=\"textbox\" value=\"" + VariableList[i].PhaseCode + "\" placeholder=\"Insert " + phaseCode + "*\" onkeypress=\"saveRow(event, 1, '" + VariableList[i].Number + "', PhaseCodeTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"PhaseNameTable" + i + "\"" + "class=\"form-control\" minlength=" + phaseNameMin + " maxlength=" + phaseNameMax + " type=\"textbox\" value=\"" + VariableList[i].PhaseName + "\" placeholder=\"Insert " + phaseName + "*\" onkeypress=\"saveRow(event, 2, '" + VariableList[i].Number + "', PhaseNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<select id=\"VarLcTable" + i + "\"" + "class=\"form-control\" onchange=\"saveRowCombo(0, '" + VariableList[i].Number + "', VarLcTable" + i + ")\" ><option";

            if (VariableList[i].VarLc == true) {
                Data += " selected>true</option><option>false</option></select></td>";
            } else
                Data += ">true</option><option selected>false</option></select></td>";

            Data += "<td>" + "<input id=\"UnitNameTable" + i + "\"" + "class=\"form-control\" minlength=" + unitNameMin + " maxlength=" + unitNameMax + " type=\"textbox\" value=\"" + VariableList[i].MeasurementUnitName + "\" placeholder=\"Insert " + unitName + "*\" onkeypress=\"saveRow(event, 3, '" + VariableList[i].Number + "', UnitNameTable" + i + ")\" >" + "</td>";

        } else {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>" +
                "<td>" + VariableList[i].Name + "</td>" +
                "<td>" + VariableList[i].PhaseCode + "</td>" +
                "<td>" + VariableList[i].PhaseName + "</td>" +
                "<td>" + VariableList[i].VarLc + "</td>" +
                "<td>" + VariableList[i].MeasurementUnitName + "</td>";
        }

        Data = Data + "<td>" +
            "<a href='#' class='btn btn-info btn-sm waves-effect' onclick='DetailsVariable(\"" + VariableList[i].Number + "\")' ><span class='glyphicon glyphicon-eye-open'></span></a>";

        Data = Data + "</td>" + "</tr>";

        SetData.append(Data);

        // aggiungo caratteri campo
        $('input#VarNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#PhaseNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#UnitNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });
    }

    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    $('#SetVariableList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
}

function AddNewVariable() {
    $("#form")[0].reset();
    $("#ModalTitle").html("Add New Variable");
    $('span[data-valmsg-for').html('');
    $("#PanelTitleAddEditDetails").html("New Variable");
    $("#PanelVariable").prop('class', 'panel panel-default panel-success');
    $("#CreateVariable").prop('class', 'btn btn-success');
    $("#CreateVariable").show();
    $("#ViewValues").hide();
    $("#ViewSources").hide();
    $("#Number").prop('readonly', '');
    $("#VarName").prop('readonly', '');
    $("#PhaseCode").prop('readonly', '');
    $("#PhaseName").prop('readonly', '');
    $("#UnitName").prop('readonly', '');
    $("#VarLc").prop('disabled', '');
    $("#MyModal").modal();
}

// Show The Popup Modal For Details
function DetailsVariable(Number) {
    $("#ModalTitle").html("Details Variable");
    $('span[data-valmsg-for').html('');
    $("#PanelVariable").prop('class', 'panel panel-default panel-primary');
    $("#CreateVariable").hide();
    $("#ViewValues").show();
    $("#ViewSources").show();
    $("#Number").prop('readonly', 'readonly');
    $("#VarName").prop('readonly', 'readonly');
    $("#PhaseCode").prop('readonly', 'readonly');
    $("#PhaseName").prop('readonly', 'readonly');
    $("#UnitName").prop('readonly', 'readonly');
    $("#VarLc").prop('disabled', 'true');
    $("#MyModal").modal();
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Variable/GetVariableById?number=" + Number,
        success: function (data) {
            $("#PanelTitleAddEditDetails").html(data.Name);
            $("#Number").val(data.Number);
            $("#VarName").val(data.Name);
            $("#PhaseCode").val(data.PhaseCode);
            $("#PhaseName").val(data.PhaseName);
            $("#VarLc").val(data.VarLc);
            $("#UnitName").val(data.MeasurementUnitName);
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// invia richiesta Ajax per salvare un rows cambiato
function saveAjaxRequest(number, name, phaseCode, phaseName, varLc, unit, id) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Variable/Edit",
        headers: { '__RequestVerificationToken': token },
        data: {
            number: number,
            name: name,
            phaseCode: phaseCode,
            phaseName: phaseName,
            varLc: varLc,
            unit: unit,
        },
        success: function (data) {
            var isSuccessful = (data['success']);

            if (isSuccessful == true) {

                id.style.backgroundColor = "#5CB45B";
                setTimeout(function () {
                    id.style.backgroundColor = "";
                }, 500);

            }
            else {
                id.style.backgroundColor = "#F03154";
                setTimeout(function () {
                    id.style.backgroundColor = "";
                }, 500);

                var error = data['error'];

                // solo se l'errore è rilevante viene inviato
                if (error != "")
                    swal("Error!", error, "error");

            }
        }
    })

}

function saveRowCombo(params, number, id) {

    if (params == '0')
        saveAjaxRequest(number, "", "", "", id.value, "", id);
}

// Save Row
function saveRow(e, params, number, id) {
    if (e.keyCode == 13) {

        var name = undefined;
        var phaseCode;
        var phaseName = undefined;
        var unit = undefined;
        if (params == '0')
            name = id.value
        if (params == '1')
            phaseCode = id.value
        if (params == '2')
            phaseName = id.value
        if (params == '3')
            unit = id.value

        saveAjaxRequest(number, name, phaseCode, phaseName, "", unit, id);

        return false; // returning false will prevent the event from bubbling up.
    }
    else {
        return true;
    }
}

// Show The Popup Modal For Create
$("#CreateVariable").click(function () {
    var data = $("#SubmitForm").serialize();

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Variable/Create",
        headers: { '__RequestVerificationToken': token },
        data: data,
        success: function (data) {
            var isSuccessful = (data['success']);

            if (isSuccessful) {
                $("#MyModal").modal("hide");
                swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                    function () {
                        FilterVariable(0);
                    }
                );
            }
            else {
                var errors = data['errors'];
                displayValidationErrors(errors);
            }
        }
    })

})

function displayValidationErrors(errors) {

    for (var i = 0; i < errors.length; i++) {
        $('span[data-valmsg-for="' + errors[i].key + '"]').text(errors[i].errors[0]);
    }

}

//Show The Popup Modal For DeleteComfirmation
var rowDaCancellareArray = new Array();
var DeleteVariable = function () {
    $("#PanelTitleDelete").html("Delete Variable/s");
    $("#DeleteConfirmation").modal("show");
}

var ConfirmDelete = function () {
    // invio n richieste quanti sono i row da cancellare
    for (var i = 0, n = rowDaCancellareArray.length; i < n; i++) {
        $.ajax({
            type: "POST",
            dataType: 'json',
            cache: false,
            traditional: true,
            url: "/Variable/Delete",
            data: { number: rowDaCancellareArray[i] },
            headers: { "__RequestVerificationToken": token },
            success: function (result) {
                if (result == true) {
                    $("#DeleteConfirmation").modal("hide");
                    swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                        function () {
                            FilterVariable(0);
                        }
                    );
                } else {
                    swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                }

            }
        })
    }
}

//ComboBox element
function loadFilter() {

    $.ajax({
        url: "/Variable/GetFieldList",
        type: 'POST',
        dataType: 'json',
        cache: false,
        traditional: true,
        headers: { "__RequestVerificationToken": token },
        data: {
            number: ($("#numberString").val() != null) ? $("#numberString").chosen().val() : undefined,
            variableName: ($("#variableNameString").val() != null) ? $("#variableNameString").val() : undefined,
            phaseCode: ($("#phaseCodeString").val() != null) ? $("#phaseCodeString").val() : undefined,
            phaseName: ($("#phaseNameString").val() != null) ? $("#phaseNameString").val() : undefined,
            varLc: ($("#varLcString").val() != null) ? $("#varLcString").val() : undefined,
            measurementUnit: ($("#measurementUnitString").val() != null) ? $("#measurementUnitString").val() : undefined,
        },
        success: function (response) {

            var numberArray;
            var variableNameArray;
            var phaseCodeArray;
            var phaseNameArray;
            var varLcArray;
            var measurementUnitNameArray;

            if ($("#numberString").val() == null) {
                $("#numberString").empty();
                numberArray = new Array();
            }
            if ($("#variableNameString").val() == null) {
                $("#variableNameString").empty();
                variableNameArray = new Array();
            }
            if ($("#phaseCodeString").val() == null) {
                $("#phaseCodeString").empty();
                phaseCodeArray = new Array();
            }
            if ($("#phaseNameString").val() == null) {
                $("#phaseNameString").empty();
                phaseNameArray = new Array();
            }
            if ($("#varLcString").val() == null) {
                $("#varLcString").empty();
                varLcArray = new Array();
            }
            if ($("#measurementUnitString").val() == null) {
                $("#measurementUnitString").empty();
                measurementUnitNameArray = new Array();
            }

            $.each(response, function (index, row) {
                if ($("#numberString").val() == null)
                    if (numberArray.includes(row.Number) == false)
                        numberArray.push(row.Number);

                if ($("#variableNameString").val() == null)
                    if (variableNameArray.includes(row.Name) == false)
                        variableNameArray.push(row.Name);

                if ($("#phaseCodeString").val() == null)
                    if (phaseCodeArray.includes(row.PhaseCode) == false)
                        phaseCodeArray.push(row.PhaseCode);

                if ($("#phaseNameString").val() == null)
                    if (phaseNameArray.includes(row.PhaseName) == false)
                        phaseNameArray.push(row.PhaseName);

                if ($("#varLcString").val() == null)
                    if (varLcArray.includes(row.VarLc) == false)
                        varLcArray.push(row.VarLc);

                if ($("#measurementUnitString").val() == null)
                    if (measurementUnitNameArray.includes(row.MeasurementUnitName) == false)
                        measurementUnitNameArray.push(row.MeasurementUnitName);

            });

            // ordino array
            if ($("#numberString").val() == null) {
                numberArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = numberArray.length; i < n; i++) {
                    $("#numberString").append("<option value='" + numberArray[i] + "'>" + numberArray[i] + "</option>");
                }
            }

            if ($("#variableNameString").val() == null) {
                variableNameArray.sort();
                for (var i = 0, n = variableNameArray.length; i < n; i++) {
                    $("#variableNameString").append("<option value='" + variableNameArray[i] + "'>" + variableNameArray[i] + "</option>");
                }
            }

            if ($("#phaseCodeString").val() == null) {
                phaseCodeArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = phaseCodeArray.length; i < n; i++) {
                    $("#phaseCodeString").append("<option value='" + phaseCodeArray[i] + "'>" + phaseCodeArray[i] + "</option>");
                }
            }

            if ($("#phaseNameString").val() == null) {
                phaseNameArray.sort();
                for (var i = 0, n = phaseNameArray.length; i < n; i++) {
                    $("#phaseNameString").append("<option value='" + phaseNameArray[i] + "'>" + phaseNameArray[i] + "</option>");
                }
            }

            if ($("#varLcString").val() == null) {
                varLcArray.sort();
                for (var i = 0, n = varLcArray.length; i < n; i++) {
                    $("#varLcString").append("<option value='" + varLcArray[i] + "'>" + varLcArray[i] + "</option>");
                }
            }

            if ($("#measurementUnitString").val() == null) {
                measurementUnitNameArray.sort();
                for (var i = 0, n = measurementUnitNameArray.length; i < n; i++) {
                    $("#measurementUnitString").append("<option value='" + measurementUnitNameArray[i] + "'>" + measurementUnitNameArray[i] + "</option>");
                }
            }

            $('#numberString').trigger("chosen:updated");
            $('#variableNameString').trigger("chosen:updated");
            $('#phaseCodeString').trigger("chosen:updated");
            $('#phaseNameString').trigger("chosen:updated");
            $('#measurementUnitString').trigger("chosen:updated");
            $('#varLcString').trigger("chosen:updated");

        }
    });

}

// Filter Variable
function FilterVariable(selectSortable) {

    var sortable1;
    var pathImg1 = document.getElementById("idSortable1").src;
    if (pathImg1.includes("asc"))
        sortable1 = "asc";
    else if (pathImg1.includes("desc"))
        sortable1 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable1 = null;

    var sortable2;
    var pathImg2 = document.getElementById("idSortable2").src;
    if (pathImg2.includes("asc"))
        sortable2 = "asc";
    else if (pathImg2.includes("desc"))
        sortable2 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable2 = null;

    var sortable3;
    var pathImg3 = document.getElementById("idSortable3").src;
    if (pathImg3.includes("asc"))
        sortable3 = "asc";
    else if (pathImg3.includes("desc"))
        sortable3 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable3 = null;

    var sortable4;
    var pathImg4 = document.getElementById("idSortable4").src;
    if (pathImg4.includes("asc"))
        sortable4 = "asc";
    else if (pathImg4.includes("desc"))
        sortable4 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable4 = null;

    var sortable5;
    var pathImg5 = document.getElementById("idSortable5").src;
    if (pathImg5.includes("asc"))
        sortable5 = "asc";
    else if (pathImg5.includes("desc"))
        sortable5 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable5 = null;

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Variable/GetVariableList",
        headers: { "__RequestVerificationToken": token },
        data: {
            number: ($("#numberString").val() != null) ? $("#numberString").chosen().val() : undefined,
            variableName: ($("#variableNameString").val() != null) ? $("#variableNameString").val() : undefined,
            phaseCode: ($("#phaseCodeString").val() != null) ? $("#phaseCodeString").val() : undefined,
            phaseName: ($("#phaseNameString").val() != null) ? $("#phaseNameString").val() : undefined,
            varLc: ($("#varLcString").val() != null) ? $("#varLcString").val() : undefined,
            measurementUnit: ($("#measurementUnitString").val() != null) ? $("#measurementUnitString").val() : undefined,
            orderName: (sortable1 != null && selectSortable == 1) ? sortable1 : '',
            orderPhaseCode: (sortable2 != null && selectSortable == 2) ? sortable2 : '',
            orderPhaseName: (sortable3 != null && selectSortable == 3) ? sortable3 : '',
            orderVarLc: (sortable4 != null && selectSortable == 4) ? sortable4 : '',
            orderUnitName: (sortable5 != null && selectSortable == 5) ? sortable5 : '',
        },
        success: function (result) {
            $("#SetVariableList").empty();
            $("#myPager").empty();
            DataBind(result);
            // resetto stato select all/deselect all
            selectAll = true;
            // resetto l'immagine dei filtri
            if (selectSortable == 0) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 1) {
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 2) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 3) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 4) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 5) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
            }
            // passo al tab dei row
            $("#collapseOne").prop('class', 'panel-collapse collapse');
            $("#collapseTwo").prop('class', 'panel-collapse collapse in');
            $("#collapseTitleOne").prop('class', 'collapsed');
            $("#collapseTitleTwo").prop('class', '');
        }
    })

}

//Sortable Variable

function SortableName() {

    // cambio immagine
    var pathImg1 = document.getElementById("idSortable1").src;
    if (pathImg1.includes("asc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/desc.png";
    else if (pathImg1.includes("desc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";

    FilterVariable(1);

}

function SortablePhaseCode() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable2").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";

    FilterVariable(2);

}

function SortablePhaseName() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable3").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";

    FilterVariable(3);

}

function SortableVarLc() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable4").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";

    FilterVariable(4);

}

function SortableUnitName() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable5").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";

    FilterVariable(5);

}

// seleziono tutti gli elementi
var selectAll = true;
function toggle2() {
    checkboxes = document.getElementsByName('foo2');

    // non ci sono elementi nella tabella
    if (checkboxes.length == 0) {
        swal("Attention!", "there aren't rows in the table!", "error");
        return;
    }

    for (var i = 0, n = checkboxes.length; i < n; i++) {

        checkboxes[i].checked = selectAll;
    }
    // cambio in true così la prossima volta viene fatto il contrario
    if (selectAll == false)
        selectAll = true;
    else
        selectAll = false;
}

// tasto cancella button
function deleteRows() {

    // resetto array
    rowDaCancellareArray = new Array();
    // numero di checked trovati
    var numeroCheck = 0;

    var table = document.getElementById("SetVariableList");
    for (var i = 0; i < table.children.length; i++) {
        var riga = table.children[i];
        // vedo la cella checkbox
        var cellaCheckbox = riga.cells[0];
        var c = cellaCheckbox.children[0].children[0];
        if (c.checked) {
            numeroCheck++;
            var className = riga.className;
            rowDaCancellareArray.push(className.replace("row_", ""));
        }
    }

    if (numeroCheck == 0)
        swal("Attention!", "Select at least one a row!", "error");
    else {
        DeleteVariable();
    }

}

// copio i valori selezionati
function Copy() {

    // resetto array
    var rowDaCopiareArray = new Array();
    // numero di checked trovati
    var numeroCheck = 0;

    var table = document.getElementById("SetVariableList");
    for (var i = 0; i < table.children.length; i++) {
        var riga = table.children[i];
        // vedo la cella checkbox
        var cellaCheckbox = riga.cells[0];
        var c = cellaCheckbox.children[0].children[0];
        if (c.checked) {
            numeroCheck++;
            // salvo tutti i valori della riga
            var valori_riga = "";
            for (var t = 1, n = riga.children.length - 1; t < n; t++) {
                if (riga.children[t].children.length > 0)
                    valori_riga += riga.children[t].children[0].value + "\t";
                else
                    valori_riga += riga.children[t].outerText + "\t";
            }
            // aggiungo riga
            rowDaCopiareArray.push(valori_riga.trim('\t'));
        }
    }

    if (numeroCheck == 0)
        swal("Attention!", "Select at least one a row!", "error");
    else {
        var stringaFinale = "";
        for (var i = 0, n = rowDaCopiareArray.length; i < n; i++) {
            stringaFinale += rowDaCopiareArray[i] + "\n";
        }
        copyToClipboard(stringaFinale.trim('\n'));
    }

}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            // Success!
            swal({
                title: "Row/s copied!",
                timer: 1000,
                showConfirmButton: false
            });
        })
        .catch(err => {
            swal("Something went wrong!", err, "error");
            //console.log('Something went wrong', err);
        });
}

// incollo i valori selezionati
function pasteFromClipboard(numeroCheck) {
    navigator.clipboard.readText()
        .then(text => {
            // `text` contains the text read from the clipboard
            // suddivido i valori a capo
            var res = text.trim('\n').split("\n");

            // controllo se il numero di slit è minore delle righe selezionate
            if ((res.length) < numeroCheck) {
                swal("Attention!", "Number of rows is different from the copied values!", "error");
                return;
            }

            // serve per i valori dell'array dello slit
            var m = 0;
            var table = document.getElementById("SetVariableList");
            for (var i = 0; i < table.children.length; i++) {
                var riga = table.children[i];

                var className = riga.className;
                var number = className.replace("row_", "");
                // vedo la cella checkbox
                var cellaCheckbox = riga.cells[0];
                var c = cellaCheckbox.children[0].children[0];
                if (c.checked) {
                    // suddivido ancora per quanto riguarda la linea
                    var res2 = res[m].split('\t');

                    if (res2.length < 4) {
                        swal("Attention!", "Number of columns is different from the copied values!", "error");
                        return;
                    }

                    var name = res2[0].trim('\r').trim('\n');
                    var phaseCode = res2[1].trim('\r').trim('\n');
                    var phaseName = res2[2].trim('\r').trim('\n');
                    var varLc = res2[3].trim('\r').trim('\n');
                    var unit = res2[4].trim('\r').trim('\n');

                    // controllo
                    if (name.length < variableNameMin || name.length > variableNameMax) {
                        swal("Attention!", name + ": check length!", "error");
                        return;
                    }

                    if (isNaN(phaseCode)) {
                        swal("Attention!", phaseCode + ": isn't a number!", "error");
                        return;
                    }

                    if (phaseName.length < phaseNameMin || phaseName.length > phaseNameMax) {
                        swal("Attention!", phaseName + ": check length!", "error");
                        return;
                    }

                    if (!(varLc == "true" || varLc == "false" )) {
                        swal("Attention!", varLc + ": check value!", "error");
                        return;
                    }

                    if (unit.length < unitNameMin || unit.length > unitNameMax) {
                        swal("Attention!", unit + ": check length!", "error");
                        return;
                    }

                    // cambio valori riga
                    riga.children[1].children[0].value = name;
                    riga.children[2].children[0].value = phaseCode;
                    riga.children[3].children[0].value = phaseName;
                    riga.children[4].children[0].value = varLc;
                    riga.children[5].children[0].value = unit;

                    // invio richiesta ajax per salvare
                    saveAjaxRequest(number, name, phaseCode, phaseName, varLc, unit, riga)

                    m++;
                }
            }

        })
        .catch(err => {
            // maybe user didn't grant access to read from clipboard
            swal("Something went wrong!", err, "error");
            //console.log('Something went wrong', err);
        });
}

function Paste() {
    var numeroCheck = 0;

    var table = document.getElementById("SetVariableList");
    for (var i = 0, n = table.children.length; i < n; i++) {
        var riga = table.children[i];
        // vedo la cella checkbox
        var cellaCheckbox = riga.cells[0];
        var c = cellaCheckbox.children[0].children[0];
        if (c.checked) {
            numeroCheck++;
        }
    }

    if (numeroCheck == 0)
        swal("Attention!", "Select at least one a row!", "error");
    else {
        pasteFromClipboard(numeroCheck);
    }
}