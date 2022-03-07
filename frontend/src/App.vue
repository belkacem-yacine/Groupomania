<template>
  <div id="app">
    <div id="nav">
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: black;
}

#nav {
  
  a {
    font-weight: bold;
    color: #fff;

    &.router-link-exact-active {
      color: #42b983;
    }
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

</style>
