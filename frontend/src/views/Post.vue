<template>
  <div id="card">
    <NavLink />

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
      <span v-if="v$.input.post.$error">
        {{ v$.input.post.$errors[0].$message }}
      </span>
    </div>
    <div>
        <li v-for="post in posts" v-bind:key="post">
          <img :src="post.user.image_url" alt="photo de profil" style="width:100px;"> 
          <p> {{post.user.firstName}} {{post.user.lastName}}</p>
          <p> Publié le {{formatDate(post.createdAt)}}</p>
          <p>{{post.post}}</p>
          <img :src="post.image_url" alt="Photo de la publication">
        <div>commentaire <!-- utiliser v-show et @click pour faire apparaitre ou non les commentaires --></div>
        <button><router-link to="/modifyPost">Modifiez votre publication</router-link></button>
        <button @click="desabledPost()">
            Supprimer
        </button>
      </li>
    </div>
  </div>
</template>

<script>
import NavLink from '../components/NavLink.vue'
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapState } from "vuex";
import moment from 'moment';

export default {
    name: "Post",
    components: {
      NavLink
    },
    setup() {
    const state = reactive({
      input: {
        post: "",
      },
      post_image:"",
    });

    const rules = computed(() => {
      return {
        input: {
          post: {
            required: helpers.withMessage(
                "Veuillez renseigner ce champ !",
                required
            ),
          },
        },
        post_image:{},
      };
    });

    const v$ = useValidate(rules, state);

    return {
      state,
      v$,
    };
  },
    data: function () {
        return {
            error:"",
        };
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
        createPost: function () {
          this.v$.$validate();
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
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY hh:mm')
        },
        desabledPost: function() {
            const self = this
            this.$store.dispatch('desabledPost', this.post)  // je ne sais pas quoi mettre ici pour recupérer le postId
            .then(function() {
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;

    &__nav{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__logo{
      width: 250px;
      height: auto;
      align-self: center; 
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
