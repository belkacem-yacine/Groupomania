<template>
    <div class="comment">
        <p> {{comment.user.firstName}} {{comment.user.lastName}}</p>
        <p> Publié le {{formatDate(comment.createdAt)}}</p>
        <p>{{comment.comment}}</p>
        <button @click="modifyComment(comment.id)"> Modifiez votre commentaire</button>
        <button @click="desabledComment(comment.id)">
            Supprimer
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
    }
}
</script>



<style lang="scss" scoped> 
.comment{
    background: green;
}
</style>