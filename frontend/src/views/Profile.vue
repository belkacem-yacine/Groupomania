<template>
    <div class="card">
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
import {mapState} from 'vuex'
export default {
    name: 'Profile',
    mounted: function() {
        if(this.$store.state.user.userId == -1) {
            this.$router.push('/');
            return ;
        }
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
        desabledUser: function() {
            const self = this
            this.$store.dispatch('desabledUser', this.$store.state.user.userId)
            .then(function() {
                self.logout()
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        }
    }
}
</script> 