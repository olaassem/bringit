'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://olaassem:11natel7abl77@ds115411.mlab.com:15411/wrkoutapp"
// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-wrkoutapp';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || "secret";