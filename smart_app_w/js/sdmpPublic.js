/**
 * 分析URL，返回array
 * @return
 */
function analysisURL(){
	var url = location.href; 
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
	var paraObj = new Array();
	for (i=0; j=paraString[i]; i++){ 
		paraObj[j.substring(0,j.indexOf("="))] = j.substring(j.indexOf("=")+1,j.length); 
	}
	return paraObj;
}

/*返回上一页*/  
function return_prepage() {
	var beforeUrl = window.document.referrer;
	if (beforeUrl == ""
			|| beforeUrl == window.location.href) {
		window.location.href = sdmtv.BASEPATH;
	} else {
		// 如果后退到前一个页面为错误提示页或登录模块的页面，则跳转到首页
		if(beforeUrl.indexOf("Error.jsp") > 0
				|| beforeUrl.indexOf("/login/") > 0){
			window.location.href = sdmtv.BASEPATH;
		}else {
			window.location.href =  beforeUrl;
		}
	}
} 
// 注册后，页面返回
function redirectionAfterLogin() {
	var beforeUrl = window.document.referrer;
	if (beforeUrl == ""
			|| beforeUrl == window.location.href) {
		window.location.href = sdmtv.BASEPATH;
	} else {
		// 如果后退到前一个页面为错误提示页，则继续后退
		if(beforeUrl.indexOf("Error.jsp") > 0){
			window.location.href = sdmtv.BASEPATH;
		}else {
			window.location.href =  beforeUrl;
		}
	}
	history.go(-1);
}
/**
 * 过滤字符串中的html标签和空格
 * @param html
 * @return
 */
function common_htmlFlagFilter(html) {
	var s = html.replace(/<.*?>/g, "");
	s = s.replace(/\s|&nbsp;/g, "");
	return s;
}
/*
 * 
 *  加载更多
 */
function checkLoadMore(begin,end,totalCount, params, callBackFunction,loadmoreId) {
	if (params.beginNum + params.step >= params.totalCount) {
		document.getElementById(loadmoreId).style.display = "none";
	} else {
		document.getElementById(loadmoreId).style.display = "block";
		var loadmore = document.getElementById(loadmoreId);
		loadmore.innerHTML = "<center><div class='common_loadMore'>加载更多</div></center>";
		loadmore.firstChild.onclick = function() {
			params.beginNum = params.beginNum + params.step;
			new $sdmtv_ajax(params, callBackFunction);
		}
	}
}
/**
 * 页面跳转函数
 * @param url
 * @param params
 * @return
 */
var gotoPage = function(url, params) {
	if (params != null) {
		var pa = "";
		var prefix = "?"
		for (var p in params) {
			pa = pa + prefix + p + "=" + params[p];
			prefix = "&";
		}
		window.location.href = url + pa;
	} else {
		window.location.href = url;
	}
/*	local
	window.sessionStorage.setItem("subjectId", params.subjectId);
	window.sessionStorage.setItem("subjectType", params.subjectTypeName);
	window.sessionStorage.setItem("subjectName", params.subjectName);
	$.mobile.changePage(url);
*/
}

/**
 * 节目预告列表
 * 
 * @param broadcastProgramRealationId
 * @param liveTime
 * @param programName
 * @param isNowBroadcast
 * @param isNextBroadcast
 * @return
 */
function trailerCompositionHTML(params) { // isCanTip, isTip, customeTipId
	var table = document.createElement("table");
	table.className = "tvNoticeCss";
	var html = "<tr>" + "<td width='4px'></td>"
		+ "<td style='width:50px;' align='center'>" + params.liveTime + "</td>";
	if (params.isNowBroadcast == "true") {
		html = html
			+ "<td align='left' style='line-height:40px;font-weight: bold;overflow:hidden;text-overflow:ellipsis;display:block;white-space:nowrap;'>正在："
			+ params.programName;
	} else if (params.isNextBroadcast == "true") {
		html = html + "<td align='left' style='line-height:40px;overflow:hidden;text-overflow:ellipsis;display:block;white-space:nowrap;'>即将：" + params.programName;
	} else {
		html = html + "<td align='left' style='line-height:40px;overflow:hidden;text-overflow:ellipsis;display:block;white-space:nowrap;'>" + params.programName;
	}
	var endHtml = "</td><td width='1%'></td><td width='1%'></td></tr>";
	table.innerHTML = html + endHtml;
	// 添加table到列表中
	if (typeof params.elementId ==="string") {
		var divElement = document.getElementById(params.elementId);
		if (divElement) {
			divElement.appendChild(table);
		}
	}

	return table;
}
/**
 * 格式化评论时间
 * @param time
 * @return
 */
function getDateStr(time) {
    var now = new Date()
    var n_seconds = parseInt(now.getTime() / 1000);
    var d = new Date(time);
    var d_seconds = parseInt(d.getTime() / 1000);
    if (d.getYear() != now.getYear()) {
        // 往年
        return time.substring(0, 11);
    } else if (d.getMonth() == now.getMonth()
        && d.getDate() == now.getDate()) {
        // 今天
        var seconds = n_seconds - d_seconds;
        seconds = seconds <= 0 ? 1 : seconds;
        if (seconds < 60) {
            return seconds + "秒前";
        } else if (seconds < 3600) {
            return (parseInt(seconds / 60)) + "分钟前";
        } else {
            return "今天" + time.substring(11, 16);
        }
    } else {
        // 今年，非今天
        return time.substring(5, 16);
    }
}
//返回列表的行
function createNewLine() {
	//<div class="List_Cont_recommend_div"></div>
	var div = document.createElement("div");
	div.className = "List_Cont_recommend_div";
	return div;
}
/**
 * 用户点评列表
 * 
 * @param customerCommitId
 * @param customerName
 * @param createTime
 * @param content
 * @param sex
 * @return
 */
