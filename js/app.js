var app = (function(){
  var a = {}
    , canvas
    , context
    , center = {}
    , radius
    , points = []
    , golden = 1.618033988749895
    // , canvasBg = [196, 196, 196]
    , canvasBg = (new RColor).get(false, 0.15, 0.90)
    , color = (new RColor).get(false, 0.75, 0.93)
    ;

  function getRadians (angle){
    return angle * Math.PI/180;
  }

  function distAB (x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
  }

  function getCoordsAngleDist (angle, distance){
    var rad = getRadians(angle)
      , c
      ;
    c = {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance
      }
    return c;
  }

  function initFirstPoints (){
    var cont = 0
      , max = 800
      ;
    points = [];
    while(cont<max){
      var slice = 360/max
        , angle = Math.floor(Math.random()*(slice/3) + slice*cont)
        , c = getCoordsAngleDist(angle, radius)
        , point = {
          x: c.x + center.x,
          y: c.y + center.y,
          angle: angle
        }
      points.push(point);
      cont++;
    }
  }

  function updatePoints (){
    for (var i = 0; i < points.length; i++) {
      var c = getCoordsAngleDist(points[i].angle, radius + (Math.sin(Math.random()*50) * 2.4));
      points[i].x = c.x + center.x;
      points[i].y = c.y + center.y;
    }
  }
  
  function animate (){
    requestAnimFrame(animate);
    draw();
  }

  function draw (){
    context.fillStyle = 'rgba('+canvasBg[0]+','+canvasBg[1]+','+canvasBg[2]+',0.7)';
    context.fillRect(0, 0, canvas.width,canvas.height);

    var time = new Date().getTime()
      , changeFactor = Math.sin(time) * golden
      , fx = points[0].x 
      , fy = points[0].y
      ;

    context.fillStyle = 'rgba('+color[0]+','+color[1]+','+color[2]+',0.4)';
    context.beginPath();
    context.moveTo(fx, fy);
    for (var i = 1; i < points.length; i++) {
      var x = points[i].x 
        , y = points[i].y 
        ;

      context.lineTo(x, y);
      
      if(i == points.length-1){
        context.lineTo(fx, fy);
      } 
    }
    context.closePath();
    context.fill();
    updatePoints();
  }

  a.canvasResize = function (){
    canvas.height = window.innerHeight-4;
    canvas.width = window.innerWidth;
    center.x = Math.floor(canvas.width/2);
    center.y = Math.floor(canvas.height/2);
    var m = (canvas.height<canvas.width)?canvas.height:canvas.width;
    radius = (m/golden)/2;
  }

  a.blastOff = function (){
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    this.canvasResize();
    initFirstPoints();
    animate();
  }
  return a
})();

window.onload = function (){
  app.blastOff();
}
window.onresize = function (){
  app.canvasResize();
}