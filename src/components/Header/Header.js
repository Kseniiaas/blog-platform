import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';

const Header = ({ isLoggedIn, user, setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

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
        <Link to="/" className='header-t'>Realworld Blog</Link>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <Link to="/new-article" className="create-article-btn">Create Article</Link>
            {user && (
              <Link to="/profile" className="user-info">
                <span className='username'>{user.username}</span>
                <img 
                  src={user.image?.trim() || defaultImage}
                  alt={user.username} 
                  className="avatar" 
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
  user: PropTypes.shape({
    username: PropTypes.string,
    image: PropTypes.string,
  }),
  setIsLoggedIn: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Header;