function reviewsCompositionHTML(params) {
	var table = document.createElement("table");
	var grade = "";
	if (typeof params.gradeName == "string" && params.gradeName.length > 0) {
		grade = "(" + params.gradeName + ")"
	}
	var sex=params.sex;
	var imgsrc="";
	if(sex=="2"){
		imgsrc=sdmtv.BASEPATH+"wapts/jsp/grgl/images/Icon_AvatarWonman_84.PNG";	
	}else{
		imgsrc=sdmtv.BASEPATH+"wapts/jsp/grgl/images/Icon_AvatarMan_84.PNG";		
	}
	//sdmtv.BASEPATH
	table.className = "tvDianpinCss";
	table.innerHTML = "<tr>"
			+ "<td rowspan='2' style='width:55px; height:40px; text-align:right;' valign='top' ><img src='"+imgsrc+"' height='40' width='40'/></td><td align='left' style='padding-left:8px; color:#f39c12; font-size:13px;'>"
			+ params.customerName + grade
			+ "</td>"
			+ "<td style='width:90px; text-align:right; padding-right:15px; color:#bfbfbf; font-size:13px;'>"
			+ getDateStr(params.createTime)
			+ "</td>"
			+ "</tr><tr>"
			+ "<td colspan='2' align='left' style='padding-left:8px; padding-top:6px; padding-right:15px; font-size:13px; color:#000000;'>"
			+ replaceSpecialCharacter(params.content) + "</td></tr>";
	// 添加table到列表中
	var divElement = document.getElementById(params.elementId);
	if (divElement) {
		divElement.appendChild(table);
		divElement.appendChild(createNewLine());
	}
}

/**
 * 创建点评输入框
 * 
 * @param programId
 * @param programType
 * @return
 */
var reviewsCreateForm = function(programId, programType, callback) {
	//生成内容
	var textdiv = $("<div onclick='javascript:reviewsCreateFormBefore(\""+programId+"\", \""+programType+"\", "+callback+")'"
					  +" class='reviewsDiv_value'><img style='width:16px; margin-left:5px; margin-right:5px; margin-bottom:3px; vertical-align:middle;' src='"
					  +sdmtv.BASEPATH+"wapts/images/reviewsFormWright.png' />请输入您的评论内容</div>");

	return $("<div id='reviewsFormArea' class='reviewsFormBefore'></div>").append(textdiv);
}

/**
 * 创建点评输入框_点击后
 * 
 * @param programId
 * @param programType
 * @return
 */
function reviewsCreateFormBefore(programId, programType, callback) {
	if(chk_to_page()){
		//去除已有的内容
		$(".reviewsDiv_value").empty();
		//去除绑定事件
		$(".reviewsDiv_value").attr("onclick","");
		//更换样式
		$("#reviewsFormArea").attr("class","reviewsForm");
		//填充新的内容
		var textarea = $("<textarea id='textAreaRev' class='reviews_value'></textarea>");
		var color = function(val) {
			return "<span style='color:#f39c12'>" + val + "</span>";
		};
		var rate = $("<span class='reviews_rate'>" + color(0) + "/100</span>");
		var cancel =$("<div style='background-color:#bcbcbc;' class='reviews_btn_div'>取消</div>");
		var button =$("<div style='background-color:#ffad33; margin-left:10px;' class='reviews_btn_div'>提交</div>");
		var buttonDiv = $("<div class='reviews_btn'></div>");
		buttonDiv.append(cancel).append(button);
	
		// 及时显示输入字数
		textarea.bind("keyup input", function() {
			var tmp = $(this).val();
			rate.html(color($(this).val().length) + "/100");
		});
		textarea.attr("maxlength", 100);
	
		// 取消
		cancel.bind("click", function() {
			//去除已有的内容
			$("#reviewsFormArea").empty();
			//更换样式
			$("#reviewsFormArea").attr("class","reviewsFormBefore");
		
			var textdivTwo = $("<div onclick='javascript:reviewsCreateFormBefore(\""+programId+"\", \""+programType+"\", "+callback+")'"
							  +" class='reviewsDiv_value'><img style='width:16px; margin-left:5px; margin-right:5px; margin-bottom:3px; vertical-align:middle;' src='"
							  +sdmtv.BASEPATH+"wapts/images/reviewsFormWright.png' />请输入您的评论内容</div>");
		
			$("#reviewsFormArea").append(textdivTwo);
	  	});
	
		// 提交
		button.bind("click", function() {
			if(chk_to_page()){
				var value = $.trim(textarea.val());
				//判断输入内容是否为空
				if (value == "" || value.length == 0) {
					alert("请输入内容");
					return;
				}
				
				//判断输入内容长度是否小于5
				//if (value.length < 5) {
		    		//alert("最少输入5个字符。");
		    		//return false;
		    	//}
				var params = {
					"cls" : "Commit_add",
					"programType" : programType, //liveVideo
					"programId" : programId,
					"content" : value
				};
				new $sdmtv_ajax(params, function(ajaxObj) {
					if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
						textarea.val("");
						rate.html(color(0) + "/100");
						alert(ajaxObj.message);
						
						//提交评论后要还原到出事状态
						window.setTimeout(function() {
				    		//去除已有的内容
							$("#reviewsFormArea").empty();
							//更换样式
							$("#reviewsFormArea").attr("class","reviewsFormBefore");
							//设置点击事件
							var textdivTwo = $("<div onclick='javascript:reviewsCreateFormBefore(\""+programId+"\", \""+programType+"\", "+callback+")'"
											  +" class='reviewsDiv_value'><img style='width:16px; margin-left:5px; margin-right:5px; margin-bottom:3px; vertical-align:middle;' src='"
											  +sdmtv.BASEPATH+"wapts/images/reviewsFormWright.png' />请输入您的评论内容</div>");
							$("#reviewsFormArea").append(textdivTwo);
							
							//重新生成评论列表
							if (typeof callback == "function") {
								callback.call();
							}
				    	}, 1500);
					} else {
						alert(ajaxObj.message);
					}
				});
			}
		});
		//填充新的内容
		$(".reviewsDiv_value").append(textarea).append(rate).append(buttonDiv);
		//获得焦点
		textarea.focus();
	}
}

/**
 * 替换字符串中的特殊字符：& > < 空格
 * @param s
 * @return
 */
function replaceSpecialCharacter(s) {
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/</g, "&lt;");
	return s;
}
/**
 * 切换tab页
 * @param index：0表示左侧标题；1表示右侧标题
 * @return
 */
