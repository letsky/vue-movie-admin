<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.createTime"
        type="date"
        placeholder="创建时间"
      >
      </el-date-picker>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <!-- 添加 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      size="mini"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="40"
        align="center"
      ></el-table-column>

      <el-table-column label="id" align="center" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="{ row }">
          <router-link :to="'/news/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>

          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getList"
    />

    <!-- 创建/更新 弹出框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      @close="closeDialog"
      top="2vh"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left:20px;"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入资讯标题" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createNews, updateNews, deleteNews } from "@/api/news";
import Pagination from "@/components/Pagination";

export default {
  name: "news",
  components: { Pagination },
  data() {
    return {
      tableKey: 3,
      // 列表数据
      list: null,
      // 总数
      total: 0,
      // 加载提示框
      listLoading: true,
      // 查询参数
      listQuery: {
        page: 1,
        size: 20,
        title: undefined,
        createTime: undefined
      },
      // 弹出框临时对象
      temp: {
        id: undefined,
        title: undefined,
        content: undefined,
        createTime: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: { update: "修改", create: "创建" },
      // 校验规则
      rules: {
        title: [{ required: true, message: "标题必填", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
      this.resetListQuery();
    },
    // 重置查询对象
    resetListQuery() {
      this.listQuery = {
        page: 1,
        size: 20,
        name: undefined,
        status: undefined,
        duration: undefined,
        categories: []
      };
    },
    // 重置临时对象
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        duration: 0,
        directors: undefined,
        actors: undefined,
        releaseDate: new Date(),
        plot: undefined,
        poster: undefined,
        country: undefined,
        status: 0,
        categories: []
      };
    },
    // 点击添加按钮
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 创建新数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        //校验表单
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log(tempData);
          createMovie(tempData)
            .then(response => {
              console.log(response);
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    // 点击编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log(tempData);
          updateMovie(tempData.id, tempData)
            .then(response => {
              // 关闭对话框
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    // 删除按钮
    handleDelete(row) {
      const id = row.id;
      deleteMovie(id)
        .then(response => {
          // 重新请求数据
          this.getList();
          this.$notify({
            title: "Success",
            message: "Delete Successfully",
            type: "success",
            duration: 2000
          });
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
<style lang="css" scoped>
.link-type {
  color: #337ab7;
  cursor: pointer;
}
</style>
