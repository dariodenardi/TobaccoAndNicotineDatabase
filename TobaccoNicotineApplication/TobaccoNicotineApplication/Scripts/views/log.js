// carico script quando finisce di caricare la pagina
$('document').ready(function () {

    $("#LoadingStatus").html("Loading....");
    $.get("/Log/GetLogList", null, DataBind);

});

// inserisco gli elementi nella table
function DataBind(LogList) {
    var SetData = $("#SetLogList");
    for (var i = 0; i < LogList.length; i++) {

        // json to dateTime format
        var seconds = parseInt(LogList[i].TimeAccessed.replace(/\/Date\(([0-9]+)[^+]\//i, "$1"));
        var date = new Date(seconds);
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

        var Data = "<tr class='row_" + LogList[i].LogID + "'>" +
            "<td>" + date.toLocaleDateString("en-US", options) + "</td>" +
            "<td>" + LogList[i].IPAddress + "</td>" +
            "<td>" + LogList[i].UserName + "</td>" +
            "<td>" + LogList[i].AreaAccessed + "</td>"
            + "</tr>";

        SetData.append(Data);
    }
    $("#LoadingStatus").html(" ");
    var page = $("#showEntry").val();
    $('#SetLogList').pageMe({ pagerSelector: '#myPager', showPrevNext: true, hidePageNumbers: false, perPage: parseInt(page) });
}

// Filter Log
function FilterLog() {

    $("#SetLogList").empty();
    $("#myPager").empty();
    $.get("/Log/GetLogList", null, DataBind);
}