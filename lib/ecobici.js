'use strict';

var request = require('request');
var xml2js = require('xml2js');
var dataObject = require('./data-object');

// API url
var apiUrl = 'https://recursos-data.buenosaires.gob.ar/ckan2/ecobici/estado-ecobici.xml';

// API entry point
module.exports = function fetch(cb) {
  // Fetch data and create data object on callback
  fetchData(function(err, data) {
    if (err) { cb(err); return; }
    cb(null, new dataObject(data));
  });
};

// Function that fetches xml data
function fetchData(cb) {
  request(apiUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseXML(body, cb);
    } else {
      cb('Fetch error');
    }
  });
}

// Function that transforms received xml into json
function parseXML(xmlString, cb) {
  var data;

  try {
    xml2js.parseString(xmlString, {explicitRoot: false, explicitArray: false}, function (err, result) {
      if (err) throw err;

      data = result['soap:Body'].BicicletasWSResponse.BicicletasWSResult.Bicicletas.Estaciones.Estacion;
      data.forEach(function(item) {
        item.BicicletaDisponibles = parseInt(item.BicicletaDisponibles);
        item.AnclajesTotales = parseInt(item.AnclajesTotales);
        item.AnclajesDisponibles = parseInt(item.AnclajesDisponibles);
      });
    });
  } catch (e) {
    return cb('Parse XML error');
  }

  cb(null, data);
}
