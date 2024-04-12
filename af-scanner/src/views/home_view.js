import React, { Component } from 'react';
import AirfiberLogo from "../logo.svg";

class HomeView extends Component {
    render() {
        return (
            <div className='page_title'>
                <img src={AirfiberLogo} alt="Airfiber Logo" className="logo" />
                <h1>Inventory Systems</h1>
            <img src={process.env.PUBLIC_URL + '/foblogo.jpg'} alt="Fob Logo" id="foblogo" />
            </div>
        );
    }
}

export default HomeView;