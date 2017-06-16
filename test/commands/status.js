/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/commands/status.js
 */
'use strict';
const expectedResult = {
  collectorName1: {
    url: 'http://www.xyz.com',
    token: 'ewuifiekhfewfhsfhshjfjhfgewuih',
  },
};
const config = require('../../src/config/config');
const constants = require('../../src/constants');
const expect = require('chai').expect;
const fs = require('fs');
const jsonPath = './registry.json';

describe('test/commands/status >', () => {
  before(() => {
    fs.writeFile(jsonPath, JSON.stringify(expectedResult), 'utf8', (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  after(() => {
    fs.unlinkSync(jsonPath);
  });

  it('logs the expected result', (done) => {
    const { exec } = require('child_process');
    exec('refocus-collector status --name=PRD_Collector_12345', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        done(err);
      }

      expect(stdout).to.contain('Status => PRD_Collector_12345');
      done();
    });
  });
});