<template>
  <div class="cart">
    <!--导航-->
    <NavBar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </NavBar>
    <!--列表-->
    <CartList/>
    <!--结算-->
    <CartBottomBar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import {mapGetters} from "vuex"

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      //利用...mapGetters方法在这里混入getters中的属性

      /*第一种*/
      // ...mapGetters(['cartLength','cartList'])

      /*第二种*/
      ...mapGetters({
        length:'cartLength',
        list:'cartList'
      })
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: white;
  }
  .cart{
    height: 100vh;
  }
</style>
