"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import {
  Store, Search, Download, Star, Filter, Package, Check, X, Loader2,
  ChevronLeft, ChevronRight, Grid3X3, Tag,
} from "lucide-react";

interface MarketplaceItem {
  id: number;
  type: string;
  name: string;
  version: string;
  author?: string;
  publisher?: string;
  iconUrl?: string;
  config: Record<string, unknown>;
  verified: boolean;
  published: boolean;
  installCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  categories?: string[];
  tags?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  items: MarketplaceItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CategoryInfo {
  name: string;
  count: number;
}

interface InstalledInfo {
  id: number;
  listingId: number;
  listing?: MarketplaceItem;
  createdAt: string;
  active: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  app: "📱", connector: "🔌", theme: "🎨", "workflow-pack": "⚡", extension: "🧩",
};

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "app", label: "App" },
  { value: "connector", label: "Connector" },
  { value: "theme", label: "Theme" },
  { value: "workflow-pack", label: "Workflow Pack" },
  { value: "extension", label: "Extension" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "top-rated", label: "Top Rated" },
  { value: "recently-updated", label: "Recently Updated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name" },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

function IconPlaceholder({ name, size = 48 }: { name: string; size?: number }) {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
  ];
  const colorIdx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div
      className={`${colors[colorIdx]} text-white flex items-center justify-center font-bold rounded-lg shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function MarketplaceCard({ item, installed, installing, onInstall }: {
  item: MarketplaceItem;
  installed: boolean;
  installing: boolean;
  onInstall: (id: number) => void;
}) {
  return (
    <Link
      href={`/admin/marketplace/${item.id}`}
      className="group block rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {item.iconUrl ? (
            <img src={item.iconUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
          ) : (
            <IconPlaceholder name={item.name} size={48} />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{item.name}</h3>
              <Badge variant="secondary" className="text-[10px] leading-none py-0.5">{item.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{item.publisher || item.author || "Unknown"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={item.rating} size={12} />
              <span className="text-[11px] text-muted-foreground">({item.reviewCount})</span>
            </div>
          </div>
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Download size={11} /> {item.installCount.toLocaleString()}
          </span>
          {installed ? (
            <Badge variant="success" className="text-[10px] flex items-center gap-1 py-0.5">
              <Check size={10} /> Installed
            </Badge>
          ) : (
            <Button
              size="sm"
              className="h-7 text-xs px-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.preventDefault(); onInstall(item.id); }}
              disabled={installing}
            >
              {installing ? <Loader2 size={12} className="animate-spin mr-1" /> : <Download size={12} className="mr-1" />}
              Install
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ item, installed, installing, onInstall }: {
  item: MarketplaceItem;
  installed: boolean;
  installing: boolean;
  onInstall: (id: number) => void;
}) {
  return (
    <Link
      href={`/admin/marketplace/${item.id}`}
      className="group block min-w-[300px] md:min-w-[360px] rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          {item.iconUrl ? (
            <img src={item.iconUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
          ) : (
            <IconPlaceholder name={item.name} size={64} />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.publisher || item.author || "Unknown"}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={item.rating} size={14} />
              <span className="text-xs text-muted-foreground">{item.rating.toFixed(1)} ({item.reviewCount})</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Download size={12} /> {item.installCount.toLocaleString()}</span>
              {item.verified && <span className="flex items-center gap-1 text-emerald-600">Verified</span>}
            </div>
          </div>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
          {item.categories?.slice(0, 2).map((c) => (
            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
          ))}
          <div className="flex-1" />
          {installed ? (
            <Badge variant="success" className="text-[10px] flex items-center gap-1">
              <Check size={12} /> Installed
            </Badge>
          ) : (
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={(e) => { e.preventDefault(); onInstall(item.id); }}
              disabled={installing}
            >
              {installing ? <Loader2 size={12} className="animate-spin mr-1" /> : <Download size={12} className="mr-1" />}
              Install
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [featured, setFeatured] = useState<MarketplaceItem[]>([]);
  const [installed, setInstalled] = useState<InstalledInfo[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [installing, setInstalling] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const installedIds = useMemo(() => new Set(installed.map((i) => i.listingId)), [installed]);
  const installingIds = installing !== null ? new Set([installing]) : new Set();

  useEffect(() => {
    loadInstalled();
    loadCategories();
    loadFeatured();
  }, []);

  useEffect(() => {
    loadItems();
  }, [search, typeFilter, categoryFilter, sortBy, page]);

  async function loadFeatured() {
    setFeaturedLoading(true);
    try {
      const res = await fetch("/api/admin/marketplace/featured");
      if (res.ok) setFeatured(await res.json());
    } catch {} finally { setFeaturedLoading(false); }
  }

  async function loadCategories() {
    try {
      const res = await fetch("/api/admin/marketplace/categories");
      if (res.ok) setCategories(await res.json());
    } catch {}
  }

  async function loadItems() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      params.set("sort", sortBy);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/marketplace?${params}`);
      if (res.ok) {
        const data: PaginatedResponse = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch {} finally { setLoading(false); }
  }

  async function loadInstalled() {
    try {
      const res = await fetch("/api/admin/installed");
      if (res.ok) {
        const data = await res.json();
        setInstalled(Array.isArray(data) ? data : []);
      }
    } catch {}
  }

  async function install(id: number) {
    setInstalling(id);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}/install`, { method: "POST" });
      if (res.ok) {
        toast.success("Installed successfully");
        await loadInstalled();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to install");
      }
    } catch { toast.error("Failed to install"); } finally { setInstalling(null); }
  }

  async function uninstall(item: InstalledInfo) {
    setInstalling(item.listingId);
    try {
      const res = await fetch(`/api/admin/installed?id=${item.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Uninstalled");
        setInstalled((prev) => prev.filter((i) => i.id !== item.id));
      } else toast.error("Failed to uninstall");
    } catch { toast.error("Failed to uninstall"); } finally { setInstalling(null); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const tabs = [
    { id: "browse", label: "Browse", icon: Store },
    { id: "installed", label: "Installed", icon: Package },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Discover and install apps, connectors, themes, and more</p>
          </div>
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-8"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${
                  activeTab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "browse" ? (
          <div className="flex gap-6">
            <aside className="hidden lg:block w-56 shrink-0 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Filter className="inline h-3 w-3 mr-1" /> Categories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setCategoryFilter("all"); setPage(1); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
                      categoryFilter === "all" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <span>All Categories</span>
                    <Badge variant="secondary" className="text-[10px]">{total}</Badge>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => { setCategoryFilter(cat.name); setPage(1); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
                        categoryFilter === cat.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{cat.count}</Badge>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Tag className="inline h-3 w-3 mr-1" /> Types
                </h4>
                <div className="space-y-1">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setTypeFilter(opt.value); setPage(1); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        typeFilter === opt.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span>{TYPE_ICONS[opt.value] || "📦"}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Grid3X3 className="inline h-3 w-3 mr-1" /> Sort By
                </h4>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setPage(1); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        sortBy === opt.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0 space-y-6">
              {featured.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" /> Featured
                  </h2>
                  {featuredLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin">
                      {featured.map((item) => (
                        <div key={item.id} className="snap-start shrink-0">
                          <FeaturedCard
                            item={item}
                            installed={installedIds.has(item.id)}
                            installing={installingIds.has(item.id)}
                            onInstall={install}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">All Listings</h2>
                  <div className="flex items-center gap-2 lg:hidden">
                    <select
                      className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm"
                      value={typeFilter}
                      onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <select
                      className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm"
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-sm text-muted-foreground">
                    <Package className="h-10 w-10 mb-2 opacity-40" />
                    <p>No items found</p>
                    {(search || typeFilter !== "all" || categoryFilter !== "all") && (
                      <Button variant="link" size="sm" onClick={() => { setSearch(""); setSearchInput(""); setTypeFilter("all"); setCategoryFilter("all"); setPage(1); }}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {items.map((item) => (
                        <MarketplaceCard
                          key={item.id}
                          item={item}
                          installed={installedIds.has(item.id)}
                          installing={installingIds.has(item.id)}
                          onInstall={install}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                          .map((p, idx, arr) => (
                            <span key={p} className="flex items-center">
                              {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                              <Button
                                variant={p === page ? "default" : "outline"}
                                size="sm"
                                className="min-w-[32px]"
                                onClick={() => setPage(p)}
                              >
                                {p}
                              </Button>
                            </span>
                          ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        ) : (
          <div>
            {installed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-sm text-muted-foreground">
                <Package className="h-10 w-10 mb-2 opacity-40" />
                <p>Nothing installed yet</p>
                <Button variant="link" size="sm" onClick={() => setActiveTab("browse")}>
                  Browse the marketplace
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Version</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Installed</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {installed.map((item) => {
                        const listing = item.listing;
                        if (!listing) return null;
                        return (
                          <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <Link href={`/admin/marketplace/${listing.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                {listing.iconUrl ? (
                                  <img src={listing.iconUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                                ) : (
                                  <IconPlaceholder name={listing.name} size={36} />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{listing.name}</p>
                                  <p className="text-xs text-muted-foreground">{listing.publisher || listing.author || "Unknown"}</p>
                                </div>
                              </Link>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Badge variant="secondary" className="text-[10px]">{listing.type}</Badge>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">v{listing.version}</td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => uninstall(item)}
                                disabled={installingIds.has(item.listingId)}
                              >
                                {installingIds.has(item.listingId) ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <X className="h-3 w-3 mr-1" />
                                )}
                                Uninstall
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
