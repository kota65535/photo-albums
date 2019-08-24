import React, { useState, useCallback, useEffect } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import AlbumDetails from './AlbumDetails'


const GetAlbum = `query GetAlbum($id: ID!, $nextTokenForPhotos: String) {
    getAlbum(id: $id) {
    id
    name
    photos(sortDirection: DESC, nextToken: $nextTokenForPhotos) {
      nextToken
      items {
        thumbnail {
          width
          height
          key
        }
      }
    }
  }
}
`;


const AlbumDetailsLoader = (props) => {

  const [nextTokenForPhotos, setNextTokenForPhotos] = useState(null)
  const [hasMorePhotos, setHasMorePhotos] = useState(true)
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const loadMorePhotos = useCallback(async() => {
    if (!hasMorePhotos) return;

    setLoading(true)
    const { data } = await API.graphql(graphqlOperation(GetAlbum, { id: props.id, nextTokenForPhotos: nextTokenForPhotos }));
    let nextAlbum
    if (album === null) {
      nextAlbum = data.getAlbum;
    }
    else {
      nextAlbum = album
      nextAlbum.photos.items = album.photos.items.concat(data.getAlbum.photos.items);
    }
    setAlbum(nextAlbum)
    setLoading(false)
    setNextTokenForPhotos(data.getAlbum.photos.nextToken)
    setHasMorePhotos(data.getAlbum.photos.nextToken !== null)
  })
  
  useEffect(() =>  { loadMorePhotos() }, [])

  return <AlbumDetails 
            loadingPhotos={loading}
            album={album} 
            loadMorePhotos={loadMorePhotos} 
            hasMorePhotos={hasMorePhotos} 
                  />;
}


export default AlbumDetailsLoader
