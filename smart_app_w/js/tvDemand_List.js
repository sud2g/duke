//得到参数
var obj_url=analBase64URL();
var tvDemanChannldId=obj_url.tvDemanChannldId;
var tvDemanChannldName= decodeURI(decodeURI(obj_url.tvDemanChannldName));
var fromFlag=obj_url.from;
//导航使用
var currType = 3;

//横竖屏切换标记
var tvDemanChannldIdXY;

//定义全局变量标记“最热”的前三个
var indexList = 0;

//所有频道参数
var tvDemand_ChinnalList = {
	"cls" : "ProgramType_list",
	"parentCode" : "video_pin_dao",
	"totalCount" : 0
};

//所有栏目内容列表--最新
var tvDemand_ListParams = {
	"cls" : "ProgramType_videoProgramTypelist",
	"channelId" : "",
	"type" : "new",
	"totalCount" : 0,
	"beginNum" : 0,
	"step" : 20,
	"sort" : "playTime",
	"dir" : "desc"
};

//所有栏目内容列表--最热
var tvDemandHot_ListParams = {
	"cls" : "ProgramType_videoProgramTypelist",
	"channelId" : "",
	"type" : "orders",
	"totalCount" : 0,
	"beginNum" : 0,
	"step" : 20,
	"sort" : "popularnum",
	"dir" : "desc"
};

//首次加载数据参数
var first_params = {
	"doFirst" : 1
};

// 所有栏目参数
var tvDemand_PartListParamsLanmuList = {
	"cls" : "Video_list",
	"program" : "",
	"status" : "publish",
	"totalCount" : 0,
	"beginNum" : 0,
	"step" : 20,
	"sort" : "playTime",
	"dir" : "desc"
};

//内容加载
$(document).ready(function() {
	//显示横向导航
	document.getElementById("tindex-nav").style.display = "block";
	//显示横向导航
	header_navInit();
	
	//加载数据
	tvDemanChannldId = tvDemanChannldId==undefined?'':tvDemanChannldId;
	tvDemanChannldName = tvDemanChannldName==undefined?'':tvDemanChannldName;

	if (tvDemanChannldId == null || tvDemanChannldId == '') {
	    tvDemanChannldId = '';
		
		//设置参数--最新
		tvDemand_ListParams.beginNum = 0;
		tvDemand_ListParams.totalCount = 0;
		tvDemand_ListParams.channelId = '';
		//设置参数--最热
		tvDemandHot_ListParams.beginNum = 0;
		tvDemandHot_ListParams.totalCount = 0;
		tvDemandHot_ListParams.channelId = '';
		// v4.o新增来源
		if("homeMore"==fromFlag){
			tvDemand_ListParams.from="Recommend";
		}else if("listNavi"==fromFlag){
			tvDemand_ListParams.from="Navigation";
		}
		
		//标题栏赋值
		$('#selectNameS').html("全部");
		$('#selectNameN').html("全部");
	}else{
	   	//设置参数--最新
		tvDemand_ListParams.beginNum = 0;
		tvDemand_ListParams.totalCount = 0;
		tvDemand_ListParams.channelId = tvDemanChannldId;
	   	//设置参数--最热
		tvDemandHot_ListParams.beginNum = 0;
		tvDemandHot_ListParams.totalCount = 0;
		tvDemandHot_ListParams.channelId = tvDemanChannldId;
		
		//标题栏赋值
		$('#selectNameS').html(tvDemanChannldName);
		$('#selectNameN').html(tvDemanChannldName);
	}
	//清空列表
	var divlist = document.getElementById("partList");
	var divlistHot = document.getElementById("partHotList");
	divlist.innerHTML="";
	divlistHot.innerHTML="";
	var loadmore = document.getElementById("loadmore_tvDemand_List");
	var loadmoreHot = document.getElementById("loadmore_tvDemandHot_List");
	loadmore.innerHTML="";
	loadmoreHot.innerHTML="";
	// 加载数据
	new $sdmtv_ajax(tvDemand_ListParams, tvDemand_PartList, first_params);
	
    // 获取直播分类
	common_channelList(tvDemand_ChinnalList, $("#tvDemand_List"), tvDemand_classListDetail, tvDemanChannldId, "1");

	//横竖屏切换参数
	tvDemanChannldIdXY = tvDemanChannldId;
});

