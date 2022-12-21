const path = require('path');

module.exports = {
    entry: './build/index.js',
    mode: 'development',
    output: {
	filename: 'app.js',
	path: path.resolve(__dirname, '../public/'),
    },
    cache: {
	type: 'filesystem',
	allowCollectingMemory: true,
    },

};
