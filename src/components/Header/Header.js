import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';

const Header = ({ isLoggedIn, setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedImage = localStorage.getItem('userImage');

    if (storedToken && storedUsername) {
      setLocalUser({ username: storedUsername, image: storedImage });  
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    setIsLoggedIn(false); 
    setUser(null);
    navigate('/');
  };

  const defaultImage = "https://static.productionready.io/images/smiley-cyrus.jpg";
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-t">Realworld Blog</Link>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <Link to="/new-article" className="create-article-btn">Create Article</Link>
            {localUser && ( 
              <Link to="/profile" className="user-info">
                <span className="username">{localUser.username}</span>
                <img
                  src={localUser.image?.trim() || defaultImage}  
                  alt={localUser.username}
                  className="avatar"
                  onError={(e) => e.target.src = defaultImage}
                />
              </Link>
            )}
            <button onClick={handleLogout} className="logout-btn">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className="sign-in-btn">Sign In</Link>
            <Link to="/sign-up" className="sign-up-btn">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Header;






