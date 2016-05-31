//动态添加样式，保证屏幕适配
var WindowWidth=document.documentElement.clientWidth;
if(WindowWidth==null){
	WindowWidth=window.screen.width;
}
var Swidth = WindowWidth > 400 ? "400" : WindowWidth;
var WindowHeight=document.documentElement.clientHeight;
if(WindowHeight==null){
	WindowHeight=window.screen.height;
}
var Swidth = WindowWidth > 400 ? "400" : WindowWidth;
var Sheight=WindowHeight;
if(Swidth==null||Swidth<60){
	if(window.sessionStorage.getItem("allreadyReload")!=1){
	window.sessionStorage.setItem("allreadyReload",1);
	window.location.reload();
	}
}
document.write("<style>#page{margin: 0 auto;width:" +Swidth + "px;min-height:"+(Sheight)+"px;}#pageI{min-height:"+(Sheight)+"px;} .title{text-align:center;width:100%;height:50px;font-size:20px}._qingk{left:"+(window.screen.width/2-Swidth/2+10)+"px;} .footerpage{width:"+Swidth+"px;}.fullWidth{width:"+Swidth+"px}.less90{width:"+(Swidth-90)+"px;}</style>");

window.addEventListener("orientationchange", function() { 
	setTimeout(adapt, 500);
}, false); 
//-模拟logo
//document.write('<link rel="stylesheet" type="text/css" href="css/green.css"/>');

//横竖屏切换时触发，保证屏幕适配
/*
$(window).bind("orientationchange", function (e) {
	setTimeout(adapt, 500);
});*/
var ua = navigator.userAgent.toLowerCase();

var iswx=(ua.match(/MicroMessenger/i)=="micromessenger");

var isand=!(/iphone|ipad/gi).test(navigator.appVersion);


function adapt() {
	if(isand){
		
		return false;
	}
	var wid=document.documentElement.clientWidth;
	if(wid==null){
		wid=window.screen.width;
	}
	Jwidth = wid > 400 ? "400" : wid;
	
	
	if (Swidth != Jwidth || Jwidth != 320) {
		
		location.reload();
		
	}
}

var Class = function () {
	var klass = function () {
		this.init.apply(this, arguments);
	};
	klass.prototype.init = function () {
	};
	klass.fn = klass.prototype;
	klass.fn.parent = klass;
	klass.extend = function (obj) {
		var extended = obj.extended;
		for (var i in obj) {
			klass[i] = obj[i];
		}
		if (extended) {
			extended(klass);
		}
	};
	klass.include = function (obj) {
		var included = obj.included;
		for (var i in obj) {
			klass.fn[i] = obj[i];
		}
		if (included) {
			included(klass);
		}
	};
	return klass;
};
/**
 * MsgPopup类
 * 
 * 弹出提示信息，3秒钟消失
 * @param winId
 * @return
 */
var MsgPopup = new Class();
MsgPopup.include({timetask:null, windowId:"msg_popup_window", init:function (id) {
	this.windowId = id;
}, createWin:function (msg) {
	return "<div id='" + this.windowId + "' class='msg_popup_mask' style='display:block;'><div><div>" + msg + "</div></div></div>";
}, popupShow:function () {
	//$("#" + this.windowId).fadeIn(300);
}, popupHide:function () {
	//$("#" + this.windowId).fadeOut(300);
}, alert:function (msg) {
	
	this.win = this.createWin(msg);
	//$("#" + this.windowId).remove();
	if (this.timetask != null) {
		window.clearTimeout(this.timetask);
	}
	
	//$("body").append(this.win);
	var element=document.createElement("div");
	element.innerHTML=this.win;
	document.body.appendChild(element);
	//document.body.innerHTML+=this.win;
	setTimeout(function(){
		element.parentNode.removeChild(element);
	},2400);
	return;
	this.popupShow();
	var that = this;
	this.timetask = window.setTimeout(function () {
		that.popupHide();
	}, 2400);
}});
var msgPopup = new MsgPopup("msg_window_mask");
var Alert = function (msg) {
	msgPopup.alert(msg);
};



/**
 * 
 * 
 * 弹出提示信息 取消 确定
 * @param winId
 * @return
 */

