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

(function wythoff(){
  var wythoff = $('#wythoff')[0];
  var ctx = wythoff.getContext("2d");
  var points = [[0,0],[1,2],[2,1],[3,5],[4,7],[5,3],[6,10],[7,4],[8,13],[9,15],[10,6],[11,18],[12,20],[13,8],[14,23],[15,9],[16,26],[17,28],[18,11],[19,31],[20,12],[21,34],[22,36],[23,14],[24,39],[25,41],[26,16],[27,44],[28,17],[29,47],[30,49],[31,19],[32,52],[33,54],[34,21],[35,57],[36,22],[37,60],[38,62],[39,24],[40,65],[41,25],[42,68],[43,70],[44,27],[45,73],[46,75],[47,29],[48,78],[49,30],[50,81],[51,83],[52,32],[53,86],[54,33],[55,89],[56,91],[57,35],[58,94],[59,96],[60,37],[61,99],[62,38],[65,40],[68,42],[70,43],[73,45],[75,46],[78,48],[81,50],[83,51],[86,53],[89,55],[91,56],[94,58],[96,59],[99,61]]
  for(let a of points){
    ctx.fillStyle="#FF0000";
    ctx.fillRect(a[0]*4,a[1]*4,4,4);
  }
})();
