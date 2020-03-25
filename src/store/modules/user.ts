import { ActionContext } from 'vuex'

export interface State {
  name: string,
  password: string
}

const state = {
  name: null,
  password: null
}

const mutations = {
  SET_NAME: (state: State, name: string) => {
    state.name = name
  }
}

const actions = {
  setName( action: ActionContext<State, any> , name: string) {
    action.commit('SET_NAME', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}