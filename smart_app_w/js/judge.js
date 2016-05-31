var isAndroid = (/android/gi).test(navigator.appVersion); //安卓手机
var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion); //IOS手机
var isWindows = (/Windows Phone/gi).test(navigator.appVersion); //windows手机
var isPlaybook = (/playbook/gi).test(navigator.appVersion);
var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
var isApp534 = (/applewebkit534.30|applewebkit\/534.30/gi).test(navigator.userAgent.toLowerCase()); //是否是534.30型号的浏览器，欧朋和360有的是534.30型号
//针对三星note2、联想P770的判断，三星note2、联想P770自带浏览器，用苹果流退出页面后还有声音(新增三星s5手机)
var note2 = (/gt-n7100/gi).test(navigator.appVersion);
var lenovo770 = (/lenovo p770/gi).test(navigator.appVersion);
var noteS5 = (/sm-g/gi).test(navigator.appVersion);
var isAnd4 = (/android 4/gi).test(navigator.userAgent.toLowerCase());
var browseVersion = (/mobile safari/gi).test(navigator.userAgent.toLowerCase());

//判断手机是安卓还是IOS
function judge(m3u8,rtsp,obj){
    if(isAndroid){
    	window.location.href=rtsp;
    }else if(isIDevice){
    	window.location.href=m3u8;
    }else if(isWindows){
    	window.location.href=m3u8;
    }else{
    	window.location.href=m3u8;
    }
};
//添加观看记录
function addLastLook(id,type,m3u8,rtsp,playFlag,doPrevLoad,obj){
	doPrevLoad = 0;
	var PlauParams = {
		"cls":"CustomerVisit_add02",
		"visitType":type,
		"visitValue":id,
		"prevLoad":doPrevLoad
	};
	var data = {
		"androidUrl":rtsp,
		"iphoneUrl":m3u8,
		"obj":obj
	};
	
	//判断设备和类型
	if(("trueVideo"==playFlag) && (!isIDevice) && (!isApp534)){
		sdmtv.OS_TYPE = "ios";
	}
	//三星note2、联想P770手机的判断
	if(("trueVideo"==playFlag) && (!isIDevice) && (note2||lenovo770) && (isAnd4) && (browseVersion) && (isApp534)){
		sdmtv.OS_TYPE = "ios";
	}
	//if(("trueVideo"==playFlag) && (!isIDevice) && (isApp534) && (noteS5)){
		//sdmtv.OS_TYPE = "ios";
	//}
	
	new $sdmtv_ajax(PlauParams,function(ajaxObj){
		if(ajaxObj.code == ajaxObj.constants.SUCCESS){
			var objs = ajaxObj.objs;
			$(objs).each(function(i){
				m3u8 = this.get("HDUrl");
				rtsp = this.get("SDUrl");
				if(0==i){
					if("trueAudio"==playFlag){
						$("#audioPlay").attr("src",rtsp);
					}else if("trueVideo"==playFlag){
						$("#videoPlay").attr("src",rtsp);
					}else{
						judge(rtsp,rtsp,data.obj);
					}
				}
			});
			setTimeout(function(){
				$(document).trigger("refresh");
			},500);
			//还原VERSION
			sdmtv.OS_TYPE = (/iphone|ipad/gi).test(navigator.appVersion) ? "ios" : "android";
		}else if(ajaxObj.code == 210){
			//跳转登录页面
			location.href = sdmtv.BASEPATH + "doLogPag.servlet?from=000908&type=10&value=";
		}else{
			//接口有时调用会报错：203。此时需要再调用一次
			setTimeout(function(){
				new $sdmtv_ajax(PlauParams,function(ajaxObj){
					if(ajaxObj.code == ajaxObj.constants.SUCCESS){
						var objs = ajaxObj.objs;
						$(objs).each(function(i){
							m3u8 = this.get("HDUrl");
							rtsp = this.get("SDUrl");
							if(0==i){
								if("trueAudio"==playFlag){
									$("#audioPlay").attr("src",rtsp);
								}else if("trueVideo"==playFlag){
									$("#videoPlay").attr("src",rtsp);
								}else{
									judge(rtsp,rtsp,data.obj);
								}
							}
						});
						setTimeout(function(){
							$(document).trigger("refresh");
						},500);
					}else{
						//提示信息
						//handErrorMsg(ajaxObj.message);
					}
				});
				
				//还原VERSION
				sdmtv.OS_TYPE = (/iphone|ipad/gi).test(navigator.appVersion) ? "ios" : "android";
		    }, 2000);
		}
	});
};
//点播观看记录
function addDemandLastLook(id,type,channel,CTPId,androidUrl,iphoneUrl,playFlag,doPrevLoad,obj){
	doPrevLoad = 0;
	var PlauParams = {
		"cls":"CustomerVisit_add02",
		"visitType":type,
		"visitValue":id,
		"channelId":channel,
		"tvColumnId":CTPId,
		"prevLoad":doPrevLoad
	};
	var data = {
		"androidUrl":androidUrl,
		"iphoneUrl":iphoneUrl,
		"obj":obj
	};
	
	//判断设备和类型
	if((("netVideo"==type) || ("video"==type)) && ("trueVideo"==playFlag) && (!isIDevice)){
		sdmtv.OS_TYPE = "ios";
	}
	
	new $sdmtv_ajax(PlauParams,function(ajaxObj){
		if(ajaxObj.code == ajaxObj.constants.SUCCESS){
			var objs = ajaxObj.objs;
			//获取数据
			var m3u8;
			var rtsp;
			$(objs).each(function(i){
				m3u8 = this.get("HDUrl");
				rtsp = this.get("SDUrl");
				if(0==i){
					if("trueAudio"==playFlag){
						$("#audioPlay").attr("src",rtsp);
					}else if("trueVideo"==playFlag){
						$("#videoPlay").attr("src",rtsp);
					}else{
						judge(rtsp,rtsp,data.obj);
					}
				}
			});
			setTimeout(function(){
				$(document).trigger("refresh");
			},500);
			//还原VERSION
			sdmtv.OS_TYPE = (/iphone|ipad/gi).test(navigator.appVersion) ? "ios" : "android";
		}else{
			//接口有时调用会报错：203。此时需要再调用一次
			setTimeout(function(){
				new $sdmtv_ajax(PlauParams,function(ajaxObj){
					if(ajaxObj.code == ajaxObj.constants.SUCCESS){
						var objs = ajaxObj.objs;
						//获取数据
						var m3u8;
						var rtsp;
						$(objs).each(function(i){
							m3u8 = this.get("HDUrl");
							rtsp = this.get("SDUrl");
							if(0==i){
								if("trueAudio"==playFlag){
									$("#audioPlay").attr("src",rtsp);
								}else if("trueVideo"==playFlag){
									$("#videoPlay").attr("src",rtsp);
								}else{
									judge(rtsp,rtsp,data.obj);
								}
							}
						});
						setTimeout(function(){
							$(document).trigger("refresh");
						},500);
					}else{
						//提示信息
						//handErrorMsg(ajaxObj.message);
					}
				});
				
				//还原VERSION
				sdmtv.OS_TYPE = (/iphone|ipad/gi).test(navigator.appVersion) ? "ios" : "android";
		    }, 2000);
		}
	});
};

/**
 * 播放的公共接口
 * @param param
 * @return
 */
function broadcast_unifiedPlayer(param) {
	var type = param.type;
	var id = param.id;
	var name = param.name;
	var customerCollectionId = param.customerCollectionId;
	var channel = param.channel;
	var program = param.program;
	var m3u8,rtsp;
	var customerId = window.sessionStorage.getItem("customerId");
	var broadcastParams = {
		"cls" : "CustomerVisit_add02",
		"visitType" : type,
		"visitValue":id
	};
	if(channel!=null){
		broadcastParams.channelId = channel;
	}
	if(program!=null){
		broadcastParams.tvColumnId = program;
	}
	new $sdmtv_ajax(broadcastParams,function(ajaxObj){
		if(ajaxObj.code == ajaxObj.constants.SUCCESS){
			var objs = ajaxObj.objs;
			setTimeout(function(){
				$(document).trigger("refresh");
			},500);
		}
		$(objs).each(function(){
			m3u8 = this.get("HDUrl");
			rtsp = this.get("SDUrl");
		});
		judge(rtsp,rtsp);
	});
};