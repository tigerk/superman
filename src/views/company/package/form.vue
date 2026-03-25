<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { CompanyPackageFormProps } from "./utils/types";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<CompanyPackageFormProps>(), {
  formInline: () => ({
    name: "",
    monthPrice: "",
    yearPrice: "",
    houseCount: "",
    registerDefault: 0,
    remark: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
    label-position="top"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24" class="px-2">
        <el-form-item label="套餐名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入套餐名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="8" :xs="24" :sm="24" class="px-2">
        <el-form-item label="月订阅价" prop="monthPrice">
          <el-input-number
            v-model="newFormInline.monthPrice"
            :precision="2"
            :min="0"
            :step="0.01"
            controls-position="right"
            placeholder="请输入月单价"
          >
            <template #suffix>
              <span>元</span>
            </template>
            <template #prefix>
              <span>¥</span>
            </template>
          </el-input-number>
        </el-form-item>
      </re-col>

      <re-col :value="8" :xs="24" :sm="24" class="px-2">
        <el-form-item label="年订阅价" prop="yearPrice">
          <el-input-number
            v-model="newFormInline.yearPrice"
            :precision="2"
            :min="0"
            :step="0.01"
            controls-position="right"
            placeholder="请输入年付价"
          >
            <template #suffix>
              <span>元</span>
            </template>
            <template #prefix>
              <span>¥</span>
            </template>
          </el-input-number>
        </el-form-item>
      </re-col>

      <re-col :value="8" :xs="24" :sm="24" class="px-2">
        <el-form-item label="房源数量" prop="houseCount">
          <el-input-number
            v-model="newFormInline.houseCount"
            :precision="0"
            :min="1"
            :step="1"
            controls-position="right"
            placeholder="请输入房源数量"
          />
        </el-form-item>
      </re-col>
      <re-col :value="8" :xs="24" :sm="24" class="px-2">
        <el-form-item label="注册默认">
          <el-switch
            v-model="newFormInline.registerDefault"
            :active-value="1"
            :inactive-value="0"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24" class="px-2">
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
