var routesUrl = "http://localhost:9393/api/chennai_bus_routes.json?callback=?"
var city = 'Chennai';
var routes = [];
var stops = [];
var adjacencyGraph = {};

$(function(){
  // Load routes
  $.getJSON(routesUrl, function(data){
    routes = JSON.parse(data);
    stops = _.sortBy(_.union(_.flatten(_.map(routes, function(route){return [].concat(route.start, route.end, route.via)}))), function(stop){return stop});
    adjacencyGraph = buildAdjacencyGraph(stops, routes);
    bindControls();
  });

  function buildAdjacencyGraph(stops, routes){

  }

  function bindControls(){
    $('#from').typeahead({
      source: stops
    });
    $('#to').typeahead({
      source: stops
    });
    $('#find-route').click(function(){
      var from = $('#from').val();
      var to = $('#to').val();
      var path = findPath(from, to, adjacencyGraph);
      return false;
    });
  }

  function findPath(from, to, routes){
    console.log("TODO: Find route " + from + " => " + to);
  }
});