import PropTypes from 'prop-types';

const TerminalOutput = ({ commandHistory }) => (
    <div className="output">
      {commandHistory.map(({ promptline, command, output }, index) => (
        <div key={index}>
          <div>{`${promptline} $ ${command}`}</div>
          <pre>{output}</pre>
        </div>
      ))}
    </div>
);

TerminalOutput.propTypes = {
    commandHistory: PropTypes.arrayOf(
      PropTypes.shape({
        promptline: PropTypes.string.isRequired,
        command: PropTypes.string.isRequired,
        output: PropTypes.string.isRequired
      })
    ).isRequired
};

// localStorage.clear();

export default TerminalOutput;  