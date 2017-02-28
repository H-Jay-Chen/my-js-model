///////////创建XHR对象/////////////////////////	
	function createXHR() {
		//如果XMLHttpRequest存在，就用new XMLHttpRequest()；针对IE7+、Firefox、Opera、Chrome和Safari。
		if (typeof XMLHttpRequest != "undefined") {
			return new XMLHttpRequest();
		}
		//如果ActiveXObject存在，就用new ActiveXObject(versions[i]); 针对IE7之前的版本。
		else if (typeof ActiveXObject != "undefined") {
			if (typeof arguments.callee.activeXString != "string") {
				var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
					i,
					len;
				for (i=0, len=versions.length; i<len; i++) {
					try {
						new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						break;
					}
					catch (ex) {
						//跳过；
					}
				}
			}
			return new ActiveXObject(arguments.callee.activeXString);
		}
		
		else {
			throw new Error("No XHR object avaliable.");
		}
	}



///////////////XHR的使用示例/////////////////////////////
	
	var xhr = createXHR();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
				console.log(xhr.responseText);
			}
			else {
				console.log("Request was unsuccessful:" + xhr.status);
			}
		}
	};
	
	
	
	//xhr.open("post","###",true);
	//xhr.setRequestHeader("MyHeader","MyValue");
	//xhr.send(null);

	xhr.open("get","###",true);
	xhr.setRequestHeader("MyHeader","MyValue");
	xhr.send(null);



//////////////辅助向现有的URL末尾添加查询的“名值对”参数//////////////////////
	function addURLParam(url,name,value) {
		url += (url.indexOf("?") == -1 ? "?" : "&");
		url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
		return url;
	}


