<template>
    <div id="card">
        <Header />
        <NavLink />
        <div class="post">
            <label class="post__title" for="post">Modifiez votre publication</label>
            <div class="post__zone">
                <input
                style="display: none"
                type="file"
                accept="image/*"
                @change="onFilePicked"
                ref="fileInput"
                />
                <button @click.prevent="$refs.fileInput.click()" class="post__zone--button">
                Inserer une image
                </button>
                <textarea class="post__zone--text" name="post" id="post" cols="30" rows="10" v-model="state.input.post"></textarea>
            </div> 
            <img :src="post.image_url" class="profil_card__logo" ref="photoPost"  alt="" >
            <img src="" class="post__img" ref="filePreview" alt="photo de publication"  />
        </div>
        <button @click="modifyPost(post.id)">Enregistrer la modification</button>
            <span v-if="v$.input.post.$error">
                {{ v$.input.post.$errors[0].$message }}
            </span>
        <span> {{ error }} </span> <!-- etape 1 après le backend -->
    </div>
</template>


<script>

import Header from '../components/Header.vue';
import NavLink from '../components/NavLink.vue';
import { mapState } from "vuex";
import useValidate from '@vuelidate/core';
import { required, helpers} from '@vuelidate/validators';
import { reactive, computed } from 'vue';


export default {
    name: 'ModifyPost',
    components: {
        Header,
		NavLink
        
	},
    setup() {
    const state = reactive({
      input: {
        post: "",
      },
      post_image:"",
    });

    const rules = computed(() => {
      return {
        input: {
          post: {
            required: helpers.withMessage(
                "Veuillez renseigner ce champ !",
                required
            ),
          },
        },
        post_image:{},
      };
    });

    const v$ = useValidate(rules, state);

    return {
      state,
      v$,
    };
  },
    data: function () {
        return {
            error:"",
        };
    },
    mounted: function () {
        this.$refs.filePreview.style.display = "none";
        const self = this
        const urlId = this.$route.params.postId;
        this.$store.dispatch('getPostInfos', urlId)
        .then(function() {
          self.state.input.post = self.post.post;
        }, function() {
            self.logout();
        })
    },
    computed: {
        ...mapState({ 
            post: 'postInfos',
        })
    },
    methods: {
        modifyPost: function() {
            this.v$.$validate()
            if (!this.v$.$error) {
                const self = this;
                const fd = new FormData();
                fd.append('post_image', this.state.post_image);
                let post = {
                    post: this.state.input.post, 
                }
                fd.append('post', JSON.stringify(post));
                this.$store.dispatch('modifyPostInfos',{postAllInfos: fd, postId: this.post.id })
                .then(function() {
                    self.$router.push('/posts');
                }, function(error) {
                    self.error = error.response.data.error;
                })
            }
        },
        onFilePicked: function () {
            this.state.post_image = event.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
            this.$refs.filePreview.src = reader.result;
            this.$refs.filePreview.style.display = "";
            this.$refs.photoPost.style.display = "none";
            }
      reader.readAsDataURL(this.state.post_image);
        },
    }
}
</script>

<style scoped>

</style>