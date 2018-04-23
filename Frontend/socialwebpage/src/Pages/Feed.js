import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Card, Image, Icon, Rating, List, Button, Header, Comment, Message, TextArea, Input, Form } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar';
import Dropzone from 'react-dropzone'
import {checkSession} from '../API/GET/GetMethods';
import {uploadStoryToPlatform, uploadPictureToPlatform} from '../API/POST/PostMethods';
import {getFriendRequests, getFriends, getComments, getNotifications} from '../API/GET/GetMethods';
import {likeStoryEntryById, likeImageById, deleteFriendshipRequest, confirmFriendshipRequest, deleteFriend, createComment, deleteCommentById, likeComment} from '../API/POST/PostMethods';
import '../profileStyle.css';

var feedPosts = [];
var friendRequests = [];
var friends = [];
var comments = [];
var notifications = [];

class Feed extends Component {

  constructor() {
      super();

      this.state = {
        redirectToLogin: false,
        resFriendsRequests: [],
        resFriends: [],
        resFeedPosts: [],
        resComments: [],
        resNotifications: [],
        files: [],
        showMessage: false,
        sourceImage: "",
        err: "",
        title: "",
        content: "",
        redirectToFeed: false,
        status: false
      }

      this.apiCheckSession = "/checkSession";
      this.apiStoryCreate = "/story/create";
      this.apiUploadImage = "/image/create";

      //this.checkThisSession();
      //this.getfeeddata();
      //this.getFriends();
      //this.getFriendRequests();


      this.pageTitle = "Ivey";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkThisSession();
      this.getfeeddata();
      this.getFriends();
      this.getFriendRequests();
      this.getComments();
      this.getNotifications();
  }

  async checkThisSession() {
    const response = await checkSession(this.apiCheckSession);
    this.setState({currentUserId: response.userId})
    if(response.message !== "User is authorized") {
        this.setState({redirectToLogin: true})
    }
  }


 async getfeeddata() {
      const response = await fetchFeedData("/feed");
      this.setState({resFeedPosts: response});
      response.map(item => {
        item.number_of_likes_in_state = item.number_of_likes;
      });
  }

  async getFriendRequests() {
      const response = await getFriendRequests("/friends/getFriendRequests");
      this.setState({resFriendsRequests: response});
  }

  async getFriends() {
      const response = await getFriends("/friends/getFriends");
      this.setState({resFriends: response})
  }

  async getNotifications() {
      const response = await getNotifications("/user/notifications");
      this.setState({resNotifications: response})
  }

  async confirmFriendRequest(e, item) {
      //Set state of status to accepted
      //Add both to friends: []
      console.log(String(item.requester))
      console.log(item.recipient)

      const response = await confirmFriendshipRequest(
          "/friends/confirmFriendRequest",
          String(item.requester),
          item.recipient
      );
      if(response) {
          window.location.reload();
      }

  }

  async declineFriendRequest(e, item) {
      //Set state of status to rejected
      //Delete from friendRequests collection
      console.log(item.requester)
      console.log(item.recipient)
      const response = await deleteFriendshipRequest(
          "/friends/declineFriendRequest",
          String(item.requester),
          item.recipient
      );
      if(response) {
          window.location.reload();
      }
  }

