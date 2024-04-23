import { useState } from 'react';
import Terminal from './terminal/Terminal';
import NewChatInterface from './newChatInterface/NewChatInterface';
import './App.css';

function App() {
  const [showNewChatInterface, setShowNewChatInterface] = useState(false);

  const handleOpenNewChat = () => {
    setShowNewChatInterface(true);
  };

  const handleCloseNewChat = () => {
    setShowNewChatInterface(false);
  };

  return (
    <div className="container">
      {showNewChatInterface ? (
        <NewChatInterface onClose={handleCloseNewChat} />
      ) : (
        <Terminal onOpenNewChat={handleOpenNewChat} />
      )}
    </div>
  );
}

export default App;