import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Store,
  Package,
  BarChart3,
  Crown,
} from "lucide-react";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import ListingCard from "@/components/dashboard/ListingCard";
import ListingForm from "@/components/dashboard/ListingForm";
import SubscriptionModal from "@/components/common/SubscriptionModal";
import { useAuth } from "@/contexts/AuthContext";
import type { BusinessProfile, Listing } from "@/types";

const API_URL = "https://townketbackend.onrender.com";

const EntrepreneurDashboard = () => {
  const { token } = useAuth();

  const [profile, setProfile] =
    useState<BusinessProfile | null | undefined>(undefined);

  const [listings, setListings] = useState<Listing[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [subOpen, setSubOpen] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${API_URL}/api/business/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData); // can be null or object
        } else {
          setProfile(null);
        }

        const listingsRes = await fetch(`${API_URL}/api/listings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          setListings(listingsData);
        }
      } catch (err) {
        console.error(err);
        setProfile(null);
      }
    };

    fetchData();
  }, [token]);

  // ================= SAVE PROFILE =================
  const handleSaveProfile = async (updatedProfile: BusinessProfile) => {
    try {
      const res = await fetch(`${API_URL}/api/business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD LISTING =================
  const handleAddListing = async (
    data: Omit<Listing, "id" | "createdAt">
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newListing = await res.json();
        setListings((prev) => [...prev, newListing]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOADING STATE =================
  if (profile === undefined) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  // ================= NO BUSINESS YET =================
  if (profile === null) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold mb-4">
          Create Your Business Profile
        </h2>

        <ProfileEditor
          profile={null}
          onChange={setProfile}
          onSave={handleSaveProfile}
        />
      </div>
    );
  }

  // ================= MAIN DASHBOARD =================
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your business
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setSubOpen(true)}
        >
          <Crown className="w-4 h-4" />
          Upgrade
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <Store className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="listings">
            <Package className="w-4 h-4" /> Listings
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditor
            profile={profile}
            onChange={setProfile}
            onSave={handleSaveProfile}
          />
        </TabsContent>

        <TabsContent value="listings">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold">Your Listings</h2>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4" /> Add Listing
            </Button>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-10">
              No listings yet.
            </div>
          ) : (
            listings.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                editable
                onDelete={handleDeleteListing}
              />
            ))
          )}

          <ListingForm
            open={formOpen}
            onOpenChange={setFormOpen}
            onSubmit={handleAddListing}
            initial={editingListing}
          />
        </TabsContent>

        <TabsContent value="analytics">
          Analytics will show when backend tracking is added.
        </TabsContent>
      </Tabs>

      <SubscriptionModal open={subOpen} onOpenChange={setSubOpen} />
    </div>
  );
};

export default EntrepreneurDashboard;
