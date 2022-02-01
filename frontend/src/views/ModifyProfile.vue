<template>
    <div id="card">
        <h1 class="card__title">Modification de vos informations</h1>
        <div class="form-row">
            <input class="form-row__input" v-model="input.lastName" type="text" placeholder="Nom" required/>
            <input class="form-row__input" v-model="input.firstName" type="text" placeholder="Prénom" required/>
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

import {mapState} from 'vuex'

export default {
    name: 'ModifyProfile',
                                            //enlever les states !!
    data: function () {
            return{
                input: {
                    lastName: '',
                    firstName: '',
                },
                profil_image: null,
                error: '', //etape 2
            }
        },
    computed: {
        validatedFields: function () { // même problème ici que sur login.vue
                if (this.lastName != "" && this.firstName != "") {
                    return true;
                } else {
                    return false;
                }
            },
            ...mapState([status])     
    },
    methods: {
       /* login: function () {
            const self = this
            this.$store.dispatch('login', {
                email: this.state.input.email,
                password: this.state.input.password.password,
            }).then(function() {
                self.$router.push('/profile');
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },*/
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
            const self = this
            this.$store.dispatch('modifyUserInfos', this.$store.state.user.userId)
            .then(function() {
                self.$router.push('/profile');
            }, function(error) {
                self.error = error.response.data.error; // etape 3
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