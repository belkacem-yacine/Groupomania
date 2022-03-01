import { createStore } from 'vuex'

const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
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
    postInfos: {

    },
    postsInfos: [

    ]
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
    DESABLED: function(state) {
      state.userInfos = {
        ...state.userInfos,
        enabled: 0,
      }
    },
    POST_INFOS: function(state, postInfos) {
      state.postInfos = postInfos;
    },
    POSTS_INFOS: function(state, postsInfos) {
      state.postsInfos = postsInfos;
    },
  },
  actions: { 
    login: ({commit}, userInfos) => {
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', userInfos)
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
      return new Promise((resolve, reject) => {
        commit;
        instance.post('/auth/signup', userInfos)
        .then(function(response) {
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
        });
      })  
    },
    getUserInfos: ({commit}, userId) => {
      return new Promise((resolve, reject) => {
        instance.get('/auth/' + userId )
          .then(function(response) {
            commit('USER_INFOS', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      }) 
    },
    modifyUserInfos: ({commit}, user) => {
      return new Promise((resolve, reject) => {
        instance.put('/auth/modifyUser/' + user.userId, user.userAllInfos)
          .then(function(response) {
            commit('USER_INFOS', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      })
    },
    desabledUser: ({commit}, userId) => {
      return new Promise((resolve, reject) => {
        instance.put('/auth/deleteUser/' + userId)
          .then(function(response) {
            commit('DESABLED', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      }) 
    },
    createPost: ({commit}, postInfos) => {
      return new Promise((resolve, reject) => {
        instance.post('/post/createPost', postInfos)
          .then(function(response) {
            commit('POST_INFOS', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      })
    },
    /*getPostInfos: ({commit}, postId) => {
      return new Promise((resolve, reject) => {
        instance.get('/post/' + postId )
          .then(function(response) {
            commit('POST_INFOS', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      }) 
    },*/
    getPostsInfos: ({commit}) => {
      return new Promise((resolve, reject) => {
        instance.get('/post/')
          .then(function(response) {
            commit('POSTS_INFOS', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      }) 
    },
    /*modifyPostInfos: ({commit}, post) => {
      return new Promise((resolve, reject) => {
        instance.put('/post/modifyPost/' + post.postId, post.postAllInfos)
          .then(function(response) {
            commit('POST_INFOS', response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      })
    },*/
    desabledPost: (postId) => {
      return new Promise((resolve, reject) => {
        instance.put('/post/deletePost/' + postId)
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      }) 
    },

  },
  modules: {
  }
})

export default store;
