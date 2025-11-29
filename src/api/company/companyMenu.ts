import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type SysResult = {
  code: number;
  message: string;
  data?: Array<any>;
};

/** 获取公司系统管理-创建菜单 */
export const createCompanyMenu = (data?: object) => {
  return http.request<SysResult>("post", baseUrlApi("sys/menu/create"), {
    data
  });
};

/** 获取公司系统管理-菜单管理列表 */
export const getCompanyMenuList = (data?: object) => {
  return http.request<SysResult>("post", baseUrlApi("sys/menu/list"), {
    data
  });
};

/** 删除公司系统管理-菜单管理 */
export const deleteCompanyMenu = (data?: object) => {
  return http.request<SysResult>("post", baseUrlApi("sys/menu/delete"), {
    data
  });
};
