<script setup lang="ts">
import { useDictTemplate } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({
  name: "DictTemplate"
});

const {
  templateTableRef,
  dataTableRef,
  loading,
  syncLoading,
  templateList,
  dataTemplateList,
  templateColumns,
  dataColumns,
  selectedDictCode,
  templateOptions,
  loadDataTemplateList,
  openTemplateDialog,
  openDataDialog,
  handleDeleteTemplate,
  handleDeleteData,
  handleSync
} = useDictTemplate();
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <div class="toolbar">
        <div class="title">字典模板管理</div>
        <el-button type="primary" :loading="syncLoading" @click="handleSync">
          同步到公司字典
        </el-button>
      </div>
      <el-row :gutter="16">
        <el-col :span="12">
          <PureTableBar
            title="字典模板"
            :columns="templateColumns"
            :tableRef="templateTableRef?.getTableRef()"
          >
            <template #buttons>
              <el-button type="primary" @click="openTemplateDialog()">
                新增字典模板
              </el-button>
            </template>
            <template v-slot="{ size, dynamicColumns }">
              <pure-table
                ref="templateTableRef"
                row-key="dictCode"
                :loading="loading"
                :size="size"
                :data="templateList"
                :columns="dynamicColumns"
                default-expand-all
                border
              >
                <template #operationTemplate="{ row }">
                  <el-button
                    type="primary"
                    link
                    @click="openTemplateDialog('修改', row)"
                  >
                    修改
                  </el-button>
                  <el-popconfirm
                    title="确认删除该模板？"
                    @confirm="handleDeleteTemplate(row)"
                  >
                    <template #reference>
                      <el-button type="danger" link>删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </pure-table>
            </template>
          </PureTableBar>
        </el-col>

        <el-col :span="12">
          <PureTableBar
            title="字典数据项模板"
            :columns="dataColumns"
            :tableRef="dataTableRef?.getTableRef()"
          >
            <template #buttons>
              <el-space>
                <el-select
                  v-model="selectedDictCode"
                  clearable
                  filterable
                  placeholder="按字典编码筛选"
                  style="width: 220px"
                  @change="loadDataTemplateList"
                >
                  <el-option
                    v-for="item in templateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button type="primary" @click="openDataDialog()">
                  新增数据模板
                </el-button>
              </el-space>
            </template>
            <template v-slot="{ size, dynamicColumns }">
              <pure-table
                ref="dataTableRef"
                :loading="loading"
                :size="size"
                :data="dataTemplateList"
                :columns="dynamicColumns"
                border
              >
                <template #operationData="{ row }">
                  <el-button
                    type="primary"
                    link
                    @click="openDataDialog('修改', row)"
                  >
                    修改
                  </el-button>
                  <el-popconfirm
                    title="确认删除该模板数据？"
                    @confirm="handleDeleteData(row)"
                  >
                    <template #reference>
                      <el-button type="danger" link>删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </pure-table>
            </template>
          </PureTableBar>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
