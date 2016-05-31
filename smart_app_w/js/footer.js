/**
 * 调用页必须调用的初始化函数，如果不调用，则页面初始化无法完成， 包括宽度的设置，底部是否登录等。
 * 
 * @param {}
 * 
 */
function footer_footerInit() {
	//页头数据
	header_headInit();
	//绑定底部更多事件
	footer_bindFooterMore();
	//重新加载登录
	footer_reloadContent();
	//移除网络过慢定时器
	clearTimeout(header_checkNetTimeout);
};

// 重新加载数据，防止用户登录
function footer_reloadContent() {
	// 判断用户是否登录
	var doGetCusId = window.sessionStorage.getItem('customerId');
	//当前页面
	var nowUrl = window.location.href;
	//如果存在说明已经登录
	if (doGetCusId) {
	    //客户端调用的页面不检测
		if(nowUrl.indexOf("mallForClient")>0){
			footer_userLogin();
			window.localStorage.setItem('doCusId',doGetCusId);
		}else{
			//需要校验customerId，鉴于：（liusong）第一视听WAP端登陆用户存在安全隐患
			var getDoAus = window.localStorage.getItem("doAusEnt");
			var nowAus = getEncryption(doGetCusId);
			//session中的customerId未被改动，鉴于：（liusong）第一视听WAP端登陆用户存在安全隐患
			if(getDoAus == nowAus){
				footer_userLogin();
				window.localStorage.setItem('doCusId',doGetCusId);
			//session中的customerId被改动，鉴于：（liusong）第一视听WAP端登陆用户存在安全隐患
			}else{
				$("#loginUserDiv").css({
					"display" : "none"
				});// 隐藏用户信息
				$("#loginDiv").css({
					"display" : "none"
				});// 显示登录和注册
				// 刷新页头
				header_login(false);
				window.sessionStorage.removeItem("customerId");// 从seesionLocal移除
				window.sessionStorage.removeItem("name");// 从seesionLocal移除
				window.sessionStorage.removeItem("qilu");// 从seesionLocal移除
				window.localStorage.removeItem("auto_login");// 移除自动登录
				window.localStorage.removeItem("loginFlag");// 移除登录标记
				window.localStorage.removeItem("customerId_qilu");// 移除齐鲁网id
				window.localStorage.removeItem("doCusId");// 移除齐鲁网id
				alert("用户信息有误，退出登录。");
			}
		}
	} else {
		footer_userLoginOut();
	}
};

// 绑定底部更多事件（包括隐藏的登录和退出）
function footer_bindFooterMore() {
	// 个人中心
	$("#userMge").bind('click', function() {
		location.href = sdmtv.BASEPATH + "doHomPag.servlet?from=000908&type=10&value=";
	});
	// 登出
	$("#loginOut").bind("click", function() {
		// 登出和注册目前在同一个位置，如果立刻响应，则极有可能点击到注册，而跳到注册页面
		setTimeout(footer_userLoginOut(), 500);
	});
	// 注册
	$("#register").bind("click", function() {
		location.href = sdmtv.BASEPATH + "doLogPag.servlet?from=000908&type=12&value=";
	});
	// 反馈
	$("#back").bind("click", function() {
		location.href = sdmtv.BASEPATH + "doMorPag.servlet?from=000908&type=10&value=";
	});
	// 应用推荐
	$("#apps").bind("click", function() {
		location.href = sdmtv.BASEPATH + "doOrtPar.servlet?from=000908&type=50&value=";
	});
	// 系统公告
	$("#announcementList").bind("click", function() {
		window.location.href = sdmtv.BASEPATH + "doMorPag.servlet?from=000908&type=20&value=";
	});
	// 关于我们
	$("#about").bind("click", function() {
		location.href = sdmtv.BASEPATH + "doMorPag.servlet?from=000908&type=30&value=";
	});
};

// 鉴权用户是否登录
function chk_to_page(obj, url) {
	if (window.sessionStorage.getItem("customerId") != null) {
		if (typeof(url) == "string") {
			location.href = url;
		} else {
			return true;
		}
	} else {
		location.href = sdmtv.BASEPATH + "doLogPag.servlet?from=000908&type=10&value=";
		return false;
	}
	return true;
};

// 登录
function footer_userLogin() {
	$("#loginUserDiv").css({
		"display" : "none"
	});
	//此处原来有用户名称的显示，已经删掉了。
	$("#loginDiv").css({
		"display" : "none"
	});// 隐藏登录和注册
	//刷新页头
	header_login(true);
};

