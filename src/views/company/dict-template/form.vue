<script setup lang="ts">
import { computed, ref } from "vue";
import { formRules } from "./utils/rule";
import type { DictTemplateFormProps } from "./utils/types";

const props = withDefaults(defineProps<DictTemplateFormProps>(), {
  formInline: () => ({
    title: "新增",
    mode: "dict",
    id: undefined,
    dictCode: "",
    dictName: "",
    parentCode: "0",
    sortOrder: 0,
    status: 1,
    hidden: false,
    enabled: true,
    ver: 1,
    remark: "",
    name: "",
    value: "",
    color: "",
    deletable: true,
    templateOptions: []
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const isDictMode = computed(() => newFormInline.value.mode === "dict");

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
    label-width="92px"
  >
    <template v-if="isDictMode">
      <el-form-item label="字典编码" prop="dictCode">
        <el-input v-model="newFormInline.dictCode" />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="newFormInline.dictName" />
      </el-form-item>
      <el-form-item label="父级编码">
        <el-input
          v-model="newFormInline.parentCode"
          placeholder="根节点填写 0"
        />
      </el-form-item>
      <el-form-item label="版本号" prop="ver">
        <el-input-number v-model="newFormInline.ver" :min="1" class="w-full!" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="newFormInline.sortOrder"
          :min="0"
          class="w-full!"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="newFormInline.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="隐藏">
        <el-switch v-model="newFormInline.hidden" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="newFormInline.enabled" />
      </el-form-item>
    </template>

    <template v-else>
      <el-form-item label="字典编码" prop="dictCode">
        <el-select
          v-model="newFormInline.dictCode"
          filterable
          placeholder="请选择字典编码"
        >
          <el-option
            v-for="item in newFormInline.templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据项名称" prop="name">
        <el-input v-model="newFormInline.name" />
      </el-form-item>
      <el-form-item label="数据项值" prop="value">
        <el-input v-model="newFormInline.value" />
      </el-form-item>
      <el-form-item label="版本号" prop="ver">
        <el-input-number v-model="newFormInline.ver" :min="1" class="w-full!" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="newFormInline.sortOrder"
          :min="0"
          class="w-full!"
        />
      </el-form-item>
      <el-form-item label="颜色">
        <el-input v-model="newFormInline.color" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="newFormInline.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="可删除">
        <el-switch v-model="newFormInline.deletable" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="newFormInline.enabled" />
      </el-form-item>
    </template>

    <el-form-item label="备注">
      <el-input v-model="newFormInline.remark" type="textarea" />
    </el-form-item>
  </el-form>
</template>
