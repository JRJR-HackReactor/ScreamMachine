import React from 'react';
import HighStriker from './HighStriker.jsx';
import SideBar from './SideBar.jsx';

class Arcade extends React.Component {

  render() {
    return (
      <div>
        <HighStriker />
        <SideBar />
      </div>
    );
  }
}

export default Arcade;
