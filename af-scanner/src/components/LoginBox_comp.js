import React, { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react';
import { AuthContext } from '../components/Auth_comp';

function LoginBox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fobKey, setFobKey] = useState('');
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const { login, fobLogin, isAuthenticated } = useContext(AuthContext);
  const fobInputRef = useRef(null);

  const handleFobSubmit = async (event) => {
    event.preventDefault();

    try {
      await fobLogin(fobKey);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFobKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleFobSubmit(event);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      if (!isAuthenticated && fobInputRef.current instanceof HTMLElement) {
        fobInputRef.current.focus();
        console.log("focus on fob input");
      }
    };
  
    window.addEventListener('focus', handleFocus);
    document.addEventListener('click', handleFocus);
  
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('click', handleFocus);
    };
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      // Focus the FOB input field when the user is not logged in
      fobInputRef.current.focus();
      console.log("focus on fob input")
    }
  }, [isAuthenticated]);

  return (
    <div className="login-box">
      <form onSubmit={handleFobSubmit}> 
        <label>
          <input 
            type="text" 
            onChange={e => setFobKey(e.target.value)}
            onKeyDown={handleFobKeyPress}
            ref={fobInputRef}
            className="hidden-input"
          />
        </label>
        <input type="submit" className="hidden-submit" />
      </form>
      {isLoginFormVisible && (
      <form onSubmit={handleLoginSubmit}>
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
      )}
    </div>
  );
}

export default LoginBox;