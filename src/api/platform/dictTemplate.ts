import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result<T = any> = {
  code: number;
  message: string;
  data: T;
};

export type DictTemplateItem = {
  id?: number;
  dictCode: string;
  dictName: string;
  parentCode: string;
  sortOrder: number;
  status: number;
  hidden: boolean;
  enabled: boolean;
  ver: number;
  remark?: string;
  children?: DictTemplateItem[];
};

export type DictDataTemplateItem = {
  id?: number;
  dictCode: string;
  name: string;
  value: string;
  sortOrder: number;
  color?: string;
  status: number;
  deletable: boolean;
  enabled: boolean;
  ver: number;
  remark?: string;
};

export const getDictTemplateTree = () =>
  http.request<Result<DictTemplateItem[]>>(
    "post",
    baseUrlApi("dict/template/list")
  );

export const saveDictTemplate = (data: Partial<DictTemplateItem>) =>
  http.request<Result<boolean>>("post", baseUrlApi("dict/template/create"), {
    data
  });

export const deleteDictTemplate = (data: { id: number }) =>
  http.request<Result<boolean>>("post", baseUrlApi("dict/template/delete"), {
    data
  });

export const getDictDataTemplateList = (data?: { dictCode?: string }) =>
  http.request<Result<DictDataTemplateItem[]>>(
    "post",
    baseUrlApi("dict/template/data/list"),
    { data }
  );

export const saveDictDataTemplate = (data: Partial<DictDataTemplateItem>) =>
  http.request<Result<boolean>>(
    "post",
    baseUrlApi("dict/template/data/create"),
    { data }
  );

export const deleteDictDataTemplate = (data: { id: number }) =>
  http.request<Result<boolean>>(
    "post",
    baseUrlApi("dict/template/data/delete"),
    { data }
  );

export const syncDictTemplate = () =>
  http.request<
    Result<{
      toVer: number;
      companyCount: number;
      successCount: number;
      failCount: number;
    }>
  >("post", baseUrlApi("dict/template/sync"));

