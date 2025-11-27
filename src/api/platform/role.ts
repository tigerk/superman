import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  data?: Array<any>;
};

type ResultTable = {
  code: number;
  message: string;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("post", baseUrlApi("role/list-all-role"));
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("role/list"), { data });
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/role/role-menu"), { data });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("role/role-menu-ids"), {
    data
  });
};

/** 创建角色-权限-权限 */
export const createRole = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("role/create"), {
    data
  });
};

/** 修改角色-权限-权限 */
export const updateRole = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("role/update"), {
    data
  });
};

/** 删除角色管理-角色 */
export const deleteRole = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("role/delete"), {
    data
  });
};

export const assignRoleMenu = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("role/menu/assign"), {
    data
  });
};
