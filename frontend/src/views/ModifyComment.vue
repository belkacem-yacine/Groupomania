<template>
    <div id="card">
        <Header />
        <NavLink />
        <div class="comment">
           <!-- <p> {{comment.user.firstName}} {{comment.user.lastName}}</p>-->
            <p> Publié le {{formatDate(comment.createdAt)}}</p>
            <p>{{comment.comment}}</p>
            <textarea class="comment__zone--text" name="comment" id="comment" cols="30" rows="10" v-model="state.input.comment"></textarea>
        </div>
        <button @click="modifyComment(comment.id)" class="button">Enregistrer la modification</button>
            <span v-if="v$.input.comment.$error" class="error">
                {{ v$.input.comment.$errors[0].$message }}
            </span>
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
import moment from 'moment';

export default {
    name: 'ModifyComment',
    components: {
        Header,
		NavLink
        
	},
    setup() {
    const state = reactive({
      input: {
        comment: "",
      },
    });

    const rules = computed(() => {
      return {
        input: {
          comment: {
            required: helpers.withMessage(
                "Veuillez renseigner ce champ !",
                required
            ),
          },
        },
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
        const self = this
        const urlId = this.$route.params.commentId;
        this.$store.dispatch('getCommentInfos', urlId)
        .then(function() {
          self.state.input.comment = self.comment.comment;
        }, function() {
            self.logout();
        })
    },
    computed: {
        ...mapState({ 
            comment: 'commentInfos',
        })
    },
    methods: {
         formatDate(date) {
            return moment(date).format('DD/MM/YYYY HH:mm')
        },    
        modifyComment: function() {
            this.v$.$validate()
            if (!this.v$.$error) {
                const self = this;
                let comment = {
                    comment: this.state.input.comment, 
                }
                this.$store.dispatch('modifyCommentInfos',{commentAllInfos: comment, commentId: this.comment.id })
                .then(function() {
                    self.$router.push('/posts');
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