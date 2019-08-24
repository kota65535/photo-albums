import React from 'react';
import { Header, Segment, Form } from 'semantic-ui-react';
import S3ImageUpload from './S3ImageUpload'
import PhotosList from './PhotosList'

const AlbumDetails = (props) => {
  if (!props.album) return 'Loading album...';

  return (
    <Segment>
      <Header as='h3'>{props.album.name}</Header>
      <S3ImageUpload albumId={props.album.id}/>        
      <PhotosList photos={props.album.photos.items} />
      {
          props.hasMorePhotos && 
          <Form.Button
            onClick={props.loadMorePhotos}
            icon='refresh'
            disabled={props.loadingPhotos}
            content={props.loadingPhotos ? 'Loading...' : 'Load more photos'}
          />
      }
    </Segment>
  )
}


export default AlbumDetails