import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './SignUp.scss';

const SignUp = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://blog-platform.kata.academy/api/users', { user: data });
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('username', response.data.user.username);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='signUp'>
      <form className="form_signUp" onSubmit={handleSubmit(onSubmit)}>
        <h2 className='title_sign'>Sign Up</h2>
        <div className='input'>
          <h1 className='input_title'>Username</h1>
          <input type="text" name="username" className='input_sign'{...register('username', { required: true, minLength: 3, maxLength: 20 })} placeholder="Username" />
          {errors.username && <span className='error'>Username must be 3-20 characters</span>}
        </div>
        <div className='input'>
          <h1 className='input_title'>Email address</h1>
          <input type="email" name="email" autoComplete='email' className='input_sign'{...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email address" />
          {errors.email && <span className='error'>Invalid email</span>}
        </div>
        <div className='input'>
          <h1 className='input_title'>Password</h1>
          <input type="password" name="password" autoComplete='current-password' className='input_sign'{...register('password', { required: true, minLength: 6, maxLength: 40 })} placeholder="Password" />
          {errors.password && <span className='error'>Your password needs to be at least 6 characters.</span>}
        </div>
        <div className='input'>
          <h1 className='input_title'>Repeat Password</h1>
          <input type="password" name="password" autoComplete='current-password' className='input_sign'{...register('repeatPassword', { validate: (value) => value === watch('password') })} placeholder="Repeat Password" />
          {errors.repeatPassword && <span className='error'>Passwords must match</span>}
        </div>
            <label>
              <input type="checkbox" name="checkbox" className="checkbox" {...register('agree', { required: true })} />
              I agree to the processing of my personal information
            </label>
            {errors.agree && <span className='error'>You must agree</span>}

            <button className="submit" type="submit">Create</button>
      </form>
    </div>
    
  );
};

export default SignUp;