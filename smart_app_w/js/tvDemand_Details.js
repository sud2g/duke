//浏览器类型
var isOupeng = (/oupeng/gi).test(navigator.appVersion); //欧朋浏览器
var is360Browser = (/360browser/gi).test(navigator.appVersion); //360browser浏览器
var isApp534 = (/applewebkit534.30|applewebkit\/534.30/gi).test(navigator.userAgent.toLowerCase()); //是否是534.30型号的浏览器，欧朋和360有的是534.30型号
var isFireFox = (/firefox/gi).test(navigator.userAgent.toLowerCase()); //火狐浏览器
var l39uChorme = ((/l39u/gi).test(navigator.userAgent.toLowerCase()) || (/lenovo s720i/gi).test(navigator.userAgent.toLowerCase())) && (/chrome/gi).test(navigator.userAgent.toLowerCase()); //sony的l39u手机的谷歌浏览器
var isAnd2 = ((/android 2.3/gi).test(navigator.userAgent.toLowerCase())) || ((/android 2.2/gi).test(navigator.userAgent.toLowerCase())); //android版本是2.3及一下的
var isXlWeibo = (/weibo/gi).test(navigator.userAgent.toLowerCase()); //新浪微博浏览器
var isTtWeibo = (/microblog/gi).test(navigator.userAgent.toLowerCase()); //腾讯微博浏览器
var isRrWeibo = (/renren/gi).test(navigator.userAgent.toLowerCase()); //人人微博浏览器
var isQQ = (/qq/gi).test(navigator.userAgent.toLowerCase()) && !(/qqbrowse/gi).test(navigator.userAgent.toLowerCase()); //QQ
var isQQBrow = (/qqbrowse/gi).test(navigator.userAgent.toLowerCase()); //QQ浏览器

//设备类型
var isAndroid = (/android/gi).test(navigator.appVersion); //安卓手机
var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion); //IOS手机
var isWindows = (/Windows Phone/gi).test(navigator.appVersion); //windows手机
var isWeiXin = (/micromessenger/gi).test(navigator.appVersion.toLowerCase()); //微信

//URL地址分析
var tvDemand_Details_ObjUrl = analBase64URL();
// 获得具体栏目ID
var tvDemand_videoId = tvDemand_Details_ObjUrl.tvDemand_videoId;
tvDemand_videoId=parseInt(tvDemand_videoId);
var weixinType = tvDemand_Details_ObjUrl.weixinType;
var weixinId = tvDemand_Details_ObjUrl.weixinId;
var weixinTime = tvDemand_Details_ObjUrl.weixinTime;

//二维码扫描进入参数
var twoDimensionType = tvDemand_Details_ObjUrl.type;
var twoDimensionId = tvDemand_Details_ObjUrl.twoDimensionCode;

//进入页面的来源
var fromFlag = tvDemand_Details_ObjUrl.from;

//是否有预加载：0表示正式播放; 1表示预加载;
var prevLoad = 1;

var tvDemand_Details_cusCollId = null;
// 节目名称
var programName_tvLive = null;

// 查询详细内容参数
var tvDemand_DetailsParams = {
	"cls" : "Video_view",
	"videoId" : tvDemand_videoId,
	"pageCode" : "video"
};

// 点评参数
var tvDemand_DetailsPammDianpin = {
	"cls" : "Commit_list",
	"totalCount" : 0,
	"programId" : tvDemand_videoId,
	"programType" : "video",
	"beginNum" : 0,
	"step" : 20,
	"sort" : "createTime",
	"dir" : "desc"
};

// 往期节目参数
var pamm_tvDemand_Details_last = {
	"cls" : "Video_thePeriodList",
	"videoId" : tvDemand_videoId,
	"programType" : "video"
};

//首次加载数据参数
var first_params = {
	"doFirst" : 1
};

