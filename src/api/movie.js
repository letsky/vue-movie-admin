import request from "@/utils/request";

const qs = require("qs");

export function fetchList(query) {
  return request({
    url: "/movies",
    method: "get",
    // 解决数组后面带[]的问题
    params: qs.stringify(query, { arrayFormat: "repeat" })
  });
}

export function createMovie(data) {
  return request({
    url: "/movies",
    method: "post",
    data
  });
}

export function updateMovie(id, data) {
  return request({
    url: `/movies/${id}`,
    method: "put",
    data
  });
}

export function deleteMovie(id) {
  return request({
    url: `/movies/${id}`,
    method: "delete"
  });
}

// 获取所有分类
export function fetchCategoryList() {
  return request({
    url: "/categories/all",
    method: "get"
  });
}
