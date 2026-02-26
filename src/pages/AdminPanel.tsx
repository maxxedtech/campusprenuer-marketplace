import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Package, ShieldAlert, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User, Listing } from "@/types";

const AdminPanel = () => {
  const [users] = useState<User[]>([]);
  const [listings] = useState<Listing[]>([]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage users and listings</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" /> Users</TabsTrigger>
          <TabsTrigger value="listings" className="gap-2"><Package className="w-4 h-4" /> Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {users.length === 0 ? (
            <div className="card-soft text-center py-12">
              <Users className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="mt-3 text-sm text-muted-foreground">User data will load from the backend.</p>
            </div>
          ) : (
            <div className="card-soft p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{u.role}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{u.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          Suspend
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="listings">
          {listings.length === 0 ? (
            <div className="card-soft text-center py-12">
              <Package className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="mt-3 text-sm text-muted-foreground">Listing data will load from the backend.</p>
            </div>
          ) : (
            <div className="card-soft p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.title}</TableCell>
                      <TableCell>{l.type}</TableCell>
                      <TableCell>${l.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${l.available ? "bg-mint" : "bg-muted"}`}>
                          {l.available ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Star className="w-3 h-3" />
                          Feature
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
