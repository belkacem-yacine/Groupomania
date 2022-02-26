<script>
import { mapState } from "vuex";

export default {
	name: "NavLink",
    mounted: function () {
        this.$store.dispatch('getUserInfos', this.$store.state.user.userId);
    },
    computed: {
        ...mapState({ 
            user: 'userInfos',
        })
    },
    methods: {
        logout: function() {
            this.$store.commit('LOGOUT');
            this.$router.push('/');
        },
    },
}
</script>

<template>
    <div class="header">
      <img class="header__logo" src="images/icon-left-font-monochrome-black.png" alt="logo de groupomania">
      <nav class="header__nav">
        <router-link to="/post">Les publications</router-link>
        <p> {{user.firstName}} {{user.lastName}}</p>
        <router-link to="/profile"><img :src="user.image_url" alt="photo de profil" class="header__img"></router-link>
        <button @click="logout()" class="button">
                  Déconnexion
        </button>
      </nav>
    </div>
</template>

<style lang="scss" scoped>
    .header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;

    &__nav{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__logo{
      width: 250px;
      height: auto;
      align-self: center; 
    }

    &__img{
      border-radius: 30px;
      height: 60px;
      width: 60px;
    }
}
</style>