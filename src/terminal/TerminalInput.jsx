import PropTypes from 'prop-types';

const TerminalInput = ({ inputRef, inputValue, setInputValue, handleCommandInput, handleKeyDown }) => (
    <input
      ref={inputRef}
      type="text"
      className="command-input"
      value={inputValue}
      autoFocus
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleCommandInput(inputValue);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          handleKeyDown(e);
        }
      }}
    />
);

TerminalInput.propTypes = {
    inputRef: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired,
    setInputValue: PropTypes.func.isRequired,
    handleCommandInput: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired
  };
  
export default TerminalInput;  