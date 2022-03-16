<template>
    <div id="card">
        <Header />
        <NavLink />
        <h1 class="card__title">Modification de vos informations</h1>
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
            <button @click.prevent="$refs.fileInput.click()">Modifiez votre photo de profil</button>
            <img class="profil_card__logo" ref="photoProfil"  alt="photo de profil" :src="user.image_url">
            <img class="profil_card__logo" ref="filePreview" alt="photo de profil" src="">
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

import NavLink from '../components/NavLink.vue';
import Header from '../components/Header.vue';
import { mapState } from "vuex";
import useValidate from '@vuelidate/core';
import { required, helpers} from '@vuelidate/validators';
import { reactive, computed } from 'vue';

export default {
    name: 'ModifyProfile',
    components: {
        Header,
		NavLink
	},
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
                        lastName: { required: helpers.withMessage('Veuillez renseigner ce champ !', required) },
                        firstName: { required: helpers.withMessage('Veuillez renseigner ce champ !', required) }, 
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
        this.$refs.filePreview.style.display = "none";
        const self = this
        this.$store.dispatch('getUserInfos', this.userToken.userId)
        .then(function() {
          self.state.input.firstName = self.user.firstName;
          self.state.input.lastName = self.user.lastName;
          
          //self.state.input.admin = self.user.admin; je sais pas si cest utile de le mettre dans la signup vue
        }, function() {
            self.logout();
        })
    },
    computed: {
        ...mapState({ 
            userToken: 'user',
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
                }
                fd.append('user', JSON.stringify(user));
                this.$store.dispatch('modifyUserInfos',{userAllInfos: fd, userId: this.userToken.userId})
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
            this.$refs.filePreview.style.display = "";
            this.$refs.photoProfil.style.display = "none";
            }
      reader.readAsDataURL(this.state.profil_image);
        },
    }
}
</script>

<style scoped>

</style>