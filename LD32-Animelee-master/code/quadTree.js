//takes object with:
//lines, base coord, limit coord
//generates a quad tree.

//node format:
//{
//    leaf: bool,
//    lines: line[] (if leaf),
//    children: node[4]
//}
//
// eg.
//
// |-------|-------|
// |-|-|-|-|       |
// |---|---|       |
// |   |-|-|       |
// |---------------|
// |-|-|   |-|-|   |
// |---|---|---|---|
// |   |   |-|-|   |
// |---------------|

window.QuadTree = function(col, allowance) {
	var t = this;
	t.col = col;
	t.tree = generateNode(col.lines, col.base, col.limit, 0);
	t.getLines = getLines;

	function generateNode(subset, start, end, depth) {
		//go through all lines in subset
		//see if they intersect a circle with the allowance+diagonal size as its radius.
		//if they do, include them.
		//if there are more than a threshold, make this a non-leaf
		//however if the new diagonal size is too small, just force it as a leaf

		var newSet = [];

		var pos = [(start[0]+end[0])/2, (start[1]+end[1])/2];
		var diagSize = [end[0]-start[0], end[1]-start[1]];
		var diag = Math.sqrt(diagSize[0]*diagSize[0]+diagSize[1]*diagSize[1])/2;

		for (var i=0; i<subset.length; i++) {
			//line: p1, p2, normal
			var l = subset[i];

			var vert = vec2.sub([], pos, l.p1);
			var v2 = vec2.sub([], pos, l.p2);
			var dir = vec2.sub([], l.p1, l.p2);
			var scale = 1/(diag+allowance);
			vec2.scale(vert, vert, scale);
			vec2.scale(v2, v2, scale);
			vec2.scale(dir, dir, scale);

			if ( (vert[0]*vert[0]+vert[1]*vert[1] < 1) 
			  || (v2[0]*v2[0]+v2[1]*v2[1] < 1) 
			  || RootExistsCircle(vec2.dot(dir, dir), 2*vec2.dot(dir, vert), vec2.dot(vert, vert)-1)) {
				//we made it! i'd like to thank my family and friends
				newSet.push(l);
			}
		}

		if (newSet.length < 4 || (allowance/4 > diag)) {
			//leaf
			return {
				leaf: true,
				lines: newSet
			}
		} else {
			return {
				leaf: false,
				children: [
					generateNode(newSet, start, [end[0]-diagSize[0]/2, end[1]-diagSize[1]/2], depth+1),
					generateNode(newSet, [start[0]+diagSize[0]/2, start[1]], [end[0], end[1]-diagSize[1]/2], depth+1),
					generateNode(newSet, [start[0], start[1]+diagSize[1]/2], [end[0]-diagSize[0]/2, end[1]], depth+1),
					generateNode(newSet, [start[0]+diagSize[0]/2, start[1]+diagSize[1]/2], end, depth+1)
				]
			}
		}
	}

	function getLines(pos) {
		return getLinesRecursive(pos, [t.col.base[0], t.col.base[1]], [t.col.limit[0], t.col.limit[1]], t.tree);
	}

	function getLinesRecursive(pos, start, end, node) {
		if (node.leaf) return node.lines;
		var xmid = (start[0]+end[0])/2;
		var ymid = (start[1]+end[1])/2;

		var xpart = ((pos[0]>xmid)?1:0);
		var ypart = ((pos[1]>ymid)?2:0);

		if (xpart) start[0] = xmid;
		else end[0] = xmid;

		if (ypart) start[1] = ymid;
		else end[1] = ymid;

		return getLinesRecursive(pos, start, end, node.children[xpart+ypart]);
	}

	function RootExistsCircle(a, b, c) {
		var det = (b*b) - 4*(a*c);
		if (det<0) return false; //no result :'(
		else {
			det = Math.sqrt(det);
			var root1 = ((-b)-det)/(2*a)
			var root2 = ((-b)+det)/(2*a)

			if (root1 >= 0 && root1 <= 1) {
				return true;
			} else if (root2 >= 0 && root2 <= 1) {
				return true;
			} else return false;
		}
	}
}
