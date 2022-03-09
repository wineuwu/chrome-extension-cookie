<template>
    <div>
        <div v-show="domainList.length" class="config-table">
            <el-table :data="domainList" stripe style="width: 100%">
                <el-table-column prop="from" label="from" width="180" />
                <el-table-column prop="name" label="name" width="180" />
                <el-table-column prop="to" label="to" />
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-icon color="#409EFC" class="no-inherit" size="large" @click="deleteList(row)">
                            <delete />
                        </el-icon>
                    </template>
                </el-table-column>
            </el-table>
            <el-divider></el-divider>
        </div>
        <el-form ref="formRef" :inline="true" label-suffix=":" :model="structure" :rules="formRules">
            <el-form-item label="把" prop="from">
                <el-autocomplete v-model="structure.from" :fetch-suggestions="querySearch" placeholder="输入目标站点" @select="handleSelect(formRef)" />
            </el-form-item>
            <el-form-item label="的cookie" prop="name">
                <el-input v-model="structure.name"></el-input>
            </el-form-item>
            <el-form-item label="同步到" prop="to">
                <el-input v-model="structure.to"></el-input>
            </el-form-item>
        </el-form>
        <div class="submit-content">
            <el-button type="primary" @click="onSubmit(formRef)">添加监控</el-button>
        </div>
        <el-alert v-if="alertText" :title="alertText" type="warning" show-icon :closable="false"> </el-alert>
    </div>
</template>

<script setup>
import { Delete } from "@element-plus/icons-vue";
import { ref, reactive, onMounted } from "vue";

const initItem = {
    from: "",
    name: "WEBID",
    to: "http://localhost",
};
const formRef = ref();

const formRules = reactive({
    from: [{ required: true, message: "请输入源站点", trigger: "blur" }],
    to: [{ required: true, message: "请输入目标站点", trigger: "blur" }],
    name: [{ required: true, message: "请输入cookie名称", trigger: "blur" }],
});
// 去最后依次输入数据或者默认数据
const structure = reactive(initItem);
let domainList = reactive([]);
let alertText = ref(null);
onMounted(() => {
    const list = localStorage.getItem("domainList") || "[]";
    const history = JSON.parse(list);
    domainList.push(...history);
    if (domainList.length) {
        const { name, from, to } = domainList.at(-1) || {};
        structure.name = name;
        structure.from = from;
        structure.to = to;
    }
});

function onSubmit(formEl) {
    if (!formEl) return;
    formEl.validate(async valid => {
        if (valid) {
            const str = JSON.stringify(structure);
            alertText.value = null;
            if (domainList.some(e => e.id === str)) {
                // ElMessage("数据已存在于列表中");
                alertText.value = "此配置项已存在于监控列表中，无需重复添加哦";
                return;
            }
            const config = {
                ...structure,
                id: str,
            };
            const res = await chrome.extension.getBackgroundPage().changeConfigItem(config, "add");
            // 如果不存在该cookie显示提示信息；存在再执行后续逻辑
            if (res) {
                domainList.push(config);
                localStorage.setItem("domainList", JSON.stringify(domainList));
                chrome.extension.getBackgroundPage().updateConfigList(domainList);
            } else {
                alertText.value = "获取cookie失败,请检查是否存在该cookie";
            }
        }
    });
}
function deleteList(row) {
    alertText.value = null;
    const index = domainList.findIndex(e => e.id === row.id);
    domainList.splice(index, 1);
    localStorage.setItem("domainList", JSON.stringify(domainList));
    // 通知移除监听
    chrome.extension.getBackgroundPage().updateConfigList(domainList);
    chrome.extension.getBackgroundPage().changeConfigItem(row, "delete");
}

const restaurants = reactive([
    {
        value: "http://gdios.dev.ge.cn",
    },
    {
        value: "http://192.168.10.24",
    },
]);

const querySearch = (queryString, cb) => {
    const results = queryString ? restaurants.filter(e => e.value === queryString) : restaurants;
    // call callback function to return suggestions
    cb(results);
};

function handleSelect(formEl) {
    formEl.clearValidate("from");
}
</script>

<style lang="less" scoped>
.submit-content {
    text-align: center;
    padding-bottom: 12px;
}
</style>
