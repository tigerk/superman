<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { updateRules, REGEXP_PWD } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { baseUrlApi } from "@/api/utils";
import Lock from "~icons/ri/lock-fill";
import Phone from "~icons/ri/phone-fill";
import Shield from "~icons/ri/shield-keyhole-line";
import ArrowLeft from "~icons/ri/arrow-left-line";
import ArrowRight from "~icons/ri/arrow-right-line";
import CheckCircle from "~icons/ri/checkbox-circle-fill";
import { loginUpdate, sendSmsCode } from "@/api/platform/login";

const emit = defineEmits<{
  (e: "switchPage", page: string): void;
}>();

const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const imageVerifyCode = ref("");
const captchaImageUrl = ref("");
const { isDisabled, text } = useVerifyCode();

const forgotForm = reactive({
  phone: "",
  verifyCode: "",
  password: "",
  confirmPassword: ""
});

const hasValidPhone = computed(() => /^1\d{10}$/.test(forgotForm.phone));

const passwordStrength = computed(() => {
  const pwd = forgotForm.password;
  if (!pwd) return { text: "未设置", cls: "" };
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[a-z]/.test(pwd)) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

  if (score <= 2) return { text: "强度较弱", cls: "weak" };
  if (score <= 4) return { text: "强度中等", cls: "medium" };
  return { text: "强度较高", cls: "strong" };
});

const refreshCaptcha = () => {
  if (!hasValidPhone.value) {
    captchaImageUrl.value = "";
    return;
  }
  captchaImageUrl.value = `${baseUrlApi(`captcha/${forgotForm.phone}`)}?t=${Date.now()}`;
};

watch(
  () => forgotForm.phone,
  phone => {
    forgotForm.verifyCode = "";
    imageVerifyCode.value = "";
    if (phone.length === 11 && hasValidPhone.value) {
      refreshCaptcha();
    } else {
      captchaImageUrl.value = "";
    }
  }
);

