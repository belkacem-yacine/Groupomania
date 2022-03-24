<template>
  <div class="card">
    <Header />
    <NavLink />
    <div class="position">
        <h1 class="card__title">Votre profil</h1>
        <div class="profile background">
          <div class="profile__infos">
              <p class="card__subtitle">Voilà donc qui je suis...</p>
              <p>Je m'appelle {{ user.firstName }} {{ user.lastName }} et mon adresse mail est: {{ user.email }}</p>
              <img :src="user.image_url" alt="" class="profile__infos--image"/>
          </div>
          <div class="profile__button">
              <button class="button">
              <router-link to="/modifyProfile">
                  Modifier</router-link>
              </button>
              <button @click="desabledUser()" class="button">
              Desactivez votre compte
              </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import NavLink from "../components/NavLink.vue";
import { mapState } from "vuex";

export default {
  name: "Profile",
  components: {
    Header,
    NavLink,
  },
  mounted: function () {
    if (this.userToken.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos", this.userToken.userId);
  },
  computed: {
    ...mapState({
      userToken: "user",
      user: "userInfos",
    }),
  },
  methods: {
    logout: function() {
            this.$store.commit('LOGOUT');
            this.$router.push('/');
    },

    desabledUser: function () {
      const self = this;
      this.$store.dispatch("desabledUser", this.userToken.userId).then(
        function () {
          self.logout();
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

.profile{

    &__infos{

        &--image{
            border-radius: 25px;
            width: 50%;
            margin-bottom: 20px;
        }
    }
    
    &__button{
        margin-bottom: 20px;
    }
}

</style>