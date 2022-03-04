<template>
    <div class="header">
      <img class="header__logo" src="images/icon-left-font-monochrome-white-redi.png" alt="logo de groupomania">
    </div>
</template>


<script>
export default {
	name: "Header",
}
</script>



<style lang="scss" scoped>
    .header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: rgb(253, 45, 1);

   &__logo{
      width: 250px;
      height: auto;
      align-self: center; 
    }
}
</style>