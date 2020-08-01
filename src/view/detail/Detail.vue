<template>
  <div id="detail">
    <!--详情页导航-->
    <DetailNavBar class="detail-nav" @itemClick="itemClick" ref="nav"/>

    <!--局部滚动-->
    <Scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <!--详情页轮播图-->
      <DetailSwiper :top-images="topImages"/>
      <!--商品基本信息-->
      <DetailBaseInfo :goods="goods"/>
      <!--店铺信息-->
      <DetailShopInfo :shop="shop"/>
      <!--商品详细介绍-->
      <DetailGoodsInfo :detailInfo="detailInfo" @imgLoad="imgLoad"/>
      <!--商品参数-->
      <DetailParamInfo :param-info="paramInfo" ref="params"/>
      <!--评论区-->
      <DetailCommentInfo :comment-info="commentInfo" ref="comment"/>
      <!--推荐-->
      <GoodsList :goods="recommends" ref="recommends"/>
    </Scroll>
    <!--返回顶部-->
    <BackTop @click.native="backClick"  v-show="isShowBackTop"/>
    <!--加入购物车导航-->
    <DetailBottomBar @addCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from "./childComps/DetailSwiper"
  import DetailBaseInfo from "./childComps/DetailBaseInfo"
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from "./childComps/DetailParamInfo"
  import DetailCommentInfo from "./childComps/DetailCommentInfo"
  import DetailBottomBar from "./childComps/DetailBottomBar"
  import BackTop from 'components/content/backTop/BackTop'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail"
  import {debounce} from 'common/utils'
  import {itemListenerMixin,backTopMixin} from "common/mixin";
  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      //保存所选商品的id
      this.iid = this.$route.params.iid


      //根据id请求对应商品的详情数据
      getDetail(this.iid).then((res) => {
        const data = res.result
        //保存顶部轮播图数据
        this.topImages = res.result.itemInfo.topImages

        //保存商品基本数据信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //保存商品店铺的信息
        this.shop = new Shop(data.shopInfo)

        //保存商品详细介绍
        this.detailInfo = data.detailInfo

        //保存商品的参数数据
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

      })

      //请求推荐数据
      getRecommend().then((res) => {
        this.recommends = res.data.list
      })

      //防抖(最终结果是每200毫秒才执行一次该回调函数)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      }, 200)
    },
    mixins: [itemListenerMixin,backTopMixin],
    destroyed() {
      //离开详情页时取消该事件监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList
    },
    methods: {
      ...mapActions(["addCart"]),
      imgLoad() {
        //每加载完图片，重新计算滚动高度
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },

      //监听点击navbar所发出的事件，将页面定位到对应位置
      itemClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },

      //处理监听滚动事件的函数
      contentScroll(position) {
        const positionY = -position.y
        let length = this.themeTopYs.length
        for (let i = 0; i < length; i++) {
          if (this.currentIndex !== i && (i < length && positionY >= this.themeTopYs[i] && positionY <
            this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i])) {
            this.currentIndex=i
            this.$refs.nav.currentIndex=this.currentIndex
          }
        }

        //判断backTop什么时候显示
        if (-position.y > 2000) {
          this.isShowBackTop = true
        } else {
          this.isShowBackTop = false
        }
      },

      //加入购物车
      addToCart(){
        //获取商品的部分(需要在购物车展示的)信息,封装到对象中
        const product={}
        product.image=this.topImages[0]
        product.title=this.goods.title
        product.desc=this.goods.desc
        product.price=this.goods.realPrice
        product.iid=this.iid
        //把信息传递给store中的state中的cartList保存
        this.addCart(product).then((res)=>{
          this.$toast.show(res,2000)
        })
      }
    }
  }

</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 10;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 10;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
    overflow: hidden;
    position: absolute;
    top: 44px;
  }


</style>