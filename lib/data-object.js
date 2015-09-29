'use strict';

var _ = require('lodash');

module.exports = DataObject;

// Constructor
function DataObject(data) {
  // Store data and date
  this.data = data;
  this.fetched = new Date;
};

// Return operational stations
DataObject.prototype.available = function() {
  return  _.filter(this.data, function(item) {
    return item.EstacionDisponible === 'SI';
  });
},

// Return non operational stations
DataObject.prototype.unavailable = function() {
  return  _.filter(this.data, function(item) {
    return item.EstacionDisponible !== 'SI';
  });
},

// Return the n stations with more available bikes
DataObject.prototype.withMoreBikes = function(n) {
  var sorted = _.sortByOrder(this.available(), ['BicicletaDisponibles', 'AnclajesTotales', 'EstacionNombre'], ['desc', 'desc', 'asc']);
  return _.take(sorted, n || 1);
},

// Return the n stations with least available bikes
DataObject.prototype.withLessBikes = function(n) {
  var sorted = _.sortByOrder(this.available(), ['BicicletaDisponibles', 'AnclajesTotales', 'EstacionNombre'], ['asc', 'desc', 'asc']);
  return _.take(sorted, n || 1);
},

// Return stations with at least one bike
DataObject.prototype.withBikes = function() {
  return  _.filter(this.available(), function(item) {
    return item.BicicletaDisponibles > 0;
  });
},

// Return nearest stations
DataObject.prototype.nearest = function(options, cb) {
  var geocoder = require('node-geocoder')('google', 'http'),
      geolib = require('geolib');

  if (typeof options == 'string') {
    options = {
      location: options
    };
  }

  if (!options.n) {
    options.n = 1;
  }

  geocoder.geocode(options.location, function(err, res) {
    if (err) {
      cb(err);
    }

    if (!res.length) {
      cb('Location not found');
    }

    // Sort by geodistance
    var sorted = _.sortBy(options.withBikes ? this.withBikes() : this.available(), function(station) {
      var from = _.pick(res[0], ['latitude', 'longitude']);
      var to = {
        latitude: station.Latitud,
        longitude: station.Longitud
      };

      return geolib.getDistance(from, to);
    });

    // Call cb with first n stations
    cb(null, sorted.slice(0, options.n));

  }.bind(this));
},

// Return global average usage level
DataObject.prototype.usageLevel = function() {
  var available = this.available();

  var availability = _.sum(available, function(item) {
    return item.BicicletaDisponibles * 1.0 / item.AnclajesTotales;
  }) / available.length;

  return 1 - availability;

};
