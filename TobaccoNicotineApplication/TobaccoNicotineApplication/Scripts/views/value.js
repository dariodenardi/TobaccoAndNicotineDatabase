// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    // si avviano in modo asincrono
    setTimeout(loadFilterCountry(), 0);
    setTimeout(loadFilterVariable(), 0);
    loadCountrySelect();
    loadVariableSelect();
    getRepositoryNameArray();

    // Bootstrap-MaxLength (Modal)
    $('input#PublicNotes').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    // Bootstrap-MaxLength (Modal)
    $('input#InternalNotes').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

});

// serve quando nella SourceList posso cambiare file tra quelli già nel repository
var RepositoryNameArray = new Array();

// inserisco gli elementi nella table
function DataBind(result) {

    $("#LoadingStatus").html("Loading....");

    var SetData = $("#SetValueList");
    for (var i = 0; i < result.Data.length; i++) {

        var Data = "<tr class='row_" + result.Data[i].CountryCode + "_" + result.Data[i].Year + "_" + result.Data[i].Number + "'>";

        if (boolAdmin || boolWriter) {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>"
                + "<td>" + result.Data[i].CountryName + "</td>"
                + "<td>" + result.Data[i].VariableName + "</td>"
                + "<td>" + "<input id=\"DataTable" + i + "\"" + "class=\"form-control rowFix\" type=\"textbox\" value=\"" + ((typeof result.Data[i].Data == 'number') ? parseFloat(result.Data[i].Data).toFixed(1) : result.Data[i].Data) + "\" placeholder=\"Insert " + data + "\" onkeypress=\"saveRow(event, 0, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", DataTable" + i + ")\" >" + "</td>";

            if (result.Data[i].VarLc == true)
                Data = Data + "<td>" + "<input id=\"DataUsTable" + i + "\"" + "class=\"form-control rowFix\" type=\"textbox\" value=\"" + ((typeof result.Data[i].DataUs == 'number') ? parseFloat(result.Data[i].DataUs).toFixed(1) : result.Data[i].DataUs) + "\" placeholder=\"Insert " + dataUs + "\" onkeypress=\"saveRow(event, 1, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", DataUsTable" + i + ")\" >" + "</td>";
            else
                Data = Data + "<td id=\"DataUsTable>\"" + "</td>";

            Data = Data + "<td>" + result.Data[i].Year + "</td>";

            if (result.Data[i].VarLc == true)
                Data = Data + "<td>" + result.Data[i].CurrencyValue + "</td>";
            else
                Data = Data + "<td>" + "</td>";

            Data = Data
                + "<td>" + "<input id=\"PublicNotesTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + publicNotesMax + " type=\"textbox\" value=\"" + result.Data[i].PublicNotes + "\" placeholder=\"Insert " + publicNotes + "\" onkeypress=\"saveRow(event, 2, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", PublicNotesTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"InternalNotesTable" + i + "\"" + "class=\"form-control rowFix\"  maxlength=" + internalNotesMax + " type=\"textbox\" value=\"" + result.Data[i].InternalNotes + "\" placeholder=\"Insert " + internalNotes + "\" onkeypress=\"saveRow(event, 3, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", InternalNotesTable" + i + ")\" >" + "</td>";

        } else {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>" +
                "<td>" + result.Data[i].CountryName + "</td>" +
                "<td>" + result.Data[i].VariableName + "</td>" +
                "<td>" + result.Data[i].Data + "</td>" +
                "<td>" + result.Data[i].DataUs + "</td>" +
                "<td>" + result.Data[i].Year + "</td>" +
                "<td>" + result.Data[i].CurrencyValue + "</td>" +
                "<td>" + result.Data[i].PublicNotes + "</td>" +
                "<td>" + result.Data[i].InternalNotes + "</td>";
        }

        /*Data = Data + "<td>" +
            "<div class=\"dropdown\">" +
            "<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" id=\"about-us\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">" +
            "Search" +
            "<span class=\"caret\"></span></button>" +
            "<ul class=\"dropdown-menu dropdownTable\" aria-labelledby=\"about-us\">" +
            "<li><a href=\"#\">Currency</a></li>" +
            "<li><a href=\"#\">Sources</a></li>" +
            "</ul>" +
            "</div>" + "</td>";*/

        //Data = Data + "<td>";

        if (result.Data[i].Sources == null) {
            Data = Data + "<td>" + "<input id=\"SourceNameTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + linkMax + " type=\"textbox\" value=\"null\" placeholder=\"Insert " + sourceName + "*\" onkeypress=\"saveRow(event, 4, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", SourceNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"SourceLinkTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + linkMax + " type=\"textbox\" value=\"null\" placeholder=\"Insert " + sourceLink + "*\" onkeypress=\"saveRow(event, 5, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", SourceLinkTable" + i + ")\" >" + "</td>"
                + "<td><select id=\"selectRepository" + i + "\" class=\"form-control rowFix\" onchange=\"saveRowCombo('" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", selectRepository" + i + ")\"></select></td>"
                + "<td>" + "<input id=\"DateDownloadTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + dateDownloadMax + " type=\"textbox\" value=\"null\" placeholder=\"Insert " + sourceDateDownload + "*\" onkeypress=\"saveRow(event, 6, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", DateDownloadTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"SourceUsernameTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + usernameMax + " type=\"textbox\" value=\"null\" placeholder=\"Insert " + sourceUsername + "*\" onkeypress=\"saveRow(event, 7, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", SourceUsernameTable" + i + ")\" >" + "</td>"
                + "<td>" + "</td>";
        } else {

            Data = Data + "<td>" + "<input id=\"SourceNameTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + linkMax + " type=\"textbox\" value=\"" + result.Data[i].Sources.Name + "\" placeholder=\"Insert " + sourceName + "*\" onkeypress=\"saveRow(event, 4, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", SourceNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"SourceLinkTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + linkMax + " type=\"textbox\" value=\"" + result.Data[i].Sources.Link + "\" placeholder=\"Insert " + sourceLink + "*\" onkeypress=\"saveRow(event, 5, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", SourceLinkTable" + i + ")\" >" + "</td>"
                + "<td><select id=\"selectRepository" + i + "\" class=\"form-control rowFix\" onchange=\"saveRowCombo('" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", selectRepository" + i + ")\"></select></td>"
                + "<td>" + "<input id=\"DateDownloadTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + dateDownloadMax + " type=\"textbox\" value=\"" + result.Data[i].Sources.DateDownload + "\" placeholder=\"Insert " + sourceDateDownload + "*\" onkeypress=\"saveRow(event, 6, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", DateDownloadTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"SourceUsernameTable" + i + "\"" + "class=\"form-control rowFix\" maxlength=" + usernameMax + " type=\"textbox\" value=\"" + result.Data[i].Sources.Username + "\" placeholder=\"Insert " + sourceUsername + "*\" onkeypress=\"saveRow(event, 7, '" + result.Data[i].CountryCode + "', '" + result.Data[i].Number + "', " + result.Data[i].Year + ", " + result.Data[i].VarLc + ", SourceUsernameTable" + i + ")\" >" + "</td>";

            if (result.Data[i].Sources.Repository != null) {
                Data = Data +
                    "<td>" + "<a target=\"_blank\" rel=\"noopener noreferrer\" href='" + serverMap + "/" + result.Data[i].Sources.Repository + "' class='btn btn-dark btn-sm waves-effect'><span class='glyphicon glyphicon-file'></span></a>" + "</td>";
            } else {
                Data = Data +
                    "<td>" + "</td>";
            }

        }

        //Data = Data + "</td>"

        Data = Data + "</tr>";

        SetData.append(Data);

        for (var t = 0; t < RepositoryNameArray.length; t++) {
            $("#selectRepository" + i).append("<option value='" + RepositoryNameArray[t] + "'>" + RepositoryNameArray[t] + "</option>");
        }

        if (result.Data[i].Sources == null)
            $("#selectRepository" + i + " option[value='null']").attr('selected', 'selected');
        else
            $("#selectRepository" + i + " option[value='" + result.Data[i].Sources.Repository + "']").attr('selected', 'selected');

        // aggiungo caratteri campo
        $('input#PublicNotesTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#InternalNotesTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#SourceNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#SourceLinkTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#selectRepository' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#DateDownloadTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#SourceUsernameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });
    }

    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    PaggingTemplate(result.TotalPages, result.CurrentPage);
}