// 内容加载
var sign_viewHS=$(document.body).width();
$(document).ready(function() {
	//在苹果端的微信中需要在页面播放
	if(isIDevice){
		if((/micromessenger/gi).test(navigator.appVersion.toLowerCase())){
			isIDevice = false;
		}else{
			isIDevice = true;
		}
		//QQ判断，不是QQ浏览器
		if(isQQ){
			isIDevice = false;
		}else{
			isIDevice = true;
		}
	}
	//调用静态页面
	staticPageInter();

	//二维码扫描处理
	twoDimension_satictis(twoDimensionType,twoDimensionId);
	//微信分享判断
	if((undefined==weixinId) || (""==weixinId) || (null==weixinId)){
	}else{
		//微信统计接口
		weixinRecord();
	}
	
	//跳入地址分析
	var referUrl = document.referrer;
	doReferUrl(referUrl);
	
	//详情页下载提示区域
	var ifDoClose = window.sessionStorage.getItem("dsdbCloseUpload");
	if("true"==ifDoClose){
		document.getElementById("details_downLoadHeader").style.display = "none";
	}
	
	//设置播放区域的宽度
	var getBodyWidth = $(document.body).width()>720?720:$(document.body).width();
	var doPlayHeight = getBodyWidth*179/320;
	$("#playVideoVew").css("height",doPlayHeight+"px");
	$(".playVideoVewFirstDiv").css("height",doPlayHeight+"px");
	$("#playVideoDiv").css("height",doPlayHeight+"px");
	$("#videoPlay").css("height",doPlayHeight+"px");
	
	//根据浏览器设置不同的显示
	if((isOupeng) || (is360Browser) || (isApp534) || (isWeiXin)){
		if(isAnd2){
		}else{
			document.getElementById("playVideoVew").style.display = "none";
			document.getElementById("playVideoDiv").style.display = "block";
		}
	}
	
	// v4.o新增来源
	if((undefined==fromFlag) || (""==fromFlag) || (null==fromFlag)){
	}else{
		tvDemand_DetailsParams.from = fromFlag;
	}
	//页面展示数据处理
	new $sdmtv_ajax(tvDemand_DetailsParams, tvDemand_Details_view);
	// 加载往期节目
	new $sdmtv_ajax(pamm_tvDemand_Details_last, tvDemand_Details_last, first_params);	
	
	$(document).bind("logout", function() {
		var CollectedText = document.getElementById("tvDemand_DetailsSkull");
		collectionReset(CollectedText, "video", tvDemand_videoId, "-1");
	});
});

//屏幕横竖屏切换
window.addEventListener("resize", function() {
	var doSizeRer = $(document.body).width();
    if(doSizeRer!=sign_viewHS){
    	sign_viewHS = $(document.body).width();
    	//重新设置宽度
		var getBodyWidthRes = $(document.body).width()>720?720:$(document.body).width();
		var doPlayHeightRes = getBodyWidthRes*179/320;
		$("#playVideoVew").css("height",doPlayHeightRes+"px");
		$(".playVideoVewFirstDiv").css("height",doPlayHeightRes+"px");
		$("#playVideoDiv").css("height",doPlayHeightRes+"px");
		$("#videoPlay").css("height",doPlayHeightRes+"px");
    }
}, false);

//调用微信接口
function weixinRecord(){
    var doUrl = sdmtv.BASEPATH+"wapts/su.jsp?pId="+weixinId+"&pt="+weixinType+"&"+weixinTime
	//回访记录接口
	var backVisit_param = {
		"cls":"Weibo_record02",
		"recordUrl":doUrl,
		"action":"visit"
	}
	//调用方法
	new $sdmtv_ajax(backVisit_param, function(ajaxObj){});
};

