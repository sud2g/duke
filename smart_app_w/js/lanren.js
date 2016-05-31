
window.onload=function  () {
	var linksone=getClass("titleone")[0].getElementsByTagName("a");
	var listsone=getClass("listone");
	tab(linksone,listsone);
}
function tab (links,lists) {
for (var i=0; i<links.length; i++) {
    links[i].index=i;
    links[i].onclick=function  () {
	  for (var j=0; j<lists.length; j++) {	  
	    lists[j].style.display="none";
		links[j].style.background="";
		links[j].style.color="#000";
		
	  }
      lists[this.index].style.display="block";
	  this.style.background="#FF9500";
	  this.style.color="#000";
    }
  }
}