import axios from "axios";

import config from '../config';

const request = axios.create({
  baseURL: config.host,
  withCredentials: true,
  timeout: 15000,
});

export default request;