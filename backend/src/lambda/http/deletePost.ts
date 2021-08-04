import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteBlogImage, deleteBlogPost, isPostUsers } from '../../data/repository'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteBlogPost')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const postId = event.pathParameters.postId
  logger.info(postId)
  const userId = getUserId(event)
  logger.info(userId)
  const isTodoYours = await isPostUsers(postId, userId)
  logger.info(isTodoYours)

  if (isTodoYours){
    await deleteBlogPost(postId, userId)
    logger.info('todo deleted: ', postId)
    await deleteBlogImage(postId)
    logger.info('image deleted: ', postId)


    // TODO: Remove a TODO item by id
    return {
      statusCode: 200,
      headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Credentials': true
      },
      body: 'Item "${todoId}" was deleted.'
   }
  }

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 
      'We are sorry this todo does not belong to you and therefore cannot be deleted.'
  }
}
