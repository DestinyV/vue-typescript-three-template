import { State } from "./index.d"


const getters = {
  name: (state: State) => state.user.name
}

export default getters