var statusPage = 1;
function GetPageData(pageNumber) {

    statusPage = pageNumber;
    FilterValue(0, pageNumber);

}

function getRepositoryNameArray() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Source/GetListRepositoryName",
        success: function (data) {
            for (var i = 0, n = data.length; i < n; i++) {
                RepositoryNameArray.push(data[i].Repository);
            }
        }
    })
}

// Show The Popup Modal For Add
function AddNewValue() {
    $("#form")[0].reset();
    $("#ModalTitle").html("Add New Value");
    $('span[data-valmsg-for').html('');
    $("#PanelTitleAddEditDetails").html("New Value");
    $("#MyModal").modal();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadCountrySelect() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Country/GetListCountryName",
        success: function (data) {
            $("#countryList").append("<option value='' disabled selected>Select Country</option>");
            for (var i = 0, n = data.length; i < n; i++) {
                $("#countryList").append("<option value='" + data[i].CountryCode + "'>" + data[i].CountryName + "</option>");
            }
        }
    })
}

function loadVariableSelect() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Variable/GetListVariableName",
        success: function (data) {
            $("#variableList").append("<option value='' disabled selected>Select Variable</option>");
            for (var i = 0, n = data.length; i < n; i++) {
                $("#variableList").append("<option value='" + data[i].Number + "'>" + data[i].Name + "</option>");
            }
        }
    })
}

