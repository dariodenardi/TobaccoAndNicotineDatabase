// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    loadFilter();
    loadCountrySelect();

    // Bootstrap-MaxLength (Modal)
    $('input#Notes').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

});

// inserisco gli elementi nella table
function DataBind(CurrencyList) {

    $("#LoadingStatus").html("Loading....");

    var SetData = $("#SetCurrencyList");
    for (var i = 0; i < CurrencyList.length; i++) {

        var Data = "<tr class='row_" + CurrencyList[i].CountryCode + "_" + CurrencyList[i].Year + "'>";

        if (boolAdmin || boolWriter) {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>"
                + "<td>" + CurrencyList[i].CountryName + "</td>"
                + "<td>" + CurrencyList[i].Year + "</td>"
                + "<td>" + "<input id=\"ValueTable" + i + "\"" + "class=\"form-control\" type=\"textbox\" value=\"" + CurrencyList[i].Value + "\" placeholder=\"Insert " + '@value' + "*\" onkeypress=\"saveRow(event, 1, '" + CurrencyList[i].CountryCode + "', " + CurrencyList[i].Year + ", ValueTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"NotesTable" + i + "\"" + "class=\"form-control\" maxlength=" + notesNameMax + " type=\"textbox\" value=\"" + CurrencyList[i].Notes + "\" placeholder=\"Insert " + '@notes' + "\" onkeypress=\"saveRow(event, 2, '" + CurrencyList[i].CountryCode + "', " + CurrencyList[i].Year + ", NotesTable" + i + ")\" >" + "</td>";

        } else {
            Data = Data + "<td>" + CurrencyList[i].CountryName + "</td>" +
                "<td>" + CurrencyList[i].Year + "</td>" +
                "<td>" + CurrencyList[i].Value + "</td>" +
                "<td>" + CurrencyList[i].Notes + "</td>";
        }

        Data = Data + "<td>" +
            "<a href='#' class='btn btn-info btn-sm waves-effect' onclick='DetailsCurrency(\"" + CurrencyList[i].CountryCode + "\", " + CurrencyList[i].Year + ")' ><span class='glyphicon glyphicon-eye-open'></span></a>";

        Data = Data + "</td>" + "</tr>";

        SetData.append(Data);

        // aggiungo caratteri campo
        $('input#NotesTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });
    }

    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    $('#SetCurrencyList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
}

function AddNewCurrency() {
    $("#form")[0].reset();
    $("#ModalTitle").html("Add New Currency");
    $('span[data-valmsg-for').html('');
    $("#PanelTitleAddEditDetails").html("New Currency");
    $("#PanelCurrency").prop('class', 'panel panel-default panel-success');
    $("#CreateCurrency").prop('class', 'btn btn-success');
    $("#CreateCurrency").show();
    $("#ViewRegion").hide();
    $("#ViewCountry").hide();
    $("#ViewValues").hide();
    $("#ViewSources").hide();
    $("#Value").prop('readonly', '');
    $("#Year").prop('readonly', '');
    $("#Notes").prop('readonly', '');
    $("#MyModal").modal();
}

//Show The Popup Modal For Details

function DetailsCurrency(CountryCode, year) {
    $("#ModalTitle").html("Details Currency");
    $('span[data-valmsg-for').html('');
    $("#PanelCurrency").prop('class', 'panel panel-default panel-primary');
    $("#CreateCurrency").hide();
    $("#ViewRegion").show();
    $("#ViewCountry").show();
    $("#ViewValues").show();
    $("#ViewSources").show();
    $("#Value").prop('readonly', 'readonly');
    $("#Year").prop('readonly', 'readonly');
    $("#Notes").prop('readonly', 'readonly');
    $("#MyModal").modal();
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Currency/GetCurrencyById?countryCode=" + CountryCode + "&year=" + year,
        success: function (data) {
            $("#PanelTitleAddEditDetails").html(CountryName);
            $("#CountryCode").val(data.CountryCode);
            $("#Value").val(data.Value);
            $("#Year").val(data.Year);
            if (data.Notes == '')
                $("#Notes").val(" ");
            else
                $("#Notes").val(data.Notes);
        }
    })
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
            $("#countryList").append("<option value='select'>Select Country</option>");
            for (var i = 0, n = data.length; i < n; i++) {
                $("#countryList").append("<option value='" + data[i].CountryCode + "'>" + data[i].CountryName + "</option>");
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

// invia richiesta Ajax per salvare un rows cambiato
function saveAjaxRequest(countryCode, year, value, note, id) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Currency/Edit",
        headers: { '__RequestVerificationToken': token },
        data: {
            countryCode: countryCode,
            year: year,
            value: value,
            note: note,
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

// Save Row
function saveRow(e, params, countryCode, year, id) {
    if (e.keyCode == 13) {

        var value;
        var note = undefined;
        if (params == '1')
            value = id.value
        if (params == '2')
            note = id.value

        saveAjaxRequest(countryCode, year, value, note, id);

        return false; // returning false will prevent the event from bubbling up.
    }
    else {
        return true;
    }
}

//Show The Popup Modal For Create

$("#CreateCurrency").click(function () {
    var data = $("#SubmitForm").serialize();

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Currency/Create",
        headers: { '__RequestVerificationToken': token },
        data: data,
        success: function (data) {
            var isSuccessful = (data['success']);

            if (isSuccessful) {
                $("#MyModal").modal("hide");
                swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                    function () {
                        FilterCurrency(0);
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
var DeleteCurrency = function () {
    $("#PanelTitleDelete").html("Delete Currency/s");
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
            url: "/Currency/Delete",
            data: {
                countryCode: rowDaCancellareArray[i].split("_")[0],
                year: rowDaCancellareArray[i].split("_")[1],
            },
            headers: { "__RequestVerificationToken": token },
            success: function (result) {
                if (result == true) {
                    $("#DeleteConfirmation").modal("hide");
                    swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                        function () {
                            FilterCurrency(0);
                        }
                    );
                } else {
                    $('#DeleteConfirmation').modal('hide');
                    swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                }

            }
        })
    }
}

// ComboBox element
function loadFilter() {

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
            areaCode: ($("#areaCodeString").val() != null) ? $("#areaCodeString").val() : undefined,
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
            if ($("#yearString").val() == null) {
                $('#yearString').empty();
                setTimeout(loadFilterYear(), 0);
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
        url: "/Currency/GetFieldList",
        type: 'POST',
        dataType: 'json',
        cache: false,
        traditional: true,
        headers: { "__RequestVerificationToken": token },
        data: (($("#pmiCodingString").val() != null) ? 'pmiCoding=' : '') + (($("#pmiCodingString").val() != null) ? encodeURIComponent($("#pmiCodingString").val()) + '&' : '') +
            (($("#continentNameString").val() != null) ? 'continentName=' : '') + (($("#continentNameString").val() != null) ? encodeURIComponent($("#continentNameString").val()) + '&' : '') +
            (($("#regionNameString").val() != null) ? 'regionName=' : '') + (($("#regionNameString").val() != null) ? encodeURIComponent($("#regionNameString").val()) + '&' : '') +
            (($("#countryNameString").val() != null) ? 'countryName=' : '') + (($("#countryNameString").val() != null) ? encodeURIComponent($("#countryNameString").val()) + '&' : '') +
            (($("#continentCodeString").val() != null) ? 'continentCode=' : '') + (($("#continentCodeString").val() != null) ? encodeURIComponent($("#continentCodeString").val()) + '&' : '') +
            (($("#regionCodeString").val() != null) ? 'regionCode=' : '') + (($("#regionCodeString").val() != null) ? encodeURIComponent($("#regionCodeString").val()) + '&' : '') +
            (($("#countryCodeString").val() != null) ? 'countryCode=' : '') + (($("#countryCodeString").val() != null) ? encodeURIComponent($("#countryCodeString").val()) + '&' : '') +
            (($("#areaCodeString").val() != null) ? 'areaCode=' : '') + (($("#areaCodeString").val() != null) ? encodeURIComponent($("#areaCodeString").val()) + '&' : '') +
            (($("#yearString").val() != null) ? 'year=' : '') + (($("#yearString").val() != null) ? encodeURIComponent($("#yearString").val()) : ''),
        success: function (response) {

            $.each(response, function (index, row) {
                if ($("#yearString").val() == null)
                    $("#yearString").append("<option value='" + row.Year + "'>" + row.Year + "</option>");
            });

            $('#yearString').trigger("chosen:updated");

        }
    });
}

// Filter Currency
function FilterCurrency(selectSortable) {

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

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Currency/GetCurrencyList",
        headers: { "__RequestVerificationToken": token },
        data: (($("#pmiCodingString").val() != null) ? 'pmiCoding=' : '') + (($("#pmiCodingString").val() != null) ? encodeURIComponent($("#pmiCodingString").val()) + '&' : '') +
            (($("#continentNameString").val() != null) ? 'continentName=' : '') + (($("#continentNameString").val() != null) ? encodeURIComponent($("#continentNameString").val()) + '&' : '') +
            (($("#regionNameString").val() != null) ? 'regionName=' : '') + (($("#regionNameString").val() != null) ? encodeURIComponent($("#regionNameString").val()) + '&' : '') +
            (($("#countryNameString").val() != null) ? 'countryName=' : '') + (($("#countryNameString").val() != null) ? encodeURIComponent($("#countryNameString").val()) + '&' : '') +
            (($("#continentCodeString").val() != null) ? 'continentCode=' : '') + (($("#continentCodeString").val() != null) ? encodeURIComponent($("#continentCodeString").val()) + '&' : '') +
            (($("#regionCodeString").val() != null) ? 'regionCode=' : '') + (($("#regionCodeString").val() != null) ? encodeURIComponent($("#regionCodeString").val()) + '&' : '') +
            (($("#countryCodeString").val() != null) ? 'countryCode=' : '') + (($("#countryCodeString").val() != null) ? encodeURIComponent($("#countryCodeString").val()) + '&' : '') +
            (($("#areaCodeString").val() != null) ? 'areaCode=' : '') + (($("#areaCodeString").val() != null) ? encodeURIComponent($("#areaCodeString").val()) + '&' : '') +
            (($("#yearString").val() != null) ? 'year=' : '') + (($("#yearString").val() != null) ? encodeURIComponent($("#yearString").val()) + '&' : '') +
            ((sortable1 != null && selectSortable == 1) ? 'orderCountryName=' : '') + ((sortable1 != null && selectSortable == 1) ? sortable1 + '&' : '') +
            ((sortable2 != null && selectSortable == 2) ? 'orderYear=' : '') + ((sortable2 != null && selectSortable == 2) ? sortable2 + '&' : '') +
            ((sortable3 != null && selectSortable == 3) ? 'orderValue=' : '') + ((sortable3 != null && selectSortable == 3) ? sortable3 + '&' : '') +
            ((sortable4 != null && selectSortable == 4) ? 'orderNotes=' : '') + ((sortable4 != null && selectSortable == 4) ? sortable4 : ''),
        success: function (result) {
            $("#SetCurrencyList").empty();
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
            } else if (selectSortable == 1) {
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 2) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 3) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable4").src = "/Images/Sortable/bg.png";
            } else if (selectSortable == 4) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable2").src = "/Images/Sortable/bg.png";
                document.getElementById("idSortable3").src = "/Images/Sortable/bg.png";
            }
            // passo al tab dei row
            $("#collapseOne").prop('class', 'panel-collapse collapse');
            $("#collapseTwo").prop('class', 'panel-collapse collapse in');
            $("#collapseTitleOne").prop('class', 'collapsed');
            $("#collapseTitleTwo").prop('class', '');
        }
    })
}

