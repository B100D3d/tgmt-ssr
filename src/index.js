import https from 'https';
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import mongoose from "mongoose"

const sslDir = "/etc/ssl";

dotenv.config()

let app = require('./server').default;
const port = process.env.PORT

const servUrl = process.env.SERV_URL;
const localUrl = process.env.LOCAL_URL;

mongoose.connect(servUrl, { 
	autoIndex: false, 					  
	useNewUrlParser: true, 		
	useUnifiedTopology: true,				
	useFindAndModify: false 
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

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