function tag(index){
	var imgs = document.querySelectorAll(".tab_up,.tab_down");
	if(index < 0 || index >= imgs.length) return;
	for(var i=0;i<imgs.length;i++){
		imgs[i].className = (i%2)==index?'tab_down':'tab_up';
	}
}
/**
 * 切换tab页
 * @param index：0表示左侧标题；1表示右侧标题
 * @return
 */
function tagN(index){
	var imgs = document.querySelectorAll(".tabN_up,.tabN_down");
	if(index < 0 || index >= imgs.length) return;
	for(var i=0;i<imgs.length;i++){
		imgs[i].className = (i%2)==index?'tabN_down':'tabN_up';
	}
}

/**
 * 收藏
 * 
 * @param obj
 * @param programType
 * @param programId
 * @param customerCollectionId
 *            未收藏时，值为-1
 * @return
 */
// 页面创建时，初始化收藏
function collectionReset(obj, programType, programId, customerCollectionId,id) {
	if (customerCollectionId != "-1") {
		$(obj).addClass("common_collection_collected");
		obj.onclick = function() {
			collectionRemove(obj, programType, programId, customerCollectionId);// 取消收藏
		}
	} else {
		$(obj).removeClass("common_collection_collected");
		obj.onclick = function() {
			collectionAdd(obj, programType, programId);// 添加收藏
		}
	}
	$(obj).attr("collectId", customerCollectionId);
	// 供客户端播放器使用
	// window.localStorage.setItem("cusCollId", customerCollectionId);
}

// 添加收藏
function collectionAdd(obj, programType, programId) {
	if (chk_to_page()) {
		var params = {
			"cls" : "Collection_add",
			"programType" : programType, // "liveVideo"
			"programId" : programId
		};
		new $sdmtv_ajax(params, function(ajaxObj) {
					if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
						 alert("收藏成功");
						$(ajaxObj.objs).each(function() {
							collectionReset(obj, programType, programId, this
											.get("customerCollectionId"));
						});
					} else {
						alert(ajaxObj.message);
					}
				});
	}
}

// 取消收藏
function collectionRemove(obj, programType, programId, customerCollectionId) {
	var params = {
		"cls" : "Collection_delete",
		"customerCollectionIds" : customerCollectionId
	};
	new $sdmtv_ajax(params, function(ajaxObj) {
		if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
			alert("收藏已取消");
			collectionReset(obj, programType, programId, "-1");
		} else {
			alert(ajaxObj.message);
		}
	});
}

////====分享功能。包括个人管理模块的分享设置功能和详情页面的分享功能====艾建锋===

var SHARE_RENREN = "renren";
var SHARE_SINA = "sina";
var SHARE_TECENT = "tencent";
var SHARE_WEIBO_KEY = "dystsdmp";
// sessionStroage存的变量
var SHARE_PROGRAM_ID = "share_programId";
var SHARE_PROGRAM_NAME = "share_programName";
var SHARE_PROGRAM_TYPE = "share_programType";
// /////////====================个人设置，分享绑定
/**
 * 获取绑定信息。 weiboShareId -1 未绑定 >0 则绑定
 * 
 * @param {}
 *            action bind 绑定页面 shareContent分享内容
 */
function share_getWeiboShareBindInfo(action) {
	// 此处需要调用sessionStorage
	window.sessionStorage.setItem("share_action", action);
	var params = {
		"cls" : "Weibo_queryBindInfo",
		"weiboKey" : SHARE_WEIBO_KEY
	};
	new $sdmtv_ajax(params, function(ajaxObj) {
		if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
			var objs = ajaxObj.objs;
			$(objs).each(function() {
				var weiboType = this.get("weiboType");
				var isBind = this.get("isBind");
				var weiboShareId = this.get("weiboShareId");
				var buttonType;
				if ("bind" == action) {// 绑定
					if (isBind == "false") {// 未绑定，显示绑定按钮
						buttonType = 0;
					} else {
						buttonType = 1;
					}
				} else if ("shareContent" == action) {// 分享内容
					buttonType = 2;
				} else {// 分享内容
					alert("share_getWeiboShareBindInfo参数异常:" + action);
				}
				var buttonHtml = share_getHtmlButton(weiboType,weiboShareId, buttonType);
				if (buttonHtml != "") {
				    if(2==buttonType){
				    	$("#" + weiboType).attr("onclick",buttonHtml);
				    }else{
						$("#" + weiboType).html(buttonHtml);
				    }
				}
			})
		} else {
			alert(ajaxObj.message);
		}
	});
}

/**
 * 显示相应按钮
 * 
 * @param {}
 *            weiboType
 * @param {}
 * 
 * 
 *            weiboShareId
 * @param {}
 *            buttonType 0 绑定按钮 1 取消绑定 2 分享按钮
 * @return {}
 */
function share_getHtmlButton(weiboType, weiboShareId, buttonType) {
	switch (buttonType) {
		case 0 :
			return tempBind = "<div class='share_bind_div' onclick='share_getShareUrl(\""+ weiboType + "\")' >绑定</div>";// 绑定
		case 1 :
			return "<div class='share_unbind_div' onclick='share_unbindAccount(" + weiboShareId + ",\"" + weiboType + "\")' >解除绑定</div>"; // 取消绑定
		case 2 :
			return "share_toInputShareContent(" + weiboShareId + ",\"" + weiboType + "\")"; // 分享
		case 3 :
			return "<div class='share_bind_div' onclick='share_getShareUrl(" + weiboType + "\")'  >分享</div>";
		default :
			return "";
	}
}

/**
 * 绑定账号 考虑到安全因素，获取授权地址放到后台。
 * 
 * @param {}
 *            weiboType
 */
function share_getShareUrl(weiboType) {
	var params = {
		cls : "Weibo_getAuthorUrl",
		weiboType : weiboType
	};
	if (SHARE_TECENT == weiboType) {
		alert("加载腾讯微博页面");
	} else if (SHARE_SINA == weiboType) {
		alert("加载新浪微博页面");
	} else if (SHARE_RENREN == weiboType) {
		alert("加载人人网页面");
	}
	// 考虑到安全因素，获取授权地址放到后台。
	new $sdmtv_ajax(params, function(ajaxObj) {
		if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
			var objs = ajaxObj.objs;
			$(objs).each(function() {
				window.location.href = this.get("authorUrl");
			});
		} else {
			alert("获取授权地址错误。");
		}
	});
}

