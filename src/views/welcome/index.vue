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
  houseCount: "",
  roomCount: "",
  userCount: "",
  packageCompanyCounts: [],
  trialStats: {
    totalCount: "",
    pendingCount: "",
    approvedCount: "",
    rejectedCount: ""
  }
});

// ── Animated counter ──
const animatedValues = ref<Record<string, number>>({
  companyCount: 0,
  houseCount: 0,
  roomCount: 0,
  userCount: 0
});

function animateCount(key: string, target: number, duration = 900) {
  const start = performance.now();
  const from = animatedValues.value[key] ?? 0;
  const step = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    animatedValues.value[key] = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const companyCount = computed(() => Number(overview.value.companyCount) || 0);
const houseCount = computed(() => Number(overview.value.houseCount) || 0);
const roomCount = computed(() => Number(overview.value.roomCount) || 0);
const userCount = computed(() => Number(overview.value.userCount) || 0);

const kpiCards = computed(() => [
  {
    label: "公司总数",
    value: animatedValues.value.companyCount,
    icon: "ri:building-2-line",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    lightBg: "#f0eeff",
    iconColor: "#764ba2",
    deco: "#c4b5fd"
  },
  {
    label: "系统房源总数",
    value: animatedValues.value.houseCount,
    icon: "ri:home-5-line",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    lightBg: "#edfdf5",
    iconColor: "#059669",
    deco: "#6ee7b7"
  },
  {
    label: "系统房间总数",
    value: animatedValues.value.roomCount,
    icon: "ri:hotel-bed-line",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    lightBg: "#fff0f3",
    iconColor: "#e11d48",
    deco: "#fda4af"
  },
  {
    label: "系统用户总数",
    value: animatedValues.value.userCount,
    icon: "ri:user-settings-line",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    lightBg: "#eff9ff",
    iconColor: "#0284c7",
    deco: "#7dd3fc"
  }
]);

const trialCards = computed(() => [
  {
    label: "试用申请总数",
    value: overview.value.trialStats?.totalCount || 0,
    icon: "ri:file-list-3-line",
    color: "#6366f1",
    bg: "linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%)",
    border: "#c7d2fe"
  },
  {
    label: "未处理",
    value: overview.value.trialStats?.pendingCount || 0,
    icon: "ri:time-line",
    color: "#f59e0b",
    bg: "linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)",
    border: "#fde68a"
  },
  {
    label: "已处理",
    value: overview.value.trialStats?.approvedCount || 0,
    icon: "ri:checkbox-circle-line",
    color: "#10b981",
    bg: "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)",
    border: "#6ee7b7"
  },
  {
    label: "已驳回",
    value: overview.value.trialStats?.rejectedCount || 0,
    icon: "ri:close-circle-line",
    color: "#ef4444",
    bg: "linear-gradient(135deg,#fef2f2 0%,#fee2e2 100%)",
    border: "#fca5a5"
  }
]);

const fetchOverview = async () => {
  loading.value = true;
  try {
    const res = await getPlatformOverview();
    if (res.code === 0 && res.data) {
      overview.value = res.data;
      animateCount("companyCount", Number(res.data.companyCount) || 0);
      animateCount("houseCount", Number(res.data.houseCount) || 0);
      animateCount("roomCount", Number(res.data.roomCount) || 0);
      animateCount("userCount", Number(res.data.userCount) || 0);
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
  <div v-loading="loading" class="dash-root">
    <!-- ── KPI Strip ── -->
    <section class="kpi-strip">
      <div
        v-for="(item, idx) in kpiCards"
        :key="item.label"
        class="kpi-card"
        :style="{ '--card-delay': `${idx * 80}ms` }"
      >
        <!-- Soft glow blob behind icon -->
        <div class="kpi-glow" :style="{ background: item.deco }" />

        <div class="kpi-icon-ring" :style="{ background: item.lightBg }">
          <IconifyIconOnline
            :icon="item.icon"
            width="24"
            :style="{ color: item.iconColor }"
          />
        </div>

        <div class="kpi-content">
          <p class="kpi-label">{{ item.label }}</p>
          <p class="kpi-value">
            <span
              class="kpi-number"
              :style="{
                background: item.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }"
              >{{ item.value.toLocaleString() }}</span
            >
          </p>
        </div>

        <!-- Decorative bar at bottom -->
        <div class="kpi-bar" :style="{ background: item.gradient }" />
      </div>
    </section>

    <!-- ── Main Grid ── -->
    <el-row :gutter="20" class="content-grid">
      <!-- Left: Package Distribution -->
      <el-col :xl="14" :lg="14" :md="24" :sm="24" :xs="24" class="grid-col">
        <div class="panel">
          <div class="panel-head">
            <div class="panel-head-left">
              <div class="head-accent" />
              <span class="panel-title">套餐公司分布</span>
            </div>
            <div class="pkg-badge">
              <span class="pkg-badge-dot" />
              {{ (overview.packageCompanyCounts || []).length }} 个套餐
            </div>
          </div>

          <div class="panel-body">
            <el-table
              :data="overview.packageCompanyCounts || []"
              empty-text="暂无套餐数据"
              class="dist-table"
            >
              <el-table-column
                prop="packageName"
                label="套餐名称"
                min-width="160"
              >
                <template #default="{ row }">
                  <div class="pkg-name-cell">
                    <span class="pkg-dot" />
                    <span class="pkg-name-text">{{ row.packageName }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="companyCount"
                label="公司数量"
                min-width="100"
                align="center"
              >
                <template #default="{ row }">
                  <span
                    class="count-badge"
                    :class="
                      row.companyCount > 0 ? 'count-active' : 'count-empty'
                    "
                  >
                    {{ row.companyCount }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="市场占比" min-width="200" align="center">
                <template #default="{ row }">
                  <div class="progress-wrap">
                    <div class="progress-track">
                      <div
                        class="progress-fill"
                        :style="{
                          width:
                            companyCount > 0
                              ? Math.round(
                                  (Number(row.companyCount) / companyCount) *
                                    100
                                ) + '%'
                              : '0%'
                        }"
                      />
                    </div>
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
          </div>
        </div>
      </el-col>

      <!-- Right: Trial Overview -->
      <el-col :xl="10" :lg="10" :md="24" :sm="24" :xs="24" class="grid-col">
        <div class="panel trial-panel">
          <div class="panel-head">
            <div class="panel-head-left">
              <div class="head-accent accent-amber" />
              <span class="panel-title">试用申请概览</span>
            </div>
          </div>

          <div class="panel-body">
            <div class="trial-grid">
              <div
                v-for="(item, idx) in trialCards"
                :key="item.label"
                class="trial-card"
                :style="{
                  background: item.bg,
                  borderColor: item.border,
                  '--t-delay': `${idx * 60}ms`
                }"
              >
                <div class="trial-top">
                  <div
                    class="trial-icon-wrap"
                    :style="{ background: item.border + '66' }"
                  >
                    <IconifyIconOnline
                      :icon="item.icon"
                      width="18"
                      :style="{ color: item.color }"
                    />
                  </div>
                  <span class="trial-label">{{ item.label }}</span>
                </div>
                <div class="trial-value" :style="{ color: item.color }">
                  {{ item.value }}
                </div>
                <div
                  class="trial-underline"
                  :style="{ background: item.color }"
                />
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
/* ── Root ── */
.dash-root {
  padding: 2px 0 24px;
  min-height: 100%;
}

/* ── KPI Strip ── */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 10px;
}

.kpi-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 20px 26px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 18px;
  overflow: hidden;
  cursor: default;
  animation: kpiReveal 0.5s ease both;
  animation-delay: var(--card-delay, 0ms);
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.09);
    transform: translateY(-3px);

    .kpi-bar {
      height: 4px;
    }
  }
}

