import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Logger from "@/components/Logger.vue";
import DeviceList from "@/components/DeviceList.vue";
import DecoderView from "@/components/DecoderView.vue";
import RadioView from "@/components/RadioView.vue";
import EncoderView from "@/components/EncoderView.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/log',
    name: 'Logger',
    component: Logger
  },
  {
    path: '/decode/:message/:eep?',
    name: 'Decoder',
    component: DecoderView
  },
  {
    path: '/encode/:eep/:address?/:channel?',
    name: 'Encoder',
    component: EncoderView
  },
  {
    path: '/radio/:message',
    name: 'Radio',
    component: RadioView
  },
  {
    path: '/devices',
    name: 'Devices',
    component: DeviceList
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
