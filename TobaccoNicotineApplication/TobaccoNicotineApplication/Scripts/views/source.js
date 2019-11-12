// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    loadFilter();

    // Bootstrap-MaxLength (Modal)
    $('input#SourceLink').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $('input#SourceName').maxlength({
        alwaysShow: true,
        placement: 'top-left'
    });

    $("#datepicker-inline").datepicker({
        format: "mm/dd/yyyy",
        altField: "#DateDownload"
    });
});

// inserisco gli elementi nella table
function DataBind(SourceList) {

    $("#LoadingStatus").html("Loading....");

    var SetData = $("#SetSourceList");
    for (var i = 0; i < SourceList.length; i++) {

        // json to dateTime format
        var seconds = parseInt(SourceList[i].DateDownload.replace(/\/Date\(([0-9]+)[^+]\//i, "$1"));
        var date = new Date(seconds);
        var options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        var seconds2 = parseInt(SourceList[i].Date.replace(/\/Date\(([0-9]+)[^+]\//i, "$1"));
        var date2 = new Date(seconds2);

        var Data = "<tr class='row_" + SourceList[i].Name + "_" + date2.toLocaleDateString("en-US", options) + "_" + SourceList[i].Time.Hours + ":" + SourceList[i].Time.Minutes + ":" + SourceList[i].Time.Seconds + "'>";

        if (boolAdmin || boolWriter) {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>"
                + "<td>" + SourceList[i].Name + "</td>"
                + "<td>" + "<input id=\"SourceLinkTable" + i + "\"" + "class=\"form-control\" maxlength=" + linkMax + " type=\"textbox\" value=\"" + SourceList[i].Link + "\" placeholder=\"Insert " + sourceLink + "*\" onkeypress=\"saveRow(event, 0, '" + SourceList[i].Name + "_" + SourceList[i].Date + "_" + SourceList[i].Time + "', SourceLinkTable" + i + ")\" >" + "</td>"
                + "<td>" + SourceList[i].Repository + "</td>"
                + "<td>" + date.toLocaleDateString("en-US", options) + "</td>"
                + "<td>" + SourceList[i].Username + "</td>";
        } else {
            Data = Data + "<td>" + "<div class=\"checkbox checkbox-primary checkbox-single checkBoxZoom\"><input name=\"foo2\" type=\"checkbox\"><label></label></div>" + "</td>" +
                "<td>" + SourceList[i].Name + "</td>" +
                "<td>" + SourceList[i].Link + "</td>" +
                "<td>" + SourceList[i].Repository + "</td>" +
                "<td>" + date.toLocaleDateString("en-US", options) + "</td>" +
                "<td>" + SourceList[i].Username + "</td>";
        }

        Data = Data + "<td>" +
            "<div class=\"dropdown\">" +
            "<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" id=\"about-us\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">" +
            "Search" +
            "<span class=\"caret\"></span></button>" +
            "<ul class=\"dropdown-menu\" aria-labelledby=\"about-us\">" +
            "<li><a href=\"#\">Values</a></li>" +
            "</ul>" +
            "</div>";

        Data = Data + "</td>" + "</tr>";

        SetData.append(Data);

        // aggiungo caratteri campo
        $('input#SourceLinkTable' + i).maxlength({
            alwaysShow: true,
            placement: 'top-left'
        });
    }

    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    $('#SetSourceList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
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

// invia richiesta Ajax per salvare un rows cambiato
function saveAjaxRequest(number, name, phaseCode, phaseName, varLc, unit, id) {

    $.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        traditional: true,
        url: "/Source/Edit",
        headers: { '__RequestVerificationToken': token },
        data: {
            number: number,
            name: name,
            phaseCode: phaseCode,
            phaseName: phaseName,
            varLc: varLc,
            unit: unit
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

                    // json to dateTime format
                    var seconds = parseInt(dateSourceArray[i].replace(/\/Date\(([0-9]+)[^+]\//i, "$1"));
                    var date = new Date(seconds);
                    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };

                    $("#sourceDateSourceString").append("<option value='" + date.toLocaleDateString("en-US", options) + "'>" + date.toLocaleDateString("en-US", options) + "</option>");
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

// Filter Source
function FilterSource(selectSortable) {

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
        url: "/Source/GetSourceList",
        headers: { "__RequestVerificationToken": token },
        data: {
            sourceName: ($("#sourceNameString").val() != null) ? $("#sourceNameString").chosen().val() : undefined,
            link: ($("#sourceLinkString").val() != null) ? $("#sourceLinkString").val() : undefined,
            repository: ($("#sourceRepositoryString").val() != null) ? $("#sourceRepositoryString").val() : undefined,
            dateSource: ($("#sourceDateSourceString").val() != null) ? $("#sourceDateSourceString").val() : undefined,
            username: ($("#sourceUsernameString").val() != null) ? $("#sourceUsernameString").val() : undefined,
            orderSourceName: (sortable1 != null && selectSortable == 1) ? sortable1 : undefined,
            orderLink: (sortable2 != null && selectSortable == 2) ? sortable2 : undefined,
            orderRepository: (sortable3 != null && selectSortable == 3) ? sortable3 : undefined,
            orderDateDownload: (sortable4 != null && selectSortable == 4) ? sortable4 : undefined,
            orderUsername: (sortable5 != null && selectSortable == 5) ? sortable5 : undefined
        },
        success: function (result) {
            $("#SetSourceList").empty();
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

Dropzone.options.myDropzone = {
    paramName: "file",
    autoProcessQueue: true,
    parallelUploads: 1,
    maxFiles: 150,
    acceptedFiles: "image/*,text/csv,application/pdf,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    maxFilesize: 20, //MB
    addRemoveLinks: true,
    headers: { "__RequestVerificationToken": token },
    success: function (file, response) {

        if (response.status == true) {
            file.previewElement.classList.add("dz-success");
            // Remove the file preview.
            this.removeFile(file);
        }
        else {
            // se file esiste
            if (response.filePath != null) {
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
                    $.post('/Source/DeleteFile', { filePath: response.filePath + "/" + file.name }).then(res => {
                        // risultato della risposta
                        if (res == true) {
                            // invio di nuovo la richiesta
                            this.uploadFile(file);
                        } else {
                            swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                        }
                    });

                });
                return;
            }

            file.previewElement.classList.add("dz-error");
            $(file.previewElement).addClass("dz-error").find('.dz-error-message').text(response.response);
        }
    },
    error: function (file, errorMessage, xhr) {

        // Trigger an error on submit
        view.onSubmitComplete({
            file: file,
            xhr: xhr
        });

        // Allow file to be reuploaded !
        file.previewElement.classList.add("dz-error");
        file.status = Dropzone.QUEUED;
        // this.cancelUpload(file);
        // this.disable();
        // this.uploadFile(file);

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