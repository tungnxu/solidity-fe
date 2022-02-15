/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import ConnectWallet from './ConnectWallet';
import MintPanel from './MintPanel';


const Header = () => {
    return (
        <nav className="navbar is-info" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item title m-0" href="#">
                    DOGG !
                </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                {/* <MintPanel /> */}
                <div className="navbar-end">
                    <div className="navbar-item">
                        <ConnectWallet />

                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header; 