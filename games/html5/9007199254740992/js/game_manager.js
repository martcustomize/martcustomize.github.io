function GameManager(e,t,i,r){this.size=e,this.inputManager=new t,this.scoreManager=new r,this.actuator=new i,this.startTiles=2,this.inputManager.on("move",this.move.bind(this)),this.inputManager.on("restart",this.restart.bind(this)),this.setup()}GameManager.prototype.restart=function(){this.actuator.restart(),this.setup()},GameManager.prototype.setup=function(){var e=localStorage.lastMove,t=!1;if(e){var i=JSON.parse(localStorage[e]);0==i.over?(this.grid=new Grid(i.grid),this.score=i.score,this.over=i.over,this.actuate()):t=!0}else t=!0;t&&(this.grid=new Grid({size:this.size}),this.score=0,this.over=!1,this.won=!1,this.addStartTiles(),this.actuate())},GameManager.prototype.addStartTiles=function(){for(var e=0;e<this.startTiles;e++)this.addRandomTile()},GameManager.prototype.addRandomTile=function(){if(this.grid.cellsAvailable()){var e=Math.random()<.9?2:4,t=new Tile(this.grid.randomAvailableCell(),e);this.grid.insertTile(t)}},GameManager.prototype.actuate=function(){this.scoreManager.get()<this.score&&this.scoreManager.set(this.score),this.actuator.actuate(this.grid,{score:this.score,over:this.over,won:this.won,bestScore:this.scoreManager.get()}),this.storeMove({grid:this.grid,score:this.score,over:this.over})},GameManager.prototype.storeMove=function(e){var t=localStorage.lastMove,i=(new Date).getTime();localStorage[i]=JSON.stringify(e),localStorage.lastMove=i,delete localStorage[t]},GameManager.prototype.prepareTiles=function(){this.grid.eachCell((function(e,t,i){i&&(i.mergedFrom=null,i.savePosition())}))},GameManager.prototype.moveTile=function(e,t){this.grid.cells[e.x][e.y]=null,this.grid.cells[t.x][t.y]=e,e.updatePosition(t)},GameManager.prototype.move=function(e){var t=this;if(!this.over&&!this.won){var i,r,a=this.getVector(e),o=this.buildTraversals(a),s=!1;this.prepareTiles(),o.x.forEach((function(e){o.y.forEach((function(o){if(i={x:e,y:o},r=t.grid.cellContent(i)){var n=t.findFarthestPosition(i,a),l=t.grid.cellContent(n.next);if(l&&l.value===r.value&&!l.mergedFrom){var h=new Tile(n.next,2*r.value);h.mergedFrom=[r,l],t.grid.insertTile(h),t.grid.removeTile(r),r.updatePosition(n.next),t.score+=h.value,9007199254740992===h.value&&(t.won=!0)}else t.moveTile(r,n.farthest);t.positionsEqual(i,r)||(s=!0)}}))})),s&&(this.addRandomTile(),this.movesAvailable()||(this.over=!0),this.actuate())}},GameManager.prototype.getVector=function(e){return{0:{x:0,y:-1},1:{x:1,y:0},2:{x:0,y:1},3:{x:-1,y:0}}[e]},GameManager.prototype.buildTraversals=function(e){for(var t={x:[],y:[]},i=0;i<this.size;i++)t.x.push(i),t.y.push(i);return 1===e.x&&(t.x=t.x.reverse()),1===e.y&&(t.y=t.y.reverse()),t},GameManager.prototype.findFarthestPosition=function(e,t){var i;do{e={x:(i=e).x+t.x,y:i.y+t.y}}while(this.grid.withinBounds(e)&&this.grid.cellAvailable(e));return{farthest:i,next:e}},GameManager.prototype.movesAvailable=function(){return this.grid.cellsAvailable()||this.tileMatchesAvailable()},GameManager.prototype.tileMatchesAvailable=function(){for(var e,t=0;t<this.size;t++)for(var i=0;i<this.size;i++)if(e=this.grid.cellContent({x:t,y:i}))for(var r=0;r<4;r++){var a=this.getVector(r),o={x:t+a.x,y:i+a.y},s=this.grid.cellContent(o);if(s&&s.value===e.value)return!0}return!1},GameManager.prototype.positionsEqual=function(e,t){return e.x===t.x&&e.y===t.y};