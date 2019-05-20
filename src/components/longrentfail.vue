<template>
    <div>
            <div class='body'>
  <div class='boxs' v-for='(items,index) in datas' :key='index'  @click='tap(items)' >
    <div class='title'>
      <div class='carmodule'>{{items.preName}}</div>
      <div class='carname'>{{items.stallNames}}</div>
    </div> 
    <div class='body_box' v-for='(item,index) in items.detailList'  :key='index' @click='taps(item)' v-if='item.authFlag != 0'>
      <div class='top'>
        <img class='mobile_img' src='@/assets/dianhua@2x.png'>
        <div class='mobile'>{{item.mobiles}}</div>
        <div class='right'>{{item.authFlag == 0 ? "" : item.authFlag == 1 ? "已取消" : item.authFlag == 2 ? "已过期" : "已失效" }}</div>
      </div>
      <div class='bottom'>
         <img class='mobile_img' src='@/assets/shijian@2x.png'>
        <div class='mobile'>{{item.startTime}}-{{item.endTime}}</div>
      </div>
    </div>
  </div>
  <img class='add' v-if='show == true' @click='add' src='@/assets/tianjia@2x.png'>
</div>
<!-- loading -->
 <!-- <div style='display:{{loading}}' class='loading'>
    <div class='load-txt'>{{loadingText}}</div>
  </div> -->

    </div>
</template>

<script>
export default {
    data(){
        return{
            show: '',
    img: '',
    num: '',
    nums: '',
    preId: '',
    data: '',
    datas: '',
    loading: 'none',
    loadingText: "加载中请稍候",
    stallEndTime: '',
    length: 0
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


