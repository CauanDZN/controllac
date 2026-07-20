const nodeCrypto = require('crypto');

module.exports = {
  randomUUID: () => nodeCrypto.randomUUID(),
};
