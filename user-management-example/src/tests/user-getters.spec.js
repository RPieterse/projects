import { describe, it, expect } from "vitest";
import store from "@/store";

describe("Users Store", () => {
  it("Create new user", () => {
    let totalUsers = store.getters["users/getTotalUsers"];
    expect(totalUsers).toBe(4);
    store.dispatch("users/createUser", {
      fName: "Test",
      lName: "User",
      email: "email@test.com",
      id: 879461,
      status: "inprogress",
    });
    totalUsers = store.getters["users/getTotalUsers"];
    expect(totalUsers).toBe(5);
  });
  it("Delete user", () => {
    let totalUsers = store.getters["users/getTotalUsers"];
    expect(totalUsers).toBe(5);
    store.dispatch({
      type: "users/deleteUser",
      payload: 879461,
    });
    totalUsers = store.getters["users/getTotalUsers"];
    expect(totalUsers).toBe(4);
  });
  it("Update user", () => {
    let totalUsers = store.getters["users/getTotalUsers"];
    expect(totalUsers).toBe(4);
    store.dispatch("users/updateUser", {
      fName: "Test",
      lName: "User",
      email: "email@test.com",
      id: 3,
      status: "inprogress",
    });
    totalUsers = store.getters["users/getTotalUsers"];
    expect(totalUsers).toBe(4);

    const user3 = store.getters["users/getUserById"](3);
    expect(user3.fName).toBe("Test");
  });
});
