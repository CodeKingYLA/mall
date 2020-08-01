<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "scroll",
    data() {
      return {
        scroll: null,
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0 //默认不监听
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      //返回到具体位置
      scrollTo(x, y, time) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      //重新计算可滚动高度
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      //继续监听上拉事件
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      //得到当前Y轴滚动距离
      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }
    },
    mounted() {
      //创建并保存BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,//解决点击链接无反应BUG
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      //监听滚动事件,probeType不为0、1时生效
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          //发射事件让父组件接收滚动位置的数据
          this.$emit('scroll', position)
        })
      }

      //监听上拉事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    }
  }
</script>

<style scoped>

</style>