// 获得所有栏目列表函数
var musicId=0;
function tvDemand_Details_view(ajaxObj){
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		var objs = ajaxObj.objs;
		var videoId = null;
		var videoName = null;
		var videoImg = null;
		var channel = null;
		var channelName = null;
		var program = null;
		var programName = null;
		
		//判断，是否获取到了数据：如果已经被禁用，则不会存在数据
		if(objs.length==0){
			alert("该视频已不存在");
			window.setTimeout(function() {
				//返回首页
				location.href = sdmtv.BASEPATH;
			}, 1000);
		}
		
		$(objs).each(function(){
			videoId = this.get("videoId");
			musicId = videoId;
			videoName = this.get("videoName");
			window.sessionStorage.setItem("tvDemand_tempVideoName",videoName);
			videoImg = this.get("videoImg");
			var videoUrl = this.get("videoUrl");
			var videoLong = this.get("videoLong");
			var playtime = this.get("playTime");
			channel = this.get("channel");
			channelName = this.get("channelName");
			program = this.get("program");
			programName = this.get("programName");
			var customerCollectionId = this.get("customerCollectionId");
			programName_tvLive = videoName;
			window.sessionStorage.setItem("ChannldId",channel);
			viewToHtml(videoId,videoName,videoImg,videoUrl,videoLong,playtime,customerCollectionId,channel,program);
		})
		var tempname = programName;
		var titlename = videoName;
		if(programName.length>8){
			tempname = programName.substring(0, 6) + "..";
		}
		if(videoName.length>16){
			titlename = videoName.substring(0, 15);
		}
		document.getElementById("tvDemand_Details_title").innerHTML=tempname; // top_title
		document.getElementById("tvDemand_DetailsMeta").content=programName+"-电视点播-第一视听";
		document.title=videoName;
		document.getElementById("tvDemand_shareUrl").content=sdmtv.BASEPATH+"tvDemand_videoId="+videoId;
		document.getElementById("tvDemand_shareImage").content=sdmtv.IMG_BASEPATH+videoImg;
		
		//赋值分享按钮
		var shareVideoname = videoName;
		if(videoName.length>21){
			shareVideoname = videoName.substring(0, 20) + "..";
		}
		tvDemandDetails_shareInitToshare(shareVideoname)
	}else{
		handErrorMsg(ajaxObj.message);
	}
};

// 详细内容转为HTML
var dovideoId = "";
var dochannel = "";
var doprogram = "";
var dovideoUrl = "";
function viewToHtml(videoId,videoName,videoImg,videoUrl,videoLong,playtime,customerCollectionId,channel,program){
	//设置图片
	document.getElementById("tvDemandDetailsImg").src=sdmtv.IMG_BASEPATH+ videoImg;
	var tempvideoname = videoName;
	if(videoName.length>21){
		tempvideoname = videoName.substring(0, 20) + "..";
	}
	document.getElementById("tvDemandDetailsName").innerHTML=tempvideoname;
	document.getElementById("tvDemandDetailsPlayName").innerHTML=tempvideoname;
	//时长
	var timeLong = "00:00:00";
	if((""==videoLong) || (null==videoLong) || (undefined==videoLong)){
		videoLong = "--:--:--";
	}
	if(videoLong.length > 6){
		var reg=new RegExp("^"+"00"); 
		if(reg.test(videoLong)){
			videoLong = videoLong.substring(3,8);
			timeLong = "00:00";
		}    
	}
	document.getElementById("timeVew").innerHTML=timeLong;
	document.getElementById("durationVew").innerHTML=videoLong;
	
	var CollectedText = document.getElementById("tvDemand_DetailsSkull");
	collectionReset(CollectedText, "video", videoId, customerCollectionId);
	
	//设置播放按钮
	dovideoId = videoId;
	dochannel = channel;
	doprogram = program;
	dovideoUrl = videoUrl;
	
	prevLoad = 1;
	addDemandLastLook(dovideoId,"video",dochannel,doprogram,dovideoUrl,dovideoUrl,"trueVideo",prevLoad);
};

// 书签效果
function changeTvDemand(nameId) {
	var name = nameId;
	if (name == "tvNotice_tvDemand") {
		document.getElementById("tvNotice_tvDemand").style.display = "block";
		document.getElementById("tvDianpin_tvDemand").style.display = "none";
	} else if (name == "tvDianpin_tvDemand") {
		document.getElementById("tvNotice_tvDemand").style.display = "none";
		document.getElementById("tvDianpin_tvDemand").style.display = "block";
		// 加载用户点评
		tvDemand_DetailsPammDianpin.programId = tvDemand_videoId;
		var ul = document.getElementById("tvDianpin_tvDemandForm");
		if(ul.innerHTML!=""){
			$(".reviews_btn_div").trigger("click");
		}else{
			// 创建点评输入框
			$("#tvDianpin_tvDemandForm").append(reviewsCreateForm(tvDemand_videoId, "video", doDianpinLate));
			new $sdmtv_ajax(tvDemand_DetailsPammDianpin, tvDemand_DetailsCommentCont_dianping);
		}
	}
};

