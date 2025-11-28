import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type SysResult = {
  code: number;
  message: string;
  data?: Array<any>;
};

export const createSysMenu = (data?: object) => {
  return http.request<SysResult>("post", baseUrlApi("sys/menu/create"), {
    data
  });
};

/** 获取系统管理-菜单管理列表 */
export const getSysMenuList = (data?: object) => {
  return http.request<SysResult>("post", baseUrlApi("sys/menu/list"), {
    data
  });
};

/** 删除系统管理-菜单管理 */
export const deleteSysMenu = (data?: object) => {
  return http.request<SysResult>("post", baseUrlApi("sys/menu/delete"), {
    data
  });
};
