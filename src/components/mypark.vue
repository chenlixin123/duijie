<template>
  <div class="mypark">
    <!-- <div class="head">
      <div class="head-list">
        <img src="@/assets/fanhui@3x.png" @click="back">
        我的车位
      </div>
    </div>-->
    <div class="parknum">
      <figure class="img">
        <img src="@/assets/chepai@3x.png" width="100%">
      </figure>
      <div class="num">{{mypark.num}}</div>
      <div class="fault">
        <div class="faults" @click="qie" v-if="num > 1">
          <figure class="img1">
            <img src="@/assets/qiehuan@3x.png" width="100%">
          </figure>
          <div class="fault-txt">切换</div>
        </div>
        <div class="faultes">
          <figure class="img1">
            <img src="@/assets/guzhang@3x.png" width="100%">
          </figure>
          <div class="fault-txt">故障</div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="body-content">
        <div class="body-time">
          <span>状态</span>
          <span>{{mypark.flag}}</span>
        </div>
      </div>
      <div class="body-content">
        <div class="body-time">
          <span>电量</span>
          <span>{{mypark.tity}}</span>
        </div>
      </div>
      <div class="span"></div>
      <div class="body-content">
        <div class="body-time">
          <span>停车场</span>
          <span>{{mypark.parkname}}</span>
        </div>
      </div>
      <div class="body-content">
        <div class="body-time">
          <span>车牌号</span>
          <span>{{mypark.carname}}</span>
        </div>
      </div>
      <div class="body-content">
        <div class="body-time">
          <span>使用权限</span>
          <span>{{mypark.usetime}}</span>
        </div>
      </div>
    </div>
    <div class="foot">
      <button @click="top">升起地锁</button>
      <button @click="bottom">降下地锁</button>
    </div>

    <div class="starts" v-if="begins == 'block'">
      <div class="begin">
        <div class="con">{{aligns}}</div>
        <div class="fails"></div>
        <div class="caos">
          <div class="ones one" @click="xiao">取消</div>
          <div class="ones oo" @click="ones">{{ss}}</div>
        </div>
      </div>
    </div>

    <div class="boxss" v-if="show == true">
      <div class="bodyss">
        <div class="topss">您正在使用长租[{{mypark.num}}]车位</div>
        <div class="bottomsss" @click="shows">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import Url from "@/libs/url";