// 当用户评论提交后，刷新评论列表
function doDianpinLate(){
	//清除已有
	var ul = document.getElementById("tvDianpin_tvDemandCont");
	if(ul.innerHTML!=""){
	    // 创建点评输入框
		$("#tvDianpin_tvDemandCont").empty();
	}
	//获取数据
	tvDemand_DetailsPammDianpin.beginNum = 0;
	new $sdmtv_ajax(tvDemand_DetailsPammDianpin, tvDemand_DetailsCommentCont_dianping);
};

// 获得网友动态
function tvDemand_DetailsCommentCont_dianping(ajaxObj) {
	if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
		var objs = ajaxObj.objs;
		var totalCount = ajaxObj.params.totalCount;
		if(objs.length==0){
			tvDemand_noComment();
		}else{
			$(objs).each(function() {
				var customerCommitId = this.get("customerCommitId");
				var customerName = this.get("customerName");
				var gradeName = this.get("gradeName");
				var createTime = this.get("createTime");
				var content = this.get("content");
				var sex=this.get("sex");
				var customerId=this.get("customerId");
				// 添加点评列表
				reviewsCompositionHTML({
					elementId : "tvDianpin_tvDemandCont",
					customerCommitId: customerCommitId,
					customerName: customerName,
					sex:sex,
					gradeName:gradeName,
					createTime: createTime,
					content: content,
					customerId:customerId
				});
			})
			// 判断是否显示加载更多按钮
			checkLoadMore(tvDemand_DetailsPammDianpin.beginNum, tvDemand_DetailsPammDianpin.step,
				totalCount, "tvDemand_DetailsPammDianpin", tvDemand_DetailsCommentCont_dianping,
				"loadmore_tvDemand_Details_dianping");
		}
	} else {
		handErrorMsg(ajaxObj.message);
	}
};

// 没有评论的view
function tvDemand_noComment(){
	$("#tvDianpin_tvDemandCont").css({"text-align": "left"});
	$("#tvDianpin_tvDemandCont").html("<div class='ListOrContent_nofound'>还没有人点评，快抢占沙发</div>");
};

// 往期节目回调函数
function tvDemand_Details_last(ajaxObj, data){
	if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
		var objs = ajaxObj.objs;
		var totalCount = ajaxObj.params.totalCount;
		var ul = document.getElementById("tvDianpin_tvDemandCont_last");
		var i=0;
		ul.innerHTML="";
		if(objs.length==0){
			showNoLast();
		}else{
			$(objs).each(function() {
				var videoId = this.get("videoId");
				var videoName = this.get("videoName");
				var playTime = this.get("playTime");
				var videoUrl = this.get("videoUrl");
				var channel=this.get("channel");
				var program=this.get("program");
				var customerCollectionId = this.get("customerCollectionId");
				if(i<10){
					tvDemand_Details_lastToHtml(videoId,videoName,playTime,videoUrl,customerCollectionId,program,channel);
				}
				i++;
			});
		}
	} else {
		handErrorMsg(ajaxObj.message);
	}
	
	//初始化页脚
	if(1==data.doFirst){
		footer_footerInit($(this));
	}
};

function showNoLast(){
	$("#tvNotice_tvDemand").css({"text-align": "left"});
	$("#tvNotice_tvDemand").html("<div class='ListOrContent_nofound'>暂无往期节目</div>");
};

// 往期节目转为HTML
function tvDemand_Details_lastToHtml(videoId,videoName,playTime,videoUrl,customerCollectionId,program,channel){
	var name = videoName;
	playTime=playTime.substring(5,playTime.length);
	var playImg;
	var playClass;
	if(videoName==window.sessionStorage.getItem("tvDemand_tempVideoName")){
		playImg = "ic_dsxq_playing.png";
		playClass = "selectEd";
	}else{
		playImg = "play.png";
		playClass = "selectNo";
	}
	var ul = document.getElementById("tvDianpin_tvDemandCont_last");
	var table = document.createElement("table");
	table.className = "tvDianpin_tvDemandCont_last";

	table.innerHTML = "<tr>"
               + "<td style='width:37px;' align='right'><img style='width:16px; margin-right:8px; margin-top:2px;' class='"+playClass+"' src='"+sdmtv.BASEPATH+"wapts/jsp/tvDemand/images/"+playImg+"' /></td>"
			+ "<td nowrap><span class='tvDemand_limitWords'>"+name+"</span></td>"
		+"<td style='width:52px;' align='left' style='color:#9E9E9E;'>"+playTime+"</td>"
		+"</tr>";
	ul.appendChild(table);
	$(table).click(function() {
		prevLoad = 0;
		if(musicId == videoId){
		}else{
			//替换选中高亮
			$(".selectEd").attr("src",sdmtv.BASEPATH+"wapts/jsp/microVideo/images/play.png");
			var img = this.querySelectorAll("img");
			img[0].className = "selectEd";
			img[0].src = sdmtv.BASEPATH+"wapts/jsp/microVideo/images/ic_dsxq_playing.png";
			//设置当前ID
			musicId = videoId;
			//调用接口获取数据
			tvDemand_DetailsParams.videoId = videoId;
			new $sdmtv_ajax(tvDemand_DetailsParams, tvDemand_DetailsToPlayBack);
		}
	});
};

