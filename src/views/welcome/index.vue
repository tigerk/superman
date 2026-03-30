<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getPlatformOverview } from "@/api/platform/dashboard";
import type { PlatformOverviewVo } from "@/types/generated";

defineOptions({
  name: "Welcome"
});

const loading = ref(false);
const overview = ref<PlatformOverviewVo>({
  companyCount: "",
  packageCompanyCounts: [],
  trialStats: {
    totalCount: "",
    pendingCount: "",
    approvedCount: "",
    rejectedCount: ""
  }
});

const companyCount = computed(() => Number(overview.value.companyCount) || 0);

const trialCards = computed(() => [
  {
    label: "试用申请总数",
    value: overview.value.trialStats?.totalCount || 0,
    icon: "ri:file-list-3-line",
    colorVar: "--el-color-primary",
    bgClass: "card-primary"
  },
  {
    label: "未处理",
    value: overview.value.trialStats?.pendingCount || 0,
    icon: "ri:time-line",
    colorVar: "--el-color-warning",
    bgClass: "card-warning"
  },
  {
    label: "已处理",
    value: overview.value.trialStats?.approvedCount || 0,
    icon: "ri:checkbox-circle-line",
    colorVar: "--el-color-success",
    bgClass: "card-success"
  },
  {
    label: "已驳回",
    value: overview.value.trialStats?.rejectedCount || 0,
    icon: "ri:close-circle-line",
    colorVar: "--el-color-danger",
    bgClass: "card-danger"
  }
]);

const fetchOverview = async () => {
  loading.value = true;
  try {
    const res = await getPlatformOverview();
    if (res.code === 0 && res.data) {
      overview.value = res.data;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOverview();
});
</script>

<template>
  <div class="dashboard-page" v-loading="loading">
    <!-- Top KPI strip -->
    <div class="kpi-strip">
      <div class="kpi-card kpi-company">
        <div class="kpi-icon-wrap">
          <IconifyIconOnline icon="ri:building-2-line" width="28" />
        </div>
        <div class="kpi-body">
          <span class="kpi-label">公司总数</span>
          <span class="kpi-value">{{ companyCount }}</span>
        </div>
        <div class="kpi-deco" />
      </div>
    </div>

    <!-- Main content grid -->
    <el-row :gutter="20" class="main-grid">
      <!-- Package distribution -->
      <el-col :xl="14" :lg="14" :md="24" :sm="24" :xs="24" class="mb-5">
        <el-card shadow="never" class="panel-card">
          <template #header>
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-title-dot" />
                套餐公司分布
              </div>
              <el-tag size="small" type="info" round>
                {{ (overview.packageCompanyCounts || []).length }} 个套餐
              </el-tag>
            </div>
          </template>

          <el-table
            :data="overview.packageCompanyCounts || []"
            empty-text="暂无套餐数据"
            class="dist-table"
            :show-header="true"
          >
            <el-table-column
              prop="packageName"
              label="套餐名称"
              min-width="160"
            >
              <template #default="{ row }">
                <div class="pkg-name-cell">
                  <span class="pkg-dot" />
                  {{ row.packageName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="companyCount"
              label="公司数量"
              min-width="120"
              align="center"
            >
              <template #default="{ row }">
                <el-tag
                  :type="row.companyCount > 0 ? 'primary' : 'info'"
                  round
                  size="small"
                >
                  {{ row.companyCount }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="占比" min-width="180" align="center">
              <template #default="{ row }">
                <div class="progress-cell">
                  <el-progress
                    :percentage="
                      companyCount > 0
                        ? Math.round(
                            (Number(row.companyCount) / companyCount) * 100
                          )
                        : 0
                    "
                    :show-text="false"
                    :stroke-width="6"
                    class="dist-progress"
                  />
                  <span class="progress-pct">
                    {{
                      companyCount > 0
                        ? Math.round(
                            (Number(row.companyCount) / companyCount) * 100
                          )
                        : 0
                    }}%
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Trial overview -->
      <el-col :xl="10" :lg="10" :md="24" :sm="24" :xs="24" class="mb-5">
        <el-card shadow="never" class="panel-card trial-panel">
          <template #header>
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-title-dot accent-warning" />
                试用申请概览
              </div>
            </div>
          </template>

          <div class="trial-grid">
            <div
              v-for="item in trialCards"
              :key="item.label"
              class="trial-card"
              :class="item.bgClass"
            >
              <div class="trial-card-top">
                <IconifyIconOnline
                  :icon="item.icon"
                  width="22"
                  :style="{ color: `var(${item.colorVar})` }"
                />
                <span class="trial-label">{{ item.label }}</span>
              </div>
              <div
                class="trial-value"
                :style="{ color: `var(${item.colorVar})` }"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
/* ─── Page wrapper ─── */
.dashboard-page {
  padding: 4px 0;
}

/* ─── KPI strip ─── */
.kpi-strip {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.kpi-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 28px 20px 22px;
  border-radius: 16px;
  overflow: hidden;
  min-width: 220px;
  flex: 1;
  max-width: 340px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.kpi-company .kpi-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.kpi-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: var(--el-color-primary);
  font-variant-numeric: tabular-nums;
}

.kpi-deco {
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--el-color-primary-light-8);
  opacity: 0.5;
}

/* ─── Panel cards ─── */
.panel-card {
  border-radius: 16px;
  height: 100%;
  border-color: var(--el-border-color-light);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

/* ─── Panel header ─── */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.panel-title-dot {
  display: inline-block;
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: var(--el-color-primary);
  flex-shrink: 0;

  &.accent-warning {
    background: var(--el-color-warning);
  }
}

/* ─── Distribution table ─── */
.dist-table {
  :deep(th.el-table__cell) {
    background: var(--el-fill-color-light) !important;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
  }

  :deep(td.el-table__cell) {
    font-size: 14px;
  }
}

.pkg-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pkg-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--el-color-primary);
  flex-shrink: 0;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .dist-progress {
    flex: 1;
  }

  .progress-pct {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    min-width: 32px;
    text-align: right;
  }
}

/* ─── Trial grid ─── */
.trial-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.trial-card {
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  cursor: default;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  }
}

.trial-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.trial-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.trial-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* Subtle tinted backgrounds per card type — works in both light & dark */
.card-primary {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-7);
}

.card-warning {
  background: var(--el-color-warning-light-9);
  border-color: var(--el-color-warning-light-7);
}

.card-success {
  background: var(--el-color-success-light-9);
  border-color: var(--el-color-success-light-7);
}

.card-danger {
  background: var(--el-color-danger-light-9);
  border-color: var(--el-color-danger-light-7);
}

/* ─── Responsive ─── */
@media (max-width: 640px) {
  .trial-grid {
    grid-template-columns: 1fr;
  }

  .kpi-card {
    max-width: 100%;
  }
}
</style>
