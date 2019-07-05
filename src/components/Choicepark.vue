<template>
<div class="page">
    <div class="box" v-for="(item,index) in PositionList" :key="index">
        <div class="title">{{item.preName}}</div>


        <div class="content" @click="menuClick(item,items)" v-for="(items, indexs) in item.rentPreStalls" :key="indexs" v-if="items.status!='空闲' && items.status!='使用中' && items.status!=1 && items.status!='无使用权限'">
          <div class="img" v-if="items.userStatus == 0">
            <img src="@/assets/impower.png" alt="" width="100%">
          </div>
            <div class="top">
              <div class="carmodules">{{items.stallName}}</div>
              <div class="statue">{{items.status}}</div>
            </div>
            <div class="bottoms" v-if="items.useUpLockTime!=null && items.stallStatus == 1">
                <div class="bottom1">上次使用:</div>
                <div class="bottom2">{{items.useUpLockTimes}}</div>
            </div>
            <div class="bottoms" v-else-if="items.downLockTime!=null && items.stallStatus == 2">
                <div class="bottom1">降锁时间:</div>
                <div class="bottom2">{{items.downLockTimes}}</div>
            </div>
        </div>

        <div class="content" @click="menuClick(item,items)" v-for="(items, indexs) in item.rentPreStalls" :key="indexs" v-if="items.status=='空闲'|| items.status=='使用中' || items.status==1 || items.status=='无使用权限'">
          <div class="img" v-if="items.userStatus == 0">
            <img src="@/assets/impower.png" alt="" width="100%">
          </div>
            <div class="top">
              <div class="carmodule">{{items.stallName}}</div>
              <div :class="items.status == '使用中' || items.status == 1 ? 'statues' : 'status'">{{items.status == 1 ? user : items.status }}</div>
            </div>
            <div class="bottom" v-if="items.useUpLockTime!=null && items.stallStatus == 1">
                <div class="bottom1">上次使用:</div>
                <div class="bottom2">{{items.useUpLockTimes}}</div>
            </div>
            <div class="bottom" v-else-if="items.downLockTime!=null && items.stallStatus == 2">
                <div class="bottom1">降锁时间:</div>
                <div class="bottom2">{{items.downLockTimes}}</div>
            </div>
        </div>
    </div>
      <div class="nopermissions" v-if="nopermission == true">
        <div class="nopermissions_content">
          <div class="nopermissions_top">{{nopermissions}}</div>
          <div class="nopermissions_bottom" @click="nopermissione">确定</div>
        </div>
      </div>
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
    PositionList: "",
    num:'',
    //本地经纬度
    location: {
      longitude: "116.41361",
      latitude: "39.91106"
    },
    longitude:"",
    latitude:"",
    switchFlag:"",
    data:'',
    id:'',
    nopermission:false,
    nopermissions: '车位无法使用，请通过物业管理人员开启车位使用权限',
    user:'',
    };
  },
  created() {
    let that = this;
    that.bus.$emit("loading", true);
    that.bus.$emit("tip", { title: "加载中请稍候..." });
    that.token = that.$route.query.token;
    if (that.token == undefined) {
      that.token = localStorage.getItem("token");
      console.log(that.token);
    } else {
      that.token = that.$route.query.token;
      console.log(that.token);
    }
    Cookies.set("tokens", that.token);
    localStorage.setItem("token", that.token);
    console.log(that.$route.query, "-------------------------------=================------------------------------")

      that.longitude = that.$route.query.longitude,
      that.latitude = that.$route.query.latitude,
      that.switchFlag = that.$route.query.switchFlag,
      that.id = that.$route.query.id

    // console.log(that.data)
    
    if (that.switchFlag == 1){
        console.log(that.$route.query, "-------------------------------=================------------------------------")
        that.datas =  JSON.parse(that.$route.query.data)
     axios.request({
        url:Url.url.long_carLists,
        method:"post",
         params: {
          latitude: that.$route.query.latitude,
          longitude: that.$route.query.longitude,
          switchFlag: 1
        },
      }).then(res => {
        console.log(res)
        // console.log(res.data.num,res.message)
        if(res.status == true){
          that.bus.$emit("loading", false);
             that.PositionList = res.data.rentPres,
            that.num = res.data.num
            res.data.rentPres.forEach(element => {
                element.rentPreStalls.forEach(reson => {
                        // console.log(reson)
                        if(reson.operateAuthFlag == 0){
                          reson.status = '无使用权限'
                        }else{
                          if(reson.stallStatus == 1){
                            reson.status = '空闲'
                          }else if(reson.stallStatus == 2){
                            if(reson.isSelfUser == 1){
                              if(reson.isAuthUser != 1){
                                reson.status = '他人使用'
                              }else{
                                 let mobile = reson.useUserMobile.substring(0, 3)
                                 let mobiles = reson.useUserMobile.substring(7, 11)
                                 that.user = reson.useUserName == '' ? mobile + '****' + mobiles + '使用中' : reson.useUserName + '使用中'
                                 reson.status = 1
                              }
                            }else if(reson.isSelfUser == 0){
                                  reson.status = '使用中'
                            }
                          }
                        }
                        if(reson.useUpLockTime != null){
                           let time = new Date(reson.useUpLockTime);
                            // console.log(time)
                           let y = time.getFullYear()
                           let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
                           let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
                           let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
                           let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
                           reson.useUpLockTimes = m + '月' + d + '日' + ' ' + h + ':' + mm
                          //  console.log(reson.useUpLockTimes)
                        }
                         if(reson.downLockTime != null){
                           let time = new Date(reson.downLockTime);
                            // console.log(time)
                           let y = time.getFullYear()
                           let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
                           let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
                           let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
                           let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
                           reson.downLockTimes = m + '月' + d + '日' + ' ' + h + ':' + mm
                          //  console.log(reson.downLockTimes)
                        }
                });
            });
        }else{
          that.bus.$emit("loading", false);
           that.bus.$emit("tips", { show: true, title:res.message.content });
        }
      })
    }else{
       axios.request({
        url:Url.url.long_carLists,
        method:"post",
         params: {
          latitude: that.$route.query.latitude,
          longitude: that.$route.query.longitude,
        },
      }).then(res => {
        console.log(res)
        // console.log(res.data.num,res.message)
        if(res.status == true){
          that.bus.$emit("loading", false);
             that.PositionList = res.data.rentPres,
            that.num = res.data.num
            res.data.rentPres.forEach(element => {
                element.rentPreStalls.forEach(reson => {
                        // console.log(reson)
                        if(reson.operateAuthFlag == 0){
                          reson.status = '无使用权限'
                        }else{
                          if(reson.stallStatus == 1){
                            reson.status = '空闲'
                          }else if(reson.stallStatus == 2){
                            if(reson.isSelfUser == 1){
                              if(reson.isAuthUser != 1){
                                reson.status = '他人使用'
                              }else{
                                 let mobile = reson.useUserMobile.substring(0, 3)
                                 let mobiles = reson.useUserMobile.substring(7, 11)
                                 that.user = reson.useUserName == '' ? mobile + '****' + mobiles + '使用中' : reson.useUserName + '使用中'
                                 reson.status = 1
                              }
                            }else if(reson.isSelfUser == 0){
                                  reson.status = '使用中'
                            }
                          }
                        }
                        if(reson.useUpLockTime != null){
                           let time = new Date(reson.useUpLockTime);
                            // console.log(time)
                           let y = time.getFullYear()
                           let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
                           let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
                           let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
                           let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
                           reson.useUpLockTimes = m + '月' + d + '日' + ' ' + h + ':' + mm
                          //  console.log(reson.useUpLockTimes)
                        }
                         if(reson.downLockTime != null){
                           let time = new Date(reson.downLockTime);
                            // console.log(time)
                           let y = time.getFullYear()
                           let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
                           let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
                           let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
                           let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
                           reson.downLockTimes = m + '月' + d + '日' + ' ' + h + ':' + mm
                          //  console.log(reson.downLockTimes)
                        }
                });
            });
        }else{
          that.bus.$emit("loading", false);
           that.bus.$emit("tips", { show: true, title:res.message.content });
        }
           
      })
    }
  },
  methods: {
    
    //点击进入车位详情
    menuClick(data1,data){
      let that = this
      console.log(data)
       if (data.operateAuthFlag == 0){
            that.nopermission = true
            return
        }
      that.$router.push({
        path:'/park?data=' + JSON.stringify(data) + '&data1=' + JSON.stringify(data1)
      })
    },
    //取消弹出框
    nopermissione(){
      let that = this
      that.nopermission = false
    }
  }
};
</script>