/**
 * 绑定账号
 * 
 * @param {}
 *            weiboType
 */
function share_bindAccount(weiboType) {
	if (authCode && authCode != "null") {
		var params = {
			"cls" : "Weibo_bindAccount",
			"weiboType" : weiboType,
			"weiboKey" : SHARE_WEIBO_KEY,
			"authCode" : authCode,
			"pageCode" : bindLogFlag
		};
		if (SHARE_RENREN == weiboType) {
			alert("正在绑定人人网账号，请稍后.....");
		} else if (SHARE_SINA == weiboType) {
			alert("正在绑定新浪微博账号，请稍后.....");
		} else if (SHARE_TECENT == weiboType) {
			alert("正在绑定腾讯微博账号，请稍后.....");
			params.openid = openid, params.openkey = openkey;
		}
		var goUrl = "";
		var tip = "";
		// bind 绑定页面 shareContent分享内容
		var share_action = window.sessionStorage.getItem("share_action");
		new $sdmtv_ajax(params, function(ajaxObj) {
			if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
				var objs = ajaxObj.objs;
				if ("bind" == share_action) {
					goUrl = "doHomPag.servlet?from=000908&type=18&value=";
					tip = "分享设置页";
				} else if ("shareContent" == share_action) {
					goUrl = "doHomPag.servlet?from=000908&type=20&value=";
					tip = "分享内容页";
				}else{
					setTimeout(function() {
						window.location.href = sdmtv.BASEPATH + goUrl;
					}, 1500)
					return;
				}
				$(objs).each(function() {
					var weiboShareId = this.get("weiboShareId");
					var baseParam = putBase64("weiboShareId=" + weiboShareId + "&weiboType=" + weiboType);
					goUrl = goUrl + baseParam;
				});
				alert(ajaxObj.message);
			} else {
				if ("bind" == share_action) {
					goUrl = "doHomPag.servlet?from=000908&type=18&value=";
					tip = "分享设置页";
					alert("绑定账号失败，即将跳转" + tip)
				} else if ("shareContent" == share_action) {
					tip = "";
					setTimeout(function() {
						history.go(-2);
					}, 1500)
					alert("绑定账号失败，即将跳转")
					return;
				}
			}
			setTimeout(function() {
				window.location.href = sdmtv.BASEPATH + goUrl;
			}, 1500)
		});
	} else {
		alert("绑定账号失败。");
		setTimeout(function() {
			history.go(-2)
		}, 1500);
	}
}

/**
 * 取消绑定账号
 * 
 * @param {}
 *            weiboShareId
 * @param {}
 *            weiboType
 */
function share_unbindAccount(weiboShareId, weiboType) {

	var loginFlag= window.localStorage.getItem("loginFlag");
	if(("renren"==loginFlag) || ("sina"==loginFlag)){
		if (confirm("解除绑定也会退出登录,确定解除绑定？")) {
			var renrenParams = {
				cls : "Weibo_unbindAccount",
				weiboShareId : weiboShareId
			};
			new $sdmtv_ajax(renrenParams, function(ajaxObj) {
				if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
					alert("解除绑定成功");
					var buttonHtml = share_getHtmlButton(weiboType, weiboShareId, 0);
					if (buttonHtml != "") {
						$("#" + weiboType).html(buttonHtml);
					}
					//退出登录
					window.sessionStorage.removeItem("customerId");// 从seesionLocal移除
					window.sessionStorage.removeItem("name");// 从seesionLocal移除
					window.sessionStorage.removeItem("qilu");// 从seesionLocal移除
					window.localStorage.removeItem("auto_login");// 移除自动登录
					window.localStorage.removeItem("loginFlag");// 移除登录标记
					window.localStorage.removeItem("customerId_qilu");// 移除齐鲁网id
					//返回首页
					setTimeout(function(){
						window.location.href = sdmtv.BASEPATH;
					},1000)
				} else {
					alert("解除绑定失败")
				}
			});
		}
	}else{
		if (confirm("确定解除绑定？")) {
			var renrenParams = {
				cls : "Weibo_unbindAccount",
				weiboShareId : weiboShareId
			};
			new $sdmtv_ajax(renrenParams, function(ajaxObj) {
				if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
					alert("解除绑定成功");
					var buttonHtml = share_getHtmlButton(weiboType, weiboShareId, 0);
					if (buttonHtml != "") {
						$("#" + weiboType).html(buttonHtml);
					}
				} else {
					alert("解除绑定失败")
				}
			});
		}
	}
}

function share_toInputShareContent(weiboShareId, weiboType) {
	if("microblog"==window.sessionStorage.getItem(SHARE_PROGRAM_TYPE)){
		if(!chk_to_page()){
			this;
		}else{
			if (weiboShareId > 0) {
				var baseParam = putBase64("weiboShareId=" + weiboShareId + "&weiboType=" + weiboType);
				window.location.href = sdmtv.BASEPATH + "doHomPag.servlet?from=000908&type=20&value="+baseParam;
			} else {// 无绑定信息，绑定账号
				share_getShareUrl(weiboType);
			}
		}
	}else{
		if (weiboShareId > 0) {
			var baseParam = putBase64("weiboShareId=" + weiboShareId + "&weiboType=" + weiboType);
			window.location.href = sdmtv.BASEPATH + "doHomPag.servlet?from=000908&type=20&value="+baseParam;
		} else {// 无绑定信息，绑定账号
			share_getShareUrl(weiboType);
		}
	}
}

/**
 * 分享内容
 */
function share_shareContent(weiboShareId, weiboType) {
	if (weiboShareId > 0) {
		var weibocontent = $("#weibocontent").val();
		weibocontent = weibocontent.replace(/[\r\n]+/g, " ");
		if (weibocontent == "") {
			alert("请输入分享内容");
			return false;
		}
		// 组装url
		var programId = window.sessionStorage.getItem(SHARE_PROGRAM_ID);
		var programType = window.sessionStorage.getItem(SHARE_PROGRAM_TYPE);
		var shareUrl = share_getSdmpShareUrl(programId, programType);
		var params = {
			cls : "Weibo_shareContent",
			weiboId : weiboShareId,
			programId : programId,
			programType : programType,
			shareUrl : shareUrl,
			comment : weibocontent + " " +shareUrl
		};
		alert("分享已发送，请等待");
		new $sdmtv_ajax(params, function(ajaxObj) {
			if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
				alert(ajaxObj.message);
				setTimeout(function() {
					window.location.href = shareUrl;
				}, 1500);
			} else {
				alert("分享失败")
			}
		});
	} else {// 无绑定信息，绑定账号
		alert("无法获取绑定信息，请重新绑定账号。");
		share_getShareUrl(weiboType);
	}
}

