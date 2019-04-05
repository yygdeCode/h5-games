// 圣杯模式(继承)
	function inherit(Target,Origin) {
		function F() {}
		F.prototype = Origin.prototype;
		Target.prototype = new F();
		Target.prototype.constuctor = Target;
		Target.prototype.uber = Origin.prototype;
	}// Target继承Origin

	// 立即执行函数写法
	// var inherit = (function() {
	// 	var F = function () {};
	// 	return function(Target,Origin) {
	// 	F.prototype = Origin.prototype;
	// 	Target.prototype = new F();
	// 	Target.prototype.constuctor = Target;
	// 	Target.prototype.uber = Origin.prototype;
	// 	}
	// }());

	// Father.prototype.lastName = 'wang';
	// function Father() {		
	// }
	// function Son() {
	// }
	// inherit(Son,Father);
	// var son = new Son();
	// var father = new Father();

// 深度克隆
	function deepClone(Target,Origin) {
		var Origin = Origin || {};
		for (var prop in Target) {
			if (Target.hasOwnProperty(prop)) {
				if (Target[prop] !== 'null' && typeof(Target[prop]) === 'object') {
					if (Object.prototype.toString.call(Target[prop]) === '[object Array]') {
						Origin[prop] = [];
					}else {
						Origin[prop] = {};
					}
			//Origin[prop] = Object.prototype.toString.call(Target[prop]) === '[object Array]' ? [] :{}//
					deepClone(Target[prop],Origin[prop]);
				}else {
					Origin[prop] = Target[prop];
				}
			}
		}
		return Origin;
	}//Origin深度克隆Target//

	// var obj = {
	// 	name : 'wang',
	// 	age : 21,
	// 	card : ['gongshang','youzheng'],
	// 	school : {
	// 		middle : '69',
	// 		high : 'songlei',
	// 		university : 'haligong'
	// 	}
	// }
	// var Cobj = {
	// }
	// deepClone(obj,Cobj);


// type类型判断
	function type(Target) {
		var template = {
			'[object Array]' : 'array',
			'[object Object]' : 'object',
			'[object String]' : 'string - object',
			'[object Nember]' : 'number - object',
			'[object Boolean]' : 'boolean - object'
		}
		if (Target == null) {
			return 'null';
		}else if (typeof(Target) == 'object') {
			return template[Object.prototype.toString.call(Target)];
		}else {
			return typeof(Target);
		}
	}


//查看滚动条滚动距离
	function getScrollOffset() {
		if (window.pageXOffset) {
			return {
				x : window.pageXOffset,
				y : window.pageYOffset
			}
		}else {
			return {
				x : document.documentElement.scrolLeft + document.body.scrolLeft,
				y : document.documentElement.scrolTop + document.body.scrolTop
			}
		}
	}

// 查看屏幕尺寸
	function getViewportOffset() {
		if (window.innerWidth) {
			return {
				width : window.innerWidth,
				height : window.innerHight
			}
		}
		if (window.compatMode == 'CSS1Compat') {
			return {
				width : document.documentElement.clientWidth,
				height : document.documentElement.clientHight
			}
		}else if (window.compatMode == 'BackCompat') {
			return {
				width : document.body.clientWidth,
				height : document.body.clientHight
			}
		}
	}


// 获取DOM样式（ie兼容）
	function getStyle(elem, style) {
	    if (window.getComputedStyle) {
	        return window.getComputedStyle(elem, null)[style];
	    }else{
	        return elem.currentStyle[style];
	    }
	}


// 绑定事件
	function addEvent(elem, type, handler) {
	    if (elem.addEventListener) {
	        elem.addEventListener(type, handler, false);
	    }else if (elem.attachEvent) {
	        elem['temp' + type + handler] = handler;
	        elem['temp' + type] = function () {
	            handler.call(elem);
	        }
	        elem.attachEvent('on' + type, elem['temp' + type]);
	    }else {
	        elem['on' + type] = handler;
	    }
	}

// 解绑事件
	function removeEvent(elem, type, handler) {
	    if (elem.removeEventListener) {
	        elem.removeEventListener(type, handler, false);
	    }else if (elem.detachEvent) {
	        elem.detachEvent('on' + type.handler);
	    }else {
	        elem['on' + type] = false;
	    }
	}


// 取消冒泡
	function stopBubble (e) {
	    var event = e || window.event;
	    if(event.stopPropagation) {
	        event.stopPropagation();
	    }else{
	        event.cancelBubble = true;
	    }
	}
	// elem.addEventListener('click', function(e) {
	// 	.....
	// 	stopBubble(e);
	// }, false)

// 阻止默认事件
	function cancelHandler (e) {
	    var event = e || window.event;
	    if(event.preventDefault) {
	        event.preventDefault();
	    }else if(e.returnValue) {
	        event.returnValue = false;
	    }
	}

// 事件委托
	// function() {
	// 	var event = event || window.event;
	// 	var target = event.target || event.srcElement;
	// 	//获取源生事件兼容写法
	// 	......
	// }
	

//拖拽函数
	function drag (elem) {
	    elem.onmousedown = function (e) {
	    	var event = e || window.event,
	        	elemX = event.offsetX,
	            elemY = event.offsetY;
	    	document.onmousemove = function (e) {
	        	var event = e || window.event;
	            elem.style.top = e.clientY - elemY + 'px';
	            elem.style.left = e.clientX - elemX + 'px';
	        };
	    };
	    document.onmouseup = function (e) {
	    	var event = e || window.event;
	        document.onmousemove = false;   
	    };
	}


//多物体 多值 链式变动框架  
	function move (obj, data, func) {         
		clearInterval(obj.timer);
    	var iSpeed,
			iCur,
			name;            
		startTimer = obj.timer = setInterval(function () {
			var bStop = true;
			for (var attr in data) {
				if (attr === 'opacity') {
 					name = attr;
					iCur = parseFloat(getStyle(obj, attr)) * 100;
				}else {
					iCur = parseInt(getStyle(obj, attr));
				}
				iSpeed = ( data[attr] - iCur) / 8;
				if (iSpeed > 0) {
 					iSpeed = Math.ceil(iSpeed);
				}else {
					iSpeed = Math.floor(iSpeed);
				}
				if (attr === 'opacity') {
					obj.style.opacity = ( iCur + iSpeed ) / 100; 
				}else {
					obj.style[attr] = iCur + iSpeed + 'px';
				}
				if ( Math.floor(Math.abs(data[attr] - iCur)) != 0 ) {
					bStop = false;
				} 
			}
			if (bStop) {					 
				clearInterval(obj.timer);
				if (name === 'opacity') {
					obj.style.opacity = data[name] / 100;
				}
                typeof func == 'function' ? func() : "";
				//func();
			}
		},30);
	}  
// 弹性运动
	function startMove(dom,iTarget) {
		clearInterval(dom.timer);
		var iSpeed = 0,
			a = 0,
			u = 0.8;
		dom.timer = setInterval(function() { 
			a = (iTarget - dom.offsetLeft) / 5;
			iSpeed = 0.8 * (iSpeed + a);
			if (Math.abs(iSpeed) < 1 && dom.offsetLeft === iTarget) {
				dom.style.left = iTarget + 'px';
				clearInterval(dom.timer);
			}
			dom.style.left = dom.offsetLeft + iSpeed + 'px';
		},30)
	}

