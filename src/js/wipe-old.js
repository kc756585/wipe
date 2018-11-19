var cas = document.getElementById('cas');
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height,t=0;
var radius = 30;  // 涂抹的半径
var posX = 0;
var posY = 0;
var isMouseDown = false;
// 表示鼠标的状态, 是否按下, 默认为未按下false, 按下true
//device保存设备类型，如果是移动端则为true,PC端为false
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
console.log(navigator.userAgent);
console.log(device);
var clickEvtName = device ? "touchstart" : "mousedown";
var moveEvtName = device ? "touchmove" : "mousemove";
var endEvtName = device ? "touchend" : "mouseup";
// 生成画布上的遮罩, 默认为颜色#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation="destination-out";
}

// // 在画布上画半径为30的圆
// function drawPoint(context,posX,posY){
// 	context.beginPath();
// 	context.arc(posX,posY,radius,0,2*Math.PI);
// 	context.fillStyle = "red";
// 	context.fill();
// }
// // 画线
// function drawLine(context,x1,y1,x2,y2){
// 	context.save();
// 	context.lineCap = "round";
// 	context.beginPath();
// 	context.moveTo(x1, y1);
// 	context.lineTo(x2,y2);
// 	context.lineWidth = radius*2;
// 	context.stroke();
// 	context.restore();
// }
function drawT(context,x1,y1,x2,y2) {
	if (arguments.length === 3) {
		//调用的是画点功能
		context.save();
		context.beginPath();
		context.arc(x1,y1,radius,0,2*Math.PI);
		context.fillStyle = "red";
		context.fill();
		context.restore();
	}else if(arguments.length === 5){
		//调用的是画线功能
		context.save();
		context.lineCap = "round";
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2,y2);
		context.lineWidth = radius*2;
		context.stroke();
		context.restore();
	}else{
		return false;

	}
}
// 在canvas画布上监听自定义事件"mousedown", 调用drawpoint函数
cas.addEventListener(clickEvtName,function(evt){
	isMouseDown = true;

	var event = evt || window.event;
	// 获取鼠标在视口的坐标, 传递参数到drawPoint
	posX = device ? event.touches[0].clientX : event.clientX;
	posY = device ? event.touches[0].clientY : event.clientY;
	drawT(context,posX,posY);
},false);
// 为画布添加手势操作--手指点击响应
// cas.addEventListener("touchstart",function(evt){
// 	isMouseDown = true;
// 	var event = evt || window.event;
// 	// 获取鼠标在视口的坐标, 传递参数到drawPoint
// 	posX = event.touches[0].clientX;
// 	posY = event.touches[0].clientY;
// 	drawPoint(context,posX,posY);
// },false);

// 增加监听"mousemove", 调用drawpoint函数
cas.addEventListener(moveEvtName,function(evt){
	// 判断, 当isMouseDown为true时, 才执行下面的操作
	if ( !isMouseDown) {
		return false;
	}else{
		var event = evt || window.event;
		event.preventDefault();
		// 获取鼠标在视口的坐标, 传递参数到drawPoint
		var x2 = device ? event.touches[0].clientX : event.clientX;
		var y2 = device ? event.touches[0].clientY : event.clientY;
		drawT(context,posX,posY,x2,y2);
		// 每次的结束点变成下一次画线的开始点
		posX = x2;
		posY = y2;
	}
},false);

// 手指移动
// cas.addEventListener("touchmove",function(evt){
// 	// 判断, 当isMouseDown为true时, 才执行下面的操作
// 	if ( !isMouseDown) {
// 		return false;
// 	}else{
// 		var event = evt || window.event;
// 		event.preventDefault();
// 		// 获取鼠标在视口的坐标, 传递参数到drawPoint
// 		var x2 = event.touches[0].clientX;
// 		var y2 = event.touches[0].clientY;
// 		drawLine(context,posX,posY,x2,y2);
// 		// 每次的结束点变成下一次画线的开始点
// 		posX = x2;
// 		posY = y2;
// 	}
// },false);
cas.addEventListener("mouseup",fn2,false);
cas.addEventListener(endEvtName,fn2,false);
function fn2(){
	//还原isMouseDown 为false
	isMouseDown = false;
	if (getTransparencyPercent(context)>50) {
		alert("超过50%的面积");
		clearRect(context);
	}
}

function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);
	for (var i = 0; i < imgData.data.length; i+=4) {
		var a = imgData.data[i+3];
		if ( a === 0 ) {
			t++;
		}
	}
	var percent = (t/(_w*_h))*100;
	console.log("透明点的个数："+t);
	console.log("占总面积"+Math.ceil(percent)+"%");
	// return ((t/(_w*_h))*100).toFixed(2);
	return Math.round(percent);
}


window.onload = function(){
	drawMask(context);
};