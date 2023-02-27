import historyGetters from "@/store/getters/history";
import historyState from "@/store/states/history";
import historyMutations from "@/store/mutations/history";

export default {
    namespaced: true,
    state() {
        return historyState
      },
      getters: {
        ...historyGetters
      },
      mutations: {
        ...historyMutations
      }
}