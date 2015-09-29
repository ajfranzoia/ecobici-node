 /*exported assert, sinon */
 /*global describe, it */

'use strict';

var assert = require('assert');
var nocks = require('./util/nocks').nocks;
var should = require('chai').should();
var sinon = require('sinon');
var _ = require('lodash');
var ecobici = require('../lib/ecobici');

describe('Data object', function(){

  describe('::fetch', function(){

    it ('should parse XML properly', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        should.exist(dataObj.data);
        dataObj.data.should.deep.equal([
          {
            EstacionNombre: 'Estación Obelisco',
            BicicletaDisponibles: 2,
            EstacionDisponible: 'SI',
            Latitud: '-34.603743',
            Longitud: '-58.381570',
            AnclajesTotales: 50,
            AnclajesDisponibles: 48,
          },
          {
            EstacionNombre: 'Estación Plaza de Mayo',
            BicicletaDisponibles: 14,
            EstacionDisponible: 'SI',
            Latitud: '-34.608424',
            Longitud: '-58.371902',
            AnclajesTotales: 20,
            AnclajesDisponibles: 6,
          },
          {
            EstacionNombre: 'Estación Parque Centenario [Inactive]',
            BicicletaDisponibles: 40,
            EstacionDisponible: 'NO',
            Latitud: '-34.606639',
            Longitud: '-58.435351',
            AnclajesTotales: 40,
            AnclajesDisponibles: 0,
          }
        ]);
        done();
      });
    });

    it ('should return available stations', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        _.pluck(dataObj.available(), 'EstacionNombre').should.deep.equal(['Estación Obelisco', 'Estación Plaza de Mayo']);
        done();
      });
    });

    it ('should return unavailable stations', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        _.pluck(dataObj.unavailable(), 'EstacionNombre').should.deep.equal(['Estación Parque Centenario [Inactive]']);
        done();
      });
    });

    it ('should return stations with more bikes', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        _.pluck(dataObj.withMoreBikes(), 'EstacionNombre').should.deep.equal(['Estación Plaza de Mayo']);
        _.pluck(dataObj.withMoreBikes(2), 'EstacionNombre').should.deep.equal(['Estación Plaza de Mayo', 'Estación Obelisco']);
        done();
      });
    });

    it ('should return stations with more bikes', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        _.pluck(dataObj.withLessBikes(), 'EstacionNombre').should.deep.equal(['Estación Obelisco']);
        _.pluck(dataObj.withLessBikes(2), 'EstacionNombre').should.deep.equal(['Estación Obelisco', 'Estación Plaza de Mayo']);
        done();
      });
    });

    it ('should return stations with at least one bike', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        _.pluck(dataObj.withBikes(), 'EstacionNombre').should.deep.equal(['Estación Obelisco', 'Estación Plaza de Mayo']);
        done();
      });
    });

    it ('should calculate usage level', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        var usage = ((48 * 1.0 / 50) + (6 * 1.0 / 20)) / 2;
        dataObj.usageLevel().should.equal(usage);
        done();
      });
    });

    it ('should find nearest usage level', function (done) {
      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        var usage = ((48 * 1.0 / 50) + (6 * 1.0 / 20)) / 2;
        dataObj.usageLevel().should.equal(usage);
        done();
      });
    });


    it ('should find nearest station with bikes', function (done) {
      // Increase timeout
      this.timeout(10000);

      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        dataObj.nearest('Balcarce 650, Buenos Aires', function(err, stations) {
          if (err) throw err;

        _.pluck(stations, 'EstacionNombre').should.deep.equal(['Estación Plaza de Mayo']);
          done();
        });
      });
    });

    it ('should find nearest station with bikes excluding inactive ones', function (done) {
      // Increase timeout
      this.timeout(10000);

      // Prepare nocks
      nocks.normal();

      // Execute
      ecobici(function (err, dataObj) {
        if (err) throw err;

        dataObj.nearest('Warnes y Juan B Justo, Buenos Aires', function(err, stations) {
          if (err) throw err;

        _.pluck(stations, 'EstacionNombre').should.deep.equal(['Estación Obelisco']);
          done();
        });
      });
    });

    it('should handle bad xml response', function(done) {
      // Prepare nocks
      nocks.badData();

      // Execute
      ecobici(function(err, data) {
        should.exist(err);
        err.should.equal('Parse XML error');
        should.not.exist(data);
        done();
      });
    });

    it('should handle 404', function(done) {
      // Prepare nocks
      nocks.notFound();

      // Execute
      ecobici(function(err, data) {
        should.exist(err);
        err.should.equal('Fetch error');
        should.not.exist(data);
        done();
      });
    });

  });

});
