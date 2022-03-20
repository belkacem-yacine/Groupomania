<template>
    <div>
      <nav class="nav">
        <router-link to="/posts"><fa icon="home"/></router-link>
        <router-link to="/profile" class="nav__profile">
          <p class="nav__profile--user">
            {{user.firstName}} {{user.lastName}}
          </p>
          <img :src="user.image_url" alt="photo de profil" class="nav__profile--img">
        </router-link>
        <button @click="logout()" class="button">
                  Déconnexion
        </button>
      </nav>
    </div>
</template>


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



<style lang="scss" scoped>
  .nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    &__profile{
      display: flex;
      align-items: center;

      &--user{
        margin-right: 10px;
      }

      &--img{
      border-radius: 30px;
      height: 50px;
      width: 50px;
    }
  }
     
    
}
</style>