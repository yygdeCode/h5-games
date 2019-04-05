// 难易程度参数
var difficul = [
	{
		name : 'easy',
		width : 9,
		height : 9,
		minenum : 10
	},
	{
		name : 'usual',
		width : 16,
		height : 16,
		minenum : 40
	},
	{
		name : 'hard',
		width : 16,
		height : 30,
		minenum : 99
	}
]
// 构造函数
function Winmine (difficulty) {
	this.difficulty = difficulty;
	this.objLi = {};
	this.objDiv = {};
	this.objMine = {};
	this.timerBoolean = true;
	this.timer;
	this.oUl;
	this.oldUl();
	this.chessboard();
	this.click();
}
// 防止new多个对象后同时触发
Winmine.prototype.oldUl = function () {
	var father = document.getElementsByClassName(this.difficulty.name)[0];
	var oldul = father.children[0];
	oldul.remove(0);
	this.oUl = document.createElement('ul');
	this.oUl.className = 'chessboard';
	father.appendChild(this.oUl);
}
// 棋盘函数
Winmine.prototype.chessboard = function () {
	var html = '';
	var objLi_index = 0;
	var objDiv_index = 0;
	// 渲染minenum
	var oInput = document.getElementsByTagName('input')[2];
	oInput.value = this.difficulty.minenum;
	// 棋盘生成
	for (var i = 0; i < this.difficulty.width; i ++) {
		for (var j = 0; j < this.difficulty.height; j ++) {
			html += '\
				<li>\
					<div></div>\
				</li>';
			this.objLi[i + ',' + j] = null;
			this.objDiv[i + ',' + j] = null;
		}
	}
	this.oUl.innerHTML = html;
	var oLi = this.oUl.children;
	for (var prop in this.objLi) {
		this.objLi[prop] = oLi[objLi_index];
		objLi_index ++;
	} // 添加this.objLi的dom结构
	// 随机生成mine
	for (var i = 0; i < this.difficulty.minenum; i ++) {
		var mine_index = Math.floor(Math.random() * this.difficulty.width) + ',' + Math.floor(Math.random() * this.difficulty.height);
		if (!this.objMine[mine_index]) {
			this.objMine[mine_index] = this.objLi[mine_index];// 添加this.objMine的dom结构
			this.objMine[mine_index].style.backgroundImage = 'url("./pic/mine.jpg")';
			this.objMine[mine_index].style.backgroundSize = '100% 100%';
		} else {
			i --;
		}
	}
	// 标记mine周围数字
	for (var prop in this.objMine) {
		var arr = this.position(prop);
		for (var i = 0; i < arr.length; i ++) {
			if (this.objLi[arr[i]] && !this.objMine[arr[i]]) {
				this.objLi[arr[i]].innerHTML = Number(this.objLi[arr[i]].innerText) + 1 + '<div></div>';
			}
		}
	}
	for (var prop in this.objDiv) {
		this.objDiv[prop] = oLi[objDiv_index].children[0];
		objDiv_index ++;
	}// 添加this.objDiv的dom结构
}
// 周围位置函数
Winmine.prototype.position = function (position) {
	var arr = position.split(',');
	var aroundposition = [];
	var x = Number(arr[0]);
	var y = Number(arr[1]);
	aroundposition[0] = (x - 1) + ',' + (y - 1);
	aroundposition[1] = x + ',' + (y - 1);
	aroundposition[2] = (x + 1) + ',' + (y - 1);
	aroundposition[3] = (x + 1) + ',' + y;
	aroundposition[4] = (x + 1) + ',' + (y + 1);
	aroundposition[5] = x + ',' + (y + 1);
	aroundposition[6] = (x - 1) + ',' + (y + 1);
	aroundposition[7] = (x - 1) + ',' + y;
	return aroundposition;
}
// 事件绑定函数
Winmine.prototype.click = function () {
	var that = this;
	var oInput = document.getElementsByTagName('input');
	// 重置时间
	oInput[0].value = 0;
	oInput[1].value = 0;
	var Tab = document.getElementsByClassName('game-nav')[0].children[0];
	// 阻止右键菜单默认事件
	document.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	}, false);
	// 主要游戏点击事件绑定
	that.oUl.addEventListener('mouseup', function (e) {
		var target = e.target;
		var parent = target.parentNode;
		if (target.children[0]) {
			return false;
		}else if (e.button == 0 && !target.name) {
			target.style.display = 'none';
			if (parent.style.backgroundImage && that.timerBoolean) {
				that.firstmine(parent);
			} else if (parent.style.backgroundImage) {
				clearInterval(that.timer);
				for (var prop in that.objDiv) {
					that.objDiv[prop].style.display = 'none';
				}
				alert('游戏结束');
				return false;
			} else if (!parent.innerText) {
				parent.name = 'open';
				that.spread(parent);
			}
		} else if (e.button == 2) {
			if (target.name) {
				target.style.backgroundImage = '';
				target.name = '';
				oInput[2].value ++;
			}else if (!target.name && oInput[2].value > 0) {
				target.style.backgroundImage = 'url("./pic/flag.jpg")';
				target.style.backgroundSize = '100% 100%';
				target.name = 'flag';
				oInput[2].value --;
			}
		}
		// 渲染time计时器
		if (that.timerBoolean) {
			that.timer = setInterval(function () {
				if (oInput[1].value == 59) {
					oInput[0].value = Number(oInput[0].value) + 1;
					oInput[1].value = 0;
				}else {
					oInput[1].value = Number(oInput[1].value) + 1;
				}
			}, 1000);
			that.timerBoolean = false;// 避免多个定时器
			Tab.removeEventListener('click', tab, false);// 开始游戏取消选择难度事件
		}
		// 判断游戏是否结束
		var count = 0;
		if (oInput[2].value == 0) {
			for (var prop in that.objMine) {
				if (that.objMine[prop].children[0].name) {
					count ++;				}
			}
			if (count == that.difficulty.minenum) {
				clearInterval(that.timer);
				for (var prop in that.objDiv) {
					that.objDiv[prop].style.display = 'none';
				}
				alert('congratulation！\ntime：' + oInput[0].value + 'minute' + oInput[1].value + 'second');
			}
		}
	}, false);
}
// 扩散递归函数
Winmine.prototype.spread = function (spreadobj) {
	var arr = [];
	for (var prop in this.objLi) {
		if (this.objLi[prop] == spreadobj) {
			arr = this.position(prop);
		}
	}
	for (var i = 0; i < arr.length; i ++) {
		if (this.objLi[arr[i]]) {
			this.objDiv[arr[i]].style.display = 'none';
			if (!this.objLi[arr[i]].innerText && !this.objLi[arr[i]].name) {
				this.objLi[arr[i]].name = 'open';
				this.spread(this.objLi[arr[i]]);
			}
		}
	}
}
// 清处timer函数
Winmine.prototype.cleartimer = function () {
	clearInterval(this.timer);
}
// 移除firstmine函数
Winmine.prototype.firstmine = function (elem) {
	var arr = [];
	var newarr = [];
	var boolean = true;// 周围生成的boolean判断值
	var Prop;
	elem.style.backgroundImage = '';
	for (var prop in this.objMine) {
		if (this.objMine[prop] == elem) {
			Prop = prop;
			arr = this.position(prop);
			delete this.objMine[prop];
		}
	}
	for (var i = 0; i < arr.length; i ++) {
		if (this.objLi[arr[i]] && this.objLi[arr[i]].style.backgroundImage) {
			elem.innerHTML = Number(elem.innerText) + 1 + '<div></div>';
			this.objDiv[Prop] = elem.children[0];
		}
		if (this.objLi[arr[i]] && !this.objLi[arr[i]].style.backgroundImage) {
			var text = Number(this.objLi[arr[i]].innerText) - 1 == 0 ? '' : Number(this.objLi[arr[i]].innerText) - 1;
			this.objLi[arr[i]].innerHTML = text + '<div></div>';
			if (boolean) {
				this.objMine[arr[i]] = this.objLi[arr[i]];
				this.objMine[arr[i]].style.backgroundImage = 'url("./pic/mine.jpg")';
				this.objMine[arr[i]].style.backgroundSize = '100% 100%';
				this.objLi[arr[i]].innerHTML = '<div></div>';
				boolean = false;
				newarr = this.position(arr[i]);
				for (var j = 0; j < newarr.length; j ++) {
					if (this.objLi[newarr[j]] && !this.objLi[newarr[j]].style.backgroundImage) {
						this.objLi[newarr[j]].innerHTML = Number(this.objLi[newarr[j]].innerText) + 1 + '<div></div>';
						this.objDiv[newarr[j]] = this.objLi[newarr[j]].children[0];
					}
				}
			}
			this.objDiv[arr[i]] = this.objLi[arr[i]].children[0];
		}
	}
	this.objDiv[Prop].style.display = 'none';
}
// 初始化new一个easy
var winmine = new Winmine(difficul[0]);