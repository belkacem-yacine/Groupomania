<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
</script>

<style lang="scss">
body
{
    font-family: 'Roboto', sans-serif;
    margin: 0px;
    max-width: 1600px;
    margin: auto;
    text-align: center;
}

a
{
    text-decoration: none;
    color: black;
}

h1 , h2
{
    font-family: 'Shrikhand', cursive;
}

/*#app{
  background-image: url("../public/images/icon.png");
  background-size: cover;
}*/

.sign{
  color: black;
  font-weight: bold;

  &--white{
    color: #fff;
  }
}


.input-form{

  width: 95%;
  height: 35px;
  border-radius: 6px;
  text-align: center;
  margin: 5px 0px;
  border: 1px solid gray;
  font-size: 17px;

  &--identity{
    
    width: 45%;
    height: 35px;
    border-radius: 6px;
    text-align: center;
    margin: 5px 0px;
    border: 1px solid gray;
    font-size: 17px;

  }
}

.button{
  background: rgb(253, 45, 1);
  border-radius: 25px;
  border: rgb(253, 45, 1);
  padding: 10px 25px;
  box-shadow: 6px 6px 5px lightgray;
  position: relative;
  z-index: 1;
  color: #fff;
  font-weight: bold;
  margin: 5px;
  
  &:hover{
        &::after{
            opacity: 1;
        }
    }

    &::after{
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        z-index: -1;
        transition: opacity 250ms;
        border-radius: 25px;
        box-shadow: 6px 6px 5px gray;
    }
}

.error {
  color: rgb(253, 45, 1);
  margin: 10px 0px;
}

.textarea{
  width: 320px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 4px 2px #ffd7d7;
  margin-top: 15px;
}

.position{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
}
</style>
