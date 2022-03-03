<template>
  
  <div id="card">
    <NavLink />
    <h1 class="card__title">Connecte toi à ton compte groupomania</h1>
    <div class="form-row">
      <input
        class="form-row__input"
        v-model="state.input.email"
        type="email"
        placeholder="Email"
      />
      <span v-if="v$.input.email.$error">
        {{ v$.input.email.$errors[0].$message }}
      </span>
    </div>
    <div class="form-row">
      <input
        class="form-row__input"
        v-model="state.input.password"
        type="password"
        placeholder="Mot de passe"
      />
      <span v-if="v$.input.password.$error">
        {{ v$.input.password.$errors[0].$message }}
      </span>
    </div>
    <div>
      <button @click="login()" class="button">
        <span>Connexion</span>
      </button>
    </div>
    <span> {{ error }} </span>
    <p class="card__subtitle">
      Tu n'as pas encore de compte?
      <router-link to="/">Inscris toi</router-link>
    </p>
  </div>
</template>

<script>
import NavLink from '../components/NavLink.vue'
import useValidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  name: "Login",
  components: {
      NavLink,
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
                "Le mot de passe doit comporter 6 caractères minimum !", minLength(6)
            )
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

<style scoped></style>
