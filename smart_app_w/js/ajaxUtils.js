var ppqilu = {
	VERSION : "wap-v1.0",// 版本号
	BASEPATH : "http://qingk.cn/",
	BASEPATH2 : "",
	//BASEPATH : "http://119.164.219.222/",
	REQUESTPATH : "",
	IMG_BASEPATH : "http://qingk.cn/",
	//ALLOOKPATH:"http://testmbp.allook.cn/ajax/MbpRequest.do",//tv接口
	
	ALLOOKPATH:"http://mbp.allook.cn/ajax/MbpRequest.do",//tv正式接口	
	ALLOOKIMAGEPATH:"http://s.allook.cn/",	
	COMPANY : "Copyright © 2013 All Rights Reserved<br />山东网络广播电视台",
	OS_TYPE : (/iphone|ipad/gi).test(navigator.appVersion) ? "ios" : "android",
    PRODUCT :"13",
    TERMINAL:"1"//终端类型 1手机 0 pc 可加判断拦截
}

/**
 * ajax调用
 * 
 * @param {}
 *            params
 * @param {}
 *            callBack
 */
var $ppqilu_ajax = function(params, callBack, callBackParams, option) {

	this.constants = {// 常量
		CODE : "code",
		TOTAL_COUNT : "totalCount",
		MESSAGE : "message",
		OBJ_FLAG : "obj",
		SUCCESS : 100,
		//REPEAT_ACCOUNT : 300,// 账号重复登录
		//SESSION_OUT : 400// session超时
	
	}, this.callBack = callBack, this.callBackParams = callBackParams, this.option = option, this.code, // ajax请求结果
	// 100成功，其余失败
	this.message, // 交互后消息，ajax失败时存放错误提示信息。如服务器忙，请稍后重试！
	this.objs = new Array(), // 结果集，里面存放的hashmap Object，获取值直接obj.get("attr")
	
	this.params = _addExtensionInfo(params);
	
	this.loadData(); // 加载数据
};

var $ppqilu_ajaxtv = function(params, callBack, callBackParams, option) {

	this.constants = {// 常量
		CODE : "code",
		TOTAL_COUNT : "totalCount",
		MESSAGE : "message",
		OBJ_FLAG : "obj",
		SUCCESS : 100,
		//REPEAT_ACCOUNT : 300,// 账号重复登录
		//SESSION_OUT : 400// session超时
	
	}, this.callBack = callBack, this.callBackParams = callBackParams, this.option = option, this.code, // ajax请求结果
	// 100成功，其余失败
	this.message, // 交互后消息，ajax失败时存放错误提示信息。如服务器忙，请稍后重试！
	this.objs = new Array(), // 结果集，里面存放的hashmap Object，获取值直接obj.get("attr")
	this.params = _addExtensionInfo(params);
	this.loadData1(); // 加载数据
};


/**
 * 添加初始化参数
 * 
 * @param {}
 *            params
 * @return {}
 */

function _addExtensionInfo(params) {
	
	if(params.version==null){
		params.version = ppqilu.VERSION;	
	}
	
	
	if(params.os_type==null){
		params.os_type = ppqilu.OS_TYPE;	
	}
	
	if(params.product==null){	
		params.product = ppqilu.PRODUCT;
	}
	if(params.customer_id==null){
		
		var cus=window.localStorage.getItem("customerId");
	
	
		cus==null?"":cus;
		
		params.customer_id=cus;
	}
	if(params.cusName==null){
		
		var cusName=window.localStorage.getItem("cusName");
	
	
		cusName==null?"":cusName;
		
		params.cusName=cusName;
	}
	
	params.terminal=ppqilu.TERMINAL;
	
	var virtualId=window.localStorage.getItem("virtualId");
	if(virtualId==null||virtualId==""||virtualId.length!=32){
		virtualId=newGuid();
		window.localStorage.setItem("virtualId",virtualId);
	}
	params.virtualId=virtualId;
	var coppId=getQueryString("copID");
	
	params.urlCopID=(coppId==null?"0":coppId);
	
	
	return params;

	}

