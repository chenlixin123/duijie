<template>
   <div class="content">
  <div class='per-head'>
    <div class='per-num'>
      <div class='pre-name'>{{nickname}}</div>
      <div class='pre-mobile'>{{mobile}}</div>
    </div>
    <div class='author'>
        <img :src='src' width="100%">
    </div>
  </div>
  <div class='bill-true'>
    <div class='group'>
      <div class='list' @click='goBill'>
          <div class='per-img'>
              <img src='@/assets/wode_dingdan@3x.png' width="100%">
          </div>
        <div class='list-txt'>订单</div>
      </div>
      <div class='list' @click='goPlateNumber'>
          <div class='per-img'>
              <img src='@/assets/wode_chepaihao@3x.png' width="100%">
          </div>
        <div class='list-txt'>车牌号</div>
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
            data:'',
            nickname:'',
            userInfo: {},
            userName:'',
            sexs:'',
            mobile:'',
            src:''
        }
    },
    created(){
        let that = this
        that.show()
    },
    methods:{
        // 渲染页面
    show(){
        let that = this
        axios.request({
            url:Url.url.choose_user
        }).then(res => {
            console.log(res)
            if(res.status == true){
                if(res.data.nickname == null){
                    that.nickname = '昵称'
                }else{
                    that.nickname = res.data.nickname
                }
                if(res.data.mobile != null){
                 let mobile = res.data.mobile;
                 let mob = mobile.substr(0,3);
                 let mobs = mobile.substr(7,11);
                 let mobes = mob+'****'+mobs;
                 that.mobile = mobes
                //  console.log(mobes)
                } 
                if(res.data.sex == 2){
                    that.src = require('@/assets/nvtouxiang@3x.png')
                }else{
                    that.src = require('@/assets/nantouxiang@3x.png')
                }
            }else{
                that.bus.$emit("tips", { show: true, title: res.message.content});
            }
        })
    },
    // 进入订单
    goBill(){
        this.$router.push({ 
          path: "/bill",
           });
    },
    // 进入车牌号页面
    goPlateNumber(){
        this.$router.push({ 
          path: "/CarModuleList",
          query:{
              num:2
          }
           });
    }
    }
}
</script>

<style lang="scss" scoped>
.content{
    width: 100%;
    height:100%;
    background: #f5f4f4;
}
.per-head{
  width: 100%;
  height: 295px;
  background: #fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.bill-true{
  width: 100%;
  background: #fff;
}
.group{
  width: 690px;
  margin-left: 30px; 
}
.list{
  width: 100%;
  height: 92px;
  border-bottom: 1px solid #f0efef;
  line-height: 80px;
  font-size: 32px;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.author{
  width: 136px;
  height: 136px;
  border-radius: 50%;
  margin-right: 30px;
}
.pre-name{
  margin-left: 30px;
  font-size: 44px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30px;
}
.pre-mobile{
  margin-left: 30px;
  font-size: 36px;
  color: #666666;
}
.per-img{
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin-right: 36px;
}
.list-txt{

}
</style>


