import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import {
  changeCompanyStatus,
  createCompany,
  getCompanyList
} from "@/api/system";
import { addDialog } from "@/components/ReDialog/index";
import { deviceDetection } from "@pureadmin/utils";
import type { FormItemProps } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useTenantList() {
  const form = reactive({
    name: "",
    contactName: "",
    contactPhone: "",
    status: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "公司编号",
      prop: "id",
      minWidth: 80
    },
    {
      label: "公司名",
      prop: "name",
      minWidth: 140
    },
    {
      label: "租户套餐",
      prop: "packageName",
      minWidth: 120
    },
    {
      label: "联系人",
      prop: "contactName",
      minWidth: 120
    },
    {
      label: "联系电话",
      prop: "contactPhone",
      minWidth: 120
    },
    {
      label: "状态",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      ),
      minWidth: 90
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          debugger
          changeCompanyStatus({
            id: row.id,
            status: row.status
          }).then(resp => {
            if (resp.code === 0) {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message(`已${row.status === 0 ? "停用" : "启用"}${row.name}`, {
                type: "success"
              });
            }
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleDelete(row) {
    message(`您删除了租户名为${row.name}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getCompanyList(toRaw(form));
    dataList.value = data.list;
    pagination.total = Number(data.total);
    pagination.pageSize = Number(data.pageSize);
    pagination.currentPage = Number(data.currentPage);

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}公司`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          /** 公司简称 */
          abbr: row?.abbr ?? "",
          /** 公司名 */
          name: row?.name ?? "",
          /** 公司社会统一信用代码 */
          uscc: row?.uscc ?? "",
          /** 联系人 */
          contactName: row?.contactName ?? "",
          /** 联系电话 */
          contactPhone: row?.contactPhone ?? "",
          /** 邮箱 */
          email: row?.email ?? "",
          /** 账号额度 */
          accountCount: row?.accountCount ?? "",
          /** 绑定域名 */
          website: row?.website ?? "",
          /** 通信地址 */
          address: row?.address ?? "",
          /** 租户套餐 */
          packageId: row?.packageId ?? "",
          /** 备注 */
          remark: row?.remark ?? "",
          /** 账号 */
          username: row?.username ?? "",
          /** 密码 */
          password: row?.password ?? ""
        }
      },
      width: "32%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          createCompany(curData).then(resp => {
            if (resp.code === 0) {
              message(`您${title}了公司：${curData.name}`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            } else {
              message(resp.message, {
                type: "error"
              });
            }
          });
        }

        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    isShow,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
