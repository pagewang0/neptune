const axiosist = require('axiosist');

const app = require('../app');

const server = app.listen();

const request = axiosist(server);

exports.request = request;

exports.serverClose = () => server.close();

let getToken = null; // this is hell in parallel mode

request.interceptors.request.use((opts) => {
  if (getToken) {
    opts.headers.authsessiontoken = getToken();
  }

  return opts;
});

exports.requestAddToken = (cb) => {
  getToken = cb;
};

// process.on('warning', (e) => console.warn(e.stack));
