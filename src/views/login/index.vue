<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { computed, reactive, ref } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import LoginUpdate from "./components/LoginUpdate.vue";
import User from "~icons/ri/user-3-fill";
import Lock from "~icons/ri/lock-fill";
import Eye from "~icons/ri/eye-line";
import EyeOff from "~icons/ri/eye-off-line";
import ArrowRight from "~icons/ri/arrow-right-line";
import ShieldCheck from "~icons/ri/shield-check-line";
import Building from "~icons/ri/building-2-line";
import HomeOffice from "~icons/ri/home-office-line";
import Sparkles from "~icons/ri/sparkling-2-line";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";

defineOptions({
  name: "Login"
});

const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();
const currentPage = ref("login");

const { t } = useI18n();
const { initStorage } = useLayout();
initStorage();
const { dataTheme, themeMode, dataThemeChange } = useDataThemeChange();
dataThemeChange(themeMode.value);
const { title, getLogo } = useNav();

const loginForm = reactive({
  username: "",
  password: ""
});

const pageMeta = computed(() => {
  if (currentPage.value === "forgot") {
    return {
      badge: "密码找回",
      title: "找回租房 SaaS 平台账号",
      desc: "通过手机号和短信验证码完成身份校验，重新设置平台管理员密码。",
      accent: "校验管理员身份并重置登录密码"
    };
  }
  return {
    badge: "平台登录",
    title: "登录租房平台管理后台",
    desc: "面向租房 SaaS 平台运营方的统一登录入口，用于进入平台管理后台。",
    accent: "登录平台管理 & 运营工作台"
  };
});

const capabilityList = [
  {
    title: "统一平台管理",
    desc: "通过统一后台处理平台日常管理事务，保持核心配置与运营动作集中可控。",
    icon: Building
  },
  {
    title: "稳定系统运营",
    desc: "围绕租房 SaaS 的平台运营场景，提供清晰、稳定、可持续的后台管理体验。",
    icon: HomeOffice
  },
  {
    title: "高效协同交付",
    desc: "让平台配置、业务支持与系统维护在同一入口协同推进，提升整体运转效率。",
    icon: Sparkles
  }
];

const currentCapabilityList = computed(() =>
  currentPage.value === "forgot" ? capabilityList.slice(0, 2) : capabilityList
);

const assuranceList = [
  "统一的平台后台入口",
  "清晰的管理与运营体验",
  "安全的账号找回与登录校验"
];

const showAssurancePanel = computed(() => currentPage.value === "login");

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (!valid) return;
    loading.value = true;
    useUserStoreHook()
      .loginByUsername({
        username: loginForm.username,
        password: loginForm.password
      })
      .then(res => {
        if (res.code !== 0) {
          message(res.message, { type: "error" });
          return;
        }
        return initRouter().then(() => {
          disabled.value = true;
          router
            .push(getTopMenu(true).path)
            .then(() => {
              message(t("login.pureLoginSuccess"), { type: "success" });
            })
            .finally(() => (disabled.value = false));
        });
      })
      .finally(() => (loading.value = false));
  });
};

const switchPage = (page: string) => {
  currentPage.value = page;
};

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true
);

useEventListener(document, "keydown", ({ code }) => {
  if (
    ["Enter", "NumpadEnter"].includes(code) &&
    !disabled.value &&
    !loading.value &&
    currentPage.value === "login"
  ) {
    immediateDebounce(ruleFormRef.value);
  }
});
</script>

