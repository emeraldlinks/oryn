"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, MessageSquare, Package, Check, X,
  Loader2, Clock, TrendingUp, Verified, Tag, Globe, BookOpen, Code2,
  Camera, Star, Download,
} from "lucide-react";

interface MarketplaceListing {
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

interface ConfigData {
  readme?: string;
  screenshots?: string[];
  changelog?: { version: string; date: string; notes: string }[];
  homepage?: string;
  repository?: string;
  license?: string;
}

interface Review {
  id: number;
  listingId: number;
  userId: number;
  rating: number;
  content?: string;
  createdAt: string;
  user?: { id: number; name?: string; email?: string; image?: string };
}

interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

interface InstalledInfo {
  id: number;
  listingId: number;
  createdAt: string;
}

function StarRatingInteractive({ rating, onChange, size = 20 }: {
  rating: number;
  onChange: (r: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} className="transition-transform hover:scale-110">
          <Star
            size={size}
            className={s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-400/50"}
          />
        </button>
      ))}
    </div>
  );
}

function StarRatingDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
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

function IconPlaceholder({ name, size = 80 }: { name: string; size?: number }) {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
  ];
  const colorIdx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div
      className={`${colors[colorIdx]} text-white flex items-center justify-center font-bold rounded-2xl shrink-0 shadow-lg`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function MarketplaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [installed, setInstalled] = useState<InstalledInfo | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const config = useMemo(() => listing?.config as ConfigData | undefined, [listing?.config]);

  useEffect(() => {
    if (id) {
      loadData();
      loadInstalled();
      loadReviews();
    }
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}`);
      if (res.ok) setListing(await res.json());
      else toast.error("Failed to load listing");
    } catch { toast.error("Failed to load listing"); } finally { setLoading(false); }
  }

  async function loadInstalled() {
    try {
      const res = await fetch("/api/admin/installed");
      if (res.ok) {
        const items: InstalledInfo[] = await res.json();
        const found = items.find((i) => i.listingId === Number(id));
        setInstalled(found || null);
      }
    } catch {}
  }

  async function loadReviews() {
    try {
      const res = await fetch(`/api/admin/marketplace/${id}/reviews`);
      if (res.ok) setReviewsData(await res.json());
    } catch {}
  }

  async function handleInstall() {
    setInstalling(true);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}/install`, { method: "POST" });
      if (res.ok) {
        toast.success("Installed successfully");
        await Promise.all([loadInstalled(), loadData()]);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to install");
      }
    } catch { toast.error("Failed to install"); } finally { setInstalling(false); }
  }

  async function handleUninstall() {
    if (!installed) return;
    setInstalling(true);
    try {
      const res = await fetch(`/api/admin/installed?id=${installed.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Uninstalled");
        setInstalled(null);
      } else toast.error("Failed to uninstall");
    } catch { toast.error("Failed to uninstall"); } finally { setInstalling(false); }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewContent.trim()) { toast.error("Please write a review"); return; }
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, content: reviewContent }),
      });
      if (res.ok) {
        toast.success("Review submitted");
        setReviewContent("");
        setReviewRating(5);
        await loadReviews();
        await loadData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to submit review");
      }
    } catch { toast.error("Failed to submit review"); } finally { setSubmittingReview(false); }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (!listing) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <Package className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">Listing not found</p>
          <Button variant="link" onClick={() => router.push("/admin/marketplace")}>Back to marketplace</Button>
        </div>
      </DashboardShell>
    );
  }

  const tabs = [
    { id: "details", label: "Details", icon: BookOpen },
    { id: "versions", label: "Version History", icon: Clock },
    { id: "reviews", label: "Ratings & Reviews", icon: MessageSquare },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/marketplace")} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Button>

        <div className="rounded-xl border bg-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {listing.iconUrl ? (
              <img src={listing.iconUrl} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-lg" />
            ) : (
              <IconPlaceholder name={listing.name} size={80} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{listing.name}</h1>
                    {listing.verified && (
                      <Badge variant="success" className="flex items-center gap-1 text-xs">
                        <Verified className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">{listing.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {listing.publisher || listing.author || "Unknown"} · v{listing.version}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {installed ? (
                    <>
                      <Badge variant="success" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                        <Check className="h-4 w-4" /> Installed
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleUninstall} disabled={installing}>
                        {installing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" onClick={handleInstall} disabled={installing}>
                      {installing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Install
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <StarRatingDisplay rating={listing.rating} size={16} />
                  <span className="font-medium">{listing.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
                </div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Download className="h-4 w-4" /> {listing.installCount.toLocaleString()} installs
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> Updated {new Date(listing.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {(listing.categories && listing.categories.length > 0) || (listing.tags && listing.tags.length > 0) ? (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {listing.categories?.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {c}
                    </Badge>
                  ))}
                  {listing.tags?.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
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

        {activeTab === "details" && (
          <div className="space-y-6">
            {listing.description && (
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {config?.readme && (
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> README
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{config.readme}</div>
              </div>
            )}

            {config?.screenshots && config.screenshots.length > 0 && (
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Camera className="h-4 w-4" /> Screenshots
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {config.screenshots.map((src, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border bg-muted">
                      <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-auto object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-3">Resources</h3>
              <div className="flex flex-wrap gap-3">
                {config?.homepage && (
                  <a href={config.homepage} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="h-4 w-4" /> Homepage <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
                {config?.repository && (
                  <a href={config.repository} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Code2 className="h-4 w-4" /> Repository <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
                {config?.license && (
                  <Badge variant="secondary" className="text-xs gap-1 px-3 py-1.5">
                    License: {config.license}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "versions" && (
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Version History
            </h3>
            {config?.changelog && config.changelog.length > 0 ? (
              <div className="space-y-4">
                {config.changelog.map((entry, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4 pb-1 last:pb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant="secondary" className="text-xs font-mono">v{entry.version}</Badge>
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No version history available.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {reviewsData && (
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Rating Overview</h3>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{reviewsData.averageRating.toFixed(1)}</p>
                    <StarRatingDisplay rating={reviewsData.averageRating} size={14} />
                    <p className="text-xs text-muted-foreground mt-1">{reviewsData.totalReviews} reviews</p>
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewsData.distribution[star] || 0;
                      const pct = reviewsData.totalReviews > 0 ? (count / reviewsData.totalReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-right font-medium">{star}</span>
                          <Star className="h-3 w-3 text-amber-400" />
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {installed && (
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Your Rating</label>
                    <StarRatingInteractive rating={reviewRating} onChange={setReviewRating} size={24} />
                  </div>
                  <div>
                    <textarea
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px] resize-y"
                      placeholder="Share your experience with this extension..."
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={submittingReview || !reviewContent.trim()}>
                    {submittingReview ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Review
                  </Button>
                </form>
              </div>
            )}

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Reviews
              </h3>
              {reviewsData && reviewsData.reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviewsData.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-medium">{review.user?.name || "Anonymous"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <StarRatingDisplay rating={review.rating} size={12} />
                      {review.content && (
                        <p className="text-sm text-muted-foreground mt-2">{review.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No reviews yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