/**
 * 
 * @param {}
 *            programId
 * @param {}
 *            programType
 */
function share_getSdmpShareUrl(programId, programType) {
	var url = sdmtv.BASEPATH;
	// 走统一页面
	return url += ("wapts/su.jsp?pId=" + programId + "&pt=" + programType + "&" + new Date().getTime());
}

// /=============详情页面 分享功能==========
/**
 * 初始化微博绑定状态
 */
function share_getWeiboShare(action) {
	var params = {
		cls : "Weibo_queryBindInfo",
		weiboKey : SHARE_WEIBO_KEY
	};
	new $sdmtv_ajax(params, function(ajaxObj) {
		if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
			var objs = ajaxObj.objs;
			$(objs).each(function() {
						var weiboType = this.get("weiboType");
						var isBind = this.get("isBind");
						var weiboShareId = this.get("weiboShareId");
						if (isBind == "false") {// 未绑定，显示绑定按钮
							share_showBindByWeiboType(weiboType)
						} else {
							share_showUnBindByWeiboType(weiboType, weiboShareId);
						}
					})
		} else {
			alert(ajaxObj.message);
		}
	});
}

/**
 * 分享内容页面点击取消
 */
function share_cancel(){
	var beforeUrl = window.document.referrer;
	if(beforeUrl.indexOf("doHomPag.servlet?from=000908&type=19&value=") > 0){
		history.go(-2);
	}else if((beforeUrl.indexOf("doVidPar.servlet") > 0) || (beforeUrl.indexOf("doAudPar.servlet") > 0)){
		history.go(-1);
	}else{
		history.go(-4); // 用户以前未绑定账号。
	}
}

var share_shareContentOut = 0;
function share_checkNum(limit,obj) {
	setInterval(function(){
		share_limitNum(limit,obj)
	}, 700);
}
function share_limitNum(limit,obj) {
	var textareaNum = obj.value;
	if (textareaNum.length > limit) {
		
	} else {
		var newnum = textareaNum.length;
		if (newnum < 0) {
			share_shareContentOut = textareaNum.length - limit;
			document.getElementById("changewords").innerHTML = "超出<span id='works' class='charsLeft' style='color: red;'>" + share_shareContentOut + "</span>/100"
		} else {
			document.getElementById("changewords").innerHTML = "<span id='works' class='charsLeft' style='color: #cecece;'>" + newnum + "</span>/100";
		}
	}
}

/**
 * 详情页调用分享demo
 * function share_initToshare(){
	// 从详情页获得三个参数
	share_goToShare(57,"山东卫视","liveVideo");
}
 */

/**
 * 组装url 目前微博分享功能还未添加。
 * @param {} programId 节目id
 * @param {} programName 节目名称
 * @param {} programType 节目类型  电视直播liveVideo,电视点播video，广播直播LiveAudio,广播点播audio，图书book 微博microBlog
 */
function share_goToShare(programId,programName,programType) {
	var baseParam = putBase64("programId=" + programId + "&programName=" + encodeURI(programName) +"&programType=" + programType);
	window.location.href = sdmtv.BASEPATH + "doHomPag.servlet?from=000908&type=19&value="+baseParam;
}
/**
 * 图书跳转
 * @param bId
 * @param bName
 * @param bOrders
 * @param bIndex
 * @param bOffset
 * @return
 */
function jumpToBookReader(bId,bName,bOrders,bIndex,bOffset){
	var params = {
		"cls" : "CustomerVisit_add",
		"visitType" : "book",
		"visitValue" : bId,
		"tvColumnId" : window.sessionStorage.getItem("bookClassId")? window.sessionStorage.getItem("bookClassId"):0
	}
	var data={
			"bId":bId,
			"bName":bName,
			"bOrders":bOrders,
			"bIndex":bIndex,
			"bOffset":bOffset
	}
	new $sdmtv_ajax(params,book_insertVisit,data);
	
};
function book_insertVisit(ajaxObj,data) {
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		window.sessionStorage.setItem("curBookId",data.bId);
		window.sessionStorage.setItem("curBookName",data.bName);
		window.sessionStorage.setItem("curBookOrders",data.bOrders);
		window.sessionStorage.setItem("curBookIndex",data.bIndex);
		window.sessionStorage.setItem("curOffset", data.bOffset);
		location.href = sdmtv.BASEPATH + "wapts/jsp/book/bookReader.jsp";
	}else{
		
	}
}

//二维码统计接口
function twoDimension_satictis(twoDimensionType,twoDimensionId) {
	//二维码扫描处理
	if(("twoDimension"==twoDimensionType) && (undefined!=twoDimensionId)){
		if((""==twoDimensionId) || (null==twoDimensionId)){
		}else{
			//二维码统计接口参数
			var twoDimension_params = {
				"cls" : "IndexProgram_demiCodeRecord",
				"twoDimensionCode" : twoDimensionId
			};
			new $sdmtv_ajax(twoDimension_params, function(ajaxObj) {
		    	if (ajaxObj.code == ajaxObj.constants.SUCCESS) {
					//调用接口成功 返回信息
					var message = ajaxObj.message;
				}else{
					//调用接口失败
				}		
			});
		}
	}	
}

/**
 * 首页展示图片
 */
