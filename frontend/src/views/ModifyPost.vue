<template>
  <div id="card">
    <Header />
    <NavLink />
    <h1>Modifiez la publication</h1>
    <div>
      <div class="post background">
        <div class="post__zone">
          <input
            style="display: none"
            type="file"
            accept="image/*"
            @change="onFilePicked"
            ref="fileInput"
          />
          <textarea
            class="textarea"
            name="post"
            id="post"
            cols="30"
            rows="10"
            v-model="state.input.post"
          ></textarea>
          <button
            @click.prevent="$refs.fileInput.click()"
            class="button button__little button__little--fa"
          >
            <fa icon="paperclip" />
          </button>
          <div>
            <span v-if="v$.input.post.$error" class="error">
              {{ v$.input.post.$errors[0].$message }}
            </span>
          </div>
        </div>
        <div>
          <img :src="post.image_url" class="post__img" ref="photoPost" alt="" />
          <img
            src=""
            class="post__img"
            ref="filePreview"
            alt="photo de publication"
          />
        </div>
        <button @click="modifyPost(post.id)" class="button">Enregistrer</button>

        <span class="error"> {{ error }} </span>
        <!-- etape 1 après le backend -->
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import NavLink from "../components/NavLink.vue";
import { mapState } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  name: "ModifyPost",
  components: {
    Header,
    NavLink,
  },
  setup() {
    const state = reactive({
      input: {
        post: "",
      },
      post_image: "",
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
        post_image: {},
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
    this.$refs.filePreview.style.display = "none";
    const self = this;
    const urlId = this.$route.params.postId;
    this.$store.dispatch("getPostInfos", urlId).then(
      function () {
        self.state.input.post = self.post.post;
      },
      function () {
        self.logout();
      }
    );
  },
  computed: {
    ...mapState({
      post: "postInfos",
    }),
  },
  methods: {
    modifyPost: function () {
      this.v$.$validate();
      if (!this.v$.$error) {
        const self = this;
        const fd = new FormData();
        fd.append("post_image", this.state.post_image);
        let post = {
          post: this.state.input.post,
        };
        fd.append("post", JSON.stringify(post));
        this.$store
          .dispatch("modifyPostInfos", {
            postAllInfos: fd,
            postId: this.post.id,
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
    onFilePicked: function () {
      this.state.post_image = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        this.$refs.filePreview.src = reader.result;
        this.$refs.filePreview.style.display = "";
        this.$refs.photoPost.style.display = "none";
      };
      reader.readAsDataURL(this.state.post_image);
    },
  },
};
</script>

<style lang="scss" scoped>
.paperclip {
  height: 25px;
  margin-left: 5px;
}

.post__img {
  border-radius: 25px;
  width: 60%;
}
</style>
