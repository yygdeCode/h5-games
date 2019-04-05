var father = document.getElementsByClassName('game-nav')[0];
var oUl = father.children[0];
var gamePage = document.getElementsByClassName('game-mainpage')[0];
var newGame = document.getElementsByClassName('newgame')[0];
// 选项卡事件绑定
oUl.addEventListener('click', tab, false);
function tab (e) {
	for (var i = 0; i < oUl.children.length - 1; i ++) {
		oUl.children[i].className = '';
		if (oUl.children[i] == e.target) {
			// 处理move函数执行时不能选择难度
			oUl.removeEventListener('click', tab, false);
			move(gamePage, {top: -450 * i}, function () {
				oUl.addEventListener('click', tab, false);
			});
			winmine = new Winmine(difficul[i]);
		}
	}
	e.target.className = 'difficulty';
}
// 取消计时部分的事件冒泡
oUl.children[3].addEventListener('click', function (e) {
		e.stopPropagation();
}, false)
// new game 事件绑定
newGame.addEventListener('click', function (e) {
	for (var i = 0; i < oUl.children.length - 1; i ++) {
		if (oUl.children[i].className) {
			winmine.cleartimer();
			winmine = new Winmine(difficul[i]);
			oUl.addEventListener('click', tab, false);
		}
	}
}, false)
