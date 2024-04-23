import { useState } from 'react';
import PropTypes from 'prop-types';

import './NewChatInterface.css';

const NewChatInterface = ({ onClose }) => {
  const [chatName, setChatName] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(500);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission and start the new chat
    console.log('Chat Name:', chatName);
    console.log('Selected Model:', selectedModel);
    console.log('System Prompt:', systemPrompt);
    console.log('Temperature:', temperature);
    console.log('Max Tokens:', maxTokens);
  };

  return (
    <div className="new-chat-interface">
      <div className="new-chat-header">
        <h2 className="new-chat-header-texr">New Chat</h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <form className="new-chat-form" onSubmit={handleSubmit}>
        <div className="new-chat-form-group" id="chat-name-form-group">
          <label id="chat-name-label" htmlFor="chat-name">Chat name:</label>
          <input
            type="text"
            id="chat-name-input"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </div>
        <div className="new-chat-form-group" id="model-select-form-group">
          <label htmlFor="model-select">Select Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select a model</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            {/* Add more model options */}
          </select>
        </div>
        <div className="new-chat-form-group" id="temperature-form-group">
          <label htmlFor="temperature">Temperature:</label>
          <input
            type="range"
            id="temperature"
            min="0"
            max="1"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
          <span className="temperature-value">{temperature.toFixed(2)}</span>
        </div>
        <div className="new-chat-form-group" id="max-tokens-form-group">
          <label htmlFor="max-tokens">Maximum Tokens:</label>
          <input
            type="text"
            id="max-tokens"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          />
        </div>
        <div className="new-chat-form-group" id="system-prompt-form-group">
          <label htmlFor="system-prompt">System Prompt:</label>
          <textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="start-new-chat-button">
          Start New Chat
        </button>
      </form>
    </div>
  );
};

NewChatInterface.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default NewChatInterface;