//监听手机屏幕横竖变化
window.onorientationchange=function(){
	//判断是否已经生成筛选曾
	if($(".slide_menu").length == 0){
		//还未生成筛选曾，不做处理
	}else{
		//筛选曾已经存在了，首先去掉,但是只去掉显示的table
		$(".slide_menu_table").remove();
		//重新获取数据
		window.setTimeout(function() {
			//重新获取数据
			common_channelList(tvDemand_ChinnalList, $("#tvDemand_List"), tvDemand_classListDetail, tvDemanChannldIdXY, "0");
		}, 500)
	}
};

//获得所有栏目列表函数--最新
function tvDemand_PartList(ajaxObj, data){
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		var objs = ajaxObj.objs;
		var totalCount = ajaxObj.params.totalCount;
		//如果totalCount查询结果为0,隐藏掉加载更多按钮
		var divlist = document.getElementById("partList")
		if(totalCount==0){
			hideLoadMore("loadmore_tvDemand_List");
		}
		if(objs.length==0){
			waptvDemand_List_noComment("partList");
		}else {
			$(objs).each(function(){
				var programTypeId = this.get("programTypeId");
				var itemsName= this.get("itemsName");
				var flagImg = this.get("flagImg");
				var programName = this.get("programName");
				var programUrl  = this.get("programUrl");
				var playTime = this.get("playTime");
				
				var param = {
					"elementId" : "partList",
					"type":"subject",
					"mode":"modeDemand2",
					"middleContentTop":itemsName,
					"middleContent":programName,
					"middleContentBottom":playTime,
					"imgUrl":flagImg
				};
				var function_param = {
					"CTPId" :programTypeId,
					"CTPIdName":itemsName
				};
				list_generateList(param,ChannelToPart,function_param);
			})
			// 判断是否显示加载更多按钮
			checkLoadMore(tvDemand_ListParams.beginNum,tvDemand_ListParams.step,totalCount,"tvDemand_ListParams",tvDemand_PartList,"loadmore_tvDemand_List");
			window.sessionStorage.setItem("IsToChannldList","false");
			//添加广告
			initTntAd();
		}
	}else{
		handErrorMsg(ajaxObj.message);
	}
	
	//初始化页脚
	if(1==data.doFirst){
		footer_footerInit($(this));
	}
};

// 页面：点击了最新标签
function do_newListTab(){
	//更换标题
	$("#hotSelectImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_list_tabhot_normal.png");
	$("#newSelectImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_list_tabnew_down.png");
	//内容更改
	document.getElementById("tvDemand_hot").style.display="none";
	document.getElementById("tvDemand_new").style.display="block";
};

//页面：点击了最新标签
function do_hotListTab(){
	//更换标题
	$("#hotSelectImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_list_tabhot_down.png");
	$("#newSelectImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_list_tabnew_normal.png");
	//内容更改
	document.getElementById("tvDemand_hot").style.display="block";
	document.getElementById("tvDemand_new").style.display="none";
	//判断最热标签中是否存在内容，若“无”，调用接口
	var partHotList = document.getElementById("partHotList").innerHTML; //未调用接口时（第一次点击之前），值为""
	var loadmoreHot = document.getElementById("loadmore_tvDemandHot_List").innerHTML;
	if((""==partHotList)||(null==partHotList)||(undefined==partHotList)){
		//调用接口获取信息 判断存储标记
		new $sdmtv_ajax(tvDemandHot_ListParams, tvDemandHot_PartList);
	}
};

//获得所有栏目列表函数--最热
function tvDemandHot_PartList(ajaxObj){
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		var objs = ajaxObj.objs;
		var totalCount = ajaxObj.params.totalCount;
		//如果totalCount查询结果为0,隐藏掉加载更多按钮
		var divlist = document.getElementById("partHotList")
		if(totalCount==0){
			hideLoadMore("loadmore_tvDemandHot_List");
		}
		if(objs.length==0){
			waptvDemand_List_noComment("partHotList");
		}else {
			$(objs).each(function(){
				var programTypeId = this.get("programTypeId");
				var itemsName= this.get("itemsName");
				var flagImg = this.get("flagImg");
				var programName = this.get("programName");
				var programUrl  = this.get("programUrl");
				var playTime = this.get("playTime");
				var popularNum = this.get("popularNum"); //人气数
				var interactiveNum  = this.get("interactiveNum"); //互动数
				var rank = this.get("rank"); //排名
				
				var function_param = {
					"CTPId" :programTypeId,
					"CTPIdName":itemsName
				};
				indexList = indexList+1;
				tvDemandHot_lastToHtml(programTypeId,itemsName,programName,playTime,flagImg,popularNum,indexList,function_param);
			})
			// 判断是否显示加载更多按钮
			checkLoadMore(tvDemandHot_ListParams.beginNum,tvDemandHot_ListParams.step,totalCount,"tvDemandHot_ListParams",tvDemandHot_PartList,"loadmore_tvDemandHot_List");
			window.sessionStorage.setItem("IsToChannldList","false");
			//添加广告
			initTntAd();
		}
	}else{
		handErrorMsg(ajaxObj.message);
	}
};

