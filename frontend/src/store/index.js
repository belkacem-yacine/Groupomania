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
    user: user,
    userInfos: {

    },
  },
  mutations: {
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
    MODIFY_USER_INFOS: function (state) {
      state.userInfos = {
        ...state.userInfos,
        lastName: '',
        firstName: '',
        profil_image: '',
      }
    },
    DESABLED: function(state) {
      state.userInfos = {
        ...state.userInfos,
        enabled: 0,
      }
    }
  },
  actions: { 
    login: ({commit}, userInfos) => {
      return new Promise((resolve, reject) =>{
        instance.post('/login', userInfos)
        .then(function(response) {
          commit('LOG_USER', response.data);
          resolve(response); 
        })
        .catch(function(error) {
          reject(error);
        });
      })  
    },
    signup: ({commit}, userInfos) => {
      console.log(userInfos)
      return new Promise((resolve, reject) =>{
        commit;
        instance.post('/signup', userInfos)
        .then(function(response) {
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
        });
      })  
    },
    getUserInfos: ({commit}, userId) => {
      instance.get('/' + userId )
        .then(function(response) {
          commit('USER_INFOS', response.data);
        })
        .catch(function() {
        });
    },
    modifyUserInfos: ({commit}, user) => {
      instance.put('/modifyUser/' + user.userId, user.userAllInfos)
        .then(function(response) {
          commit('MODIFY_USER_INFOS', response.data)
        })
        .catch(function() {
        });
    },
    desabledUser: ({commit}, userId) => {
      instance.put('/deleteUser/' + userId)
      .then(function(response) {
        commit('DESABLED', response.data)
      })
      .catch(function() {
      });
    },
    createPost: ({commit}, postInfos) => {
      instance.post('/createPost/'+ postInfos)
      .then(function(response) {
        commit(response.data)
      })
      .catch(function() {
      });
    }
  },
  modules: {
  }
})

export default store;
