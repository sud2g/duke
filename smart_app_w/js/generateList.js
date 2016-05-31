/**
 * 方法说明：此方法为生成节目列表的统一调用函数
 * 
 * @param elementId
 *            页面添加列表的位置的ID
 * @param type
 *            列表的类型：book,tvLive,bdLive,tvDemand,bdDemand,subject,app
 * @param mode
 *            列表中间部分采用的样式类型，默认提供突出顶部类型,类型分别有
 *            modeTvLive 如:内容一
 *            				内容二（放大）
 *            				内容三
 *            -------------------------------------------
 *            modeDemand1 如:内容一（放大且占2行）
 *            				内容二
 *            				内容三
 *            -------------------------------------------
 *            modeDemand2 如:内容一（放大）
 *            				内容二（占2行）
 *            				内容三
 *            -------------------------------------------
 *            modeDemand3 如:内容一（放大且占2行）
 *            				内容二（占2行）
 *            -------------------------------------------
 *            modeBdLive 如:内容一（放大居中）
 *            -------------------------------------------
 *            modeBook 图书的样式列表
 *            -------------------------------------------
 *			  modeApp 应用的样式列表
 *            -------------------------------------------
 * @param middleContentTop
 *            中间顶部内容
 * @param middleContent
 *            中间中部内容
 * @param middleContentBottom
 *            中间底部内容
 * @param imgUrl
 *            左侧图片
 * @return obj 返回的是array,其中第一个存放着整个图片+文字的一个<a>标签对象，如果有第二个值存放的是右边播放图片的<a>标签对象
 */
