<template>
  <div id="card">
    <div class="header">
      <p class="header__logo">groupomania</p>
      <nav class="header__nav">
        <p> {{user.firstName}} {{user.lastName}}</p>
        <img :src="user.image_url" alt="" class="header__img">
        <router-link to="/profile">Votre profil</router-link>
        <button @click="logout()" class="button">
                  Déconnexion
        </button>
      </nav>
    </div>
    
    <div class="post">
      <label class="post__title" for="post">Créer une publication</label>
      <div class="post__zone">
        <input
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFilePicked"
          ref="fileInput"
        />
        <button @click.prevent="$refs.fileInput.click()" class="post__zone--button">
          Inserer une image
        </button>
        <textarea class="post__zone--text" name="post" id="post" cols="30" rows="10" v-model="post"></textarea>
      </div> 
      <img class="post__img" ref="filePreview" alt="" src="" />
      <button @click="createPost()">Envoyer la publication</button>
    </div>
    <div>
        <li v-for="post in posts" v-bind:key="post">
          <img src="" alt=""> <!--  JE N ARRIVE PAS A ACCEDER AUX INFOS DU USER
            img de profil de celui qui a fait le post -->
          <!-- <p> {{post.user.firstName}} {{post.user.lastName}}</p> -->
          <p> Publié le {{post.createdAt}}</p>
          <p>{{post.post}}</p>
          <p> {{post.image_url}} </p>
        {{post}}
        <div>commentaire <!-- utiliser v-show et @click pour faire apparaitre ou non les commentaires --></div>
      </li>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "Post",
    data: function () {
        return {
            post: '',
            post_image:'',
        }
    },
    mounted: function () {
        this.$store.dispatch('getUserInfos', this.$store.state.user.userId);
        this.$store.dispatch('getPostsInfos');
    },
    computed: {
        ...mapState({ 
            user: 'userInfos',
            posts: 'postsInfos',
        })
    },
    methods: {
        logout: function() {
            this.$store.commit('LOGOUT');
            this.$router.push('/');
        },
        createPost: function () {
            const self = this;
            const fd = new FormData();
            fd.append('post_image', this.post_image);
            console.log(this.post)
            let post = {
                post: this.post,
                userId: this.user.id
                };
            fd.append('post', JSON.stringify(post));
            this.$store.dispatch('createPost', fd)
                .then(function() {
                    //mettre ce qui doit se passer une fois que la fonction est réalisée
                }, function(error) {
                    self.error = error.response.data.error;
                })
        },
        onFilePicked: function () {
            this.post_image = event.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
            this.$refs.filePreview.src = reader.result;
            }
        reader.readAsDataURL(this.post_image);
        },
    },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;

    &__nav{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    &__img{
      border-radius: 30px;
      height: 60px;
      width: 60px;
    }
}

.post{
  display: flex;
  flex-direction: column; 

    &__title{
      font-size: x-large;
      margin: 50px 0px 35px 0px;
    }

    &__zone{
      display: flex;
      flex-direction: row-reverse;
    }

    &__img {
      margin-bottom: 15px;
      height: auto;
      width: 25%;
      align-self: center;
    }

    &__zone--text{
      height: 200px;
      width: 90%;
      align-self: center;
      margin-bottom: 15px;
    }
    
    &__zone--button{
      height: 50px;
      align-self: end;
      margin: 0px 0px 15px 5px;
    }
}

</style>
