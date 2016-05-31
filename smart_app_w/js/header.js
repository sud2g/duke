/*
 * var header_checkTimes = sessionStorage.getItem("header_checkTimes");
 * setTimeout(function() { header_checkPageIsOk(); }, 3000); function
 * header_checkPageIsOk() { // 检测搜索异常 var show_head =
 * ($("#search_box").is(":visible")); // 检测
 * 底部 退出和登录都存在 var show_foot = ($("#loginUserDiv").is(":visible") &&
 * $("#loginDiv").is(":visible")); if (show_head || show_foot) { if
 * (!header_checkTimes) { header_checkTimes = 0; } if (header_checkTimes < 3) {
 * sessionStorage.setItem("header_checkTimes", header_checkTimes);
 * alert("系统检测到页面异常，为您自动跳转到首页。"); if (header_checkTimes == 0) {
 * setTimeout(function() { window.location.href = sdmtv.BASEPATH; }, 3000) } if
 * (header_checkTimes == 1) { setTimeout(function() { window.location.href =
 * sdmtv.BASEPATH; }, 2000) } if (header_checkTimes == 2) {
 * setTimeout(function() { window.location.href = sdmtv.BASEPATH; }, 1000) }
 * header_checkTimes = parseInt(header_checkTimes) + 1; } else {
 * sessionStorage.removeItem("header_checkTimes");
 * alert("对不起，您的浏览器不兼容该版本，请使用系统自带的浏览器 "); } } }
 */
//苹果标记
var isApp = (/iphone|ipad/gi).test(navigator.appVersion); 
//滑动标记
var moveFlag = false;
//..........微信设置 begin..........
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	// 分享到朋友圈
	WeixinJSBridge.on('menu:share:timeline', function(argv){
		shareTimeline();
	});
	WeixinJSBridge.on('menu:share:appmessage', function(argv){
		shareFriend();
	});
}, false);
function shareTimeline() {
	var title = document.title;
        
	WeixinJSBridge.invoke('shareTimeline',{
		"img_url":sdmtv.BASEPATH+"images/logoTitle.png",
		"img_width": "60",
		"img_height": "60",
		"link": window.location.href,
		"desc":"",
		"title": title
	}, function(res) {
		_report('timeline', res.err_msg);
	});
}
function shareFriend() {
	var value=document.getElementById("cont")==null?"":document.getElementById("cont").innerHTML; 
	var title = document.title;
	if(value!=null){
		value=value.replace(/(^\s*)/, "");
		value=value.replace(/\r\n/g,"");  
		value=value.replace(/\n/g,"");  
		value=value.replace(/<\/?.+?>/g,""); 
		value=value.replace(/\&nbsp;/g," "); 
	}else{
		value="";
	}
	if(value.length>100){
		value=value.substring(0,100)+"...";
	}
        
	WeixinJSBridge.invoke('sendAppMessage',{
		"appid": "",
		"img_url": sdmtv.BASEPATH+"images/logoTitle.png",
		"img_width": "60",
		"img_height": "60",
		"link":window.location.href,
		"desc": value,
		"title":title
	}, function(res) {
		_report('send_msg', res.err_msg);
	});
}

//2015年后修改的方法--后期修改为接口
var getDoBody = $("body");
if(getDoBody.length>0){
	var getDoBodyDiv = getDoBody.eq(0).find("div").first();
    if(getDoBodyDiv.length>0){
		getDoBodyDiv.prepend("<img src='"+sdmtv.BASEPATH+"images/logoPage.png' style='width:0px; height:0px; position:absolute;' />");
    }
}
//..........微信设置 end..........

//..........控制显示回到顶部的图标 begin..........
$(window).bind("touchmove scroll", function() {
	var top = $(window).scrollTop();
	if(0==top){
		document.getElementById("botTOTop").style.display = "none";
	}else{
		document.getElementById("botTOTop").style.display = "block";
	}
});
//..........控制显示回到顶部的图标 end..........

