import { findIndex } from "lodash";

export default {
  deleteUser: ({ state: { users }, commit }, id) => {
    const index = findIndex(users, (user) => user.id == id);
    const profile = users[index];
    users = users.splice(index, 1);
    commit(
      "history/createHistory",
      {
        profileId: id,
        createdAt: Date.now(),
        action: "deleted",
        fallbackName: `${profile?.fName || ""} ${profile?.lName || ""}`,
      },
      { root: true }
    );
  },
  createUser: ({ state: { users }, commit }, profile) => {
    users = users.push(profile);
    commit(
      "history/createHistory",
      {
        profileId: profile.id,
        createdAt: Date.now(),
        action: "create",
        fallbackName: `${profile.fName || ""} ${profile.lName || ""}`,
      },
      { root: true }
    );
  },
  updateUser: ({ state: { users }, commit }, profile) => {
    const index = findIndex(users, (user) => user.id == profile.id);
    users = users.splice(index, 1, profile);
    commit(
      "history/createHistory",
      {
        profileId: profile.id,
        createdAt: Date.now(),
        action: "update",
        fallbackName: `${profile.fName || ""} ${profile.lName || ""}`,
      },
      { root: true }
    );
  },
};
