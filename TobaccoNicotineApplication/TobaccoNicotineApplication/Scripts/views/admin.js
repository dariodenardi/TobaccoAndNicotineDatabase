// ValidateAntiForgeryTokenOnAllPosts
var token = $('[name=__RequestVerificationToken]').val();

// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    $("#LoadingStatus").html("Loading....");
    $.get("/Admin/GetUserList", null, DataBind);

});

// inserisco gli elementi nella table
function DataBind(UserList) {

    $.get("/Admin/GetRolesList", function (rolesList) {

        var SetData = $("#SetUserList");
        for (var i = 0; i < UserList.length; i++) {

            var Data = "<tr class='row_" + UserList[i] + "'>" +
                "<td>" + UserList[i] + "</td>" +
                "<td>"
                + "<select id=\"" + 'select_' + UserList[i] + "\" >";

            for (var j = 0; j < rolesList.length; j++) {
                Data = Data + "<option>" + rolesList[j] + "</option>";
            }

            Data = Data + "</select > "
                + "<a href='#' class='btn btn-dark btn-sm waves-effect' onclick='SaveUser(\"" + UserList[i] + "\")' ><span class='glyphicon glyphicon-ok'></span></a>"
                + "</td>" + "</tr>";

            SetData.append(Data);
            getRoleName(UserList[i]);
        }

    }, "json");
    
    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    $('#SetUserList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
}

function getRoleName(UserName) {

    $.ajax({
        type: "GET",
        url: "/Admin/GetRoleByUserName?UserName=" + UserName,
        success: function (data) {
            document.getElementById('select_' + UserName).selectedIndex = parseInt(data - 1);
        }
    })

}

// Save User
var SaveUser = function (UserName) {
    var grant = $("#select_" + UserName).val();

    $.ajax({
        type: "GET",
        url: "/Admin/Edit",
        data: {
            userName: UserName,
            grant: grant
        },
        headers: { '__RequestVerificationToken': token },
        success: function (data) {
            if (data == true)
                swal({ title: "Good job", text: "Your changes have been applied!", type: "success" });
            else
                swal("An error has occurred!", "Please wait a few minutes and try again.", "error");
        }
    })

}

// Filter User
function FilterUser(selectSortable) {

    var sortable1;
    var pathImg = document.getElementById("idSortable1").src;
    if (pathImg.includes("asc"))
        sortable1 = "asc";
    else if (pathImg.includes("desc"))
        sortable1 = "desc";
    else //caso in cui non è stato cliccato nessun filtro
        sortable1 = null;

    $.ajax({
        type: "POST",
        url: "/Admin/GetUserList",
        data: {
            order: (sortable1 != null && selectSortable == 1) ? sortable1 : undefined,
        },
        headers: { "__RequestVerificationToken": token },
        success: function (result) {
            $("#SetUserList").empty();
            $("#myPager").empty();
            DataBind(result);
            // resetto l'immagine dei filtri
            if (selectSortable == 0) {
                document.getElementById("idSortable1").src = "/Images/Sortable/bg.png";
            }
        }
    })
}

// Sortable User
function SortableUser() {

    // cambio immagine
    var pathImg = document.getElementById("idSortable1").src;
    if (pathImg.includes("asc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/desc.png";
    else if (pathImg.includes("desc"))
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";
    else // se è ancora l'immagine predefinita
        document.getElementById("idSortable1").src = "/Images/Sortable/asc.png";

    FilterUser(1);

}