import PropTypes from 'prop-types';

const TerminalPrompt = ({ username, port, currentPath }) => (
    <div className="prompt">
        {username}@{port} {currentPath.split('/').pop()} $
    </div>
);

TerminalPrompt.propTypes = {
    username: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    currentPath: PropTypes.string.isRequired
};
  
export default TerminalPrompt;
