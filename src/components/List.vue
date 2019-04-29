<template>
  <div class="page">
    <div class="body" v-for="(item,index) in msg" :key="index">
        <div class="box_title">车区名称:{{item.name}}</div>
        <div class="car_where">车区地址:{{item.address}}</div>
        <button class="btn_appointment" @click="park(item)">预约停车</button>
        <button class="btn_long" @click="mypark">我的车位</button>
    </div>

    <!-- 首部长租车位黄色提示框-->
    <div class="module" v-if="show == 'true'" @click="mypark">
      <img class="weizhi" src="@/assets/chewei@2.png">
      <div class="text">您正在使用{{long_name}}[{{names}}]车位</div>
      <img class="you" src="@/assets/you@2.png">
    </div>
      <!-- 首部预约车位橘黄色提示框-->
    <div class="modules" v-if="appointments == 'true'" @click="parks">
      <img class="weizhi" src="@/assets/yuyue@2x.png">
      <div class="text">您已预约{{long_name}}[{{names}}]车位</div>
      <img class="you" src="@/assets/you@2.png">
    </div>
  </div>
  
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import Url from "@/libs/url";
export default {
  name: "List",
  data() {
    return {
      msg: [],
      long_name: "",
      names: "",
      shows: "",
      show: "",
      appointment:'',
      appointments:'false',
    };
  },
  created() {
    let that = this;
    let token = Cookies.get("tokens");
     window.jhajax = this.jhajax;
    this.jhajax(token);
     axios
        .request({
          url: Url.url.current
        })
        .then(res => {
          console.log(res)
          that.appointment = res.data
          if(res.data == null){
            that.appointments = 'false'
          }else{
            that.long_name = res.data.prefectureName,
            that.names = res.data.stallName
            that.appointments = 'true'
          }
        })
    // window.jhajax({
    //   token:'e6e3d2145d5b46c1a2caa072c1771c96',
    //   data:1,
    //   groupId:64,
    //   })
    //  window.jhajax(
    //   token='c2fb6980c0284a99ba3ef24a96ec6c6a',
    //   )

    axios
      .request({
        url: Url.url.long_current,
        method: "get"
      })
      .then(res => {
        console.log(res);
        if (res.data.status == false) {
          (that.shows = "none"), localStorage.setItem("oo", false);
          that.show = localStorage.getItem("oo");
        } else {
          (that.shows = "block"),
            (that.names = res.data.stallName),
            (that.long_name = res.data.preName);
          localStorage.setItem("oo", true);
          that.show = localStorage.getItem("oo");
          localStorage.setItem("num", res.data.stallNumber);
        }
      });
  },
  methods: {
    jhajax(token) {
      let that = this
      // alert(token);
       that.bus.$emit("loading", true);
       that.bus.$emit("tip", { title: "加载中请稍候..." });
     var u = navigator.userAgent;
     console.log(u)
      console.log(token);
      Cookies.set("tokens", token);
      axios
        .request({
          url: Url.url.car_list,
          method: "get"
        })
        .then(res => {
          this.msg = res.data;
           that.bus.$emit("loading", false);
          console.log(res);
        });
    },
    park(item) {
      console.log(item);
      let that = this
      let oo = localStorage.getItem("oo");
      let token = Cookies.get("tokens");
      if (oo == "true") {
        alert("您正在使用长租车位");
      } else {
          if(that.appointment == null){
                 this.$router.push({
          path: "/Parking",
          query: {
            groupId: item.groupId,
            token:token
          }
        });
          }else{
             that.$router.push({
              path: "/Order"
            });
          }
       
      }
    },
    parks(){
      let that = this
         that.$router.push({
              path: "/Order"
            });
    },
    mypark() {
      console.log('长租');
      let token = Cookies.get("tokens");
      let oo = localStorage.getItem("oo");
      console.log(oo);
      if (oo == "true") {
        console.log("详情页");
        this.$router.push({
          path: "/Park"
        });
      } else {
        console.log("车位页");
        this.$router.push({ 
          path: "/Choice",
          query:{
            token:token
          }
           });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body,
html {
  background: #f5f4f4 !important;
}
.page {
  width: 100%;
  height: 100%;
  background: #f5f4f4;
  box-sizing: border-box;
  padding-top: 24px;
}
.body{
  width: 690px;
  background: white;
  margin: 0 auto;
  margin-bottom: 30px;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 34px 30px 32px 30px;
}
.box_title{
  font-size: 30px;
  color: #333;
}
.car_where{
  font-size: 26px;
  color: #666;
  margin-top: 28px;
  margin-bottom: 32px;
}
.btn_appointment{
  width: 134px;
  height: 46px;
  line-height: 46px;
  font-size: 24px;
  color: #f66913;
  background: white;
  border-radius: 10px;
  margin-left: 310px;
  border:1px solid #f66913;
  outline: none;
}
.btn_long{
   width: 134px;
  height: 46px;
  line-height: 46px;
  font-size: 24px;
  color: #faa901;
  background: white;
  border-radius: 10px;
  margin-left: 20px;
  border:1px solid #faa901;
  outline: none;
}

.module {
  width: 690px;
  height: 60px;
  line-height: 60px;
  border-radius: 60px;
  background: #faa901;
  opacity: 0.68;
  position: absolute;
  top: 0px;
  left: 30px;
  align-items: center;
  font-size: 28px;
  color: #ffffff;
  box-sizing: border-box;
}
.modules {
  width: 690px;
  height: 60px;
  line-height: 60px;
  border-radius: 60px;
  background: #f66913;
  opacity: 0.68;
  position: absolute;
  top: 0px;
  left: 30px;
  align-items: center;
  font-size: 28px;
  color: #ffffff;
  box-sizing: border-box;
}
.weizhi {
  width: 26px;
  height: 26px;
  margin-top: 17px;
  margin-left: 50px;
  margin-right: 20px;
  float: left;
}
.you {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 48px;
  bottom: 14px;
}
.text {
  width: 73%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