$ppqilu_ajax.prototype.loadData = function() {
	var temp = this;
	var param="";
	var postData=temp.params.postData;
	if(postData==null){
		postData="";
	}
	postData=encodeURI(postData);
	for(var attr in temp.params){
		if(attr!="postData"){
		param+="&"+attr+"="+encodeURI(temp.params[attr]);
		}
	}
	
	
	var xmlHttp=getajaxHttp();
	xmlHttp.onreadystatechange=function(){

		 if(xmlHttp.readyState==4){
			var domParser = new  DOMParser();
			
		
		
            var  xmlDoc = domParser.parseFromString(xmlHttp.responseText,'text/xml');
            // alert(xmlHttp.responseText);
			var objs=xmlDoc.getElementsByTagName("obj");
			var arrs=new Array();
			for(var i=0;i<objs.length;i++){
				var obj=objs[i];
				
				var nodes=obj.childNodes;
				var map=new HashMap();
				for(var j=0;j<nodes.length;j++){
					var node=nodes[j];	
					
					var name=node.nodeName;
					var child=node.firstChild;
					var text;
					if(child==null){
						text="";	
					}else{
						text=node.firstChild.nodeValue;
						text=text.replaceAll("%26and","&");
					}
					map.put(name,text);
				}
				arrs.push(map);
				
			}
			var all;
			if(xmlDoc.getElementsByTagName("object")[0]==null){
				all=new Array();	
			}else{
				all=xmlDoc.getElementsByTagName("object")[0].childNodes;
			}
			for(var i=0;i<all.length;i++){
				var namet=all[i].nodeName
				if(namet!="obj"){
					var child0=all[i].firstChild;
					var tex;
					if(child0==null){
						tex="";
					}else{
						tex=all[i].firstChild.nodeValue;
					}
					temp[namet]=tex;
				}
			}
			
		
			//temp.code=100;
			temp.message="message";		
			temp.objs=arrs;
		
			callBackHandle(temp, temp.callBack, temp.callBackParams);
		 }
	 }
	
	//prompt("",ppqilu.BASEPATH+"dealRequest.do?" + new Date()+param);
	xmlHttp.open("post",ppqilu.REQUESTPATH+"dealRequest.do?" + new Date()+param,true);
	xmlHttp.setRequestHeader("xmlHttpFormData","xhttp-ajax");
	xmlHttp.send(postData);
};


$ppqilu_ajaxtv.prototype.loadData1 = function() {
	var temp = this;
	var param="";
	for(var attr in temp.params){
		param+="&"+attr+"="+encodeURI(temp.params[attr]);
		
	}
	
	
	var xmlHttp=getajaxHttp();
	xmlHttp.onreadystatechange=function(){
		 if(xmlHttp.readyState==4){
			 var domParser = new  DOMParser();
		
            var  xmlDoc = domParser.parseFromString(xmlHttp.responseText,'text/xml');
         
			var objs=xmlDoc.getElementsByTagName("obj");
			var arrs=new Array();
			for(var i=0;i<objs.length;i++){
				var obj=objs[i];
				
				var nodes=obj.childNodes;
				var map=new HashMap();
				for(var j=0;j<nodes.length;j++){
					var node=nodes[j];	
					
					var name=node.nodeName;
					var child=node.firstChild;
					var text;
					if(child==null){
					text="";	
					}else{
					text=node.firstChild.nodeValue;
					//text=text.replaceAll("%26and","&");
					}
					map.put(name,text);
				}
				arrs.push(map);
				
			}
			var all;
			if(xmlDoc.getElementsByTagName("rtn")[0]==null){
			all=new Array();	
			}else{
			all=xmlDoc.getElementsByTagName("rtn")[0].childNodes;
			}
			for(var i=0;i<all.length;i++){
				var namet=all[i].nodeName
				if(namet!="obj"){
					var child0=all[i].firstChild;
					var tex;
					if(child0==null){
						tex="";
					}else{
						tex=all[i].firstChild.nodeValue;
					}
					temp[namet]=tex;
					
				}
			}
			
		
			//temp.code=100;
		//	temp.message="message";		
			temp.objs=arrs;
			callBackHandle(temp, temp.callBack, temp.callBackParams);
			
		 }
	 }
	//prompt("",ppqilu.ALLOOKPATH+"?ab=1"+param);
	
	xmlHttp.open("post",ppqilu.ALLOOKPATH+"?ab=1"+param,true);
	//xmlHttp.setRequestHeader("xmlHttpFormData","xhttp-ajax");
	xmlHttp.send(null);
	
	
};





