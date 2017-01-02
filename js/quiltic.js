// classes and functions for generating celtic knot/plait patterns using tiles.

var quiltic = {};

quiltic.sizeFactor = 20;
quiltic.strokeWidth = 3;

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
	poly += "' style='fill:black;stroke:black;stroke-width:" + quiltic.strokeWidth + "'/>";
	return poly;
};

quiltic.line = function(points) {
	var line = "<line " + points;
	line += " stroke-width='"+ quiltic.strokeWidth + "' stroke='black'/>";
	return line;	
};