// "最热"列表内容转为HTML
function tvDemandHot_lastToHtml(programTypeId,itemsName,programName,playTime,flagImg,popularNum,indexI,function_param){
	//添加列表内容
	var ul = document.getElementById("partHotList");
	var table = document.createElement("table");
	var dicCont = document.createElement("div");
	table.className = "list_Table";
	dicCont.className = "List_Cont_recommend_div";
	//处理数据
	if(""==popularNum){
		popularNum = "暂无";
	}
	if(programName.length>24){
		programName = programName.substring(0,21)+"...";
	}
    //拼接“最近更新”的内容20131028变动
	var tableHtml = "<tr>"
		+"<td style='position:relative;'>"
			+"<div>"
				+"<table class='list_tableLeft'>"
					+"<tr>"
						+"<td align='center'  class='list_tableLeftTd'>"
							+"<div class='list_bgImgDiv'>"
								+"<img class='imgLazyLoad' src='"+sdmtv.IMG_BASEPATH+flagImg+"' onerror='this.style.display=\"none\"'>"
							+"</div>"
						+"</td>"
						+"<td class='list_tableMidTd'>"
							+"<table class='list_MiddleContent'>"
								+"<tr>"
									+"<td class='list_middleDemand2Top'>"+itemsName+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td class='list_middleDemand2mid'>"+programName+"</td>"
								+"</tr>"
								+"<tr>"
									+"<td class='list_middleDemand2Bottom'><img style='width:15px; margin-right:5px;' src='"+sdmtv.BASEPATH+"wapts/images/ic_dsdb_views.png' />"+popularNum+"</td>"
								+"</tr>"
							+"</table>"
						+"</td>";
					+ "</tr>"
				+"</table>"
	if(indexI==1){
		tableHtml = tableHtml + "<img src=\""+sdmtv.BASEPATH+"wapts/images/rightOne.png\" style='width:29px; position:absolute; top:0px; right: 0px;'>";
	}
	if(indexI==2){
		tableHtml = tableHtml + "<img src=\""+sdmtv.BASEPATH+"wapts/images/rightTwo.png\" style='width:29px; position:absolute; top:0px; right: 0px;'>";
	}
	if(indexI==3){
		tableHtml = tableHtml + "<img src=\""+sdmtv.BASEPATH+"wapts/images/rightThree.png\" style='width:29px; position:absolute; top:0px; right: 0px;'>";
	}
	tableHtml = tableHtml+"</div>"
			+"</td>"
			+"<td class='nolist_Play'></td>"
		+"</tr>";
		
	table.innerHTML = tableHtml;
	ul.appendChild(table);
	ul.appendChild(dicCont);
	
	//添加点击事件
	$(table).click(function() {
		ChannelToPart(function_param);
	});
};

//无内容
function waptvDemand_List_noComment(objList){
	$("#"+objList).append("<div class='ListOrContent_nofound'>当前还没有内容</div>");
};

//频道进入栏目
function ChannelToPart(param,obj){
	tvDemand_PartListParamsLanmuList.program = param.CTPId;
	new $sdmtv_ajax(tvDemand_PartListParamsLanmuList,function(ajaxObj){
		if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
			var videoId = null;
			var objs = ajaxObj.objs;
			if (objs.length == 0) {
				alert("暂无节目");
			} else {
				$(objs).each(function(i) {
					if(0==i){
						videoId = this.get("videoId");
					}
				})
				//跳转页面
				var baseParam = putBase64("from=List&tvDemand_videoId=" + videoId);
				window.location.href = sdmtv.BASEPATH + "doVidPar.servlet?from=000908&type=21&value=" + baseParam;
			}
		} else {
			handErrorMsg(ajaxObj.message);
		}
	});		
};

//选择某个频道
function tvDemand_classListDetail(programTypeId,itemsName){
	//加载数据
	if (programTypeId == null || programTypeId == '') {
		var baseParam = putBase64("tvDemanChannldId=&tvDemanChannldName=");
		window.location.href=sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=20&value="+baseParam;
	} else {
		var baseParam = putBase64("tvDemanChannldId="+programTypeId+"&tvDemanChannldName="+itemsName);
		window.location.href=sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=20&value="+baseParam;
	}
};