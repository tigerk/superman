import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";
import type { ResponseResultPlatformOverviewVo } from "@/types/generated";

export const getPlatformOverview = () => {
  return http.request<ResponseResultPlatformOverviewVo>(
    "get",
    baseUrlApi("dashboard/overview")
  );
};
