import React from 'react';
import { S3Image } from 'aws-amplify-react';
import { Divider } from 'semantic-ui-react';


const PhotosList = (props) => {
  const photoItems = props.photos.map(photo =>
    <S3Image 
        key={photo.thumbnail.key} 
        imgKey={photo.thumbnail.key.replace('public/', '')} 
        style={{display: 'inline-block', 'paddingRight': '5px'}}
    />
  )

  return (
    <div>
      <Divider hidden />
      {photoItems}
    </div>
  );
}


export default PhotosList