function findCountryCode() {
    var e = document.getElementById("countryList");
    var select = e.options[e.selectedIndex].value;

    // cambio testo
    var textbox = document.getElementById('CountryCode');
    textbox.value = select;
}

function findVariableNumber() {
    var e = document.getElementById("variableList");
    var select = e.options[e.selectedIndex].value;

    // cambio testo
    var textbox = document.getElementById('Number');
    textbox.value = select;
}

// invia richiesta Ajax per salvare un rows cambiato
function saveAjaxRequest(countryCode, number, year, varLc, data, dataUs, public, internal, sourceName, link, repository, dateDownload, username, id) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Value/Edit",
        headers: { '__RequestVerificationToken': token },
        data: {
            countryCode: countryCode,
            year: year,
            number: number,
            data: data,
            dataUs: dataUs,
            varLc: varLc,
            publicNotes: public,
            internalNotes: internal,
            sourceName: sourceName,
            link: link,
            dateDownload: dateDownload,
            repository: repository,
            username: username
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

function saveRowCombo(countryCode, number, year, varLc, id) {
    var numero_riga = id.id.replace("selectRepository", "");
    var sourceName = document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value == "null" ? undefined : document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value;
    if (sourceName == null) {
        swal("Error!", "Change Source Name.", "error");
        return;
    }
    saveAjaxRequest(countryCode, number, year, varLc, "", "", "", "", sourceName, "", id.value, "", "", id);
}

// Save Row
function saveRow(e, params, countryCode, number, year, varLc, id) {

    if (e.keyCode == 13) {

        var sourceName = undefined;

        if (params == '4') {
            var numero_riga = id.id.replace("SourceNameTable", "");
            if (id.value == "null") {
                var a = document.getElementById("SetValueList").children[numero_riga].children[10].children[0].value = "null";
                document.getElementById("SetValueList").children[numero_riga].children[11].children[0].value = "null";
                document.getElementById("SetValueList").children[numero_riga].children[12].children[0].value = "null";
                document.getElementById("SetValueList").children[numero_riga].children[13].children[0].value = "null";
                $('#SetValueList > tr').eq(numero_riga).children('td').eq(14).remove();
            } else {
                if (document.getElementById("SetValueList").children[numero_riga].children[13].children[0].value == "null")
                    document.getElementById("SetValueList").children[numero_riga].children[13].children[0].value = myUsername;
            }
        } else if (params == '5') {
            var numero_riga = id.id.replace("SourceLinkTable", "");
            sourceName = document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value == "null" ? undefined : document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value;
            if (sourceName == null) {
                swal("Error!", "Change Source Name.", "error");
                return;
            }
        } else if (params == '6') {
            var numero_riga = id.id.replace("DateDownloadTable", "");
            sourceName = document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value == "null" ? undefined : document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value;
            if (sourceName == null) {
                swal("Error!", "Change Source Name.", "error");
                return;
            }
        } else if (params == '7') {
            var numero_riga = id.id.replace("SourceUsernameTable", "");
            sourceName = document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value == "null" ? undefined : document.getElementById("SetValueList").children[numero_riga].children[9].children[0].value;
            if (sourceName == null) {
                swal("Error!", "Change Source Name.", "error");
                return;
            }
        }

        // aggiorno conversione dato
        if (params == '0') {
            // cliccato invio con data -> aggiorno dataUs
            var numero_riga = id.id.replace("DataTable", "");
            var exhange = document.getElementById("SetValueList").children[numero_riga].children[6].outerText;
            if (id.value == "null")
                $('#DataUsTable' + numero_riga).val("null");
            else
                $('#DataUsTable' + numero_riga).val((id.value * exhange).toFixed(1));

            // metto eventuali decimali se servono
            $('#DataTable' + numero_riga).val((id.value / 1).toFixed(1));
        } else if (params == '1') {
            // cliccato invio con dataUs -> aggiorno data
            var numero_riga = id.id.replace("DataUsTable", "");
            var exhange = document.getElementById("SetValueList").children[numero_riga].children[6].outerText;
            if (id.value == "null")
                $('#DataTable' + numero_riga).val("null");
            else
                $('#DataTable' + numero_riga).val((id.value / exhange).toFixed(1));

            // metto eventuali decimali se servono
            $('#DataUsTable' + numero_riga).val((id.value / 1).toFixed(1));
        }

        var data;
        var dataUs;
        var public = undefined;
        var internal = undefined;
        if (params == '0') {
            data = id.value;
            if (id.value == "null")
                dataUs = "null";
            else
                dataUs = (id.value * exhange).toFixed(1);
        }
        if (params == '1') {
            if (id.value == "null")
                data = "null";
            else
                data = (id.value / exhange).toFixed(1);
            dataUs = id.value;
        }
        if (params == '2')
            public = id.value;
        if (params == '3')
            internal = id.value;


        var link = undefined;
        var dateDownload = undefined;
        var username = undefined;
        if (params == '4')
            sourceName = id.value;
        if (params == '5')
            link = id.value;
        if (params == '6')
            dateDownload = id.value;
        if (params == '7')
            username = id.value;

        saveAjaxRequest(countryCode, number, year, varLc, data, dataUs, public, internal, sourceName, link, "", dateDownload, username, id);

        return false; // returning false will prevent the event from bubbling up.
    }
    else {
        return true;
    }
}

// Show The Popup Modal For Create
$("#CreateValue").click(function () {
    var data = $("#SubmitForm").serialize();

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Value/Create",
        headers: { '__RequestVerificationToken': token },
        data: data,
        success: function (data) {
            var isSuccessful = (data['success']);

            if (isSuccessful) {
                $("#MyModal").modal("hide");
                swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                    function () {
                        FilterValue(0, statusPage);
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

// Show The Popup Modal For DeleteComfirmation
var rowDaCancellareArray = new Array();
var DeleteValue = function () {
    $("#PanelTitleDelete").html("Delete Value/s");
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
            url: "/Value/Delete",
            data: {
                countryCode: rowDaCancellareArray[i].split("_")[0],
                year: rowDaCancellareArray[i].split("_")[1],
                number: rowDaCancellareArray[i].split("_")[2]
            },
            headers: { "__RequestVerificationToken": token },
            success: function (result) {
                if (result == true) {
                    $("#DeleteConfirmation").modal("hide");
                    swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                        function () {
                            // si avviano in modo asincrono
                            FilterValue(0, statusPage);
                        }
                    );
                } else {
                    swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                }

            }
        })
    }
}

// ComboBox element
function loadFilterCountry() {

    $.ajax({
        url: "/Country/GetFieldList",
        type: 'POST',
        dataType: 'json',
        cache: false,
        traditional: true,
        headers: { "__RequestVerificationToken": token },
        data: {
            pmiCoding: ($("#pmiCodingString").val() != null) ? $("#pmiCodingString").chosen().val() : undefined,
            continentName: ($("#continentNameString").val() != null) ? $("#continentNameString").val() : undefined,
            regionName: ($("#regionNameString").val() != null) ? $("#regionNameString").val() : undefined,
            countryName: ($("#countryNameString").val() != null) ? $("#countryNameString").val() : undefined,
            continentCode: ($("#continentCodeString").val() != null) ? $("#continentCodeString").val() : undefined,
            regionCode: ($("#regionCodeString").val() != null) ? $("#regionCodeString").val() : undefined,
            countryCode: ($("#countryCodeString").val() != null) ? $("#countryCodeString").val() : undefined,
            areaCode: ($("#areaCodeString").val() != null) ? $("#areaCodeString").val() : undefined
        },
        success: function (response) {

            var pmiCodingArray;
            var continentNameArray;
            var regionNameArray;
            var countryNameArray;
            var continentCodeArray;
            var regionCodeArray;
            var countryCodeArray;
            var areaCodeArray;

            if ($("#pmiCodingString").val() == null) {
                $("#pmiCodingString").empty();
                pmiCodingArray = new Array();
            }
            if ($("#continentNameString").val() == null) {
                $("#continentNameString").empty();
                continentNameArray = new Array();
            }
            if ($("#regionNameString").val() == null) {
                $("#regionNameString").empty();
                regionNameArray = new Array();
            }
            if ($("#countryNameString").val() == null) {
                $("#countryNameString").empty();
                countryNameArray = new Array();
            }
            if ($("#continentCodeString").val() == null) {
                $("#continentCodeString").empty();
                continentCodeArray = new Array();
            }
            if ($("#regionCodeString").val() == null) {
                $("#regionCodeString").empty();
                regionCodeArray = new Array();
            }
            if ($("#countryCodeString").val() == null) {
                $("#countryCodeString").empty();
                countryCodeArray = new Array();
            }
            if ($("#areaCodeString").val() == null) {
                $('#areaCodeString').empty();
                areaCodeArray = new Array();
            }

            $.each(response, function (index, row) {
                if ($("#pmiCodingString").val() == null)
                    if (pmiCodingArray.includes(row.PmiCoding) == false)
                        pmiCodingArray.push(row.PmiCoding);

                if ($("#continentNameString").val() == null)
                    if (continentNameArray.includes(row.ContinentName) == false)
                        continentNameArray.push(row.ContinentName);

                if ($("#regionNameString").val() == null)
                    if (regionNameArray.includes(row.RegionName) == false)
                        regionNameArray.push(row.RegionName);

                if ($("#countryNameString").val() == null)
                    if (countryNameArray.includes(row.CountryName) == false)
                        countryNameArray.push(row.CountryName);

                if ($("#continentCodeString").val() == null)
                    if (continentCodeArray.includes(row.ContinentCode) == false)
                        continentCodeArray.push(row.ContinentCode);

                if ($("#regionCodeString").val() == null)
                    if (regionCodeArray.includes(row.RegionCode) == false)
                        regionCodeArray.push(row.RegionCode);

                if ($("#countryCodeString").val() == null)
                    if (countryCodeArray.includes(row.CountryCode) == false)
                        countryCodeArray.push(row.CountryCode);

                if ($("#areaCodeString").val() == null)
                    if (areaCodeArray.includes(row.AreaCode) == false)
                        areaCodeArray.push(row.AreaCode);
            });

            // ordino array
            if ($("#pmiCodingString").val() == null) {
                pmiCodingArray.sort();
                for (var i = 0, n = pmiCodingArray.length; i < n; i++) {
                    $("#pmiCodingString").append("<option value='" + pmiCodingArray[i] + "'>" + pmiCodingArray[i] + "</option>");
                }
            }

            if ($("#continentNameString").val() == null) {
                continentNameArray.sort();
                for (var i = 0, n = continentNameArray.length; i < n; i++) {
                    $("#continentNameString").append("<option value='" + continentNameArray[i] + "'>" + continentNameArray[i] + "</option>");
                }
            }

            if ($("#regionNameString").val() == null) {
                regionNameArray.sort();
                for (var i = 0, n = regionNameArray.length; i < n; i++) {
                    $("#regionNameString").append("<option value='" + regionNameArray[i] + "'>" + regionNameArray[i] + "</option>");
                }
            }

            if ($("#countryNameString").val() == null) {
                countryNameArray.sort();
                for (var i = 0, n = countryNameArray.length; i < n; i++) {
                    $("#countryNameString").append("<option value='" + countryNameArray[i] + "'>" + countryNameArray[i] + "</option>");
                }
            }

            if ($("#continentCodeString").val() == null) {
                continentCodeArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = continentCodeArray.length; i < n; i++) {
                    $("#continentCodeString").append("<option value='" + continentCodeArray[i] + "'>" + continentCodeArray[i] + "</option>");
                }
            }

            if ($("#regionCodeString").val() == null) {
                regionCodeArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = regionCodeArray.length; i < n; i++) {
                    $("#regionCodeString").append("<option value='" + regionCodeArray[i] + "'>" + regionCodeArray[i] + "</option>");
                }
            }

            if ($("#countryCodeString").val() == null) {
                countryCodeArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = countryCodeArray.length; i < n; i++) {
                    $("#countryCodeString").append("<option value='" + countryCodeArray[i] + "'>" + countryCodeArray[i] + "</option>");
                }
            }

            if ($("#areaCodeString").val() == null) {
                areaCodeArray.sort();
                for (var i = 0, n = areaCodeArray.length; i < n; i++) {
                    $("#areaCodeString").append("<option value='" + areaCodeArray[i] + "'>" + areaCodeArray[i] + "</option>");
                }
            }

            $('#pmiCodingString').trigger("chosen:updated");
            $('#continentNameString').trigger("chosen:updated");
            $('#regionNameString').trigger("chosen:updated");
            $('#countryNameString').trigger("chosen:updated");
            $('#continentCodeString').trigger("chosen:updated");
            $('#regionCodeString').trigger("chosen:updated");
            $('#countryCodeString').trigger("chosen:updated");
            $('#areaCodeString').trigger("chosen:updated");

        }
    });

}

