<template>
    <div>
          <img :src="post.user.image_url" alt="photo de profil" style="width:100px;"> 
          <p> {{post.user.firstName}} {{post.user.lastName}}</p>
          <p> Publié le {{formatDate(post.createdAt)}}</p>
          <p>{{post.post}}</p>
          <img :src="post.image_url" alt="">
          <textarea name="comment" id="comment" cols="30" rows="10" v-model="state.input.comment"></textarea>
          <span v-if="v$.input.comment.$error">
                {{ v$.input.comment.$errors[0].$message }}
            </span>
          <button @click="createComment()">Envoyer un commentaire</button>
        <div>boutton pour afficher les com<!-- utiliser v-show et @click pour faire apparaitre ou non les commentaires --></div>

        <p v-for="comment in comments" v-bind:key="comment">
            <Comment
                :comment="comment">
              </Comment>
          </p>
        <button @click="modifyPost(post.id)"> Modifiez votre publication</button>
        <button @click="desabledPost(post.id)">
            Supprimer
        </button>
    </div>
</template>



<script>
import { mapState } from "vuex";
import moment from 'moment';
import Comment from '../components/Comment.vue'
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
	name: "Post",
    components: {
      Comment
    },
    props: {
        post: {type: Object},
    },
    setup() {
        const state = reactive({
            input: {
                comment: "",
            },
        });

        const rules = computed(() => {
            return {
                input: {
                    comment: {
                        required: helpers.withMessage(
                            "Veuillez renseigner ce champ !",
                            required
                        ),
                    },
                },
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
            comments:"",
        };
    },
    mounted: function() {
        this.refreshComments()
    },
    computed: {
        ...mapState({ 
            userToken: 'user',
            user: 'userInfos',
            posts: 'postsInfos',
            //comments: 'commentsInfos',
        })
    },
    methods: { 
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY HH:mm')
        },
        modifyPost: function(postId) {
            this.$router.push(`/modifyPost/${postId}`);
        },
        desabledPost: function(postId) {
            const self = this
            this.$store.dispatch('desabledPost', postId)
            .then(function() {
              self.refreshData()
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },
        refreshData: function() {
          const self = this
          this.$store.dispatch('getPostsInfos')
          .then(function() {
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },
        createComment: function() {
            const dataComment = { 
                comment: this.state.input.comment,
                userId: this.user.id,
                postId: this.post.id
            }
            const self = this;
            this.$store.dispatch('createComment', dataComment)
                .then(function() {
                    self.refreshComments()
                }, function(error) {
                    self.error = error.response.data.error;
                })
          },
        refreshComments: function() {
          const self = this;
          const postId = self.post.id
          this.$store.dispatch('getCommentsInfos', postId)
          .then(function(response) {
              self.comments = response.data
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },
    }    
}
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
</style>