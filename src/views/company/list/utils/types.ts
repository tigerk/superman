interface CompanyFormItemProps {
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
  regionIds: number[];
  /** 联系人 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 邮箱 */
  email: string;
  /** 绑定域名 */
  website: string;
  /** 配置房源数量 */
  houseCount: number;
  /** 录入房源数量 */
  enteredHouseCount?: number;
  /** 录入房间数量 */
  enteredRoomCount?: number;
  /** 租客数量 */
  tenantCount?: number;
  /** 账号数量 */
  userCount?: number;
  /** 租户套餐 */
  packageId: number;
  /** 手机号 */
  adminPhone: string;
  /** 密码 */
  adminPassword: string;
  /** 备注 */
  remark: string;
  /** 公司性质 1：企业 2：个人 */
  nature: number;
}

interface CompanyFormProps {
  formInline: CompanyFormItemProps;
}

export type { CompanyFormItemProps, CompanyFormProps };
