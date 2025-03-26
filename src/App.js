import { React, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header/Header';
import ArticlesList from './pages/ArticlesList/ArticlesList';
import ArticlePage from './pages/ArticlePage/ArticlePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import NewArticle from './pages/NewArticle/NewArticle';
import EditArticle from './pages/EditArticle/EditArticle';
import Profile from './pages/Profile/Profile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('https://blog-platform.kata.academy/api/user', {
          headers: { Authorization: `Token ${token}` },
        });

        setUser(response.data.user);
        setIsLoggedIn(true);

        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userImage', response.data.user.image || 'default-avatar.png');
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/new-article" element={<NewArticle />} />
        <Route path="/articles/:slug/edit" element={<EditArticle />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;

