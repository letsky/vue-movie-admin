import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/movies",
    method: "get",
    params: query
  });
}