function header_headInit() {
	var keyword = $("#keyword");
	var delImg = $("#delImg");
	// 搜索框绑定事件
	delImg.toggleClass("delImg-hidden", !keyword.val());
	keyword.bind("input", function() {
		delImg.toggleClass("delImg-hidden", !keyword.val());
	});
	// 删除搜索框内文字
	delImg.bind("click", function() {
		keyword[0].focus();
		keyword.val("");
		delImg.toggleClass("delImg-hidden", true);
	});
	$("#doSearchID").bind('click', function() {
		var keyword = $("#keyword").val();
		keyword = keyword.replace(/\s/g, "");
		if (keyword && keyword.length > 0) {
			if(keyword.indexOf("&")>=0||keyword.indexOf("%")>=0){
				alert("请勿输入非法字符");
			}else{
				window.sessionStorage.setItem("searchCont", keyword);
				var baseParam = putBase64("searchCont=" + keyword);
				window.location.href = sdmtv.BASEPATH + "doMorPag.servlet?from=000908&type=50&value="+baseParam;
			}
		} else {
			alert("请输入搜索关键词");
		}
	});
};

//..........设置导航 begin..........
//横向导航--屏幕横竖切换
var sign_viewHSHeader=$(document.body).width();
window.addEventListener("resize", function() {
	var doSizeRerHeader = $(document.body).width();
    if(doSizeRerHeader!=sign_viewHSHeader){
    	sign_viewHSHeader = $(document.body).width();
		//清除已有数据
		$("#tindex-nav").html("<img style='width:100%; height:3px; display:block;' src='"+sdmtv.BASEPATH+"wapts/jsp/index/images/line_index_top.png' /><ul id='navUl' class='promptu-menu'><li style='list-style-type:none;' id='tindexNav'></li></ul>");
		//重置横向导航
		header_navInit();
    }
}, false);

