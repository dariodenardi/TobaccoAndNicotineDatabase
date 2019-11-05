// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    loadFilter();

    // Bootstrap-MaxLength (Modal)
    $('input#CountryName').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $('input#ContinentName').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $('input#RegionName').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $('input#PmiCoding').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

});

// inserisco gli elementi nella table
function DataBind(CountryList) {

    $("#LoadingStatus").html("Loading....");

    var SetData = $("#SetCountryList");
    for (var i = 0; i < CountryList.length; i++) {

        var Data = "<tr class='row_" + CountryList[i].CountryCode + "'>";

        if (boolAdmin || boolWriter) {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>"
                + "<td>" + "<input id=\"CountryNameTable" + i + "\"" + "class=\"form-control\" minlength=" + countryNameMin + " maxlength=" + countryNameMax + " type=\"textbox\" value=\"" + CountryList[i].CountryName + "\" placeholder=\"Insert " + countryName + "*\" onkeypress=\"saveRow(event, 0, '" + CountryList[i].CountryCode + "', CountryNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"RegionNameTable" + i + "\"" + "class=\"form-control\" minlength=" + regionNameMin + " maxlength=" + regionNameMax + " type=\"textbox\" value=\"" + CountryList[i].RegionName + "\" placeholder=\"Insert " + regionName + "*\" onkeypress=\"saveRow(event, 1, '" + CountryList[i].CountryCode + "', RegionNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"ContinentNameTable" + i + "\"" + "class=\"form-control\" minlength=" + continentNameMin + " maxlength=" + continentNameMax + " type=\"textbox\" value=\"" + CountryList[i].ContinentName + "\" placeholder=\"Insert " + continentName + "*\" onkeypress=\"saveRow(event, 2, '" + CountryList[i].CountryCode + "', ContinentNameTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"PmiCodingTable" + i + "\"" + "class=\"form-control\" minlength=" + pmiCodingMin + " maxlength=" + pmiCodingMax + " type=\"textbox\" value=\"" + CountryList[i].PmiCoding + "\" placeholder=\"Insert " + pmiCoding + "*\" onkeypress=\"saveRow(event, 3, '" + CountryList[i].CountryCode + "', PmiCodingTable" + i + ")\" >" + "</td>"
                + "<td>" + "<select id=\"AreaCodeTable" + i + "\"" + "class=\"form-control\" onchange=\"saveRowCombo('" + CountryList[i].CountryCode + "', AreaCodeTable" + i + ")\" ><option";

            if (CountryList[i].AreaCode == true) {
                Data += ">false</option><option selected>true</option></select></td>";
            } else
                Data += " selected>false</option><option>true</option></select></td>";

        } else {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>" +
                "<td>" + CountryList[i].CountryName + "</td>" +
                "<td>" + CountryList[i].RegionName + "</td>" +
                "<td>" + CountryList[i].ContinentName + "</td>" +
                "<td>" + CountryList[i].PmiCoding + "</td>" +
                "<td>" + CountryList[i].AreaCode + "</td>";
        }

        Data = Data + "<td>" +
            "<a href='#' class='btn btn-info btn-sm waves-effect' onclick='DetailsCountry(\"" + CountryList[i].CountryCode + "\")' ><span class='glyphicon glyphicon-eye-open'></span></a>";

        Data = Data + "</td>" + "</tr>";

        SetData.append(Data);

        // aggiungo caratteri campo
        $('input#CountryNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#RegionNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#ContinentNameTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });

        $('input#PmiCodingTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });
    }

    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    $('#SetCountryList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
}

// Show The Popup Modal For Add
function AddNewCountry() {
    $("#form")[0].reset();
    $("#ModalTitle").html("Add New Country");
    $('span[data-valmsg-for').html('');
    $("#PanelTitleAddEditDetails").html("New Country");
    $("#PanelCountry").prop('class', 'panel panel-default panel-success');
    $("#CreateCountry").prop('class', 'btn btn-success');
    $("#CreateCountry").show();
    $("#ViewValues").hide();
    $("#ViewCurrencies").hide();
    $("#ViewSources").hide();
    $("#ContinentCode").prop('readonly', '');
    $("#RegionCode").prop('readonly', '');
    $("#CountryCode").prop('readonly', '');
    $("#PmiCoding").prop('readonly', '');
    $("#RegionName").prop('readonly', '');
    $("#ContinentName").prop('readonly', '');
    $("#CountryName").prop('readonly', '');
    $("#AreaCode").prop('disabled', '');
    $("#MyModal").modal();
}

// Show The Popup Modal For Details
function DetailsCountry(countryCode) {
    $("#ModalTitle").html("Details Country");
    $('span[data-valmsg-for').html('');
    $("#PanelCountry").prop('class', 'panel panel-default panel-primary');
    $("#CreateCountry").hide();
    $("#ViewValues").show();
    $("#ViewCurrencies").show();
    $("#ViewSources").show();
    $("#ContinentCode").prop('readonly', 'readonly');
    $("#RegionCode").prop('readonly', 'readonly');
    $("#CountryCode").prop('readonly', 'readonly');
    $("#PmiCoding").prop('readonly', 'readonly');
    $("#RegionName").prop('readonly', 'readonly');
    $("#ContinentName").prop('readonly', 'readonly');
    $("#CountryName").prop('readonly', 'readonly');
    $("#AreaCode").prop('disabled', 'true');
    $("#MyModal").modal();
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Country/GetCountryById?countryCode=" + countryCode,
        success: function (data) {
            $("#PanelTitleAddEditDetails").html(data.CountryName);
            $("#ContinentCode").val(data.ContinentCode);
            $("#RegionCode").val(data.RegionCode);
            $("#CountryCode").val(data.CountryCode);
            $("#CountryName").val(data.CountryName);
            $("#ContinentName").val(data.ContinentName);
            $("#RegionName").val(data.RegionName);
            $("#PmiCoding").val(data.PmiCoding);
            $("#AreaCode").attr('checked', data.AreaCode);
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// invia richiesta Ajax per salvare un rows cambiato
function saveAjaxRequest(countryCode, countryName, regionName, continentName, pmiCoding, areaCode, id) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Country/Edit",
        headers: { '__RequestVerificationToken': token },
        data: {
            countryCode: countryCode,
            countryName: countryName,
            regionName: regionName,
            continentName: continentName,
            pmiCoding: pmiCoding,
            areaCode: areaCode,
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

function saveRowCombo(countryCode, id) {
    saveAjaxRequest(countryCode, "", "", "", "", id.value, id);
}

// Save Row
function saveRow(e, params, countryCode, id) {
    if (e.keyCode == 13) {

        var countryName = undefined;
        var regionName = undefined;
        var continentName = undefined;
        var pmiCoding = undefined;
        // non metto else if perchè potrei modificare tutti i valori della riga (paste)
        if (params == '0')
            countryName = id.value
        if (params == '1')
            regionName = id.value
        if (params == '2')
            continentName = id.value
        if (params == '3')
            pmiCoding = id.value

        saveAjaxRequest(countryCode, countryName, regionName, continentName, pmiCoding, "", id);

        return false; // returning false will prevent the event from bubbling up.
    }
    else {
        return true;
    }
}

// Show The Popup Modal For Create
$("#CreateCountry").click(function () {
    var data = $("#SubmitForm").serialize();

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Country/Create",
        headers: { '__RequestVerificationToken': token },
        data: data,
        success: function (data) {
            var isSuccessful = (data['success']);

            if (isSuccessful) {
                $("#MyModal").modal("hide");
                swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                    function () {
                        FilterCountry(0);
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
var DeleteCountry = function () {
    $("#PanelTitleDelete").html("Delete Country/s");
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
            url: "/Country/Delete",
            data: { CountryName: rowDaCancellareArray[i] },
            headers: { "__RequestVerificationToken": token },
            success: function (result) {
                if (result == true) {
                    $("#DeleteConfirmation").modal("hide");
                    swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                        function () {
                            FilterCountry(0);
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

// Filter Country
function FilterCountry(selectSortable) {

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
        url: "/Country/GetCountryList",
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
            orderCountryName: (sortable1 != null && selectSortable == 1) ? sortable1 : '',
            orderRegionName: (sortable2 != null && selectSortable == 2) ? sortable2 : '',
            orderContinentName: (sortable3 != null && selectSortable == 3) ? sortable3 : '',
            orderPmi: (sortable4 != null && selectSortable == 4) ? sortable4 : '',
            orderAreaCode: (sortable5 != null && selectSortable == 5) ? sortable5 : '',
        },
        success: function (result) {
            $("#SetCountryList").empty();
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

// Sortable Country
function SortableName() {

    // cambio immagine
    var pathImg1 = document.getElementById("idSortable1").src;
    if (pathImg1.includes("asc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/desc.png";
    else if (pathImg1.includes("desc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";

    FilterCountry(1);

}

function SortableRegionName() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable2").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";

    FilterCountry(2);

}

function SortableContinentName() {

    // cambio immagine
    var pathImg1 = document.getElementById("idSortable3").src;
    if (pathImg1.includes("asc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/desc.png";
    else if (pathImg1.includes("desc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";

    FilterCountry(3);

}

function SortablePmi() {

    // cambio immagine
    var pathImg4 = document.getElementById("idSortable4").src;
    if (pathImg4.includes("asc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/desc.png";
    else if (pathImg4.includes("desc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";

    FilterCountry(4);

}

function SortableAreaCode() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable5").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";

    FilterCountry(5);

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

    var table = document.getElementById("SetCountryList");
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
        DeleteCountry();
    }

}

// copio i valori selezionati
function Copy() {

    // resetto array
    var rowDaCopiareArray = new Array();
    // numero di checked trovati
    var numeroCheck = 0;

    var table = document.getElementById("SetCountryList");
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
            var table = document.getElementById("SetCountryList");
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

                    if (res2.length < 2) {
                        swal("Attention!", "Number of columns is different from the copied values!", "error");
                        return;
                    }

                    var countryName = res2[0].trim('\r').trim('\n');
                    var regionName = res2[1].trim('\r').trim('\n');
                    var continentName = res2[2].trim('\r').trim('\n');
                    var pmiCoding = res2[3].trim('\r').trim('\n');
                    var areaCode = res2[4].trim('\r').trim('\n');

                    // cambio valori riga
                    riga.children[1].children[0].value = countryName;
                    riga.children[2].children[0].value = regionName;
                    riga.children[3].children[0].value = continentName;
                    riga.children[4].children[0].value = pmiCoding;

                    if (areaCode == "false")
                        riga.children[5].children[0].selectedIndex = 0;
                    else
                        riga.children[5].children[0].selectedIndex = 1;

                    // invio richiesta ajax per salvare
                    saveAjaxRequest(number, countryName, regionName, continentName, pmiCoding, areaCode, riga);

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

    var table = document.getElementById("SetCountryList");
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