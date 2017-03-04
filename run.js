#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    yaml = require('js-yaml'),
    App = require('./src/index'),
    app, doc, output;

app = new App();

try {
   doc = yaml.safeLoad(fs.readFileSync('demo.yml', 'utf8'));  // eslint-disable-line no-sync

   output = app.generate(
      doc.rows,
      {
         title: doc.title,
         header: doc.header,
      }
   );

   console.log(output);  // eslint-disable-line no-console
} catch(e) {
   console.log(e);  // eslint-disable-line no-console
}
