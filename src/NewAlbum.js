import React, { useState, useCallback } from 'react';
import { Input, Header, Segment } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';


const NewAlbum = (props) => {
  const [albumName, setAlbumName] = useState('')

  const handleChange = useCallback((event) => {
    let change = {};
    change[event.target.name] = event.target.value;
    setAlbumName(event.target.value)
  })

  const handleSubmit = useCallback(async(event) => {
    event.preventDefault();
    const NewAlbum = `mutation ($name: String!) {
      createAlbum(input: {name: $name}) {
        id
        name
      }
    }`;
    const result = await API.graphql(graphqlOperation(NewAlbum, { name: albumName }));
    console.info(`Created album with id ${result.data.createAlbum.id}`);
    setAlbumName('')
  })

  return (
    <Segment>
      <Header as='h3'>Add a new album</Header>
        <Input
        type='text'
        placeholder='New Album Name'
        icon='plus'
        iconPosition='left'
        action={{ content: 'Create', onClick: handleSubmit }}
        name='albumName'
        value={albumName}
        onChange={handleChange}
        />
    </Segment>
  )
}

export default NewAlbum