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
  <div class="dict-template-page">
    <!-- 页面顶部 Banner -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-icon">
          <IconifyIconOnline icon="ri:book-2-line" width="22" />
        </div>
        <div>
          <h1 class="page-title">字典模板管理</h1>
          <p class="page-subtitle">
            维护平台级字典模板与数据项，一键同步至各公司
          </p>
        </div>
      </div>
      <el-button
        type="primary"
        :loading="syncLoading"
        class="sync-btn"
        @click="handleSync"
      >
        <template #icon>
          <IconifyIconOnline icon="ri:refresh-line" />
        </template>
        同步到公司字典
      </el-button>
    </div>

    <!-- 双栏内容区 -->
    <div class="content-grid">
      <!-- 左栏：字典模板 -->
      <div class="panel">
        <div class="panel-title-bar">
          <div class="panel-title-inner">
            <span class="panel-indicator indicator-blue" />
            <span class="panel-label">字典模板</span>
            <el-tag size="small" round type="info" class="count-badge">
              {{ templateList.length }}
            </el-tag>
          </div>
        </div>

        <PureTableBar
          :columns="templateColumns"
          :tableRef="templateTableRef?.getTableRef()"
        >
          <template #buttons>
            <el-button
              type="primary"
              size="small"
              @click="openTemplateDialog()"
            >
              <template #icon>
                <IconifyIconOnline icon="ri:add-line" />
              </template>
              新增模板
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
              :border="false"
              stripe
            >
              <template #operationTemplate="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openTemplateDialog('修改', row)"
                >
                  编辑
                </el-button>
                <el-divider direction="vertical" />
                <el-popconfirm
                  title="确认删除该模板？"
                  confirm-button-type="danger"
                  width="200"
                  @confirm="handleDeleteTemplate(row)"
                >
                  <template #reference>
                    <el-button type="danger" link size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>

      <!-- 右栏：数据项模板 -->
      <div class="panel">
        <div class="panel-title-bar">
          <div class="panel-title-inner">
            <span class="panel-indicator indicator-green" />
            <span class="panel-label">字典数据项模板</span>
            <el-tag size="small" round type="info" class="count-badge">
              {{ dataTemplateList.length }}
            </el-tag>
          </div>
        </div>

        <PureTableBar
          :columns="dataColumns"
          :tableRef="dataTableRef?.getTableRef()"
        >
          <template #buttons>
            <div class="data-bar-btns">
              <el-select
                v-model="selectedDictCode"
                clearable
                filterable
                placeholder="按字典编码筛选"
                size="small"
                style="width: 200px"
                @change="loadDataTemplateList"
              >
                <el-option
                  v-for="item in templateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button type="primary" size="small" @click="openDataDialog()">
                <template #icon>
                  <IconifyIconOnline icon="ri:add-line" />
                </template>
                新增数据项
              </el-button>
            </div>
          </template>

          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="dataTableRef"
              :loading="loading"
              :size="size"
              :data="dataTemplateList"
              :columns="dynamicColumns"
              :border="false"
              stripe
            >
              <template #operationData="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDataDialog('修改', row)"
                >
                  编辑
                </el-button>
                <el-divider direction="vertical" />
                <el-popconfirm
                  title="确认删除该数据项？"
                  confirm-button-type="danger"
                  width="200"
                  @confirm="handleDeleteData(row)"
                >
                  <template #reference>
                    <el-button type="danger" link size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ── 整体页面 ── */
.dict-template-page {
  min-height: 100%;
  background: var(--el-bg-color-page, #f5f7fa);
}

/* ── 顶部 Banner ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  margin-bottom: 16px;
  background: var(--el-bg-color);
  border-radius: 10px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.page-title {
  margin: 0 0 3px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.3;
}

.page-subtitle {
  margin: 0;
  font-size: 12.5px;
  color: var(--el-text-color-secondary);
}

.sync-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 0 18px;
  height: 34px;
}

/* ── 双栏内容区 ── */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
}

/* ── 面板 ── */
.panel {
  background: var(--el-bg-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);

  /* 去掉 PureTableBar 内层自带的卡片边距和阴影 */
  :deep(.pure-table-bar) {
    box-shadow: none !important;
    border: none !important;
  }
}

/* ── 面板标题栏 ── */
.panel-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 4px;
}

.panel-title-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-indicator {
  display: block;
  width: 3px;
  height: 16px;
  border-radius: 2px;
  flex-shrink: 0;

  &.indicator-blue {
    background: var(--el-color-primary);
  }

  &.indicator-green {
    background: var(--el-color-success);
  }
}

.panel-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.count-badge {
  font-size: 11px;
  padding: 0 7px;
  height: 18px;
  line-height: 16px;
}

/* ── 数据项工具栏按钮区 ── */
.data-bar-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ── 表格行 hover 色调 ── */
:deep(.el-table__row:hover > td.el-table__cell) {
  background-color: var(--el-color-primary-light-9) !important;
}

/* 操作列分隔线 */
:deep(.el-divider--vertical) {
  margin: 0 1px;
  height: 12px;
}

/* 表头样式统一 */
:deep(.el-table__header-wrapper th.el-table__cell) {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-weight: 500;
  font-size: 12.5px;
}
</style>
