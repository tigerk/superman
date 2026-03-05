interface CompanyPackageFormItemProps {
  id?: string;
  /** 套餐名称 */
  name: string;
  /** 月付单价 */
  monthPrice: number | string;
  /** 年付总价 */
  yearPrice?: number | string;
  /** 房源数量 */
  houseCount: number | string;
  /** 备注 */
  remark: string;
}

interface CompanyPackageFormProps {
  formInline: CompanyPackageFormItemProps;
}

export type { CompanyPackageFormItemProps, CompanyPackageFormProps };
