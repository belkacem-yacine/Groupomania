<template>
  <div class="comment">
    <div class="comment__user">
      <div class="user">
        <img
          :src="comment.user.image_url"
          alt="photo de profil"
          class="user__img"
        />
        <p class="user__info">
          {{ comment.user.firstName }} {{ comment.user.lastName }}
        </p>
      </div>
      <p class="comment__date">Publié le {{ formatDate(comment.createdAt) }}</p>
    </div>
    <p class="comment__textcomment">{{ comment.comment }}</p>
    <div>
      <button
        @click="modifyComment(comment.id)"
        v-if="comment.user.id == user.id"
        class="button button__little"
      >
        Modifier
      </button>
      <button
        @click="desabledComment(comment.id)"
        v-if="comment.user.id == user.id"
        class="button button__little"
      >
        Supprimer
      </button>
      <button
        @click="desabledComment(comment.id)"
        v-else-if="user.admin == true"
        class="button button__little"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "Comment",
  props: {
    comment: { type: Object },
  },
  computed: {
    ...mapState({
      userToken: "user",
      user: "userInfos",
    }),
  },
  methods: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    modifyComment: function (commentId) {
      this.$router.push(`/modifyComment/${commentId}`);
    },
    desabledComment: function (commentId) {
      const self = this;
      this.$store.dispatch("desabledComment", commentId).then(
        function () {
          self.$emit("delComment");
        },
        function (error) {
          self.error = error.response.data.error;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  background-color: white;
  border: 1px solid #ffd7d7;
  border-radius: 25px;
  margin-bottom: 20px;
  font-size: small;

  &__user {
    display: flex;
    justify-content: space-between;
    border: 1px solid #ffd7d7;
    border-radius: 22px;
  }

  &__date {
    font-size: x-small;
    align-self: center;
  }

  &__textpost {
    text-align: left;
    margin-left: 45px;
  }
}

.user {
  display: flex;

  &__info {
    margin-left: 5px;
  }

  &__img {
    border-radius: 30px;
    width: 30px;
    height: 30px;
    align-self: center;
    border: 1px solid #ffd7d7;
  }
}
</style>