import Cookies from "js-cookie";
export default {
  name: "Mypark",
  data() {
    return {
      mypark: {
        flag: "",
        tity: "",
        num: "",
        parkname: "",
        carname: "",
        usetime: ""
      },
      self: true,
      loading: "false",
      loadingText: "",
      aligns: "",
      ss: "",
      s: "",
      begins: "none",
      show: "false",
      latitude: "",
      longitude: "",
      stallId: "",
      num: 1
    };
  },
  created() {
    let that = this;
    that.num = localStorage.getItem("num");
    console.log(that.num);
    that.bus.$emit("loading", true);
    that.bus.$emit("tip", { title: "加载中请稍候..." });
    localStorage.setItem("path", 1);
    that.token = localStorage.getItem("token");
    Cookies.set("tokens", that.token);
    console.log(this.$route.query);
    let oo = localStorage.getItem("oo");
    if (oo == "true") {
      axios
        .request({
          url: Url.url.long_carList,
          method: "post",
          params: {
            latitude: "30",
            longitude: "120"
          }
        })
        .then(res => {
          that.bus.$emit("loading", false);
          console.log(res);
          res.data.res.map(res => {
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            this.mypark.parkname = res.preName; //停车场名字
            res.stalls.map(re => {
              this.mypark.tity = re.battery + "%"; //电量
              this.mypark.carname = re.plate; //车牌号
              this.mypark.usetime = re.stallEndTime + "到期"; //到期时间
              this.mypark.num = re.stallName; //车位号
              this.stallId = re.stallId;
              if (re.gatewayStatus == 1) {
                this.mypark.flag = "在线";
              } else {
                this.mypark.flag = "离线";
              }
            });
          });
        });
    } else {
      that.bus.$emit("loading", false);
      if (this.$route.query.gatewayStatus == 1) {
        this.mypark.flag = "在线";
      } else {
        this.mypark.flag = "离线";
      }
      this.mypark.tity = this.$route.query.battery + "%"; //电量
      this.mypark.parkname = this.$route.query.preName; //停车场名字
      this.mypark.carname = this.$route.query.plate; //车牌号
      this.mypark.usetime = this.$route.query.stallEndTime + "到期"; //到期时间
      this.mypark.num = this.$route.query.stallName; //车位号
      this.latitude = this.$route.query.latitude; // 经纬度
      this.longitude = this.$route.query.longitude;
      this.stallId = that.$route.query.stallId;
    }
  },
  methods: {
    bottom() {
      console.log("降锁");
      let that = this;
      that.bus.$emit("loading", true);
      that.bus.$emit("tip", { title: "降锁中请稍候..." });
      if (that.self == true) {
        (that.loading = "block"),
          (that.loadingText = "降锁中请稍候"),
          (that.self = false);
        axios
          .request({
            url: Url.url.long_control,
            method: "post",
            params: {
              stallId: that.stallId,
              state: 1, // 1 降下地锁  2 升起地锁
              parkingStatus: 0 //0未知 1到达 2未到达
            }
          })
          .then(res => {
            console.log(res);
            if (res.status == true) {
              localStorage.setItem("oo", true);
              setTimeout(() => {
                that.bus.$emit("loading", false);
                that.bus.$emit("tips", { show: true, title: "降锁成功" });
              }, 1000);
              (that.loading = "none"), (that.self = true);
            } else {
              if (res.message != null) {
                if (res.message.code == 8005100) {
                  that.bus.$emit("loading", false);
                  (that.loading = "none"),
                    (that.self = true),
                    (that.aligns = res.message.content),
                    (that.ss = "再降一次"),
                    (that.s = 2),
                    (that.begins = "block"),
                    console.log(res.message.content);
                } else if (res.message.code == 8005102) {
                  console.log(res.message.content);
                  (that.aligns = res.message.content),
                    (that.ss = "故障上报"),
                    (that.s = 3),
                    (that.begins = "block"),
                    (that.loading = "none"),
                    that.bus.$emit("loading", false);
                  that.self = true;
                } else if (res.message.code == 8005093) {
                  console.log(res.message.content);
                  (that.aligns = res.message.content),
                    (that.ss = "切换车位"),
                    (that.s = 4),
                    (that.begins = "block"),
                    (that.self = true),
                    (that.loading = "none");
                  that.bus.$emit("loading", false);
                } else if (res.message.code == 8005073) {
                  (that.loading = "none"), (that.self = true);
                  that.bus.$emit("loading", false);
                  that.bus.$emit("tips", {
                    show: true,
                    title: res.message.content
                  });
                } else if (res.message.code == 8005072) {
                  (that.loading = "none"), (that.self = true);
                  that.bus.$emit("loading", false);
                  that.bus.$emit("tips", {
                    show: true,
                    title: res.message.content
                  });
                }
              }
            }
          });
      }
    },
    top() {
      console.log("升锁");
      let that = this;
      if (that.self == true) {
        (that.loading = "block"), that.bus.$emit("loading", true);
        that.bus.$emit("tip", { title: "升锁中请稍候..." });
        (that.loadingText = "升锁中请稍候"), (that.self = false);
        axios
          .request({
            url: Url.url.long_control,
            method: "post",
            params: {
              stallId: that.stallId,
              state: 2, // 1 降下地锁  2 升起地锁
              parkingStatus: 0 //0未知 1到达 2未到达
            }
          })
          .then(res => {
            console.log(res);
            if (res.status == true) {
              localStorage.setItem("oo", false);
              setTimeout(() => {
                that.bus.$emit("loading", false);
                that.bus.$emit("tips", { show: true, title: "升锁成功" });
              }, 1000);
              (that.loading = "none"), (that.self = true);
            } else {
              if (res.message != null) {
                if (res.message.code == 8005099) {
                  console.log(res.message.content);
                  (that.aligns = res.message.content),
                    (that.ss = "再升一次"),
                    (that.s = 1),
                    (that.begins = "block"),
                    (that.self = false);
                  that.loading = "none";
                  that.bus.$emit("loading", false);
                } else if (res.message.code == 8005101) {
                  console.log(res.message.content);
                  (that.aligns = res.message.content),
                    (that.ss = "故障上报"),
                    (that.s = 3),
                    (that.begins = "block"),
                    (that.self = false);
                  that.loading = "none";
                  that.bus.$emit("loading", false);
                } else if (res.message.code == 8005093) {
                  console.log(res.message.content);
                  (that.aligns = res.message.content),
                    (that.ss = "切换车位"),
                    (that.s = 4),
                    (that.begins = "block"),
                    (that.self = false);
                  that.loading = "none";
                  that.bus.$emit("loading", false);
                } else if (res.message.code == 8005073) {
                  console.log(res.message.content);
                  (that.loading = "none"), (that.self = true);
                  that.bus.$emit("loading", false);
                  that.bus.$emit("tips", { show: true, title: res.message.content });
                } else if (res.message.code == 8005072) {
                  (that.loading = "none"), (that.self = true);
                  that.bus.$emit("loading", false);
                  that.bus.$emit("tips", { show: true, title: res.message.content });
                }
              }
            }
          });
      }
    },
    qie() {
      let that = this;
      axios
        .request({
          url: Url.url.long_current,
          method: "get"
        })
        .then(res => {
          console.log(res);
          console.log(that.latitude, that.longitude);
          if (res.data.status == true) {
            //判断有无订单
            if (res.data.switchFlag == true) {
              //判断可否切换;
              this.$router.push({
                path: "/Choice",
                query: {
                  latitude: that.latitude,
                  longitude: that.longitude,
                  switchFlag: 1
                }
              });
            } else {
              console.log("eelse");
              that.show = true;
            }
          } else {
            console.log("else");
            if (res.data.switchFlag == true) {
              this.$router.push({
                path: "/Choice",
                query: {
                  latitude: that.latitude,
                  longitude: that.longitude,
                  switchFlag: 1
                }
              });
            } else {
              that.show = true;
            }
          }
        });
    },
    shows() {
      this.show = false;
    },
    ones() {
      let that = this;
      (that.self = true), (that.begins = "none");
      if (that.s == 1) {
        that.top();
      } else if (that.s == 2) {
        that.bottom();
      } else if (that.s == 4) {
        this.$router.push({
          path: "/Choice"
        });
      } else {
        // this.$router.push({
        //     path: "/Park",
        //     query: {
        //       stallId: this.stallId
        //     }
        //   });
        console.log("跳转故障车位页");
      }
    },
    xiao() {
      let that = this;
      (that.self = true), (that.begins = "none");
      console.log("取消");
    },
    back() {
      let that = this;
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang='scss'>
.mypark {
  width: 100%;
  height: 100%;
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
.parknum {
  /* width: 100%; */
  display: flex;
  justify-content: space-around;
  margin-top: 120px;
  position: relative;
  margin-bottom: 120px;
  .img {
    width: 388px;
    height: 244px;
    padding: 0;
    margin: 0;
    margin: 0 auto;
  }
  .num {
    width: 388px;
    height: 208px;
    line-height: 208px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 24%;
    font-size: 73px;
    font-family: "HYShangWeiShouShuW";
  }
}
.fault {
  position: absolute;
  right: 30px;
  bottom: 0;
  .img1 {
    width: 56px;
    height: 56px;
    padding: 0;
    margin: 0;
    margin-bottom: 12px;
  }
}
.faults {
  margin-bottom: 40px;
}
.fault-txt {
  font-size: 24px;
  color: #999;
  text-align: center;
}
.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
}
.body-content {
  width: 95%;
  height: 92px;
}
.body-time {
  width: 100%;
  line-height: 92px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f5f4f4;
  font-size: 30px;
  color: #333;
}
.body-time img {
  width: 32px;
  height: 32px;
}
.span {
  width: 100%;
  height: 20px;
  background: #f5f4f4;
}
.foot {
  width: 100%;
  margin-top: 96px;
  display: flex;
  justify-content: space-around;
}
.foot button {
  width: 232px;
  height: 76px;
  font-size: 30px;
  color: #fff;
  outline: none;
  border-radius: 60px;
  background: #faa901;
  border: none;
}
.starts {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1100;
}
.begin {
  width: 80%;
  background: #fff;
  position: absolute;
  top: 36%;
  left: 10%;
  border-radius: 14px;
  font-size: 28px;
  color: #666;
  text-align: center;
}
.con {
  width: 100%;
  text-align: center;
  height: 150px;
  line-height: 150px;
}
.caos {
  width: 100%;
  font-size: 30px;
  color: #333;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}
.ones {
  width: 50%;
  text-align: center;
  height: 110px;
  line-height: 110px;
  border: 0.4px solid #e6e6e6;
}
.fails {
  width: 100%;
  border: 0.2px solid #e6e6e6;
}
.one {
  color: #999999;
}
.oo {
  color: #f66913;
}
.boxss {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
.bodyss {
  position: fixed;
  top: 35%;
  left: 70px;
  width: 610px;
  background: white;
  border-radius: 20px;
}
.topss {
  width: 100%;
  font-size: 34px;
  text-align: center;
  line-height: 60px;
  border-bottom: 1px solid #dedede;
  color: #333333;
  box-sizing: border-box;
  padding: 15px 40px;
}
.bottomsss {
  width: 100%;
  height: 110px;
  font-size: 32px;
  color: #666666;
  text-align: center;
  line-height: 110px;
}
</style>