<style scoped lang='scss'>
  .page{
    width: 100%;
    min-height: 100%;
    background: #f5f4f4;
    box-sizing: border-box;
    padding: 24px 40px;
    .box{
      width: 100%;
       .title{
         width: 100%;
         box-sizing: border-box;
         padding-bottom: 24px;
         font-size: 26px;
         color: #999;
       }
       .content{
         width: 100%;
         box-sizing: border-box;
         padding: 32px 28px;
         background: white;
         border-radius: 10px;
         margin-bottom: 24px;
         position: relative;
         .img{
           width: 60px;
           height: 50px;
           position: absolute;
           top: 0;
           right: 0;
         }
         .top{
           width: 100%;
           display: flex;
           justify-content: space-between;
           .carmodule{
             font-size: 30px;
             color: #333;
           }
           .carmodules{
             font-size: 30px;
             color:#a4a3a3;
           }
           .status{
               font-size: 26px;
               color: #333;
               font-weight: bold;
             }
             .statues{
               font-size: 26px;
               color: #faa913;
               font-weight: bold;
             }
             .statue{
               font-size: 26px;
               color: #a4a3a3;
               font-weight: bold;
             }
         }
         .bottom{
           width: 100%;
           margin-top: 32px;
           font-size: 28px;
           color: #666;
           display: flex;
         }
         .bottoms{
           width: 100%;
           margin-top: 32px;
           font-size: 28px;
           color: #a4a3a3;
           display: flex;
         }
       }
    }
    .nopermissions{
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  .nopermissions_content{
  width: 586px;
  background: white;
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 400px;
  .nopermissions_top{
  width: 100%;
  line-height: 74px;
  box-sizing: border-box;
  padding: 40px 60px;
  font-size: 34px;
  color: #666;
  text-align: center;
  border-bottom: 1px solid #dedede;
}
.nopermissions_bottom{
  width: 100%;
  height: 104px;
  font-size: 32px;
  color: #666;
  text-align: center;
  line-height:104px;
}
}
}
  }

</style>
