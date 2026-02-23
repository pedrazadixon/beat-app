export default function PageHeader({ children }) {
  const pageHeaderStyles = {
    display: "flex",
    flexDirection: "column",
    padding: 15,
  };
  return (
    <div id="page-header" className="page-header" style={pageHeaderStyles}>
      {children}
    </div>
  );
}
