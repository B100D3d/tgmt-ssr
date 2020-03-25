import https from 'https';
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

const sslDir = "/etc/ssl";

dotenv.config()

let app = require('./server').default;
const port = process.env.PORT

const server = +process.env.HTTPS
	  ? https.createServer({
		    cert: fs.readFileSync(path.join(sslDir, "tgmt.crt")),
        key: fs.readFileSync(path.join(sslDir, "tgmt.key"))
	  }, app)
	  : app

let currentApp = app;

server.listen(port, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
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
