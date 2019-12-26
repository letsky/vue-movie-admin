<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入电影名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.duration"
        type="date"
        placeholder="选择上映日期"
      >
      </el-date-picker>
      <el-select
        v-model="listQuery.type"
        placeholder="电影类型"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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

      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="海报">
              <img style="width: 100px; height: 100px" :src="row.poster" />
            </el-form-item>
            <el-form-item label="剧情">
              <span>{{ row.plot }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="id" align="center" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电影名称" width="400">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时长" align="center" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上映日期" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.releaseDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="导演" width="110" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.directors }}</span>
        </template>
      </el-table-column>

      <el-table-column label="主演" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.actors }}</span>
        </template>
      </el-table-column>

      <el-table-column label="国家" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{ row }">
          <el-tag>{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="类别" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.categories | categoryFilter }}</span>
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
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 创建/更新 弹出框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="7vh"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left:20px;"
      >
        <el-form-item label="电影名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入电影名称" />
        </el-form-item>

        <el-form-item label="海报" prop="poster">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :limit="1"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="temp.poster" :src="temp.poster" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="时长" prop="duration">
          <el-input-number v-model="temp.duration" :min="0" />
        </el-form-item>

        <el-form-item label="主演" prop="actors">
          <el-input v-model="temp.actors" placeholder="请输入主演" />
        </el-form-item>

        <el-form-item label="导演" prop="directors">
          <el-input v-model="temp.directors" placeholder="请输入导演" />
        </el-form-item>

        <el-form-item label="上映日期" prop="releaseDate">
          <el-date-picker
            v-model="temp.releaseDate"
            type="date"
            placeholder="请输入上映日期"
          />
        </el-form-item>

        <el-form-item label="剧情" prop="plot">
          <el-input
            v-model="temp.plot"
            placeholder="请输入剧情"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>

        <el-form-item label="国家" prop="country">
          <el-input v-model="temp.country" placeholder="请输入国家" />
        </el-form-item>

        <el-form-item label="上映状态" prop="status">
          <el-select v-model="temp.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类别">
          <el-select
            v-model="temp.categories"
            multiple
            filterable
            placeholder="请选择类别"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { fetchList, createMovie, updateMovie, deleteMovie } from "@/api/movie";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

//状态下拉框选项
const statusOptions = [
  { id: 1, label: "下架", value: 0 },
  { id: 2, label: "上架", value: 1 }
];

const categoryOptions = [
  { label: "动作", value: 1 },
  { label: "犯罪", value: 2 }
];

export default {
  name: "movie",
  components: { Pagination },
  filters: {
    //转换状态
    statusFilter(status) {
      const statusMap = {
        0: "下架",
        1: "上架"
      };
      return statusMap[status];
    },
    //转换类别
    categoryFilter(categories) {
      return categories.map(c => c.name).join(",");
    }
  },
  computed: {},
  data() {
    return {
      tableKey: 0,
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
        name: undefined,
        status: undefined,
        duration: undefined,
        type: undefined
      },
      // 状态下拉框数据
      statusOptions,
      categoryOptions,
      // 弹出框对象
      temp: {
        id: undefined,
        name: undefined,
        duration: undefined,
        directors: undefined,
        actors: undefined,
        releaseDate: new Date(),
        plot: undefined,
        poster: undefined,
        country: undefined,
        status: undefined,
        categories: []
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: { update: "修改", create: "创建" },
      // 上传图片的接口地址
      uploadUrl: "http://127.0.0.1:8080/api/upload",
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = false;
      // this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
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
      const c = this.temp.categories;
      this.temp.categories = c.map(e => e.id);
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
      const movieId = row.id;
      deleteMovie(movieId)
        .then(response => {
          this.$notify({
            title: "Success",
            message: "Delete Successfully",
            type: "success",
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
        .catch(error => console.log(error));
    },
    handleAvatarSuccess(res, file) {
      this.temp.poster = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="css" scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 100px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.el-form-item /deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-dialog .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.el-dialog .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-upload__tip {
  font-size: 12px;
}
</style>
