<template>
  <div id="card">
    <div>
      <div>
        <p>img</p>
        <p>nom prenom</p>
      </div>
      <label for="post">Envoyer une publication</label>
      <textarea name="post" id="post" cols="30" rows="10"></textarea>
      <div>
        <input
          style="display: none"
          type="file"
          accept="image/*"
          @change="onFilePicked"
          ref="fileInput"
        />
        <button @click.prevent="$refs.fileInput.click()">
          Inserer une image
        </button>
        <img class="profil_card__logo" ref="filePreview" alt="" src="" />
      </div>
      <div>pour les commentaire</div>
      <div>pour le like</div>
    </div>
    <div>
        ici pour la liste des posts
    </div>
  </div>
</template>

<script>
//import { mapState } from "vuex";

export default {
  name: "Post",
  data: function () {},
  computed: {},
  methods: {},
};
</script>

<style scoped></style>
