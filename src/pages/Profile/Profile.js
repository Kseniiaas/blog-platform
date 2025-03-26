import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Profile.scss';

const Profile = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('https://blog-platform.kata.academy/api/user', {
            headers: { Authorization: `Token ${token}` },
          });
          const { username, email, image } = response.data.user;
          setUserInfo({ username, email, image });
          
          setValue('username', username);
          setValue('email', email);
          setValue('image', image);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserInfo();
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log('Data to update:', data);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('https://blog-platform.kata.academy/api/user', { user: data }, {
        headers: { Authorization: `Token ${token}` },
      });

      console.log('Response after update:', response);
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error.response && error.response.data.errors) {
        const { username, email, image, password } = error.response.data.errors;
        if (username) setValue('username', '', { shouldValidate: true });
        if (email) setValue('email', '', { shouldValidate: true });
        if (image) setValue('image', '', { shouldValidate: true });
        if (password) setValue('password', '', { shouldValidate: true });
      }
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-block">
      <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="edit-profile">Edit Profile</h2>
        
        <div className="edit">
          <h3 className="edit-title">Username</h3>
          <input
            type="text"
            name="username"
            autoComplete="username"
            className={`edit-input ${errors.username ? 'error' : ''}`}
            {...register('username', { required: 'Username is required' })}
            placeholder="Username"
          />
          {errors.username && <span className="error">{errors.username.message}</span>}
        </div>
        
        <div className="edit">
          <h3 className="edit-title">Email address</h3>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className={`edit-input ${errors.email ? 'error' : ''}`}
            {...register('email', { 
              required: 'Email is required', 
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="Email address"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="edit">
          <h3 className="edit-title">New Password</h3>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            className={`edit-input ${errors.password ? 'error' : ''}`}
            {...register('password', { 
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long'
              },
              maxLength: {
                value: 40,
                message: 'Password must be less than 40 characters'
              }
            })}
            placeholder="New Password"
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div className="edit">
          <h3 className="edit-title">Avatar image (URL)</h3>
          <input
            type="text"
            name="image"
            className={`edit-input ${errors.image ? 'error' : ''}`}
            {...register('image', {
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: 'Please provide a valid URL'
              }
            })}
            placeholder="Avatar image URL"
          />
          {errors.image && <span className="error">{errors.image.message}</span>}
        </div>

        <button className="edit-btn" type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;

