#include"cwasm"
#include<emscripten/emscripten.h>
#include<cstdio>
#include<algorithm>
#include<sstream>
#include<vector>
#define rep(i,s,t) for(int i=(s);i<=(t);i++)
#define rev_rep(i,s,t) for(int i=(s);i>=(t);i--)
using ll = long long;
using namespace std;
stringstream ssin;
ll ci(){ ll x; ssin>>x; return x; }

int RET[1023];
void output(int x){
	if( RET[0]<1000 ) RET[++RET[0]] = x;
}

int a[103][103];
int f[103][103];
int from[103][103];

EM_PORT_API(int*) triangle(const char*input){
	ssin = stringstream(input);
	int n = ci();
	rep(i,1,n) rep(j,1,i) a[i][j] = ci();
	rep(j,1,n+1) f[n+1][j] = 0;
	rev_rep(i,n,1){
		rep(j,1,i){
			f[i][j] = max(f[i+1][j], f[i+1][j+1]) + a[i][j];
			from[i][j] = f[i+1][j]<f[i+1][j+1];
		}
	}
	RET[0] = 0;
	output(n);
	rep(i,1,n) rep(j,1,i) output(f[i][j]);
	rep(i,1,n) rep(j,1,i) output(from[i][j]);
	return RET;
}
/*
(function (s){
  let ptr = Module.ccall('triangle', 'number', ['string'], [s]);
  let n = Module.HEAP32[ptr/4];
  let a = [];
  for(let i=1; i<=n; i++) a.push(Module.HEAP32[ptr/4+i]);
  return a;
})('3 3 2 1 3 4 6');
'5 7 3 8 8 1 0 2 7 4 4 4 5 2 6 5'
*/

bool vis[103][103];

const int dx[] = {0,-1,0,1};
const int dy[] = {1,0,-1,0};

int _n,_m;
int dfs(int x, int y){
	if( vis[x][y] ) return f[x][y];
	vis[x][y] = 1;
	rep(i,0,3){
		int tx = x+dx[i], ty = y+dy[i];
		if( 1<=tx && tx<=_n && 1<=ty && ty<=_m && a[tx][ty]<a[x][y] ){
			int tmp = dfs(tx, ty)+1;
			if( f[x][y]<tmp ) f[x][y]=tmp, from[x][y]=i;
		}
	}
	return f[x][y];
}

EM_PORT_API(int*) ski(const char*input){
	ssin = stringstream(input);
	int n = ci(), m = ci();
	_n = n;
	_m = m;
	rep(i,1,n) rep(j,1,m) a[i][j] = ci();
	rep(i,1,n) rep(j,1,m) vis[i][j] = 0;
	rep(i,1,n) rep(j,1,m) from[i][j] = -1;
	rep(i,1,n) rep(j,1,m) f[i][j] = 1;
	rep(i,1,n) rep(j,1,m) dfs(i,j);
	RET[0] = 0;
	output(n), output(m);
	rep(i,1,n) rep(j,1,m) output(f[i][j]);
	rep(i,1,n) rep(j,1,m) output(from[i][j]);
	return RET;
}
/*
(function (s){
  let ptr = Module.ccall('ski', 'number', ['string'], [s]);
  let n = Module.HEAP32[ptr/4];
  let a = [];
  for(let i=1; i<=n; i++) a.push(Module.HEAP32[ptr/4+i]);
  return a;
})('3 3 1 1 3 2 3 4 1 1 1');
'5 5 1 2 3 4 5 16 17 18 19 6 15 24 25 20 7 14 23 22 21 8 13 12 11 10 9'
*/
