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
        <p>Etes-vous administrateur</p>
        <div>
        <input type="radio" id="yes" name="admin" value="true" v-model="state.input.admin">
        <label for="yes">Oui</label>
        </div>
        <div>
        <input type="radio" id="no" name="admin" value="false" v-model="state.input.admin"> 
        <label for="no">Non</label>
        </div>
        <div v-if="showAdminPassword">
            <input class="form-row__input" v-model="state.input.adminPassword" type="password" placeholder="Mot de passe administrateur" required/>
            <span v-if="v$.input.adminPassword.$error">
                {{ v$.input.adminPassword.$errors[0].$message }}
            </span>
        </div>
        <div>
            <input style="display:none" type="file" accept="image/*" @change="onFilePicked" ref="fileInput">
            <button @click.prevent="$refs.fileInput.click()">Choisir une photo de profil</button>
            <img class="profil_card__logo" ref="filePreview" alt="" src="">
        </div>
        
        <div>
            <button @click="modifyProfile()" class="button" :class="{'button--disabled' : !validatedFields}">
                <span>Enregistrer</span>
            </button>
        </div>
        <span> {{ error }} </span> <!-- etape 1 après le backend -->
    </div>
</template>


<script>

import { mapState } from "vuex";
import useValidate from '@vuelidate/core'
import { required, /*requiredIf, helpers*/} from '@vuelidate/validators'
import { reactive, computed } from 'vue'

export default {
    name: 'ModifyProfile',
    setup () {
        const state = reactive({
            input: {
                lastName: '',
                firstName: '',
                admin:'', 
                adminPassword:''
            },
            profil_image: '',        
        })

        const rules = computed(() => {
            return {
                input: {
                        lastName: { required },
                        firstName: { required },
                        admin: { required }, 
                        adminPassword: { required }
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
    mounted: function () {
        const self = this
        this.$store.dispatch('getUserInfos', this.$store.state.user.userId)
        .then(function() {
          self.state.input.firstName = self.user.firstName;
          self.state.input.lastName = self.user.lastName;
          self.state.input.admin = self.user.admin;
        })
    },
    computed: {
        showAdminPassword: function() {
            console.log(this.state.input.admin)
            if(this.state.input.admin == false) {
                return false
            } else {
                return true
            }
        },
        ...mapState({ 
            user: 'userInfos',
        })
    },
    methods: {
        modifyProfile: function() {
            this.v$.$validate()
            if (!this.v$.$error) {
                const self = this;
                const fd = new FormData();
                fd.append('profil_image', this.state.profil_image);
                let user = {
                    lastName: this.state.input.lastName,
                    firstName: this.state.input.firstName,
                    admin: this.state.input.admin,
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