// 播放选中的节目
function tvDemand_DetailsToPlayBack(ajaxObj){
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		var objs = ajaxObj.objs;
		var videoId = null;
		var videoName = null;
		var videoImg = null;
		var videoUrl = null;
		var videoLong = null;
		var playtime = null;
		var channel = null;
		var channelName = null;
		var program = null;
		var programName = null;
		var customerCollectionId = null;
		$(objs).each(function(){
			videoId = this.get("videoId");
			videoName = this.get("videoName");
			window.sessionStorage.setItem("tvDemand_tempVideoName",videoName);
			videoImg = this.get("videoImg");
			videoUrl = this.get("videoUrl");
			videoLong = this.get("videoLong");
			playtime = this.get("playTime");
			channel = this.get("channel");
			channelName = this.get("channelName");
			program = this.get("program");
			programName = this.get("programName");
			customerCollectionId = this.get("customerCollectionId");
			programName_tvLive = videoName;
		});
		//设置播放URL
		doPlayer.pause();
		//doPlayer.currentTime = 0;
		//根据浏览器设置不同的播放
		if((isApp534) && (!isXlWeibo) && (!isTtWeibo) && (!isRrWeibo)){
			//TODO ?对于applewebkit534.30类型的浏览器，使用play()方法不能播放，需要手动在点击才行，暂时没有找到js替代手动在点击的实现方法，所以先调用第三方软件?
			addDemandLastLook(videoId,"video",channel,program,videoUrl,videoUrl,"");
		}else{
			//设置图片
			document.getElementById("tvDemandDetailsImg").src=sdmtv.IMG_BASEPATH+ videoImg;
			var tempvideoname = videoName;
			if(videoName.length>21){
				tempvideoname = videoName.substring(0, 20) + "..";
			}
			document.getElementById("tvDemandDetailsName").innerHTML=tempvideoname;
			document.getElementById("tvDemandDetailsPlayName").innerHTML=tempvideoname;
			//设置收藏
			var CollectedText = document.getElementById("tvDemand_DetailsSkull");
			collectionReset(CollectedText, "video", videoId, customerCollectionId);
			//获取播放地址
			addDemandLastLook(videoId,"video",channel,program,videoUrl,videoUrl,"trueVideo");
			window.setTimeout(function(){
				$("#vewPlayBut").trigger("click");
			},500);
		}
	}else{
		handErrorMsg(ajaxObj.message);
	}
};

// 跳转至分享页面
function tvDemandDetails_shareInitToshare(programName){
	window.sessionStorage.setItem(SHARE_PROGRAM_ID,tvDemand_Details_ObjUrl.tvDemand_videoId);
	window.sessionStorage.setItem(SHARE_PROGRAM_NAME,programName);
	window.sessionStorage.setItem(SHARE_PROGRAM_TYPE,"video");
	share_getWeiboShareBindInfo("shareContent");
};

/**
 * 静态页面调用接口
 */
function staticPageInter(){
	//调用静态页面的接口
	new $sdmtv_ajax({"cls":"Common_pageview", "pageCode":"1-web-v-detail"}, function (ajaxObj) {});
};

//设置返回按钮
function tvDemandBack(){
	window.location.href = sdmtv.BASEPATH + "doVidPar.servlet?from=000908&type=20&value=";
};
		
//控制显示中间标题
window.setTimeout(function() {
	var titleTop = $("#middle_title")[0].offsetTop;
	$(window).bind("touchmove scroll", function() {
		//滚动时判断滚动条距离顶部的高度
		var scrTop = $(window).scrollTop();
		if (scrTop > titleTop) {
			$("#title_top").show();
		}else{
			$("#title_top").hide();
		}
	});
}, 1000);

