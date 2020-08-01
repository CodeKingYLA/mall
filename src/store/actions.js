export default {
  addCart(context, payload) {
   return new Promise((resolve, reject)=>{
     let oldProduct = null
     for (let item of context.state.cartList) {
       //判断carList中是否已经存在添加进来的商品
       if (item.iid === payload.iid) {
         oldProduct = item //一旦state(carList)中已经存在该商品，就让oldProduct指向carList中保存的那个商品
       }
     }

     if (oldProduct) {  //oldProduct有指向，说明cartList中已保存该商品
       resolve('商品数量 +1')
       context.commit('addCounter',oldProduct)  //将该商品的count加一
     } else { //否则cartList中并无该商品，
       payload.count = 1
       resolve('成功添加至购物车')
       context.commit('addToCart',payload) //将商品的count值赋1，并插入购物车(cartList)
     }
   })
  }
}