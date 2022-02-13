<template>
    <div id="card">
        <h1 class="card__title">Inscription</h1>
        <p class="card__subtitle">Tu as déjà un compte? <router-link to="/login">Connecte toi</router-link></p>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.lastName" type="text" placeholder="Nom"/>
            <span v-if="v$.input.lastName.$error">
                {{ v$.input.lastName.$errors[0].$message }}
            </span>
            <input class="form-row__input" v-model="state.input.firstName" type="text" placeholder="Prénom"/>
            <span v-if="v$.input.firstName.$error">
                {{ v$.input.firstName.$errors[0].$message }}
            </span>
        </div>
        <div>
            <input style="display:none" type="file" accept="image/*" @change="onFilePicked" ref="fileInput">
            <button @click.prevent="$refs.fileInput.click()">Choisir une photo de profil</button>
            <img class="profil_card__logo" ref="filePreview" alt="" src="">
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.email" type="email" placeholder="Email"/>
            <span v-if="v$.input.email.$error">
                {{ v$.input.email.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.password.password" type="password" placeholder="Mot de passe"/>
            <span v-if="v$.input.password.password.$error">
                {{ v$.input.password.password.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.password.confirm" type="password" placeholder="Confirmation du mot de passe"/>
            <span v-if="v$.input.password.confirm.$error">
                {{ v$.input.password.confirm.$errors[0].$message }}
            </span>
        </div>
        <div>
            <button @click="signup()" class="button">
                <span>Créer un compte</span>
            </button>
        </div>
        <span> {{ error }} </span> <!-- etape 1 après le backend -->
    </div>
</template>


<script>

import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { reactive, computed } from 'vue'

export default {
    name: 'Signup',
    setup () {
        const state = reactive({
            input: {
                lastName: '',
                firstName: '',
                email: '',
                password:{
                    password:'',
                    confirm:'',
                },   
            },
            profil_image: '',        
        })

        const rules = computed(() => {
            return {
                input: {
                        lastName: { required },
                        firstName: { required },
                        email: { required, email },
                        password: {
                            password:{ required, minLength: minLength(6) },
                            confirm:{ required, sameAs: sameAs(state.input.password.password) },
                        },    
                },
                profil_image: {},
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
                error: ''
            }
    },
    mounted: function () {
        if(this.$store.state.user.userId != -1) {
            this.$router.push('/profile');
            return ;
        }
    },
    methods: {
        login: function () {
            const self = this
            this.$store.dispatch('login', {
                email: this.state.input.email,
                password: this.state.input.password.password,
            }).then(function() {
                self.$router.push('/profile');
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },
        signup: function () {
            this.v$.$validate()
            if (!this.v$.$error) {
                const self = this;
                const fd = new FormData();
                fd.append('profil_image', this.state.profil_image);
                let user = {
                    lastName: this.state.input.lastName,
                    firstName: this.state.input.firstName,
                    email: this.state.input.email,
                    password: this.state.input.password.password,
                }
                fd.append('user', JSON.stringify(user));
                this.$store.dispatch('signup', fd)
                .then(function() {
                    self.login();
                }, function(error) {
                    self.error = error.response.data.error;
                })
            }
        },
        onFilePicked: function () {
            this.state.profil_image = event.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
            this.$refs.filePreview.src = reader.result;
            }
      reader.readAsDataURL(this.state.profil_image);
        },
    }
}
</script>

<style scoped>

</style>