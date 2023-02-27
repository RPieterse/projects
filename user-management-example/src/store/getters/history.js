export default {
  searchHistory:
    ({ history }) =>
    (searchValue, customList) => {
      const raw = customList || history;
      if (searchValue == "") {
        return raw;
      }
      const results = [];
      for (let i = 0; i < raw.length; i++) {
        for (let key in raw[i]) {
          if (
            raw[i][key]
              ?.toString()
              ?.toLowerCase()
              ?.indexOf(searchValue.toLowerCase()) != -1
          ) {
            if (!results.find((h) => h.profileId == raw[i].profileId)) {
              results.push(raw[i]);
            }
          }
        }
      }
      return results;
    },
  sortHistory:
    ({ history }) =>
    ({ id, direction }, customList) => {
      const sorted = customList || history;
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
          b[id]?.toString()?.localeCompare(a[id]?.toString())
        );
      });
    },
  getFilteredHistory:
    ({ history }, { searchHistory, sortHistory }, _, getters) =>
    (searchValue, page, pageSize = 10, sortDetails) => {
      const historyWithProfileNames = history.map((item) => {
        if (item.profileName) {
          return item;
        }
        return {
          ...item,
          profileName:
            getters["users/getFullname"](item.profileId).trim() ||
            item.fallbackName,
        };
      });
      let results = [];
      results = searchHistory(searchValue, historyWithProfileNames);

      if (sortDetails?.id) {
        results = sortHistory(sortDetails, results);
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
  getTotalHistory: (state) => {
    return state.history.length;
  },
};
