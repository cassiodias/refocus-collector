/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * src/commands/refocus-collector-reregister.js
 *
 * Executes the "reregister" command.
 */
'use strict'; // eslint-disable-line strict
const program = require('commander');
const logger = require('winston');
const cmdUtils = require('./utils');
const doPost = require('../utils/httpUtils.js').doPost;

program
  .option('-n, --collectorName <collectorName>', 'The name of the ' +
    'collector to be started')
  .option('-u, --refocusUrl <refocusUrl>', 'The url of the refocus ' +
    'instance this collector will send to')
  .option('-t, --accessToken <accessToken>', 'A valid refocus token')
  .option('-r, --refocusProxy <refocusProxy>', 'Proxy to Refocus')
  .parse(process.argv);

if (!cmdUtils.validateArgs(program)) {
  process.exit(1);
}

const config = cmdUtils.setupConfig(program);
const cr = config.refocus;
const url = `${cr.url}/v1/collectors/${config.name}/reregister`;
logger.log('Reregister =>', config.name, url);

// Request to Refocus to re-register collector
doPost(url, cr.accessToken, cr.proxy)
.then(() => logger.info(`Collector ${config.name} has been reregistered. ` +
  'Use the command "refocus-collector start" or the /v1/collectors/start ' +
  'endpoint to start the collector'))
.catch((err) => {
  logger.error(err.message, err.explanation, err.response);
});
