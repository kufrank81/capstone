/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateBlogRequest {
  title: string
  releaseDate: string
  postContent: string
  allowComments: string
}