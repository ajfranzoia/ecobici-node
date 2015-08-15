EcoBici Node API utility
==========

Node.js utility for [*EcoBici (Buenos Aires Public Bicycle Sharing System)*](http://www.buenosaires.gob.ar/ecobici) real time API data


## Initialization and utility methods

``` javascript
var ecobici = require('ecobici');

ecobici(function (err, dataObj) {
  if (err) { console.log("An error has occurred: " + err); return; }

  // dataObj is a newly created object used to query request result
  // raw fetched data accesible via dataObj.data, with the format below
  /* dataObj.data = [
      {
        EstacionNombre: 'Estación Obelisco', // Station name
        BicicletaDisponibles: 2, // Available bikes
        EstacionDisponible: 'SI', // Operational station ('SI') or not
        Latitud: '-34.603743', // Latitude
        Longitud: '-58.381570', // Longitued
        AnclajesTotales: 50, // Total docking places
        AnclajesDisponibles: 48, // Available docking places
      },
      ...
    ]
   */
});

```

#### dataObj.available()
Returns operational stations

#### dataObj.unavailable()
Returns non operational stations

#### dataObj.withMoreBikes(n)
Returns the n stations with more bikes. If n is omitted, returns one station

#### dataObj.withLessBikes(n)
Returns the n stations with less bikes. If n is omitted, returns one station

#### dataObj.withBikes()
Returns the stations with at least one available bike

#### dataObj.nearest(options, cb)
Returns the n closest stations to the specified location under options. This method is asyncronous.

#### dataObj.usageLevel()
Returns global average usage level


## API information

* [http://data.buenosaires.gob.ar/dataset/disponibilidad-bicicletas](http://data.buenosaires.gob.ar/dataset/disponibilidad-bicicletas)
