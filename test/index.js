var assert = require('assert');
const path = require('path');
describe('Array', function() {
  const config = require(path.resolve(__dirname, '../webpack.config'));
  it('path', function() {
    assert.equal(config.entry.index, '/Users/langpengshuai/Desktop/webpack-builder/src/index/index.js');
    assert.equal(config.entry.search, '/Users/langpengshuai/Desktop/webpack-builder/src/search/index.js')
  });
});