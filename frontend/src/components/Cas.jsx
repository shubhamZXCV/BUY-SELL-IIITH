import React from 'react'

const Cas = () => {
    const handleCASLogin = () => {
        const serviceUrl = encodeURIComponent('http://localhost:3000/signup');
        const casLoginUrl = `https://login.iiit.ac.in/cas/login?service=${serviceUrl}`;
        window.location.href = casLoginUrl;
      };
    
      return (
        <div>
          <button onClick={handleCASLogin} className='btn btn-primary w-full'>Login with CAS</button>
        </div>
      );
}

export default Cas
