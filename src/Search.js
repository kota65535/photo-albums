
import React, { Component } from 'react';
import { Header, Segment, Input } from 'semantic-ui-react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import PhotosList from './PhotosList'

const SearchPhotos = `query SearchPhotos($label: String!) {
  searchPhotos(filter: { labels: { match: $label }}) {
    items {
      id
      bucket
      thumbnail {
          key
          width
          height
      }
      fullsize {
          key
          width
          height
      }
    }
  }
}`;



class Search extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          photos: [],
          album: null,
          label: '',
          hasResults: false,
          searched: false
      }
  }

  updateLabel = (e) => {
      this.setState({ label: e.target.value, searched: false });
  }

  getPhotosForLabel = async (e) => {
      const result = await API.graphql(graphqlOperation(SearchPhotos, {label: this.state.label}));
      let photos = [];
      let label = '';
      let hasResults = false;
      if (result.data.searchPhotos.items.length !== 0) {
          hasResults = true;
          photos = result.data.searchPhotos.items;
          label = this.state.label;
      }
      const searchResults = { label, photos }
      this.setState({ searchResults, hasResults, searched: true });
  }

  noResults() {
    return !this.state.searched
      ? ''
      : <Header as='h4' color='grey'>No photos found matching '{this.state.label}'</Header>
  }

  render() {
      return (
          <Segment>
            <Input
              type='text'
              placeholder='Search for photos'
              icon='search'
              iconPosition='left'
              action={{ content: 'Search', onClick: this.getPhotosForLabel }}
              name='label'
              value={this.state.label}
              onChange={this.updateLabel}
            />
            {
                this.state.hasResults 
                ? <PhotosList photos={this.state.searchResults.photos} />
                : this.noResults()
            }
          </Segment>
      );
  }
}


export default Search