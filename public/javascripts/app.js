var routesUrl = {'Chennai': "http://apify.heroku.com/api/chennai_bus_routes.json?callback=?"}
var city = 'Chennai';

var routes = [];
var stops = [];
var adjacencyGraph = {};
var sameStops = {};

$(function(){
  // Load routes
  $.getJSON(routesUrl[city], function(data){
    routes = JSON.parse(data);
    buildRoutesAndStops();
    buildAdjacencyGraph();
    bindControls();
  });

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
      var path = bfsShortestPath(from, to);
      return false;
    });
  }

  function buildRoutesAndStops(){
    $('.city').html(city);
    routes = _.map(routes, function(route){
      route.via = route.via.split(/,\s*/);
      return route;
    });
    stops = _.union(_.flatten(_.map(routes, function(route){
      return [].concat(route.start, route.end, route.via);
    })));
  }

  function buildAdjacencyGraph(){
    adjacencyGraph = {};
    sameStops = {};
    for(var i=0; i< routes.length; i++){
      var route = routes[i];
      var prevStop = route.start;
      addSameStop(prevStop, route.route);
      if(route.via.length > 0){
        for(var j=0; j < route.via.length; j++){
          var routeAndStop = [route.route, prevStop];
          if(typeof(adjacencyGraph[routeAndStop]) == 'undefined') adjacencyGraph[routeAndStop] = [];
          var nextStop = route.via[j];
          if(nextStop.length > 0){
            addSameStop(nextStop, route.route);
            var routeAndNextStop = [route.route, nextStop];
            adjacencyGraph[routeAndStop].push(routeAndNextStop);
            prevStop = nextStop;
          }
        }
      }
      if(route.end.length > 0){
        var routeAndStop = [route.route, prevStop];
        var routeAndNextStop = [route.route, route.end];
        addSameStop(route.end, route.route);
        if(typeof(adjacencyGraph[routeAndStop]) == 'undefined') adjacencyGraph[routeAndStop] = [];
        adjacencyGraph[routeAndStop].push(routeAndNextStop);
      }
    }
  }

  function addSameStop(stop, route){
    if(typeof(sameStops[stop]) == 'undefined') sameStops[stop] = [];
    sameStops[stop].push([route, stop]);
  }

  function bfsShortestPath(startStop, endStop){
    var startRouteStop = sameStops[startStop][0];
    var explored = [startRouteStop];
    var queue = [[startRouteStop]];
    var count = 0;
    while(queue.length > 0){
      count += 1;
      if(count > 10000)
        noRouteFound();
      var path = queue.shift();
      var node = path[path.length-1];
      if(node[1] == endStop){
        console.log(path);
        displayPath(path);
        return path;
      }
      var adjRouteStops = adjacencyGraph[node] || [];
      var adjRouteStops = adjRouteStops.concat(sameStops[node[1]]);
      for(var i=0; i<adjRouteStops.length; i++){
        adjacent = adjRouteStops[i];
        if(!_.include(explored, adjacent)){
          explored.push(adjacent);
          var new_path = path.slice(0);
          new_path.push(adjacent);
          queue.push(new_path);

        }
      }
    }
  }

  function displayPath(path){
    //temp fix for algo
    while(path[0] && path[1] && path[0][1] == path[1][1]){
      path.shift();
    }
    $('.route_table').show();
    $('.route_table .contents').html('');
    for (var i=0;i<path.length;i++){
      $('.route_table .contents').append('<tr><td>' + path[i][0]+ '</td><td>' + path[i][1] + '</td></tr>');
    }
  }

  function noRouteFound(){
    $('.route_table').show();
    $('.route_table .contents').html("<td colspan='2'>No Route Found</td>");
  }
});