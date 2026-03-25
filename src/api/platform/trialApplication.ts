import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";
import type {
  ResponseResultBoolean,
  ResponseResultPageVoTrialApplicationVo,
  TrialApplicationHandleDto,
  TrialApplicationQueryDto
} from "@/types/generated";

export const getTrialApplicationList = (data?: TrialApplicationQueryDto) => {
  return http.request<ResponseResultPageVoTrialApplicationVo>(
    "post",
    baseUrlApi("trialApplication/list"),
    {
      data
    }
  );
};

export const handleTrialApplication = (data?: TrialApplicationHandleDto) => {
  return http.request<ResponseResultBoolean>(
    "post",
    baseUrlApi("trialApplication/handle"),
    {
      data
    }
  );
};
