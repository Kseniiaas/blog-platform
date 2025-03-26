import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './NewArticle.scss';

const NewArticle = () => {
  const { register, handleSubmit } = useForm();
  const [tags, setTags] = useState(['']);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const articleData = {
        ...data,
        tagList: tags.filter(tag => tag.trim() !== ''),
      };

      await axios.post('https://blog-platform.kata.academy/api/articles', { article: articleData }, {
        headers: { Authorization: `Token ${token}` },
      });
      window.location.href = '/';
    } catch (error) {
      console.error(error);
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

  return (
    <div className='create-article'>
      <form className="form-create" onSubmit={handleSubmit(onSubmit)}>
        <h2 className='title-create'>Create new article</h2>
        <div className='create'>
          <h3 className="create-input">Title</h3>
          <input type="text" name="text" className='create_input' {...register('title', { required: true })} placeholder="Title" />
        </div>
        <div className='create'>
          <h3 className="create-input">Short description</h3>
          <input type="text" name="text" className='create_input' {...register('description', { required: true })} placeholder="Short description" />
        </div>
        <div className='create'>
          <h3 className="create-input">Text</h3>
          <textarea className='create_input-text' {...register('body', { required: true })} placeholder="Text" />
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

export default NewArticle;
