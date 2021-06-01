import debug from 'debug';
import {dbgerror} from './app.js'
import { port } from "./app.js";
import { server } from "./app.js";
import * as util  from 'util'

export function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
export function onError(error) {
  dbgerror(error);
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug(`Listening on ${bind}`);
}
// export function onError

export function handle404(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}
export function basicErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  // set locals only providing errors in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // lets render the error page
  res.status(err.status || 500);
  res.render("error");

  process.on('UncaughtException', function(err) { 
    console.error(`I've crashed help me!!! - ${(err.stack || err)}`);
  });
  process.on('UnhandledRejection', (reason, p) => {
    console.error(`UnhandledRejection at : ${util.inspect(p)} reason ${reason}`)
  })
}
