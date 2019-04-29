import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Parking from '@/components/Parking'
import Order from '@/components/Order'
import Pay from '@/components/paySuccess'
import Lock from '@/components/Lockup'
import Choice from '@/components/Choicepark'
import Park from '@/components/mypark'
import CarError from '@/components/carError'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', //预约车位页面
      name: 'List',
      component: List,
      meta: {
        title: '车区列表'
      }
    },
    {
      path: '/Parking', //预约车位页面
      name: 'Parking',
      component: Parking,
      meta: {
        title: '预约车位'
      }
    },
    // {
    //   path: '/',
    //   name: 'List', //车区列表
    //   component: List
    // },
    {
      path: '/Park', //我的车位详情页
      name: 'Park',
      component: Park,
      meta: {
        title: '我的车位'
      }
    },
    {
      path: '/Choice', //长租选择车位页面
      name: 'Choice',
      component: Choice,
      meta: {
        title: '选择车位'
      }
    },
    {
      path: '/Lock', //升锁成功页面
      name: 'Lock',
      component: Lock,
      meta: {
        title: '升锁离场'
      }
    },
    {
      path: '/Pay', //支付成功页面
      name: 'Pay',
      component: Pay
    },
    {
      path: '/Order', //当前订单页面
      name: 'Order',
      component: Order,
      meta: {
        title: '当前订单'
      }
    },
    {
      path: '/CarError',
      name: 'CarError',
      component: CarError,
      meta: {
        title: '车位异常'
      }
    }
  ]
})
