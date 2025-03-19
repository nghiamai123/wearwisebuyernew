export default function Container({ children }) {
    return (
      <div style={containerStyle}>
        {children}
      </div>
    );
  }
  
  const containerStyle = {
    maxWidth: "1440px",
    margin: "0 auto",
  };
  