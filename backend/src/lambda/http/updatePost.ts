import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { isPostUsers, updatePostItemWithRequest } from '../../data/repository'
import { createLogger } from '../../utils/logger'
import { UpdateBlogRequest } from '../../requests/UpdateBlogRequest'
const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const userId = getUserId(event)
  const updatedBlogPost: UpdateBlogRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userCanUpdateTodo: boolean = await isPostUsers(postId, userId)
  if(userCanUpdateTodo){
    await updatePostItemWithRequest(postId, updatedBlogPost, userId)
    logger.info('todo updated', postId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        
      })
    }
  }
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 
      'We are sorry this todo does not belong to you and therefore cannot be updated.'
  }
}
