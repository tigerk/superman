import type {
  DictDataTemplateItem,
  DictTemplateItem
} from "@/api/platform/dictTemplate";

type DictTemplateFormMode = "dict" | "data";

interface DictTemplateFormItemProps {
  title: string;
  mode: DictTemplateFormMode;
  id?: number;
  dictCode: string;
  dictName: string;
  parentCode: string;
  sortOrder: number;
  status: number;
  hidden: boolean;
  enabled: boolean;
  ver: number;
  remark: string;
  name: string;
  value: string;
  color: string;
  deletable: boolean;
  templateOptions: Array<{ label: string; value: string }>;
}

interface DictTemplateFormProps {
  formInline: DictTemplateFormItemProps;
}

type DictTemplateRow = DictTemplateItem;
type DictDataTemplateRow = DictDataTemplateItem;

export type {
  DictTemplateFormMode,
  DictTemplateFormItemProps,
  DictTemplateFormProps,
  DictTemplateRow,
  DictDataTemplateRow
};