const repeatPasswordRule = [
  {
    validator: (_, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (forgotForm.password !== value) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const onUpdate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  loading.value = true;
  try {
    const valid = await formEl.validate().catch(() => false);
    if (!valid) return;
    const res = await loginUpdate({
      phone: forgotForm.phone,
      verifyCode: forgotForm.verifyCode,
      password: forgotForm.password
    });
    if (res.code === 0) {
      message("密码已更新，请重新登录", { type: "success" });
      emit("switchPage", "login");
    } else {
      message(res.message, { type: "error" });
    }
  } finally {
    loading.value = false;
  }
};

const sendVerificationCode = async () => {
  if (!ruleFormRef.value) return;
  try {
    await ruleFormRef.value.validateField("phone");
  } catch {
    return;
  }
  if (!imageVerifyCode.value) {
    message("请输入图形验证码", { type: "warning" });
    refreshCaptcha();
    return;
  }

  try {
    const res = await sendSmsCode({
      phone: forgotForm.phone,
      captcha: imageVerifyCode.value
    });
    if (res.code === 0) {
      useVerifyCode().start(ruleFormRef.value, "phone", 60);
      message("验证码已发送", { type: "success" });
    } else {
      message(res.message, { type: "error" });
      refreshCaptcha();
    }
  } catch {
    refreshCaptcha();
  }
};

onBeforeUnmount(() => {
  useVerifyCode().end();
});
</script>

<template>
  <Motion key="forgot">
    <div class="reset-shell">
      <div class="reset-header">
        <div class="reset-header__eyebrow">密码找回</div>
        <p class="reset-header__desc">
          验证平台管理员绑定手机号后，可重新设置租房 SaaS 平台登录密码。
        </p>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="forgotForm"
        :rules="updateRules"
        label-position="top"
        class="reset-form"
      >
        <div class="reset-panel">
          <div class="reset-panel__title">身份确认</div>
          <div class="reset-panel__desc">
            输入平台管理员已绑定的手机号，系统会发送短信验证码完成身份校验。
          </div>

          <el-form-item prop="phone">
            <template #label>
              <span class="field-label">手机号</span>
            </template>
            <el-input
              v-model="forgotForm.phone"
              size="large"
              clearable
              maxlength="11"
              placeholder="请输入管理员绑定手机号"
            >
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item v-if="hasValidPhone" class="captcha-item">
            <template #label>
              <span class="field-label">图形验证码</span>
            </template>
            <div class="captcha-row">
              <el-input
                v-model="imageVerifyCode"
                size="large"
                clearable
                maxlength="4"
                placeholder="请输入图形验证码"
              >
                <template #prefix>
                  <el-icon><Shield /></el-icon>
                </template>
              </el-input>
              <button type="button" class="captcha-box" @click="refreshCaptcha">
                <img
                  v-if="captchaImageUrl"
                  :src="captchaImageUrl"
                  alt="图形验证码"
                  class="captcha-image"
                />
                <span v-else>点击加载</span>
              </button>
            </div>
            <div class="captcha-tip">
              手机号输入完整后自动显示，点击图片可刷新
            </div>
          </el-form-item>

          <el-form-item prop="verifyCode">
            <template #label>
              <span class="field-label">短信验证码</span>
            </template>
            <div class="sms-row">
              <el-input
                v-model="forgotForm.verifyCode"
                size="large"
                clearable
                maxlength="4"
                placeholder="请输入短信验证码"
              >
                <template #prefix>
                  <el-icon><Shield /></el-icon>
                </template>
              </el-input>
              <el-button
                class="sms-btn"
                :disabled="isDisabled"
                @click="sendVerificationCode"
              >
                {{ text.length > 0 ? `${text}秒后重发` : "获取验证码" }}
              </el-button>
            </div>
          </el-form-item>
        </div>

        <div class="reset-panel">
          <div class="reset-panel__title">设置新密码</div>
          <div class="reset-panel__desc">
            新密码建议包含字母、数字和符号中的至少两种组合。
          </div>

          <div class="two-col">
            <el-form-item prop="password">
              <template #label>
                <span class="field-label">新密码</span>
              </template>
              <el-input
                v-model="forgotForm.password"
                size="large"
                type="password"
                placeholder="请输入新密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
              <div class="password-strength" :class="passwordStrength.cls">
                {{ passwordStrength.text }}
              </div>
            </el-form-item>

            <el-form-item :rules="repeatPasswordRule" prop="confirmPassword">
              <template #label>
                <span class="field-label">确认密码</span>
              </template>
              <el-input
                v-model="forgotForm.confirmPassword"
                size="large"
                type="password"
                placeholder="请再次输入新密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
              <div
                v-if="
                  forgotForm.confirmPassword &&
                  forgotForm.password === forgotForm.confirmPassword
                "
                class="password-match"
              >
                <el-icon><CheckCircle /></el-icon>
                两次输入一致
              </div>
            </el-form-item>
          </div>
        </div>

        <div class="reset-actions">
          <button
            type="button"
            class="reset-back"
            @click="emit('switchPage', 'login')"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回登录
          </button>
          <button
            type="button"
            class="reset-submit"
            :disabled="loading || !REGEXP_PWD.test(forgotForm.password)"
            @click="onUpdate(ruleFormRef)"
          >
            <span>{{ loading ? "提交中..." : "确认重置密码" }}</span>
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </el-form>
    </div>
  </Motion>
</template>

<style scoped lang="scss">
.reset-shell {
  color: var(--login-title, #10233d);
}

.reset-header {
  margin-bottom: 10px;
}

.reset-header__eyebrow {
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--login-primary, #2364ff);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.reset-header__title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.18;
  color: var(--login-title, #10233d);
}

.reset-header__desc {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  color: var(--login-text, #47607b);
}

.reset-steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.reset-step {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid var(--login-border, rgba(134, 156, 184, 0.18));
  border-radius: 16px;
}

:global(.saas-login.dark) .reset-step {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.reset-step span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 13px;
  font-weight: 700;
  color: var(--login-muted, #6f8197);
  background: rgba(255, 255, 255, 0.52);
  border-radius: 999px;
}

:global(.saas-login.dark) .reset-step span {
  background: rgba(255, 255, 255, 0.1);
}

.reset-step strong {
  display: block;
  margin-bottom: 2px;
  font-size: 13px;
  color: var(--login-title, #10233d);
}

.reset-step small {
  font-size: 11px;
  color: var(--login-muted, #6f8197);
}

.reset-step.is-active {
  border-color: rgba(35, 100, 255, 0.18);
  box-shadow: 0 8px 24px rgba(35, 100, 255, 0.08);
}

.reset-step.is-active span {
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--login-primary, #2364ff) 0%,
    var(--login-primary-strong, #0b4ddd) 100%
  );
}

.reset-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.reset-form :deep(.el-form-item__label) {
  padding-bottom: 5px;
  font-size: 11px;
  font-weight: 600;
  color: var(--login-title, #10233d);
}

.reset-form :deep(.el-input__wrapper) {
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid var(--login-border, rgba(134, 156, 184, 0.18));
  border-radius: 18px;
  box-shadow: none !important;
}

:global(.saas-login.dark) .reset-form :deep(.el-input__wrapper) {
  background: rgba(9, 16, 29, 0.92);
  border-color: rgba(255, 255, 255, 0.08);
}

.reset-form :deep(.el-input__wrapper.is-focus) {
  border-color: var(--login-primary, #2364ff);
  box-shadow: 0 0 0 3px rgba(35, 100, 255, 0.14) !important;
}

.reset-form :deep(.el-input__inner) {
  height: 38px;
  color: var(--login-title, #10233d);
}

.reset-form :deep(.el-input__inner::placeholder) {
  color: var(--login-muted, #6f8197);
}

.reset-form :deep(.el-input__prefix) {
  color: var(--login-muted, #6f8197);
}

.reset-panel {
  padding: 10px 10px 0;
  margin-bottom: 8px;
  border: 1px solid var(--login-border, rgba(134, 156, 184, 0.18));
  border-radius: 20px;
}

:global(.saas-login.dark) .reset-panel {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.reset-panel__title {
  margin-bottom: 2px;
  font-size: 13px;
  font-weight: 700;
  color: var(--login-title, #10233d);
}

.reset-panel__desc {
  margin-bottom: 8px;
  font-size: 10px;
  line-height: 1.35;
  color: var(--login-text, #47607b);
}

.field-label {
  color: var(--login-title, #10233d);
}

.captcha-row,
.sms-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 132px;
  gap: 8px;
}

.captcha-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  overflow: hidden;
  color: var(--login-muted, #6f8197);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--login-border, rgba(134, 156, 184, 0.18));
  border-radius: 18px;
  cursor: pointer;
}

:global(.saas-login.dark) .captcha-box {
  color: #c7d3e6;
  background: rgba(9, 16, 29, 0.92);
  border-color: rgba(255, 255, 255, 0.08);
}

.captcha-image {
  display: block;
  width: 100%;
  height: 44px;
  object-fit: cover;
}

.captcha-tip,
.password-strength,
.password-match {
  margin-top: 4px;
  font-size: 10px;
  line-height: 1.35;
}

.captcha-tip {
  color: var(--login-muted, #6f8197);
}

.password-strength {
  color: var(--login-muted, #6f8197);
}

.password-strength.weak {
  color: #ef4444;
}

.password-strength.medium {
  color: #f59e0b;
}

.password-strength.strong {
  color: #22c55e;
}

.password-match {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: #22c55e;
}

.sms-btn {
  min-height: 46px;
  margin-left: 0;
  border-radius: 16px;
}

:global(.saas-login.dark) .sms-btn {
  color: #eef3fb;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.saas-login.dark) .sms-btn:hover,
:global(.saas-login.dark) .sms-btn:focus {
  color: #fff;
  background: rgba(92, 147, 255, 0.16);
  border-color: rgba(92, 147, 255, 0.28);
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.reset-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.reset-back,
.reset-submit {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-radius: 14px;
  cursor: pointer;
}

.reset-back {
  min-width: 118px;
  color: var(--login-title, #10233d);
  border: 1px solid var(--login-border, rgba(134, 156, 184, 0.18));
}

:global(.saas-login.dark) .reset-back {
  color: #eef3fb;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.reset-submit {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--login-primary, #2364ff) 0%,
    var(--login-primary-strong, #0b4ddd) 100%
  );
  border: 0;
  box-shadow: 0 18px 36px rgba(35, 100, 255, 0.24);
}

:global(.saas-login.dark) .reset-submit {
  color: #fff;
  background: linear-gradient(135deg, #5c93ff 0%, #82a8ff 100%);
  box-shadow: 0 18px 36px rgba(92, 147, 255, 0.24);
}

.reset-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (width <= 860px) {
  .two-col,
  .captcha-row,
  .sms-row,
  .reset-steps {
    grid-template-columns: 1fr;
  }

  .reset-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .reset-back,
  .reset-submit {
    width: 100%;
  }
}
</style>
