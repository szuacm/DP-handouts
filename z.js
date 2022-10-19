let triangleFirst = true;
let lines = [];
let gnodes = [null];
function drawTriangle(input){
  console.log(input);
  input = input.split(/\s+/).map(x=>parseInt(x));
  let draw = SVG().addTo('#triangle').size('100%', '100%')
  let n = input[0];
  let tot = 0;
  for(let i=1; i<=n; i++){
    gnodes.push([null]);
    for(let j=1; j<=i; j++){
      let y = i*60, x = j*60 + (n-i)*30;
      if( i!=n ){
        draw.line(0,0,-30,60).stroke({width:3,color:'#fff'}).dmove(x,y)
        let line = draw.line(0,0,30,60).stroke({width:3,color:'#fff'}).dmove(x,y);
        lines.push(line);
      }
      var group = draw.group().fill('#111')
      group.circle(40).center(x,y).fill('lightsteelblue').stroke({width:2,color:'darkblue'})
      //group.path('M10,20L30,40').attr({'stroke-width': 2, stroke: '#333'})
      group.text(input[++tot]).attr({x, y:y+7, 'font-size':20, 'text-anchor':'middle'})
      gnodes[i].push(group);
    }
  }
  console.log(gnodes);
  lines.forEach(x=>x.animate(2000, 1000, 'now').stroke({color:'#f03'}))
}

Reveal.on('triangle', () => {
  if( triangleFirst ){
    drawTriangle(document.getElementById('triangle-input').value);
    triangleFirst = false;
  }
});