<template>
  <div :class="['saas-login', dataTheme ? 'dark' : '']">
    <div class="saas-login__bg">
      <div class="bg-orb orb-a" />
      <div class="bg-orb orb-b" />
      <div class="bg-grid" />
    </div>

    <header class="saas-login__header">
      <div class="brand">
        <img :src="getLogo()" alt="logo" class="brand__logo" />
        <div class="brand__text">
          <span class="brand__name">{{ title }}</span>
          <span class="brand__tag">Rental SaaS Platform</span>
        </div>
      </div>
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </header>

    <main class="saas-login__main">
      <section
        :class="[
          'hero-panel',
          { 'hero-panel--compact': currentPage === 'forgot' }
        ]"
      >
        <Motion>
          <div class="hero-pill">
            <el-icon><ShieldCheck /></el-icon>
            <span>{{ pageMeta.badge }}</span>
          </div>
        </Motion>

        <Motion :delay="40">
          <h1 class="hero-title">{{ pageMeta.title }}</h1>
        </Motion>

        <Motion :delay="80">
          <p class="hero-desc">{{ pageMeta.desc }}</p>
        </Motion>

        <Motion :delay="120">
          <div class="hero-accent">
            <span class="hero-accent__label">当前任务</span>
            <strong>{{ pageMeta.accent }}</strong>
          </div>
        </Motion>

        <Motion :delay="160">
          <div class="capability-list">
            <article
              v-for="item in currentCapabilityList"
              :key="item.title"
              class="capability-card"
            >
              <div class="capability-card__icon">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
              </div>
            </article>
          </div>
        </Motion>

        <Motion v-if="showAssurancePanel" :delay="200">
          <div class="assurance-panel">
            <div class="assurance-panel__title">平台能力</div>
            <div class="assurance-panel__list">
              <span
                v-for="item in assuranceList"
                :key="item"
                class="assurance-chip"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </Motion>
      </section>

      <section class="auth-panel">
        <div class="auth-card">
          <Motion v-if="currentPage === 'login'" key="login">
            <div class="auth-card__header">
              <div class="auth-card__eyebrow">平台账号登录</div>
              <h2 class="auth-card__title">登录租房管理平台</h2>
              <p class="auth-card__desc">使用平台账号登录，进入租房平台。</p>
            </div>

            <el-form
              ref="ruleFormRef"
              :model="loginForm"
              :rules="loginRules"
              class="auth-form"
            >
              <el-form-item prop="username">
                <template #label>
                  <span class="field-label">账号</span>
                </template>
                <el-input
                  v-model="loginForm.username"
                  size="large"
                  clearable
                  placeholder="请输入用户名或手机号"
                >
                  <template #prefix>
                    <el-icon>
                      <User />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <template #label>
                  <span class="field-label">密码</span>
                </template>
                <el-input
                  v-model="loginForm.password"
                  size="large"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入登录密码"
                >
                  <template #prefix>
                    <el-icon>
                      <Lock />
                    </el-icon>
                  </template>
                  <template #suffix>
                    <el-icon
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    >
                      <Eye v-if="showPassword" />
                      <EyeOff v-else />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <div class="auth-form__row">
                <span class="auth-form__hint">请使用平台管理员账号登录</span>
                <button
                  type="button"
                  class="auth-link"
                  @click="currentPage = 'forgot'"
                >
                  忘记密码
                </button>
              </div>

              <button
                type="button"
                class="auth-submit"
                :disabled="disabled || loading"
                @click="onLogin(ruleFormRef)"
              >
                <span>{{ loading ? "登录中..." : "立即登录" }}</span>
                <el-icon><ArrowRight /></el-icon>
              </button>
            </el-form>
          </Motion>

          <LoginUpdate
            v-if="currentPage === 'forgot'"
            @switch-page="switchPage"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.saas-login {
  --login-bg: linear-gradient(135deg, #f4f7fb 0%, #e8eef8 42%, #dce7f8 100%);
  --login-panel: rgba(255, 255, 255, 0.78);
  --login-card: rgba(255, 255, 255, 0.92);
  --login-border: rgba(134, 156, 184, 0.18);
  --login-title: #10233d;
  --login-text: #47607b;
  --login-muted: #6f8197;
  --login-primary: #2364ff;
  --login-primary-strong: #0b4ddd;
  --login-shadow: 0 30px 80px rgba(24, 50, 84, 0.14);
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--login-bg);
}

.saas-login.dark {
  --login-bg: linear-gradient(135deg, #09121f 0%, #101b2f 48%, #0b1426 100%);
  --login-panel: rgba(11, 19, 35, 0.72);
  --login-card: rgba(12, 22, 39, 0.84);
  --login-border: rgba(96, 124, 165, 0.2);
  --login-title: #f5f8ff;
  --login-text: #b0bfd5;
  --login-muted: #89a0bd;
  --login-primary: #5c93ff;
  --login-primary-strong: #82a8ff;
  --login-shadow: 0 36px 90px rgba(0, 0, 0, 0.34);
}

.saas-login__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(10px);
}

.orb-a {
  top: -120px;
  left: -60px;
  width: 420px;
  height: 420px;
  background: radial-gradient(
    circle,
    rgba(85, 142, 255, 0.28) 0%,
    rgba(85, 142, 255, 0) 72%
  );
}

.orb-b {
  right: -100px;
  bottom: -140px;
  width: 520px;
  height: 520px;
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.16) 0%,
    rgba(34, 197, 94, 0) 74%
  );
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 88%);
  opacity: 0.3;
}

.saas-login__header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 40px 0;
}

.brand {
  display: flex;
  gap: 14px;
  align-items: center;
}

.brand__logo {
  display: block;
  height: 38px;
}

.brand__text {
  display: flex;
  flex-direction: column;
}

.brand__name {
  font-size: 24px;
  font-weight: 700;
  color: var(--login-title);
}

.brand__tag {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: var(--login-muted);
  text-transform: uppercase;
}

.saas-login__main {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 460px);
  gap: 28px;
  align-items: start;
  width: min(1380px, 100%);
  height: calc(100vh - 96px);
  padding: 24px 40px 32px;
  margin: 0 auto;
}

