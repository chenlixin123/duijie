<template>
  <div class="page">
    <!-- 选车位弹框 -->
    <div class="box" v-if="show == 'true'">
      <div class="content">
        <div class="top">请选择车位</div>
        <div class="bottom" @click="close_box">确定</div>
      </div>
    </div>

    <!--  <div class="head">
      <div class="head-list">
        <img src="@/assets/fanhui@3x.png" @click="back">
        选择车位
      </div>
    </div>-->
    <div class="body" v-for="(item,index) in parkname" :key="index">
      <div class="body-content">
        <div class="body-name">{{item.preName}}</div>
        <div class="body-num">
          <div
            :class=" ss == index ? 'vals': 'val'"
            v-for="(val , index) in data"
            :key="index"
            v-if="val.status == 1"
            @click="chose"
            :data-index="index"
            :data-battery="val.battery"
            :data-mobile="val.mobile"
            :data-plate="val.plate"
            :data-stallEndTime="val.stallEndTime"
            :data-stallName="val.stallName"
            :data-preId="item.preId"
            :data-preName="item.preName"
            :data-gatewayStatus="val.gatewayStatus"
            :data-stallId="val.stallId"
            :data-latitude="item.latitude"
            :data-longitude="item.longitude"
          >{{val.stallName}}</div>
          <div
            class="vals"
            v-for="(val , index) in data"
            :key="index"
            v-if="val.status == 2"
            @click="chose"
            :data-index="index"
            :data-battery="val.battery"
            :data-mobile="val.mobile"
            :data-plate="val.plate"
            :data-stallEndTime="val.stallEndTime"
            :data-stallName="val.stallName"
            :data-preId="item.preId"
            :data-preName="item.preName"
            :data-gatewayStatus="val.gatewayStatus"
            :data-stallId="val.stallId"
            :data-latitude="item.latitude"
            :data-longitude="item.longitude"
          >{{val.stallName}}</div>
        </div>
      </div>
    </div>
    <div class="btn" @click="que">确认车位</div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import Url from "@/libs/url";