//横向导航
var totFlag = 0;
var mobileFlag = false;
function header_navInit(){
	//注明：这里的jquery.promptu-menu.js文档自己修改过，别处不要用
	//为顶部导航是否显示的标记赋值
	totFlag = 1;
	
	//对于电脑要规范导航宽度，就像轮播广告
	if(navigator.userAgent.toLowerCase().indexOf("mobile")>0){
		mobileFlag = true;
	}else{
		mobileFlag = false;
		$("#header_wap").css({
			'overflow': 'hidden'
		});
	}

	//页面宽度
	var bodyWidNav = $(document.body).width()>720?720:$(document.body).width();
	//可以向左移动的最远距离
	var tooLeft = 804 - bodyWidNav;
	
	//导航模块在第几屏显示
	var navLeft = 0;
	var navRight = 0;
	if(1==currType){
		navLeft = 0;
		navRight = 60;
	}else if(2==currType){
		navLeft = 60;
		navRight = 154;
	}else if(3==currType){
		navLeft = 154;
		navRight = 248;
	}else if(4==currType){
		navLeft = 248;
		navRight = 342;
	}else if(5==currType){
		navLeft = 342;
		navRight = 402;
	}else if(6==currType){
		navLeft = 402;
		navRight = 462;
	}else if(7==currType){
		navLeft = 462;
		navRight = 556;
	}else if(8==currType){
		navLeft = 556;
		navRight = 650;
	}else if(9==currType){
		navLeft = 650;
		navRight = 710;
	}else if(10==currType){
		navLeft = 710;
		navRight = 804;
	}
	
	//计算导航向左移动的距离
	var widCouWidth = 0;
	var navLeCou = navLeft/bodyWidNav;
	var navRiCou = navRight/bodyWidNav;
	var navLeCouInt = parseInt(navLeft/bodyWidNav);
	var navRiCouInt = parseInt(navRight/bodyWidNav);
	if(navLeCouInt<navLeCou){
		navLeCouInt = navLeCouInt + 1;
	}
	if(navRiCouInt<navRiCou){
		navRiCouInt = navRiCouInt + 1;
	}
	if(navLeCouInt!=navRiCouInt){
		widCouWidth = navLeft;
	}else{
		widCouWidth = (navRiCouInt-1) *　bodyWidNav;
	}
	//判断是否超出了向左滑动的最远距离
	if(tooLeft <　widCouWidth){
		widCouWidth = tooLeft - 1;
	}
	//设置向左滑动
	var doLeftCurr = -1 * widCouWidth;
	
	//填充导航数据
	var doHtml = 
		 "<a style='display:inline-block; height:46px;'"+(mobileFlag?"":"href='"+sdmtv.BASEPATH+"'")+" ontouchstart='javascript:doStart(this);' ontouchend='javascript:window.location.href=\""+sdmtv.BASEPATH+"\"'><div class="+(currType==1?'navTdCurr':'navTd')+" style='width:60px;'><div style='border-left:1px solid #dedede;' class='navTdDiv'>首页</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==2?'navTdCurr':'navTd')+" style='width:94px;'><div class='navTdDiv'>电视直播</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==3?'navTdCurr':'navTd')+" style='width:94px;'><div class='navTdDiv'>电视点播</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==4?'navTdCurr':'navTd')+" style='width:94px;'><div class='navTdDiv'>网络视频</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==5?'navTdCurr':'navTd')+" style='width:60px;'><div class='navTdDiv'>资讯</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==6?'navTdCurr':'navTd')+" style='width:60px;'><div class='navTdDiv'>音乐</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==7?'navTdCurr':'navTd')+" style='width:94px;'><div class='navTdDiv'>广播直播</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==8?'navTdCurr':'navTd')+" style='width:94px;'><div class='navTdDiv'>广播点播</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==9?'navTdCurr':'navTd')+" style='width:60px;'><div class='navTdDiv'>阅读</div></div></a>"
		+"<a style='display:inline-block; height:46px;' href='"+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ=='><div class="+(currType==10?'navTdCurr':'navTd')+" style='width:94px;'><div class='navTdDiv'>精彩专题</div></div></a>";
	//填充导航数据
	var doHtmlAnd = "<div class="+(currType==1?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"\");'><div style='border-left:1px solid #dedede;' class='navTdDiv'>首页</div></div>"
		+"<div class="+(currType==2?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>电视直播</div></div>"
		+"<div class="+(currType==3?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>电视点播</div></div>"
		+"<div class="+(currType==4?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>网络视频</div></div>"
		+"<div class="+(currType==5?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>资讯</div></div>"
		+"<div class="+(currType==6?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>音乐</div></div>"
		+"<div class="+(currType==7?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>广播直播</div></div>"
		+"<div class="+(currType==8?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>广播点播</div></div>"
		+"<div class="+(currType==9?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>阅读</div></div>"
		+"<div class="+(currType==10?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStart(this);' ontouchmove='javascript:doMove();' ontouchend='javascript:doEnd(this,\""+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>精彩专题</div></div>";
	//填充导航数据
	var doHtmlIos = "<div class="+(currType==1?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"\");'><div style='border-left:1px solid #dedede;' class='navTdDiv'>首页</div></div>"
		+"<div class="+(currType==2?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>电视直播</div></div>"
		+"<div class="+(currType==3?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>电视点播</div></div>"
		+"<div class="+(currType==4?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doVidPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>网络视频</div></div>"
		+"<div class="+(currType==5?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>资讯</div></div>"
		+"<div class="+(currType==6?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>音乐</div></div>"
		+"<div class="+(currType==7?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=10&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>广播直播</div></div>"
		+"<div class="+(currType==8?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doAudPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>广播点播</div></div>"
		+"<div class="+(currType==9?'navTdCurr':'navTd')+" style='width:60px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=20&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>阅读</div></div>"
		+"<div class="+(currType==10?'navTdCurr':'navTd')+" style='width:94px' ontouchstart='javascript:doStartIos(this);' ontouchmove='javascript:doMoveIos();' ontouchend='javascript:doEndIos(this,\""+sdmtv.BASEPATH+"doOrtPar.servlet?from=000908&type=30&value=ZnJvbT1saXN0TmF2aQ==\");'><div class='navTdDiv'>精彩专题</div></div>";
	
	if(isApp){
		if((/version\/8.0/gi).test(navigator.appVersion)){
			//苹果6 plus
			document.getElementById("tindexNav").innerHTML = doHtmlIos;
		}else{
			document.getElementById("tindexNav").innerHTML = doHtml;
		} 
	}else{
		if(mobileFlag){
			document.getElementById("tindexNav").innerHTML = doHtmlAnd;
		}else{
			document.getElementById("tindexNav").innerHTML = doHtml;
		}
	}
	
	//设置时间标题的滑动，columns: 3,因为集数过多的时候，标题显示不开了，现在是显示3个。
	$(function(){
		$('ul.promptu-menu').promptumenu({
			width: bodyWidNav,                  //自定义滚屏宽度
			height: 46,                         //自定义滚屏高度
			rows: 1,                            //自定义滚屏排列行数
			columns: 1,                         //自定义滚屏排列列数
			direction: 'horizontal',            //horizontal水平拖动效果   vertical竖直拖动效果
			pages: false,                       //是否分页显示(是否存在下方的小圆点)
			margin: '0px 0px',                  //控制ul的margin  横向滑动自己加
			quantity: 1,                        //总共有多少项  横向滑动自己加
			left: doLeftCurr                    //向左偏移量
		});		
	});
};

//设置按下样式
var oldClass = "navTd";
function doStart(obj){
	oldClass = obj.className;
	if(isApp){
		obj.className = "navTdIosDown";
	}else{
		obj.className = "navTdDown";
	}
	moveFlag = true;
};
function doMove(){
	moveFlag = false;
};
function doEnd(obj,doUrl){
	obj.className = oldClass;
	if(moveFlag){
		window.location.href = doUrl;
	}
};
function doStartIos(obj){
	moveFlag = true;
};
function doMoveIos(){
	moveFlag = false;
};
function doEndIos(obj,doUrl){
	if(moveFlag){
		window.location.href = doUrl;
	}
};

//设置各个页面显示的导航的位置
function viewSearc() {
	if ($("#search_box").is(":visible")){
		$("#search_box").hide();
		$("#headSearchImg").attr("src",sdmtv.BASEPATH+"wapts/jsp/index/images/Icon_IndexTop_seach_normal.png");;
	} else {
		$("#search_box").show();
		$("#headSearchImg").attr("src",sdmtv.BASEPATH+"wapts/jsp/index/images/Icon_IndexTop_seach_down.png");
	}
};
		
//页面向下滑动式处于上部的标题
window.setTimeout(function() {
	var navTop = $("#tindex-nav")[0].offsetTop;
	$(window).bind("touchmove scroll", function() {
		//滚动时判断滚动条距离顶部的高度
		var top = $(window).scrollTop();
		if((top > navTop) && (1 == totFlag)){
			$("#tindex-nav").css({
				'position': 'fixed',
				'top': 0,
				'z-index': 100
			});
		}else{
			$("#tindex-nav").css({
				'position': 'static',
				'top': 'auto',
				'z-index': 100
			});
		}
	});
}, 2000);
//..........设置导航 end..........

/**
 * 刷新页头
 * 
 * @param {}
 *            isLogin
 */
function header_login(isLogin) {
	if (isLogin) {
	    // 登录状态 设定用户头像
	    $("#headUserImg").attr("src",sdmtv.BASEPATH+"wapts/jsp/index/images/Icon_IndexTop_user_down.png");
	    // 设置点击事件
		$("#header_user").bind('click', function() {
			location.href = sdmtv.BASEPATH + "doHomPag.servlet?from=000908&type=10&value=";
		});
	} else {
		// 未登录状态 设定用户头像
		$("#headUserImg").attr("src",sdmtv.BASEPATH+"wapts/jsp/index/images/Icon_IndexTop_user_normal.png");
		// 设置点击事件
		$("#header_user").bind('click', function() {
			//修改，进入登录页面后，注册之后返回个人中心:添加参数isHoPage用于标记点击我的订购进入。
			var baseParam = putBase64("isHoPage=1");
			location.href = sdmtv.BASEPATH + "doLogPag.servlet?from=000908&type=10&value="+baseParam;
		});
	}
	$("#header_user").css("display", "block");
	// 显示底部
	setTimeout(function(){
		$("#footer_wap").css("display", "block");
	},500);
};

/**
 * 直接移除。因为不需要。如果不移除可能会在其他程序里面导致显示。
 */
function _removeInit() {
	$("#header_user").remove();// 个人管理
	$("#header_search").remove();// 搜索
	$("#loginUserDiv").remove();// 用户
	$("#loginDiv").remove();// 注册
};

/**
 * 详情页隐藏下载提示
 */
function hideDownLoad(objType) {
	$("#details_downLoadHeader").hide(150);
	if("dszb"==objType){
		var firstClose = window.sessionStorage.setItem("dszbCloseUpload", "true");
	}else if("dsdb"==objType){
		var firstClose = window.sessionStorage.setItem("dsdbCloseUpload", "true");
	}else if("wlsp"==objType){
		var firstClose = window.sessionStorage.setItem("wlspCloseUpload", "true");
	}else if("yyhj"==objType){
		var firstClose = window.sessionStorage.setItem("yyhjCloseUpload", "true");
	}else if("gbzb"==objType){
		var firstClose = window.sessionStorage.setItem("gbzbCloseUpload", "true");
	}else if("gbdb"==objType){
		var firstClose = window.sessionStorage.setItem("gbdbCloseUpload", "true");
	}
};

/**
 * 详情页播放操作
 */
//标清、高清
function doUrlImg(){
    if(isApp){
		var getDisplay = document.getElementById("urlChangeUp").style.display;
		if("none"==getDisplay){
			document.getElementById("urlChangeUp").style.display = "block";
			$("#viewImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_xq_biaoqing_down.png");
		}else{
			document.getElementById("urlChangeUp").style.display = "none";
			$("#viewImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_xq_biaoqing_normal.png");
		}
    }else{
		var getDisplay = document.getElementById("urlChange").style.display;
		if("none"==getDisplay){
			document.getElementById("urlChange").style.display = "block";
			$("#viewImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_xq_biaoqing_down.png");
		}else{
			document.getElementById("urlChange").style.display = "none";
			$("#viewImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_xq_biaoqing_normal.png");
		}
	}
};

//点击标清
function doSD(){
	document.getElementById("urlChange").style.display = "none";
	document.getElementById("urlChangeUp").style.display = "none";
	$("#viewImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_xq_biaoqing_normal.png");
};

//点击高清
function doHD(){
	alertBot("下载客户端尊享高清体验");
	window.setTimeout(function() {
		document.getElementById("urlChange").style.display = "none";
		document.getElementById("urlChangeUp").style.display = "none";
		$("#viewImg").attr("src",sdmtv.BASEPATH+"wapts/images/bt_xq_biaoqing_normal.png");
	},500);
};

//分享
function doToshare(){
	var getDisplay = document.getElementById("shareChange").style.display;
	if("none"==getDisplay){
		document.getElementById("shareChange").style.display = "block";
		$("#viewShareImg").attr("class","player_fenxiang_down");
	}else{
		document.getElementById("shareChange").style.display = "none";
		$("#viewShareImg").attr("class","player_fenxiang");
	}
};
function doAudioToshare(){
	var getDisplay = document.getElementById("shareChange").style.display;
	if("none"==getDisplay){
		document.getElementById("shareChange").style.display = "block";
		$("#viewShareImg").attr("class","audioPlayer_fenxiang_down");
	}else{
		document.getElementById("shareChange").style.display = "none";
		$("#viewShareImg").attr("class","audioPlayer_fenxiang");
	}
};
function doBookToshare(){
	var getDisplay = document.getElementById("shareChange").style.display;
	if("none"==getDisplay){
		document.getElementById("shareChange").style.display = "block";
	}else{
		document.getElementById("shareChange").style.display = "none";
	}
};

//上一页面统计调用
function doReferUrl(referUrl, modType){
	//请求参数
	var refParams = {
		"cls" : "Common_wapSource",
		"webUrl" : referUrl,
		"postion" : modType
	};
	//参数判断
	if((undefined==modType) || ("undefined"==modType) 
		|| (null==modType) || ("null"==modType)){
		modType = "";
	}
	if((undefined==referUrl) || ("undefined"==referUrl) 
		|| (null==referUrl) || ("null"==referUrl)){
		referUrl = "";
	}
	//判断是否以基本路径看是
	var reg=new RegExp("^"+sdmtv.BASEPATH); 
  	if((!reg.test(referUrl)) && ("" != referUrl) && ("" != modType)){  
		new $sdmtv_ajax(refParams, function (ajaxObj) {});
  	}
};