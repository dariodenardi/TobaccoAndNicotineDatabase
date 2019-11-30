// nascondo immagine
$("#centerLoading").hide();

// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

$('#importExcel').click(function (event) {

    var nomeFile = document.getElementsByName("postedFile")[0].value;

    // file non selezionato
    if (nomeFile == "" || nomeFile == null) {
        swal("Select a file!", "No file has been selected", "error");
        return false;
    }

    // cotrollo estensione del file
    if (!(nomeFile.endsWith(".xls") || nomeFile.endsWith(".xlsx"))) {
        swal("Check file!", "Extension is incorrect (only .xls or .xlsx)", "error");
        return false;
    }

    var formData = new FormData();
    formData.append('postedFile', $('input[type=file]')[0].files[0]);

    $.ajax({
        headers: { "__RequestVerificationToken": token },
        url: '/Excel/Import',
        type: 'POST',
        data: formData,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        beforeSend: function () {
            // Doing some loading gif stuff
            $("#centerLoading").show();
        },
        success: function (result) {

            if (result.status == false) {
                swal({ title: "Error!", text: result.error, type: "error" },
                    function () {
                        $('form').trigger("reset");
                        $("#centerLoading").hide();
                    }
                );
            } else {
                // vedo se ci sono warning da segnalare
                var obj = JSON.parse(result.warning);
                if (!isEmpty(obj)) {
                    next(0, obj);
                }
                else {
                    swal({ title: "Good job!", text: "All your changes have been applied!", type: "success" },
                        function () {
                            $('form').trigger("reset");
                            $("#centerLoading").hide();
                        }
                    );
                } // isEmpty
            } // status = true

        },
        error: function (result) {
            swal({ title: "An error has occurred!", text: "Please wait a few minutes and try again.", type: "error" },
                function () {
                    $('form').trigger("reset");
                    $("#centerLoading").hide();
                }
            );
        }
    });
});

function next(i, obj) {

    swal({
        title: "Do you want replace this Value?",
        text: "Nomisma Code: " + obj[i].NomismaCode + "\nVariable Number: " + obj[i].Number + "\nCountry Code: " + obj[i].CountryCode + "\nYear: " + obj[i].Year + "\nOld Data: " + obj[i].Data + "\nNew Data: " + obj[i + 1].Data + "\nOld Data Us: " + obj[i].DataUs + "\nNew Data Us: " + obj[i + 1].DataUs + "\nOld Source Name: " + (obj[i].Sources.length > 0 ? obj[i].Sources[0].Name : null) + "\nNew Source Name: " + (obj[i + 1].Sources.length > 0 ? obj[i + 1].Sources[0].Name : null) + "\nOld Repository: " + (obj[i].Sources.length > 0 ? obj[i].Sources[0].Repository : null) + "\nNew Repository: " + (obj[i + 1].length > 0 ? obj[i + 1].Sources[0].Repository : null) + "\nOld Username: " + (obj[i].Sources.length > 0 ? obj[i].Sources[0].Username : null) + "\nNew Username: " + (obj[i + 1].Sources.length > 0 ? obj[i + 1].Sources[0].Username : null),
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: 'btn-warning',
        confirmButtonText: "Yes, replace it!",
        closeOnConfirm: false,
        closeOnCancel: false,
        closeOnClickOutside: false //impedisco di chiudere la finestra cliccando fuori
    },
        function (isConfirm) {

            if (isConfirm) {
                // invio richiesta per cancellare il file
                $.ajax({
                    url: '/Excel/ReplaceValue',
                    headers: { '__RequestVerificationToken': token },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        newValue: obj[i + 1]
                    },
                    success: function (res) {
                        // risultato della risposta
                        if (res == true) {
                            swal({ title: "Good job!", text: "Your change have been applied!", type: "success", closeOnConfirm: false },
                                function () {
                                    if ((i + 2) < obj.length)
                                        next(i + 2, obj);
                                    else {
                                        swal({ title: "Good job!", text: "All your changes have been applied!", type: "success" },
                                            function () {
                                                $('form').trigger("reset");
                                                $("#centerLoading").hide();
                                            }
                                        );
                                    }

                                }
                            );
                        } else {
                            swal({ title: "An error has occurred!", text: "Please wait a few minutes and try again.", type: "error" },
                                function () {
                                    $('form').trigger("reset");
                                    $("#centerLoading").hide();
                                }
                            );
                        }
                    }
                });

            } else {
                if ((i + 2) < obj.length)
                    next(i + 2, obj);
                else {
                    swal({ title: "Good job!", text: "All your changes have been applied!", type: "success" },
                        function () {
                            $('form').trigger("reset");
                            $("#centerLoading").hide();
                        }
                    );
                }

            }
        }); // swal

}