var ImgGradeTable = new Class();
ImgGradeTable.extend({
    tmpurl : sdmtv.BASEPATH + "wapts/images/imggrade.png",
    tmpurl_book :  sdmtv.BASEPATH + "wapts/images/imggrade_book.png",
    tmpcou : 0,
    table : $("<table></table>"),
    tr1 : $("<tr></tr>"),
    tr2 : $("<tr></tr>"),
    createGrade : function(tmpurl, imgurl, words, func) {
        var img = $("<img class='imgLazyLoad' src='" + tmpurl + "' data-original='" + sdmtv.IMG_BASEPATH + imgurl + "'></img>");
        var label = $("<label>" + words + "</label>");
        var link= $("<div></div>").append(img).append(label);
        if (typeof func == "function") {
            link.bind("click", function() {
                func.call(this);
            });
        }
        var td = $("<td></td>").append(link);
        if(this.tmpcou<3){
        	this.tr1.append(td);
        }else if((3<=this.tmpcou) && (this.tmpcou<6)){
        	this.tr2.append(td);
        }else{
        }
        //计数
        this.tmpcou = this.tmpcou + 1;
    },
    createStage : function(cls) {
        // 第二个div用来清除left样式
        return $("<div class='" + cls + "'></div><div style='clear:left;'></div>");
    },
    createGradeTable : function() {
    	//返回信息
    	var doTbale = this.table.append(this.tr1).append(this.tr2);
    	//清除本次生成的信息
    	this.tmpcou = 0;
	   	this.table = $("<table></table>");
	    this.tr1 = $("<tr></tr>");
	    this.tr2 = $("<tr></tr>");
	    //返回数据
        return doTbale;
    },
});
ImgGradeTable.include({
    init : function(id, type) {
        if (typeof type == "string" && type == "book") {
            this.tmpurl = ImgGradeTable.tmpurl_book;
            this.stage = ImgGradeTable.createStage("imggrade_book");
        }else {
            this.tmpurl = ImgGradeTable.tmpurl;
            this.stage = ImgGradeTable.createStage("imggrade");
        }
        this.id = id;
        this.isShow = false;
    },
    add : function(imgurl, words, func) {
    	ImgGradeTable.createGrade(this.tmpurl, imgurl, words, func);
    },
    show : function() {
    	this.stage.eq(0).append(ImgGradeTable.createGradeTable());
    	var self = this;
    	if (!this.isShow) {
    		$("#" + this.id).prepend(this.stage);
    		this.isShow = true;
    	}
    	// 图片懒加载
    	window.setTimeout(function() {
    		self.stage.find("img.imgLazyLoad").lazyload({
    			effect: "fadeIn",
    			load:function() {
    				$(this).removeClass("imgLazyLoad");
    			}
    		});
    	}, 300);
    },
    bottom : function(x) {
    	this.stage.eq(1).css("margin-bottom", x+"px");
    },
    addBorder : function() {
    	this.stage.addClass("List_Cont_recommend_div");
    }
});
/**
 * 首页展示图片
 */


/**
 * html模板生成
 */
var doTHelper = {};

//根据获取html模板
doTHelper.tmplPagefn = function(elem, tmplType, data, widthBai, lineNo, itemCount, def) {
	var self = this;
	var htmlTmp;
	
    var result = 
     "<div class='slide_menu'>"+
		"<div class='slide_menu_bottom'>"+
			"<div id='slide_menu_body_div' class='slide_menu_body {{=it.menuClass}}'>"+
				"<table class='slide_menu_table' style='width:100%; border-collapse:collapse;'>";
				var trContent = "";
				
				for(i=0; i<lineNo; i++){
					trContent = trContent + "<tr>";
					for(j=i*widthBai; j<(i+1)*widthBai; j++){
					    if(data.curItem==data.itemIndex[j]){
							trContent = trContent + "<td class='menu_table'>"+
							"<div data-clickParam='"+data.itemIndex[j]+"'"+
							     "class='slide_menu_item slide_menu_curItem'>"+data.itemName[j]+"</div>"+
							"</td>";
					    }else if(j<itemCount){
							trContent = trContent + "<td class='menu_table'>"+
							"<div data-clickParam='"+data.itemIndex[j]+"'"+
							     "class='slide_menu_item'>"+data.itemName[j]+"</div>"+
							"</td>";
					    }
					}
					trContent = trContent + "</tr>";
				}
				
				result = result + trContent;
				result = result + "</table>"+
			"</div>"+
		"</div>"+
	"</div>";
	self[tmplType] = doT.template(result, undefined, def);
	htmlTmp = $(self[tmplType](data||{}));
	
	$(elem).append(htmlTmp);
	return htmlTmp;
};

/**
 * 生成下拉弹出层
 */
var htmlHelper = {};
htmlHelper.createSlideMenu = function(elem, userData, callback, keepOld) {
	var $btn = $(elem);
	var $menu = $btn.find(".slide_menu_table");
	var bodyWidth = $(document.body).width()>720?720:$(document.body).width();
	var lineCou = parseInt(bodyWidth/80);  //一行显示几个
	var lineNo = 1;  //显示几行

	if ($menu.length == 0) {
		var data = {};
		data.itemName = userData.itemName||[];
		data.itemIndex = userData.itemIndex||[];
		data.curItem = userData.curItem;
		if (typeof data.curItem == "undefined") {
			data.curItem = userData.itemIndex[0]||0;
		}
		var itemCount = data.itemName.length;  //一共有多少个
		if(itemCount<lineCou){
			lineCou = itemCount;
			lineNo = 1;
		}else{
			var lineNoParm = itemCount/lineCou;
			var lineNoParmTwo = parseInt(itemCount/lineCou);
			if(lineNoParm>lineNoParmTwo){
				lineNo = lineNoParmTwo + 1;
			}else{
				lineNo = lineNoParmTwo;
			}
		}

        //var menuHeight = 0;
		var i = 0;
		
		//设置样式
		data.menuClass = "";
		for (i=itemCount-1; i>=0; i-=1) {

			//判断频道名称字节数
			if (data.itemName[i].replace(/[^\u0000-\u00ff]/g,"aa").length > 12) {
				data.menuClass = "slide_menu_wide";
                //menuHeight = 16+30*((itemCount-1>>1)+1);
				break;
			}
		}
        //menuHeight = menuHeight || 16+30*((itemCount-1>>2)+1);
		
		//生成菜单
		$menu = doTHelper.tmplPagefn(elem,"slide_menu",data,lineCou,lineNo,itemCount);
		//生成浮动层时空之页面不可滑动
		$("body").eq(0).attr("class", "slide_menu_bodyFixed");
		
		//绑定单击事件
		$menu.on("click", ".slide_menu_item[data-clickParam]", function() {
			//恢复页面可以滑动
			$("body").eq(0).attr("class", "");
		
			var clickedIndex = $(this).attr("data-clickParam");
			var $oldItem = $menu.find(".slide_menu_curItem");
			var oldIndex = $oldItem.attr("data-clickParam");
			//选择了不一样的菜单后，更新内容
			if (clickedIndex != oldIndex) {
				//改变高亮项
				if (!keepOld) {
					$oldItem.removeClass("slide_menu_curItem");
					$(this).addClass("slide_menu_curItem");
				}
				if (typeof callback == "function") {
					callback.call(this, clickedIndex);
				}
			}
			$btn.toggleClass("slide_menu_hide");
			return false;
		});
		//单击其他区域时，隐藏菜单
		$menu.bind("click", function() {
			//恢复页面可以滑动
			$("body").eq(0).attr("class", "");
			
			$btn.toggleClass("slide_menu_hide");
			return false;
		});
		//待dom加载完成后，将其显示
		window.setTimeout(function () {
			$btn.toggleClass("slide_menu_hide");
		}, 100);
	} else {
		//生成浮动层时空之页面不可滑动
		$("body").eq(0).toggleClass("slide_menu_bodyFixed");
		$btn.toggleClass("slide_menu_hide");
	}
};

