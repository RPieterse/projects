import { statusLabels } from "@/constants";
import { toInteger } from "lodash";

export default {
  searchUsers:
    ({ users }) =>
    (searchValue) => {
      if (searchValue == "") {
        return users;
      }
      const results = [];
      for (let i = 0; i < users.length; i++) {
        for (let key in users[i]) {
          if (
            users[i][key]
              ?.toString()
              ?.toLowerCase()
              ?.indexOf(searchValue.toLowerCase()) != -1
          ) {
            if (!results.find((u) => u.id == users[i].id)) {
              results.push(users[i]);
            }
          }
        }
      }
      return results;
    },
  sortUsers:
    ({ users }) =>
    ({ id, direction }, customList) => {
      const sorted = customList || users;
      if (direction == "desc") {
        return sorted.sort(
          (a, b) =>
            isFinite(b[id]) - isFinite(a[id]) ||
            a[id] - b[id] ||
            a[id]?.toString()?.localeCompare(b[id]?.toString())
        );
      }
      return sorted.sort((a, b) => {
        return (
          isFinite(a[id]) - isFinite(b[id]) ||
          b[id] - a[id] ||
          b[id]?.toString()?.localeCompare(a[id].toString())
        );
      });
    },
  getNewId: (_, { sortUsers }) => {
    return (
      toInteger(
        sortUsers({
          id: "id",
          direction: "asc",
        })?.[0]?.id || 1
      ) + 1
    );
  },
  getFilteredUsers:
    (_, { searchUsers, sortUsers }) =>
    (searchValue, page, pageSize = 10, sortDetails) => {
      let results = [];
      results = searchUsers(searchValue);
      if (sortDetails?.id) {
        results = sortUsers(sortDetails, results);
      }
      const total = results.length;
      if (page) {
        return {
          results: results.slice((page - 1) * pageSize, page * pageSize),
          total,
        };
      }
      return { results, total };
    },
  getTotalUsers: (state) => {
    return state.users.length;
  },
  getTotalCompletedUsers: (state) => {
    return state.users.filter(
      (user) => user.status == statusLabels.completed.id
    ).length;
  },
  getTotalInProgressUsers: (state) => {
    return state.users.filter(
      (user) => user.status == statusLabels.inprogress.id
    ).length;
  },
  getTotalCancelledUsers: (state) => {
    return state.users.filter(
      (user) => user.status == statusLabels.cancelled.id
    ).length;
  },
  getUserById:
    ({ users }) =>
    (id) => {
      return users.find((user) => user.id == id);
    },
  getFullname:
    (_, { getUserById }) =>
    (id) => {
      return (
        (getUserById(id)?.fName || "") + " " + (getUserById(id)?.lName || "")
      );
    },
};
