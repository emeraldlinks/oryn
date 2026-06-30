import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface UseApiResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  insert: (item: Partial<T>) => Promise<T | null>;
  update: (id: number, changes: Partial<T>) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
}

export function useApi<T extends { id: number }>(endpoint: string): UseApiResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const insert = async (item: Partial<T>): Promise<T | null> => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Insert failed");
      const created = await res.json();
      setData((prev) => [created, ...prev]);
      toast.success("Created successfully");
      return created;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  };

  const update = async (id: number, changes: Partial<T>): Promise<boolean> => {
    const previous = data;
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, ...changes } : d)));
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });
      if (!res.ok) throw new Error("Update failed");
      return true;
    } catch {
      setData(previous);
      toast.error("Failed to update");
      return false;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    const previous = data;
    setData((prev) => prev.filter((d) => d.id !== id));
    try {
      const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      return true;
    } catch {
      setData(previous);
      toast.error("Failed to delete");
      return false;
    }
  };

  return { data, loading, error, refetch, insert, update, remove };
}
