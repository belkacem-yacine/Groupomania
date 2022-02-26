<template>
    <div class="card">
        <NavLink />
        <!--<router-link to="/post"><font-awesome-icon icon="fa-solid fa-arrow-left" /></router-link> -->
        <h1 class="card__title">Espace perso</h1>
        <div>
            <p class="card__subtitle">Voilà donc qui je suis...</p>
            <p> {{user.firstName}} {{user.lastName}} {{user.email}} </p>
            <img :src="user.image_url" alt=""/>
            <button><router-link to="/modifyProfile">Modifiez votre profil</router-link></button>
        </div>
        <button @click="desabledUser()">
            Desactivez votre compte
        </button>
        <div class="form-row">
            <button @click="logout()" class="button">
                Déconnexion
            </button>
        </div>
    </div>
</template>

<script>
//mettre une fleche dans le profil et la modif profile pour un retour arriere 
import {mapState} from 'vuex'
import NavLink from '../components/NavLink.vue'
export default {
    name: 'Profile',
    components: {
		NavLink
	},
    mounted: function() {
        if(this.userToken.userId == -1) {
            this.$router.push('/');
            return ;
        }
        this.$store.dispatch('getUserInfos', this.userToken.userId);
    },
    computed: {
        ...mapState({ 
            userToken: 'user',
            user: 'userInfos',
        })
    },
    methods: {
        logout: function() {
            this.$store.commit('LOGOUT');
            this.$router.push('/');
        },
        desabledUser: function() {
            const self = this
            this.$store.dispatch('desabledUser', this.userToken.userId)
            .then(function() {
                self.logout()
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        }
    }
}
</script> 