//是否播放标记
var ifPlay = false;
//判断是不是三星的手机
var sanxing = (/gt-n/gi).test(navigator.appVersion.toLowerCase()) || (/sm-g/gi).test(navigator.appVersion.toLowerCase()) || (/i95/gi).test(navigator.appVersion.toLowerCase());
//计数标记
var timeCount = 0;
//浏览器标记
var isFireFox = (/firefox/gi).test(navigator.userAgent.toLowerCase());
var isWebkit = (/webkit/gi).test(navigator.userAgent.toLowerCase());

//视频总长度
function durationChange(){
	var getLong = parseInt(doPlayer.duration);
	if(1==getLong){
	}else{
		var secInt = parseInt(getLong/60);
		var minInt = (getLong%60);
		var horInt = 0;
		if(secInt<10){
			secInt = "0"+secInt;
		}else if(secInt>=60){
			horInt = parseInt(secInt/60);
			secInt = (secInt%60);
			if(secInt<10){
				secInt = "0"+secInt;
			}
		}
		if(minInt<10){
			minInt = "0"+minInt;
		}
		if(0==horInt){
			horInt = "";1
		}else if(0<horInt<10){
			horInt = "0" + horInt + ":";
		}
		$("#duration").text(horInt+secInt+":"+minInt);
		$("#durationVew").text(horInt+secInt+":"+minInt);
	}
};

//视频播放进度
var getContr = 0;
function timeupdateChange(){
	//更新的时间
	var updLong = parseInt(doPlayer.currentTime);
	
	//播放时间
	var secInt = parseInt(updLong/60);
	var minInt = (updLong%60);
	var horInt = 0;
	if(secInt<10){
		secInt = "0"+secInt;
	}else if(secInt>=60){
		horInt = parseInt(secInt/60);
		secInt = (secInt%60);
		if(secInt<10){
			secInt = "0"+secInt;
		}
	}
	if(minInt<10){
		minInt = "0"+minInt;
	}
	if(0==horInt){
		horInt = "";
	}else if(0<horInt<10){
		horInt = "0" + horInt + ":";
	}
	$("#current").text(horInt+secInt+":"+minInt);
	
	//播放进度条
	var currentPos = doPlayer.currentTime;
    var maxduration = doPlayer.duration;
    var percentage = 100 * currentPos / maxduration;
    $("#timeBar").css('width', percentage+'%');
    $("#speedTimeBar").css('width', percentage+'%');
    $("#timeBarImg").css('left', percentage+'%');
	ifPlay = true;
    
	//隐藏缓冲图片
	document.getElementById("rotaImg").style.display = "none";
	
	//当播放完成后更改图片
	if(updLong>=parseInt(doPlayer.duration)){
		//设置播放按钮
		$("#btnVideoPlay").attr("src",sdmtv.BASEPATH+"wapts/images/bt_dsxq_play2.png");
		//显示
		document.getElementById("playBarDiv").style.display = "block";
		document.getElementById("speedDiv").style.display = "none";
		//设置隐藏数据
		ifPlay = false;
		timeCount = 10;
	}
	
	//控制从全屏切回非全屏时，不显示控制栏
	var getPosi = $("#videoPlay").css("position");
	//非全屏
	if("static"==getPosi){
		if(1==getContr){
			//删除video标签自己的控制栏
			//$("#videoPlay").removeAttr("controls");
			//显示自己的控制栏
			if("block"==$("#playBarDiv").css("display")){
			}else{
				//显示
				document.getElementById("playBarDiv").style.display = "block";
				document.getElementById("speedDiv").style.display = "none";
			}
			//设置隐藏数据
			ifPlay = true;
			timeCount = 0;
			doTimeCount();
			//标记值
			getContr = 0;
		}
	//全屏
	}else{
		if(0==getContr){
			//添加video标签自己的控制栏
			$("#videoPlay").attr("controls","true");
			//标记值
			getContr = 1;
		}
	}
};

