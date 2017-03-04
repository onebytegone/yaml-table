'use strict';

var _ = require('underscore'),
    Class = require('class.extend'),
    nunjucks = require('nunjucks'),
    moment = require('moment');

module.exports = Class.extend({

   generate: function(rows, options) {
      var self = this,
          headerKeys, header;

      options = _.extend({
         templateRoot: './templates',
         template: 'basic-table.html'
      }, options);

      headerKeys = this.findAllKeysUsed(rows);
      header = _.map(headerKeys, function(value) {
         return options.header[value] || value;
      });
      header = _.map(header, this.upgradeToValueObjectIfNeeded);

      rows = _.map(rows, function(values) {
         return self.generateRow(values, headerKeys);
      });

      nunjucks.configure(options.templateRoot, { autoescape: true });

      return nunjucks.render(options.template, {
         title: options.title,
         header: header,
         rows: rows,
         timestamp: moment().format('Y-MM-DD h:mma')
      });
   },

   findAllKeysUsed: function(objects) {
      return _.reduce(objects, function(memo, object) {
         return _.union(memo, _.keys(object));
      }, []);
   },

   generateRow: function(values, columnKeys) {
      var self = this;

      return {
         values: _.map(columnKeys, function(key) {
            return self.upgradeToValueObjectIfNeeded(values[key] || '');
         })
      };
   },

   upgradeToValueObjectIfNeeded: function(value) {
      if (_.isObject(value)) {
         return value;
      }

      return {
         value: value
      };
   }

});
