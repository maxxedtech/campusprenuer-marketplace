const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {year} CampusPreneur. All rights reserved.</p>
          <p>Powered by Maxxedtechltd</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
