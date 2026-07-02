"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoCard } from "@/components/shared/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Languages, Plus, Trash2, Save, Loader2, X, Check, Search, Edit3, Globe } from "lucide-react";

interface Language {
  id: number;
  locale: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  isDefault: boolean;
  active: boolean;
}

interface Translation {
  key: string;
  value: string;
}

export default function I18nPage() {
  const [activeTab, setActiveTab] = useState("languages");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<number | null>(null);
  const [searchKey, setSearchKey] = useState("");

  const [showLangModal, setShowLangModal] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [langForm, setLangForm] = useState({ locale: "", name: "", nativeName: "", rtl: false, isDefault: false, active: true });

  const [showTransModal, setShowTransModal] = useState(false);
  const [editTransKey, setEditTransKey] = useState("");
  const [editTransValue, setEditTransValue] = useState("");

  useEffect(() => { loadLanguages(); }, []);

  async function loadLanguages() {
    try {
      const res = await fetch("/api/admin/languages");
      if (res.ok) setLanguages(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function loadTranslations(langId: number) {
    try {
      const res = await fetch(`/api/admin/translations?languageId=${langId}`);
      if (res.ok) setTranslations(await res.json());
    } catch {}
  }

  useEffect(() => {
    if (selectedLang) loadTranslations(selectedLang);
    else setTranslations([]);
  }, [selectedLang]);

  async function saveLanguage() {
    try {
      const method = editingLang ? "PUT" : "POST";
      const params = editingLang ? `?id=${editingLang.id}` : "";
      const res = await fetch(`/api/admin/languages${params}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(langForm),
      });
      if (res.ok) { toast.success(editingLang ? "Language updated" : "Language added"); setShowLangModal(false); setEditingLang(null); setLangForm({ locale: "", name: "", nativeName: "", rtl: false, isDefault: false, active: true }); loadLanguages(); }
      else toast.error("Failed to save language");
    } catch { toast.error("Failed to save language"); }
  }

  async function deleteLanguage(id: number) {
    try {
      const res = await fetch(`/api/admin/languages?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Language deleted"); loadLanguages(); }
      else toast.error("Failed to delete language");
    } catch { toast.error("Failed to delete language"); }
  }

  function openEditLang(l: Language) {
    setEditingLang(l);
    setLangForm({ locale: l.locale, name: l.name, nativeName: l.nativeName, rtl: l.rtl, isDefault: l.isDefault, active: l.active });
    setShowLangModal(true);
  }

  function openAddLang() {
    setEditingLang(null);
    setLangForm({ locale: "", name: "", nativeName: "", rtl: false, isDefault: false, active: true });
    setShowLangModal(true);
  }

  async function saveTranslation() {
    if (!selectedLang || !editTransKey.trim()) return;
    try {
      const existing = translations.find((t) => t.key === editTransKey);
      const method = existing ? "PUT" : "POST";
      const res = await fetch(`/api/admin/translations?languageId=${selectedLang}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: editTransKey, value: editTransValue }),
      });
      if (res.ok) { toast.success("Translation saved"); setShowTransModal(false); setEditTransKey(""); setEditTransValue(""); loadTranslations(selectedLang); }
      else toast.error("Failed to save translation");
    } catch { toast.error("Failed to save translation"); }
  }

  async function deleteTranslation(key: string) {
    if (!selectedLang) return;
    try {
      const res = await fetch(`/api/admin/translations?languageId=${selectedLang}&key=${encodeURIComponent(key)}`, { method: "DELETE" });
      if (res.ok) { toast.success("Translation deleted"); loadTranslations(selectedLang); }
      else toast.error("Failed to delete translation");
    } catch { toast.error("Failed to delete translation"); }
  }

  function openEditTrans(key: string, value: string) {
    setEditTransKey(key);
    setEditTransValue(value);
    setShowTransModal(true);
  }

  function openAddTrans() {
    setEditTransKey("");
    setEditTransValue("");
    setShowTransModal(true);
  }

  const filteredTranslations = translations.filter((t) =>
    !searchKey || t.key.toLowerCase().includes(searchKey.toLowerCase()) || t.value.toLowerCase().includes(searchKey.toLowerCase())
  );

  const tabs = [
    { id: "languages", label: "Languages", icon: Globe },
    { id: "translations", label: "Translations", icon: Languages },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Internationalization</h1>
          <p className="text-muted-foreground">Manage languages and translations</p>
        </div>

        <div className="flex gap-2 flex-wrap border-b pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "languages" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openAddLang}><Plus className="mr-2 h-4 w-4" /> Add Language</Button>
            </div>
            <BentoCard>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium">Locale</th>
                      <th className="text-left py-2 px-2 font-medium">Name</th>
                      <th className="text-left py-2 px-2 font-medium">Native Name</th>
                      <th className="text-center py-2 px-2 font-medium">RTL</th>
                      <th className="text-center py-2 px-2 font-medium">Default</th>
                      <th className="text-center py-2 px-2 font-medium">Active</th>
                      <th className="text-right py-2 pl-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                    ) : languages.length === 0 ? (
                      <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No languages configured.</td></tr>
                    ) : languages.map((l) => (
                      <tr key={l.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs">{l.locale}</td>
                        <td className="py-3 px-2">{l.name}</td>
                        <td className="py-3 px-2">{l.nativeName}</td>
                        <td className="py-3 px-2 text-center">{l.rtl ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}</td>
                        <td className="py-3 px-2 text-center">{l.isDefault ? <Badge variant="default">Default</Badge> : "-"}</td>
                        <td className="py-3 px-2 text-center">{l.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</td>
                        <td className="py-3 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditLang(l)}><Edit3 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteLanguage(l.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BentoCard>
          </div>
        )}

        {activeTab === "translations" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <select className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm flex-1 max-w-xs" value={selectedLang ?? ""} onChange={(e) => setSelectedLang(e.target.value ? parseInt(e.target.value) : null)}>
                <option value="">Select a language...</option>
                {languages.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.locale})</option>)}
              </select>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search keys..." value={searchKey} onChange={(e) => setSearchKey(e.target.value)} className="pl-10" />
              </div>
              {selectedLang && (
                <Button onClick={openAddTrans}><Plus className="mr-2 h-4 w-4" /> Add Key</Button>
              )}
            </div>

            {!selectedLang ? (
              <p className="text-sm text-muted-foreground text-center py-12">Select a language to view translations.</p>
            ) : (
              <BentoCard>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Key</th>
                        <th className="text-left py-2 px-2 font-medium">Value</th>
                        <th className="text-right py-2 pl-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTranslations.length === 0 ? (
                        <tr><td colSpan={3} className="py-12 text-center text-sm text-muted-foreground">No translations found.</td></tr>
                      ) : filteredTranslations.map((t) => (
                        <tr key={t.key} className="border-b last:border-0">
                          <td className="py-3 pr-4 font-mono text-xs">{t.key}</td>
                          <td className="py-3 px-2 text-xs max-w-[400px] truncate">{t.value}</td>
                          <td className="py-3 pl-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditTrans(t.key, t.value)}><Edit3 className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTranslation(t.key)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </BentoCard>
            )}
          </div>
        )}

        {showLangModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{editingLang ? "Edit Language" : "Add Language"}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowLangModal(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Locale</label>
                  <Input value={langForm.locale} onChange={(e) => setLangForm({ ...langForm, locale: e.target.value })} placeholder="en-US" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input value={langForm.name} onChange={(e) => setLangForm({ ...langForm, name: e.target.value })} placeholder="English" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Native Name</label>
                  <Input value={langForm.nativeName} onChange={(e) => setLangForm({ ...langForm, nativeName: e.target.value })} placeholder="English" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">RTL</label>
                  <button
                    onClick={() => setLangForm({ ...langForm, rtl: !langForm.rtl })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${langForm.rtl ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${langForm.rtl ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Default</label>
                  <button
                    onClick={() => setLangForm({ ...langForm, isDefault: !langForm.isDefault })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${langForm.isDefault ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${langForm.isDefault ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Active</label>
                  <button
                    onClick={() => setLangForm({ ...langForm, active: !langForm.active })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${langForm.active ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${langForm.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowLangModal(false)}>Cancel</Button>
                <Button onClick={saveLanguage}><Save className="mr-2 h-4 w-4" /> {editingLang ? "Update" : "Add"}</Button>
              </div>
            </div>
          </div>
        )}

        {showTransModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{editTransKey ? "Edit Translation" : "Add Translation"}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowTransModal(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Key</label>
                  <Input value={editTransKey} onChange={(e) => setEditTransKey(e.target.value)} placeholder="greeting.welcome" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Value</label>
                  <textarea
                    className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
                    value={editTransValue}
                    onChange={(e) => setEditTransValue(e.target.value)}
                    placeholder="Welcome!"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowTransModal(false)}>Cancel</Button>
                <Button onClick={saveTranslation}><Save className="mr-2 h-4 w-4" /> Save</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
