// Entry point for deployment platforms
// This file starts the server from the server directory

const path = require('path');
const { spawn } = require('child_process');

// Change to server directory and start the server
process.chdir(path.join(__dirname, 'server'));
require('./server/server.js');