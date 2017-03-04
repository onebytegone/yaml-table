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
         sorting: [],
         include: {}
      }, options);

      options.columns = options.columns || {};
      columnKeys = _.union(_.keys(options.columns), this.findAllKeysUsed(rows));
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

      rows = this.sortRows(rows, options.sorting);

      nunjucks.configure(options.templateRoot, { autoescape: true });

      return nunjucks.render(options.template, {
         title: options.title,
         columns: columns,
         rows: rows,
         columnOrder: columnKeys,
         timestamp: moment().format('Y-MM-DD h:mma'),
         include: options.include
      });
   },

   findAllKeysUsed: function(objects) {
      return _.reduce(objects, function(memo, object) {
         return _.union(memo, _.keys(object));
      }, []);
   },

   generateRow: function(values, neededColumns, config) {
      var self = this;

      config = _.extend({
         columns: {}
      }, config || {});

      return {
         values: _.reduce(neededColumns, function(memo, key) {
            var columnConfig = config.columns[key] || {},
                source, value;

            if (columnConfig.type === 'composite' && columnConfig.format) {
               source = self.generateCompositeValue(values, columnConfig.format, neededColumns);
            } else {
               source = values[key] || '';
            }

            value = self.upgradeToValueObjectIfNeeded(source);
            value.hidden = columnConfig.hidden;

            memo[key] = value;

            return memo;
         }, {})
      };
   },

   upgradeToValueObjectIfNeeded: function(value) {
      if (_.isObject(value)) {
         return value;
      }

      return {
         value: value
      };
   },

   generateCompositeValue: function(data, format, allFields) {
      return _.template(format)(
         _.extend(
            _.object(allFields, _.map(allFields, function() {
               return '';
            })),
            data
         )
      );
   },

   sortRows: function(rows, fields) {
      return _.reduce(fields.reverse(), function(memo, field) {
         return _.sortBy(memo, function(row) {
            return (row.values[field] || {}).value;
         });
      }, rows);
   }

});
