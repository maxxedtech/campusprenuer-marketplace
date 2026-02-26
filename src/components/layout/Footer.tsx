import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center">

        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="CampusPreneur"
            className="h-10 w-auto"
          />
        </Link>

      </div>
    </footer>
  );
};

export default Footer;
