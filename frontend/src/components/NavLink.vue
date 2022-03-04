<template>
    <div>
      <nav class="nav">
        <router-link to="/posts">Les publications</router-link>
        <p> {{user.firstName}} {{user.lastName}}</p>
        <router-link to="/profile"><img :src="user.image_url" alt="photo de profil" class="nav__img"></router-link>
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

        &__img{
          border-radius: 30px;
          height: 60px;
          width: 60px;
        }
}
</style>