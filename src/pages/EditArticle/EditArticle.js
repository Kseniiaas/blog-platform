import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const EditArticle = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://blog-platform.kata.academy/api/articles/${slug}`);
        const { title, description, body, tagList } = response.data.article;

        setValue('title', title);
        setValue('description', description);
        setValue('body', body);
        setTags(tagList || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const updatedArticle = {
        ...data,
        tagList: tags.filter(tag => tag.trim() !== ''),
      };

      await axios.put(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        { article: updatedArticle },
        { headers: { Authorization: `Token ${token}` } }
      );

      navigate(`/articles/${slug}`);
    } catch (err) {
      console.error('Error updating article:', err);
      setError('Failed to update article');
    }
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  if (loading) return <div className="spin"><Spin indicator={<LoadingOutlined spin />} size="large" /></div>;
  if (error) return <p>{error}</p>;

  return (
    <div className='create-article'>
      <form className="form-create" onSubmit={handleSubmit(onSubmit)}>
        <h2 className='title-create'>Edit article</h2>

        <div className='create'>
          <h3 className="create-input">Title</h3>
          <input type="text" name="text" className='create_input' {...register('title', { required: true })} placeholder="Title" />
          {errors.title && <p className="error">Title is required</p>}
        </div>

        <div className='create'>
          <h3 className="create-input">Short description</h3>
          <input type="text" name="text" className='create_input' {...register('description', { required: true })} placeholder="Short description" />
          {errors.description && <p className="error">Description is required</p>}
        </div>

        <div className='create'>
          <h3 className="create-input">Text</h3>
          <textarea className='create_input-text' {...register('body', { required: true })} placeholder="Text" />
          {errors.body && <p className="error">Text is required</p>}
        </div>

        <div className='input-tags'>
          <h3 className='create-input'>Tags</h3>
          {tags.map((tag, index) => (
            <div key={index} className="tag-field">
              <input className="text-tag" type="text" name="text" value={tag} onChange={(e) => handleTagChange(index, e.target.value)} placeholder="Tag" />
              <button className='create-delete' type='button' onClick={() => removeTag(index)}>
                Delete
              </button>
              {index === tags.length - 1 && (
                <button className='create-add' type='button' onClick={addTag}>
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="send-button" type="submit">Send</button>
      </form>
    </div>
  );
};

export default EditArticle;
