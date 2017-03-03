'use strict';

var expect = require('expect.js'),
    Target = require('../src/index.js');

describe('Controller', function() {

   it('is a class object', function() {
      expect(Target).to.be.a('function');
      expect(new Target()).to.be.an('object');
   });

});
