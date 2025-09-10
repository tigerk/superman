interface FormItemProps {
  /** 用于判断是`新增`还是`修改` */
  title: string;
  /** 公司id */
  id?: string;
  /** 公司简称 */
  abbr: string;
  /** 公司名 */
  name: string;
  /** 公司社会统一信用代码 */
  uscc: string;
  /** 法人姓名 */
  legalPerson: string;
  /** 通信地址 */
  address: string;
  /** 区域ID */
  regionId: number;
  /** 联系人 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 邮箱 */
  email: string;
  /** 绑定域名 */
  website: string;
  /** 账号数量 */
  accountCount: number;
  /** 租户套餐 */
  packageId: number;
  /** 公司管理员 */
  adminUserId: number;
  /** 备注 */
  remark: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