function loadFilterYear() {
    $.ajax({
        url: "/Value/GetFieldList",
        type: 'POST',
        dataType: 'json',
        cache: false,
        traditional: true,
        headers: { "__RequestVerificationToken": token },
        data: {
            pmiCoding: ($("#pmiCodingString").val() != null) ? $("#pmiCodingString").chosen().val() : undefined,
            continentName: ($("#continentNameString").val() != null) ? $("#continentNameString").val() : undefined,
            regionName: ($("#regionNameString").val() != null) ? $("#regionNameString").val() : undefined,
            countryName: ($("#countryNameString").val() != null) ? $("#countryNameString").val() : undefined,
            continentCode: ($("#continentCodeString").val() != null) ? $("#continentCodeString").val() : undefined,
            regionCode: ($("#regionCodeString").val() != null) ? $("#regionCodeString").val() : undefined,
            countryCode: ($("#countryCodeString").val() != null) ? $("#countryCodeString").val() : undefined,
            areaCode: ($("#areaCodeString").val() != null) ? $("#areaCodeString").val() : undefined,
            year: ($("#yearString").val() != null) ? $("#yearString").val() : undefined,
            number: ($("#numberString").val() != null) ? $("#numberString").val() : undefined,
            variableName: ($("#variableNameString").val() != null) ? $("#variableNameString").val() : undefined,
            phaseCode: ($("#phaseCodeString").val() != null) ? $("#phaseCodeString").val() : undefined,
            phaseName: ($("#phaseNameString").val() != null) ? $("#phaseNameString").val() : undefined,
            varLc: ($("#varLcString").val() != null) ? $("#varLcString").val() : undefined
        },
        success: function (response) {

            $.each(response, function (index, row) {
                if ($("#yearString").val() == null)
                    $("#yearString").append("<option value='" + row.Year + "'>" + row.Year + "</option>");
            });

            $('#yearString').trigger("chosen:updated");

        }
    });
}

