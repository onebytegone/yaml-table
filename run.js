#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    yaml = require('js-yaml'),
    program = require('commander'),
    App = require('./src/index'),
    app, doc, output;

program
   .option('-o, --output <filepath>', 'The output filepath. If not present, output is saved to "generated.html"', 'generated.html')
   .option('-i, --input <filepath>', 'The source yaml file', 'demo.yml')
   .parse(process.argv);

app = new App();

try {
   doc = yaml.safeLoad(fs.readFileSync(program.input, 'utf8'));  // eslint-disable-line no-sync

   output = app.generate(
      doc.rows,
      {
         title: doc.title,
         columns: doc.columns,
         sorting: doc.sorting
      }
   );

   fs.writeFileSync(program.output, output);  // eslint-disable-line no-sync
} catch(e) {
   console.log(e);  // eslint-disable-line no-console
}
