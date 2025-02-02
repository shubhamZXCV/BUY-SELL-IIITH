import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Messages = () => {
  const { receiverEmail } = useParams(); // Get receiverEmail from URL
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/review/get?receiverEmail=${receiverEmail}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data); // Setting the response as messages
      } catch (err) {
        setError(err.message);
      }
    };

    if (receiverEmail) {
      fetchMessages();
    }
  }, [receiverEmail]); // Re-run effect when receiverEmail changes
  
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (messages.length === 0) {
    return <div>No messages found for {receiverEmail}</div>;
  }

  return (
    <div className="messages-container">
      <h2>Reviews for {receiverEmail}</h2>
      <div className="messages-list">
        {messages.map((messageObj, index) => (
          <div key={index} className="message-item">
            <strong>Sender:</strong> {messageObj.senderEmail}
            <div className="message-content">
              {messageObj.messages.map((message, msgIndex) => (
                <div key={msgIndex} className="message">
                  <p>{message}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
