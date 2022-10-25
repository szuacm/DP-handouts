const $ = document.querySelectorAll.bind(document);

function callModule(func, input){
  let ptr = Module.ccall(func, 'number', ['string'], [input]);
  let n = Module.HEAP32[ptr/4];
  let a = [];
  for(let i=1; i<=n; i++) a.push(Module.HEAP32[ptr/4+i]);
  return a;
}

let triangleG = [null];
function drawTriangle(input){
  let oldsvg = $('#triangle > svg')[0];
  if( oldsvg ) oldsvg.remove(), triangleG = [null];
  input = input.split(/\s+/).map(x=>parseInt(x));
  let n = input[0];
  let scale = 2*(30+30*n);
  let draw = SVG().addTo('#triangle').size('100%', '100%').attr({viewBox:'0 0 '+scale+' '+scale});
  let tot = 0;
  for(let i=1; i<=n; i++){
    triangleG.push([null]);
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
      triangleG[i].push(group);
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
  for(let i=n; i>=1; i--){
    if( i!=n ){
      for(let j=i; j>=1; j--){
        triangleG[i][j].Line[ans[tot2--]].animate(1000, 500, 'now').stroke({color:'#f03'})
      }
    }
    for(let j=i; j>=1; j--){
      triangleG[i][j].fill('yellow').Text.text(ans[tot1--])
    }
  }
}

let skiG = [null];
function drawSki(input){
  let oldsvg = $('#ski > svg')[0];
  if( oldsvg ) oldsvg.remove(), skiG = [null];
  input = input.split(/\s+/).map(x=>parseInt(x));
  let n = input[0], m = input[1];
  let mx = input.slice(2,2+n*m).filter(isFinite).reduce((x,y)=>Math.max(x,y));
  let scale = 50*(Math.max(n,m)+1);
  let draw = SVG().addTo('#ski').size('100%', '100%').attr({viewBox:'0 0 '+scale+' '+scale});
  let tot = 1;
  for(let i=1; i<=n; i++){
    skiG.push([null]);
    for(let j=1; j<=m; j++){
      let y = i*50, x = j*50;
      let group = draw.group().fill('#111')
      let num = input[++tot];
      group.rect(40,40).center(x,y).fill('hsl('+Math.ceil(num/mx*270)+',80%, 50%)').stroke({width:2,color:'hsl('+Math.ceil(num/mx*270)+',50%, 50%)'})
      group.Text = group.text(num).attr({x, y:y+7, 'font-size':20, 'text-anchor':'middle'})
      skiG[i].push(group);
    }
  }
}

function solveSki(input){
  let oldsvg = $('#ski > svg')[0];
  if( !oldsvg ) drawTriangle(input);
  let ans = callModule('ski', input);
  let n = ans[0], m = ans[1];
  let tot1 = n*m+1;
  let tot2 = tot1*2 - 1;
  for(let i=n; i>=1; i--){
    for(let j=n; j>=1; j--){
      let dir = ans[tot2--];
      if( dir<0 || dir>3 ) continue;
      (function(){
        if( dir==0 ){
          let [L,R,U,D] = [50*j+20, 50*j+30, 50*i-10, 50*i+10];
          return skiG[i][j].polygon(`${L},${U} ${R},${(U+D)/2} ${L},${D}`)
        }else if( dir==1 ){
          let [L,R,U,D] = [50*j-10, 50*j+10, 50*i-30, 50*i-20];
          return skiG[i][j].polygon(`${L},${D} ${(L+R)/2},${U} ${R},${D}`)
        }else if( dir==2 ){
          let [L,R,U,D] = [50*j-30, 50*j-20, 50*i-10, 50*i+10];
          return skiG[i][j].polygon(`${R},${U} ${L},${(U+D)/2} ${R},${D}`)
        }else if( dir==3 ){
          let [L,R,U,D] = [50*j-10, 50*j+10, 50*i+20, 50*i+30];
          return skiG[i][j].polygon(`${L},${U} ${(L+R)/2},${D} ${R},${U}`)
        }
1     })().fill('#ccc').attr({opacity: '0'}).animate(1000, 500, 'now').attr({opacity: '1'})
    }
  }
}


let triangleFirst = true;
let skiFirst = true;
Reveal.on('triangle-draw', () => {
  if( triangleFirst ){
    drawTriangle($('#triangle-input')[0].value);
    triangleFirst = false;
  }
});
Reveal.on('ski-draw', () => {
  if( skiFirst ){
    drawSki($('#ski-input')[0].value);
    skiFirst = false;
  }
});
