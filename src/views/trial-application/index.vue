<script setup lang="tsx">
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref } from "vue";
import { message } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { FormInstance } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import type {
  TrialApplicationHandleDto,
  TrialApplicationQueryDto,
  TrialApplicationStatusEnum,
  TrialApplicationVo
} from "@/types/generated";
import {
  getTrialApplicationList,
  handleTrialApplication
} from "@/api/platform/trialApplication";
import Refresh from "~icons/ep/refresh";

defineOptions({
  name: "TrialApplication"
});

const formRef = ref<FormInstance>();
const loading = ref(true);
const dataList = ref<TrialApplicationVo[]>([]);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const currentRow = ref<TrialApplicationVo | null>(null);

const form = reactive<TrialApplicationQueryDto>({
  phone: "",
  cityName: "",
  status: undefined
});

const handleFormRef = ref<FormInstance>();
const handleForm = reactive<TrialApplicationHandleDto>({
  id: "",
  status: 1 as TrialApplicationStatusEnum,
  handleRemark: ""
});

const handleRules = reactive({
  handleRemark: [{ required: true, message: "请输入备注信息", trigger: "blur" }]
});

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const columns: TableColumnList = [
  {
    label: "申请ID",
    prop: "id",
    minWidth: 90
  },
  {
    label: "手机号",
    prop: "phone",
    minWidth: 140
  },
  {
    label: "城市",
    prop: "cityName",
    minWidth: 120
  },
  {
    label: "如何使用系统",
    prop: "usageRemark",
    minWidth: 240,
    showOverflowTooltip: true
  },
  {
    label: "状态",
    minWidth: 100,
    cellRenderer: scope => (
      <el-tag
        type={
          scope.row.status === 1
            ? "success"
            : scope.row.status === 2
              ? "danger"
              : "warning"
        }
      >
        {scope.row.status === 1
          ? "已通过"
          : scope.row.status === 2
            ? "已拒绝"
            : "申请中"}
      </el-tag>
    )
  },
  {
    label: "处理备注",
    prop: "handleRemark",
    minWidth: 220,
    showOverflowTooltip: true
  },
  {
    label: "申请时间",
    prop: "createAt",
    minWidth: 170,
    formatter: ({ createAt }) =>
      createAt ? dayjs(createAt).format("YYYY-MM-DD HH:mm:ss") : "-"
  },
  {
    label: "更新时间",
    prop: "updateAt",
    minWidth: 170,
    formatter: ({ updateAt }) =>
      updateAt ? dayjs(updateAt).format("YYYY-MM-DD HH:mm:ss") : "-"
  },
  {
    label: "操作",
    fixed: "right",
    width: 180,
    slot: "operation"
  }
];

const dialogTitle = computed(() =>
  handleForm.status === 1 ? "通过试用申请" : "拒绝试用申请"
);

const onSearch = async () => {
  loading.value = true;
  try {
    const res = await getTrialApplicationList({
      ...form,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    dataList.value = res.data?.list || [];
    pagination.total = Number(res.data?.total || 0);
    pagination.pageSize = Number(res.data?.pageSize || pagination.pageSize);
    pagination.currentPage = Number(
      res.data?.currentPage || pagination.currentPage
    );
  } finally {
    loading.value = false;
  }
};

const resetForm = async (formEl?: FormInstance) => {
  if (!formEl) return;
  formEl.resetFields();
  pagination.currentPage = 1;
  await onSearch();
};

const openHandleDialog = (
  row: TrialApplicationVo,
  status: TrialApplicationStatusEnum
) => {
  currentRow.value = row;
  handleForm.id = row.id || "";
  handleForm.status = status;
  handleForm.handleRemark = "";
  dialogVisible.value = true;
};

const submitHandle = async () => {
  if (!handleFormRef.value) return;
  const valid = await handleFormRef.value.validate().catch(() => false);
  if (!valid) return;

  submitLoading.value = true;
  try {
    const res = await handleTrialApplication({ ...handleForm });
    if (res.code === 0) {
      message("处理成功", { type: "success" });
      dialogVisible.value = false;
      await onSearch();
    } else {
      message(res.message, { type: "error" });
    }
  } finally {
    submitLoading.value = false;
  }
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  onSearch();
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  onSearch();
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="手机号：" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="城市：" prop="cityName">
        <el-input
          v-model="form.cityName"
          placeholder="请输入城市"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="w-[180px]!"
        >
          <el-option label="申请中" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="试用申请" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          adaptive
          :adaptiveConfig="{ offsetBottom: 82 }"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <template v-if="row.status === 0">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openHandleDialog(row, 1)"
              >
                已通过
              </el-button>
              <el-button
                class="reset-margin"
                link
                type="danger"
                :size="size"
                @click="openHandleDialog(row, 2)"
              >
                已拒绝
              </el-button>
            </template>
            <span v-else class="text-text_color_disabled">已处理</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="460px"
      destroy-on-close
    >
      <el-form
        ref="handleFormRef"
        :model="handleForm"
        :rules="handleRules"
        label-position="top"
      >
        <el-form-item label="手机号">
          <el-input :model-value="currentRow?.phone || '-'" disabled />
        </el-form-item>
        <el-form-item label="处理备注" prop="handleRemark">
          <el-input
            v-model="handleForm.handleRemark"
            type="textarea"
            :rows="4"
            maxlength="300"
            show-word-limit
            placeholder="请输入处理备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          :type="handleForm.status === 1 ? 'primary' : 'danger'"
          :loading="submitLoading"
          @click="submitHandle"
        >
          确认提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