function getajaxHttp() {
	
	    var xmlHttp;
	  try {
	
	        // Firefox, Opera 8.0+, Safari

	        xmlHttp = new XMLHttpRequest();

	        } catch (e) {
	
	            // Internet Explorer

	            try {
	
	                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	
	            } catch (e) {
	
	            try {

	                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");

	            } catch (e) {
	
	                alert("您的浏览器不支持AJAX！");
	
	                return false;
	
	            }
	
	        }
	
	    }
	
	    return xmlHttp;
	
	}


function handleRes($data, temp) {
	
	temp.code = $data.find(temp.constants.CODE).text();
	
	temp.message = $data.find(temp.constants.MESSAGE).text();
	
	if (temp.code == temp.constants.SUCCESS) {// 处理成功
		var totalCountQuery = $data.find(temp.constants.TOTAL_COUNT).text();
		if (totalCountQuery >= 0) {
			temp.params.totalCount = totalCountQuery;
			temp.totalCount=totalCountQuery;
		}	
		$data.find(temp.constants.OBJ_FLAG).each(function(i) {
					(temp.objs)[i] = new HashMap();
					$(this).children().each(function() {
						var text=$(this).text().replaceAll("%26and","&");
						(temp.objs)[i].put(this.nodeName,
										text
										
								);
							})
				});
		callBackHandle(temp, temp.callBack, temp.callBackParams);
	}else{
		Alert("error");
	}
}

function callBackHandle(temp, callBack, callBackParams) {

		if (callBackParams) {
			callBack(temp, callBackParams);
		} else {
			callBack(temp);
		}
	
}
function HashMap() {
	/** Map大小* */
	var size = 0;
	/** 对象* */
	var entry = new Object();
	/** Map的存put方法* */
	this.put = function(key, value) {
		if (!this.containsKey(key)) {
			size++;
			entry[key] = value;
		}
	}
	/** Map取get方法* */
	this.get = function(key) {
		return this.containsKey(key) ? entry[key] : "";
	}
	/** Map删除remove方法* */
	this.remove = function(key) {
		if (this.containsKey(key) && (delete entry[key])) {
			size--;
		}
	}
	/** 是否包含Key* */
	this.containsKey = function(key) {
		return (key in entry);
	}
	/** 是否包含Value* */
	this.containsValue = function(value) {
		for (var prop in entry) {
			if (entry[prop] == value) {
				return true;
			}
		}
		return false;
	}
	/** 所有的Value* */
	this.values = function() {
		var values = new Array();
		for (var prop in entry) {
			values.push(entry[prop]);
		}
		return values;
	}
	/** 所有的 Key* */
	this.keys = function() {
		var keys = new Array();
		for (var prop in entry) {
			keys.push(prop);
		}
		return keys;
	}
	/** Map size* */
	this.size = function() {
		return size;
	}
	/** 清空Map* */
	this.clear = function() {
		size = 0;
		entry = new Object();
	}
}
String.prototype.replaceAll  = function(s1,s2){  
	return this.replace(new RegExp(s1,"gm"),s2); 
}
function newGuid(){
	var guid = "";
    for (var i = 1; i <= 32; i++){
		var n = Math.floor(Math.random()*16.0).toString(16);
		guid += n;
	}
	return guid;
}
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
	} 
//是否微信
var isweixinlogoin=0;
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() { isweixinlogoin=1}, false);