//手动拖动进度
var timeDrag = false;
$("#progressBar").mousedown(function(e) {
	timeDrag = true;
	updatebar(e.pageX);
});
$(document).mouseup(function(e) {
	if(timeDrag) {
		timeDrag = false;
		updatebar(e.pageX);
		//播放状态点击进度条时，要显示缓冲图片
		if(!doPlayer.paused){
			document.getElementById("rotaImg").style.display = "block";
		}
	}
});
$(document).mousemove(function(e) {
	if(timeDrag) {
		updatebar(e.pageX);
	}
});
var updatebar = function(x) {
	//控制进度条
	var progress = $("#progressBar");
	var maxduration = doPlayer.duration;
	var position = x - progress.offset().left;
	var percentage = 100 * position / progress.width();
	if(percentage > 100) {
		percentage = 100;
	}
	if(percentage < 0) {
		percentage = 0;
	}
    $("#timeBar").css('width', percentage+'%');
    $("#speedTimeBar").css('width', percentage+'%');
    $("#timeBarImg").css('left', percentage+'%');
	doPlayer.currentTime = maxduration * percentage / 100;
};

//快进、快退、全屏
$("#btnVideoForw").on("click", function() {
	doPlayer.currentTime = doPlayer.currentTime + 3;
	//doPlayer.playbackrate = 3;
	return false;
});
$("#btnVideoBack").on("click", function() {
	doPlayer.currentTime = doPlayer.currentTime - 3;
	//doPlayer.playbackrate = -3;
	return false;
});
$("#btnVideoScreen").on("click", function() {
	if(isFireFox){
		//For Firefox
		doPlayer.mozRequestFullScreen();
	}else if(isWebkit){
		//For Webkit
		doPlayer.webkitRequestFullScreen();
	}else{
		//w3c
		doPlayer.requestFullscreen();
	}
	return false;
});

//控制缓冲显示
var xzCount = 1;
var stopFlag = false;
function doXZ(){
	if(stopFlag){
	}else{
		if(360<xzCount){
			xzCount = 1;
		}
		xzCount = xzCount + 1;
	   	$("#rotaImg").css("-moz-transForm", "rotate("+xzCount+"deg)");
	    $("#rotaImg").css("-webkit-transform", "rotate("+xzCount+"deg)");
	    $("#rotaImg").css("transform", "rotate("+xzCount+"deg)");
		window.setTimeout(doXZ(), 1000);
	}
};

//计时
function doTimeCount(){
	if(ifPlay == true){
		timeCount++;
		if(timeCount<=10){
	    	window.setTimeout("doTimeCount()",1000);
		}else{
			document.getElementById("playBarDiv").style.display = "none";
			document.getElementById("speedDiv").style.display = "block";
		}
	}
};

//点击播放
function touchVew(){
	if("block"==$("#playBarDiv").css("display")){
		//隐藏
		document.getElementById("playBarDiv").style.display = "none";
		document.getElementById("speedDiv").style.display = "block";
		//设置隐藏数据
		ifPlay = false;
		timeCount = 10;
	}else{
		//显示
		document.getElementById("playBarDiv").style.display = "block";
		document.getElementById("speedDiv").style.display = "none";
		//设置隐藏数据
		ifPlay = true;
		timeCount = 0;
		//计时
		doTimeCount();
	}
};

//监控视频长度是否改变，改变时，检查是否是断网
doPlayer.addEventListener("durationchange",function(){  
	var img = new Image();
	img.id = "test_is_online";
	//设置图片url地址，并添加一个随机参数，如果没有这个随机参数
	//每次请求图片，图片可能已经存在于缓存中了，这样如果断网了，
	//也可以从缓存中得到，就判断不出是否断网了
	img.src = sdmtv.BASEPATH+"wapts/jsp/index/images/logoIndex.png" + "?temp=" + Math.random();
	img.style.display = "none";
	document.body.appendChild(img);
	img.onerror = function(){
	    alertBot("加载失败，请重新加载");
	    ifOnLine = false;
	};
    document.body.removeChild(
        document.getElementById("test_is_online")
    );
});

//电视直播播放着暂停再播放视
var sanxingFlag = 0;
function liveTimeupChan(){
	//更新的时间
	var updLong = parseInt(doPlayer.currentTime);
	
	if(updLong>0 && sanxingFlag==0 && sanxing){
		try{
			doPlayer.pause();
		}catch(e){}
		sanxingFlag=1;
		
		try{
			doPlayer.play();
		}catch(e){}
	}
};