function list_generateList(param,first_functionName,frist_functionParameter,Second_functionName,Second_functionParameter) {
	var elementId = param.elementId;
	var type = param.type;
	var mode = param.mode;
	var middleContentTop = param.middleContentTop;
	var middleContent = param.middleContent;
	var middleContentBottom = param.middleContentBottom;
	var imgUrl = param.imgUrl;
	
	var ElementDiv = document.getElementById(elementId);
	var div = document.createElement("div");
	// 左侧内容区域，包括图片，中间文字
	var Connection = document.createElement("a");
	Connection.href = "javascript:void(0)";
	//设置左侧a标签的事件
	if($.isFunction(first_functionName)){
		Connection.onclick = function() {
			first_functionName(frist_functionParameter,this);
		}
	}
	var conTable = document.createElement("table");
	conTable.className = "list_tableLeft";
	var conTbody = document.createElement("tbody");
	var conTr = document.createElement("tr");
	var conTd1 = document.createElement("td");
	var bgImgDiv = document.createElement("div");
	conTd1.setAttribute("align", "center");
	if (type == "book" || type == "editorbook") {
		conTd1.className = "list_tableLeftBookTd";
		bgImgDiv.className = "list_bgImgBookDiv";
	}else if(type == "App"){
		conTd1.className = "list_tableLeftAppTd";
		bgImgDiv.className = "list_bgImgAppDiv";
	} else {
		conTd1.className = "list_tableLeftTd";
		bgImgDiv.className = "list_bgImgDiv";
	}
	bgImgDiv.innerHTML = "<img class='imgLazyLoad' src='"
			+ sdmtv.IMG_BASEPATH
			+ imgUrl
			+ "' onerror=\"this.style.display='none'\">";
	conTd1.appendChild(bgImgDiv);
	var conTd2 = document.createElement("td");
	conTd2.className = "list_tableMidTd";

	var listMiddleContentTable = document.createElement("table");
	if (type == "book" || type == "editorbook") {
		listMiddleContentTable.className = "list_MiddleBookContent";
	} else {
		listMiddleContentTable.className = "list_MiddleContent";
	}
	var listMiddleContentTbody = document.createElement("tbody");
	// 以下内容根据不同的列表展示，创建不同的内容
	var listTr1 = document.createElement("tr");
	var listTd1 = document.createElement("td");
	
	var listTr2 = document.createElement("tr");
	var listTd2 = document.createElement("td");

	var listTr3 = document.createElement("tr");
	var listTd3 = document.createElement("td");
	if (mode == "modeTvLive") {
		listTd1.className = "list_MiddleContentTop";
		listTd1.innerHTML = middleContentTop;
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
		
		listTd2.className = "list_MiddleContentMid";
		listTd2.innerHTML = middleContent;
		listTr2.appendChild(listTd2);
		if(""!=middleContent){
			listMiddleContentTbody.appendChild(listTr2);
			listTd3.className = "list_MiddleContentBottom";
		}else{
			listTd3.className = "list_MiddleContentMid";
		}
		
		listTd3.innerHTML = middleContentBottom;
		listTr3.appendChild(listTd3);
		if(""!=middleContentBottom){
			listMiddleContentTbody.appendChild(listTr3);
		}
	} else if (mode == "modeBdLive") {
		listTd1.className = "list_MiddleContentBdLive";
		listTd1.innerHTML = middleContentTop;
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
	} else if (mode == "modeDemand1") {
		listTd1.className = "list_middleDemand1Top";
		var limitDiv = document.createElement("div");
		limitDiv.className = "list_limitDiv";
		limitDiv.innerHTML = middleContentTop;
		listTd1.appendChild(limitDiv);
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
		
		listTd2.className = "list_middleDemand1";
		listTd2.innerHTML = middleContent;
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);
		
		listTd3.className = "list_middleDemand1";
		listTd3.innerHTML = middleContentBottom;
		listTr3.appendChild(listTd3);
		listMiddleContentTbody.appendChild(listTr3);
	} else if (mode == "modeDemand2") {
		listTd1.className = "list_middleDemand2Top";
		listTd1.innerHTML = middleContentTop;
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);

		listTd2.className = "list_middleDemand2mid";
		listTd2.innerHTML = middleContent;
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);

		listTd3.className = "list_middleDemand2Bottom";
		listTd3.innerHTML = middleContentBottom;
		listTr3.appendChild(listTd3);
		listMiddleContentTbody.appendChild(listTr3);
	} else if (mode == "modeDemand3") {
		listTd1.className = "list_middleDemand3Top";
		var limitSubDiv = document.createElement("div");
		limitSubDiv.className = "list_limitSubDiv";
		limitSubDiv.innerHTML = middleContentTop;
		listTd1.appendChild(limitSubDiv);
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
		
		var limitSubDivbottom = document.createElement("div");
		limitSubDivbottom.className = "list_limitSubDivBottom";
		limitSubDivbottom.innerHTML =middleContent;
		listTd2.className = "list_middleDemand3";
		listTd2.appendChild(limitSubDivbottom);
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);
	} else if (mode == "modeDemand4") {
		listTd1.className = "list_middleDemand4Top";
		listTd1.innerHTML = middleContentTop;
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);

		listTd2.className = "list_middleDemand4";
		listTd2.innerHTML = middleContent;
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);
	} else if (mode == "modeDemand5") {
		listTd1.className = "list_middleDemand5Top";
		var limitSubDiv = document.createElement("div");
		limitSubDiv.className = "list_limitSubDiv5";
		limitSubDiv.innerHTML = middleContentTop;
		listTd1.appendChild(limitSubDiv);
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
		
		var limitSubDivbottom = document.createElement("div");
		limitSubDivbottom.className = "list_limitSubDivBottom5";
		limitSubDivbottom.innerHTML =middleContent;
		listTd2.className = "list_middleDemand3";
		listTd2.appendChild(limitSubDivbottom);
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);
	} else if (mode == "modeDemand6") {
		listTd1.className = "list_middleDemand5Top";
		var limitSubDiv = document.createElement("div");
		limitSubDiv.className = "list_limitSubDiv6";
		limitSubDiv.innerHTML = middleContentTop;
		listTd1.appendChild(limitSubDiv);
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
		
		listTd2.className = "list_middleDemand3mid";
		listTd2.innerHTML = middleContent;
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);

		listTd3.className = "list_middleDemand3Bottom";
		listTd3.innerHTML = middleContentBottom;
		listTr3.appendChild(listTd3);
		listMiddleContentTbody.appendChild(listTr3);
	}else if (mode == "modeBook") {
		listTd1.className = "list_middleBookTop";
		var limitBookDiv = document.createElement("div");
		limitBookDiv.className = "list_bookdiv";
		limitBookDiv.innerHTML = middleContentTop;
		listTd1.appendChild(limitBookDiv);
		listTr1.appendChild(listTd1);
		listMiddleContentTbody.appendChild(listTr1);
		listTd2.className = "list_middleBookBottom";
		listTd2.innerHTML = "<table>" + "<tr>"
				+ "<td class='middleBookBottom_top'>" + middleContent + "</td>"
				+ "</tr>" + "<tr>" + "<td class='middleBookBottom_bottom'><div class = 'list_limitBookDiv'>"
				+ middleContentBottom + "</div></td>" + "</tr>" + "</table>";
		listTr2.appendChild(listTd2);
		listMiddleContentTbody.appendChild(listTr2);
	}
	listMiddleContentTable.appendChild(listMiddleContentTbody);
	conTd2.appendChild(listMiddleContentTable);
	conTr.appendChild(conTd1);
	conTr.appendChild(conTd2);
	conTbody.appendChild(conTr);
	conTable.appendChild(conTbody);
	Connection.appendChild(conTable);
	// 以下为创建主的列表框架
	var tableMain = document.createElement("table");
	if (type == "book" || type == "editorbook") {
		tableMain.className = "list_BookTable";
	} else {
		tableMain.className = "list_Table";
	}
	var tbodyMain = document.createElement("tbody");
	var trMain = document.createElement("tr");
	var tdMain_1 = document.createElement("td");
	tdMain_1.appendChild(Connection);
	trMain.appendChild(tdMain_1);
	if (type == "book") {
	} else if(type == "subject"){
		var tdMain_3 = document.createElement("td");
		tdMain_3.className = "nolist_Play";
		trMain.appendChild(tdMain_3);
	}else if(type == "editor"){  //带删除按钮的列表（非图书）
		var tdMain_2 = document.createElement("td");
		tdMain_2.className = "list_Play";
		var editorButton = document.createElement("a");
		editorButton.href = "javascript:void(0)";
		editorButton.innerHTML = "<img id='editorImg' class='editorImgHid' src='./wapts/jsp/grgl/images/del.png'>";
		if($.isFunction(Second_functionName)){
			editorButton.onclick = function() {
				Second_functionName(Second_functionParameter,tableMain,div);
			}
		}
		//tdMain_2.appendChild(editorButton);
		trMain.appendChild(tdMain_2);
	}else if(type == "editorbook"){  //带删除按钮的列表（图书）
		var tdMain_2 = document.createElement("td");
		tdMain_2.className = "list_Play";
		var editorButton = document.createElement("a");
		editorButton.href = "javascript:void(0)";
		editorButton.innerHTML = "<img id='editorImg' class='editorImgHid' src='./wapts/jsp/grgl/images/del.png'>";
		if($.isFunction(Second_functionName)){
			editorButton.onclick = function() {
				Second_functionName(Second_functionParameter,tableMain,div);
			}
		}
		//tdMain_2.appendChild(editorButton);
		trMain.appendChild(tdMain_2);
	}else if(type == "App") {
		
		var tdMain_3 = document.createElement("td");
		tdMain_3.className = "list_down";
		var playElement = document.createElement("a");
		playElement.href="javascript:app_down();";
		playElement.innerHTML = "<img src=' "+ sdmtv.BASEPATH
		+ "wapts/images/bt_yytj_download.png'>";
		//给下载按钮添加下载事件
		if($.isFunction(Second_functionName)){
			playElement.onclick = function() {
				Second_functionName(Second_functionParameter);
			}
		}
		tdMain_3.appendChild(playElement);
		trMain.appendChild(tdMain_3);
	}else {
		var tdMain_2 = document.createElement("td");
		tdMain_2.className = "list_Play";
		var playElement = document.createElement("a");
		playElement.href="javascript:void(0)";
		playElement.innerHTML = "<img src=' "+ sdmtv.BASEPATH
		+ "wapts/jsp/index/images/play.png'>";
		//给播放按钮添加播放事件
		if($.isFunction(Second_functionName)){	
			playElement.onclick = function() {
				Second_functionName(Second_functionParameter);
			}
		}
		//tdMain_2.appendChild(playElement);
		trMain.appendChild(tdMain_2);
	}
	tbodyMain.appendChild(trMain);
	tableMain.appendChild(tbodyMain);
	ElementDiv.appendChild(tableMain);
	
	div.className = "List_Cont_recommend_div";
	ElementDiv.appendChild(div);
	// 图片懒加载
	/*window.setTimeout(function() {
		$("img.imgLazyLoad").lazyload({
			effect: "fadeIn"
		}).on("load", function() {
			$(this).removeClass("imgLazyLoad");
		});
	}, 300)*/
	
}
/**
 * 改变删除按钮的显示或隐藏状态
 * @param pageId
 * @return
 */
