
<template>
  <div>
    <ol>
      <li v-for="(item, index) in domainList" :key="item.id">
        <span>
          从
          <a
            href="javascript:void(0)"
            target="_blank"
            @click="jumpTo(item.from)"
            >{{ item.from }}</a
          >
          站点获取cookie:
          <i>{{ item.name }}</i> 放到站点 {{ item.to }} ；
        </span>
        <el-icon color="#409EFC" class="no-inherit" @click="deleteList(index)">
          <delete />
        </el-icon>
      </li>
    </ol>
    <el-form ref="formRef" :inline="true" label-suffix=":" :model="structure">
      <el-form-item label="cookieName" prop="name">
        <el-input v-model="structure.name"></el-input>
      </el-form-item>
      <el-form-item label="from" prop="from">
        <el-input v-model="structure.from"></el-input>
      </el-form-item>

      <el-form-item label="to" prop="to">
        <el-input v-model="structure.to"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { Plus, Delete } from "@element-plus/icons-vue";
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
const formRef = ref(null);
const structure = reactive({
  from: "gdios.dev.ge.cn",
  name: "WEBID",
  to: "localhost",
});
let domainList = reactive([]);
const moreList = computed(() => domainList.length > 1);
onMounted(() => {
  const list = localStorage.getItem("domainList") || "[]";
  const history = JSON.parse(list);
  domainList.push(...history);
});

function onSubmit() {
  const str = JSON.stringify(structure);
  if (domainList.some((e) => e.id === str)) {
    ElMessage("数据已存在于列表中");
    return;
  }
  domainList.push({
    ...structure,
    id: str,
  });
  // formRef.value.resetFields();
  localStorage.setItem("domainList", JSON.stringify(domainList));
}
function deleteList(i) {
  domainList.splice(i, 1);
  localStorage.setItem("domainList", JSON.stringify(domainList));
}
function jumpTo(url) {
  window.open('http://'+url);
}
</script>

<style lang="less" scoped>
.list {
  display: flex;
}
</style>