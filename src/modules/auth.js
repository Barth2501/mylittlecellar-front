import Vue from 'vue';
import axios from 'axios';
import router from '../router';

let authUrl = 'https://mylittlecellar-back.herokuappp.com/auth'
if (process.env.NODE_ENV === 'development') {
  authUrl = 'http://localhost:8000/auth'
}

const user = {
  authenticated: false,
  profile: undefined,
};

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('profile');
  localStorage.removeItem('current_cellar');
  axios.defaults.headers.common['Authorization'] = '';
  user.authenticated = false;
  user.profile = null;
  router.push('/').catch(err => {console.log(err)});
}


function checkAuth(jwt) {
  return new Promise(resolve => {
    if (jwt === undefined) {
      jwt = localStorage.getItem('access_token')
    }

    if (jwt !== null) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      axios
        .get('/me')
        .then(function(response) {
          user.authenticated = true
          Vue.set(user, 'profile', response.data)
          resolve()
        })
        .catch(function() {
          logout()
          resolve()
        })
    } else {
      resolve()
    }
  })
}

function login(
  email,
  password,
  remember,
) {
  return new Promise((resolve, reject) => {
    axios
      .post(authUrl + '/login', {
        email: email,
        password: password,
      })
      .then(response => {
        if (remember) {
          localStorage.setItem('access_token', response.data.access_token)
        }
        checkAuth(response.data.access_token).then(() => {
          resolve()
        })
      })
      .catch(error => {
        reject(error.response.data.msg)
      })
  })
}

function register(
  email,
  password,
  username,
  remember,
) {
  return new Promise((resolve, reject) => {
    axios
      .post(authUrl + '/register', {
        email: email,
        password: password,
        username: username,
      })
      .then(response => {
        if (remember) {
          localStorage.setItem('access_token', response.data.access_token)
        }
        checkAuth(response.data.access_token).then(() => {
          resolve()
        })
      })
      .catch(error => {
        reject(error.response.data.msg)
      })
  })
}

export default {
  user,
  login,
  checkAuth,
  logout,
  register,
}
