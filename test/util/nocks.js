// Nocks (https://github.com/pgte/nock) for use in testing API

'use strict';

var nock = require('nock');

exports.nocks = {
  normal: function () {
    nock('https://recursos-data.buenosaires.gob.ar').get('/ckan2/ecobici/estado-ecobici.xml').reply(200, wrapXML('' +
      '<Estacion>' +
        '<EstacionNombre>Estación Obelisco</EstacionNombre>' +
        '<BicicletaDisponibles>2</BicicletaDisponibles>' +
        '<EstacionDisponible>SI</EstacionDisponible>' +
        '<Latitud>-34.603743</Latitud>' +
        '<Longitud>-58.381570</Longitud>' +
        '<AnclajesTotales>50</AnclajesTotales>' +
        '<AnclajesDisponibles>48</AnclajesDisponibles>' +
      '</Estacion>' +
      '<Estacion>' +
        '<EstacionNombre>Estación Plaza de Mayo</EstacionNombre>' +
        '<BicicletaDisponibles>14</BicicletaDisponibles>' +
        '<EstacionDisponible>SI</EstacionDisponible>' +
        '<Latitud>-34.608424</Latitud>' +
        '<Longitud>-58.371902</Longitud>' +
        '<AnclajesTotales>20</AnclajesTotales>' +
        '<AnclajesDisponibles>6</AnclajesDisponibles>' +
      '</Estacion>' +
      '<Estacion>' +
        '<EstacionNombre>Estación Parque Centenario [Inactive]</EstacionNombre>' +
        '<BicicletaDisponibles>40</BicicletaDisponibles>' +
        '<EstacionDisponible>NO</EstacionDisponible>' +
        '<Latitud>-34.606639</Latitud>' +
        '<Longitud>-58.435351</Longitud>' +
        '<AnclajesTotales>40</AnclajesTotales>' +
        '<AnclajesDisponibles>0</AnclajesDisponibles>' +
      '</Estacion>'
    ));
  },
  badData: function () {
    nock('https://recursos-data.buenosaires.gob.ar').get('/ckan2/ecobici/estado-ecobici.xml').reply(200, 'wrong data');
  },
  notFound: function () {
    nock('https://recursos-data.buenosaires.gob.ar').get('/ckan2/ecobici/estado-ecobici.xml').reply(404);
  }
};

function wrapXML(innerXML) {
  return '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><BicicletasWSResponse xmlns="http://tempuri.org/"><BicicletasWSResult><Bicicletas xmlns="http://bicis.buenosaires.gob.ar/ServiceBicycle.asmx"><Estaciones>' +
    innerXML +
    '</Estaciones><TiempoRespuesta>0,001 segundos</TiempoRespuesta></Bicicletas></BicicletasWSResult></BicicletasWSResponse></soap:Body></soap:Envelope>';
}
