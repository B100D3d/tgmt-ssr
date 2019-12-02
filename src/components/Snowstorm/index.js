import React from 'react';
import snowStorm from './snowstorm.js';

export default class Snow extends React.Component {

    constructor() {
        super();
        this.storm = new snowStorm();
    }

    componentDidMount() {
        this.storm.doStart();
      }
    
      componentWillUnmount() {
        this.storm.stop();
        Array.from(document.getElementsByClassName('___snowStorm___')).forEach( element => {
          element.parentNode.removeChild(element);
        });
      }
    
      render() {
        return null;
      }
}