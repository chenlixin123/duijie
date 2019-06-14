<template>
<div class="body">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" v-if="billList != ''">
    <div class='bill-list'>
  <div class='group' v-for="(item,index) in billList" :key="index"  @click='goBillDetail(item)'>
    <div class='order-list'>
      <div class='order-new'>
        <div class='order-name'>
          {{item.prefectureName}}
        </div>
        <div class='order-tai' v-if="item.status == 3">
          <div class="text">
              已完成
          </div>
          <div class='img'>
             <img src='@/assets/dingdanliebiao_jiantou@3x.png' width="100%">
          </div>
        </div>
        <div class='order-tai' v-else-if="item.status == 4">
          <div class="text">
              已取消
          </div>
          <div class="img">
               <img src='@/assets/dingdanliebiao_jiantou@3x.png' width="100%">
          </div>
        </div>
        <div class='order-tai' v-else>
          <div class="text">
              已关闭
          </div>
          <div class="img">
              <img src='@/assets/dingdanliebiao_jiantou@3x.png' width="100%">
          </div>
        </div>
      </div>
      <div class='order-time'>
        {{item.orderTime}}
      </div>
      <div class='order-timer'>
        <div>使用时长：{{item.parkingTime}}</div>        
        <div>￥{{item.totalAmount}}</div>
      </div>
    </div>
  </div>
</div>
</div>
<div v-if="billList == ''" class='zan'>
    <div class="zero_img">
        <img src='@/assets/zanwuchepaihao@2x.png' width="100%">
    </div>
    <div>暂无订单</div>
  </div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import Url from "@/libs/url";
export default {
    data(){
        return{
            data:'',
            billList:null,
            start:-1
        }
    },
    created(){
        let that = this
    },
    methods:{
        // 进入详情页面
        goBillDetail(item){
                console.log(item.id)
                let that = this
                let orderId = item.id
                that.$router.push({
                    path:'/billDetails',
                    query:{
                        orderId:orderId
                    }
                })

        },
        // 上拉加载更多
       loadMore() {
         let that = this
         let data = []
         that.busy = true
        //  console.log('11111')
            that.bus.$emit("loading", true);
            that.bus.$emit("tip", { title: "加载中请稍候..." });
            axios.request({
                url:Url.url.by_list,
                params: {
                    start: that.start += 1,
                    orderFlag:1
                    },
            }).then(res => {
                // console.log(that.start)
                that.bus.$emit("loading", false)
                // console.log(res)
                if(res.status == true){
                    if(that.start == 0){
                      // let data = []
                      // for(let i = 2 ; i < 5; i++){
                      //     data.push(res.data[i])
                      // }
                      // console.log(data)
                    res.data.forEach(res => {
                       res.orderTime =  res.orderTime.slice(2, 17)
                    })
                    that.billList = res.data
                    }else{
                        if(res.data.length == 0){
                            that.bus.$emit("tips", { show: true, title: '没有更多数据'})
                        }else{
                            res.data.forEach(res => {
                            res.orderTime =  res.orderTime.slice(2, 17)
                    })
                            that.billList = that.billList.concat(res.data)
                        }
                    }
                    // console.log(that.billList)
                }else{
                     that.bus.$emit("tips", { show: true, title: res.message.content})
                }
            })
            that.busy = false
       }
    }
}
</script>

<style lang="scss" scoped>
    .body{
  background: #f5f4f4;
  width: 100%;
  min-height: 100%;
}
.bill-list{
  width: 100%;
  box-sizing: border-box;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.group{
  width: 690px;
  /* height: 208px; */
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}
.order-list{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.order-new{
  width: 95%;
  display: flex;
  justify-content: space-between;
  margin-top: 27px;
}
.order-name{
  font-size: 30px;
  color: #333333;
}
.order-tai{
  font-size: 26px;
  color: #999999;
  display: flex;
  .text{
    width: 100%;
    height: 100%;
    // border: 1px solid;
  }
}
.img{
  width: 12px;
  margin: auto;
  margin-left: 10px;
  box-sizing: border-box;
  padding-bottom: 5px;
  // border: 1px solid;
}
.order-time{
  width: 95%;
  font-size: 28px;
  color: #666666;
  margin: 27px 0;
}
.order-timer{
  width: 92%;
  font-size: 28px;
  color: #666666;
  display: flex;
  justify-content: space-between;
  margin-bottom: 27px;
  padding: 0 18px;
}

.zan{
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 34px;
  color: #666666;
  padding-top: 43%;
}
.zero_img{
  width: 276px;
  height: 182px;
  margin: 0 auto;
  margin-bottom: 44px;
  /* margin: 45% auto; */
}
</style>


