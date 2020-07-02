import dotenv from "dotenv"
import db from "../api/Model/mongodb.ts"

dotenv.config()

let app = require('./server').default;
const port = process.env.PORT

const server = app

let currentApp = app;

server.listen(port, error => {
  if (error) {
    console.log(error);
  }

  console.log(`🚀 started at port ${ port } | (${ new Date().toLocaleString() })`);

  db.on("error", err => {
	console.log(`Mongodb connection has error: ${err}`)
});
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
