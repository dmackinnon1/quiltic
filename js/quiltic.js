// classes and functions for generating celtic knot/plait patterns using tiles.

var quiltic = {};

quiltic.sizeFactor = 10;
quiltic.strokeWidth = 3;
quiltic.color = "grey";

quiltic.tile = function(t,l,b,r) {
	var img = "<svg align='center' width='" + (quiltic.sizeFactor*4) + "' height='" + (quiltic.sizeFactor*4) +"'>";
	//corners
	img += quiltic.poly([quiltic.point(0,0), quiltic.point(1,0), quiltic.point(0,1)]);
	img += quiltic.poly([quiltic.point(3,0), quiltic.point(4,0), quiltic.point(4,1)]);
	img += quiltic.poly([quiltic.point(0,3), quiltic.point(0,4), quiltic.point(1,4)]);
	img += quiltic.poly([quiltic.point(4,3), quiltic.point(3,4), quiltic.point(4,4)]);
	//center
	img += quiltic.poly([quiltic.point(1,2), quiltic.point(2,1), quiltic.point(3,2), quiltic.point(2,3)]);
	//open and closed paths
	if(l) {	
		img += quiltic.line(quiltic.lpoints(0,1,1,2));
	} else {
		img += quiltic.line(quiltic.lpoints(0,1,0,3));
	}
	if(t) {	
		img += quiltic.line(quiltic.lpoints(2,1,3,0));
	} else {
		img += quiltic.line(quiltic.lpoints(1,0,3,0));
	}
	if(r) {	
		img += quiltic.line(quiltic.lpoints(3,2,4,3));
	} else {
		img += quiltic.line(quiltic.lpoints(4,1,4,3));
	}
	if(b) {	
		img += quiltic.line(quiltic.lpoints(1,4,2,3));
	} else {
		img += quiltic.line(quiltic.lpoints(1,4,3,4));
	}
	img += "</svg>";
	return img;
};

//helpers for tile
quiltic.point = function(x, y) {
	return "" + (x*quiltic.sizeFactor) + "," + (y*quiltic.sizeFactor);
};

quiltic.lpoints = function(x1, y1, x2, y2) {
	var lp = " x1='" + (x1*quiltic.sizeFactor) + "' y1='" + (y1*quiltic.sizeFactor) + "'";
	lp += " x2='" + (x2*quiltic.sizeFactor) + "' y2='" + (y2*quiltic.sizeFactor) + "'";
	return lp;
};

quiltic.poly = function(list) {
	var poly = "<polygon points='";
	for (var i = 0; i < list.length; i ++){
		poly += list[i];
		poly += " ";
	}
	poly += "' style='fill:"+ quiltic.color +";stroke:" + quiltic.color + ";stroke-width:" + quiltic.strokeWidth + "'/>";
	return poly;
};

quiltic.line = function(points) {
	var line = "<line " + points;
	line += " stroke-width='"+ quiltic.strokeWidth + "' stroke='"+ quiltic.color +"'/>";
	return line;	
};

//abstract representation of the tile
class QuilticTile {
	constructor (board, rowNum, colNum) {
		this.rowNum = rowNum;
		this.colNum = colNum;		
		this.t = 1;
		this.r = 1;
		this.b = 1;
		this.l = 1;
		this.board = board;
		
	}
	
	neighbor(i,j) {
		if ((this.rowNum + i < this.board.rows)
			&&(this.rowNum + i >= 0)
			&&(this.colNum + j < this.board.cols)
			&&(this.colNum + j >= 0)){
			return this.board.tiles[this.rowNum + i][this.colNum + j];
		}
		return null;
	}

	rotate() {
		var temp = this.t;
		this.t = this.r;
		this.r = this.b;
		this.b = this.l;
		this.l = temp;
	}

	north(){
		return this.neighbor(-1,0);
	}
	
	south(){
		return this.neighbor(1,0);
	}
	
	east(){
		return this.neighbor(0,1);		
	}
	
	west(){
		return this.neighbor(0,-1);
	}


	neighbors() {
		var list = [];
		if(this.north() != null) list.push(this.north());
		if(this.south() != null) list.push(this.south());
		if(this.east() != null) list.push(this.east());
		if(this.west() != null) list.push(this.west());
		return list;
	} 

	enforceBorders() {
			if (this.north() == null) this.t = 0;
			if (this.south() == null) this.b = 0;
			if (this.west() == null) this.l = 0;
			if (this.east() == null) this.r = 0; 
	}		

	enforceNeighbors() {
		if (this.north() != null) {
			this.t = this.north().b;
		}
		if (this.south() != null) {
			this.b = this.south().t;
		}
		if (this.east() != null) {
			this.r = this.east().l;
		}
		if (this.west() != null) {
			this.l = this.west().r;
		}
	}

	updateNeighbors() {
		var ns = this.neighbors();
		for (var i = 0; i < ns.length; i++){
			ns[i].enforceNeighbors();
		}
	}
};

//a board is a rectangular arrangement of tiles - the board will enforce placement rules
class QuilticBoard {
	constructor (rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.tiles = [];
	}

	init() {
		for (var i = 0; i < this.rows; i ++) {
			var row = [];
			for (var j = 0; j < this.cols; j++) {
				row.push(new QuilticTile(this, i, j));
			}
			this.tiles.push(row);
		}
		for (var i = 0; i < this.rows; i ++) {
			for (var j = 0; j < this.cols; j++) {
				this.tiles[i][j].enforceBorders();
			}
		}
	}

};

//board instance
quiltic.board = new QuilticBoard(7,5);
quiltic.board.init();

//board display
function htmlTable(quilticBoard) {
	var html = "<table align='center'>";
	for (var i = 0; i < quilticBoard.rows; i++){
		html += "<tr>";
		for (var j = 0; j < quilticBoard.cols; j ++) {
			html += "<td><div id='cell" + i +""+ j +"' class='quilticCell' onclick='cellClick(event)'";
			html += " data-row='"+ i + "' data-col='" + j + "'>";
			var tile = quilticBoard.tiles[i][j];

			html +=  quiltic.tile(tile.t,tile.l,tile.b,tile.r);
			html += "</div></td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	return html;	
};

function cellClick(event) {
	var i = parseInt(event.currentTarget.getAttribute("data-row"));
	var j = parseInt(event.currentTarget.getAttribute("data-col"));
	//console.log("clicked cell: " + i + "," + j);	
	//console.log(event.target);
	quiltic.board.tiles[i][j].rotate();
	quiltic.board.tiles[i][j].enforceBorders();
	quiltic.board.tiles[i][j].updateNeighbors();
	quiltic.display = htmlTable(quiltic.board);
	$("#tileDisplay").html(quiltic.display);
};

quiltic.display = htmlTable(quiltic.board);



