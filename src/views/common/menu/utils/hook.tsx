import editForm from "../components/MenuForm.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog/index";
import { h, onMounted, reactive, ref } from "vue";
import type { FormItemProps, MenuConfig } from "./types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { cloneDeep, deviceDetection, isAllEmpty } from "@pureadmin/utils";

export function useMenuManager(config: MenuConfig) {
  const form = reactive({
    title: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const getMenuType = (type: number, text = false) => {
    switch (type) {
      case 0:
        return text ? "菜单" : "primary";
      case 1:
        return text ? "iframe" : "warning";
      case 2:
        return text ? "外链" : "danger";
      case 3:
        return text ? "按钮" : "info";
    }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "title",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{transformI18n(row.title)}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "menuType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.menuType)}
          effect="plain"
        >
          {getMenuType(row.menuType, true)}
        </el-tag>
      )
    },
    {
      label: "路由名称",
      prop: "name"
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component"
    },
    {
      label: "权限标识",
      prop: "auths"
    },
    {
      label: "排序",
      prop: "sortOrder",
      width: 100
    },
    {
      label: "隐藏",
      prop: "showLink",
      formatter: ({ showLink }) => (showLink ? "否" : "是"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val: any) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl: any) {
    if (!formEl) return;
    formEl.resetFields();
    onMenuSearch();
  }

  async function onMenuSearch() {
    loading.value = true;
    try {
      const { data } = await config.apis.list();
      let newData = data;

      if (!isAllEmpty(form.title)) {
        newData = newData.filter((item: any) =>
          transformI18n(item.title).includes(form.title)
        );
      }

      dataList.value = handleTree(newData);
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  function formatHigherMenuOptions(treeList: any): any {
    if (!treeList?.length) return;
    const newTreeList: any[] = [];
    for (const element of treeList) {
      element.title = transformI18n(element.title);
      formatHigherMenuOptions(element.children);
      newTreeList.push(element);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          id: row?.id ?? null,
          menuType: row?.menuType ?? 0,
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? 0,
          title: row?.title ?? "",
          name: row?.name ?? "",
          path: row?.path ?? "",
          component: row?.component ?? "",
          sortOrder: row?.sortOrder ?? 99,
          redirect: row?.redirect ?? "",
          icon: row?.icon ?? "",
          extraIcon: row?.extraIcon ?? "",
          enterTransition: row?.enterTransition ?? "",
          leaveTransition: row?.leaveTransition ?? "",
          activePath: row?.activePath ?? "",
          auths: row?.auths ?? "",
          frameSrc: row?.frameSrc ?? "",
          frameLoading: row?.frameLoading ?? true,
          keepAlive: row?.keepAlive ?? false,
          hiddenTag: row?.hiddenTag ?? false,
          fixedTag: row?.fixedTag ?? false,
          showLink: row?.showLink ?? true,
          showParent: row?.showParent ?? false
        }
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          config.apis.create(curData).then((resp: any) => {
            if (resp.code === 0) {
              message(
                `您${title}了名称为${transformI18n(curData.title)}的菜单`,
                { type: "success" }
              );
              done();
              onMenuSearch();
            } else {
              message(resp.message, { type: "error" });
            }
          });
        }

        FormRef.validate((valid: boolean) => {
          if (valid) {
            chores();
          }
        });
      }
    });
  }

  function handleDelete(row: any) {
    config.apis.delete(row.id).then((resp: any) => {
      if (resp.code === 0) {
        message(`您删除了菜单名称为${transformI18n(row.title)}`, {
          type: "success"
        });
        onMenuSearch();
      } else {
        message(resp.message, { type: "error" });
      }
    });
  }

  onMounted(() => {
    onMenuSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch: onMenuSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange
  };
}
