<template>
  <div id="card">
    <Header />
    <NavLink />
    <h1>Modifiez le commentaire</h1>
    <div class="comment background">
      <textarea
        class="textarea"
        name="comment"
        id="comment"
        cols="30"
        rows="10"
        v-model="state.input.comment"
      ></textarea>
      <label for="comment" class="invisible">Commentaire</label>
      <span v-if="v$.input.comment.$error" class="error">
        {{ v$.input.comment.$errors[0].$message }}
      </span>
      <button @click="modifyComment(comment.id)" class="button margin">
        Enregistrer
      </button>
      <span> {{ error }} </span>
    </div>

  </div>
</template>

<script>
import NavLink from "../components/NavLink.vue";
import Header from "../components/Header.vue";
import { mapState } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import moment from "moment";

export default {
  name: "ModifyComment",
  components: {
    Header,
    NavLink,
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
      error: "",
    };
  },
  mounted: function () {
    const self = this;
    const urlId = this.$route.params.commentId;
    this.$store.dispatch("getCommentInfos", urlId).then(
      function () {
        self.state.input.comment = self.comment.comment;
      },
      function () {
        self.logout();
      }
    );
  },
  computed: {
    ...mapState({
      comment: "commentInfos",
    }),
  },
  methods: {
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    modifyComment: function () {
      this.v$.$validate();
      if (!this.v$.$error) {
        const self = this;
        let comment = {
          comment: this.state.input.comment,
        };
        this.$store
          .dispatch("modifyCommentInfos", {
            commentAllInfos: comment,
            commentId: this.comment.id,
          })
          .then(
            function () {
              self.$router.push("/posts");
            },
            function (error) {
              self.error = error.response.data.error;
            }
          );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.margin {
  margin: 15px 0px;
}
</style>
