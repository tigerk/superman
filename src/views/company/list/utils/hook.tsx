import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import {
  changeCompanyStatus,
  createCompany,
  deleteCompany,
  getCompanyList
} from "@/api/company/company";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import type { CompanyFormItemProps } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { h, onMounted, reactive, ref, toRaw } from "vue";
import { usePublicHooks } from "@/utils/publicHooks";

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
      minWidth: 80,
      hide: true
    },
    {
      label: "简称",
      prop: "abbr",
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
      label: "账号额度",
      prop: "accountCount",
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
      label: "管理员账号",
      prop: "adminPhone",
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
        switchLoadMap.value[index] = {
          ...switchLoadMap.value[index],
          loading: true
        };
        setTimeout(() => {
          changeCompanyStatus({
            id: row.id,
            status: row.status
          }).then(resp => {
            if (resp.code === 0) {
              switchLoadMap.value[index] = {
                ...switchLoadMap.value[index],
                loading: false
              };
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

  function handleDelete(row: CompanyFormItemProps) {
    deleteCompany({ id: row.id }).then(resp => {
      if (resp.code === 0) {
        message(`您删除了租户名为${row.name}的这条数据`, { type: "success" });
        onCompanySearch().then();
      }
    });
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

  async function onCompanySearch() {
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
    onCompanySearch().then();
  };

  function openDialog(title = "新增", row?: CompanyFormItemProps) {
    const defaultFormInline = {
      title: "新增",
      id: null,
      /** 公司简称 */
      abbr: "",
      /** 公司名 */
      name: "",
      /** 区域ID */
      regionId: null,
      /** 通信地址 */
      address: "",
      /** 公司社会统一信用代码 */
      uscc: "",
      /** 法人姓名 */
      legalPerson: "",
      /** 联系人 */
      contactName: "",
      /** 联系电话 */
      contactPhone: "",
      /** 邮箱 */
      email: "",
      /** 账号额度 */
      accountCount: 10,
      /** 绑定域名 */
      website: "",
      /** 租户套餐 */
      packageId: null,
      /** 公司管理员 */
      adminUserId: null,
      /** 备注 */
      remark: "",
      /** 公司性质 1：企业 2：个人 */
      nature: 1
    };

    addDialog({
      title: `${title}公司`,
      props: {
        formInline: {
          ...defaultFormInline,
          title,
          ...(row || {})
        }
      },
      width: "32%",
      top: "5vh",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as CompanyFormItemProps;

        function chores() {
          createCompany(curData).then(resp => {
            if (resp.code === 0) {
              message(`您${title}了公司：${curData.name}`, {
                type: "success"
              });
              done(); // 关闭弹框
              onCompanySearch().then(); // 刷新表格数据
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
            chores();
          }
        });
      }
    });
  }

  onMounted(() => {
    onCompanySearch().then();
  });

  return {
    form,
    isShow,
    loading,
    columns,
    dataList,
    pagination,
    onSearch: onCompanySearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
