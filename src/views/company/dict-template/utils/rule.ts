import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive(<FormRules>{
  dictCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入数据项名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入数据项值", trigger: "blur" }],
  ver: [{ required: true, message: "请输入版本号", trigger: "blur" }]
});
