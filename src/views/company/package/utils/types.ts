interface CompanyPackageFormItemProps {
  id?: string;
  /** 套餐名称 */
  name: string;
  /** 备注 */
  remark: string;
}

interface CompanyPackageFormProps {
  formInline: CompanyPackageFormItemProps;
}

export type { CompanyPackageFormItemProps, CompanyPackageFormProps };
