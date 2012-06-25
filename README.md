# Public Transit

Public Transit is an easy to bootstrap transit app for finding bus / train routes in any city.

It is built using:

* Wikipedia - List of bus / train routes (See [Example](http://en.wikipedia.org/wiki/List_of_MTC_Chennai_bus_routes))
* [APIfy](http://apify.heroku.com/about) - A backend service for scraping HTML pages and converting it to JSON API
* Twitter Bootstrap
* HTML + Javascript

## How to Add Bus/Train routes for my City

1. Find List of bus routes in your city using Wikipedia or any site
2. Use [APIfy](http://apify.heroku.com/resources/new) to Create Bus/Train Routes API with following attributes:
  * route: Route code
  * start: Starting Stop/Station in Route
  * end: Ending Stop/Station in Route
  * via: Comma separated list of Intermediate Stops/Stations
3. Fork this Repo and change City name and Routes API JSON URL
4. Deploy in Heroku to use Transit App from your Mobile / Tablet / Laptop