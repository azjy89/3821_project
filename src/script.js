var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _dragElement;
document.onmousedown = OnMouseDown;
document.onmouseup = OnMouseUp;

function OnMouseDown(event){
  document.onmousemove = OnMouseMove;
    _startX = event.clientX;
  _startY = event.clientY;
  _offsetX = document.getElementById('graph').offsetLeft;
  _offsetY = document.getElementById('graph').offsetTop;
  _dragElement = document.getElementById('graph');

}

function OnMouseMove(event){
    _dragElement.style.left = (_offsetX + event.clientX - _startX) + 'px';
  _dragElement.style.top = (_offsetY + event.clientY - _startY) + 'px';
}

function OnMouseUp(event){
  document.onmousemove = null;
  _dragElement=null;
}

var svg = d3.select("svg");
width = svg.attr("width");
height = svg.attr("height");

var margin = { top: 20, right: 20, bottom: 20, left: 20 }; 
var boundaryWidth = width - margin.left - margin.right;
var boundaryHeight = height - margin.top - margin.bottom;

var nodes = [],
edges = [],
nodeId = 0;

var simulation = d3.forceSimulation(nodes)
.force("charge", d3.forceManyBody().strength(-2))
.force("center", d3.forceCenter(width / 2, height / 2))
.on("tick", ticked);

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function ticked() {
var u = svg.selectAll('.node')
    .data(nodes, function(d) { return d.id; });

var uEnter = u.enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

uEnter.append('circle')
    .attr('r', 30);

uEnter.append('text')
  .text(function(d) { return d.id; })
  .attr('x', -17.5)
  .attr('y', 3);

uEnter.merge(u)
  .attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

function addNodes() {
var count = parseInt(document.getElementById("node-count").value);
  for (var i = 0; i < count; i++) {
    nodes.push({
      id: "Node" + (++nodeId),
      x: Math.random() * 1000,
      y: Math.random() * 1000
    });
  }
  simulation.nodes(nodes);
  simulation.alphaTarget(0.3).restart();
}