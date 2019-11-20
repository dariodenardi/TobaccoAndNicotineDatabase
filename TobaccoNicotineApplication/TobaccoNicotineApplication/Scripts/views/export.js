// nascondo immagine
$("#centerLoading").hide();

// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

$(document).ready(function () {
    var table = $('#country').DataTable({

        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
        "bInfo": false,
        "ordering": false,

        dom: 'Bfrtip',
        select: {
            style: 'os'
        },
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        buttons: [
            {
                className: 'btn btn-default waves-effect',
                text: 'Select all',
                action: function () {
                    table.rows({ page: 'current' }).select();
                }
            },
            {
                className: 'btn btn-default waves-effect',
                text: 'Select none',
                action: function () {
                    table.rows({ page: 'current' }).deselect();
                }
            }
        ]
    });

    //$('.countries').attr('name', 'value');

    var table2 = $('#variable').DataTable({

        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
        "bInfo": false,
        "ordering": false,

        dom: 'Bfrtip',
        select: {
            style: 'os'
        },
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        buttons: [
            {
                className: 'btn btn-default waves-effect',
                text: 'Select all',
                action: function () {
                    table2.rows({ page: 'current' }).select();
                }
            },
            {
                className: 'btn btn-default waves-effect',
                text: 'Select none',
                action: function () {
                    table2.rows({ page: 'current' }).deselect();
                }
            }
        ]
    });

    var table3 = $('#year').DataTable({

        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
        "bInfo": false,
        "ordering": false,

        dom: 'Bfrtip',
        select: {
            style: 'os'
        },
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        buttons: [
            {
                className: 'btn btn-default waves-effect',
                text: 'Select all',
                action: function () {
                    table3.rows({ page: 'current' }).select();
                }
            },
            {
                className: 'btn btn-default waves-effect',
                text: 'Select none',
                action: function () {
                    table3.rows({ page: 'current' }).deselect();
                }
            },
            {
                className: 'btn btn-default waves-effect',
                text: 'MR',
                attr: {
                    id: 'mrButton'
                },
                action: function () {
                    table3.rows().deselect();
                    $('#mrButton').attr('class', 'btn btn-primary waves-effect');
                    swal("MR mode activated!", "if you want to remove it, you must select a year!", "success");
                }
            },
        ]
    });

    table3.on('select deselect', function () {
        var selectedRows = table3.rows({ selected: true }).count();

        table3.button(2).enable(selectedRows === 0);
        $('#mrButton').attr('class', 'btn btn-default waves-effect');
    });

    var table4 = $('#column').DataTable({

        "scrollY": "200px",
        "scrollCollapse": true,
        "paging": false,
        "bInfo": false,
        "ordering": false,

        dom: 'Bfrtip',
        select: {
            style: 'os'
        },
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        buttons: [
            {
                className: 'btn btn-default waves-effect',
                text: 'Select all',
                action: function () {
                    table4.rows({ page: 'current' }).select();
                }
            },
            {
                className: 'btn btn-default waves-effect',
                text: 'Select none',
                action: function () {
                    table4.rows({ page: 'current' }).deselect();
                }
            }
        ]
    });

    $('#prepareExcel').click(function (event) {

        // resetto scelte effettuate
        var countrySelected = new Array();
        var variableSelected = new Array();
        var columnSelected = new Array();
        var yearSelected = new Array();

        $('#country').each(function () {
            $(this).find('tr').each(function () {
                if ($(this).hasClass("selected")) {
                    var i = 0;
                    $(this).find('td').each(function () {
                        if (i == 1) {
                            countrySelected.push($(this).text());
                        }
                        i++;
                    })

                }
            })
        })

        $('#variable').each(function () {
            $(this).find('tr').each(function () {
                if ($(this).hasClass("selected")) {
                    var i = 0;
                    $(this).find('td').each(function () {
                        if (i == 1) {
                            variableSelected.push($(this).text());
                        }
                        i++;
                    })
                }
            })
        })

        if (document.getElementById("mrButton").classList.contains('btn-primary')) {
            yearSelected.push("MR");
        } else {

            // tolgo MR se è presente
            var index = yearSelected.indexOf("MR");
            if (index > -1) {
                yearSelected.splice(index, 1);
            }

            $('#year').each(function () {
                $(this).find('tr').each(function () {
                    if ($(this).hasClass("selected")) {
                        var i = 0;
                        $(this).find('td').each(function () {
                            if (i == 1) {
                                yearSelected.push($(this).text());
                            }
                            i++;
                        })
                    }
                })
            })

        }

        $('#column').each(function () {
            $(this).find('tr').each(function () {
                if ($(this).hasClass("selected")) {
                    var i = 0;
                    $(this).find('td').each(function () {
                        if (i == 1) {
                            columnSelected.push($(this).text());
                        }
                        i++;
                    })
                }
            })
        })

        // controllo se sono stati scelti tutti i parametri
        if (countrySelected.length == 0 || variableSelected.length == 0 || yearSelected.length == 0 || columnSelected.length == 0) {
            swal("Attention!", "Check that you have selected at least one item for each table!", "error");
        } else {

            $("#centerLoading").show();

            $.ajax({
                type: "POST",
                url: '/Excel/GenerateExcel',
                headers: { "__RequestVerificationToken": token },
                data: {
                    countrySelected: countrySelected,
                    variableSelected: variableSelected,
                    yearSelected: yearSelected,
                    columnSelected: columnSelected
                },
                success: function (result) {
                    if (result == "ok") {
                        window.location = "/Excel/DownloadFile";
                        $("#centerLoading").hide();
                    } else {
                        swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                    }
                },
                error: function (result) {
                    $("#centerLoading").hide();
                    swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
                }
            })

        }

    });
});