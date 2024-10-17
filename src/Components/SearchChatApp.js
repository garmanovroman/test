import React, { useState } from 'react';

const ChatMessage = ({ message, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(message.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#f0f0f0' : '#fff',
        padding: '10px',
        borderBottom: '1px solid #ccc',
      }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: isSelected ? '10px solid #007bff' : '2px solid #ccc',
          marginRight: '10px',
        }}></div>
      <div>{message.text}</div>
    </div>
  );
};

const ChatApp = () => {
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  const messages = [
    { id: 1, text: 'Hello, how are you?' },
    { id: 2, text: 'I am fine, thanks!' },
    { id: 3, text: 'What are you up to?' },
    { id: 4, text: 'I am learning React!' },
  ];

  const handleSelect = (id) => {
    setSelectedMessageIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  return (
    <div>
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isSelected={selectedMessageIds.includes(message.id)}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default ChatApp;
