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

.sign{
  color: black;
  font-weight: bold;
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
    
    width: 100%;
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
  padding: 7px 15px;
  box-shadow: 6px 6px 5px #ffd7d7;
  color: #000;
  font-weight: bold;
  margin: 5px;

  &__little{
    border-radius: 5px;
    padding: 5px;

    &--fa{
      margin-right: -5px;
      margin-left: 8px;
    }
  }
}

.error {
  color: rgb(253, 45, 1);
  margin: 10px 0px;
}

.textarea{
  width: 85%;
  border-radius: 20px;
  text-align: center;
  box-shadow: 4px 2px #ffd7d7;
  margin-top: 15px;
}

.background{
    background: #f0f1f2;
    border: 1px solid #ffd7d7;
    border-radius: 25px;
    width: 90%;
    margin: auto;

    @include media-tablette{
            width: 80%;
    }

    @include little-desktop{
                width: 70%;
    }

    @include desktop-only{
                width: 60%;
    }

    &--padding{
      padding: 25px 0px;
    }
}

.invisible{
  display: none;
}

</style>
