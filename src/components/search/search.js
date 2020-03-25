import React from 'react';

import aliceLogo from '/static/alice-logo.svg';
import './search.sass';

const Search = () => {
    return (
        <div className="search-container">
            <div className="search-border">
                <input type="text" className="search" placeholder="Поиск по сайту" />
                <img src={ aliceLogo } alt="alice" className="alice" />
            </div>
        </div>
    );
};

export default Search;
