import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type BusinessProfile } from "@/types";
import { MapPin } from "lucide-react";
import MapPicker from "@/components/map/MapPicker";

interface ProfileEditorProps {
  profile: BusinessProfile;
  onChange: (profile: BusinessProfile) => void;
}

const ProfileEditor = ({ profile, onChange }: ProfileEditorProps) => {
  const [mapOpen, setMapOpen] = useState(false);

  const update = (partial: Partial<BusinessProfile>) => onChange({ ...profile, ...partial });

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className="text-xs font-medium text-muted-foreground">Business Name</label>
        <Input value={profile.businessName} onChange={(e) => update({ businessName: e.target.value })} className="mt-1" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Description</label>
        <Textarea value={profile.description} onChange={(e) => update({ description: e.target.value })} rows={3} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Contact</label>
          <Input value={profile.contact} onChange={(e) => update({ contact: e.target.value })} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <Select value={profile.category} onValueChange={(v) => update({ category: v })}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">Location</label>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex-1 px-3 py-2 rounded-lg border border-input bg-muted/50 text-sm text-muted-foreground">
            {profile.latitude && profile.longitude
              ? `${profile.latitude.toFixed(4)}, ${profile.longitude.toFixed(4)}`
              : "No location set"}
          </div>
          <Button variant="outline" size="sm" onClick={() => setMapOpen(true)}>
            <MapPin className="w-4 h-4 mr-1" />
            Pick
          </Button>
        </div>
      </div>

      {/* Map preview placeholder */}
      {profile.latitude && profile.longitude && (
        <div className="w-full h-40 rounded-xl bg-muted border border-border flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Map preview — requires Google Maps API key</p>
        </div>
      )}

      <Button className="w-full">Save Profile</Button>

      <MapPicker
        open={mapOpen}
        onOpenChange={setMapOpen}
        onLocationSelect={(lat, lng) => update({ latitude: lat, longitude: lng })}
        initialLat={profile.latitude ?? undefined}
        initialLng={profile.longitude ?? undefined}
      />
    </div>
  );
};

export default ProfileEditor;
