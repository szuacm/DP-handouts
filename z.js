const $ = document.querySelectorAll.bind(document);

function callModule(func, input){
  let ptr = Module.ccall(func, 'number', ['string'], [input]);
  let n = Module.HEAP32[ptr/4];
  let a = [];
  for(let i=1; i<=n; i++) a.push(Module.HEAP32[ptr/4+i]);
  return a;
}

let gnodes = [null];
function drawTriangle(input){
  let oldsvg = $('#triangle > svg')[0];
  if( oldsvg ) oldsvg.remove(), gnodes = [null];
  console.log(input);
  input = input.split(/\s+/).map(x=>parseInt(x));
  let n = input[0];
  let scale = 2*(30+30*n);
  let draw = SVG().addTo('#triangle').size('100%', '100%').attr({viewBox:'0 0 '+scale+' '+scale});
  let tot = 0;
  for(let i=1; i<=n; i++){
    gnodes.push([null]);
    for(let j=1; j<=i; j++){
      let y = i*60, x = j*60 + (n-i)*30;
      let lines = [null, null]
      if( i!=n ){
        lines[0] = draw.line(0,0,-30,60).stroke({width:3,color:'#fff'}).dmove(x,y);
        lines[1] = draw.line(0,0,30,60).stroke({width:3,color:'#fff'}).dmove(x,y);
      }
      var group = draw.group().fill('#111')
      group.Line = lines
      group.circle(40).center(x,y).fill('lightsteelblue').stroke({width:2,color:'darkblue'})
      //group.path('M10,20L30,40').attr({'stroke-width': 2, stroke: '#333'})
      group.Text = group.text(input[++tot]).attr({x, y:y+7, 'font-size':20, 'text-anchor':'middle'})
      gnodes[i].push(group);
    }
  }
}

function solveTriangle(input){
  let oldsvg = $('#triangle > svg')[0];
  if( !oldsvg ) drawTriangle(input);
  let ans = callModule('triangle', input);
  let n = ans[0];
  let tot1 = n*(n+1)/2;
  let tot2 = tot1*2 - n;
  console.log(ans, tot1, tot2);
  for(let i=n; i>=1; i--){
    console.log(i);
    if( i!=n ){
      for(let j=i; j>=1; j--){
        gnodes[i][j].Line[ans[tot2--]].animate(2000, 1000, 'now').stroke({color:'#f03'})
      }
    }
    for(let j=i; j>=1; j--){
      gnodes[i][j].fill('yellow').Text.text(ans[tot1--])
    }
  }
}

let triangleFirst = true;
Reveal.on('triangle', () => {
  if( triangleFirst ){
    drawTriangle($('#triangle-input')[0].value);
    triangleFirst = false;
  }
});
