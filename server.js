require('babel-register');
require('babel-polyfill');
const {
  join
} = require('path');

//require('dotenv').config({ path: join(__dirname, `${process.argv[2]}`) })
require('dotenv').config();

const cluster = require('cluster');
const numCPUs = require('os').cpus().length || 1;
const port = process.env.PORT || 3000;
const app = require('./app');
const chalk = require('chalk');
const {
  log,
  info,
  error
} = require('./src/utils').logging;

// Graceful shutdown
process.on('SIGINT', () => {
  process.exit(1);
});

// uncaught promise rejection
process.on('unhandledRejection', (reason, p) =>
  error('Unhandled Rejection at: Promise ', p, reason)
);

// uncaught exception 
process.on('uncaughtException', (err, origin) => {
  error(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`);
});

let server = app.listen(port, () => {
  info(chalk.blue(' [ ✓ ] ') + `Application - Process ${process.pid} is listening to all incoming requests at: ${port} `);
});
