var temp = "";
function tvDemand_Review_Complete(typeName){
	temp = typeName;
	var cont = document.getElementById(temp);
	cont.value = cont.value.replace(/</g, ""); //屏蔽HTML标签
	cont.value = cont.value.replace(/>/g, "");
	if(cont.value==""||cont.value.length==0){
		alert("请输入内容");
		return;
	}
	var customerId_tvDemand_Details_Release = window.sessionStorage.getItem("customerId");
	if(customerId_tvDemand_Details_Release!=null){
		var params = {
				"cls" : "Commit_add",
				"programType" : "video",
				"programId" : tvDemand_videoId,
				"content" : cont.value,
				"customerId" : customerId_tvDemand_Details_Release
			};
		new $sdmtv_ajax(params, tvDemand_Review_Back);
	}
}

function tvDemand_Review_Back(ajaxObj) {
	if(ajaxObj.code == ajaxObj.constants.SUCCESS){
		var objs = ajaxObj.objs;
		var code = ajaxObj.code;
		var cont = document.getElementById(temp);
		cont.value=null;
		alert("点评成功，请等待审核");
	}else{
		alert(ajaxObj.message);
	}
}