<template>
  <div id="card">
    <div>
      <div>
        <img :src="user.image_url" alt=""/>
        <p> {{user.firstName}} {{user.lastName}}</p>
      </div>
      <label for="post">Envoyer une publication</label>
      <textarea name="post" id="post" cols="30" rows="10"></textarea>
      <div>
        <input
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFilePicked"
          ref="fileInput"
        />
        <button @click.prevent="$refs.fileInput.click()">
          Inserer une image
        </button>
        <img class="profil_card__logo" ref="filePreview" alt="" src="" />
      </div>
      <div>pour les commentaire utiliser v-show et @click pour faire apparaitre ou non les commentaires</div>
      <div>pour le like</div>
      <button @click="createPost()">Envoyer la publication</button>
    </div>
    <div>
        ici pour la liste des posts
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
  },
   computed: {
        ...mapState({ 
            user: 'userInfos',
        })
    },
  methods: {
      createPost: function () {
          const self = this;
          const fd = new FormData();
          fd.append('post_image', this.post_image);
          let post = this.post;
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

<style scoped></style>
