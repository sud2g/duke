/*
$(function(){}); 
$(document).ready(function(){}); 
window.onload = function(){} 
*/
	
$(document).ready(function(){
	

	/*  */
	var tabs,dt;
	var temp = '';
	var list = document.getElementById("list");
	$.ajax({
		type: "POST",
		url: "http://119.90.159.178:8089/kunlun/kunlunzixun/getlist.ashx",
		dataType: "JSON",
		data:{
			cateId:1,
			tab:9
		},
		success: function(data){

			//data = decodeURIComponent(data);
			console.log(data);
			//dt = $.parseJSON(data)[0];

		  	for(i=0;i<data.length;i++){
				var urls = 'app_news_detail.html?cx='+ data[i].id;
				tabs = '<table class="tb2" onclick="location.href='+"'"+ urls +"'"+'">'+
							'<tbody>'+
							'<tr style="">'+
								'<td style="width:117.5px;text-align:right;border-bottom:1px solid #E8E8E8;">'+
									'<div style="width:118.5px;height:81px;border-radius:5px;margin-left:5px;margin-top:10px;margin-bottom:12px;">'+
									'<img src="images/app_news/'+ i+'.jpg" style="border:1px solid #eaeaea;width:112.5px;height:75px;vertical-align: middle;margin-left:3px;margin-top:3px;display:block;border-radius:4px;" class="">'+
									'</div>'+
								'</td>'+
								'<td style="padding:0 13px 0 20px;color:#000000;font-size:18px;border-bottom:1px solid #E8E8E8">'+
									'<div class="row" style="font-weight:normal;">'+ data[i].title+'</div>'+
									'<div class="row" style="font-weight:normal;color:rgb(150,150,150);font-size:14px">'+ data[i].createdate+'</div>'+
								'</td>'+
							'</tr>'+
							'</tbody>'+
						'</table>';

				temp = temp+tabs
			}

			list.innerHTML = temp;
		}
	});


	/*加载More*/
	var pageIndex = 1;
	$("#loadMore").bind('click',function(){
		pageIndex=pageIndex+1;
		$("#fcontent > div").each(function(){
	        
	        var flag = $(this).children("a").hasClass('text');
	        var id = this.id;
	        
	        
	        if(flag){
	        	var tabs,dt;
				var temp = '';
				var lists = document.getElementById("list");
		        $.ajax({
					type: "POST",
					url: "http://119.90.159.178:8089/kunlun/kunlunzixun/getlist.ashx",
					dataType: "JSON",
					data:{
						cateId:1,
						tab:id,
						pageIndex:pageIndex
					},
					success: function(data){

						//data = decodeURIComponent(data);
						console.log(data);
						//dt = $.parseJSON(data)[0];

					  	for(i=0;i<data.length;i++){
							var urls = 'app_news_detail.html?cx='+ data[i].id;
							tabs = '<table class="tb2" onclick="location.href='+"'"+ urls +"'"+'">'+
										'<tbody>'+
										'<tr style="">'+
											'<td style="width:117.5px;text-align:right;border-bottom:1px solid #E8E8E8;">'+
												'<div style="width:118.5px;height:81px;border-radius:5px;margin-left:5px;margin-top:10px;margin-bottom:12px;">'+
												'<img src="images/app_news/'+ i+'.jpg" style="border:1px solid #eaeaea;width:112.5px;height:75px;vertical-align: middle;margin-left:3px;margin-top:3px;display:block;border-radius:4px;" class="">'+
												'</div>'+
											'</td>'+
											'<td style="padding:0 13px 0 20px;color:#000000;font-size:18px;border-bottom:1px solid #E8E8E8">'+
												'<div class="row" style="font-weight:normal;">'+ data[i].title+'</div>'+
												'<div class="row" style="font-weight:normal;color:rgb(150,150,150);font-size:14px">'+ data[i].createdate+'</div>'+
											'</td>'+
										'</tr>'+
										'</tbody>'+
									'</table>';

							temp = temp+tabs;

						}
						$(list).append(temp);
					}
				});

	        }

    	});
  
	});


	
}); 