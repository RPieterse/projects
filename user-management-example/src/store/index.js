import { createStore } from "vuex";
import userModule from "@/store/modules/users";
import historyModule from "@/store/modules/history";

// Create a new store instance.
const store = createStore({
  modules: {
    users: userModule,
    history: historyModule
  },
});

export default store;