.hero-panel {
  align-self: start;
  max-width: 760px;
  padding: 34px 36px;
  background: var(--login-panel);
  border: 1px solid var(--login-border);
  border-radius: 28px;
  box-shadow: var(--login-shadow);
  backdrop-filter: blur(18px);
}

.hero-panel--compact {
  padding-bottom: 26px;
}

.hero-pill {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--login-primary);
  background: rgba(35, 100, 255, 0.1);
  border: 1px solid rgba(35, 100, 255, 0.14);
  border-radius: 999px;
}

.hero-title {
  max-width: 600px;
  margin: 0 0 12px;
  font-size: 44px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--login-title);
}

.hero-desc {
  max-width: 560px;
  margin: 0 0 20px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--login-text);
}

.hero-accent {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  margin-bottom: 22px;
  border-left: 4px solid var(--login-primary);
  background: rgba(255, 255, 255, 0.28);
  border-radius: 16px;
}

.hero-accent__label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--login-muted);
  text-transform: uppercase;
}

.hero-accent strong {
  font-size: 17px;
  color: var(--login-title);
}

.capability-list {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.capability-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
}

.capability-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  font-size: 21px;
  color: var(--login-primary);
  background: rgba(35, 100, 255, 0.1);
  border-radius: 16px;
}

.capability-card h3 {
  margin: 2px 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: var(--login-title);
}

.capability-card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--login-text);
}

.assurance-panel {
  padding: 18px 20px;
  background: rgba(16, 35, 61, 0.05);
  border: 1px solid var(--login-border);
  border-radius: 20px;
}

.assurance-panel__title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--login-title);
}

.assurance-panel__list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.assurance-chip {
  padding: 8px 12px;
  font-size: 12px;
  color: var(--login-text);
  background: rgba(255, 255, 255, 0.38);
  border: 1px solid var(--login-border);
  border-radius: 999px;
}

.auth-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  align-self: start;
  width: 100%;
}

.auth-card {
  width: 100%;
  align-self: start;
  max-width: 460px;
  margin-left: auto;
  padding: 28px 28px 24px;
  background: var(--login-card);
  border: 1px solid var(--login-border);
  border-radius: 26px;
  box-shadow: var(--login-shadow);
  backdrop-filter: blur(18px);
}

.auth-card__header {
  margin-bottom: 22px;
}

.auth-card__eyebrow {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--login-primary);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.auth-card__title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--login-title);
}

.auth-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--login-text);
}

.auth-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.auth-form :deep(.el-form-item__label) {
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--login-title);
}

.field-label {
  color: var(--login-title);
}

.auth-form :deep(.el-input__wrapper) {
  min-height: 54px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--login-border);
  border-radius: 18px;
  box-shadow: none !important;
}

.saas-login.dark .auth-form :deep(.el-input__wrapper) {
  background: rgba(7, 16, 28, 0.88);
}

.auth-form :deep(.el-input__wrapper.is-focus) {
  border-color: var(--login-primary);
  box-shadow: 0 0 0 3px rgba(35, 100, 255, 0.14) !important;
}

.auth-form :deep(.el-input__inner) {
  height: 46px;
  font-size: 15px;
  color: var(--login-title);
}

.auth-form :deep(.el-input__inner::placeholder) {
  color: var(--login-muted);
}

.auth-form :deep(.el-input__prefix),
.auth-form :deep(.el-input__suffix) {
  color: var(--login-muted);
}

.auth-form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -2px 0 14px;
}

.auth-form__hint {
  font-size: 13px;
  color: var(--login-muted);
}

.auth-link {
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--login-primary);
  background: none;
  border: 0;
  cursor: pointer;
}

.auth-submit {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--login-primary) 0%,
    var(--login-primary-strong) 100%
  );
  border: 0;
  border-radius: 16px;
  box-shadow: 0 18px 36px rgba(35, 100, 255, 0.26);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.auth-submit:hover {
  transform: translateY(-1px);
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (width <= 1180px) {
  .saas-login {
    overflow-y: auto;
  }

  .saas-login__main {
    grid-template-columns: 1fr;
    height: auto;
    min-height: calc(100vh - 90px);
    padding-top: 24px;
  }

  .hero-panel {
    max-width: none;
  }

  .auth-card {
    max-width: none;
    margin-left: 0;
  }
}

@media (width <= 860px) {
  .saas-login__header {
    padding: 22px 20px 0;
  }

  .saas-login__main {
    gap: 24px;
    padding: 22px 20px 28px;
  }

  .hero-panel {
    padding: 28px 22px;
  }

  .hero-title {
    font-size: 34px;
  }

  .auth-card {
    padding: 24px 22px 22px;
  }

  .auth-card__title {
    font-size: 26px;
  }
}

@media (width <= 640px) {
  .hero-panel {
    display: none;
  }

  .saas-login__main {
    align-items: stretch;
  }

  .auth-card {
    max-width: none;
  }

  .brand__name {
    font-size: 20px;
  }
}
</style>
