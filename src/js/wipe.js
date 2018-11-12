var cas = document.getElementById("cas");
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height,t=0;
var radius = 30; //涂抹的半径 
var posX = 0;
var posY = 0;
var isMouseDown = false;
// 生成画布上的遮罩，默认颜色#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation="destination-out";

}
//在画布上画半径为30的圆
function drawPoint(context,posX,posY){
	context.save();
	context.beginPath();
	context.arc(posX,posY,radius,0,2*Math.PI);
            context.fillStyle = "red";
            context.fill();
            context.restore();
}
//画线
function drawLine(context,x1,y1,x2,y2){
	//保存当前绘图状态
	context.save();
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.lineWidth = radius*2;
	context.stroke();
	//恢复原有绘图状态
	context.restore();
}

//在canvas画布上监听自定义事件"mousedown"，调用drawPoint函数
cas.addEventListener("mousedown", function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标在视口的坐标，传递参数到deawPoint
	 posX = event.clientX;
	 posY = event.clientY;
	drawPoint(context,posX,posY);
},false);
//增加监听"mousemove",调用drawPoint函数
cas.addEventListener("mousemove",fn1,false);
function fn1(evt){
            //判断，当isMouseDown为true时，才执行下面操作
            if ( !isMouseDown ) {
            	return false;
            }else{
            	var event = evt || window.event;
		var x2 = event.clientX;
		var y2 = event.clientY;
		drawLine(context,posX,posY,x2,y2);
		//每次的结束点变成下一次划线的开始点
		posX = x2;
		posY = y2;
            }
}
cas.addEventListener("mouseup",function(){
	//还原isMouseDown 为false
	isMouseDown = false;
	if (getTransparencyPercent(context)>50) {
		alert("超过50%的面积");
		// drawMask(context);
		clearRect(context);
	}
},false);
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);
	for (var i = 0; i < imgData.data.length; i+=4) {
		var a = imgData.data[i+3];
		if( a === 0 ){
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