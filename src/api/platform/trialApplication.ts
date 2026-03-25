import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

type Result = {
  code: number;
  message: string;
  data?: any;
};

type ResultTable = {
  code: number;
  message: string;
  data?: {
    list: Array<any>;
    total?: number;
    pageSize?: number;
    currentPage?: number;
  };
};

export const getTrialApplicationList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("trialApplication/list"),
    {
      data
    }
  );
};

export const handleTrialApplication = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("trialApplication/handle"), {
    data
  });
};