//获取频道列表  通用方法
common_channelList = function(param, page, callback, cur, haveFlag, keepOld) {
	new $sdmtv_ajax(param, function(ajaxObj) {
		var userData = {itemName : ["全部"],
				itemIndex : [''],
				curItem : ''};
		if(ajaxObj.code == ajaxObj.constants.SUCCESS){
			var objs = ajaxObj.objs;
			if(objs.length == 0){
				
			} else {
				$(objs).each(function(){
					var programTypeId = this.get("programTypeId");
					var itemsName= this.get("itemsName");
					if(itemsName.length>4){
						itemsName = itemsName.substring(0,4);
					}
					if("全部"!=itemsName){
						userData.itemName.push(itemsName);
						userData.itemIndex.push(programTypeId);
					}
				});
			}
		}
		//设置默认选中项
		if (cur != undefined) {
			var i = userData.itemName.length-1;
			for (;i>0;i-=1) {
				if (cur == userData.itemIndex[i]) {
					userData.curItem = cur;
					break;
				}
			}
		}

		//判断是否是显示着筛选框进入的
		if("0"==haveFlag){
			var bodyWidth = $(document.body).width()>720?720:$(document.body).width();
			var lineCou = parseInt(bodyWidth/80);
			var lineNo = 1;
			var itemCount = userData.itemName.length;
			if(itemCount<lineCou){
				lineCou = itemCount;
				lineNo = 1;
			}else{
				var lineNoParm = itemCount/lineCou;
				var lineNoParmTwo = parseInt(itemCount/lineCou);
				if(lineNoParm>lineNoParmTwo){
					lineNo = lineNoParmTwo + 1;
				}else{
					lineNo = lineNoParmTwo;
				}
			}
			
			var getTable = createTabel(userData, lineCou, lineNo, itemCount);
			//填充所需的table信息
			document.getElementById("slide_menu_body_div").innerHTML = getTable;
			
		}else if("1"==haveFlag){
			//绑定事件
			var header = $(page).find(".slide_menu_hide");
			$(header).on("click", function() {//当点击分类图片时才去生成分类页面
				htmlHelper.createSlideMenu(header, userData, function(newItem) {
					var i = userData.itemName.length-1, name = "";
					for (;i>0;i-=1) {
						if (userData.itemIndex[i] == newItem) {
							name = userData.itemName[i];
						}
					}
					if (typeof callback == "function") {
						if (name == "") {
							callback.call(this, "", "");
						} else {
							callback.call(this, newItem, name);
						}
					}
				}, keepOld);
			});
		}
	});
};

//电视点播日期分类获取频道列表返回函数
tvDemTime_channelList = function(param, page, callback, cur, haveFlag, keepOld) {
	new $sdmtv_ajax(param, function(ajaxObj) {
		var userData = {itemName : ["全部"],
				itemIndex : [''],
				curItem : ''};
		if(ajaxObj.code == ajaxObj.constants.SUCCESS){
			var objs = ajaxObj.objs;
			if(objs.length == 0){
				
			} else {
				$(objs).each(function(){
					var tvDemandTime = this.get("playTime");
					tvDemandTime = tvDemandTime.substring(0, 4) + "年" + tvDemandTime.substring(5, 7) + "月";
					userData.itemName.push(tvDemandTime);
					userData.itemIndex.push(tvDemandTime);
				});
			}
		}
		//设置默认选中项
		if (cur != undefined) {
			var i = userData.itemName.length-1;
			for (;i>0;i-=1) {
				if (cur == userData.itemIndex[i]) {
					userData.curItem = cur;
					break;
				}
			}
		}
		
		//判断是否是显示着筛选框进入的
		if("0"==haveFlag){
			var bodyWidth = $(document.body).width()>720?720:$(document.body).width();
			var lineCou = parseInt(bodyWidth/80);
			var lineNo = 1;
			var itemCount = userData.itemName.length;
			if(itemCount<lineCou){
				lineCou = itemCount;
				lineNo = 1;
			}else{
				var lineNoParm = itemCount/lineCou;
				var lineNoParmTwo = parseInt(itemCount/lineCou);
				if(lineNoParm>lineNoParmTwo){
					lineNo = lineNoParmTwo + 1;
				}else{
					lineNo = lineNoParmTwo;
				}
			}
			
			var getTable = createTabel(userData, lineCou, lineNo, itemCount);
			//填充所需的table信息
			document.getElementById("slide_menu_body_div").innerHTML = getTable;
			
		}else if("1"==haveFlag){
			//绑定事件
			var header = $(page).find(".slide_menu_hide");
			$(header).on("click", function() {//当点击分类图片时才去生成分类页面
				htmlHelper.createSlideMenu(header, userData, function(newItem) {
					var i = userData.itemName.length-1, name = "";
					for (;i>0;i-=1) {
						if (userData.itemIndex[i] == newItem) {
							name = userData.itemName[i];
						}
					}
					if (typeof callback == "function") {
						if (name == "") {
							callback.call(this, "", "");
						} else {
							callback.call(this, newItem, name);
						}
					}
				}, keepOld);
			});
		}
	});
};