import Cookies from "js-cookie";
export default {
  name: "Choice",
  data() {
    return {
      longitude: "120",
      latitude: "30",
      parkname: [],
      ss: -1,
      battery: "",
      mobile: "",
      plate: "",
      stallEndTime: "",
      stallName: "",
      preId: "",
      preName: "",
      gatewayStatus: "",
      stallId: "",
      data: [],
      show: "false"
    };
  },
  created() {
    let that = this;
    that.bus.$emit("loading", true);
    that.bus.$emit("tip", { title: "加载中请稍候..." });
    that.token = that.$route.query.token;
    console.log(that.token);
    if (that.token == undefined) {
      that.token = localStorage.getItem("token");
      console.log(that.token);
    } else {
      that.token = that.$route.query.token;
      console.log(that.token);
    }
    Cookies.set("tokens", that.token);
    localStorage.setItem("token", that.token);
    axios
      .request({
        url: Url.url.long_current,
        method: "get"
      })
      .then(res => {
        that.bus.$emit("loading", false);
        console.log(res);
        let path = localStorage.getItem("path");
        console.log(path);
        if (path == 1) {
          if (res.data.status == true) {
            localStorage.setItem("oo", true);
            that.$router.go(-1)
            // that.$router.push({
            //   path: "/Park"
            // });
            // var u = navigator.userAgent;
            // android终端
            // var isAndroid = u.indexOf("wehome/1") > -1;
            // var isiOS = u.indexOf("wehome/2") > -1;
            // ios终端
            // if (isiOS) {
            //   window.finish_current_activity_webView("", "");
            // } else if (isAndroid) {
            //   window.jsObject.finish_current_activity_webView("", "");
            // }
            localStorage.setItem("path", 2);
          } else {
            this.carlist();
            localStorage.setItem("oo", false);
          }
        } else {
          if (res.data.status == true) {
            localStorage.setItem("oo", true);
            that.$router.push({
              path: "/Park"
            });
          } else {
            this.carlist();
            localStorage.setItem("oo", false);
          }
        }
      });
  },
  methods: {
    //关闭弹框
    close_box() {
      let that = this;
      that.show = "false";
    },
    //渲染车位列表
    carlist() {
      var that = this;
      console.log(that.$route.query);
      if (that.$route.query.switchFlag == 1) {
        console.log("等于1");
        axios
          .request({
            url: Url.url.long_carList,
            method: "post",
            params: {
              latitude: this.latitude,
              longitude: this.longitude,
              switchFlag: 1
            }
          })
          .then(res => {
            console.log(res);
            localStorage.setItem("num", res.data.num);
            that.parkname = res.data.res;
            res.data.res.map(res => {
              that.data = res.stalls;
              console.log(that.data);
            });
          });
      } else {
        console.log("不等于1");
        axios
          .request({
            url: Url.url.long_carList,
            method: "post",
            params: {
              latitude: this.latitude,
              longitude: this.longitude
            }
          })
          .then(res => {
            console.log(res.data.num);
            localStorage.setItem("num", res.data.num);
            if (res.data.num > 0) {
              that.parkname = res.data.res;
              res.data.res.map(res => {
                that.data = res.stalls;
                console.log(that.data);
              });
            } else {
              console.log("没有长租车位");
            }
          });
      }
    },
    //返回上一页
    back() {
      this.$router.go(-1);
    },
    //点击车位
    chose(e) {
      console.log(e.target.dataset);
      this.ss = e.target.dataset.index;
      this.battery = e.target.dataset.battery;
      this.mobile = e.target.dataset.mobile;
      this.plate = e.target.dataset.plate;
      this.stallendtime = e.target.dataset.stallendtime;
      this.stallName = e.target.dataset.stallname;
      this.preId = e.target.dataset.preid;
      this.preName = e.target.dataset.prename;
      this.gatewayStatus = e.target.dataset.gatewaystatus;
      this.stallId = e.target.dataset.stallid;
      this.latitude = e.target.dataset.latitude;
      this.longitude = e.target.dataset.longitude;
    },
    que() {
      if (this.ss == -1) {
        this.show = "true";
      } else {
        this.$router.push({
          path: "/Park",
          query: {
            battery: this.battery,
            mobile: this.mobile,
            plate: this.plate,
            stallEndTime: this.stallendtime,
            stallName: this.stallName,
            preId: this.preId,
            preName: this.preName,
            gatewayStatus: this.gatewayStatus,
            stallId: this.stallId,
            longitude: this.longitude,
            latitude: this.latitude
          }
        });
        console.log(this.plate);
      }
    }
  }
};
</script>

<style scoped lang='scss'>
body,
html {
  width: 100%;
  height: 100%;
  background: #f5f4f4;
}
.page {
  width: 100%;
  height: 100%;
  background: #f5f4f4;
}
.head {
  width: 100%;
  height: 92px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #f5f4f4;
}
.head-list {
  width: 95%;
  height: 100%;
  line-height: 92px;
  background: #fff;
  text-align: center;
  position: relative;
}
.head-list img {
  width: 22px;
  height: 36px;
  position: absolute;
  left: 0;
  top: 30px;
}
.body {
  width: 100%;
  /* height: 300px; */
  background: #fff;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
}
.body-content {
  width: 95%;
  height: 100%;
}
.body-name {
  font-size: 32px;
  color: #333;
  margin-top: 44px;
  margin-bottom: 38px;
}
.body-num {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.val {
  width: 170px;
  height: 68px;
  border-radius: 10px;
  text-align: center;
  line-height: 68px;
  border: 1px solid #f5f4f4;
  margin-right: 61px;
  margin-bottom: 38px;
}
.vals {
  width: 170px;
  height: 68px;
  border-radius: 10px;
  text-align: center;
  line-height: 68px;
  border: 1px solid #f5f4f4;
  color: white;
  margin-right: 61px;
  margin-bottom: 38px;
  background: #f66913;
}
.btn {
  width: 100%;
  height: 94px;
  background: #f66913;
  color: #fff;
  font-size: 34px;
  text-align: center;
  position: fixed;
  bottom: 0;
  line-height: 94px;
}
.box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  .content {
    width: 80%;
    background: white;
    margin: 55% auto;
    border-radius: 10px;
    .top {
      width: 100%;
      height: 150px;
      line-height: 150px;
      text-align: center;
      font-size: 32px;
    }
    .bottom {
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border-top: 1px solid rgb(226, 222, 222);
      font-size: 38px;
    }
  }
}
</style>
