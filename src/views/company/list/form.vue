<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { getCompanyPackageSimple, getCompanyUserSimple } from "@/api/system";
import RegionCascader from "@/components/Business/RegionCascader.vue";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
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
    /** 公司管理员 */
    adminUserId: null,
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
  userOptions.value = (await getCompanyUserSimple()).data;
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
    <re-col class="px-2 pb-3.5">
      <el-alert type="warning" show-icon :closable="false">
        <p>找不到用户，请在用户管理中创建用户后再操作</p>
      </el-alert>
    </re-col>
    <el-form-item label="管理员" prop="adminUserId">
      <el-select
        v-model="newFormInline.adminUserId"
        placeholder="请选择管理员"
        clearable
        class="w-full!"
      >
        <el-option
          v-for="(option, index) in userOptions"
          :key="index"
          :label="option.name"
          :value="option.id"
        />
      </el-select>
    </el-form-item>

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
