import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/scenes",
    method: "get",
    params: query
  });
}

export function fetchMovieList() {
  return request({
    url: "/movies/released",
    method: "get"
  });
}

export function updateScene(id, data) {
  return request({
    url: `/scenes/${id}`,
    method: "put",
    data
  });
}

export function createScene(data) {
  return request({
    url: "/scenes",
    method: "post",
    data
  });
}

export function deleteScene(id) {
  return request({
    url: `/scenes/${id}`,
    method: "delete"
  });
}