function editor_imgChangeStu(pageId,isShow){
	if(isShow){
		var editorImgHid = document.getElementById(pageId).querySelectorAll(".editorImgHid");
		if(editorImgHid.length>0){
			for(var i = 0;i<editorImgHid.length;i++){
				editorImgHid[i].className = "editorImgShow";
			}
		}
	}else{
		var editorImgShow = document.getElementById(pageId).querySelectorAll(".editorImgShow");
		if(editorImgShow.length>0){
			for(var i = 0;i<editorImgShow.length;i++){
				editorImgShow[i].className = "editorImgHid";
			}
		}
	}
}

function float_creatHtml(elementId,name){
	var ul = document.getElementById(elementId);
	var div  = document.createElement("div");
	div.className = "d1";
	var a = document.createElement("a");
	a.href="javascript:void(0)";
	a.innerHTML = "<div class='d2'>"+name+"</div>";
	div.appendChild(a);
	ul.appendChild(div);
	return a;
}

function float_add(i,elementId){
	if(i%2==1){
		$("#"+elementId).html($("#"+elementId).html()+"<div class='d1'><div style='height:30px;' class='d2'></div></div>");
	}
}

/**
 * 初始化广告
 * @return
 */
function initTntAd(){
	// 页面的广告标签标志为div标签并且title属性为advertisment
	var advertisments = document.body.querySelectorAll("tntAd");
	// 获取id
	var advParamsArray = new Array();
	var advCallBackArray = new Array();
	var advCallBackParamArray = new Array();
	$.each(advertisments,function(i,advDiv){
		var paramAdv = {
			"cls" : "Advertisement_listById",
			"positions" : advDiv.id
		};
		advParamsArray.push(paramAdv);
		advCallBackArray.push(adv_callBack);
		advCallBackParamArray.push(advDiv.id);
	});
	if(advParamsArray.length > 0){
		new $multipleSdmtvAjax(advParamsArray, advCallBackArray,advCallBackParamArray);
	}
}

