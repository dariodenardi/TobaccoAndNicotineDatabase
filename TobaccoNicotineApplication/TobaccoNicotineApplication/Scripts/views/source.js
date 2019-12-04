// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    loadFilter();
    loadCountrySelect();
    loadVariableSelect();
    loadYearSelect();
    getRepositoryNameArray();

    // Bootstrap-MaxLength (Modal)
    $('input#SourceLink').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $('input#SourceName').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $('input#SourceUsername').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $("#datepicker-inline").datepicker({
        format: "mm/dd/yyyy",
        altField: "#DateDownload"
    }).datepicker("setDate", new Date());
});

// serve quando nella SourceList posso cambiare file tra quelli già nel repository
var RepositoryNameArray = new Array();

// inserisco gli elementi nella table
function DataBind(SourceList) {

    $("#LoadingStatus").html("Loading....");

    var SetData = $("#SetSourceList");
    for (var i = 0; i < SourceList.length; i++) {

        // json to dateTime format
        var seconds2 = parseInt(SourceList[i].Date.replace(/\/Date\(([0-9]+)[^+]\//i, "$1"));
        var date2 = new Date(seconds2);
        var options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        var Data = "<tr class='row_" + SourceList[i].Name + "_" + date2.toLocaleDateString("en-US", options) + "_" + SourceList[i].Time.Hours + ":" + SourceList[i].Time.Minutes + ":" + SourceList[i].Time.Seconds + "'>";

        if (boolAdmin || boolWriter) {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>"
                + "<td>" + SourceList[i].Name + "</td>"
                + "<td>" + "<input id=\"SourceLinkTable" + i + "\"" + "class=\"form-control\" maxlength=" + linkMax + " type=\"textbox\" value=\"" + SourceList[i].Link + "\" placeholder=\"Insert " + sourceLink + "*\" onkeypress=\"saveRow(event, 0, '" + SourceList[i].Name + "', '" + date2.toLocaleDateString("en-US", options) + "', '" + SourceList[i].Time.Hours + ":" + SourceList[i].Time.Minutes + ":" + SourceList[i].Time.Seconds + "', SourceLinkTable" + i + ")\" >" + "</td>"
                + "<td><select id=\"selectRepository" + i + "\" class=\"form-control\" onchange=\"saveRowCombo('" + SourceList[i].Name + "', '" + date2.toLocaleDateString("en-US", options) + "', '" + SourceList[i].Time.Hours + ":" + SourceList[i].Time.Minutes + ":" + SourceList[i].Time.Seconds + "', selectRepository" + i + ")\"></select></td>"
                + "<td>" + "<input id=\"DateDownloadTable" + i + "\"" + "class=\"form-control\" maxlength=" + dateDownloadMax + " type=\"textbox\" value=\"" + SourceList[i].DateDownload + "\" placeholder=\"Insert " + sourceDateDownload + "*\" onkeypress=\"saveRow(event, 1, '" + SourceList[i].Name + "', '" + date2.toLocaleDateString("en-US", options) + "', '" + SourceList[i].Time.Hours + ":" + SourceList[i].Time.Minutes + ":" + SourceList[i].Time.Seconds + "', DateDownloadTable" + i + ")\" >" + "</td>"
                + "<td>" + "<input id=\"SourceUsernameTable" + i + "\"" + "class=\"form-control\" maxlength=" + usernameMax + " type=\"textbox\" value=\"" + SourceList[i].Username + "\" placeholder=\"Insert " + sourceUsername + "\" onkeypress=\"saveRow(event, 2, '" + SourceList[i].Name + "', '" + date2.toLocaleDateString("en-US", options) + "', '" + SourceList[i].Time.Hours + ":" + SourceList[i].Time.Minutes + ":" + SourceList[i].Time.Seconds + "', SourceUsernameTable" + i + ")\" >" + "</td>";
        } else {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>" +
                "<td>" + SourceList[i].Name + "</td>" +
                "<td>" + SourceList[i].Link + "</td>" +
                "<td>" + SourceList[i].Repository + "</td>" +
                "<td>" + SourceList[i].DateDownload + "</td>" +
                "<td>" + SourceList[i].Username + "</td>";
        }

        /*Data = Data + "<td>" +
            "<div class=\"dropdown\">" +
            "<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" id=\"about-us\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">" +
            "Search" +
            "<span class=\"caret\"></span></button>" +
            "<ul class=\"dropdown-menu dropdownTable\" aria-labelledby=\"about-us\">" +
            "<li><a href=\"#\">Values</a></li>" +
            "</ul>" +
            "</div>";*/

        if (SourceList[i].Repository != null) {
            Data = Data +
                "<td>" + "<a target=\"_blank\" rel=\"noopener noreferrer\" href='" + serverMap + "/" + SourceList[i].Repository + "' class='btn btn-dark btn-sm waves-effect'><span class='glyphicon glyphicon-file'></span></a>" + "</td>";
        } else {
            Data = Data +
                "<td>" + "</td>";
        }

        Data = Data + "</td>" + "</tr>";

        SetData.append(Data);

        for (var t = 0; t < RepositoryNameArray.length; t++) {
            $("#selectRepository" + i).append("<option value='" + RepositoryNameArray[t] + "'>" + RepositoryNameArray[t] + "</option>");
        }
        $("#selectRepository" + i + " option[value='" + SourceList[i].Repository + "']").attr('selected', 'selected');

        // aggiungo caratteri campo
        $('input#SourceLinkTable' + i).maxlength({
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
    $('#SetSourceList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
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

function AddNewSource() {
    $("#form")[0].reset();
    $("#ModalTitle").html("Add New Source");
    $('span[data-valmsg-for').html('');
    $("#PanelTitleAddEditDetails").html("New Source");
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

function loadYearSelect() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Value/GetListValueYear",
        success: function (data) {
            $("#yearList").append("<option value='' disabled selected>Select Year</option>");
            for (var i = 0, n = data.length; i < n; i++) {
                $("#yearList").append("<option value='" + data[i].Year + "'>" + data[i].Year + "</option>");
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
function saveAjaxRequest(sourceName, sourceDate, sourceTime, link, dateDownload, username, repository, id) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Source/Edit",
        headers: { '__RequestVerificationToken': token },
        data: {
            SourceName: sourceName,
            date: sourceDate,
            time: sourceTime,
            link: link,
            repository: repository,
            dateDownload: dateDownload,
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

function saveRowCombo(sourceName, sourceDate, sourceTime, id) {
    saveAjaxRequest(sourceName, sourceDate, sourceTime, "", "", "", id.value, id);
}

// Save Row
function saveRow(e, params, sourceName, sourceDate, sourceTime, id) {
    if (e.keyCode == 13) {

        var link = undefined;
        var dateDownload = undefined;
        var username = undefined;
        if (params == '0')
            link = id.value;
        if (params == '1')
            dateDownload = id.value;
        if (params == '2')
            username = id.value;

        saveAjaxRequest(sourceName, sourceDate, sourceTime, link, dateDownload, username, "", id);

        return false; // returning false will prevent the event from bubbling up.
    }
    else {
        return true;
    }
}

// Show The Popup Modal For Create
$("#CreateSource").click(function () {
    var data = $("#SubmitForm").serialize();

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Source/Create",
        headers: { '__RequestVerificationToken': token },
        data: data,
        success: function (data) {
            var isSuccessful = (data['success']);

            if (isSuccessful) {
                $("#MyModal").modal("hide");
                swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                    function () {
                        FilterSource(0);
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
var DeleteSource = function () {
    $("#PanelTitleDelete").html("Delete Source/s");
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
            url: "/Source/Delete",
            data: {
                sourceName: rowDaCancellareArray[i].split("_")[0],
                date: rowDaCancellareArray[i].split("_")[1],
                time: rowDaCancellareArray[i].split("_")[2]
            },
            headers: { "__RequestVerificationToken": token },
            success: function (result) {
                if (result == true) {
                    $("#DeleteConfirmation").modal("hide");
                    swal({ title: "Good job!", text: "Your changes have been applied!", type: "success" },
                        function () {
                            FilterSource(0);
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
        url: "/Source/GetFieldList",
        type: 'POST',
        dataType: 'json',
        cache: false,
        traditional: true,
        headers: { "__RequestVerificationToken": token },
        data: {
            name: ($("#sourceNameString").val() != null) ? $("#sourceNameString").val() : undefined,
            link: ($("#sourceLinkString").val() != null) ? $("#sourceLinkString").val() : undefined,
            repository: ($("#sourceRepositoryString").val() != null) ? $("#sourceRepositoryString").val() : undefined,
            dateSource: ($("#sourceDateSourceString").val() != null) ? $("#sourceDateSourceString").val() : undefined,
            username: ($("#sourceUsernameString").val() != null) ? $("#sourceUsernameString").val() : undefined
        },
        success: function (response) {

            var nameArray;
            var linkArray;
            var repositoryArray;
            var dateSourceArray;
            var usernameArray;

            if ($("#sourceNameString").val() == null) {
                $("#sourceNameString").empty();
                nameArray = new Array();
            }
            if ($("#sourceLinkString").val() == null) {
                $("#sourceLinkString").empty();
                linkArray = new Array();
            }
            if ($("#sourceRepositoryString").val() == null) {
                $("#sourceRepositoryString").empty();
                repositoryArray = new Array();
            }
            if ($("#sourceDateSourceString").val() == null) {
                $("#sourceDateSourceString").empty();
                dateSourceArray = new Array();
            }
            if ($("#sourceUsernameString").val() == null) {
                $("#sourceUsernameString").empty();
                usernameArray = new Array();
            }

            $.each(response, function (index, row) {
                if ($("#sourceNameString").val() == null)
                    if (nameArray.includes(row.Name) == false)
                        nameArray.push(row.Name);

                if ($("#sourceLinkString").val() == null)
                    if (linkArray.includes(row.Link) == false)
                        linkArray.push(row.Link);

                if ($("#sourceRepositoryString").val() == null)
                    if (repositoryArray.includes(row.Repository) == false)
                        repositoryArray.push(row.Repository);

                if ($("#sourceDateSourceString").val() == null)
                    if (dateSourceArray.includes(row.DateDownload) == false)
                        dateSourceArray.push(row.DateDownload);

                if ($("#sourceUsernameString").val() == null)
                    if (usernameArray.includes(row.Username) == false)
                        usernameArray.push(row.Username);

            });

            // ordino array
            if ($("#sourceNameString").val() == null) {
                nameArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = nameArray.length; i < n; i++) {
                    $("#sourceNameString").append("<option value='" + nameArray[i] + "'>" + nameArray[i] + "</option>");
                }
            }

            if ($("#sourceLinkString").val() == null) {
                linkArray.sort();
                for (var i = 0, n = linkArray.length; i < n; i++) {
                    $("#sourceLinkString").append("<option value='" + linkArray[i] + "'>" + linkArray[i] + "</option>");
                }
            }

            if ($("#sourceRepositoryString").val() == null) {
                repositoryArray.sort(function (a, b) {
                    return parseInt(a) - parseInt(b);
                });
                for (var i = 0, n = repositoryArray.length; i < n; i++) {
                    $("#sourceRepositoryString").append("<option value='" + repositoryArray[i] + "'>" + repositoryArray[i] + "</option>");
                }
            }

            if ($("#sourceDateSourceString").val() == null) {
                dateSourceArray.sort();
                for (var i = 0, n = dateSourceArray.length; i < n; i++) {
                    $("#sourceDateSourceString").append("<option value='" + dateSourceArray[i] + "'>" + dateSourceArray[i] + "</option>");
                }
            }

            if ($("#sourceUsernameString").val() == null) {
                usernameArray.sort();
                for (var i = 0, n = usernameArray.length; i < n; i++) {
                    $("#sourceUsernameString").append("<option value='" + usernameArray[i] + "'>" + usernameArray[i] + "</option>");
                }
            }

            $('#sourceNameString').trigger("chosen:updated");
            $('#sourceLinkString').trigger("chosen:updated");
            $('#sourceRepositoryString').trigger("chosen:updated");
            $('#sourceDateSourceString').trigger("chosen:updated");
            $('#sourceUsernameString').trigger("chosen:updated");

        }
    });

}



//Sortable Source

function SortableName() {

    // cambio immagine
    var pathImg1 = document.getElementById("idSortable1").src;
    if (pathImg1.includes("asc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/desc.png";
    else if (pathImg1.includes("desc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";

    FilterSource(1);

}

function SortableLink() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable2").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable2").src = "/Images/Sortable/asc.png";

    FilterSource(2);

}

function SortableRepository() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable3").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable3").src = "/Images/Sortable/asc.png";

    FilterSource(3);

}

function SortableDateDownload() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable4").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable4").src = "/Images/Sortable/asc.png";

    FilterSource(4);

}

function SortableUsername() {

    // cambio immagine
    var pathImg2 = document.getElementById("idSortable5").src;
    if (pathImg2.includes("asc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/desc.png";
    else if (pathImg2.includes("desc"))
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable5").src = "/Images/Sortable/asc.png";

    FilterSource(5);

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

    var table = document.getElementById("SetSourceList");
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
        DeleteSource();
    }

}

// copio i valori selezionati
function Copy() {

    // resetto array
    var rowDaCopiareArray = new Array();
    // numero di checked trovati
    var numeroCheck = 0;

    var table = document.getElementById("SetSourceList");
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
            var table = document.getElementById("SetSourceList");
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
                    var sourceName = className.split("_")[0];
                    var sourceDate = className.split("_")[1];
                    var sourceTime = className.split("_")[2];

                    var link = res2[1].trim(' ');
                    var repository = res2[2].trim(' ');
                    var dateDownload = res2[3].trim(' ');
                    var username = res2[4].trim(' ');

                    // i valori ammessi sono anche nulli
                    if (link == null || link == "")
                        link = "null";

                    if (dateDownload == null || dateDownload == "")
                        dateDownload = "null";

                    if (repository == null || repository == "")
                        repository = "null";

                    // controllo
                    if (Validation(link, repository, dateDownload, username) == false)
                        return;

                    // cambio valori riga
                    riga.children[2].children[0].value = link;
                    riga.children[3].children[0].value = repository;
                    riga.children[4].children[0].value = dateDownload;
                    riga.children[5].children[0].value = username;

                    // invio richiesta ajax per salvare
                    saveAjaxRequest(sourceName, sourceDate, sourceTime, link, dateDownload, username, repository, riga);

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

function Validation(link, repository, dateDownload, username) {

    // valori nulli?

    // repository?
    if (RepositoryNameArray.includes((repository == "null" ? null : repository)) == false) {
        swal("Attention!", repository + ": check file name!", "error");
        return false;
    }

    // lunghezza della stringa
    if (username.length < usernameMin || username.length > usernameMax) {
        swal("Attention!", username + ": check length!", "error");
        return false;
    }

    if (dateDownload.length > 10 && (dateDownload != null || dateDownload != "")) {
        swal("Attention!", dateDownload + ": check length!", "error");
        return false;
    }

    if (repository.length > repositoryMax) {
        swal("Attention!", repository + ": check length!", "error");
        return false;
    }

    if (link.length > linkMax) {
        swal("Attention!", link + ": check length!", "error");
        return false;
    }

}

function Paste() {
    var numeroCheck = 0;

    var table = document.getElementById("SetSourceList");
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


//www.freeformatter.com/mime-types-list.html
Dropzone.options.myDropzone = {
    paramName: "file",
    autoProcessQueue: true,
    parallelUploads: 1,
    maxFiles: 150,
    acceptedFiles: "image/*,text/csv,application/pdf,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    maxFilesize: 50, //MB
    addRemoveLinks: true,
    headers: { "__RequestVerificationToken": token },
    success: function (file, response) {

        if (response.success == true) {
            file.previewElement.classList.add("dz-success");
            $(".dz-preview:last-child").attr('id', "document-" + file.serverId);
        }
        else {
            // se file esiste
            if (response.directoryName != null) {
                //Warning Message
                swal({
                    title: "There is a file, do you want to delete it?",
                    text: "File name: " + file.name,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: 'btn-warning',
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                }, function () {

                    // invio richiesta per cancellare il file
                    $.ajax({
                        url: '/Source/DeleteFile',
                        headers: { '__RequestVerificationToken': token },
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            file: response.directoryName
                        },
                        success: function (res) {
                            // risultato della risposta
                            if (res == true) {
                                // Allow file to be reuploaded !
                                var myDropzone = Dropzone.forElement(".dropzone");
                                file.status = "queued";
                                myDropzone.processQueue();
                                // rimuovo classe errore
                                file.previewElement.classList.remove("dz-error");
                                swal.close();
                            } else {
                                swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                            }
                        }
                    });

                }); // swal
            } // if se file esiste

            file.previewElement.classList.add("dz-error");
            $(file.previewElement).addClass("dz-error").find('.dz-error-message').text(response.response);
        }
    },
    error: function (file, errorMessage, xhr) {

        file.previewElement.classList.add("dz-error");
        $(file.previewElement).addClass("dz-error").find('.dz-error-message').text(errorMessage.response);

    },

    init: function () {
        this.on("addedfile", function (file) {
            // prevent duplicate
            if (this.files.length) {
                var _i, _len;
                for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
                {
                    if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                        this.removeFile(file);
                    }
                }
            }

        });

        this.on("removedfile", function (file) {
            // Only files that have been programmatically added should
            // have a url property.

        });

    },
    url: "/Source/LoadSource"
};