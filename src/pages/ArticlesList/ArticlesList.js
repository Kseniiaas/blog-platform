import React, { useState, useEffect } from 'react';
import { Pagination, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ArticlesList.scss';

const truncateText = (text, maxWords) => {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
};

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `https://blog-platform.kata.academy/api/articles?offset=${(currentPage - 1) * 5}`
        );
        setArticles(response.data.articles);
        setTotalArticles(response.data.articlesCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLike = async (slug) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`, 
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.slug === slug
            ? { ...article, favoritesCount: response.data.article.favoritesCount }
            : article
        )
      );
    } catch (err) {
      message.error('Failed to like article');
    }
  };
  

  if (loading) return <div className="spin"><Spin indicator={<LoadingOutlined spin />} size="large" /></div>;

  return (
    <div className="articles">
      {articles.map((article) => (
        <div className="article" key={article.slug}>
          <div className="article-header">
            <div className="article-title-section">
              <Link to={`/articles/${article.slug}`} className="title-link">
                <h2 className="title">{truncateText(article.title, 3)}</h2>
              </Link>
              <div className="like-section">
                <span className="heart" onClick={() => handleLike(article.slug)}>♡</span>
                <span className="likes-count">{article.favoritesCount}</span>
              </div>
            </div>
            <div className="author-info">
              <div className="author-details">
                <span className="author-name">{article.author.username}</span>
                <span className="article-date">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              <img
                src={article.author.image}
                alt={article.author.username}
                className="author-avatar"
              />
            </div>
            <div className="tags">
              {article.tagList.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <p className="description">{article.description}</p>
          <Link to={`/articles/${article.slug}`}></Link>
          </div>
        </div>
      ))}
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={totalArticles}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: 'center' }}
      />
    </div>
  );
};

export default ArticlesList;
