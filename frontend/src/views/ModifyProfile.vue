<template>
  <div id="card">
    <Header />
    <NavLink />
    <h1 class="card__title">Modifiez vos informations</h1>
    <div class="background background--padding">
      <div class="form-row">
        <div class="form-row--direction">
          <input
            class="form-row--identity"
            id="lastName"
            v-model="state.input.lastName"
            type="text"
            placeholder="Nom"
          />
          <label for="lastName" class="invisible">Nom</label>
          <span v-if="v$.input.lastName.$error" class="error">
            {{ v$.input.lastName.$errors[0].$message }}
          </span>
        </div>

        <div class="form-row--direction">
          <input
            class="form-row--identity"
            id="firstName"
            v-model="state.input.firstName"
            type="text"
            placeholder="Prénom"
          />
          <label for="firstName" class="invisible">Prénom</label>
          <span v-if="v$.input.firstName.$error" class="error">
            {{ v$.input.firstName.$errors[0].$message }}
          </span>
        </div>
      </div>
      <div>
        <input
          class="invisible"
          id="image"
          type="file"
          accept="image/*"
          @change="onFilePicked"
          ref="fileInput"
        />
        <label for="image" class="invisible">Image</label>
        <img
          class="profil-card__image"
          ref="photoProfil"
          alt="photo de profil"
          :src="user.image_url"
        />
        <img
          class="profil-card__image"
          ref="filePreview"
          alt="photo de profil"
          src=""
        />
      </div>

      <div>
        <button @click.prevent="$refs.fileInput.click()" class="button">
          Modifiez votre photo
        </button>
        <button @click="modifyProfile()" class="button">
          <span>Enregistrer</span>
        </button>
      </div>
      <span class="error"> {{ error }} </span>
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

export default {
  name: "ModifyProfile",
  components: {
    Header,
    NavLink,
  },
  setup() {
    const state = reactive({
      input: {
        lastName: "",
        firstName: "",
      },
      profil_image: "",
    });

    const rules = computed(() => {
      return {
        input: {
          lastName: {
            required: helpers.withMessage(
              "Veuillez renseigner ce champ !",
              required
            ),
          },
          firstName: {
            required: helpers.withMessage(
              "Veuillez renseigner ce champ !",
              required
            ),
          },
        },
        profil_image: {},
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
    this.$store.dispatch("getUserInfos", this.userToken.userId).then(
      function () {
        self.state.input.firstName = self.user.firstName;
        self.state.input.lastName = self.user.lastName;
      },
      function () {
        self.logout();
      }
    );
  },
  computed: {
    ...mapState({
      userToken: "user",
      user: "userInfos",
    }),
  },
  methods: {
    modifyProfile: function () {
      this.v$.$validate();
      if (!this.v$.$error) {
        const self = this;
        const fd = new FormData();
        fd.append("profil_image", this.state.profil_image);
        let user = {
          lastName: this.state.input.lastName,
          firstName: this.state.input.firstName,
        };
        fd.append("user", JSON.stringify(user));
        this.$store
          .dispatch("modifyUserInfos", {
            userAllInfos: fd,
            userId: this.userToken.userId,
          })
          .then(
            function () {
              self.$router.push("/profile");
            },
            function (error) {
              self.error = error.response.data.error;
            }
          );
      }
    },
    onFilePicked: function () {
      this.state.profil_image = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        this.$refs.filePreview.src = reader.result;
        this.$refs.filePreview.style.display = "";
        this.$refs.photoProfil.style.display = "none";
      };
      reader.readAsDataURL(this.state.profil_image);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-row {
  display: flex;
  justify-content: space-around;

  &--direction {
    display: flex;
    flex-direction: column;
    width: 45%;
  }

  &--identity {
    height: 35px;
    border-radius: 6px;
    text-align: center;
    margin: 5px 0px;
    border: 1px solid gray;
    font-size: 17px;
  }
}

.profil-card__image {
  border-radius: 25px;
  width: 60%;
  margin: 30px;

  @include media-tablette {
    width: 50%;
  }

  @include little-desktop {
    width: 40%;
  }

  @include desktop-only {
    width: 30%;
  }
}
</style>
