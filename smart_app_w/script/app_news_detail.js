/*
$(function(){}); 
$(document).ready(function(){}); 
window.onload = function(){} 
*/

$(document).ready(function(){

	var paramUrl = location.search;
	var param = paramUrl.split("=");
	var appName = '';

	var title = document.getElementById("title");
	var con = document.getElementById("cont");
	var ims = document.getElementById("ims");
	var time = document.getElementById("time");

	$.ajax({
		type: "POST",
		url: "http://119.90.159.178:8089/kunlun/kunlunzixun/getdetail.ashx",
		dataType: "JSON",
		data:{
			detailId:param[1]
		},
		success: function(data){

			appName = document.getElementById("appName");
			appName.innerHTML=data[0].Cate1Name;


			//data = decodeURIComponent(data);
			console.log(data);
			//dt = $.parseJSON(data)[0];

		  	title.innerHTML=data[0].title;
			time.innerHTML=data[0].createdate;
			con.innerHTML=decodeURIComponent(data[0].content);
			ims.src=data[0].imgs;
		}
	});

	
}); 