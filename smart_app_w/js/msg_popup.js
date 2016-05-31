
/**
 * 类
 * @return
 */
var Class = function() {
    var klass = function() {
        this.init.apply(this, arguments);
    };
    
    klass.prototype.init = function() {};
    
    klass.fn = klass.prototype;
    klass.fn.parent = klass;
    
    klass.extend = function(obj) {
        var extended = obj.extended;
        for (var i in obj) {
            klass[i] = obj[i];
        }
        if (extended) extended(klass);
    };
    
    klass.include = function(obj) {
        var included = obj.included;
        for (var i in obj) {
            klass.fn[i] = obj[i];
        }
        if (included) included(klass);
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
MsgPopup.include({
	timetask: null,
	windowId: "msg_popup_window",
	init: function(id) {
		this.windowId = id;
	},
	createWin: function(msg) {
		return "<div id='" + this.windowId + "' class='msg_popup_mask'><div><div>" + msg + "</div></div></div>";
	},
	popupShow: function() {
		$('#' + this.windowId).fadeIn(300);
	},
	popupHide: function() {
		$('#' + this.windowId).fadeOut(300);
	},
	alert: function(msg) {
		this.win = this.createWin(msg);
		$('#' + this.windowId).remove();
		if (this.timetask != null) {
			window.clearTimeout(this.timetask);
		}
		$('body').append(this.win);
		this.popupShow();
		var that = this;
		this.timetask = window.setTimeout(function(){that.popupHide();}, 2400);
	}
});
var msgPopup = new MsgPopup('msg_window_mask');
var alert = function(msg) {
	msgPopup.alert(msg);
}

var MsgPopupBot = new Class();
MsgPopupBot.include({
	timetask: null,
	windowId: "msg_popup_window",
	init: function(id) {
		this.windowId = id;
	},
	createWin: function(msg) {
		return "<div id='" + this.windowId + "' class='msg_popup_mask_bottom'><div><div>" + msg + "</div></div></div>";
	},
	popupShow: function() {
		$('#' + this.windowId).fadeIn(300);
	},
	popupHide: function() {
		$('#' + this.windowId).fadeOut(300);
	},
	alert: function(msg) {
		this.win = this.createWin(msg);
		$('#' + this.windowId).remove();
		if (this.timetask != null) {
			window.clearTimeout(this.timetask);
		}
		$('body').append(this.win);
		this.popupShow();
		var that = this;
		this.timetask = window.setTimeout(function(){that.popupHide();}, 2400);
	}
});

var msgPopupBot = new MsgPopupBot('msg_window_mask');
var alertBot = function(msg) {
	msgPopupBot.alert(msg);
}


/**
 * 单选框类
 * 
 * 使用方法
 * var radioModule = [
 * 	{
 * 	    id: 'info41',
 * 	    name: 'info4',
 * 	    value: '1',
 * 	    label: '男'
 * 	}, {
 * 	    id: 'info42',
 * 	    name: 'info4',
 * 	    value: '2',
 * 	    label: '女'
 * 	}
 * ];
 * var radio = new Radio();
 * radio.createRadios(radioModule);
 * $('#sex').html(radio.html);
 * 
 */
var Radio = new Class();


Radio.extend({
	getRadio: function(obj, i) {
		var id = obj['id'],
			value = obj['value'],
			name = obj['name'],
			label = obj['label'],
			style = obj['style'] || '';
		return '<label for="' + id + '"​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​ class="label_radio" style="' + style + '" >' +
			'<input type="radio" value="' + value + '" id="' + id + '" name="' + name + '" />' + label +
			'</label>';
	}
});
Radio.include({
	html: "",
    createRadios: function(objs, parent) {
        for (var i in objs) {
            this.html += Radio.getRadio(objs[i], i);                      
        } 
        parent.html(this.html);
        this.bindEvent();
    },
    setupLabel: function (){
        if($('.label_radio input').length) {
            $('.label_radio').each(function(){
                $(this).removeClass('label_radio_on');
            });
            $('.label_radio input:checked').each(function(){
                $(this).parent('label').addClass('label_radio_on');
            });
        };
    },
    bindEvent: function() {
    	// 设置事件
    	var that = this;
        $('.label_radio').click(function(){
            that.setupLabel();
        });
    },
    value: function(name) {
    	return $(".label_radio [name='" + name + "']:checked").val()
    },
    select: function(id) {
    	$('#' + id).trigger('click');
    	this.setupLabel();
    }
});

/**
 * 等待一段时间
 * Waiting.start("abc");
 * Waiting.waited("abc");//返回“abc”等待的时间
 * */
var Waiting = new Class();
Waiting.extend({
	start: function(id) {
		window.localStorage.setItem("waiting__" + id, new Date().getTime());
	},
	waited: function(id) {
		var start = window.localStorage.getItem("waiting__" + id);
		if (start && (typeof start == "string")) {
			return parseInt((new Date().getTime() - parseInt(start)) / 1000);
		} else {
			return -1;
		}
	},
	check: function(id, seconds) {
		var t = Waiting.waited(id);
		if (t>=0 && t< seconds) {
			alert('操作过于频繁，请' + (seconds-t) + '秒后再试');
			return false;
		}
		return true;
	}
});


// jquery扩展
(function($){
	// 生成随机验证码
	$.fn.setRandomCode = function() {
		var code=""+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9);
		this.data("randomCode", code);
		this.each(function() {
			$(this).css("background","url("+sdmtv.BASEPATH+"wapts/jsp/login/image.jsp?code="+code+") no-repeat");
			//$(this).css("background","url("+sdmtv.BASEPATH+"wapts/jsp/login/image.jsp?"+Math.random()+") no-repeat");
		});
		return this;
	};
	// 倒计时
	// finished字段表示计时结束
	$.fn.countDown = function(minites, func) {
		if (minites > 0) {
			var m = minites;
			var self = this;
			// 清除已有interval
			if (!self.countDownFinished()) {
				window.clearInterval(self.data("interval"));
			}
			var interval = window.setInterval(function() {
				m-=1;
				self.each(function() {
					$(this).html(m+"s");
				});
				if (m<=0) {
					// 结束倒计时，设置标识
					window.setTimeout(function(){
						window.clearInterval(interval);
						self.removeData("interval");
						if (typeof func == "function") {
							func.call(self);
						}
					},0);
				}
			}, 1000);
			self.data("interval", interval);
		}
		return this;
	};
	// 返回倒计时是否结束
	$.fn.countDownFinished = function() {
		return this.data("interval") === undefined;
	}
	
	// 方法扩展
	var fltr_mobi = /^(1[3-8])[0-9]{9}$/;
	var fltr_mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	$.isMailAddress = function(s) {
		return fltr_mail.test(s);
	};
	$.isPhoneNumber = function(s) {
		return fltr_mobi.test(s);
	};
	// 获取邮箱网址
	$.getMailURL = function(mail) {
		var url = "";
		if ($.isMailAddress(mail))
		{
			var m = mail.substring(mail.indexOf("@")+1);
			//if (m == "qq.com" || m == "vip.qq.com") {
				//url = "mail.qq.com";
			//} else if (m == "foxmail.com") {
				//url = "mail.foxmail.com";
			//} else if (m == "sina.com" || m == "sina.cn" || m == "vip.sina.com") {
				//url = "mail.sina.com";
			//} else if (m == "sohu.com") {
				//url = "mail.sohu.com";
			//} else if (m == "gmail.com") {
				//url = "mail.google.com";
			//} else if (m == "hotmail.com" || m == "live.cn") {
				//url = "mail.live.cn";
			//} else if (m == "yahoo.cn" || m == "yahoo.com.cn" || m == "yahoo.com") {
				//url = "mail.yahoo.com";
			//} else if (m == "189.cn") {
				//url = "mail.189.cn";
			//} else if (m == "139.com") {
				//url = "mail.139.com";
			//} else if (m == "21cn.com") {
				//url = "mail.21cn.com";
			//} else {
				//url = "mail." + m;
			//}
			if (m.indexOf("vip.") == 0) {
				url = "http://mail." + m.substring(4);
			} else if (m == "gmail.com") {
				url = "http://" + m;
			} else {
				url = "http://mail." + m;
			}
		}
		return url;
	};
})(jQuery);


jQuery.fn.extend({
	// 检查用户名,非空
    checkUsername: function() {
		if ($.trim($(this).val()) == "") {
			alert("请输入帐号");
			return false;
		}
		return true;
	},
    // 检查用户名，手机号或邮箱
    checkAccount: function() {
		if ($.trim($(this).val()) == "") {
			alert("请输入帐号");
			return false;
		} else if (!$.isMailAddress($(this).val()) && !$.isPhoneNumber($(this).val())) {
			alert("帐号格式不匹配");
			return false;
		}
		return true;
	},
	// 检查手机号
    checkPhoneNumber: function() {
		if ($.trim($(this).val()) == "") {
			alert("请输入手机号");
			return false;
		} else if ($(this).val().length != 11) {
			alert("手机号长度不匹配");
			return false;
		} else if (!$.isPhoneNumber($(this).val())) {
			alert("手机号格式不匹配");
			return false;
		}
		return true;
	},
	// 检查邮箱
	checkEmail: function() {
		if ($.trim($(this).val()) == "") {
			alert("请输入注册邮箱");
			return false;
		} else if (!$.isMailAddress($(this).val())) {
			alert("输入邮箱格式错误");
			return false;
		} else if ($(this).val().length > 60) {
			alert("邮箱地址过长，总长度不能超过60个字符");
			return false;
		}
		return true;
	},
    // 检查验证码
    checkRandomCode : function($obj) {
    	if ($.trim($(this).val()) == "") {
    		alert("请输入验证码");
    		return false;
    	} else if ($(this).val().length != 4) {
    		alert("验证码长度不匹配");
    		return false;
    	} else if ($obj.data("randomCode") != $(this).val()) {
    		alert("验证码输入错误");
    		return false;
    	}
    	return true;
    },
    // 检查验证码
    checkRandomRegiCode : function($obj) {
    	if ($.trim($(this).val()) == "") {
    		alert("请输入随机码");
    		return false;
    	} else if ($(this).val().length != 4) {
    		alert("随机码长度不匹配");
    		return false;
    	} else if ($obj.data("randomCode") != $(this).val()) {
    		alert("随机码输入错误");
    		return false;
    	}
    	return true;
    },
    // 检查短信码
    checkSmsCode : function() {
    	if ($.trim($(this).val()) == "") {
    		alert("请输入验证码");
    		return false;
    	} else if ($(this).val().length != 6) {
    		alert("验证码长度不匹配");
    		return false;
    	}
    	return true;
    },
    // 检查密码
    checkPassword: function() {
    	if ($(this).val() == "") {
    		alert("请输入密码");
    		return false;
    	} else if ($(this).val().length < 6 || $(this).val().length > 16) {
    		alert("密码为6-16个数字、字母或符号");
    		return false;
    	} else if (!/(^[\x20-\x7e]{6,16}$)/.test($(this).val())) {
    		alert("密码仅支持6-16个数字、字母或符号");
    		return false;
    	}
    	return true;
    },
    // 检查确认密码
    checkRePassword: function(pass) {
    	if ($(this).val() == "") {
    		alert("请输入确认密码");
    		return false;
    	} else if ($(this).val()!=pass.val()) {
    		alert("密码输入不一致");
    		return false;
    	}
    	return true;
    },
    // 检查昵称
    checkCustomerName : function() {
    	if ($.trim($(this).val()) == "") {
    		alert("请输入昵称");
    		return false;
    	} else if ($(this).val().length < 2 || $(this).val().length > 10) {
    		alert("昵称为2-10个字母、数字或汉字");
    		return false;
    	}
    	return true;
    },
    // 检查当前密码
    checkOldPassword: function() {
    	if ($(this).val() == "") {
    		alert("请输入当前密码");
    		return false;
    	} else if (!/(^[\x20-\x7e]{6,16}$)/.test($(this).val())) {
    		alert("当前密码格式错误");
    		return false;
    	}
    	return true;
    },
    // 判断用户是否勾选了同意
    checkFuwu : function() {
    	if(!$(this).is(":checked")){
    		alert("请同意用户注册协议。");
    		return false;
    	}
    	return true;
    },
    // 获取光标在输入框中位置
    getCursorPosition: function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    },
    // 设置光标在输入框中位置
    setCursorPosition: function(pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
});
