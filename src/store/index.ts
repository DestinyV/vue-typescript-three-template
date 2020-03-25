import Vue from "vue";
import Vuex from "vuex";
import getters from "./getter"

Vue.use(Vuex);

const resolveModule = require.context('./modules', true, /\.ts$/)

const modules = resolveModule.keys().reduce((modules:any, modulePath: string) => {
  const moduleName = modulePath.replace(/\.\/(.*)\.\w+$/, '$1')
  const moduleFile = resolveModule(modulePath)
  modules[moduleName] = moduleFile.default
  return modules
}, {})

export default new Vuex.Store({
  getters,
  modules
});
