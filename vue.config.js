'use strict';

const { version } = require('./package');
const secrets = require('./secrets');

module.exports = {
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0]['process.env'].PROPERTIES = `${JSON.stringify({
        version,
        secrets,
      })}`;
      return definitions;
    });
  },
};
