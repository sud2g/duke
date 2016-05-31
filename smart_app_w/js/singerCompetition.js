/**
 * Created by william on 2016/4/12.
 */
var tempHTML = '<td data-video-url="{{videoURL}}">' +
    '<a href="app_singer_competition_play.html" >' +
    '<img class="" src="{{imgURL}}" alt="1">' +
    '<span>{{title}}</span>' +
    '<div>{{subTitle}}</div>'+
    '</a>' +
    '</td>';
var pageIndex = 1;
$(function(){
  getContent();
  $("#loadMore").bind('click', loadMore);
});

function getContent() {
  $.ajax({
    url:"http://119.90.159.178:8089/kunlun/kunlunzixun/getsinger.ashx",
    type:"GET",
    dataType:"json",
    success: getContentSuccessCB,
    error: getContentErrorCB
  });
  function getContentSuccessCB(data) {
    var html = buildTD(data);
    $("#tbid_10332").html(html);
    $("td").on("click", function() {
      window.localStorage.setItem("videoURL", this.dataset.videoUrl);
    });
  }

  function getContentErrorCB() {

  }
}
function loadMore() {
  $.ajax({
    type: "GET",
    url: "http://119.90.159.178:8089/kunlun/kunlunzixun/GetSinger.ashx?pageIndex=" + ++ pageIndex,
    dataType: "JSON",
    success: successCB
  });

  function successCB(data) {
    debugger;
    var html = buildTD(data);
    $("#tbid_10332").append(html);
  }
}

function buildTD(data) {
  var html = "";
  $.each(data, function (index, value) {
    debugger;
    var currentTD = tempHTML.replace("{{title}}", value.title).replace("{{imgURL}}", value.imgURL).replace("{{videoURL}}", value.videoURL).replace("{{subTitle}}", value.subtitle);
    if(index % 2 === 0) {
      html = html + "<tr>" + currentTD;
    } else {
      html = html + currentTD + "</tr>";
    }
  });
  return html;
}
