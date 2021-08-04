export interface BlogPost {
  userId: string
  postId: string
  createdAt: string
  title: string
  postContent: string
  releaseDate: string
  allowComments: boolean
  attachmentUrl?: string
}
