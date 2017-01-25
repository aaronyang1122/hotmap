(function (window) {
	function clickStat() {
    tempX = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    tempY = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    _clintHeight = document.body.scrollHeight
    _clintWidth = document.body.scrollWidth
    console.log(tempX, tempY, _clintWidth, _clintHeight)
    var img = new Image()
    img.src = 'http://10.241.116.81:9000/pic?mousex=' + tempX + '&mousey=' + tempY + '&clientwidth=' + _clintWidth + '&clientheight=' + _clintHeight
	}
	
	if (document.addEventListener) {
	  document.addEventListener('click', clickStat)
	} else if (document.attachEvent) {
		document.attachEvent('onclick', clickStat)
	}
})(this)