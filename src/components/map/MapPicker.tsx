import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";

interface MapPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapPicker = ({ open, onOpenChange, onLocationSelect, initialLat, initialLng }: MapPickerProps) => {
  const [lat, setLat] = useState(initialLat ?? 0);
  const [lng, setLng] = useState(initialLng ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Select Location
          </DialogTitle>
        </DialogHeader>

        {/* Map placeholder — replace with Google Maps component */}
        <div className="w-full h-64 rounded-xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-2">
          <MapPin className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Google Maps will render here.<br />
            Add your API key to enable map integration.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
        </div>

        <Button
          className="w-full mt-2"
          onClick={() => {
            onLocationSelect(lat, lng);
            onOpenChange(false);
          }}
        >
          Confirm Location
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MapPicker;
