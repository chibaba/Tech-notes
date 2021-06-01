import { default as express } from "express";
import { default as hbs } from "hbs";
import { InMemoryNotesStore } from "./models/notes-memory.js";
export const NotesStore = new InMemoryNotesStore();
import { default as rfs }  from 'rotating-file-stream'; 
import { default as DBG } from 'debug'
import * as path from "path";
// import * as favicon from 'serve-favicon';
import { default as logger } from "morgan";
import { default as cookieParser } from "cookie-parser";
import { default as bodyParser } from "body-parser";
import * as http from "http";
import { approotdir } from "./approotdir.js";
const __dirname = approotdir;
import {
  normalizePort,
  onError,
  onListening,
  handle404,
  basicErrorHandler,
} from "./appsupport.js";
import { router as indexRouter } from "./routes/index.js";
import { router as notesRouter } from "./routes/notes.js";
export const app = express();

const debug = DBG('notes: debug');
export const dbgerror = DBG('notes: error')
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "partials"));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(process.env.REQUEST_LOG_FORMAT ||  'dev', {
  stream: process.env.REQUEST_LOG_FILE  ?
  rfs.createStream(process.env.REQUEST_LOG_FILE, {
    size: "10M",
    interval: '1d',
    compress: 'gzip'
  })
  : process.stdout

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/assets/vendor/bootstrap",
  express.static(path.join(__dirname, "node_modules", "bootstrap", "dist"))
);
app.use(
  "/assets/vendor/jquery",
  express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);
app.use(
  "/assets/vendor/popper.js",
  express.static(
    path.join(__dirname, "node_modules", "popper.js", "dist", "umd")
  )
);
// Router function lists
app.use("/", indexRouter);
app.use("/notes", notesRouter);
// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);
export const port = normalizePort(process.env.PORT || "3002");
app.set("port", port);
export const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

server.on('request', (req, res) => {
  debug(`${new Date ().toISOString()} request ${req.method}
  ${req.url}`)
})
