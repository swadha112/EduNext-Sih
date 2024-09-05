const crypto = require('crypto');

// Generate 32 random bytes (256 bits) for a secret key
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('Generated Secret Key:', secretKey);