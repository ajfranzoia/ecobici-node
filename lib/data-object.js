var _ = require('lodash');

module.exports = function (data) {

  // Store data and date
  this.data = data;
  this.fetched = new Date;

  // Return operational stations
  this.available = function() {
    return  _.filter(this.data, function(item) {
      return item.EstacionDisponible === 'SI';
    });
  },

  // Return non operational stations
  this.unavailable = function() {
    return  _.filter(this.data, function(item) {
      return item.EstacionDisponible !== 'SI';
    });
  },

  // Return the n stations with more available bikes
  this.withMoreBikes = function(n) {
    var sorted = _.sortByOrder(this.available(), ['BicicletaDisponibles', 'AnclajesTotales', 'EstacionNombre'], ['desc', 'desc', 'asc']);
    return _.take(sorted, n || 1);
  },

  // Return the n stations with least available bikes
  this.withLessBikes = function(n) {
    var sorted = _.sortByOrder(this.available(), ['BicicletaDisponibles', 'AnclajesTotales', 'EstacionNombre'], ['asc', 'desc', 'asc']);
    return _.take(sorted, n || 1);
  },

  // Return stations with at least one bike
  this.withBikes = function() {
    return  _.filter(this.available(), function(item) {
      return item.BicicletaDisponibles > 0;
    });
  },

  // Return
  this.nearest = function(options, cb) {
    var geocoder = require('node-geocoder')('google', 'http'),
        geolib = require('geolib');

    if (typeof options == 'string') {
      options = {
        location: options
      }
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
  this.usageLevel = function() {
    var available = this.available();

    var availability = _.sum(available, function(item) {
      return item.BicicletaDisponibles * 1.0 / item.AnclajesTotales
    }) / available.length;

    return 1 - availability;
  }

};
