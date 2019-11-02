// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    // Scelta combobox
    $('.chosen-select').chosen();

});

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