function loadFilterVariable() {

    $.ajax({
        url: "/Variable/GetFieldList",
        type: 'POST',
        dataType: 'json',
        cache: false,
        traditional: true,
        headers: { "__RequestVerificationToken": token },
        data: {
            number: ($("#numberString").val() != null) ? $("#numberString").val() : undefined,
            variableName: ($("#variableNameString").val() != null) ? $("#variableNameString").val() : undefined,
            phaseCode: ($("#phaseCodeString").val() != null) ? $("#phaseCodeString").val() : undefined,
            phaseName: ($("#phaseNameString").val() != null) ? $("#phaseNameString").val() : undefined,
            varLc: ($("#varLcString").val() != null) ? $("#varLcString").val() : undefined
        },
        success: function (response) {

            var numberArray;
            var variableNameArray;
            var phaseCodeArray;
            var phaseNameArray;
            var varLcArray;

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
            if ($("#yearString").val() == null) {
                $('#yearString').empty();
                setTimeout(loadFilterYear(), 0);
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

            $('#numberString').trigger("chosen:updated");
            $('#variableNameString').trigger("chosen:updated");
            $('#phaseCodeString').trigger("chosen:updated");
            $('#phaseNameString').trigger("chosen:updated");
            $('#varLcString').trigger("chosen:updated");

        }
    });

}

// Filter Value
function FilterValue(selectSortable, pageNumber) {

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

    var sortable6;
    var pathImg6 = document.getElementById("idSortable6").src;
    if (pathImg6.includes("asc"))
        sortable6 = "asc";
    else if (pathImg6.includes("desc"))
        sortable6 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable6 = null;

    var sortable7;
    var pathImg7 = document.getElementById("idSortable7").src;
    if (pathImg7.includes("asc"))
        sortable7 = "asc";
    else if (pathImg7.includes("desc"))
        sortable7 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable7 = null;

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Value/GetValueList",
        headers: { "__RequestVerificationToken": token },
        data: {
            pmiCoding: ($("#pmiCodingString").val() != null) ? $("#pmiCodingString").chosen().val() : undefined,
            continentName: ($("#continentNameString").val() != null) ? $("#continentNameString").val() : undefined,
            regionName: ($("#regionNameString").val() != null) ? $("#regionNameString").val() : undefined,
            countryName: ($("#countryNameString").val() != null) ? $("#countryNameString").val() : undefined,
            continentCode: ($("#continentCodeString").val() != null) ? $("#continentCodeString").val() : undefined,
            regionCode: ($("#regionCodeString").val() != null) ? $("#regionCodeString").val() : undefined,
            countryCode: ($("#countryCodeString").val() != null) ? $("#countryCodeString").val() : undefined,
            areaCode: ($("#areaCodeString").val() != null) ? $("#areaCodeString").val() : undefined,
            year: ($("#yearString").val() != null) ? $("#yearString").val() : undefined,
            number: ($("#numberString").val() != null) ? $("#numberString").val() : undefined,
            variableName: ($("#variableNameString").val() != null) ? $("#variableNameString").val() : undefined,
            phaseCode: ($("#phaseCodeString").val() != null) ? $("#phaseCodeString").val() : undefined,
            phaseName: ($("#phaseNameString").val() != null) ? $("#phaseNameString").val() : undefined,
            varLc: ($("#varLcString").val() != null) ? $("#varLcString").val() : undefined,
            pageNumber: pageNumber,
            pageSize: $("#showEntry").val(),
            orderCountryName: (sortable1 != null && selectSortable == 1) ? sortable1 : undefined,
            orderVariableName: (sortable2 != null && selectSortable == 2) ? sortable2 : undefined,
            orderData: (sortable3 != null && selectSortable == 3) ? sortable3 : undefined,
            orderYear: (sortable4 != null && selectSortable == 4) ? sortable4 : undefined,
            orderPublicNotes: (sortable5 != null && selectSortable == 5) ? sortable5 : undefined,
            orderInternalNotes: (sortable6 != null && selectSortable == 6) ? sortable6 : undefined,
            orderDataUs: (sortable7 != null && selectSortable == 7) ? sortable7 : undefined
        },
        success: function (result) {
            $("#SetValueList").empty();
            $("#paged").empty();
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
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 1) {
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 2) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 3) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 4) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 5) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 6) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable7").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 7) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable5").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable6").src = "/Images/Sortable/bg.png";
            }
            // passo al tab dei row
            $("#collapseOne").prop('class', 'panel-collapse collapse');
            $("#collapseTwo").prop('class', 'panel-collapse collapse in');
            $("#collapseTitleOne").prop('class', 'collapsed');
            $("#collapseTitleTwo").prop('class', '');
        }
    })
}

