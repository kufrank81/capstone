import { String } from "aws-sdk/clients/acm";

/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateBlogRequest {
  title: string
  releaseDate: string
  postContent: String
}
