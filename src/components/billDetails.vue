<template>
<div class="body">
<div class='div'></div>
  <div class='bill-true'>
    <div class='group'>
    <div class='list'>订单编号
        <div>{{detail.orderNo}}</div>
      </div>
      <div class='list'>停车场
        <div>{{detail.prefectureName}}</div>
      </div>
      <div class='list'>车牌号
        <div>{{detail.plateNumber}}</div>
      </div>
      <div class='list'>车位号
        <div>{{detail.stallName}}</div>
      </div>
      <div class='list'>订单状态
        <div v-if="detail.status == 3">已完成</div>
        <div v-else-if="detail.status == 4">已取消</div>
        <div  v-else-if="detail.status != 4 && detail.status != 3 && detail.status != -1">已关闭</div>
      </div>
      <div class='list'>预约时间
        <div>{{detail.orderTime}}</div>
      </div>
      <div class='list'>开始时间
        <div>{{detail.startTime}}</div>
      </div>
      <div class='list'>结束时间
        <div>{{detail.endTime}}</div>
      </div>
      <div class='list'>支付时间
        <div>{{detail.payTime}}</div>
      </div>
      <div class='list'>支付方式
        <div v-if="detail.payType==1">免费</div>
        <div v-else-if="detail.payType==2">停车券</div>
        <div v-else-if="detail.payType==3">账户</div>
        <div v-else-if="detail.payType==4">支付宝</div>
        <div v-else-if="detail.payType==5">微信</div>
        <div v-else-if="detail.payType==6">银联ApplePay</div>
        <div v-else-if="detail.payType==7">微信</div>
        <div v-else-if="detail.payType==8">银联云闪付</div>
        <div v-else-if="detail.payType==9">Huawei Pay</div>
        <div v-else-if="detail.payType==10">Mi Pay</div>
        <div v-else-if="detail.payType==11">建行龙支付</div>
      </div>
      <div class='list'>停车费
        <div>{{detail.totalAmount + '元'}}</div>
      </div>
      <div class='list'>停车券
        <div>{{detail.couponAmount + '元'}}</div>
      </div>
      <div class='list'>实付金额
        <div>{{detail.actualAmount + '元'}}</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import axios from "@/libs/api.request";
import Url from "@/libs/url";
export default {
    data(){
        return{
            data:"",
            detail:{
                status:-1,
                actualAmount:'',
                couponAmount:'',
                totalAmount:'',
            }
        }
    },
    created(){
        let that = this
        that.lists()
    },
    methods:{
        lists(){
            let that = this
            let orderId = that.$route.query.orderId;
            // console.log(orderId)
            axios.request({
                url:Url.url.detail,
                 params: {
                    orderId: orderId
                    }
            }).then(res => {
                if(res.status == true){
                    let detail = res.data 
                      function formatDate(now) {
                      var year = now.getFullYear();
                    //   console.log(year)
                      var month = now.getMonth() + 1;
                      var date = now.getDate();
                      var hour = now.getHours();
                      var minute = now.getMinutes();
                      var second = now.getSeconds();
                      return year + "/" + (month < 10 ? '0' + month : month) + "/" + (date < 10 ? '0' + date : date) + "/" + " " + (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute)
                    }
                     detail.startTime = formatDate(new Date(detail.startTime))
                     detail.endTime =  formatDate(new Date(detail.endTime))
                     detail.orderTime =  formatDate(new Date(detail.orderTime))
                     detail.payTime = formatDate(new Date(detail.payTime))
                     detail.totalAmount = detail.totalAmount.toFixed(2);
                     detail.couponAmount = detail.couponAmount.toFixed(2);
                     detail.actualAmount = detail.actualAmount.toFixed(2);
                     that.detail = detail
                }else{
                    that.bus.$emit("tips", { show: true, title: res.message.content})
                }
                // console.log(res)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.body{
    width: 100%;
    height: 100%;
}
    .div{
  width: 100%;
  height: 20px;
  background: #fafafa;
}
.bill-true{
  width: 100%;
  background: #fff;
  margin-top: 20px;
}
.group{
  width: 690px;
  margin-left: 30px; 
}
.list{
  width: 100%;
  height: 80px;
  border-bottom: 1px solid rgb(241, 241, 240);
  line-height: 80px;
  font-size: 30px;
  color: #333;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.lists{
  width: 100%;
  height: 80px;
  border-bottom: 1px solid rgb(241, 241, 240);
  line-height: 80px;
  font-size: 30px;
  color: #333;
}
</style>


