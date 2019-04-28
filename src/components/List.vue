<template>
  <div class="page">
    <div class="head">
      <div class="head-list">
        <!-- <img src="@/assets/fanhui@3x.png"> -->
        <div class="head-name">车区列表</div>
        <div class="mypark" @click="mypark()">我的车位</div>
      </div>
    </div>
    <div class="body">
      <div class="body-content" v-for="(item,index) in msg" :key="index">
        <div class="body-body">
          <div class="content-name">{{item.name}}</div>
          <div class="content-di">{{item.address}}</div>
          <div class="content-btm">
            <div class="content-time">
              <div class="content-money">
                <div class="content-mons">{{item.chargePrice}}</div>
                <div class="moneys">元</div>
              </div>
              <div class="content-timer">{{item.chargeTime}}</div>
            </div>
            <div class="content-num">
              <div class="content-nums">
                <div class="content-nus">{{item.leisureStall}}</div>
                <div class="ge">个</div>
              </div>
              <div class="content-kong">空闲车位</div>
            </div>
            <div class="btn">
              <button @click="park(item)">预约停车</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 首部长租车位黄色提示框-->
    <div class="module" v-if="show == 'true'" @click="mypark">
      <img class="weizhi" src="@/assets/chewei@2.png">
      <div class="text">您正在使用{{long_name}}[{{names}}]车位</div>
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
      show: ""
    };
  },
  created() {
    let that = this;

    window.jhajax = this.jhajax;
    let token = Cookies.get("tokens");
    this.jhajax(token);
    // window.jhajax({
    //   token:'e6e3d2145d5b46c1a2caa072c1771c96',
    //   data:1,
    //   groupId:64,
    //   })

    axios
      .request({
        url: Url.url.long_current,
        method: "get"
      })
      .then(res => {
        console.log(res);
        console.log(that.ss);
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
      // alert(token);
      console.log(token);
      Cookies.set("tokens", token.token);
      axios
        .request({
          url: Url.url.car_list,
          method: "get"
        })
        .then(res => {
          this.msg = res.data;
          console.log(res);
        });
    },
    park(item) {
      console.log(item);
      let oo = localStorage.getItem("oo");
      if (oo == "true") {
        alert("您正在使用长租车位");
      } else {
        this.$router.push({
          path: "/Parking",
          query: {
            groupId: item.groupId
          }
        });
      }
    },
    mypark() {
      let oo = localStorage.getItem("oo");
      console.log(oo);
      if (oo == "true") {
        console.log("详情页");
        this.$router.push({
          path: "/Park"
        });
      } else {
        console.log("车位页");
        this.$router.push({ path: "/Choice" });
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
}
.head {
  width: 100%;
  height: 92px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.head-list {
  width: 95%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.head-name {
  font-size: 38px;
  color: #333;
  margin: auto;
}
.mypark {
  font-size: 32px;
  color: #666;
  position: absolute;
  right: 30px;
}
.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.body-content {
  width: 95%;
  height: 324px;
  border-radius: 14px;
  margin-top: 26px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.body-body {
  width: 90%;
  height: 90%;
  /* background: saddlebrown; */
}
.content-name {
  font-size: 32px;
  color: #333;
  margin-top: 16px;
}
.content-di {
  font-size: 28px;
  color: #999;
  border-bottom: 1px solid #f5f3f3;
  margin-top: 24px;
  padding-bottom: 24px;
}
.content-btm {
  width: 100%;
  /* background: red; */
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 28px;
}
.content-time {
  text-align: center;
}
.content-money {
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-mons {
  font-size: 36px;
  font-weight: bold;
  color: #999;
}
.moneys {
  font-size: 28px;
  color: #999;
}
.content-timer {
  font-size: 28px;
  color: #999;
}
.content-nums {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}
.content-nus {
  font-size: 36px;
  font-weight: bold;
  color: #f66913;
}
.ge {
  font-size: 28px;
  color: #999;
}
.content-kong {
  font-size: 28px;
  color: #999;
}
.btn button {
  height: 60px;
  border: 1px solid #f66913;
  border-radius: 8px;
  color: #f66913;
  font-size: 28px;
  background: #fff;
  outline: none;
}
.btns button {
  height: 60px;
  border: 1px solid rgb(224, 219, 219);
  border-radius: 8px;
  color: gray;
  font-size: 28px;
  background: rgb(224, 219, 219);
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
  top: 80px;
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
