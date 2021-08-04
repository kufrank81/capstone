import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateBlogRequest } from '../../requests/CreateBlogRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createPost } from '../../businessLogic/post'

const logger = createLogger('createBlogPost')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBlogPost: CreateBlogRequest = JSON.parse(event.body)
  
  const userId = getUserId(event)

  const newItem = await createPost(newBlogPost, userId)
  logger.info('new item is', newItem)
  const item = newItem

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}


