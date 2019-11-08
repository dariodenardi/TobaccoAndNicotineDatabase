// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

    // Riempo campi filtri
    // si avviano in modo asincrono
    loadFilterSource();
});

function loadFilterSource() {

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
            username: ($("#sourceUsernameString").val() != null) ? $("#sourceUsernameString").val() : undefined,
        },
        success: function (response) {

            var nameArray;
            var linkArray;
            var repositoryArray;
            var dateSourceArray;
            var usernameArray;

            if ($("#numberString").val() == null) {
                $("#numberString").empty();
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