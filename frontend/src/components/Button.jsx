function Button({ type = 'button', className, onClick, children }) {
  return (
    <button
      type={type}
      className={`button ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
