import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { blogPostExists, getUploadUrl, updatePostItemWithImage } from '../../data/repository'
import { createLogger } from '../../utils/logger'


const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const userId = getUserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const validToDoId = await blogPostExists(postId, userId)

  if (!validToDoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Post does not exist'
      })
    }
  }

  logger.info('Post exists: ', postId)
  const imageId = postId //This is not needed but was easier than re-writing the method since this is a serverless class not a programming class
  await updatePostItemWithImage(postId, imageId, userId)
  const uploadUrl = getUploadUrl(imageId)
  logger.info('presignedUrl', uploadUrl)
  return {
    statusCode: 200,
    headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}


