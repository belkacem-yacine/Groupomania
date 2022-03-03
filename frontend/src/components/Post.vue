<template>
    <div>
          <img :src="post.user.image_url" alt="photo de profil" style="width:100px;"> 
          <p> {{post.user.firstName}} {{post.user.lastName}}</p>
          <p> Publié le {{formatDate(post.createdAt)}}</p>
          <p>{{post.post}}</p>
          <img :src="post.image_url" alt="Photo de la publication">
        <div>commentaire <!-- utiliser v-show et @click pour faire apparaitre ou non les commentaires --></div>
        <!--<p v-for="comment in comments" v-bind:key="comment">
            {{comment}}
          </p>-->
        <button @click="modifyPost(post.id)"> Modifiez votre publication</button>
        <button @click="desabledPost(post.id)">
            Supprimer
        </button>
    </div>
</template>



<script>
import { mapState } from "vuex";
import moment from 'moment';

export default {
	name: "Post",
    props: {
        post: {type: Object},
    },
    /*mounted: function () {
        this.$store.dispatch('getUserInfos', this.$store.state.user.userId);
    },*/
    computed: {
        ...mapState({ 
            userToken: 'user',
            user: 'userInfos',
            posts: 'postsInfos',
        })
    },
    methods: {
        /*createPost: function () {
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
        },*/
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY hh:mm')
        },
        /*modifyPost: function(postId) {
            this.$router.push(`/modifyPost/${postId}`);
        },*/
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
          this.state.input.post = ""
          const self = this
          this.$store.dispatch('getPostsInfos')
          .then(function() {
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        }
    },
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