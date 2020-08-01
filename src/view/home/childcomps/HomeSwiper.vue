<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      SwiperItem,
      Swiper
    },
    data() {
      return {
        isLoad: true
      }
    },
    methods: {
      imageLoad() {
        //发射事件告诉tabControl组件，轮播图已加载完毕(加载完第一张即可)
        if (this.isLoad) {
          this.$emit('swiperImageLoad')
          this.isLoad=false
        }
      }
    }
  }
</script>

<style scoped>

</style>