<template>
  <div id="home">
    <!--首页顶部导航-->
    <NavBar class="home-nav">
      <div slot="center">购物街</div>
    </NavBar>

    <!--栏目切换的副本-->
    <TabControl :titles='["流行","新款","精选"]'
                class="tab-control"
                @tabClick="tabClick"
                ref="tabControl1" v-show="isTabFixed"/>

    <Scroll class="content" ref="scroll"
            :probeType="3"
            :pullUpLoad="true"
            @scroll="contentScroll"
            @pullingUp="loadMore">
      <!--首页轮播-->
      <HomeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <!--首页推荐-->
      <RecommendView :recommends="recommends"/>
      <!--本周流行-->
      <FeatureView/>
      <!--栏目切换-->
      <TabControl :titles='["流行","新款","精选"]'
                  @tabClick="tabClick"
                  ref="tabControl2"/>
      <!--商品展示-->
      <GoodsList :goods='showGoods'/>
    </Scroll>

    <BackTop @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  //首页专用子组件
  import HomeSwiper from './childcomps/HomeSwiper'
  import RecommendView from './childcomps/RecommendView'
  import FeatureView from './childcomps/FeatureView'
  //公共组件
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from 'components/content/backTop/BackTop'
  //首页数据
  import {getHomeMultidata, getHomeGoods} from 'network/home'

  import {debounce} from 'common/utils'
  import {itemListenerMixin,backTopMixin} from 'common/mixin'

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll
    },
    data() {
      return {
        //保存请求的数据
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        tabOffsetTop: 0, //记录tabControl与顶部的初始距离
        isTabFixed: false,
        saveY:0, //保存离开时的滚动位置
      }
    },
    created() {
      //请求轮播、推荐数据
      this.getHomeMultidata();
      //请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    activated() { //组件活跃时
      this.$refs.scroll.scrollTo(0,this.saveY,1)
      //重新计算可滚动高度
      this.$refs.scroll.refresh()
    },
    deactivated() { //组件由活跃->不活跃时
      //离开页面时保存当前滚动位置
      this.saveY=this.$refs.scroll.getScrollY()
      //离开页面时取消全局事件监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    //采取混入
    mixins:[itemListenerMixin,backTopMixin],
    // mounted() {
    //   //调用防抖函数，100毫秒调用一次refresh重新计算高度
    //   const refresh = debounce(this.$refs.scroll.refresh, 100)
    //   //监听item中图片加载完成
    //   this.itemImgListener=() => {
    //     refresh()
    //   }
    //   this.$bus.$on('itemImageLoad', this.itemImgListener)
    // },
    methods: {
      //请求数据的有关方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        //将当前页码的值加一
        const page = this.goods[type].page + 1;
        //请求下一页数据
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //每加载完一页数据，调用该方法使上拉事件能够继续被监听
          this.$refs.scroll.finishPullUp()
        })
      },
      //事件监听的有关方法
      tabClick(index) {
        switch (index) {
          case 0: {
            this.currentType = 'pop';
            break;
          }
          case 1: {
            this.currentType = 'new';
            break;
          }
          case 2: {
            this.currentType = 'sell';
            break;
          }
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position) {
        //判断backTop什么时候显示
        if (-position.y > 1000) {
          this.isShowBackTop = true
        } else {
          this.isShowBackTop = false
        }
        //决定tabControl吸顶的时刻
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }

  .tab-control {
    position: relative;
    z-index: 10;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

</style>
