import { MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">CampusPreneur</span>
          <div className="flex items-center">
  <img
    src="/logo.png"
    alt="CampusPreneur"
    className="h-16 w-auto"
  />
</div> 
        </div>
        <p className="text-sm text-muted-foreground">
          Your campus marketplace — connecting student entrepreneurs..
        </p>
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-semibold text-foreground">Maxxedtechltd</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

