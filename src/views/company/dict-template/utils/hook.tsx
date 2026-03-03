import { computed, h, onMounted, ref } from "vue";
import editForm from "../form.vue";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { message } from "@/utils/message";
import {
  deleteDictDataTemplate,
  deleteDictTemplate,
  getDictDataTemplateList,
  getDictTemplateTree,
  saveDictDataTemplate,
  saveDictTemplate,
  syncDictTemplate,
  type DictDataTemplateItem,
  type DictTemplateItem
} from "@/api/platform/dictTemplate";
import type { DictDataTemplateRow, DictTemplateFormItemProps, DictTemplateRow } from "./types";

export function useDictTemplate() {
  const templateTableRef = ref();
  const dataTableRef = ref();
  const formRef = ref();
  const loading = ref(false);
  const syncLoading = ref(false);
  const templateList = ref<DictTemplateItem[]>([]);
  const dataTemplateList = ref<DictDataTemplateItem[]>([]);
  const selectedDictCode = ref("");

  const templateOptions = computed(() => {
    const list: Array<{ label: string; value: string }> = [];
    const walk = (nodes: DictTemplateItem[]) => {
      nodes.forEach(item => {
        list.push({
          label: `${item.dictName} (${item.dictCode})`,
          value: item.dictCode
        });
        if (item.children?.length) walk(item.children);
      });
    };
    walk(templateList.value);
    return list;
  });

  const templateColumns: TableColumnList = [
    { label: "编码", prop: "dictCode", minWidth: 130 },
    { label: "名称", prop: "dictName", minWidth: 130 },
    { label: "父编码", prop: "parentCode", width: 100 },
    { label: "版本", prop: "ver", width: 80 },
    { label: "排序", prop: "sortOrder", width: 80 },
    { label: "操作", slot: "operationTemplate", width: 160 }
  ];

  const dataColumns: TableColumnList = [
    { label: "字典编码", prop: "dictCode", minWidth: 130 },
    { label: "名称", prop: "name", minWidth: 120 },
    { label: "值", prop: "value", minWidth: 120 },
    { label: "版本", prop: "ver", width: 80 },
    { label: "排序", prop: "sortOrder", width: 80 },
    { label: "操作", slot: "operationData", width: 160 }
  ];

  async function loadTemplateTree() {
    const resp = await getDictTemplateTree();
    if (resp.code !== 0) {
      message(resp.message || "获取模板失败", { type: "error" });
      return;
    }
    templateList.value = resp.data || [];
  }

  async function loadDataTemplateList() {
    const resp = await getDictDataTemplateList(selectedDictCode.value ? { dictCode: selectedDictCode.value } : {});
    if (resp.code !== 0) {
      message(resp.message || "获取数据模板失败", { type: "error" });
      return;
    }
    dataTemplateList.value = resp.data || [];
  }

  async function loadAll() {
    loading.value = true;
    try {
      await Promise.all([loadTemplateTree(), loadDataTemplateList()]);
    } finally {
      loading.value = false;
    }
  }

  function getTemplateFormInline(title: string, row?: DictTemplateRow): DictTemplateFormItemProps {
    return {
      title,
      mode: "dict",
      id: row?.id,
      dictCode: row?.dictCode ?? "",
      dictName: row?.dictName ?? "",
      parentCode: row?.parentCode ?? "0",
      sortOrder: row?.sortOrder ?? 0,
      status: row?.status ?? 1,
      hidden: row?.hidden ?? false,
      enabled: row?.enabled ?? true,
      ver: row?.ver ?? 1,
      remark: row?.remark ?? "",
      name: "",
      value: "",
      color: "",
      deletable: true,
      templateOptions: templateOptions.value
    };
  }

  function getDataFormInline(title: string, row?: DictDataTemplateRow): DictTemplateFormItemProps {
    return {
      title,
      mode: "data",
      id: row?.id,
      dictCode: row?.dictCode ?? (selectedDictCode.value || ""),
      dictName: "",
      parentCode: "0",
      sortOrder: row?.sortOrder ?? 0,
      status: row?.status ?? 1,
      hidden: false,
      enabled: row?.enabled ?? true,
      ver: row?.ver ?? 1,
      remark: row?.remark ?? "",
      name: row?.name ?? "",
      value: row?.value ?? "",
      color: row?.color ?? "",
      deletable: row?.deletable ?? true,
      templateOptions: templateOptions.value
    };
  }

  function openTemplateDialog(title = "新增", row?: DictTemplateRow) {
    addDialog({
      title: `${title}字典模板`,
      props: {
        formInline: getTemplateFormInline(title, row)
      },
      width: "36%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as DictTemplateFormItemProps;

        FormRef.validate(async valid => {
          if (!valid) return;
          const resp = await saveDictTemplate({
            id: curData.id,
            dictCode: curData.dictCode,
            dictName: curData.dictName,
            parentCode: curData.parentCode,
            sortOrder: curData.sortOrder,
            status: curData.status,
            hidden: curData.hidden,
            enabled: curData.enabled,
            ver: curData.ver,
            remark: curData.remark
          });
          if (resp.code !== 0) {
            message(resp.message || "保存失败", { type: "error" });
            return;
          }
          message("保存成功", { type: "success" });
          done();
          await loadTemplateTree();
        });
      }
    });
  }

  function openDataDialog(title = "新增", row?: DictDataTemplateRow) {
    addDialog({
      title: `${title}数据模板`,
      props: {
        formInline: getDataFormInline(title, row)
      },
      width: "36%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as DictTemplateFormItemProps;

        FormRef.validate(async valid => {
          if (!valid) return;
          const resp = await saveDictDataTemplate({
            id: curData.id,
            dictCode: curData.dictCode,
            name: curData.name,
            value: curData.value,
            sortOrder: curData.sortOrder,
            color: curData.color,
            status: curData.status,
            deletable: curData.deletable,
            enabled: curData.enabled,
            ver: curData.ver,
            remark: curData.remark
          });
          if (resp.code !== 0) {
            message(resp.message || "保存失败", { type: "error" });
            return;
          }
          message("保存成功", { type: "success" });
          done();
          await loadDataTemplateList();
        });
      }
    });
  }

  async function handleDeleteTemplate(row: DictTemplateRow) {
    const resp = await deleteDictTemplate({ id: row.id as number });
    if (resp.code !== 0) {
      message(resp.message || "删除失败", { type: "error" });
      return;
    }
    message("删除成功", { type: "success" });
    await loadAll();
  }

  async function handleDeleteData(row: DictDataTemplateRow) {
    const resp = await deleteDictDataTemplate({ id: row.id as number });
    if (resp.code !== 0) {
      message(resp.message || "删除失败", { type: "error" });
      return;
    }
    message("删除成功", { type: "success" });
    await loadDataTemplateList();
  }

  async function handleSync() {
    syncLoading.value = true;
    try {
      const resp = await syncDictTemplate();
      if (resp.code !== 0) {
        message(resp.message || "同步失败", { type: "error" });
        return;
      }
      const data = resp.data;
      message(`同步完成：版本${data.toVer}，公司${data.companyCount}，成功${data.successCount}，失败${data.failCount}`, { type: "success" });
    } finally {
      syncLoading.value = false;
    }
  }

  onMounted(() => {
    loadAll();
  });

  return {
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
  };
}
