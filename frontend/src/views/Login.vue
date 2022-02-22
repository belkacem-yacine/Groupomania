<template>
    <div id="card">
        <h1 class="card__title">Connecte toi à ton compte groupomania</h1>
        <p class="card__subtitle">Tu n'as pas encore de compte?  <router-link to="/">Inscris toi</router-link></p>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.email" type="email" placeholder="Email"/>
            <span v-if="v$.input.email.$error">
                {{ v$.input.email.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.password" type="password" placeholder="Mot de passe"/>
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
    </div>
</template>

<script>
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
            this.$router.push('/post');
            return ;
        }
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
                    self.$router.push('/post');
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