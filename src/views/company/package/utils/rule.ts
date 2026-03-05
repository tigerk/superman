import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "套餐名称为必填项", trigger: "blur" }],
  monthPrice: [{ required: true, message: "月付单价为必填项", trigger: "blur" }],
  houseCount: [{ required: true, message: "房源数量为必填项", trigger: "blur" }]
});
