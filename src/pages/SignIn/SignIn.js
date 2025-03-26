import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './SignIn.scss';

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log("Submitting login data:", data);
    try {
      const response = await axios.post('https://blog-platform.kata.academy/api/users/login', { user: data });
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('username', response.data.user.username);
      window.location.href = '/';
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className='signIn'>
      <form className="form_signIn" onSubmit={handleSubmit(onSubmit)}>
            <h2 className='title_sign'>Sign In</h2>
            <div className='input'>
              <h1 className='input_title'>Email address</h1>
              <input type="email" name="email" autoComplete='email' className='input_sign'{...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email address" />
              {errors.email && <span className='error'>Invalid email</span>}
            </div>
            <div className='input'>
            <h1 className='input_title'>Password</h1>
              <input type="password" name="password" autoComplete='current-password' className='input_sign'{...register('password', { required: true })} placeholder="Password" />
              {errors.password && <span className='error'>Password is required</span>}
            </div>
            <button className="submit" type="submit">Login</button>
          </form>
    </div>
  );
};

export default SignIn;