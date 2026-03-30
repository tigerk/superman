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

const companyCards = computed(() => [
  {
    label: "公司总数",
    value: overview.value.companyCount || 0,
    accent: "var(--el-color-primary)"
  }
]);

const trialCards = computed(() => [
  {
    label: "试用申请总数",
    value: overview.value.trialStats?.totalCount || 0,
    accent: "var(--el-color-primary)"
  },
  {
    label: "未处理",
    value: overview.value.trialStats?.pendingCount || 0,
    accent: "var(--el-color-warning)"
  },
  {
    label: "已处理",
    value: overview.value.trialStats?.approvedCount || 0,
    accent: "var(--el-color-success)"
  },
  {
    label: "已驳回",
    value: overview.value.trialStats?.rejectedCount || 0,
    accent: "var(--el-color-danger)"
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
  <div class="welcome-page" v-loading="loading">
    <el-row :gutter="18">
      <el-col
        v-for="item in companyCards"
        :key="item.label"
        :xl="12"
        :lg="12"
        :md="12"
        :sm="24"
        :xs="24"
        class="mb-[18px]"
      >
        <el-card shadow="never" class="summary-card">
          <div class="summary-label">{{ item.label }}</div>
          <div class="summary-value" :style="{ color: item.accent }">
            {{ item.value }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="18">
      <el-col :xl="14" :lg="14" :md="24" :sm="24" :xs="24" class="mb-[18px]">
        <el-card shadow="never" class="panel-card">
          <template #header>
            <div class="panel-header">
              <span>套餐公司分布</span>
            </div>
          </template>
          <el-table
            :data="overview.packageCompanyCounts || []"
            stripe
            empty-text="暂无套餐数据"
          >
            <el-table-column
              prop="packageName"
              label="套餐名称"
              min-width="180"
            />
            <el-table-column
              prop="companyCount"
              label="公司数量"
              min-width="120"
              align="center"
            />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xl="10" :lg="10" :md="24" :sm="24" :xs="24" class="mb-[18px]">
        <el-card shadow="never" class="panel-card">
          <template #header>
            <div class="panel-header">
              <span>试用申请概览</span>
            </div>
          </template>
          <div class="trial-grid">
            <div
              v-for="item in trialCards"
              :key="item.label"
              class="trial-card"
              :style="{ borderColor: item.accent }"
            >
              <div class="summary-label">{{ item.label }}</div>
              <div class="summary-value" :style="{ color: item.accent }">
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
.welcome-page {
  .summary-card,
  .panel-card {
    border-radius: 14px;
  }
}

.summary-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.summary-value {
  margin-top: 12px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
}

.trial-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.trial-card {
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  padding: 18px;
  background: var(--el-fill-color-blank);
}

@media (max-width: 768px) {
  .trial-grid {
    grid-template-columns: 1fr;
  }
}
</style>
