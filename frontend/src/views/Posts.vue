<template>
  <div id="card">
    <Header />
    <NavLink />
    <h1>Créer une publication</h1>
    <div class="position">
      <div class="send-post background">
        <div class="send-post__zone">
          <input
            style="display: none"
            type="file"
            accept="image/*"
            @change="onFilePicked"
            ref="fileInput"
          />
          <textarea class="textarea" name="post" id="post" cols="30" rows="10" v-model="state.input.post" :placeholder="`Que voulez-vous partagez, ${user.firstName}?`"></textarea>
          <button @click.prevent="$refs.fileInput.click()" class="button button__little button__little--fa">
            <fa icon="paperclip"/>
          </button>
          <img class="send-post__img" ref="filePreview" alt="" src="" />  
        </div>
        <div>
          <span v-if="v$.input.post.$error" class="error">
            {{ v$.input.post.$errors[0].$message }}
          </span> 
        </div>
        <button @click="createPost()" class="send-post__zone--button button">Publier</button>
      </div>
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
          const self = this
          this.$store.dispatch('getPostsInfos')
          .then(function() {
            document.getElementById("post").value = "";
            self.$refs.filePreview.src = "";
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        }
  }
};
</script>

<style lang="scss" scoped>
.send-post{
  display: flex;
  flex-direction: column;
  align-items: center;

    &__title{
      margin: 50px 0px 35px 0px;
    }

    &__zone{
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-wrap: wrap;
      width: 90%;

      &--button {
        margin-bottom: 10px;
      }

      &--paperclip{
        height: 25px;
        margin-left: 5px;
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
