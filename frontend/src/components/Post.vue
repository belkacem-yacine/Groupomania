<template>
  <div class="social">
    <div class="post background">
      <div class="post__user">
        <div class="user">
          <img
            :src="post.user.image_url"
            alt="photo de profil"
            class="user__img"
          />
          <p class="user__info">
            {{ post.user.firstName }} {{ post.user.lastName }}
          </p>
        </div>
        <p class="post__date">Publié le {{ formatDate(post.createdAt) }}</p>
      </div>
      <div class="post__info">
        <p class="post__textpost">{{ post.post }}</p>
        <img :src="post.image_url" alt="" class="post__image" />
      </div>
      <div>
        <button
          @click="modifyPost(post.id)"
          v-if="post.user.id == user.id"
          class="button button__little"
        >
          Modifier
        </button>
        <button
          @click="desabledPost(post.id)"
          v-if="post.user.id == user.id"
          class="button button__little"
        >
          <fa icon="trash" />
        </button>
        <button
          @click="desabledPost(post.id)"
          v-else-if="user.admin == true"
          class="button button__little"
        >
          <fa icon="trash" />
        </button>
      </div>
        <div class="center">
            <textarea
            class="textarea"
            name="comment"
            id="comment"
            cols="30"
            rows="10"
            v-model="textComment"
            placeholder="Écrivez un commentaire ici..."
            ></textarea>
            <span class="error" id="error-comment"> </span>
            <button @click="createComment()" class="button">Commenter</button>
        </div>
            
            <div class="all-comments">
                <button
                    @click="lookComments($event)"
                    id="displayComments"
                    class="button"
                    v-if="comments != ''"
                >
                    Afficher les commentaires
                </button>
                <div v-show="showComments" class="comments">
                    <p v-for="comment in comments" v-bind:key="comment">
                    <Comment :comment="comment" @delComment="refreshComments()">
                    </Comment>
                    </p>
                </div>
            </div>
    </div>        
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import Comment from "../components/Comment.vue";

export default {
  name: "Post",
  components: {
    Comment,
  },
  props: {
    post: { type: Object },
  },
  data: function () {
    return {
      error: "",
      comments: "",
      showComments: false,
      textComment: "",
    };
  },
  mounted: function () {
    this.refreshComments();
  },
  computed: {
    ...mapState({
      userToken: "user",
      user: "userInfos",
      posts: "postsInfos",
    }),
  },
  methods: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    modifyPost: function (postId) {
      this.$router.push(`/modifyPost/${postId}`);
    },
    desabledPost: function (postId) {
      const self = this;
      this.$store.dispatch("desabledPost", postId).then(
        function () {
          self.refreshData();
        },
        function (error) {
          self.error = error.response.data.error; 
        }
      );
    },
    refreshData: function () {
      const self = this;
      this.$store.dispatch("getPostsInfos").then(
        function () {},
        function (error) {
          self.error = error.response.data.error;
        }
      );
    },
    createComment: function () {

      if (this.textComment != "") {
        document.getElementById("error-comment").innerHTML = "";
        const dataComment = {
          comment: this.textComment,
          userId: this.user.id,
          postId: this.post.id,
        };
        const self = this;
        this.$store.dispatch("createComment", dataComment).then(
          function () {
            self.refreshComments();
          },
          function (error) {
            self.error = error.response.data.error;
          }
        );
      } else {
        document.getElementById("error-comment").innerHTML =
          "Veuillez renseigner ce champ !";
      }
    },
    refreshComments: function () {
      this.textComment = "";
      const self = this;
      const postId = self.post.id;
      this.$store.dispatch("getCommentsInfos", postId).then(
        function (response) {
          self.comments = response.data;
        },
        function (error) {
          self.error = error.response.data.error;
        }
      );
    },
    lookComments: function (event) {
      if (this.showComments == false) {
        this.showComments = true;
        event.target.innerHTML = "Masquer les commentaires";
      } else {
        this.showComments = false;
        event.target.innerHTML = "Afficher les commentaires";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.social {
  margin-top: 20px;
}

.post {
  &__user {
    display: flex;
    justify-content: space-between;
    border: 1px solid #ffd7d7;
    border-radius: 22px;
  }

  &__date {
    font-size: small;
    align-self: center;
    color: gray;
  }

  &__textpost {
    text-align: left;
    margin-left: 45px;
  }

  &__image {
    width: 100%;
    @include media-tablette {
      width: 90%;
    }

    @include little-desktop {
      width: 80%;
    }

    @include desktop-only {
      width: 70%;
    }
  }
}

.center{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user {
  display: flex;

  &__info {
    margin-left: 5px;
  }

  &__img {
    border-radius: 30px;
    height: 40px;
    width: 40px;
    align-self: center;
    border: 1px solid #ffd7d7;
  }
}
.all-comments {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comments {
  width: 80%;
  @include media-tablette {
    width: 70%;
  }

  @include little-desktop {
    width: 60%;
  }

  @include desktop-only {
    width: 50%;
  }
}
</style>
