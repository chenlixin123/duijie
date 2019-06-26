<template>
  <div class="lockup">
    <!-- <div class="success">升锁成功</div> -->
    <div class="body">
      <div class="body-content">
        <div class="body-num">
          <span>停车场</span>
          <span>{{data.prefectureName}}</span>
        </div>
      </div>
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
          <span>停车时长</span>
          <span>{{parkingTime}}</span>
        </div>
      </div>
      <div class="body-content">
        <div class="body-num">
          <span>应付金额</span>
          <span>{{data.totalAmount}}</span>
        </div>
      </div>
      <div class="body-content">
        <div class="body-num">
          <span>实付金额</span>
          <span>{{data.totalAmount}}</span>
        </div>
      </div>
    </div>
    <div class="btn">
      <button @click="suss">确认支付</button>
    </div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import Url from "@/libs/url";
export default {
  name: "Lock",
  data() {
    return {
      pay: {
        money: "10.0",
        num: "088",
        parknum: "京N12584",
        starttime: "2019/4/6  20:00",
        endtime: "2019/4/6  21:25",
        ordernum: "2019040610000460",
        parktime: "1时15分",
        dismoney: "5.0"
      },
      data: {},
      start_Time: "",
      end_Time: "",
      system:'',
      parkingTime:''
    };
  },
  created() {
    let that = this;
    // console.log(Url.Time);
    let orderId = localStorage.getItem("orderId");
    console.log(orderId);
    axios
      .request({
        url: Url.url.checkout,
        method: "get",
        params: {
          orderId: orderId
        }
      })
      .then(res => {
        console.log(res);
        if(res.status == true){
             that.data = res.data;
        that.id = res.data.id
        that.start_Time = Url.Time(res.data.startTime);
        that.end_Time = Url.Time(res.data.endTime);

         let parkingTime = res.data.parkingTime + 1
         if (parkingTime < 60){
            that.parkingTime = parkingTime + '分'
            console.log(that.parkingTime)
        } else if (parkingTime > 59){
          that.parkingTime =  parseInt(parkingTime / 60) + '时' + ((parkingTime - parseInt(parkingTime / 60) * 60) < 1 ? '' : (parkingTime - parseInt(parkingTime / 60) * 60) + '分')
            console.log(that.parkingTime)
        }
        }else{
           that.bus.$emit("tips", { show: true, title: res.message.content });
        }
      });
  },
  methods: {
    suss() {
       let that = this
      // var u = navigator.userAgent;
      // alert(navigator.userAgent);

      // var u = navigator.userAgent;
      // // android终端
      // this.$router.push({
      //   path: "/"
      // });
      // window.location.href = "http://www.baidu.com"; // 跳转外部链接

      // var u = navigator.userAgent;
      // console.log(u)
      // android终端
      // var isAndroid = u.indexOf("wehome/1") > -1;
      // var isiOS = u.indexOf("wehome/2") > -1;
      // ios终端
      // if (isIos) {
        // alert(navigator.userAgent);
        // window.finish_current_activity_webView("", "");
        // alert("isiOS调用成功2");
      // } else if (isAndroid) {
        // alert(navigator.userAgent);
        // window.jsObject.finish_current_activity_webView("", "");
        // window.jsObject.open_in_new_activity_webView("1212");
        // alert("isAndroid调用成功2");
      // }


    var n = navigator.userAgent;
　　if (n.indexOf('Android') > -1 || n.indexOf('Linux') > -1) {
　　　　 that.system = 'android'
　　} else if (n.indexOf('iPhone') > -1) {
　　　　 that.system = 'ios'
　　}
      console.log(that.system)
        let Id = localStorage.getItem("orderId");
        console.log(Id)
      axios
          .request({
          url:Url.url.payPage,
          params:{
              appType:that.system,
              orderId:Id,
              successUrl:'https://web-blue.linkmoreparking.cn/#/pay'
          }
        }).then(res => {
          console.log(res)
          if(res.status == true){
              if(res.data.code == 200){
                console.log('11111111111111')
                   window.location.href = res.data.url
              }else{
                that.bus.$emit("tips", { show: true, title:'支付成功'});
                setTimeout(() => {
                  console.log('333333333333')
                      that.$router.push({
                          path:'/pay'
                })
                }, 1000);
              }

          }else{
          //   that.bus.$emit("tips", { show: true, title: res.message.content });
          }
        }) 
    }
  }
};
</script>
<style scoped>
.lockup {
  width: 100%;
  height: 100%;
}
.success {
  width: 100%;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 180px;
  margin-bottom: 132px;
}
.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.body-content {
  width: 95%;
  height: 98px;
}
.body-num {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  color: #333;
  border-bottom: 1px solid #f5f4f4;
}
.btn {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn button {
  width: 400px;
  height: 74px;
  border-radius: 40px;
  font-size: 36px;
  color: white;
  outline: none;
  background: #f66913;
  border: none;
  outline: none;
  margin-top: 126px;
}
</style>
