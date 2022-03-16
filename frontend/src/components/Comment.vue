<template>
    <div class="comment">
        <p> {{comment.user.firstName}} {{comment.user.lastName}}</p>
        <p> Publié le {{formatDate(comment.createdAt)}}</p>
        <p>{{comment.comment}}</p>
        <button @click="modifyComment(comment.id)" v-if="comment.user.id == user.id"> Modifiez votre commentaire</button>
        <button @click="desabledComment(comment.id)" v-if="comment.user.id == user.id">
            <fa icon="trash"/>
        </button>
        <button @click="desabledComment(comment.id)" v-else-if="user.admin == true">
            <fa icon="trash"/>
        </button>
    </div>
</template>



<script>
import { mapState } from "vuex";
import moment from 'moment';

export default {
	name: "Comment",
    props: {
        comment: {type: Object},
    },
    computed: {
        ...mapState({ 
            userToken: 'user',
            user: 'userInfos',
        })
    },
    methods: {
        
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY HH:mm')
        },     
        modifyComment: function(commentId) {
            this.$router.push(`/modifyComment/${commentId}`);
        },
        desabledComment: function(commentId) {
            const self = this
            this.$store.dispatch('desabledComment', commentId)
            .then(function() {
              self.$emit("delComment");
            }, function(error) {
                self.error = error.response.data.error; // etape 3
            })
        },
    }
}
</script>



<style lang="scss" scoped> 
.comment{
    background: green;
}
</style>