// Sortable Value
function SortableName() {

    // cambio immagine
    var pathImg1 = document.getElementById("idSortable1").src;
    if (pathImg1.includes("asc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/desc.png";
    else if (pathImg1.includes("desc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";

    FilterValue(1, statusPage);

}

function SortableVariableName() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable2").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";

    FilterValue(2, statusPage);

}

function SortableData() {

    // cambio immagine
    var pathImg3 = document.getElementById("idSortable3").src;
    if (pathImg3.includes("asc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/desc.png";
    else if (pathImg3.includes("desc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";

    FilterValue(3, statusPage);

}

function SortableYear() {

    // cambio immagine
    var pathImg4 = document.getElementById("idSortable4").src;
    if (pathImg4.includes("asc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/desc.png";
    else if (pathImg4.includes("desc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";

    FilterValue(4, statusPage);

}

function SortablePublicNotes() {

    // cambio immagine
    var pathImg5 = document.getElementById("idSortable5").src;
    if (pathImg5.includes("asc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/desc.png";
    else if (pathImg5.includes("desc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";

    FilterValue(5, statusPage);

}

function SortableInternalNotes() {

    // cambio immagine
    var pathImg6 = document.getElementById("idSortable6").src;
    if (pathImg6.includes("asc"))
        document.getElementById("idSortable6").src = "/Images/Sortable/desc.png";
    else if (pathImg6.includes("desc"))
        document.getElementById("idSortable6").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable6").src = "/Images/Sortable/asc.png";

    FilterValue(6, statusPage);

}

function SortableDataUs() {

    // cambio immagine
    var pathImg3 = document.getElementById("idSortable7").src;
    if (pathImg3.includes("asc"))
        document.getElementById("idSortable7").src = "/Images/Sortable/desc.png";
    else if (pathImg3.includes("desc"))
        document.getElementById("idSortable7").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable7").src = "/Images/Sortable/asc.png";

    FilterValue(7, statusPage);

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

    var table = document.getElementById("SetValueList");
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
        DeleteValue();
    }

}

// copio i valori selezionati
function Copy() {

    // resetto array
    var rowDaCopiareArray = new Array();
    // numero di checked trovati
    var numeroCheck = 0;

    var table = document.getElementById("SetValueList");
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
            var table = document.getElementById("SetValueList");
            for (var i = 0; i < table.children.length; i++) {
                var riga = table.children[i];
                // vedo la cella checkbox
                var cellaCheckbox = riga.cells[0];
                var c = cellaCheckbox.children[0].children[0];
                if (c.checked) {
                    // suddivido ancora per quanto riguarda la linea
                    var res2 = res[m].split('\t');

                    // metto in preventivo che l'ultimo campo possa essere ""
                    if (res2.length < 5) {
                        swal("Attention!", "Number of columns is different from the copied values!", "error");
                        return;
                    }

                    var className = riga.className.replace("row_", "");
                    var countryCode = className.split("_")[0];
                    var year = className.split("_")[1];
                    var number = className.split("_")[2];

                    var varLc;
                    if (riga.children[6].outerText != "")
                        varLc = true;
                    else
                        varLc = false;

                    var data = res2[2].trim(' ');
                    var dataUs = res2[3].trim(' ');
                    var public = res2[6].trim(' ');
                    var internal = res2[7].trim(' ');

                    var sourceName = (res2.length > 8) ? res2[8] : null;
                    var link = (res2.length > 9) ? res2[9] : null;
                    var repository = (res2.length > 10) ? res2[10] : null;
                    var dateDownload = (res2.length > 11) ? res2[11] : null;
                    var username = (res2.length > 12) ? res2[12] : null;

                    // i valori ammessi sono anche nulli
                    if (data == null)
                        data = "null";

                    if (dataUs == null)
                        dataUs = "null";

                    if (public == null)
                        public = "null";

                    if (internal == null)
                        internal = "null";

                    if (sourceName == null)
                        sourceName = "null";

                    if (link == null)
                        link = "null";

                    if (repository == null)
                        repository = "null";

                    if (dateDownload == null)
                        dateDownload = "null";

                    if (username == null)
                        username = "null";

                    // controllo
                    if (Validation(data, dataUs, public, internal, sourceName, link, repository, dateDownload, username) == false)
                        return;

                    // cambio valori riga
                    riga.children[3].children[0].value = data;
                    if (varLc == true)
                        riga.children[4].children[0].value = dataUs;
                    riga.children[7].children[0].value = public;
                    riga.children[8].children[0].value = internal;
                    riga.children[9].children[0].value = sourceName;
                    riga.children[10].children[0].value = link;
                    riga.children[11].children[0].value = repository;
                    riga.children[12].children[0].value = dateDownload;
                    riga.children[13].children[0].value = username;
                    //riga.children[14].children[0].outerText = "";

                    // invio richiesta ajax per salvare
                    saveAjaxRequest(countryCode, number, year, varLc, data, dataUs, public, internal, sourceName, link, repository, dateDownload, username, riga);
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

function Validation(data, dataUs, public, internal, sourceName, link, repository, dateDownload, username) {

    // se è un numero
    if (isNaN(data) && !(data != "null" || data != "")) {
        swal("Attention!", data + ": isn't a number!", "error");
        return false;
    }

    if (isNaN(dataUs) && !(dataUs != "null" || dataUs != "")) {
        swal("Attention!", dataUs + ": isn't a number!", "error");
        return false;
    }

    // repository?
    if (RepositoryNameArray.includes((repository == "null" ? null : repository)) == false) {
        swal("Attention!", repository + ": check file name!", "error");
        return false;
    }

    // lunghezza della stringa
    if (public.length > publicNotesMax) {
        swal("Attention!", public + ": check length!", "error");
        return false;
    }

    if (internal.length > internalNotesMax) {
        swal("Attention!", internal + ": check length!", "error");
        return false;
    }

    if (sourceName != "null" || sourceName != "") {
        if (username != "null" || username != "") {
            if (username.length < usernameMin || username.length > usernameMax) {
                swal("Attention!", username + ": check length!", "error");
                return false;
            }
        }

        if (dateDownload != "null" || dateDownload != "") {
            if (dateDownload.length > 10 && (dateDownload != null || dateDownload != "")) {
                swal("Attention!", dateDownload + ": check length!", "error");
                return false;
            }
        }

        if (repository != "null" || repository != "") {
            if (repository.length > repositoryMax) {
                swal("Attention!", repository + ": check length!", "error");
                return false;
            }
        }

        if (link != "null" || link != "") {
            if (link.length > linkMax) {
                swal("Attention!", link + ": check length!", "error");
                return false;
            }
        }

    }
}

function Paste() {
    var numeroCheck = 0;

    var table = document.getElementById("SetValueList");
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