<template>
  <div id="card">
    <Header />
    <NavLink />
    <h1>Créer une publication</h1>
    <div class="send-post">
      <div class="send-post__zone">
        <input
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFilePicked"
          ref="fileInput"
        />
        <textarea class="textarea" name="post" id="post" cols="30" rows="10" v-model="state.input.post" :placeholder="`Que voulez-vous partagez, ${user.firstName}?`"></textarea>
        <button @click.prevent="$refs.fileInput.click()" class="send-post__zone--paperclip">
          <fa icon="paperclip"/>
        </button>
        <img class="send-post__img" ref="filePreview" alt="" src="" />  
      </div> 
      <span v-if="v$.input.post.$error" class="error">
          {{ v$.input.post.$errors[0].$message }}
        </span>
      <button @click="createPost()" class="send-post__zone--button button">Publier</button>
      <!--<button>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        </button>-->
      
    </div>
    <div>
      <li v-for="post in posts" v-bind:key="post">
        <Post
                :post="post">
              </Post>
      </li>
    </div>
  </div>
</template>

<script>

import Header from '../components/Header.vue';
import NavLink from '../components/NavLink.vue';
import Post from '../components/Post.vue';
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapState } from "vuex";

export default {
    name: "Posts",
    components: {
      Header,
      NavLink,
      Post
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
            //comments:"",
        };
    },
    mounted: function () {
      this.$store.dispatch('getUserInfos', this.$store.state.user.userId);
      this.$store.dispatch('getPostsInfos');
      //this.$store.dispatch('getCommentsInfos');
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
          if (!this.v$.$error) {
            const self = this;
            const fd = new FormData();
            fd.append('post_image', this.post_image);
            let post = {
                post: this.state.input.post,
                userId: this.user.id
                };
            fd.append('post', JSON.stringify(post));
            this.$store.dispatch('createPost', fd)
                .then(function() {
                    self.refreshData()
                }, function(error) {
                    self.error = error.response.data.error;
                })
          }
        },
        onFilePicked: function () {
            this.post_image = event.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
            this.$refs.filePreview.src = reader.result;
            }
        reader.readAsDataURL(this.post_image);
        },
        refreshData: function() {
          this.state.input.post = "";
          this.$refs.filePreview.src = "";
          const self = this
          this.$store.dispatch('getPostsInfos')
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

.send-post{
  background-color: #f0f1f2;
  border: 1px solid #ffd7d7;
  border-radius: 25px;
  margin-bottom: 20px;
  width: 90%;
  margin-top: 15px;

    &__title{
      margin: 50px 0px 35px 0px;
    }

    &__zone{
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-wrap: wrap;



      &--paperclip{
        height: 25px;
        margin-left: 5px;
      }

      &--button{
      width: 22%;
      }
    }

    &__img {
      margin-top: 10px;
      margin-bottom: 15px;
      height: auto;
      width: 25%;
      align-self: center;
    }

    
}

</style>