  async deleteFriend(e, item) {
      const response = await deleteFriend(
          "/friends/deleteFriend",
          item.name
      );
      if(response) {
          window.location.reload();
      }
  }

async handleRatePost(event, data){
  event.preventDefault();

  if(data.src) {
    await likeImageById(
      "/image/like",
      data._id
    );
  }
  else {
    await likeStoryEntryById(
      "/story/like",
      data._id
    );
  }

  this.state.resFeedPosts.map(item => {
    if(item._id === data._id) {
      if(item.current_user_has_liked == 0) {
        item.number_of_likes_in_state++;
        item.current_user_has_liked = 1;
      } else {
        item.number_of_likes_in_state--;
        item.current_user_has_liked = 0;
      }
    }
  });
  this.setState({resFeedPosts: this.state.resFeedPosts});
}

getNumberOfLikesOfPost(currentItem) {
  let numberOfLikes = 0;
  this.state.resFeedPosts.map(item => {
    if(item._id === currentItem._id) {
      numberOfLikes = item.number_of_likes_in_state;
    }
  });
  if(numberOfLikes == undefined) {
    numberOfLikes = currentItem.number_of_likes;
  }
  return numberOfLikes;
}

async handleCreateComment(event, data) {
  if(event.target[0].value.trim() != "" && event.target[0].value != null) {
    let commentData = {
      "content": event.target[0].value,
      "postId" : data._id
    }
    let response = await createComment("/comment/create", commentData);
    if(response) {
      let commentInputElements = Array.from(document.getElementsByClassName('commentInput'));
      commentInputElements.map(item => {
        item.value = "";
      })
      this.getComments();
    }
  }
}

async getComments() {
  let response = await getComments("/comment/list");
  this.setState({resComments: response});
  response.map(item => {
    item.number_of_likes_in_state = item.number_of_likes;
  });
}

async handleRateComment(event, data) {
  event.preventDefault();

  await likeComment("/comment/like", data._id);
  this.state.resComments.map(item => {
    if(item._id === data._id) {
      if(item.current_user_has_liked == 0) {
        item.number_of_likes_in_state++;
        item.current_user_has_liked = 1;
      } else {
        item.number_of_likes_in_state--;
        item.current_user_has_liked = 0;
      }
    }
  });
  this.setState({resComments: this.state.resComments});
}

getNumberOfLikesOfComment(currentItem) {
  let numberOfLikes = 0;
  this.state.resComments.map(item => {
    if(item._id === currentItem._id) {
      numberOfLikes = item.number_of_likes_in_state;
    }
  });
  if(numberOfLikes == undefined) {
    numberOfLikes = currentItem.number_of_likes;
  }
  return numberOfLikes;
}

// Upload story
async handleSubmit(event) {
  event.preventDefault();

  this.state.title =  event.target[0].value;
  this.state.content =  event.target[1].value;

  if(this.state.files[0]){
    const fd = new FormData();
    fd.append('theImage', this.state.files[0]);
    fd.append('title', this.state.title);
    fd.append('content', this.state.content);

    const response = await uploadPictureToPlatform(
        this.apiUploadImage,
        fd
    );

    this.setState({message : JSON.parse(response).message});
    if(this.state.message === "Image uploaded") {
        this.setState({ redirectToFeed: true });
        window.location.reload();
    } else {
        //Error messages
        this.setState({ showMessage: true });
    }

  }else{
    const response = await uploadStoryToPlatform(
        this.apiStoryCreate,
        this.state.title,
        this.state.content
    );

    this.setState({status: response});

    // Redirect to feed if respose is message is true

    if(this.state.status === true) {
        this.setState({ redirectToFeed: true });
        window.location.reload();
    } else {
        this.setState({ showMessage: true });
    }
  }

}

onDrop(files) {
  this.setState({
    files: files
  });
}

async handleDeleteComment(event, data) {
  const response = await deleteCommentById("/comment/delete", data._id);
  if(response) {
    this.getComments();
  }
}


