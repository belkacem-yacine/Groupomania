import { createStore } from 'vuex'

const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/auth/'
});

let user = localStorage.getItem('user');
if (!user) {
  user = {
      userId: -1,
      token:'',
  }
} else {
  try {
      user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token:'',
    };
  }

}

const store = createStore({
  state: {
    status: '',
    user: user,
    userInfos: {
      lastName:'',
      firstName:'',
      email:'',
      image_url:'', //a changer peut etre
      enabled:'',
    },
  },
  mutations: {
    SET_STATUS: function (state, status) {
      state.status = status;
    },
    LOG_USER: function (state, user) {
      instance.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    USER_INFOS: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    LOGOUT: function (state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    DESABLED: function(state) {
      state.user = {
        enabled: 0,
      }
    }
  },
  actions: { 
    login: ({commit}, userInfos) => {
      commit( 'SET_STATUS', 'loading')
      return new Promise((resolve, reject) =>{
        instance.post('/login', userInfos)
        .then(function(response) {
          commit( 'SET_STATUS', '');
          commit('LOG_USER', response.data);
          resolve(response); 
        })
        .catch(function(error) {
          commit( 'SET_STATUS', 'error_login');
          reject(error);
        });
      })  
    },
    signup: ({commit}, userInfos) => {
      commit( 'SET_STATUS', 'loading')
      return new Promise((resolve, reject) =>{
        commit;
        instance.post('/signup', userInfos)
        .then(function(response) {
          commit( 'SET_STATUS', 'created');
          resolve(response);
        })
        .catch(function(error) {
          commit( 'SET_STATUS', 'error_create');
          reject(error);
        });
      })  
    },
    getUserInfos: ({commit}, userId) => {
      instance.get('/' + userId )
        .then(function(response) {
          commit( 'USER_INFOS', response.data);
        })
        .catch(function() {
        });
    },
    modifyUserInfos: ({commit}, userId) => {
      instance.put('/' + userId)
        .then(function(response) {
          commit('USER_INFOS', response.data)
        })
        .catch(function() {
        });
    },
    desabledUser: ({commit}, userId) => {
      instance.delete('/' + userId)
      .then(function(response) {
        commit('USER_INFOS', response.data)
      })
      .catch(function() {
      });
    }
  },
  modules: {
  }
})

export default store;
