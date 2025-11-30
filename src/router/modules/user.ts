export default {
  path: "/user/index",
  name: "User",
  component: () => import("@/views/platform/user/index.vue"),
  meta: {
    icon: "ep/set-up",
    title: "用户管理",
    sortOrder: 1,
    showLink: true
  }
} satisfies RouteConfigsTable;
