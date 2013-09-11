/**
 * @author algrant / http://algrant.ca/
 * lifted generally from Graph Dracula: http://graphdracula.net
 * Only the data structure though.
 */

var SimpleGraph = function(){
	this.nodes = {}
	this.edges = []
}
SimpleGraph.prototype.addNode = function(id,node){
	if(this.nodes[id] === undefined){
 		this.nodes[id] = new SimpleGraph.Node(id,node);
	}
	return this.nodes[id];
}
SimpleGraph.prototype.addEdge = function(source, target, weight){
	var s = this.addNode(source);
	var t = this.addNode(target);
	var e = new SimpleGraph.Edge(s,t,weight)
	s.edges.push(e);
	this.edges.push(e);
	t.edges.push(e);
}

SimpleGraph.Node = function(id,node){
	node = node || {};
	node.id = id;
	node.edges = []
	return node;
}
SimpleGraph.Edge = function(source, target, weight){
	edge = {}
	edge.source = source;
	edge.target = target;
	edge.weight = weight;
	return edge;
}
