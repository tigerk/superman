import "./reset.css";
import dayjs from "dayjs";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "@/utils/publicHooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormItemProps } from "./types";
import {
  deviceDetection,
  getKeyList,
  hideTextAtIndex,
  isAllEmpty
} from "@pureadmin/utils";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElMessageBox,
  ElProgress
} from "element-plus";
import {
  computed,
  h,
  onMounted,
  reactive,
  ref,
  type Ref,
  toRaw,
  watch
} from "vue";
import {
  createUser,
  deleteUser,
  getUserList,
  resetUserPassword,
  updateUser,
  updateUserAvatar,
  updateUserStatus
} from "@/api/platform/user";

export function useUser(tableRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    username: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "用户编号",
      prop: "id",
      width: 90,
      hide: true
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "用户头像",
      prop: "avatar",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.avatar || userAvatar}
          preview-src-list={Array.of(row.avatar || userAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "性别",
      prop: "gender",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.gender === 1 ? "success" : "danger"}
          effect="plain"
        >
          {row.gender === 1 ? "男" : "女"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90,
      formatter: ({ phone }) => hideTextAtIndex(phone, { start: 3, end: 6 })
    },
    {
      label: "用户类型",
      prop: "userType",
      minWidth: 90,
      formatter: ({ userType }) => {
        return userType === 10 ? "超级管理员" : "普通用户";
      }
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const buttonClass = computed(() => {
    return [
      "h-[20px]!",
      "reset-margin",
      "text-gray-500!",
      "dark:text-white!",
      "dark:hover:text-primary!"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${row.status === 0 ? "启用" : "停用"}</strong><strong style='color:var(--el-color-primary)'>${row.username}</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          updateUserStatus({ id: row.id, status: row.status }).then(resp => {
            if (resp.code === 0) {
              message("已成功修改用户状态", {
                type: "success"
              });
            } else {
              message(resp.message, {
                type: "error"
              });
            }
          });

          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 0) : (row.status = -1);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除用户编号为${row.phone}的这条数据吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        deleteUser([row.id]).then(resp => {
          if (resp.code === 0) {
            message(`您删除了用户编号为${row.phone}的这条数据`, {
              type: "success"
            });

            onPlatformUserSearch().then(r => console.log(r));
          } else {
            message(resp.message, {
              type: "error"
            });
          }
        });
      })
      .catch(() => {
        message("已取消删除用户", {
          type: "info"
        });
      });
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onBatchDelete() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onPlatformUserSearch();
  }

  async function onPlatformUserSearch() {
    loading.value = true;
    const { data } = await getUserList(toRaw(form));
    dataList.value = data.list;
    pagination.total = Number(data.total);
    pagination.pageSize = Number(data.pageSize);
    pagination.currentPage = Number(data.currentPage);

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) {
      return;
    }
    formEl.resetFields();
    onPlatformUserSearch().then(r => console.log(r));
  };

  function openUserCreateDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          id: row?.id ?? null,
          title,
          nickname: row?.nickname ?? "",
          password: row?.password ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          gender: row?.gender ?? 1,
          status: row?.status ?? 1,
          remark: row?.remark ?? ""
        }
      },
      width: "35%",
      draggable: true,
      lockScroll: true,
      alignCenter: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function submitCreateForm() {
          createUser(curData).then(resp => {
            if (resp.code === 0) {
              message(`您${title}了用户手机号为${curData.phone}的这条数据`, {
                type: "success"
              });
              done(); // 关闭弹框
              onPlatformUserSearch(); // 刷新表格数据
            } else {
              message(resp.message, {
                type: "error"
              });
            }
          });
        }

        function submitUpdateForm() {
          updateUser(curData).then(resp => {
            if (resp.code === 0) {
              message(`您${title}了用户手机号为${curData.phone}的这条数据`, {
                type: "success"
              });
              done(); // 关闭弹框
              onPlatformUserSearch(); // 刷新表格数据
            } else {
              message(resp.message, {
                type: "error"
              });
            }
          });
        }

        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              submitCreateForm();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              submitUpdateForm();
            }
          }
        });
      }
    });
  }

  const cropRef = ref();

  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(ReCropperPreview, {
          ref: cropRef,
          imgSrc: row.avatar || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        console.log("裁剪后的图片信息：", avatarInfo.value);
        updateUserAvatar({
          id: row.id,
          avatar: avatarInfo.value.base64
        }).then(resp => {
          if (resp.code === 0) {
            message(`您上传了用户名称为${row.username}的头像`, {
              type: "success"
            });
            done(); // 关闭弹框
            onPlatformUserSearch(); // 刷新表格数据
          } else {
            message(resp.message, {
              type: "error"
            });
          }
        });
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="my-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            resetUserPassword({ id: row.id, password: pwdForm.newPwd }).then(
              resp => {
                if (resp.code === 0) {
                  // 表单规则校验通过
                  message(`已成功重置 ${row.username} 用户的密码`, {
                    type: "success"
                  });
                  console.log(pwdForm.newPwd);
                  // 关闭弹框
                  done();
                  // 刷新表格数据
                  onPlatformUserSearch();
                } else {
                  message(resp.message, {
                    type: "error"
                  });
                }
              }
            );
          }
        });
      }
    });
  }

  onMounted(async () => {
    onPlatformUserSearch().then(() => {
      console.log("加载完成");
    });
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    buttonClass,
    onPlatformUserSearch,
    deviceDetection,
    openUserCreateDialog,
    resetForm,
    onBatchDelete,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
