export default {
  path: "/user/index",
  name: "User",
  component: () => import("@/views/user/index.vue"),
  meta: {
    icon: "ep/set-up",
    title: "用户管理",
    rank: 1,
    showLink: true
  }
} satisfies RouteConfigsTable;
