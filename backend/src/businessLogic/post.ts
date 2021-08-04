import { createBlogPost } from "../data/repository"
import { BlogPost } from "../models/BlogPost"
import { CreateBlogRequest } from "../requests/CreateBlogRequest"
import * as uuid from 'uuid'



export async function createPost(newPost: CreateBlogRequest, userId: string): Promise<BlogPost> {

    const itemId = uuid.v4()
  
    return await createBlogPost({
      postId: itemId,
      userId: userId,
      title: newPost.title,
      releaseDate: newPost.releaseDate,
      createdAt: new Date().toISOString(),
      allowComments: false,
      attachmentUrl: "",
      postContent: newPost.postContent
    })
  }