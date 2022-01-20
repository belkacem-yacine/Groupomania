<template>
    <div id="card">
        <h1 class="card__title" v-if="mode == 'login'">Connecte toi à ton compte groupomania</h1>
        <h1 class="card__title" v-else>Inscription</h1>
        <p class="card__subtitle" v-if="mode == 'login'">Tu n'as pas encore de compte? <span @click="switchToCreateAccount()">Créér un compte</span></p>
        <p class="card__subtitle" v-else>Tu as déjà un compte? <span @click="switchToLogin()">Connecte toi</span></p>
        <div class="form-row" v-if="mode == 'create'">
            <input class="form-row__input" v-model="input.lastName" type="text" placeholder="Nom" required/>
            <span v-if="v$.input.lastName.$error">
                {{ v$.input.lastName.$errors[0].$message }}
            </span>
            <input class="form-row__input" v-model="input.firstName" type="text" placeholder="Prénom" required/>
            <span v-if="v$.input.firstName.$error">
                {{ v$.input.firstName.$errors[0].$message }}
            </span>
        </div>
        <div v-if="mode == 'create' ">
            <input style="display:none" type="file" accept="image/*" @change="onFilePicked" ref="fileInput">
            <button @click.prevent="$refs.fileInput.click()">Choisir une photo de profil</button>
            <img class="profil_card__logo" ref="filePreview" alt="" src="">
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="input.email" type="email" placeholder="Email" required/>
            <span v-if="v$.input.email.$error">
                {{ v$.input.email.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row">
            <input class="form-row__input" v-model="input.password" type="password" placeholder="Mot de passe" required/>
            <span v-if="v$.input.password.$error">
                {{ v$.input.password.$errors[0].$message }}
            </span>
        </div>
        <div class="form-row" v-if="mode == 'login' && status == 'error_login' ">
            Adresse mail et/ou mot de passe invalide
        </div>
        <div class="form-row" v-if="mode == 'create' && status == 'error_create' ">
            Adresse mail déjà utilisée
        </div>
        <div>
            <button @click="login()" class="button" :class="{'button--disabled' : !validatedFields}" v-if="mode == 'login'">
                <span v-if="status == 'loading' ">Connexion en cours ...</span>
                <span v-else>Connexion</span>
            </button>
            <button @click="signup()" class="button" :class="{'button--disabled' : !validatedFields}" v-else>
                <span v-if="status == 'loading' ">Création en cours ...</span>
                <span v-else>Créer un compte</span>
            </button>
        </div>
        </div>
</template>

<script>

import {mapState} from 'vuex'
import useValidate from '@vuelidate/core'
import { required, email, minLength, /*sameAs*/ } from '@vuelidate/validators'
//import { reactive, computed } from 'vue'

export default {
    name: 'Login',
    /*setup () {
        const state = reactive({
            mode: 'login',
                input: {
                    lastName: '',
                    firstName: '',
                    email: '',
                    password:'',
                },
                profil_image: null,
        })

        const rules = computed(() => {
            return {
            input: {
                    lastName: { required },
                    firstName: { required },
                    email: { required, email },
                    password: { required, minLength: minLength(6) },
                },
        }
        })

        const v$ = useValidate(rules, state)

        return {
            state,
            v$,
        }*/
    data: function () {
            return{
                v$ : useValidate(),
                mode: 'login',
                input: {
                    lastName: '',
                    firstName: '',
                    email: '',
                    password:'',
                },
                profil_image: null,
            }
        },
    mounted: function () {
        if(this.$store.state.user.userId != -1) {
            this.$router.push('/profile');
            return ;
        }
    },
    validations() {
        return {
            input: {
                    lastName: { required },
                    firstName: { required },
                    email: { required, email },
                    password: { required, minLength: minLength(6) },
                },
        }
    },
    computed: {
        validatedFields: function () {
            if (this.mode == 'create') {
                if (this.email != "" && this.lastName != "" && this.firstName != "" && this.password != "") {
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
        switchToCreateAccount: function () {
            this.mode = 'create';
        },
        switchToLogin: function () {
            this.mode = 'login';
        },
        login: function () {
            const self = this;
            this.$store.dispatch('login', {
                email: this.email,
                password: this.password,
            }).then(function() {
                self.$router.push('/profile');
            }, function(error) {
                console.log(error);
            })
        },
        signup: function () {
            this.v$.$validate()
            if (!this.v$.$error) {
                alert ('Compte crée!')
            } else {
                alert('Le formulaire est incomplet')
            }
            const self = this;
            const fd = new FormData();
            fd.append('profil_image', this.profil_image);
            fd.append('user', JSON.stringify(this.input));
            this.$store.dispatch('signup', fd)
            .then(function() {
                self.login();
            }, function(error) {
                console.log(error);
            })
        },
        onFilePicked: function () {
            this.profil_image = event.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
            this.$refs.filePreview.src = reader.result;
            }
      reader.readAsDataURL(this.profil_image);
        },
    }
}
</script>

<style scoped>

</style>