import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/news",
    method: "get",
    params: query
  });
}

export function createNews(data) {
  return request({
    url: "/news",
    method: "post",
    params: data
  });
}

export function updateNews(id, data) {
  return request({
    url: `/news/${id}`,
    method: "put",
    params: data
  });
}

export function deleteNews(id) {
  return request({
    url: `/news/${id}`,
    method: "delete"
  });
}
