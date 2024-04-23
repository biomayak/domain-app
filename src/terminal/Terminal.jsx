import {
  useState,
  useRef,
  useEffect
} from 'react';
import PropTypes from 'prop-types';

import {
  handleMkdirCommand,
  handleListCommand,
  handleCdCommand,
  handleTreeCommand,
  handleRmCommand
} from './terminalUtils';
import './Terminal.css';
import TerminalPrompt from './TerminalPrompt';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';

const Terminal = ({ onOpenNewChat }) => {
  
  const [username] = useState(import.meta.env.VITE_USERNAME); // Set the username
  const [port] = useState(parseInt(import.meta.env.VITE_PORT)); // Set the port
  const [currentPath, setCurrentPath] = useState('home'); // Set the current path
  const [commandHistory, setCommandHistory] = useState([]); // History of entered commands and their outputs
  const [inputValue, setInputValue] = useState(''); // Current input value
  const [inputHistory, setInputHistory] = useState([]); // History of entered commands for hotkeys
  const [inputHistoryIndex, setInputHistoryIndex] = useState(-1); // Track input history index

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Autoscroll on Terminal div overflow
  useEffect(() => {
    inputRef.current.focus();
  
    // Scroll to the bottom of the terminal
    const terminalElement = terminalRef.current;
    if (terminalElement) {
      terminalElement.scrollTop = terminalElement.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleCommandInput = (command) => {
    const [cmd, arg] = command.trim().split(' ');
    const promptline = `${username}@${port} ${currentPath.split('/').pop()}`;
    let output;

    switch (cmd) {
      case 'mkdir':
        try {
          output = handleMkdirCommand(currentPath, arg) + '\n';
        } catch (e) {
          output = 'mkdir: ' + e.message + '\n';
        }
        break;
      case 'rm':
        try {
          output = handleRmCommand(currentPath, arg) + '\n';
        } catch (e) {
          output = 'rm: ' + e.message + '\n';
        }
        break;
      case 'ls':
        try {
          output = handleListCommand(currentPath, arg) + '\n';
        } catch (e) {
          output = 'ls: ' + e.message + '\n';
        }
        break;
      case 'cd':
        try {
          setCurrentPath(handleCdCommand(currentPath, arg));
          output = '';
        } catch (e) {
          output = 'cd: ' + e.message + '\n';
        }
        break;
      case 'tree':
        output = handleTreeCommand(currentPath) + '\n';
        break;
      case 'run':
        if (arg === 'new_chat.sh') {
          onOpenNewChat(); // Call the prop function
          output = 'Opening new chat interface...\n';
        } else {
          output = 'Invalid command: run ' + arg + '\n';
        }
        break;
      case 'clear':
        setCommandHistory([]);
        setInputHistory(prevInputHistory => [command, ...prevInputHistory]);
        setInputValue('');
        return;
      case 'pwd':
        output = currentPath + '\n';
        break;
      case 'help':
        output = ('help command text') // TODO
        break;
      default:
        output = `Command not found: ${cmd}\n`;
    }

    setCommandHistory(prevHistory => [...prevHistory, { promptline, command, output }]);
    setInputValue('');
    setInputHistory(prevInputHistory => [command, ...prevInputHistory]);
    setInputHistoryIndex(-1); // Reset input history index
  };

  const handleKeyDown = (e) => {
    e.preventDefault();
    const newIndex = e.key === 'ArrowUp' ? inputHistoryIndex + 1 : inputHistoryIndex - 1;
    if (newIndex >= 0 && newIndex < inputHistory.length) {
      setInputValue(inputHistory[newIndex]);
      setInputHistoryIndex(newIndex);
    } else {
      setInputValue('');
      setInputHistoryIndex(-1);
    }
  };

  return (
    <div className="terminal" ref={terminalRef}>
      <TerminalOutput commandHistory={commandHistory} />
      <div className="input-line">
        <TerminalPrompt username={username} port={port} currentPath={currentPath} />
        <div className="input-spacer"></div>
        <TerminalInput
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleCommandInput={handleCommandInput}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

Terminal.propTypes = {
  onOpenNewChat: PropTypes.func.isRequired
}

export default Terminal;