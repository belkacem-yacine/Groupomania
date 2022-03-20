<template>
    <div class="social">
        <div class="post">
            <div class="post__user">
                <div class="user">
                    <img :src="post.user.image_url" alt="photo de profil" class="user__img"> 
                    <p class="user__info"> {{post.user.firstName}} {{post.user.lastName}}</p>
                </div>
                <p class="post__date"> Publié le {{formatDate(post.createdAt)}}</p>
            </div>
            <div class="post__info">
                <p class="post__textpost">{{post.post}}</p>
                <img :src="post.image_url" alt="" class="post__image">
            </div>
            <div>
                <!-- font awesome pour les "..." = ellipsis-->
                <button @click="modifyPost(post.id)" v-if="post.user.id == user.id"> Modifier</button>
                <button @click="desabledPost(post.id)" v-if="post.user.id == user.id">
                    <fa icon="trash"/>
                </button>
                <button @click="desabledPost(post.id)" v-else-if="user.admin == true">
                    <fa icon="trash"/>
                </button>
            </div>
        </div>

        <textarea class="textarea" name="comment" id="comment" cols="30" rows="10" v-model="state.input.comment" placeholder="Écrivez un commentaire ici..."></textarea>
        <span v-if="v$.input.comment.$error" class="error">
            {{ v$.input.comment.$errors[0].$message }}
        </span>
        <button @click="createComment()" class="button">Commenter</button>
        <div class="all-comments">
            <button @click="lookComments()" id="displayComments" class="button">Afficher les commentaires</button>
            <div v-show="showComments" class="comments">
                <p v-for="comment in comments" v-bind:key="comment">
                    <Comment
                        :comment="comment"
                        @delComment="refreshComments()">
                    </Comment>
                </p>
            </div>
        </div>
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

        const v$ = useValidate(rules, state, { $scope: false });

        return {
            state,
            v$,
        };
    },
    data: function () {
        return {
            error:"",
            comments:"",
            showComments: false,
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
            this.v$.$validate();
            if (!this.v$.$error) {
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
      }
            
          },
        refreshComments: function() {
            this.state.input.comment = "";
            const self = this;
            const postId = self.post.id
            this.$store.dispatch('getCommentsInfos', postId)
            .then(function(response) {
                self.comments = response.data
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },
        lookComments: function() {
            if(this.showComments == false) {
                this.showComments = true
                document.getElementById('displayComments').innerHTML = "Masquer les commentaires"
            }else{
                this.showComments = false
                document.getElementById('displayComments').innerHTML = "Afficher les commentaires"
            }
            
        }
    }    
}
</script>



<style lang="scss" scoped>
.social{
    display: flex;
    flex-direction: column;
    align-items: center;

    
    /*#ffd7d7 pour les bordures*/

}

.post{
        background-color: #f0f1f2;
        border: 1px solid #ffd7d7;
        margin-top: 15px;
        border-radius: 25px;
        width: 90%;
        margin-bottom: 20px;

    &__user{
        display: flex;
        justify-content: space-between;
        border: 1px solid #ffd7d7;
        border-radius: 22px;   
    }
    
    &__date{
        font-size: small;
        align-self: center;
        color: gray;
    }
    

    &__textpost{
        text-align: left;
        margin-left: 45px;
    }

    &__image{
        width: 300px;
        border-radius: 20px;
    }

}

.user{
    
    display: flex;
    
    &__info{
        margin-left: 5px;
    }

    &__img{
        border-radius: 30px;
        height: 40px;
        width: 40px;
        align-self: center;
        border: 1px solid #ffd7d7;
    }
}
.all-comments{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.comments{
    width: 80%;
}

</style>