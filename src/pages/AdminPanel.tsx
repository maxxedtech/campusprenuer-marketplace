import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package } from "lucide-react";
import AdminTools from "@/components/admin/AdminTools";

export default function AdminPanel() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage users, products, and demo data</p>
      </div>

      <Tabs defaultValue="tools">
        <TabsList className="mb-6">
          <TabsTrigger value="tools" className="gap-2">
            <Users className="w-4 h-4" /> Admin Tools
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Package className="w-4 h-4" /> About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <AdminTools />
        </TabsContent>

        <TabsContent value="about">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              This admin panel is currently demo-only (LocalStorage). When you add a backend later,
              we’ll replace AdminTools with real API calls.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