    render() {
        const { redirectToLogin } = this.state;
        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        feedPosts = this.state.resFeedPosts;
        friendRequests = this.state.resFriendsRequests;
        friends = this.state.resFriends;
        comments = this.state.resComments;
        notifications = this.state.resNotifications;

        return (
          <div id="main-content">

            <div className="feed">
                 <Sidebar />
             </div>
                <div id="feed-content">

                      <Tab menu={{ secondary: true, pointing: true }} panes={
                        [
                          { menuItem: 'Feed', render: () => <Tab.Pane attached={false}>
                          <div id="feed-card">
                            <Card.Group>
                              <Card fluid centered>
                                <div className="username-label">
                                  Share something with your friends
                                </div>
                                <Card.Content id="feed-upload-content">
                                  <div id="upload-content">
                                     <Form onSubmit={this.handleSubmit.bind(this)}>
                                        <span className="input-label-upload"> Add the title of your new post</span>

                                        <Input className="input-upload" type="text"/>

                                        <span className="input-label-upload"> What story do you want to share?</span>
                                        <TextArea className="input-upload" type="text"></TextArea>

                                          <Dropzone id="dz-repair" multiple={ false } name="theImage" acceptedFiles="image/jpeg, image/png, image/gif" className="upload-dropzone" onDrop={this.onDrop.bind(this)} >
                                              <p id="feed-share-text"><Icon name='image' size="large" id="settings-icon" /> Add Photo</p>
                                          </Dropzone>

                                          <div>{this.state.files.map((file, index) => <img key={index} className="upload-image" alt="preview" src={file.preview} /> )}</div>
                                          <aside>
                                              {
                                                this.state.files.map(f => <span className="upload-image-label" key={f.name}>Uploaded Filename: {f.name}</span>)
                                              }
                                          </aside>

                                          {this.state.showMessage ? <Message negative><p>{this.state.message}</p></Message> : null}
                                        <Button className="button-upload" type="submit">Post</Button>

                                      </Form>
                                  </div>
                                </Card.Content>
                              </Card>
                            </Card.Group>
                          </div>

                          {feedPosts.map((item, index) =>
                          {return(
                            <div key={index} id="feed-card">
                              <Card.Group>
                                <Card fluid centered>
                                  <div className="username-label">
                                    {item.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                    <Link to={`/profile/${item.username}`}>
                                      <span className="content-card-username-label"> @{item.username} </span>
                                    </Link>
                                  </div>

                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onRate={((e) => this.handleRatePost(e, item))} icon='heart' size="large" rating={item.current_user_has_liked} maxRating={1}>
                                      </Rating>
                                         {item.title}
                                        <div className="ui mini horizontal statistic post-likes">
                                          <div className="value">
                                            {this.getNumberOfLikesOfPost(item)}
                                          </div>
                                          <div className="label">
                                            Likes
                                          </div>
                                      </div>

                                    </Card.Header>
                                    <Card.Meta className="card-meta">
                                      <span className='date'>
                                        {item.date_created}
                                        {item.updated ? <p>(edited)</p> :  null}
                                      </span>
                                    </Card.Meta>
                                    <Card.Description>
                                      {item.content}
                                    </Card.Description>
                                  </Card.Content>
                                </Card>
                                <Card fluid centered className="comment-card">
                                  <Card.Content>
                                      <Header as='h3' dividing>Comments</Header>
                                      {comments.map((comment, index) => {
                                        return(
                                          <Comment.Group key={index}>
                                            {comment.post_id === item._id ?
                                            <Comment className="comment-box">
                                              {comment.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image className="comments-user-image" src={comment.profile_picture_url} /></div> : <div><Image className="comments-user-image" src="/assets/images/user.png"></Image></div> }

                                              <Comment.Content className="comment-content">
                                                <div className="comment-header">
                                                    <Comment.Author className="comment-author" >
                                                      <Link to={`/profile/${comment.authorName}`}>
                                                        {comment.authorName}
                                                      </Link>
                                                    </Comment.Author>
                                                </div>
                                                <div className="ui mini horizontal statistic post-likes comment-likes">
                                                  <div className="value">
                                                  {this.getNumberOfLikesOfComment(comment)}
                                                  </div>
                                                  <div className="label">
                                                    Likes
                                                  </div>
                                                </div>
                                                {this.state.currentUserId === comment.author_id ? <Button className="button-upload delete-button-comment" onClick={((e) => this.handleDeleteComment(e, comment))} circular icon="delete" size="tiny"></Button> : null }
                                                <Rating className="comment-rating" onRate={((e) => this.handleRateComment(e, comment))} icon='heart' size="large" rating={comment.current_user_has_liked} maxRating={1}>
                                                </Rating>
                                                <div className="comment-user-info">
                                                  <Comment.Metadata>
                                                    <div>{comment.date_created}</div>
                                                  </Comment.Metadata>
                                                </div>
                                                <Comment.Text>{comment.content}</Comment.Text>
                                              </Comment.Content>
                                            </Comment>
                                            : null }
                                          </Comment.Group>
                                        )
                                      })}
                                      <Form onSubmit={((e) => this.handleCreateComment(e, item))} reply>
                                        <Form.TextArea class="commentInput" placeholder="Add a comment.." />
                                        <Button className="button-upload" content='Add Reply' labelPosition='left' icon='edit'/>
                                      </Form>
                                  </Card.Content>
                                </Card>
                              </Card.Group>
                             </div>
                             )
                          })}


                          </Tab.Pane> },
                          { menuItem: 'Friends', render: () => <Tab.Pane attached={false}>
                            <div id="friends">
                              <div>
                                <Header as='h2' icon textAlign='center'>
                                  <Icon name='users' circular />
                                  <Header.Content>
                                    Friends
                                  </Header.Content>
                                  <Header.Subheader className="feed-subheader">
                                    View your current friends and manage requests from people you may know.

                                  </Header.Subheader>
                                </Header>
                              </div>
                                {friendRequests.map((item, index) =>
                                  {
                                    return(
                                      <div key={index}>
                                        <List  divided relaxed verticalAlign='middle'>
                                          <List.Item>
                                            {item.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                            <List.Content>
                                              <List.Header as='a'>
                                                  <Link to={`/profile/${item.requester}`}>
                                                      <span>{item.requester} </span>
                                                  </Link>
                                                   wants to be friends with you.
                                              </List.Header>
                                              <List.Description>4 mutual contacts</List.Description>
                                            </List.Content>
                                            <List.Content floated="right">
                                              <Button onClick={((e) => this.confirmFriendRequest(e, item))}>Confirm</Button>
                                              <Button onClick={((e) => this.declineFriendRequest(e, item))}>Decline</Button>
                                            </List.Content>
                                          </List.Item>
                                        </List>
                                      </div>
                                    )
                                  }
                                )}
                                {friends.map((item, index) =>
                                  {
                                    return(
                                      <div key={index}>
                                        <List  divided relaxed verticalAlign='middle'>
                                          <List.Item>
                                            {item.picture !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.picture} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                            <List.Content>
                                              <List.Header >
                                                  <Link to={`/profile/${item.name}`}>
                                                      {item.name}
                                                  </Link>
                                              </List.Header>
                                              <List.Description>4 mutual contacts</List.Description>
                                            </List.Content>
                                            <List.Content floated="right">
                                                <Button onClick={((e) => this.deleteFriend(e, item))}>Delete Friend</Button>
                                            </List.Content>
                                          </List.Item>
                                        </List>
                                      </div>
                                    )
                                  }
                                )}
                            </div>


                          </Tab.Pane> },
                          { menuItem: 'Notifications', render: () => <Tab.Pane attached={false}>
                            <div id="friends">
                              <div>
                                <Header as='h2' icon textAlign='center'>
                                  <Icon name='discussions' circular />
                                  <Header.Content>
                                    Notifications
                                  </Header.Content>
                                  <Header.Subheader className="feed-subheader">
                                    Check your notifications and see posts with interaction.
                                  </Header.Subheader>
                                </Header>
                              </div>

                              {notifications.map((item, index) =>
                                {
                                  return(
                                    <div key={index}>
                                      <List  divided relaxed verticalAlign='middle'>
                                        <List.Item>
                                          {item.picture !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.picture} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                          <List.Content>
                                            <List.Header >
                                                <Link to={`/profile/${item.actionUser}`}>
                                                    {item.actionUser}
                                                </Link>
                                            </List.Header>
                                            <List.Description>{item.action}</List.Description>
                                            <List.Description>{item.date_created}</List.Description>
                                          </List.Content>
                                          <List.Content floated="right">
                                          </List.Content>
                                        </List.Item>
                                      </List>
                                    </div>
                                  )
                                }
                              )}

                            </div>
                          </Tab.Pane> },
                        ]
                        } />
                </div>
          </div>
        );
    }
}

export default Feed;
