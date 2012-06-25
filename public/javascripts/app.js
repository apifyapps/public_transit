var routesUrl = {'Chennai': "http://localhost:9393/api/chennai_bus_routes.json?callback=?"}
var city = 'Chennai';
var routes = [];
var stops = [];
var adjacencyGraph = {};
var sameStops = {};

$(function(){
  // Load routes
  $.getJSON(routesUrl[city], function(data){
    routes = JSON.parse(data);
    stops = _.sortBy(_.union(_.flatten(_.map(routes, function(route){return [].concat(route.start, route.end, route.via)}))), function(stop){return stop});
    buildAdjacencyGraph(stops, routes);
    bindControls();
  });

  function buildAdjacencyGraph(stops, routes){
    adjacencyGraph = {};
    sameStops = {};
    for(var i=0; i< routes.length; i++){
      var route = routes[i];
      var prevStop = route.start;
      addSameStop(prevStop, route.route);
      if(route.via.length > 0){
        for(var j=0; j < route.via.length; j++){
          var routeAndStop = route.route + "|" + prevStop;
          if(typeof(adjacencyGraph[routeAndStop]) == 'undefined') adjacencyGraph[routeAndStop] = [];
          var nextStop = route.via[j];
          addSameStop(nextStop, route.route);
          var routeAndNextStop = route.route + "|" + nextStop;
          adjacencyGraph[routeAndStop].push(routeAndNextStop);
          prevStop = nextStop;
        }
      }
      if(route.end.length > 0){
        var routeAndStop = route.route + "|" + prevStop;
        var routeAndNextStop = route.route + "|" + route.end;
        addSameStop(route.end, route.route);
        if(typeof(adjacencyGraph[routeAndStop]) == 'undefined') adjacencyGraph[routeAndStop] = [];
        adjacencyGraph[routeAndStop].push(routeAndNextStop);
      }
    }
  }

  function addSameStop(stop, route){
    if(typeof(sameStops[stop]) == 'undefined') sameStops[stop] = [];
    sameStops[stop].push(route + "|" + stop);
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