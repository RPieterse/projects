// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/Users.vue"),
      },
      {
        path: "history",
        name: "History",
        component: () => import("@/views/History.vue"),
      },
      {
        path: "profile/create",
        name: "AddNewUser",
        component: () => import("@/views/ProfileAdd.vue"),
      },
      {
        path: "profile/:id",
        name: "Profile",
        component: () => import("@/views/Profile.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/Blank.vue"),
    children: [
      {
        path: "",
        name: "Logout",
        component: () => import("@/views/Logout.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/layouts/Blank.vue"),
    children: [
      {
        path: "",
        name: "404",
        component: () => import("@/views/404.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
