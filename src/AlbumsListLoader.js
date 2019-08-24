import React, { useCallback } from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import AlbumsList from './AlbumsList';


const ListAlbums = `query {
    listAlbums(limit: 9999) {
        items {
            id
            name
        }
    }
}`;

const SubscribeToNewAlbums = `
  subscription OnCreateAlbum {
    onCreateAlbum {
      id
      name
    }
  }
`;


const AlbumsListLoader = (props) => {
  const onNewAlbum = useCallback((prevQuery, newData) => {
    // When we get data about a new album, we need to put in into an object 
    // with the same shape as the original query results, but with the new data added as well
    let updatedQuery = Object.assign({}, prevQuery);
    updatedQuery.listAlbums.items = prevQuery.listAlbums.items.concat([newData.onCreateAlbum]);
    return updatedQuery;
  })


  return (
    <Connect 
        query={graphqlOperation(ListAlbums)}
        subscription={graphqlOperation(SubscribeToNewAlbums)} 
        onSubscriptionMsg={onNewAlbum}
    >
        {({ data, loading }) => {
            if (loading) { return <div>Loading...</div>; }
            if (!data.listAlbums) return;

        return <AlbumsList albums={data.listAlbums.items} />;
        }}
    </Connect>
  );
}


export default AlbumsListLoader