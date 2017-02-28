//myQuery可能存在的性能问题。
//每个通过$("xxx")产生的myQuery对象，都需要通过一个for循环来导入所有的公用方法，假如公用方法比较多，那么就可能会影响了生成对象的速度。 
//既然每一个myQuery对象所使用的方法都是一样，那么从直觉上，所有的myQuery对象都应该共用一个公用方法对象才合理，
//而不应该在每个myQuery对象生成的时候导入一次公用方法。
//能够让所有的myQuery对象应该共用一个公用方法对象,
//最好的方案是原型链，
//只要每个myQuery对象把共用方法作为自己的原型对象，就肯定能解决myQuery的性能问题。
//但是使用原型链就必须放弃私有性，因为原型对象上的方法，只能通过this访问数据。


///////////////////

if (!Function.prototype.bind) {
	Function.prototype.bind = function (context) {
		
		var args = Array.prototype.slice.call(arguments, 1);
		var that = this;
		
		return function() {
			return that.apply(context, args.concat(Array.prototype.slice.call(arguments)));
		}
	}
}


(function(win) {  
        var slice = Array.prototype.slice;

        //myQuery导出到window全局作用域  
        win.$ = win.myQuery = myQuery;  

  
        //使用闭包实现的类似jQuery的封装  
        //selector只支持#id和tagName两种选择器，例如$("#id")，$("div")  
        var myQuery = function(selector) {  
            //私有成员，不让外界直接修改  
            var arrDom = [];  
            
            // //调用document.getElementById或者document.getElementsByTagName获取元素集合  
            // if (selector.charAt(0) === '#') {  
            //     arrDom[0] = document.getElementById(selector.substring(1));  
            // } else {  
            //     var elements = document.getElementsByTagName(selector);  
            //     for ( var i = 0; i < elements.length; i++) {  
            //         arrDom[i] = elements[i];  
            //     }  
            // }  

            //调用document.getElementById或者document.getElementsByTagName获取元素集合
            (function (sele) {

			    if (!sele) {
			        console.log("selector 不存在！");
			        return null;
			    }

			    if (sele == document) {
			        //arrDom[0] = document;
			        return null;
			    }

			    sele = sele.trim();

			    if (sele.indexOf(" ") !== -1) { //若存在空格
			        var selectorArr = sele.split(/\s+/); //拆成数组

			        var rootScope = getDOM(selectorArr[0]); //第一次的查找范围
			        var result = [];
			        //循环选择器中的每一个元素
			        for (var i = 1; i < selectorArr.length; i++) {
			            for (var j = 0; j < rootScope.length; j++) {
			                result = result.concat(getDOM(selectorArr[i], rootScope[j]));
			            }
			            if (i != selectorArr.length-1) {
			            	rootScope = result;
			            	result = [];
			            }
			        }
			        arrDom = result;
			    } else { //只有一个，直接查询
			        arrDom = getDOM(sele, document);
			    }

			    function getDOM(selector, root) {
				    var signal = selector[0]; //
				    var allChildren = null;
				    var content = selector.substr(1);
				    var currAttr = null;
				    var result = [];
				    root = root || document; //若没有给root，赋值document
				    switch (signal) {
				        case "#":
				            result.push(document.getElementById(content));
				            break;
				        case ".":
				            allChildren = root.getElementsByTagName("*");
				            // var pattern0 = new RegExp("\\b" + content + "\\b");
				            for (i = 0; i < allChildren.length; i++) {
				                currAttr = allChildren[i].getAttribute("class");
				                if (currAttr !== null) {
				                    var currAttrsArr = currAttr.split(/\s+/);
				                    // console.log(currAttr);
				                    for (j = 0; j < currAttrsArr.length; j++) {
				                        if (content === currAttrsArr[j]) {
				                            result.push(allChildren[i]);
				                            // console.log(result);
				                        }
				                    }
				                }
				            }
				            break;
				        case "[": //属性选择
				            if (content.search("=") == -1) { //只有属性，没有值
				                allChildren = root.getElementsByTagName("*");
				                for (i = 0; i < allChildren.length; i++) {
				                    if (allChildren[i].getAttribute(selector.slice(1, -1)) !== null) {
				                        result.push(allChildren[i]);
				                    }
				                }
				            } else { //既有属性，又有值
				                allChildren = root.getElementsByTagName("*");
				                var pattern = /\[(\w+)\s*\=\s*(\w+)\]/; //为了分离等号前后的内容
				                var cut = selector.match(pattern); //分离后的结果，为数组
				                var key = cut[1]; //键
				                var value = cut[2]; //值
				                for (i = 0; i < allChildren.length; i++) {
				                    if (allChildren[i].getAttribute(key) == value) {
				                        result.push(allChildren[i]);
				                    }
				                }
				            }
				            break;
				        default: //tag
				            var collectDom = root.getElementsByTagName(selector);
							for (var i = 0; i < collectDom.length; i++) {
								result.push(collectDom[i]);
							}
							break;
				    }
				    return result;
				}

			}) (selector);

    
            var myQueryObj = {};     //声明一个变量存储将要作为返回的query对象；
           
            //采用  .bind  导入myQuery对象公用方法  
            var methods = myQuery.methods;  
            for ( var methodName in methods) {  
                myQueryObj[methodName] = methods[methodName].bind(myQueryObj,  
                        arrDom);  
            }  

            //采用  .apply   导入myQuery对象公用方法  
			// var methods = myQuery.methods;  
			// for ( var methodName in methods) {  
			//     myQueryObj[methodName] = (function() {  
			//         var _methodName = methodName;//这一步的意义是什么？为每个返回的function暂存一个私有的methodName副本。循环中访问闭包的变量要注意;如果不加这句，那么myQueryObj添加的所有方法都将关联到循环的最后一个methodName对应的function  
			//         return function() {  
			//             return methods[_methodName].apply(myQueryObj,  
			//                     [ arrDom ].concat(slice.call(arguments)));//闭包访问arrDom  
			//         }  
			//     })();  
			// }


            return myQueryObj;  
        }; 


        //myQuery对象公用方法  
        myQuery.methods = {
            version : function() {  
                return "1.0";  
            },  
            text : function(arrDom, s) {  
                if (!s) {  
                    return arrDom[0].innerText;  
                } else {  
                    for ( var i = 0; i < arrDom.length; i++) {  
                        arrDom[i].innerText = s;  
                    }  
                }  
                return this;                    //实现方法的链式调用。eg：$("div").text().text().each()
            },  
            each : function(arrDom, fn) {  
                for ( var i = 0; i < arrDom.length; i++) {  
                    if (false === fn.call(arrDom[i], i, arrDom[i])) {  
                        break;  
                    }  
                }  
                return this;  
            },  
            get : function(arrDom, index) {  
                if (!index) {  
                    return slice.call(arrDom);  
                } else {  
                    return arrDom[i];  
                }  
            },  
            size : function(arrDom) {  
                return arrDom.length;  
            }  
        };  
    })(window); 