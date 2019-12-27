<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.movieName"
        placeholder="请输入电影名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.showtime"
        type="date"
        placeholder="选择场次日期"
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

      <el-table-column label="电影id" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.movieId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电影名称" width="400">
        <template slot-scope="{ row }">
          <span>{{ row.movieName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" align="center" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="座位数" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.seatNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="放映时间" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.showtime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="已预定的座位" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.bookedSeat }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left: 20px;"
      >
        <!-- todo -->
        <el-form-item label="电影" prop="movieName">
          <el-select v-model="temp.movieId" placeholder="请输入电影名称">
            <el-option
              v-for="item in movieOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input-number v-model="temp.price" :min="0" />
        </el-form-item>

        <el-form-item label="座位数" prop="seatNum">
          <el-input-number v-model="temp.seatNum" :min="0" />
        </el-form-item>

        <el-form-item label="上映日期" prop="releaseDate">
          <el-date-picker
            v-model="temp.releaseDate"
            type="date"
            placeholder="请输入上映日期"
          />
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
import {
  fetchList,
  createScene,
  updateScene,
  deleteScene,
  fetchMovieList
} from "@/api/scene";
import Pagination from "@/components/Pagination";

export default {
  name: "scene",
  components: { Pagination },
  data() {
    return {
      tableKey: 5,
      // 列表数据
      list: null,
      // 总数
      total: 0,
      // 加载提示框
      listLoading: true,
      movieOptions: [],
      // 查询参数
      listQuery: {
        page: 1,
        size: 20,
        movieName: undefined,
        showtime: undefined
      },
      // 弹出框临时对象
      temp: {
        id: undefined,
        movieId: undefined,
        price: undefined,
        seatNum: undefined,
        showtime: new Date(),
        bookedSeat: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: { update: "修改", create: "创建" },
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
    this.getMovieList();
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
    getMovieList() {
      fetchMovieList().then(response => {
        this.movieOptions = response.data;
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
        movieName: undefined,
        showtime: undefined
      };
    },
    // 重置临时对象
    resetTemp() {
      this.temp = {
        id: undefined,
        movieId: undefined,
        movieName: undefined,
        price: undefined,
        seatNum: undefined,
        showtime: new Date(),
        bookedSeat: undefined
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
          createScene(tempData)
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
          updateScene(tempData.id, tempData)
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
      deleteScene(id)
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
    }
  }
};
</script>

<style lang="css" scoped></style>