// 登出
function footer_userLoginOut() {
	$("#loginUserDiv").css({
		"display" : "none"
	});// 隐藏用户信息
	$("#loginDiv").css({
		"display" : "none"
	});// 显示登录和注册
	header_login(false);// 刷新页头
	var customerId = window.sessionStorage.getItem("customerId");
	if (customerId && customerId.length > 0) {
		// 退出
		params = {
			"cls" : "Customer_loginOut",
			"customerId" : window.sessionStorage.getItem("customerId")
		};
		new $sdmtv_ajax(params);
		window.sessionStorage.removeItem("customerId");// 从seesionLocal移除
		window.sessionStorage.removeItem("name");// 从seesionLocal移除
		window.localStorage.removeItem("auto_login");// 移除自动登录
		alert("您已退出第一视听");
	}
	$(document).trigger("logout");
};

/**
 * ios5以下返回true
 * 
 * @return {Boolean}
 */
function checkIphoneIsIos5Below() {
	var isIDevice = (/iphone/gi).test(navigator.appVersion); // IOS手机
	if (isIDevice) {
		var temp = navigator.appVersion;
		var banben = temp.substring(temp.indexOf("iPhone OS") + 10, temp.indexOf("iPhone OS") + 11);
		if (banben < 5) {
			return true;
		}
	}
	return false;
};

/**
 * ios5以下返回true
 * 
 * @return {Boolean}
 */
function checkIpadIsIos5Below() {
	var isIDevice = (/ipad/gi).test(navigator.appVersion); // IOS手机
	if (isIDevice) {
		var temp = navigator.appVersion;
		var banben = temp.substring(temp.indexOf("CPU OS") + 7, temp
						.indexOf("CPU OS")
						+ 8);
		if (banben < 5) {
			return true;
		}
	}
	return false;
};

/**
 * ios5以下返回true
 * 
 * @return {Boolean}
 */
function checkIos() {
	var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion); // IOS手机
	if (isIDevice) {
		return true;
	}
	return false;
};

// 隐藏 true
function footer_isNavigationHide() {
	return !($("#mask") && ($("#mask").length == 1));
};

/**
 * 绑定导航事件
 */
var isIos5Below = checkIphoneIsIos5Below() || checkIpadIsIos5Below();
// var isIos5Below = true;
var footer_toTopForIos5Below, footer_countPositionIntervalForIos5Below;// 
function ios5Below_bindInterval() {
	footer_countPositionIntervalForIos5Below = setInterval(function() {
		if (footer_isNavigationHide()) {// 只要导航隐藏了就需要不断定位
			ios5Below_countPosition(0);// 计算位置
		}
	}, 800);
};
function ios5Below_unbindInterval() {
	clearInterval(footer_countPositionIntervalForIos5Below);
};

/**
 * 计算位置
 * 
 * @param {}
 *            widthPianyi
 */
function ios5Below_countPosition(widthPianyi) {
	var windowWidth = document.body.clientWidth;// document.body.clientWidth
	var leftPianyi;
	if(windowWidth>720){
		leftPianyi = windowWidth / 2 + 360 - widthPianyi;
	}else{
		leftPianyi = windowWidth - widthPianyi;
	}
	
	var scrollTop = $(document).scrollTop();
	$("#deskDiv").css({// 导航部分
		left : leftPianyi,
		top : scrollTop - 70
	});
};

/**
 * 计算导航位置
 */
function footer_putNavigation(widthPianyi) {
	var scrollTop = $(document).scrollTop();
	// 对于ios如果工具栏存在，则需要隐藏
	if ((/iphone/gi).test(navigator.appVersion)) {
		if (scrollTop == 0) {
			window.scrollTo(0, 0);
		}
	}
	// 绑定导航的swipUp和swipDown时间
	// var clientHeight = window.screen.availHeight;// 屏幕的可用区域的高度，这个方法获得是像素数
	var clientHeight = $(window).height();// 屏幕的可用区域的高度，这个获得的是实际的高度数
	var windowWidth = document.body.clientWidth;// document.body.clientWidth
	var leftPianyi;// 左侧偏移量
	var topPianyi;
	if(clientHeight>400){
		topPianyi = 120;
	}else{
		topPianyi = 45;
	}
	$("#deskImgA").css({
		"top" : (clientHeight / 2) + topPianyi
	});
	if(windowWidth>720){
		leftPianyi = windowWidth / 2 + 360 - widthPianyi;
	}else{
		leftPianyi = windowWidth - widthPianyi;
	}
	var downPianyi = footer_getDownTop();
	if (isIos5Below) {
		if (scrollTop == 0) {
			window.scrollTo(0, 0);
		}
		ios5Below_countPosition(widthPianyi);
		footer_setUpAndDownPosition(leftPianyi, scrollTop, scrollTop
						+ downPianyi)
	} else {
		$("#deskDiv").css({
					left : leftPianyi,
					top : -55
				});
		footer_setUpAndDownPosition(leftPianyi, 0, downPianyi);
	}
	$(".firstScroll").css({
		"height" : clientHeight + 90,
		"width":246,
		"background-color":"#FFFFFF"
	
	});// 设置层的高度。
	if (widthPianyi > 0) {
		footer_showOrHideUpAndDown();
	}
	if(window.innerHeight>440){
		//document.getElementById("showTable").style.marginTop=((window.innerHeight-380)/2)+"px";
		document.getElementById("showTable").style.marginTop="20px";
	}else{
		document.getElementById("showTable").style.marginTop="20px";
	}
};

