/*详情页的数据请求*/

import {request} from './request'

//请求对应商品的所有数据
export function getDetail(iid) {
  return request({
    url:'/detail',
    params:{
      iid
    }
  })
}

//请求推荐数据
export function getRecommend() {
  return request({
    url:'/recommend'
  })
}

//该方法将杂乱的数据取出重点(价格、收藏等)数据，封装到对象中
export class Goods {
  constructor(itemInfo, columns, services) {
      this.title = itemInfo.title,
      this.desc = itemInfo.desc,
      this.newPrice = itemInfo.price,
      this.oldPrice = itemInfo.oldPrice,
      this.discount = itemInfo.discountDesc,
      this.columns = columns,
      this.services = services,
      this.realPrice = itemInfo.lowNowPrice
  }
}

//取出与店铺有关的数据封装到对象
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

//取出服装参数数据
export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}
