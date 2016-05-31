// 加载更多
var callback = null;
var pp = null;
function additional(params, callBackf) {
	pp = params;
	pp.beginNum = pp.beginNum + pp.step;
	new $sdmtv_ajax(pp, callBackf);
	return pp;
}
// 检查是否显示更多按钮，参数：开始NUM，步长num,总数量，对象名称（string）,回调函数，页面上标签ID
function checkLoadMore(begin, end, totalCount, params, callBackFunction,
		typeName) {
	var par = null;
	pp = params;
	callback = callBackFunction;
	if (begin + end >= totalCount) {
		document.getElementById(typeName).style.display = "none";
	} else {
		document.getElementById(typeName).style.display = "block";
		var loadmore = document.getElementById(typeName);
		loadmore.innerHTML = "<center style='margin-top: 6px;'><a href='javascript:void(0)' id='aloadmore'"
				+ "onclick='javascript:additional("
				+ params
				+ ","
				+ callBackFunction
				+ ");'>"
				+ "<div class='common_loadMore'>加载更多</div></a></center>";
	}
	return par;
}
// 隐藏加载更多按钮
function hideLoadMore(typeName) {
	document.getElementById(typeName).style.display = "none";
}