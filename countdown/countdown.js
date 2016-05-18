var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS  = 8;
var MARGIN_TOP = 120;
var MARGIN_LEFT = 30;

//var endTime = new Date(2016,4,19,0,0,0);  //设置指定截止时间
var endTime = new Date;
endTime.setTime(endTime.getTime()+3600000);  //设置1小时倒计时
var curShowTimeSeconds = 0;

var balls = [];  //存放小球的数组
var colors = [ "#33b5e5","#0099cc","#aa66cc","#9933cc","#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];

window.onload = function(){

	//屏幕自适应
	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
	RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1; 

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	
	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(
		function(){
			render(context);
			update();
		},
		50
		);
}

//返回离截止日期的秒数
function getCurrentShowTimeSeconds(){
	var curTime = new Date();
	var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round(ret/1000);
	return ret>=0?ret:0;
}


//实现时钟效果
// function getCurrentShowTimeSeconds(){
// 	var curTime = new Date();
// 	var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
// 	return ret;
// }

function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
	var nextHours = parseInt(nextShowTimeSeconds / 3600);
	var nextMinutes = parseInt((nextShowTimeSeconds % 3600)/60);
	var nextSeconds = parseInt(nextShowTimeSeconds%60);

	var curHours = parseInt(curShowTimeSeconds / 3600);
	var curMinutes = parseInt((curShowTimeSeconds % 3600)/60);
	var curSeconds = parseInt(curShowTimeSeconds%60);

	if( nextSeconds != curSeconds){
		//判断小时的十位数和个位数是否改变
		if( parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		if( parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
		}
		//判断分钟的十位数和个位数是否改变
		if( parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		if( parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		//判断秒的十位数和个位数是否改变
		if( parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		//if( parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
		//}

		curShowTimeSeconds = nextShowTimeSeconds; 
	}

	updateBalls();
	//console.log(balls.length);
}

//更新所有小球的状态
function updateBalls(){
	for(var i = 0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;
		if(balls[i].y+RADIUS >= WINDOW_HEIGHT){
			balls[i].vy = -0.75*balls[i].vy;
		}
	}

	//删除屏幕外的小球
	var cnt = 0;
	for(var i = 0; i < balls.length; i++)
		if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS < WINDOW_WIDTH)
			balls[cnt++] = balls[i];   //把在屏幕范围内的小球都移动到数组前面

	while(balls.length > cnt)
		balls.pop();
}

//对发生改变的数字增加小球 
function addBalls(x,y,num){
	//(x,y)数字num左上角的坐标
	 for(var i = 0; i < digit[num].length; i++)
	 	for(var j = 0; j < digit[num][i].length; j++)
	 		if(digit[num][i][j] == 1){
	 			var ball = {
	 				x:x+j*2*(RADIUS+1)+(RADIUS+1),
	 				y:y+i*2*(RADIUS+1)+(RADIUS+1),
	 				g:1.5+Math.random(), //小球的加速度  
	 				vx:Math.pow(-1,Math.ceil(Math.random()*10))*4,//小球的水平初速度(-4或+4)
	 				vy:-5, //小球的垂直初速度
	 				color:colors[Math.floor(Math.random()*colors.length)]//小球颜色
	 			}; //小球对象
	 			balls.push(ball); 
	 		}
}

function render(cxt){

	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT); //清空当前画布

	var hours = parseInt(curShowTimeSeconds / 3600);
	var minutes = parseInt((curShowTimeSeconds % 3600)/60);
	var seconds = parseInt(curShowTimeSeconds%60);

	//绘制数字
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);//冒号
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

	//绘制小球
	for(var i = 0; i < balls.length; i++){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		cxt.closePath();
		cxt.fill();
	}
}


//绘制一个数字
function renderDigit(x,y,num,cxt){
	 cxt.fillStyle = "rgb(0,102,153)";
	 for(var i = 0; i < digit[num].length; i++)
	 	for(var j = 0; j < digit[num][i].length; j++)
	 		if(digit[num][i][j] == 1){
	 			cxt.beginPath();
	 			cxt.arc(x + j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
	 			cxt.closePath();
	 			cxt.fill();
	 		}
}