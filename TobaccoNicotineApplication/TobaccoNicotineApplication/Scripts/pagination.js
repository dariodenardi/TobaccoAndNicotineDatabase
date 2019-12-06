//This is paging temlpate ,you should just copy paste
function PaggingTemplate(totalPage, currentPage) {
    var template = "";
    var TotalPages = totalPage;
    var CurrentPage = currentPage;
    var PageNumberArray = Array();


    var countIncr = 1;
    for (var i = currentPage; i <= totalPage; i++) {
        PageNumberArray[0] = currentPage;
        if (totalPage != currentPage && PageNumberArray[countIncr - 1] != totalPage) {
            PageNumberArray[countIncr] = i + 1;
        }
        countIncr++;
    };
    PageNumberArray = PageNumberArray.slice(0, 5);
    var FirstPage = 1;
    var LastPage = totalPage;
    // imposto questo vincolo perche' se arrivo all'ultima pagina devo restarci. non esiste la pagina + 1
    var ForwardOne = TotalPages;
    if (totalPage != currentPage) {
        ForwardOne = currentPage + 1;
    }
    var BackwardOne = 1;
    if (currentPage > 1) {
        BackwardOne = currentPage - 1;
    }

    template = template + '<ul class="pagination m-b-5">' +
        '<li><a href="#" aria-label="Previous" onclick="GetPageData(' + BackwardOne + ')"><i class="fa fa-angle-left"></i></a></li>';

    var numberingLoop = "";
    for (var i = 0; i < PageNumberArray.length; i++) {

        if (i == 0)
            numberingLoop = numberingLoop + '<li class="active"><a onclick="GetPageData(' + PageNumberArray[i] + ')" href="#">' + PageNumberArray[i] + '</a></li>'
        else
            numberingLoop = numberingLoop + '<li><a onclick="GetPageData(' + PageNumberArray[i] + ')" href="#">' + PageNumberArray[i] + '</a></li>'
    }
    template = template + numberingLoop + '<li><a href="#" aria-label="Next" onclick="GetPageData(' + ForwardOne + ')" ><i class="fa fa-angle-right"></i></a></li>' +
        '</ul>';

    template = template + "<p>" + CurrentPage + " of " + TotalPages + " pages</p>";

    $("#paged").append(template);
}

//template = "<p>" + CurrentPage + " of " + TotalPages + " pages</p>";

/*template = template + '<ul class="pagination m-b-5">' +
//'<li class="previous"><a href="#" onclick="GetPageData(' + FirstPage + ')"><i class="fa fa-fast-backward"></i>&nbsp;First</a></li>' +
'<li><a href="#" onclick="GetPageData(' + BackwardOne + ')"><i class="glyphicon glyphicon-backward"></i></a>';

var numberingLoop = "";
for (var i = 0; i < PageNumberArray.length; i++) {
    numberingLoop = numberingLoop + '<a class="page-number active" onclick="GetPageData(' + PageNumberArray[i] + ')" href="#">' + PageNumberArray[i] + ' &nbsp;&nbsp;</a>'
}
template = template + numberingLoop + '<a href="#" onclick="GetPageData(' + ForwardOne + ')" ><i class="glyphicon glyphicon-forward"></i></a></li>' +
//'<li class="next"><a href="#" onclick="GetPageData(' + LastPage + ')">Last&nbsp;<i class="fa fa-fast-forward"></i></a></li>
'</ul >';*/