/**
 * 广告的回调函数
 * @param {} ajaxObj 结果集对象
 * @param {} advId 广告标签的id
 */
function adv_callBack(ajaxObj,advId){
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		
		var ads = ajaxObj.objs;
		if(ads.length == 0){// 隐藏广告位
		}else if(ads.length == 1){
			// 单幅广告
			$(ads).each(function(){
				var	height = this.get("height");
				var	showTypeLimit = this.get("showTypeLimit");
				var adveUrl = this.get("adveUrl");
				var targetUrl = this.get("targetUrl");
				var targetType = this.get("targetType");
				var advName = this.get("advName");
				var positions = this.get("positions");
				var carouselAdv = this.get("carouselAdv");
				var width = this.get("width");
				var advertisementId = this.get("advertisementId");
				document.getElementById(advId).innerHTML = "<img width='320px' height='60px' onerror=this.src='"+sdmtv.BASEPATH+"wapts/images/Bg_List_Banner.png' style='margin-top: 5px;' src='"+sdmtv.IMG_BASEPATH+targetUrl+"' onclick='goUrl(\""+adveUrl+"\",\""+targetType+"\",\""+advertisementId+"\",\""+positions+"\")'/>";
			})
		}else if(ads.length>1){
			// 多幅广告
			var height = 0 ;
			var showTypeLimit = 2;
			var box =new PPTBox();
			box.width = 320; //宽度
			$(ads).each(function(i){
				if(i==0){
					height = this.get("height");
					showTypeLimit = this.get("showTypeLimit");
				}
				var adveUrl = this.get("adveUrl");
				var targetUrl = this.get("targetUrl");
				var targetType = this.get("targetType");
				var advName = this.get("advName");
				var positions = this.get("positions");
				var carouselAdv = this.get("carouselAdv");
				var width = this.get("width");
				var advertisementId = this.get("advertisementId");
				box.add({"url":sdmtv.IMG_BASEPATH+targetUrl,"href":"javascript:goUrl(\""+adveUrl+"\",\""+targetType+"\",\""+advertisementId+"\",\""+positions+"\")","title":"标题1"});
			})
		     box.height = 60;//高度
		     box.autoplayer = showTypeLimit;//自动播放间隔时间
			 box.posId = advId;//位置ID
		     box.show();
		  // 设置广告滑动事件
		 	$("#"+advId).wipetouch({
		 				tapToClick : false, // if user taps the screen, triggers a
		 				// click
		 				// event
		 				wipeLeft : function(result) {
		 					var e = document.createEvent('MouseEvent');
		 					e.initEvent('click', false, false);
		 					box._play();
		 				},
		 				wipeRight : function(result) {
		 					var e = document.createEvent('MouseEvent');
		 					e.initEvent('click', false, false);
		 					box._back();
		 				}
		 			});
		}
	}
}
var index_adRecordsParams={
		"cls" : "Advertisement_addsClick",
		"position" : "",
		"advertisementId" : "",
		"count" : 1
}
function goUrl(targetUrl,targetType,advertisementId,position) {
	index_adRecordsParams.position=position;
	index_adRecordsParams.advertisementId=advertisementId;
	var param = {
			"targetType":targetType,
			"targetUrl":targetUrl
	}
	new $sdmtv_ajax(index_adRecordsParams,goUrlCallBack,param);
	
}

function goUrlCallBack(ajaxObj,param){
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		window.location.href = param.targetUrl;
//		if (param.targetType == "1") {
//			window.location.href=sdmtv.BASEPATH+param.targetUrl;
//		} else {
//			window.location.href = param.targetUrl;
//		}
	}
}