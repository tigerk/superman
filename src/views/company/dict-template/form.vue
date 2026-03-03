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

const predefineColors = ref([
  "#f56c6c",
  "#e6a23c",
  "#ffd700",
  "#67c23a",
  "#00ced1",
  "#409eff",
  "#6e56cf",
  "#c71585",
  "#2e7d32"
]);

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
    label-position="top"
    class="dict-form"
  >
    <!-- ── 字典模板模式 ── -->
    <template v-if="isDictMode">
      <div class="form-row-2">
        <el-form-item label="字典编码" prop="dictCode">
          <el-input
            v-model="newFormInline.dictCode"
            placeholder="请输入字典编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="newFormInline.dictName"
            placeholder="请输入字典名称"
            clearable
          />
        </el-form-item>
      </div>

      <el-form-item label="父级编码">
        <el-input
          v-model="newFormInline.parentCode"
          placeholder="根节点填写 0"
          clearable
        />
      </el-form-item>

      <div class="form-row-2">
        <el-form-item label="版本号" prop="ver">
          <el-input-number
            v-model="newFormInline.ver"
            :min="1"
            controls-position="right"
            class="w-full!"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="newFormInline.sortOrder"
            :min="0"
            controls-position="right"
            class="w-full!"
          />
        </el-form-item>
      </div>

      <!-- 开关组 -->
      <div class="switch-group">
        <div class="switch-cell">
          <span class="switch-label">状态</span>
          <el-switch
            v-model="newFormInline.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            inline-prompt
          />
        </div>
        <div class="switch-cell">
          <span class="switch-label">隐藏</span>
          <el-switch
            v-model="newFormInline.hidden"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </div>
        <div class="switch-cell">
          <span class="switch-label">启用</span>
          <el-switch
            v-model="newFormInline.enabled"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </div>
      </div>
    </template>

    <!-- ── 数据项模式 ── -->
    <template v-else>
      <el-form-item label="所属字典" prop="dictCode">
        <el-select
          v-model="newFormInline.dictCode"
          filterable
          placeholder="请选择字典编码"
          style="width: 100%"
        >
          <el-option
            v-for="item in newFormInline.templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <div class="form-row-2">
        <el-form-item label="数据项名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="数据项值" prop="value">
          <el-input
            v-model="newFormInline.value"
            placeholder="请输入值"
            clearable
          />
        </el-form-item>
      </div>

      <div class="form-row-2">
        <el-form-item label="版本号" prop="ver">
          <el-input-number
            v-model="newFormInline.ver"
            :min="1"
            controls-position="right"
            class="w-full!"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="newFormInline.sortOrder"
            :min="0"
            controls-position="right"
            class="w-full!"
          />
        </el-form-item>
      </div>

      <!-- 颜色选择器 -->
      <el-form-item label="标签颜色">
        <div class="color-row">
          <el-input
            v-model="newFormInline.color"
            placeholder="#RRGGBB 或留空"
            clearable
            class="color-input"
          >
            <template #prefix>
              <span
                class="color-dot"
                :style="{
                  background: newFormInline.color || 'var(--el-border-color)'
                }"
              />
            </template>
          </el-input>
          <el-color-picker
            v-model="newFormInline.color"
            color-format="hex"
            :predefine="predefineColors"
          />
        </div>
      </el-form-item>

      <!-- 开关组 -->
      <div class="switch-group">
        <div class="switch-cell">
          <span class="switch-label">状态</span>
          <el-switch
            v-model="newFormInline.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            inline-prompt
          />
        </div>
        <div class="switch-cell">
          <span class="switch-label">可删除</span>
          <el-switch
            v-model="newFormInline.deletable"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </div>
        <div class="switch-cell">
          <span class="switch-label">启用</span>
          <el-switch
            v-model="newFormInline.enabled"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </div>
      </div>
    </template>

    <!-- 备注（通用） -->
    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        placeholder="选填备注信息"
        resize="none"
      />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.dict-form {
  padding: 4px 2px;

  :deep(.el-form-item__label) {
    font-size: 13px;
    color: var(--el-text-color-regular);
    padding-bottom: 5px;
    line-height: 1.4;
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: 6px;
  }

  :deep(.el-select .el-input__wrapper) {
    border-radius: 6px;
  }

  :deep(.el-input-number) {
    border-radius: 6px;
  }
}

/* 两列 grid 行 */
.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

/* 开关组卡片 */
.switch-group {
  display: flex;
  margin-bottom: 18px;
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-fill-color-lighter, #f9f9f9);
}

.switch-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;

  & + & {
    border-left: 1px solid var(--el-border-color-extra-light);
  }
}

.switch-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1;
}

/* 颜色选择器行 */
.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.color-input {
  flex: 1;
}

.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--el-border-color);
  flex-shrink: 0;
  transition: background 0.2s;
}
</style>
