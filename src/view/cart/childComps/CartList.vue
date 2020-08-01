<template>
  <div class="cart-list">
    <Scroll class="content" ref="scroll">
      <CartListItem v-for="(item,index) in cartList" :key="index" :product="item"/>
    </Scroll>
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll";
  import CartListItem from "./CartListItem";

  import {mapGetters} from "vuex"

  export default {
    name: "CartList",
    computed: {
      ...mapGetters(["cartList"])
    },
    components: {
      Scroll,
      CartListItem
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 44px);
  }

  .content {
    height: 100%;
    overflow: hidden;
  }
</style>