//根据已有信息生成频道列表
common_createChannelList = function(param, page, callback, cur, haveFlag, keepOld) {

	var arr=new Array(4);
	arr[0]="视频";
	arr[1]="音频";
	arr[2]="阅读";
	arr[3]="第一资讯";
	var str=new Array(4);
	str[0]="video";
	str[1]="audio";
	str[2]="book";
	str[3]="microblog";
	
	var userData = {itemName : ["全部"],
			itemIndex : [''],
			curItem : ''};
			
	for(i=0; i<arr.length; i++){
		userData.itemName.push(arr[i]);
		userData.itemIndex.push(str[i]);
	}		

	//设置默认选中项
	if (cur != undefined) {
		var i = userData.itemName.length-1;
		for (;i>0;i-=1) {
			if (cur == userData.itemIndex[i]) {
				userData.curItem = cur;
				break;
			}
		}
	}
	
	if("0"==haveFlag){
		var bodyWidth = $(document.body).width()>720?720:$(document.body).width();
		var lineCou = parseInt(bodyWidth/80);
		var lineNo = 1;
		var itemCount = userData.itemName.length;
		if(itemCount<lineCou){
			lineCou = itemCount;
			lineNo = 1;
		}else{
			var lineNoParm = itemCount/lineCou;
			var lineNoParmTwo = parseInt(itemCount/lineCou);
			if(lineNoParm>lineNoParmTwo){
				lineNo = lineNoParmTwo + 1;
			}else{
				lineNo = lineNoParmTwo;
			}
		}
		
		var getTable = createTabel(userData, lineCou, lineNo, itemCount);
		//填充所需的table信息
		document.getElementById("slide_menu_body_div").innerHTML = getTable;
			
	}else if("1"==haveFlag){
		//绑定事件
		var header = $(page).find(".slide_menu_hide");
		$(header).on("click", function() {//当点击分类图片时才去生成分类页面
			htmlHelper.createSlideMenu(header, userData, function(newItem) {
				var i = userData.itemName.length-1, name = "";
				for (;i>0;i-=1) {
					if (userData.itemIndex[i] == newItem) {
						name = userData.itemName[i];
					}
				}
				if (typeof callback == "function") {
					if (name == "") {
						callback.call(this, "", "");
					} else {
						callback.call(this, newItem, name);
					}
				}
			}, keepOld);
		});
	}
};

//游戏、应用获取频道列表返回函数
gameAndApp_channelList = function(param, page, callback, cur, haveFlag, keepOld) {
	new $sdmtv_ajax(param, function(ajaxObj) {
		var userData = {itemName : ["全部"],
				itemIndex : [''],
				curItem : ''};
		if(ajaxObj.code == ajaxObj.constants.SUCCESS){
			var objs = ajaxObj.objs;
			if(objs.length == 0){
				
			} else {
				$(objs).each(function(){
					var programTypeId = this.get("dataItemsId");
					var itemsName= this.get("itemsName");
					if(itemsName.length>4){
						itemsName = itemsName.substring(0,4);
					}
					if("全部"!=itemsName){
						userData.itemName.push(itemsName);
						userData.itemIndex.push(programTypeId);
					}
				});
			}
		}
		//设置默认选中项
		if (cur != undefined) {
			var i = userData.itemName.length-1;
			for (;i>0;i-=1) {
				if (cur == userData.itemIndex[i]) {
					userData.curItem = cur;
					break;
				}
			}
		}
		
		//判断是否是显示着筛选框进入的
		if("0"==haveFlag){
			var bodyWidth = $(document.body).width()>720?720:$(document.body).width();
			var lineCou = parseInt(bodyWidth/80);
			var lineNo = 1;
			var itemCount = userData.itemName.length;
			if(itemCount<lineCou){
				lineCou = itemCount;
				lineNo = 1;
			}else{
				var lineNoParm = itemCount/lineCou;
				var lineNoParmTwo = parseInt(itemCount/lineCou);
				if(lineNoParm>lineNoParmTwo){
					lineNo = lineNoParmTwo + 1;
				}else{
					lineNo = lineNoParmTwo;
				}
			}
			
			var getTable = createTabel(userData, lineCou, lineNo, itemCount);
			//填充所需的table信息
			document.getElementById("slide_menu_body_div").innerHTML = getTable;
			
		}else if("1"==haveFlag){
			//绑定事件
			var header = $(page).find(".slide_menu_hide");
			$(header).on("click", function() {//当点击分类图片时才去生成分类页面
				htmlHelper.createSlideMenu(header, userData, function(newItem) {
					var i = userData.itemName.length-1, name = "";
					for (;i>0;i-=1) {
						if (userData.itemIndex[i] == newItem) {
							name = userData.itemName[i];
						}
					}
					if (typeof callback == "function") {
						if (name == "") {
							callback.call(this, "", "");
						} else {
							callback.call(this, newItem, name);
						}
					}
				}, keepOld);
			});
		}
	});
};

//根据数据生成table模板
function createTabel(data, lineCou, lineNo, itemCount) {
    var result = 
		"<table class='slide_menu_table' style='width:100%'>";
		var trContent = "";
		
		for(i=0; i<lineNo; i++){
			trContent = trContent + "<tr>";
			for(j=i*lineCou; j<(i+1)*lineCou; j++){
			    if(data.curItem==data.itemIndex[j]){
					trContent = trContent + "<td class='menu_table'>"+
					"<div data-clickParam='"+data.itemIndex[j]+"'"+
					     "class='slide_menu_item slide_menu_curItem'>"+data.itemName[j]+"</div>"+
					"</td>";
			    }else if(j<itemCount){
					trContent = trContent + "<td class='menu_table'>"+
					"<div data-clickParam='"+data.itemIndex[j]+"'"+
					     "class='slide_menu_item'>"+data.itemName[j]+"</div>"+
					"</td>";
			    }
			}
			trContent = trContent + "</tr>";
		}
		
		result = result + trContent;
		result = result + "</table>";
	
	return result;
};