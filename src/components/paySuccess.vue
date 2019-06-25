<template>
    <div class="pay">
        <div class="paymoney">
            <div class="success">支付成功</div>
            <div class="money">￥{{data.stotalAmount}}</div>
        </div>
        <div class="body">
            <div class="body-content">
                <div class="body-num">
                    <span>车位号</span>
                    <span>{{data.stallName}}</span>
                </div>
            </div>
            <div class="body-content">
                <div class="body-num">
                    <span>车牌号码</span>
                    <span>{{data.plateNumber}}</span>
                </div>
            </div>
             <div class="body-content">
                <div class="body-num">
                    <span>开始时间</span>
                    <span>{{start_Time}}</span>
                </div>
            </div>
             <div class="body-content">
                <div class="body-num">
                    <span>结束时间</span>
                    <span>{{end_Time}}</span>
                </div>
            </div>
             <div class="body-content">
                <div class="body-num">
                    <span>订单编号</span>
                    <span>{{data.orderNo}}</span>
                </div>
            </div>
             <div class="body-content">
                <div class="body-num">
                    <span>停车时长</span>
                    <span>{{data.parkingTime}}</span>
                </div>
            </div>
        </div>
        <div class="foot">
            <div class="foot-content">结账成功后，请在15分钟内驶离停车场</div>
            <button @click="suss">完成</button>
        </div>
    </div>
</template>
<script>
import axios from "@/libs/api.request";
import Url from "@/libs/url";
export default {
    name:"Pay",
    data(){
        return{
            pay:{
                money:'10.0',
                num:'088',
                parknum:'京N12584',
                starttime:'2019/4/6  20:00',
                endtime:'2019/4/6  21:25',
                ordernum:'2019040610000460',
                parktime:'1时15分',
                dismoney:'5.0'
            },
            data:{},
            start_Time:'',
            end_Time:''
        }
    },
    created(){
        let that = this
          let orderId = localStorage.getItem("orderId");
         axios
      .request({
        url: Url.url.verify,
        method: "get",
        params: {
          orderId: orderId
        }
      })
      .then(res => {
        console.log(res.data);
        if(res.status == true){
        that.data = res.data;
        that.start_Time = Url.Time(res.data.startTime);
        that.end_Time = Url.Time(res.data.endTime);
        }else{
          that.bus.$emit("tips", { show: true, title: res.message.content });
        }
      });
    },
    methods:{
        suss(){
    let that = this
    // that.$router.push({
    //     path:'/'
    // })
    let tap = localStorage.getItem('tap')
    if(tap == 1){
        that.$router.go(-5)
    }else{
         that.$router.go(-4)
    }
        }
    }
}
</script>

<style scoped>
.pay{
    width: 100%;
}
.paymoney{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 96px;
    color: #333;
    font-weight: bold;
}
.success{
    font-size: 32px;
    margin-bottom:18px;
}
.money{
    font-size: 46px;
}
.body{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.body-content{
    width: 95%;
    height: 98px;
}
.body-num{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30px;
    color: #333;
    border-bottom: 1px solid #f5f4f4;
}
.foot{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    margin-top: 32px;
}
.foot-content{
    width: 100%;
    margin-bottom: 82px;
    color: #f66913;
    color: 26px;
    text-align: center;
}
.foot button{
    width: 286px;
    height: 74px;
    border-radius: 12px;
    font-size: 36px;
    color: #333;
    outline: none;
    background: #fff;
    border: 1px solid #333;
}
</style>
