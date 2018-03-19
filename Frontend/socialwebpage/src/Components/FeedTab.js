import React from 'react'
import { Tab, Card, Image, Icon, Comment, Header, Rating, List, Form, Input, Label, Button } from 'semantic-ui-react'

const panes = [
  { menuItem: 'Feed', render: () => <Tab.Pane attached={false}>
  <div>
    <Card fluid="true">
      <Image src='/assets/images/bg.jpg' />
      <Card.Content>
        <Card.Header>
            <Rating icon='heart' size="large" defaultRating={0} maxRating={1}>
            </Rating> Dunes
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Matthew is a musician living in Nashville.
        </Card.Description>
        <Comment.Group>

        <Header as='h4' dividing>Comments</Header>
        <Comment>
          <Comment.Avatar src='/assets/images/bg.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
      </Card.Content>
    </Card>
    <Card fluid="true">
      <Image src='/assets/images/john-towner-154060-unsplash.jpg' />
      <Card.Content>
        <Card.Header>
            <Rating icon='heart' size="large" defaultRating={0} maxRating={1}/> Matthew
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Matthew is a musician living in Nashville.
        </Card.Description>
        <Comment.Group>

        <Header as='h4' dividing>Comments</Header>
        <Comment>
          <Comment.Avatar src='/assets/images/bg.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
      </Card.Content>
    </Card>
  </div>



  </Tab.Pane> },
  { menuItem: 'Friends', render: () => <Tab.Pane attached={false}>
  <List className="friend-list" relaxed divided>
    <List.Item>
      <Image size="tiny" avatar src='/assets/images/bg.jpg' />
      <List.Content>
        <List.Header as='a'>Rachel B.</List.Header>
        <List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
          <List.Description>Connected since May 21th, 2017</List.Description>
          <List.Description>4 mutual contacts</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar circular size="tiny" src='/assets/images/bg.jpg' />
      <List.Content>
        <List.Header as='a'>Jimmy Neutron</List.Header>
        <List.Description>Last seen watching Arrested Developmentjust now.</List.Description>
        <List.Description>Connected since May 20th, 2017</List.Description>
        <List.Description>22 mutual contacts</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image size="tiny" avatar src='/assets/images/bg.jpg' />
      <List.Content>
        <List.Header as='a'>Conor McGregor</List.Header>
        <List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
          <List.Description>Connected since May 20th, 2018</List.Description>
          <List.Description>222 mutual contacts</List.Description>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image size="tiny" avatar src='/assets/images/bg.jpg' />
      <List.Content>
        <List.Header as='a'>Steve Jobs</List.Header>
        <List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
          <List.Description>Connected since May 20th, 2017</List.Description>
          <List.Description>22 mutual contacts</List.Description>
      </List.Content>
    </List.Item>
  </List>

  </Tab.Pane> },
  { menuItem: 'Settings', render: () => <Tab.Pane attached={false}>
  <div id="settings">
    <div id="account-settings">
      <Header as='h2' size="medium" icon textAlign="left">
      <Icon name='settings' id="settings-icon" />
      Account Settings
      <Header.Subheader>
        Manage your account settings and set e-mail preferences.
      </Header.Subheader>
      </Header>

      <Form >

        <Form.Field required>
          <Label basic="true" className="input-label">First Name</Label>
          <Input required  inverted className="login-input-text" placeholder='First name' />
          <Label basic="true" className="input-label">Last Name</Label>
          <Input required inverted className="login-input-text" placeholder='Last name' />
        </Form.Field>

        <Form.Field required>
          <Label basic="true" className="input-label">Username</Label>
          <Input required inverted className="login-input-text" placeholder='Username' />
          <Label basic="true" className="input-label">Password</Label>
          <Input required className="login-input-text" type="password" placeholder='Password' />
        </Form.Field>

        <Form.Field required>
          <Label basic="true" className="input-label">Email</Label>
          <Input required inverted className="login-input-text" iconPosition='left' placeholder='Email'>
             <Icon name='at' />
             <input />
           </Input>
        </Form.Field>

        <Button>Save</Button>
      </Form>

    </div>
    <div id="profile-settings">
      <Header as='h2' size="medium" icon textAlign="left">
      <Icon name='user' id="settings-icon" />
      Profile Settings
      <Header.Subheader>
        Manage your profile settings and set e-mail preferences.
      </Header.Subheader>
      </Header>
    </div>
  </div>


  </Tab.Pane> },
]

const FeedTabs = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
)

export default FeedTabs
