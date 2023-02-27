import usersGetters from "@/store/getters/users";
import usersState from "@/store/states/users";
import usersMutations from "@/store/mutations/users";
import userActions from "@/store/actions/users";

export default {
    namespaced: true,
    state() {
        return usersState
      },
      getters: {
        ...usersGetters
      },
      mutations: {
        ...usersMutations
      },
      actions: {
        ...userActions
      }
}