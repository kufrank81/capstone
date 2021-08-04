import { apiEndpoint } from '../config'
import { BlogPost } from '../types/BlogPost';
import { CreateBlogRequest } from '../types/CreateBlogRequest';
import Axios from 'axios'
import { UpdateBlogRequest } from '../types/UpdateBlogRequest';

export async function getBlogPosts(idToken: string): Promise<BlogPost[]> {
  console.log('Fetching blog posts')

  const response = await Axios.get(`${apiEndpoint}/blog`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Posts:', response.data)
  return response.data.items
}

export async function createPost(
  idToken: string,
  newPost: CreateBlogRequest
): Promise<BlogPost> {
  console.log(idToken)
  console.log(JSON.stringify(newPost))
  const response = await Axios.post(`${apiEndpoint}/blog`,  JSON.stringify(newPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchPost(
  idToken: string,
  postId: string,
  updatedPost: UpdateBlogRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/blog/${postId}`, JSON.stringify(updatedPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletePost(
  idToken: string,
  postId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/blog/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  postId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/blog/${postId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log(uploadUrl)
  await Axios.put(uploadUrl, file)
}
