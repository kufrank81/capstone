import * as AWS  from 'aws-sdk'
import { QueryOutput } from 'aws-sdk/clients/dynamodb'
import { DeleteObjectOutput } from 'aws-sdk/clients/s3'
import { BlogPost } from '../models/BlogPost'
import { UpdateBlogRequest } from '../requests/UpdateBlogRequest'


const blogTable = process.env.BLOG_TABLE
const indexName = process.env.INDEX_NAME
const bucketName = process.env.BLOG_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })




export function getUploadUrl(imageId: string): string {
    const expiration: number = +urlExpiration
  
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: expiration
    })
  }

  export async function deleteBlogImage(imageId: string): Promise<DeleteObjectOutput> {
    
    return s3.deleteObject({ Bucket: bucketName, Key: imageId }).promise()
  }





  export async function getUsersBlogPosts(userId: string): Promise<QueryOutput> {

    const result = await docClient.query({
        TableName: blogTable,
        IndexName: indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

      return result
  }

 // export async function getToDoByIdAndUserId(todoId: string, userId: string): Promise<QueryOutput> {
//
 //   const result = await docClient
 //   .query({
 //     TableName: toDoTable,
 //     IndexName: indexName,
 //     KeyConditionExpression: 'userId = :userId and todoId = :todoId',
 //     ExpressionAttributeValues: {
 //       ':userId': userId,
 //       ':todoId': todoId
 //     }
 //   })
 //   .promise()
//
 //     return result
 // }
  

export async function createBlogPost(newPost: BlogPost): Promise<BlogPost> {
    await docClient.put({
      TableName: blogTable,
      Item: newPost
    }).promise()
  
    return newPost
  }

  export async function deleteBlogPost(postId: string, userId: string): Promise<void> {

    await docClient.delete({
      TableName: blogTable,
      Key:{
        "postId": postId,
        "userId": userId
    }
    }).promise()
    
  }

  export async function isPostUsers(postId: string, userId: string): Promise<boolean> {
    const result = await docClient
    .query({
      TableName: blogTable,
      IndexName: indexName,
      KeyConditionExpression: 'userId = :userId and postId = :postId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':postId': postId
      }
    })
    .promise()
  
    return !!result
  }

  export async function updatePostItemWithImage(postId: string, imageId: string, userId: string): Promise<void> {
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    await docClient.update({
      TableName: blogTable,
      Key:{
        "postId": postId,
        "userId": userId
    },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues:{
        ":attachmentUrl": attachmentUrl
    }
    }).promise()
    
  }

  export async function blogPostExists(postId: string, userId: string): Promise<boolean> {
    const result = await docClient
      .get({
        TableName: blogTable,
        Key: {
          "postId": postId,
          "userId": userId
        }
      })
      .promise()
  
    console.log('Get todo: ', result)
    return !!result.Item
  }

  export async function updatePostItemWithRequest(postId: string, updatedPost: UpdateBlogRequest, userId: string) {
    await docClient.update({
      TableName: blogTable,
      Key:{
        "postId": postId,
        "userId": userId
    },
      UpdateExpression: "set #n = :newTitle, #rD = :releaseDate, #c = :isComments, #pC = :postContent",
      ExpressionAttributeValues:{
        ":newTitle": updatedPost.title,
        ":releaseDate": updatedPost.releaseDate,
        ":isComments": updatedPost.allowComments,
        ":postContent": updatedPost.postContent
    },
    ExpressionAttributeNames:{
      "#n": "name",
      "#rD": "releaseDate",
      "#c": "allowComments",
      "#pC": "postContent"
    }
    }).promise()
    
  }

  export async function getAllPostsByCategory(category: string): Promise<QueryOutput> {
    const result = await docClient.query({
      TableName: blogTable,
      IndexName: indexName,
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    })
    .promise()

    return result
  }