<template>
  <div id="card">
    <Header />
    <h1 class="card__title">Connectez-vous</h1>
    
      <div class="background background--padding">
        <div class="form-row">
          <input
            class="input-form"
            id="email"
            v-model="state.input.email"
            type="email"
            placeholder="Email"
          />
          <label for="email" class="invisible">email</label>
          <span v-if="v$.input.email.$error" class="error">
            {{ v$.input.email.$errors[0].$message }}
          </span>
        </div>
        <div class="form-row">
          <input
            class="input-form"
            id="password"
            v-model="state.input.password"
            type="password"
            placeholder="Mot de passe"
          />
          <label for="password" class="invisible">Mot de passe</label>
          <span v-if="v$.input.password.$error" class="error">
            {{ v$.input.password.$errors[0].$message }}
          </span>
          <span class="error"> {{ error }} </span>
        </div>
        <div>
          <button @click="login()" class="button">
            <span>Connexion</span>
          </button>
        </div>
      </div>
    

    <p class="card__subtitle">
      Vous n'avez pas encore de compte?
      <router-link to="/" class="sign">Inscrivez-vous</router-link>
    </p>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import useValidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  name: "Login",
  components: {
    Header,
  },
  setup() {
    const state = reactive({
      input: {
        email: "",
        password: "",
      },
    });

    const rules = computed(() => {
      return {
        input: {
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
            required: helpers.withMessage(
              "Veuillez renseigner ce champ !",
              required
            ),
            minLength: helpers.withMessage(
              "Le mot de passe doit comporter 6 caractères minimum !",
              minLength(6)
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
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/posts");
      return;
    }
  },
  methods: {
    login: function () {
      this.v$.$validate();
      if (!this.v$.$error) {
        const self = this;
        this.$store
          .dispatch("login", {
            email: this.state.input.email,
            password: this.state.input.password,
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
  .center{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form-row{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
