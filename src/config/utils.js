/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * ./src/config/utils.js
 *
 * Configuration Initialization
 */
const debug = require('debug')('refocus-collector:config');
const common = require('../utils/commonUtils');
const errors = require('./errors');
const fs = require('fs');
const validator = require('validator');
const registryFileUtils = require('../utils/registryFileUtils');

/**
 * Validate the registry.
 *
 * @throws {ValidationError} - If registry entry missing "url" or "token"
 *  attribute
 */
function validateRegistry(reg) {
  if (!reg || Array.isArray(reg) || typeof reg !== 'object') {
    throw new errors.ValidationError('Registry must be an object.');
  }

  const refocusInsts = reg.refocusInstances;
  for (const r in refocusInsts) {
    if (!refocusInsts[r].hasOwnProperty('url') ||
     !refocusInsts[r].hasOwnProperty('token')) {
      const msg = `Registry entry "${r}" missing required "url" and/or ` +
        '"token" attribute.';
      debug(msg);
      throw new errors.ValidationError(msg);
    }

    if ((typeof refocusInsts[r].token !== 'string' || !refocusInsts[r].token)) {
      const msg = `Registry entry "${r}" token must be a non empty string `;
      debug(msg);
      throw new errors.ValidationError(msg);
    }

    if (typeof refocusInsts[r].url !== 'string' ||
     !validator.isURL(refocusInsts[r].url)) {
      const msg = `Registry entry "${r}" url must be a string and must be a ` +
      'valid url';
      debug(msg);
      throw new errors.ValidationError(msg);
    }
  }
} // validateRegistry

/**
 * Initialize the config object. If the "reg" argument is an object, it is
 * assigned as the config registry. If the "reg" argument is a string, treat
 * it is a file location and try to assign the file contents as the config
 * registry.
 *
 * @param {String|Object} reg - Registry object or location of registry file
 * @returns {Object} - Config object
 * @throws {ValidationError} - If registry is invalid.
 * @throws {ResourceNotFoundError} - Thrown by common.readFileSynchr
 */
function init(reg) {
  const conf = {
    collectorConfig: {
      heartbeatInterval: 15000, // TODO remove me once it's coming from refocus
      maxSamplesPerBulkRequest: 100, // TODO remove me once it's coming from refocus
      // TODO remove me once it's coming from refocus
      sampleUpsertQueueTime: 5000, // in milliseconds
    },
    generators: {},
    registry: {},
  };

  let r;
  if (typeof reg === 'object') {
    r = reg;
  } else if (typeof reg === 'string') {
    // Get file contents synchronously.
    debug('Reading from file %s', reg);
    let fileContents;
    try {
      fileContents = common.readFileSynchr(reg);
    } catch (err) {
      registryFileUtils.createRegistryFile(reg);
    }

    if (fileContents) {
      r = JSON.parse(fileContents);
      validateRegistry(r);
    }
  }

  conf.registry = r;
  debug('Initialized config: %s', JSON.stringify(conf));
  return conf;
} // init

module.exports = {
  init,
  validateRegistry, // export for testing only
};
