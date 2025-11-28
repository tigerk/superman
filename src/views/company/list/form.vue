<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formRules } from "./utils/rule";
import { CompanyFormProps } from "./utils/types";
import { getCompanyPackageSimple } from "@/api/company/company";
import RegionCascader from "@/components/Business/RegionCascader.vue";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<CompanyFormProps>(), {
  formInline: () => ({
    title: "新增",
    /** 公司简称 */
    abbr: "",
    /** 公司名 */
    name: "",
    /** 区域ID */
    regionIds: null,
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
    accountCount: 99,
    /** 绑定域名 */
    website: "",
    /** 租户套餐 */
    packageId: null,
    /** 管理员手机号 */
    adminPhone: "",
    /** 账号密码 */
    adminPassword: "",
    /** 备注 */
    remark: "",
    /** 公司性质 1：企业 2：个人 */
    nature: 1
  })
});

const packageOptions = ref([]);
const userOptions = ref([]);
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

onMounted(async () => {
  packageOptions.value = (await getCompanyPackageSimple()).data;
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="公司名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入公司名称"
      />
    </el-form-item>

    <div class="flex gap-4">
      <el-form-item label="公司简称" prop="abbr" class="flex-1">
        <el-input
          v-model="newFormInline.abbr"
          clearable
          placeholder="请输入公司简称"
        />
      </el-form-item>

      <el-form-item label="公司性质" prop="nature" class="flex-1">
        <el-radio-group v-model="newFormInline.nature">
          <el-radio-button :value="1">企业</el-radio-button>
          <el-radio-button :value="2">个人</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>

    <el-form-item label="选择区域" class="el-form-item" prop="regionId">
      <RegionCascader v-model="newFormInline.regionIds" />
    </el-form-item>

    <el-form-item label="法定代表人" prop="legalPerson">
      <el-input
        v-model="newFormInline.legalPerson"
        clearable
        placeholder="请输入法定代表人"
      />
    </el-form-item>

    <el-form-item label="公司套餐" prop="packageId">
      <el-select
        v-model="newFormInline.packageId"
        placeholder="请选择公司套餐"
        clearable
        class="w-full!"
      >
        <el-option
          v-for="(option, index) in packageOptions"
          :key="index"
          :label="option.name"
          :value="option.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="联系人" prop="contactName">
      <el-input
        v-model="newFormInline.contactName"
        clearable
        placeholder="请输入联系人"
      />
    </el-form-item>

    <el-form-item label="联系电话" prop="contactPhone">
      <el-input
        v-model="newFormInline.contactPhone"
        clearable
        placeholder="请输入联系电话"
      />
    </el-form-item>

    <el-form-item label="通信地址" prop="address">
      <el-input
        v-model="newFormInline.address"
        clearable
        placeholder="请输入通信地址"
      />
    </el-form-item>
    <el-form-item label="手机号" prop="adminPhone">
      <el-input
        v-model="newFormInline.adminPhone"
        clearable
        placeholder="请输入用户手机号"
      />
    </el-form-item>

    <el-form-item
      v-if="newFormInline.title === '新增'"
      label="用户密码"
      prop="adminPassword"
    >
      <el-input
        v-model="newFormInline.adminPassword"
        clearable
        type="password"
        show-password
        placeholder="请输入用户密码"
      />
    </el-form-item>
    <re-col class="px-2 pb-3.5">
      <el-alert type="warning" :closable="false">
        <p v-if="newFormInline.title === '新增'">
          使用手机号、用户密码创建公司管理员账号
        </p>
        <p v-if="newFormInline.title !== '新增'">
          修改手机号会将管理员账号的手机号修改为新手机号，<br />如果当前手机号已存在，则直接变更绑定。
        </p>
      </el-alert>
    </re-col>
    <el-form-item label="账号额度" prop="accountCount">
      <el-input-number
        v-model="newFormInline.accountCount"
        class="w-full!"
        :min="0"
        :max="9999"
        controls-position="right"
      />
    </el-form-item>

    <el-form-item label="信用代码" prop="uscc">
      <el-input
        v-model="newFormInline.uscc"
        clearable
        placeholder="请输入公司社会统一信用代码"
      />
    </el-form-item>

    <el-form-item label="绑定域名" prop="website">
      <el-input
        v-model="newFormInline.website"
        clearable
        placeholder="请输入绑定域名"
      />
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.remark"
        placeholder="请输入备注信息"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
