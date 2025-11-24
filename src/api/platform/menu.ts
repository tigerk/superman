import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  data?: Array<any>;
};

export const createMenu = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("platform/menu/create"), {
    data
  });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("platform/menu/list"), {
    data
  });
};

/** 删除系统管理-菜单管理 */
export const deleteMenu = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi("platform/menu/delete/" + data),
    {}
  );
};
