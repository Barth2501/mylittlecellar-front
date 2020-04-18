import Vue from 'vue'
import axios from 'axios'


if (process.env.NODE_ENV === 'development') {
  if (process.env.VUE_APP_USE_NGROK === 'true') {
    axios.defaults.baseURL = process.env.VUE_APP_NGROK_WEB + '/api/v1'
  } else {
    axios.defaults.baseURL = 'http://localhost:8000/api/v1'
  }
} else {
  axios.defaults.baseURL = 'http://mylittlecellar-back.herokuapp.com:9559/api/v1'
}

Vue.prototype.$http = axios