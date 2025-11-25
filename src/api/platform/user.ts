import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

/** 平台用户信息管理模块 */

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
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

type Result = {
  code: number;
  message: string;
  data?: any;
};

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("user/list"), { data });
};

/** 创建用户信息 */
export const createUser = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/create"), { data });
};

/** 更新用户信息 */
export const updateUser = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/update"), { data });
};

/** 更新用户信息 */
export const updateUserStatus = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/updateStatus"), {
    data
  });
};

/** 删除用户信息 */
export const deleteUser = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/delete"), {
    data
  });
};

export const resetUserPassword = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/resetPassword"), {
    data
  });
};

export const updateUserAvatar = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/updateAvatar"), {
    data
  });
};

export const updateUserRole = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/role/update"), {
    data
  });
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("user/list-role-ids"), {
    data
  });
};
