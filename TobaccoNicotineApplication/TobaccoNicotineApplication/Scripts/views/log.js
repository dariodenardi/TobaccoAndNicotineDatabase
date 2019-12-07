// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    $("#LoadingStatus").html("Loading....");
    $.get("/Log/GetLogList", { pageNumber: 1, pageSize: $("#showEntry").val() }, DataBind);

});

// inserisco gli elementi nella table
function DataBind(result) {
    var SetData = $("#SetLogList");
    for (var i = 0; i < result.Data.length; i++) {

        // json to dateTime format
        var seconds = parseInt(result.Data[i].TimeAccessed.replace(/\/Date\(([0-9]+)[^+]\//i, "$1"));
        var date = new Date(seconds);
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

        var Data = "<tr class='row_" + result.Data[i].id + "'>" +
            "<td>" + date.toLocaleDateString("en-US", options) + "</td>" +
            "<td>" + result.Data[i].IPAddress + "</td>" +
            "<td>" + result.Data[i].UserName + "</td>" +
            "<td>" + result.Data[i].AreaAccessed + "</td>"
            + "</tr>";

        SetData.append(Data);
    }
    $("#LoadingStatus").html(" ");
    PaggingTemplate(result.TotalPages, result.CurrentPage);
}

// Filter Log
function FilterLog(pageNumber) {

    $("#SetLogList").empty();
    $("#paged").empty();
    $.get("/Log/GetLogList", { pageNumber: pageNumber, pageSize: $("#showEntry").val() }, DataBind);
}

function GetPageData(pageNumber) {

    FilterLog(pageNumber);

}