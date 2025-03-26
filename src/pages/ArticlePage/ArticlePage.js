import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Popconfirm, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ArticlePage.scss';

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://blog-platform.kata.academy/api/articles/${slug}`);
        setArticle(response.data.article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      setArticle(prevArticle => ({
        ...prevArticle,
        favoritesCount: response.data.article.favoritesCount,
      }));
    } catch (err) {
      setError('Failed to like the article');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      navigate('/');
    } catch (err) {
      setError('Failed to delete the article');
    }
  };

  if (loading) return <div className="spin"><Spin indicator={<LoadingOutlined spin />} size="large" /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="articles">
      <div className="article">
        <div className="article-header">
          <div className="article-title-section">
            <h1 className="title">{article.title}</h1>
            <span className="heart" onClick={handleLike}>♡</span>
            <span className="likes-count">{article.favoritesCount}</span>
          </div>

          <div className="tags">
            {article.tagList.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>

          <div className="author-info">
            <div className="author-details">
              <span className="author-name">{article.author.username}</span>
              <span className="article-date">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <img src={article.author.image} alt={article.author.username} className="avatar" />
          </div>

          {article.author.username === localStorage.getItem('username') && (
            <div className="article-actions">
              <Popconfirm
                placement="rightTop"
                title="Are you sure to delete this article?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <button className="delete-btn">Delete</button>
              </Popconfirm>
              <Link to={`/articles/${article.slug}/edit`} className="edit_btn">Edit</Link>
            </div>
          )}

          <p className="description">{article.description}</p>
        </div>

        <div className="article-body">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;

