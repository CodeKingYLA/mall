import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop'

//混入
// 多个组件相同代码的抽取复用

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null //属性将被添加到组件对象，而不是替换
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 100)

    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)

  }
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop:false
    }
  },
  methods:{
    //返回顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
  },
  components:{
    BackTop
  }
}