var MsgConfirm = new Class();
MsgConfirm.include({timetask:null, windowId:"msg_confirm_window",cancle:false,subm:false, init:function (id) {
	this.windowId = id;
}, createWin:function (msg) {
	if(msg==""||msg==null){
		msg="是否需要登录";
	}
	return "<div id='" + this.windowId + "'  style='display:block;width:100%;height:100%;position:fixed;top:0px;z-index:10'>"+
	"<table cellspacing='0' cellpadding='0' style='width:100%;height:100%;'><tr><td></td><td width='220px' align='center'>"
	+"<table  cellspacing='0' cellpadding='0' id='msg_confirm_window_loginContent' style='width:220px;height:110px;background: rgba(39, 39, 39, 0.8);border-radius:10px;padding-top:10px;position: relative;'>"+
	"<tr ><td width='10px'></td><td colspan='2' style='color:#FFFFFF;font-size:14px;line-height:20px;height:50px;' align='left'>"+msg+"</td><td width='10px'></td></tr><tr>"
	+"<td width='10px'></td><td style='color:#FFFFFF'>"+
	"<div style='width:70px;height:30px;line-height:30px;"+
	"margin-top:-16px;"
	+"text-align:center;float:right;margin-right:10px;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:4px' id='msg_confirm_submi'>确定</div>"
	+"</td><td style='color:#FFFFFF;'>"+
	"<div style='width:70px;height:30px;line-height:30px;"+
	"margin-top:-16px;"
	+"text-align:center;float:right;margin-right:10px;color:#FFFFFF;border:1px solid #FFFFFF;border-radius:4px' id='msg_confirm_cancle'>取消</div>"
	+"</td><td width='10px'></td></tr>"
	+"</table></td><td></td></tr></table>"
	+"</div>"
}, confir:function (msg,callback,callback2) {
	
	this.win = this.createWin(msg);
	//$("#" + this.windowId).remove();
	
	var element=document.createElement("div");
	element.innerHTML=this.win;
	
	
	document.body.appendChild(element);
	
	var cancelbtn=document.getElementById("msg_confirm_cancle");
	
	var submibtn=document.getElementById("msg_confirm_submi");
	var that=this;
	cancelbtn.onclick=function(){
		if(callback2){	
			callback2();
		}else{
		element.parentNode.removeChild(element);
		}
		}
	submibtn.onclick=function(){
		element.parentNode.removeChild(element);
		callback();
	}
	
	
	//document.body.innerHTML+=this.win;
	/*setTimeout(function(){
		element.parentNode.removeChild(element);
	},2400);
	*/
	
/*	while(this.cancle==false||this.subm==false){

	}
	element.parentNode.removeChild(element);
	
	if(this.cancle){
	this.cancle=false;
	this.subm=false;
	return false;	
	}else{
		this.cancle=false;
		this.subm=false;
		return true;
	} 
		*/
		
	
}});
var msgConfirm = new MsgConfirm("msg_window_mask");
var Confirm = function (msg,callback,callback2) {
	return msgConfirm.confir(msg,callback,callback2);
};

function showSearch(ele) {
	if (document.getElementById("searchTab").style.display == "none") {
		//ele.src="img/search1.png";
		document.getElementById("header").style.height = "90px";
		
		document.getElementById("searchTab").style.display = "";
	} else {
		//ele.src="img/search2.png";
		document.getElementById("header").style.height = "45px";

		document.getElementById("searchTab").style.display = "none";
	}
}
function goClick(ele) {
	
	ele.value = "";
	ele.style.color = "black";
	ele.onclick = function () {
	};
	document.getElementById("subIcon").onclick = function () {
		toSearch();
	};
}
function toSearch() {
	
	var val = document.getElementById("searchWord").value;
	if (val.replace(/(^\s*)/, "") == "") {
		Alert(document.getElementById("emptyWord").value);
		return;
	} else {
		if (val.match(/[<>&%]/)) {
			Alert(document.getElementById("wrongWord").value);
			return;
		} else {
			val = encodeURI(encodeURI(val));
			var copID = document.getElementsByName("copID")[0].value;
			var cid = document.getElementsByName("channelID")[0].value;
		//document.getElementById("searchForm").submit();
			window.location.href =  "searchorderContent.do?word=" + val + "&copID=" + copID+"&channelID="+cid;
		}
	}
}
function isPhone(object) {
	var s = document.getElementById(object.id).value;
	var reg0 = /^1[3,4,5,7,8,9]\d{9}$/;
	var reg3 = /^((0[0-9]{2,3})-)([0-9]{7,8})(-([0-9]{3,}))?$/;
	var my = false;
	if (reg0.test(s)||reg3.test(s)) {
		my = true;
	}
//if (reg3.test(s))my = true ;
	return my;
}

function isPhone2(s) {

	var reg0 = /^1[3,4,5,7,8,9]\d{9}$/;
	
	var my = false;
	if (reg0.test(s)) {
		my = true;
	}
//if (reg3.test(s))my = true ;
	return my;
}
function checklen(s, num) {
	var l = 0;
	var a = s.split("");
	for (var i = 0; i < a.length; i++) {
		if (a[i].charCodeAt(0) < 256) {
			l++;
		} else {
			l+= 2;
		}
	} 
	//return l; 
	if (l > num) {
		return false;
	} else {
		return true;
	}
}
function getlen(s){
	var l = 0;
	var a = s.split("");
	for (var i = 0; i < a.length; i++) {
		if (a[i].charCodeAt(0) < 256) {
			l++;
		} else {
			l += 2;
		}
	} 
	return l;
}
function addShadow(ele, value) {
	ele.style.background = "rgba(39, 39, 39, 0.3)";
	ele.style.borderBottom = "1px solid rgba(39, 39, 39, 0.1)";
	if (value == "1") {
		ele.style.borderRight = "1px solid rgba(39, 39, 39, 0.1)";
	} else {
		ele.style.borderLeft = "1px solid rgba(39, 39, 39, 0.1)";
	}

	//border-top: 1px solid rgba(1000, 1000, 1000, 0.7);border-left: 1px solid rgba(1000, 1000, 1000, 0.7);
	//border-right: 1px solid rgba(39, 39, 39, 0.1);border-bottom: 1px solid rgba(39, 39, 39, 0.1);
}
function removeShaow(ele) {
	ele.style.background = "";
	ele.style.border = "0px";
}
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {  
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {  
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);  
    } else {  
        return this.replace(reallyDo, replaceWith);  
    }  
}  
function reMoveEnter(e)
{
var keynum
var keychar
var numcheck

if(window.event) // IE
  {
  keynum = e.keyCode
  }
else if(e.which) // Netscape/Firefox/Opera
  {
  keynum = e.which
  }
if(keynum==13){
	searchForm.onsubmit=function(){
		return false;
		}
	}

}
function getElementsByClassName(clsName,htmltag){   
    var arr = new Array();   
    var elems = document.getElementsByTagName(htmltag);  
    for ( var cls, i = 0; ( elem = elems[i] ); i++ ){  
    if ( elem.className == clsName ){   
    arr[arr.length] = elem;  
    }  
    }  
    return arr;  
}