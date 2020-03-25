import router from "./router"

import NProgress from "nprogress"
import "nprogress/nprogress.css";

// import { Message } from "ant-design-vue"

NProgress.configure({ showSpinner: false })

const whiteList = ['./login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
  NProgress.done()
  // Messages.Error("test router beforeEach")
})

