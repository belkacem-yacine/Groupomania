<template>
    <div id="card">
        <h1 class="card__title">Modification de vos informations</h1>
        <div class="form-row">
            <input class="form-row__input" v-model="state.input.lastName" type="text" placeholder="Nom" required/>
            <span v-if="v$.input.lastName.$error">
                {{ v$.input.lastName.$errors[0].$message }}
            </span>
            <input class="form-row__input" v-model="state.input.firstName" type="text" placeholder="Prénom" required/>
            <span v-if="v$.input.firstName.$error">
                {{ v$.input.firstName.$errors[0].$message }}
            </span>
        </div>
        <div>
            <input style="display:none" type="file" accept="image/*" @change="onFilePicked" ref="fileInput">
            <button @click.prevent="$refs.fileInput.click()">Choisir une photo de profil</button>
            <img class="profil_card__logo" ref="filePreview" alt="" src="">
        </div>
        <div>
            <button @click="modifyProfile()" class="button" :class="{'button--disabled' : !validatedFields}">
                <span v-if="status == 'loading' ">Enregistrement en cours ...</span>
                <span v-else>Enregistrer</span>
            </button>
        </div>
        <span> {{ error }} </span> <!-- etape 1 après le backend -->
    </div>
</template>


<script>

import useValidate from '@vuelidate/core'
import { required} from '@vuelidate/validators'
import { reactive, computed } from 'vue'

export default {
    name: 'ModifyProfile',
    setup () {
        const state = reactive({
            input: {
                lastName: '',
                firstName: '', 
            },
            profil_image: '',        
        })

        const rules = computed(() => {
            return {
                input: {
                        lastName: { required },
                        firstName: { required },  
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
                error: '',
            }
        },
    methods: {
        /*signup: function () {
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
        },*/
        modifyProfile: function() {
            this.v$.$validate()
            if (!this.v$.$error) {
                const self = this;
                const fd = new FormData();
                fd.append('profil_image', this.state.profil_image);
                let user = {
                    lastName: this.state.input.lastName,
                    firstName: this.state.input.firstName,
                }
                fd.append('user', JSON.stringify(user));
                this.$store.dispatch('modifyUserInfos',{userAllInfos: fd, userId: this.$store.state.user.userId})
                .then(function() {
                    self.$router.push('/profile');
                }, function(error) {
                    self.error = error.response.data.error;
                })
            }
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