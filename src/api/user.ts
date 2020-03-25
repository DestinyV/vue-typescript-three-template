import request from "@/utils/request"

/**
 * @method functionName
 * @param data any
 */
export function functionName(data: any) {
  return request({
    url: 'url',
    method: 'post',
    data: data
  })
}