// Sortable Currency
function SortableName() {

    // cambio immagine
    var pathImg1 = document.getElementById("idSortable1").src;
    if (pathImg1.includes("asc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/desc.png";
    else if (pathImg1.includes("desc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";

    FilterCurrency(1);

}

function SortableYear() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable2").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";

    FilterCurrency(2);

}

function SortableValue() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable3").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";

    FilterCurrency(3);

}

function SortableNotes() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable4").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";

    FilterCurrency(4);

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

    var table = document.getElementById("SetCurrencyList");
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
        DeleteCurrency();
    }

}

// copio i valori selezionati
function Copy() {

    // resetto array
    var rowDaCopiareArray = new Array();
    // numero di checked trovati
    var numeroCheck = 0;

    var table = document.getElementById("SetCurrencyList");
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
            var table = document.getElementById("SetCurrencyList");
            for (var i = 0; i < table.children.length; i++) {
                var riga = table.children[i];

                var className = riga.className;
                var countryCode = className.replace("row_", "").split("_")[0];
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

                    var countryName;
                    if (riga.children[1].children.length > 0)
                        countryName = riga.children[1].children[0].value;
                    else
                        countryName = riga.children[1].outerText;

                    var year;
                    if (riga.children[2].children.length > 0)
                        year = riga.children[2].children[0].value;
                    else
                        year = riga.children[2].outerText;

                    var country = res2[0].trim('\r').trim('\n');
                    var y = res2[1].trim('\r').trim('\n');

                    if (country != countryName || year != y) {
                        swal("Attention!", "You want to paste different countries. Also check the years", "error");
                        return;
                    }

                    var value = res2[2];
                    var note = res2[3];

                    // cambio valori riga
                    riga.children[3].children[0].value = value;
                    riga.children[4].children[0].value = note;

                    // invio richiesta ajax per salvare
                    saveAjaxRequest(countryCode, year, value, note, riga)

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

    var table = document.getElementById("SetCurrencyList");
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