'use strict';

var _ = require('underscore'),
    Class = require('class.extend'),
    nunjucks = require('nunjucks'),
    moment = require('moment');

module.exports = Class.extend({

   generate: function(rows, options) {
      var self = this,
          columnKeys, columns;

      options = _.extend({
         templateRoot: './templates',
         template: 'basic-table.html',
      }, options);

      options.columns = options.columns || {};
      columnKeys = this.findAllKeysUsed(rows);
      columns = _.map(columnKeys, function(value) {
         return options.columns[value] || value;
      });
      columns = _.map(columns, this.upgradeToValueObjectIfNeeded);
      columns = _.object(columnKeys, columns);

      rows = _.map(rows, function(values) {
         return self.generateRow(values, columnKeys, {
            columns: columns
         });
      });

      nunjucks.configure(options.templateRoot, { autoescape: true });

      return nunjucks.render(options.template, {
         title: options.title,
         columns: _.map(columnKeys, function(key) {
            return columns[key];
         }),
         rows: rows,
         timestamp: moment().format('Y-MM-DD h:mma')
      });
   },

   findAllKeysUsed: function(objects) {
      return _.reduce(objects, function(memo, object) {
         return _.union(memo, _.keys(object));
      }, []);
   },

   generateRow: function(values, columnOrder, config) {
      var self = this;

      config = _.extend({
         columns: {}
      }, config || {});

      return {
         values: _.map(columnOrder, function(key) {
            var value = self.upgradeToValueObjectIfNeeded(values[key] || '');

            value.hidden = config.columns[key] ? config.columns[key].hidden : false;

            return value;
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
