<template>
  <div id="card">
    <Header />
      <h1 class="card__title">Créez votre compte</h1>
      <div class="background background--padding">
        <div class="form-row">
          <div class="display display--width">
            <input
            class="input-form--identity"
            v-model="state.input.lastName"
            type="text"
            placeholder="Nom"
            />
            <span v-if="v$.input.lastName.$error" class="error">
              {{ v$.input.lastName.$errors[0].$message }}
            </span>
          </div>
          <div class="display display--width">
            <input
            class="input-form--identity"
            v-model="state.input.firstName"
            type="text"
            placeholder="Prénom"
            />
            <span v-if="v$.input.firstName.$error" class="error">
              {{ v$.input.firstName.$errors[0].$message }}
            </span>
          </div>
        </div>

        <div class="form-row display">
          <input
            class="input-form"
            v-model="state.input.email"
            type="email"
            placeholder="Email"
          />
          <span v-if="v$.input.email.$error" class="error">
            {{ v$.input.email.$errors[0].$message }}
          </span>
        </div>
        <div class="form-row display">
          <input
            class="input-form"
            v-model="state.input.password.password"
            type="password"
            placeholder="Mot de passe"
          />
          <span v-if="v$.input.password.password.$error" class="error">
            {{ v$.input.password.password.$errors[0].$message }}
          </span>
        </div>
        <div class="form-row display">
          <input
            class="input-form"
            v-model="state.input.password.confirm"
            type="password"
            placeholder="Confirmation du mot de passe"
          />
          <span v-if="v$.input.password.confirm.$error" class="error">
            {{ v$.input.password.confirm.$errors[0].$message }}
          </span>
        </div>
        <div>
          <p>Choisir une photo de profil</p>
          <input
            style="display: none"
            type="file"
            accept="image/*"
            @change="onFilePicked"
            ref="fileInput"
          />
          <button @click.prevent="$refs.fileInput.click()" class="parcourir">
            Parcourir...
          </button>
          <div>
            <img class="profil_card__logo" ref="filePreview" alt="" src="" />
          </div>
        </div>
        <div class="form-row__admin">
          <p>Etes-vous administrateur ?</p>
          <div class="form-row__admin--radio">
            <div>
              <input
                type="radio"
                id="yes"
                name="admin"
                value="true"
                v-model="state.input.admin"
              />
              <label for="yes">Oui</label>
            </div>
            <div>
              <input
                type="radio"
                id="no"
                name="admin"
                value="false"
                v-model="state.input.admin"
              />
              <label for="no">Non</label>
            </div>
          </div>

          <div v-if="showAdminPassword">
            <input
              class="input-form"
              v-model="state.input.adminPassword"
              type="password"
              placeholder="Mot de passe administrateur"
            />
            <span v-if="v$.input.adminPassword.$error" class="error">
              {{ v$.input.adminPassword.$errors[0].$message }}
            </span>
          </div>
        </div>

        <div>
          <button @click="signup()" class="button">
            <span>Créer un compte</span>
          </button>
        </div>
        <span class="error"> {{ error }} </span>
        <!-- etape 1 après le backend -->
      </div>
    <p class="card__subtitle">
      Vous avez déjà un compte?
      <router-link to="/login" class="sign">Connectez-vous</router-link>
    </p>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import useValidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  requiredIf,
  helpers,
} from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  name: "Signup",
  components: {
    Header,
  },
  setup() {
    const state = reactive({
      input: {
        lastName: "",
        firstName: "",
        email: "",
        password: {
          password: "",
          confirm: "",
        },
        admin: "",
        adminPassword: "",
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
          email: {
            required: helpers.withMessage(
              "Veuillez renseigner ce champ !",
              required
            ),
            email: helpers.withMessage(
              "Veuillez saisir une adresse mail valide !",
              email
            ),
          },
          password: {
            password: {
              required: helpers.withMessage(
                "Veuillez renseigner ce champ !",
                required
              ),
              minLength: helpers.withMessage(
                "Le mot de passe doit comporter 6 caractères minimum !",
                minLength(6)
              ),
            },
            confirm: {
              required: helpers.withMessage(
                "Veuillez renseigner ce champ !",
                required
              ),
              sameAs: sameAs(state.input.password.password),
            },
          },
          admin: {
            required: helpers.withMessage(
              "Veuillez renseigner ce champ !",
              required
            ),
          },
          adminPassword: {
            required: helpers.withMessage(
              "Veuillez renseigner ce champ !",
              requiredIf(
                state.input.admin == "true" || state.input.admin == true
              )
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
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/posts");
      return;
    }
  },
  computed: {
    showAdminPassword: function () {
      let admin = 0;
      if (this.state.input.admin == "true" || this.state.input.admin == true) {
        admin = 1;
      }
      if (admin == 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    login: function () {
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.state.input.email,
          password: this.state.input.password.password,
        })
        .then(
          function () {
            self.$router.push("/posts");
          },
          function (error) {
            self.error = error.response.data.error; // etape 3
          }
        );
    },
    signup: function () {
      this.v$.$validate();
      if (!this.v$.$error) {
        const self = this;
        const fd = new FormData();
        fd.append("profil_image", this.state.profil_image);
        let user = {
          lastName: this.state.input.lastName,
          firstName: this.state.input.firstName,
          email: this.state.input.email,
          password: this.state.input.password.password,
          admin: this.state.input.admin,
          adminPassword: this.state.input.adminPassword,
        };
        fd.append("user", JSON.stringify(user));
        this.$store.dispatch("signup", fd).then(
          function () {
            self.login();
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
      };
      reader.readAsDataURL(this.state.profil_image);
    },
  },
};
</script>

<style lang="scss" scoped>
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.display{
  display: flex;
  flex-direction: column;
  align-items: center;

  &--width{
    width: 45%;
  }
  
}

.form-row {
  display: flex;
  justify-content: space-around;

  &__admin {
    margin: -10px 0px 20px 0px;

    &--radio {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }
  }
}

.parcourir {
  margin-bottom: 15px;
}
</style>