//显示、播放
$("#vewPlayBut").on("click", function() {
	//开始播放
	var getPlaySrc = $("#videoPlay").attr("src");
	if((""==getPlaySrc) || (null==getPlaySrc) || (undefined==getPlaySrc)){
		prevLoad = 0;
		addDemandLastLook(dovideoId,"video",dochannel,doprogram,dovideoUrl,dovideoUrl,"trueVideo",prevLoad);
		setTimeout(function(){
			if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
				window.location.href=$("#videoPlay").attr("src");
				setTimeout(function(){
					$("#playVewSenDiv").attr("class","playVewSenDivBig");
				},500);
			}else{
				doPlayer.play();
				//设置隐藏数据
				ifPlay = false;
				//ifPlay = true;
				timeCount = 0;
				doTimeCount();
			}
		},1000);
	}else{
		//预加载反馈
		if(1==prevLoad){
			new $sdmtv_ajax({"cls":"CustomerVisit_updatePlayType", "mediaURL":getPlaySrc}, function (ajaxObj) {
				//播放
				if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
					window.location.href=getPlaySrc;
					setTimeout(function(){
						$("#playVewSenDiv").attr("class","playVewSenDivBig");
					},500);
				}else{
					doPlayer.play();
					//设置隐藏数据
					ifPlay = false;
					//ifPlay = true;
					timeCount = 0;
					doTimeCount();
				}
			});
		}else{
			//播放
			if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
				window.location.href=getPlaySrc;
				setTimeout(function(){
					$("#playVewSenDiv").attr("class","playVewSenDivBig");
				},500);
			}else{
				doPlayer.play();
				//设置隐藏数据
				ifPlay = false;
				//ifPlay = true;
				timeCount = 0;
				doTimeCount();
			}
		}
	}
	if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
	}else{
		//切换显示样式
		document.getElementById("playVideoVew").style.display = "none";
		document.getElementById("playVideoDiv").style.display = "block";
		//图片设置
		$("#btnVideoPlay").attr("src",sdmtv.BASEPATH+"wapts/images/bt_dsxq_stop.png");
		//显示缓冲图片
		document.getElementById("rotaImg").style.display = "block";
		//设置隐藏数据
		document.getElementById("playBarDiv").style.display = "block";
		document.getElementById("speedDiv").style.display = "none";
	}
});
//播放暂停
$("#btnVideoPlay").on("click", function() {
	if(doPlayer.paused) {
		var getPlaySrc = $("#videoPlay").attr("src");
		if((""==getPlaySrc) || (null==getPlaySrc) || (undefined==getPlaySrc)){
			addDemandLastLook(dovideoId,"video",dochannel,doprogram,dovideoUrl,dovideoUrl,"trueVideo");
			setTimeout(function(){
				if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
					window.location.href=$("#videoPlay").attr("src");
					setTimeout(function(){
						$("#playVewSenDiv").attr("class","playVewSenDivBig");
					},500);
				}else{
					doPlayer.play();
					//设置隐藏数据
					ifPlay = false;
					//ifPlay = true;
					timeCount = 0;
					//计时
					doTimeCount();
				}
			},1000);
		}else{
			if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
				window.location.href=getPlaySrc;
				setTimeout(function(){
					$("#playVewSenDiv").attr("class","playVewSenDivBig");
				},500);
			}else{
				doPlayer.play();
				//设置隐藏数据
				ifPlay = false;
				//ifPlay = true;
				timeCount = 0;
				//计时
				doTimeCount();
			}
		}
		if(isFireFox || isIDevice || isWindows || l39uChorme || isAnd2){
		}else{
			$("#btnVideoPlay").attr("src",sdmtv.BASEPATH+"wapts/images/bt_dsxq_stop.png");
			//显示缓冲图片
			document.getElementById("rotaImg").style.display = "block";
		}
	}else {
		doPlayer.pause();
		$("#btnVideoPlay").attr("src",sdmtv.BASEPATH+"wapts/images/bt_dsxq_play2.png");
		//隐藏缓冲图片
		document.getElementById("rotaImg").style.display = "none";
		//设置隐藏数据
		ifPlay = false;
		timeCount = 10;
	}
});