@keyframes kpiReveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-glow {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.18;
  filter: blur(20px);
  pointer-events: none;
}

.kpi-icon-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  .kpi-card:hover & {
    transform: scale(1.08) rotate(-3deg);
  }
}

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.02em;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-value {
  margin: 0;
  line-height: 1;
}

.kpi-number {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

/* Gradient bottom bar */
.kpi-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  border-radius: 0 0 18px 18px;
  transition: height 0.25s ease;
}

/* ── Panels ── */
.content-grid {
  .grid-col {
    margin-bottom: 20px;
  }
}

.panel {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 18px;
  overflow: hidden;
  height: 100%;
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
  }
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.panel-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.head-accent {
  width: 3px;
  height: 18px;
  border-radius: 99px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  flex-shrink: 0;

  &.accent-amber {
    background: linear-gradient(180deg, #f59e0b, #f97316);
  }
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  letter-spacing: 0.01em;
}

.pkg-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 99px;
  padding: 4px 10px;
  font-weight: 500;
}

.pkg-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-primary);
}

.panel-body {
  padding: 16px 20px 20px;
}

/* ── Distribution Table ── */
.dist-table {
  :deep(th.el-table__cell) {
    background: var(--el-fill-color-light) !important;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--el-text-color-secondary);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  :deep(td.el-table__cell) {
    font-size: 14px;
    padding: 12px 0;
  }

  :deep(.el-table__row) {
    transition: background 0.15s ease;

    &:hover td {
      background: var(--el-fill-color-light) !important;
    }
  }
}

.pkg-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pkg-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  flex-shrink: 0;
}

.pkg-name-text {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;

  &.count-active {
    background: #eef2ff;
    color: #4f46e5;
    border: 1px solid #c7d2fe;
  }

  &.count-empty {
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    border: 1px solid var(--el-border-color-lighter);
  }
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: var(--el-fill-color);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  min-width: 36px;
  text-align: right;
}

/* ── Trial Grid ── */
.trial-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.trial-card {
  border-radius: 14px;
  padding: 18px 16px 16px;
  border: 1px solid;
  position: relative;
  overflow: hidden;
  cursor: default;
  animation: trialReveal 0.4s ease both;
  animation-delay: var(--t-delay, 0ms);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  }
}

@keyframes trialReveal {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.trial-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.trial-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
}

.trial-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  line-height: 1.3;
}

.trial-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}

.trial-underline {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40%;
  height: 2px;
  border-radius: 99px;
  opacity: 0.45;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .kpi-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-strip {
    grid-template-columns: 1fr;
  }

  .trial-grid {
    grid-template-columns: 1fr;
  }
}
</style>
