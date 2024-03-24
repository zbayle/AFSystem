import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/Auth_comp';

function LoginBox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Only need login from AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-box">
      <form onSubmit={handleSubmit}> 
        <label>
          Username:
          <input type="text" name="username" required onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" name="password" required onChange={e => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default LoginBox;