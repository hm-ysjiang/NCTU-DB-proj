const crypto = require('crypto')

hash = crypto.createHash('sha256').update('admin').digest('hex')
console.log(hash)
console.log(hash.length)