function footer_setUpAndDownPosition(leftPianyi, upTop, downTop) {
	$("#footer_navUp").css({// 设置底部的距离
		left : leftPianyi,
		"top" : upTop
	});
	$("#footer_navDown").css({// 设置底部的距离
		left : leftPianyi,
		top : downTop
	});
};

/**
 * 获得底部箭头的位置，iso为+40（去掉了头部） 安卓不去掉。
 * 
 * @return {}
 */
function footer_getDownTop() {
	var clientHeight = $(window).height();// 屏幕的可用区域的高度，这个获得的是实际的高度数
	if ((/iphone/gi).test(navigator.appVersion)) {
		return clientHeight + 40; // 下方偏移量 40为底部工具栏高度
	} else {
		return clientHeight - 20; // 下方偏移量 40为底部工具栏高度
	}
};

// 滚动
function swipeIndexProgram_by_jq(direction, y) {
	if(y < 2 * 40){
		y = 2 * 40;
	}
	if(y>80){
		y=100;
	}
	
	var clientHeight = $(window).height();// 屏幕的可用区域的高度，这个获得的是实际的高度数
	var topBegin = 0;
	var topEnd = -80 * footer_totalPrograms + clientHeight;
	var $showbox = $('.firstScroll .secondScroll');
	var top = $showbox.offset().top;
	
	if (top > 0)
		if((/iphone/gi).test(navigator.appVersion)||(/ipod/gi).test(navigator.appVersion)){
			top = -30;
		}else{
			
		top = -30;
		}
	if (direction == "down") {
		
		top = top - y;
		
		if (top < topEnd) {
			
			top = topEnd + 60;// 此时已经滚到底部，隐藏底 显示头。为了适配手机，增大了长度
		}
	} else if (direction == "up") {
		top = top + y;
		if (top > topBegin) {
			top = topBegin;// 此时已经滚到顶部，隐藏头 显示底
		}
	} else {
		return;
	}
	
	
	$showbox.animate({
		top : top
	}, 100, "swing", function (){// 此处的回调，获取top的时候好像还不是移动后的，所以进行了进一步的延迟。
		setTimeout(footer_showOrHideUpAndDown(),100);
	}); // 改变left值,切换显示版面,500(ms)为滚动时间,下同
};
function swipeIndexProgram_by_jqToTop(){
	 $('.firstScroll .secondScroll').animate({
		top : 0
	}, 100, "swing", function (){// 此处的回调，获取top的时候好像还不是移动后的，所以进行了进一步的延迟。
		setTimeout(footer_showOrHideUpAndDown(),100);
	});
};

/**
 * 控制上下箭头的显示和隐藏
 */
var innitHeight=$(window).height();
var footer_totalPrograms = 8;// 总的应用数目
function footer_showOrHideUpAndDown() {
	var clientHeight = $(window).height();// 屏幕的可用区域的高度，这个获得的是实际的高度数
	
	if (window.innerHeight > 410) {
		$("#footer_navDown").hide();
		$("#footer_navUp").hide();
	} else {
		var $showbox1=$('#showTable');
		var $showbox2=$('#deskImgA');
		var top1 = $showbox1.offset().top;
		var top2 = $showbox2.offset().top;
		
		$("#footer_navDown").show();
		$("#footer_navUp").show();
		
		if((/iphone/gi).test(navigator.appVersion)||(/ipod/gi).test(navigator.appVersion)){	
			$("#footer_navDown").show();
			$("#footer_navUp").show();
			if(top2-top1-190<-105){
				$("#footer_navUp").hide();
			}
			
			if(top2-top1-190>10){
			$("#footer_navDown").hide();
			}
			
		}else{
			if((window.innerHeight-innitHeight)>10){
				if(top2-top1-190<(-110+window.innerHeight-innitHeight)){
					$("#footer_navUp").hide();
				}
				if(top2-top1-190>40){
				$("#footer_navDown").hide();
				}
			}else{
				if(top2-top1-190<(-80+window.innerHeight-innitHeight)){
					$("#footer_navUp").hide();
				}
				if(top2-top1-190>40){
					$("#footer_navDown").hide();
				}
			}
		}
	}
};