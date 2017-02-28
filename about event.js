
////////////跨浏览器的事件处理程序与事件对象//////////////////////////////////////////////////

	var EventUtil = {
		addHandler : function(element,type,handler){
			if (element.addEventListener) {
				element.addEventListener(type,handler,false);            //DOM2级事件处理程序
			}
			else if (element.attachEvent) {
				element.attachEvent("on"+type,handler);                 //IE中的事件处理程序
			}
			else {
				element["on"+type] = handler;                            //DOM 0级事件处理程序
			}
		},

		removeHandler : function(element,type,handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type,handler,false);
			}
			else if (element.detachEvent) {
				element.detachEvent("on"+type,handler);
			}
			else {
				element["on"+type] = null;
			}
		},

		getEvent : function(event) {
			return event ? event : window.event;      //DOM中的事件对象，与IE中的事件对象
		},

		getTarget : function(event) {
			return event.target || event.srcElement;
		},

		preventDefault : function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			}
			else {
				event.returnValue = false;
			}
		},

		stopPropagation: function(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			}
			else {
				event.cancelBubble = ture;
			}
		}
	};

