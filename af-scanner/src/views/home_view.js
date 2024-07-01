import React, { useContext } from 'react';
import AirfiberLogo from "../logo.svg";
import { AuthContext } from '../components/Auth_comp';

const HomeView = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className='page_title'>
            <img src={AirfiberLogo} alt="Airfiber Logo" className="logo" />
            <h1>Inventory Systems V2.0.2</h1>
            {!isAuthenticated && <img src={process.env.PUBLIC_URL + '/foblogo.jpg'} alt="Fob Logo" id="foblogo" />}
        </div>
    );
}

export default HomeView;