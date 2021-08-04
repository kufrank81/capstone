import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  TextArea,
  Label,
  Form,
  TextAreaProps
} from 'semantic-ui-react'

import { createPost, deletePost, getBlogPosts, patchPost } from '../api/blog-api'
import Auth from '../auth/Auth'
import { BlogPost } from '../types/BlogPost'
import { CreateBlogRequest } from '../types/CreateBlogRequest'

interface BlogProps {
  auth: Auth
  history: History
}

interface BlogsState {
  posts: BlogPost[]
  newPostName: string
  releaseDate: string
  postContent: string
  loadingPosts: boolean
}

export class Posts extends React.PureComponent<BlogProps, BlogsState> {
  state: BlogsState = {
    posts: [],
    newPostName: '',
    releaseDate: '',
    postContent: '',
    loadingPosts: true
  }
  
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPostName: event.target.value })
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ releaseDate: event.target.value })
  }

  handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ postContent: event.target.value })
  }

  onEditButtonClick = (postId: string) => {
    this.props.history.push(`/blog/${postId}/edit`)
  }

  onPostCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
      const newPost = await createPost(this.props.auth.getIdToken(), {
        title: this.state.newPostName,
        releaseDate: this.state.releaseDate,
        postContent: this.state.postContent
      })
      this.setState({
        posts: [...this.state.posts, newPost],
        newPostName: ''
      })
    } catch {
      alert('Post creation failed')
    }
  }

  onPostDelete = async (postId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), postId)
      this.setState({
        posts: this.state.posts.filter(post => post.postId != postId)
      })
    } catch {
      alert('Post deletion failed')
    }
  }

  onPostCheck = async (pos: number) => {
    try {
      const post = this.state.posts[pos]
      await patchPost(this.props.auth.getIdToken(), post.postId, {
        title: post.title,
        releaseDate: post.releaseDate,
        postContent: post.postContent,
        allowComments: !post.allowComments
      })
      this.setState({
        posts: update(this.state.posts, {
          [pos]: { allowComments: { $set: !post.allowComments } }
        })
      })
    } catch {
      alert('Post update failed')
    }
  }

  async componentDidMount() {
    try {
      const posts = await getBlogPosts(this.props.auth.getIdToken())
      this.setState({
        posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  

  render() {
    return (
      <div>
        <Header as="h1">POSTs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Post - Title',
              onClick: this.onPostCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Label color='teal' horizontal width={5}>Release Date</Label>
          <Input
            type="date"
            fluid
            placeholder="Release Date"
            width={8}
            onChange={this.handleDateChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            //cols={150}
            //rows={25}
            placeholder="Content of Post"
            fluid
            onChange={this.handleContentChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading POSTs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.posts.map((post, pos) => {
          return (
            <Grid.Row key={post.postId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onPostCheck(pos)}
                  checked={post.allowComments}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {post.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {post.releaseDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(post.postId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPostDelete(post.postId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {post.attachmentUrl && (
                <Image src={post.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
