import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  ShieldCheck,
  TrendingUp,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Edit,
  Store,
  Clock,
  Eye,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  SlidersHorizontal,
  Mail,
  Phone,
  Building,
  RefreshCw,
  BarChart3,
  Lock,
  AlertTriangle,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import {
  getUsers,
  deleteUser,
  updateUser,
  setUserVerification,
  type UserRecord,
  type VerificationStatus,
  type Role,
} from "@/utils/userStorage";
import { getProducts, deleteProductAsAdmin } from "@/lib/products";
import { readOrders, updateOrderStatus, type Order } from "@/lib/ordersStorage";
import type { LocalProduct } from "@/types/local";
import { toast } from "sonner";

type AdminTab = "overview" | "analytics" | "users" | "products" | "orders";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userVerificationFilter, setUserVerificationFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("customer");
  const [editPhone, setEditPhone] = useState("");
  const [editCampus, setEditCampus] = useState("");

  // Security: Delete User Password Confirmation Modal
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const current = await getCurrentUser();
      if (!current || current.role !== "admin") {
        toast.error("Access restricted to Admins only.");
        navigate("/login");
        return;
      }
      setCurrentUser(current);
      setUsers(getUsers());
      setProducts(await getProducts());
      setOrders(readOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    window.addEventListener("campus-users-change", loadAll);
    window.addEventListener("campus-products-change", loadAll);
    window.addEventListener("campus-orders-change", loadAll);
    return () => {
      window.removeEventListener("campus-users-change", loadAll);
      window.removeEventListener("campus-products-change", loadAll);
      window.removeEventListener("campus-orders-change", loadAll);
    };
  }, []);

  // Admin Actions
  const handleVerify = (id: string, name: string) => {
    setUserVerification(id, "verified");
    toast.success(`Verified badge awarded to ${name}! 🛡️`);
    loadAll();
  };

  const handleRevokeVerification = (id: string, name: string) => {
    setUserVerification(id, "unverified");
    toast.info(`Verification revoked for ${name}.`);
    loadAll();
  };

  // Open password modal before deleting a user
  const initiateUserDelete = (user: UserRecord) => {
    if (user.role === "admin") {
      toast.error("Admin accounts cannot be deleted.");
      return;
    }
    setUserToDelete(user);
    setAdminPasswordInput("");
    setDeleteError("");
  };

  // Confirm password and delete
  const confirmDeleteUser = () => {
    if (!userToDelete || !currentUser) return;

    if (adminPasswordInput !== currentUser.password) {
      setDeleteError("Incorrect admin password. Deletion cancelled.");
      return;
    }

    try {
      deleteUser(userToDelete.id);
      toast.success(`Account for "${userToDelete.name}" permanently deleted.`);
      setUserToDelete(null);
      setAdminPasswordInput("");
      setDeleteError("");
      loadAll();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete user");
    }
  };

  const openEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditPhone(user.phone || "");
    setEditCampus(user.campus || "");
  };

  const handleSaveEditUser = () => {
    if (!editingUser) return;
    try {
      updateUser(editingUser.id, {
        name: editName.trim() || editingUser.name,
        role: editRole,
        phone: editPhone.trim(),
        campus: editCampus.trim(),
      });
      toast.success("User details updated! ✅");
      setEditingUser(null);
      loadAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    }
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (!confirm(`Delete product listing "${title}" as admin?`)) return;
    deleteProductAsAdmin(id);
    toast.success(`Listing "${title}" removed.`);
    loadAll();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      loadAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to update order");
    }
  };

  // Metrics Calculations
  const totalUsersCount = users.length;
  const verifiedUsersCount = users.filter((u) => u.verification_status === "verified").length;
  const pendingVerificationsCount = users.filter((u) => u.verification_status === "pending").length;
  const totalProductsCount = products.length;
  const totalPlatformViews = products.reduce((s, p) => s + (p.views_count || 0), 0);
  const totalPlatformCartAdds = products.reduce((s, p) => s + (p.cart_add_count || 0), 0);
  const totalPlatformVolume = orders.reduce((s, o) => s + o.total, 0);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.campus && u.campus.toLowerCase().includes(q));

    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchesVerif =
      userVerificationFilter === "all" ||
      (u.verification_status || "unverified") === userVerificationFilter;

    return matchesSearch && matchesRole && matchesVerif;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.owner_name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  // --- CHART DATA GENERATION ---
  // 1. Roles Demographics Chart Data
  const roleDistributionData = useMemo(() => {
    const buyers = users.filter((u) => u.role === "customer").length;
    const sellers = users.filter((u) => u.role === "entrepreneur").length;
    const admins = users.filter((u) => u.role === "admin").length;
    return [
      { name: "Buyers (Customers)", value: buyers, color: "#3B82F6" },
      { name: "Sellers (Entrepreneurs)", value: sellers, color: "#F5A623" },
      { name: "Administrators", value: admins, color: "#1E2D4E" },
    ];
  }, [users]);

  // 2. Product Engagement Performance Bar Chart Data
  const productEngagementData = useMemo(() => {
    return products.slice(0, 6).map((p) => ({
      name: p.title.length > 12 ? p.title.slice(0, 12) + "..." : p.title,
      views: p.views_count || 0,
      cartAdds: p.cart_add_count || 0,
      sales: p.sales_count || 0,
    }));
  }, [products]);

  // 3. Category Distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const cat = p.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  // 4. Platform Activity Trend
  const activityTrendData = [
    { month: "Week 1", volume: Math.round(totalPlatformVolume * 0.15), orders: Math.max(1, Math.round(orders.length * 0.2)) },
    { month: "Week 2", volume: Math.round(totalPlatformVolume * 0.35), orders: Math.max(2, Math.round(orders.length * 0.4)) },
    { month: "Week 3", volume: Math.round(totalPlatformVolume * 0.65), orders: Math.max(3, Math.round(orders.length * 0.7)) },
    { month: "Current", volume: totalPlatformVolume, orders: orders.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-5 flex flex-col justify-between shrink-0 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-orange text-white flex items-center justify-center font-bold shadow-md shadow-brand-orange/30">
              👑
            </div>
            <div>
              <h2 className="font-extrabold text-sm leading-tight text-white">
                Admin Control
              </h2>
              <p className="text-[10px] text-gray-400">Campuspreneur Master Suite</p>
            </div>
          </div>

          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all text-left ${
                activeTab === "overview"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Overview &amp; Stats
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all text-left ${
                activeTab === "analytics"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics &amp; Graphs
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all text-left ${
                activeTab === "users"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                Users &amp; Verification
              </span>
              {pendingVerificationsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingVerificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all text-left ${
                activeTab === "products"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Package className="w-4 h-4" />
              Product Moderation ({products.length})
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all text-left ${
                activeTab === "orders"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders &amp; Trades ({orders.length})
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/marketplace")}
            className="w-full justify-start text-xs text-gray-300 hover:text-white hover:bg-slate-800 gap-2 h-10 rounded-xl"
          >
            <Store className="w-4 h-4" />
            Open Marketplace
          </Button>

          <Button
            variant="ghost"
            onClick={async () => {
              await logoutUser();
              navigate("/login");
            }}
            className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 gap-2 h-10 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Admin Logout
          </Button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full space-y-8">

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  Admin Command Center
                </h1>
                <p className="text-xs text-muted-foreground">
                  Overview of community accounts, active listings, and verification queue.
                </p>
              </div>
              <Button onClick={loadAll} variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase">Total Users</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-3xl font-black text-brand-navy">{totalUsersCount}</p>
                <p className="text-[11px] text-muted-foreground">{verifiedUsersCount} verified badges awarded</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase">Pending Verifications</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-3xl font-black text-amber-600">{pendingVerificationsCount}</p>
                <button
                  onClick={() => {
                    setUserVerificationFilter("pending");
                    setActiveTab("users");
                  }}
                  className="text-[11px] text-brand-orange font-semibold hover:underline"
                >
                  Review pending queue →
                </button>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase">Active Products</span>
                  <Package className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-3xl font-black text-brand-navy">{totalProductsCount}</p>
                <p className="text-[11px] text-muted-foreground">{totalPlatformViews} total views logged</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase">Platform Volume</span>
                  <span className="font-bold text-xs">₦</span>
                </div>
                <p className="text-3xl font-black text-brand-orange">
                  ₦{totalPlatformVolume.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">{orders.length} orders recorded</p>
              </div>
            </div>

            {/* PENDING VERIFICATION ACTION CENTER */}
            {pendingVerificationsCount > 0 && (
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-base text-brand-navy">
                    Pending Verification Requests ({pendingVerificationsCount})
                  </h3>
                </div>

                <div className="divide-y divide-border">
                  {users
                    .filter((u) => u.verification_status === "pending")
                    .map((u) => (
                      <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-sm text-brand-navy flex items-center gap-1.5">
                            {u.name} <span className="text-xs text-gray-500 capitalize">({u.role})</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Location: {u.campus || u.address || "N/A"} • Phone: {u.phone || "N/A"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleVerify(u.id, u.name)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl h-8 px-3"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Grant Badge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevokeVerification(u.id, u.name)}
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs rounded-xl h-8 px-3"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANALYTICS & CHARTS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Platform Analytics &amp; Visual Intelligence
              </h1>
              <p className="text-xs text-muted-foreground">
                Interactive charts representing platform growth, funnel conversion, and category distribution.
              </p>
            </div>

            {/* ROW 1: USER DEMOGRAPHICS & REVENUE TREND */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Revenue & Activity Trend */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-brand-navy">Platform Trading Volume Trend</h3>
                    <p className="text-xs text-muted-foreground">Total order sales (₦) across recent periods</p>
                  </div>
                  <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full">
                    ₦{totalPlatformVolume.toLocaleString()} Total
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityTrendData}>
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F5A623" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip formatter={(val: any) => [`₦${Number(val).toLocaleString()}`, "Trade Volume"]} />
                      <Area type="monotone" dataKey="volume" stroke="#F5A623" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Roles Pie Chart */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-brand-navy">User Community Split</h3>
                  <p className="text-xs text-muted-foreground">Role breakdown of registered members</p>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {roleDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1 text-xs">
                  {roleDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <strong className="text-brand-navy">{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 2: PRODUCT FUNNEL (VIEWS VS CARTS VS SALES) */}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-brand-navy">Top Product Engagement Comparison</h3>
                  <p className="text-xs text-muted-foreground">Views vs Cart Additions vs Completed Sales</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" name="Views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cartAdds" name="In Cart" fill="#F5A623" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sales" name="Units Sold" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Inventory Breakdown */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-brand-navy">Category Distribution</h3>
                  <p className="text-xs text-muted-foreground">Active listings by marketplace category</p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {categoryData.length === 0 ? (
                    <p className="text-xs text-gray-400">No items categorized yet.</p>
                  ) : (
                    categoryData.map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-brand-navy">{cat.name}</span>
                          <span className="text-gray-500 font-bold">{cat.count} listings</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-brand-navy h-full rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round((cat.count / Math.max(1, totalProductsCount)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USERS & VERIFICATION */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-brand-navy">
                  User Management &amp; Verification ({filteredUsers.length})
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage accounts, grant verification badges, edit details, or remove users.
                </p>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search user name, email, or area..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers (Buyers)</option>
                  <option value="entrepreneur">Entrepreneurs (Sellers)</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={userVerificationFilter}
                  onChange={(e) => setUserVerificationFilter(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified Badge</option>
                  <option value="pending">Pending Review</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-gray-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Location &amp; Contact</th>
                      <th className="p-4">Verification</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-brand-navy flex items-center gap-1.5">
                            {u.name}
                            {u.verification_status === "verified" && (
                              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                            )}
                          </div>
                          <div className="text-gray-400 text-[11px]">{u.email}</div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "entrepreneur"
                              ? "bg-orange-100 text-brand-orange"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="p-4 text-gray-600">
                          <div>{u.campus || u.address || "No address set"}</div>
                          <div className="text-gray-400 text-[11px]">{u.phone || "No phone"}</div>
                        </td>

                        <td className="p-4">
                          {u.verification_status === "verified" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-[10px]">
                              <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                          )}
                          {u.verification_status === "pending" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {(!u.verification_status || u.verification_status === "unverified") && (
                            <span className="text-gray-400 font-medium">Unverified</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.verification_status === "verified" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevokeVerification(u.id, u.name)}
                                className="h-7 text-[11px] rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
                              >
                                Revoke Badge
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleVerify(u.id, u.name)}
                                className="h-7 text-[11px] rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                              >
                                Grant Badge
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(u)}
                              className="h-7 w-7 p-0 rounded-lg text-brand-navy hover:bg-muted"
                              title="Edit user"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>

                            {u.role !== "admin" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => initiateUserDelete(u)}
                                className="h-7 w-7 p-0 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT MODERATION */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-brand-navy">
                  Marketplace Moderation ({filteredProducts.length})
                </h1>
                <p className="text-xs text-muted-foreground">
                  Review listings, price tags in Naira, and take down inappropriate items.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search listings or sellers..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-border p-4 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="h-36 bg-muted rounded-2xl overflow-hidden relative flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-8 h-8 text-gray-400" />
                      )}
                      {p.category && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-md bg-brand-navy text-white">
                          {p.category}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-brand-navy line-clamp-1">{p.title}</h4>
                    <p className="text-base font-extrabold text-brand-orange">
                      ₦{Number(p.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Seller: <strong>{p.owner_name}</strong></p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                      <span>👁️ {p.views_count || 0} views</span>
                      <span>🛒 {p.cart_add_count || 0} in cart</span>
                      <span>📦 {p.sales_count || 0} sold</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="w-full text-xs h-8 rounded-xl"
                    >
                      View Live
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(p.id, p.title)}
                      className="w-full text-xs h-8 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-brand-navy">
              Campus &amp; Town Orders ({orders.length})
            </h1>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-border">
                <p className="text-sm text-gray-500">No customer orders logged yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-3xl p-5 border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-navy">
                          Order #{o.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          o.status === "fulfilled"
                            ? "bg-green-100 text-green-700"
                            : o.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Buyer: <strong>{o.customerName}</strong> ({o.customerPhone || "No phone"}) • {o.items.length} items
                      </p>
                      <p className="text-xs text-gray-400">
                        Address: {o.customerAddress || "Standard Pickup Location"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-base font-black text-brand-orange">
                        ₦{o.total.toLocaleString()}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateOrderStatus(o.id, "confirmed")}
                          className="text-xs h-8 rounded-xl"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(o.id, "fulfilled")}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 rounded-xl"
                        >
                          Fulfilled
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-brand-navy">
              Edit User: {editingUser.name}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Full Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-10 rounded-xl" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                >
                  <option value="customer">Customer (Buyer)</option>
                  <option value="entrepreneur">Entrepreneur (Seller)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Phone</label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-10 rounded-xl" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Location / Town / Campus</label>
                <Input value={editCampus} onChange={(e) => setEditCampus(e.target.value)} className="h-10 rounded-xl" />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingUser(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleSaveEditUser} className="bg-brand-navy text-white rounded-xl">
                Save Updates
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY: DELETE USER PASSWORD CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 border-2 border-red-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-xl bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-brand-navy">
                Confirm Admin Deletion
              </h2>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              You are about to permanently delete user account <strong className="text-brand-navy">{userToDelete.name}</strong> ({userToDelete.email}). This action cannot be undone.
            </p>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-brand-orange" />
                Enter Your Admin Password to Confirm:
              </label>
              <Input
                type="password"
                placeholder="Admin password"
                value={adminPasswordInput}
                onChange={(e) => {
                  setAdminPasswordInput(e.target.value);
                  setDeleteError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && confirmDeleteUser()}
                className="h-11 rounded-xl"
                autoFocus
              />
              {deleteError && (
                <p className="text-xs text-red-600 font-bold">{deleteError}</p>
              )}
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setUserToDelete(null);
                  setAdminPasswordInput("");
                  setDeleteError("");
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
              >
                Confirm &amp; Delete User
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
