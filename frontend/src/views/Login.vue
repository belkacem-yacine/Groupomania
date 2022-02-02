<template>
    <div id="card">
        <h1 class="card__title">Connecte toi à ton compte groupomania</h1>
        <p class="card__subtitle">Tu n'as pas encore de compte?  <router-link to="/">Inscris toi</router-link></p>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.email" type="email" placeholder="Email" required/>
            <span v-if="v$.input.email.$error">
                {{ v$.input.email.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.password" type="password" placeholder="Mot de passe" required/>
            <span v-if="v$.input.password.$error">
                {{ v$.input.password.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row" v-if="status == 'error_login' ">
            Adresse mail et/ou mot de passe invalide
        </div>
        <div>
            <button @click="login()" class="button" :class="{'button--disabled' : !validatedFields}">
                <span v-if="status == 'loading' ">Connexion en cours ...</span>
                <span v-else>Connexion</span>
            </button>
        </div>
        <span> {{ error }} </span> 
    </div>
</template>

<script>

import {mapState} from 'vuex'
import useValidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { reactive, computed } from 'vue'

export default {
    name: 'Login',
    setup () {
        const state = reactive({
                input: {
                    email: '',
                    password:'',
                },
        })

        const rules = computed(() => {
            return {
            input: {
                    email: { required, email },
                    password: { required, minLength: minLength(6) },
                },
        }
        })

        const v$ = useValidate(rules, state)

        return {
            state,
            v$,
        }
    },
    data: function () {
            return{
                error:''
            }
        },
    mounted: function () {
        if(this.$store.state.user.userId != -1) {
            this.$router.push('/profile');
            return ;
        }
    },
    computed: {
        validatedFields: function () {
            if (this.mode == 'create') {
                if (this.email != "" && this.lastName != "" && this.firstName != "" && this.password != "") { // je n'arrive pas a supprimer cette condition sans créer de problème
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.email != "" && this.password != "") {
                    return true;
                } else {
                    return false;
                }
            }  
        },
        ...mapState([status])
    },
    methods: {
        login: function () {
            this.v$.$validate()
            if (!this.v$.$error) {
                const self = this
                this.$store.dispatch('login', {
                    email: this.state.input.email,
                    password: this.state.input.password,
            }).then(function() {
                self.$router.push('/profile');
            }, function(error) {
                self.error = error.response.data.error;
            })
        }
     
        },
    }
}
</script>

<style scoped>

</style>