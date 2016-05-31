var $=function(word){
	var results=[];
	if(typeof(word)=="object"||word==null){
		results[0]=word;
	}else if(word[0]=="."){
		var className=word.substring(1,word.length);	
	    var elems = document.getElementsByTagName("*");
	    var reg = new RegExp("(^| )" + className + "( |$)"); 
	    for (var i=0,len=elems.length; i<len; i++){ 
	        if(reg.test(elems[i].className)){
	        	
	        	results[results.length] = elems[i];
	        }
	       }
	}else if(word[0]=="#"){
		var idName=word.substring(1,word.length);
		results[0]=document.getElementById(idName);	
	}
	
	$.css=function(key,value){
		
		for(var i=0;i<results.length;i++){
		var word="";
		if(key.split("-").length>1){
		
				var lastword=key.split("-")[1];
				var firstword=lastword[0].toUpperCase();
				
				for(var a=1;a<lastword.length;a++){
					word+=lastword[a];
				}
				word=firstword+word;
				word=key.split("-")[0]+word
			}
		else word=key;
		if(value){
			results[i].style[word]=value;
		}else{
			return results[results.length-1].style[word];
			break;
		}
		
		}
	}
	$.attr=function(key,value){
		for(var i=0;i<results.length;i++){
			if(value){
				
				results[i][key]=value;
				//results[i].setAttribute(key,value);
			}else{
				//return results[results.length-1].getAttribute(key);
				return results[results.length-1][key];
				break;
			}
			
		}
		
	}
	
	$.show=function(status){
		for(var i=0;i<results.length;i++){
			if(results[i]!=null){
			if(status){
				
				results[i].style.display=status;
			}else{
				results[i].style.display="";
			}
			}
		}
	}
	$.hide=function(){
		for(var i=0;i<results.length;i++){
			if(results[i]!=null){
			results[i].style.display="none";
			}
		}
	}
	$.html=function(htm){
		if(htm){
		results[results.length-1].innerHTML=htm;
		}else{
			return results[results.length-1].innerHTML;
		}
		}
	$.objs=function(){
		return results;
	}
	$.obj=function(){
		return results[results.length-1];
	}
	$.each=function(callBack){
		for(var i=0;i<results.length;i++){
			callBack(results[i]);
		}
		
	}
	return $;
	
}
