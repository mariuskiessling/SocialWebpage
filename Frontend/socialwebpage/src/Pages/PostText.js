import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, TextArea, Message } from 'semantic-ui-react'
import {uploadStoryToPlatform} from '../API/POST/PostMethods';
import {checkSession, deleteSession} from '../API/GET/GetMethods';
import SidebarProfile from '../Components/Sidebar'

import '../profileStyle.css';

class PostText extends Component {
    constructor() {
        super();

        this.state = {
          showMessage: false,
          title: "",
          content: "",
          redirectToFeed: false,
          status: false
        }

        this.apiCheckSession = "/checkSession"
        this.api = "/story/create";

        //this.checkThisSession();

        this.pageTitle = "Tell us a story..."
        document.title = this.pageTitle;
    }

    componentDidMount() {
        this.checkThisSession();

    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message !== "User is authorized") {
            this.setState({redirectToLogin: true})
        }
    }

    handleLogout() {
        deleteSession(this.apiDeleteSession);
        this.setState({ redirectToLogin: true });
    }

      // Upload story
      async handleSubmit(event) {
        event.preventDefault();

        this.state.title =  event.target[0].value;
        this.state.content =  event.target[1].value;

        const response = await uploadStoryToPlatform(
            this.api,
            this.state.title,
            this.state.content
        );

        // Redirect to feed if respose is message is true
        this.setState({status: response});
        if(this.state.status === true) {
            this.setState({ redirectToFeed: true });
        } else {
            this.setState({ showMessage: true });
        }

    }

    render() {
        const { redirectToFeed } = this.state;

        if (redirectToFeed) {
           return <Redirect to='/'/>;
        }

        return (
          <div>
            <div className="feed">
                <SidebarProfile />
            </div>

            <div id="upload-content">
               <Form onSubmit={this.handleSubmit.bind(this)}>

                  <h2>Post a new story</h2>
                  <span className="input-label-upload"> Enter the title of your new story</span>

                  <Input className="input-upload" type="text"/>

                  <span className="input-label-upload"> What story do you want to share?</span>
                  <TextArea required className="input-upload" type="text"></TextArea>
                  <Button className="button-upload" type="submit">Post</Button>
                  <span id="error-message-upload-story">Upload failed. Try again later</span>

                  {this.state.showMessage ? <Message negative><p>{this.state.message}</p></Message> : null}
                </Form>
            </div>
          </div>
        )
    }
}

export default PostText;
