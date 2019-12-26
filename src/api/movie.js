import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/movies",
    method: "get",
    params: query
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
