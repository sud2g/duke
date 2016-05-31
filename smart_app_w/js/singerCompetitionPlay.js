/**
 * Created by william on 2016/4/12.
 */
$(function () {
  var videoURL = window.localStorage.getItem("videoURL");
  $("video").attr("src", videoURL);
});