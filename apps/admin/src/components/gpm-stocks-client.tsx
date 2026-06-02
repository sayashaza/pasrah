"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// ── Types ──────────────────────────────────────────────────
type GpmEvent = {
  id: string;
  name: string;
  location: string;
  event_date: string;
  status: string;
};

type Vendor = {
  id: string;
  name: string;
  pic: string;
  phone: string;
  event_id: string;
};

type Stock = {
  id: string;
  event_id: string;
  vendor_id: string;
  product_id: string;
  product_name: string;
  initial_stock: number;
  remaining_stock: number;
  sold_qty: number;
  price: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  gpm_price?: number;
};

// ── Initial form state ─────────────────────────────────────
const DEFAULT_VENDOR_FORM = { name: "", pic: "", phone: "" };
const DEFAULT_STOCK_FORM = {
  product_id: "",
  product_name: "",
  initial_stock: "",
  price: "",
};

export default function GpmStocksClient() {
  const [events, setEvents] = useState<GpmEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // keyed by event_id
  const [vendorMap, setVendorMap] = useState<Record<string, Vendor[]>>({});
  const [stockMap, setStockMap] = useState<Record<string, Stock[]>>({});

  // Sheet: Add Vendor
  const [vendorSheetEventId, setVendorSheetEventId] = useState<string | null>(null);
  const [vendorForm, setVendorForm] = useState(DEFAULT_VENDOR_FORM);
  const [savingVendor, setSavingVendor] = useState(false);

  // Sheet: Add Stock (needs event + vendor)
  const [stockSheetTarget, setStockSheetTarget] = useState<{ eventId: string; vendor: Vendor } | null>(null);
  const [stockForm, setStockForm] = useState(DEFAULT_STOCK_FORM);
  const [savingStock, setSavingStock] = useState(false);

  // ── Loaders ─────────────────────────────────────────────
  const loadVendorsAndStocks = useCallback(async (eventId: string) => {
    try {
      const [vendors, stocks] = await Promise.all([
        fetchApi(`/gpm/events/${eventId}/vendors`),
        fetchApi(`/gpm/events/${eventId}/stocks`),
      ]);
      setVendorMap((prev) => ({ ...prev, [eventId]: vendors || [] }));
      setStockMap((prev) => ({ ...prev, [eventId]: stocks || [] }));
    } catch (err) {
      console.error("Failed to load vendors/stocks for event", eventId, err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [evRes, prRes] = await Promise.all([
          fetchApi("/gpm/events"),
          fetchApi("/products"),
        ]);
        const activeEvents: GpmEvent[] = (evRes || []).filter(
          (e: GpmEvent) => e.status !== "closed"
        );
        setEvents(activeEvents);
        setProducts(prRes || []);

        // Pre-load vendors & stocks for all active events in parallel
        await Promise.all(activeEvents.map((e) => loadVendorsAndStocks(e.id)));
      } catch (err) {
        console.error("Failed to load stocks page data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [loadVendorsAndStocks]);

  // ── Handlers: Vendor ─────────────────────────────────────
  const handleSaveVendor = async () => {
    if (!vendorSheetEventId) return;
    if (!vendorForm.name.trim()) {
      alert("Vendor name is required.");
      return;
    }
    setSavingVendor(true);
    try {
      await fetchApi("/gpm/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vendorForm,
          event_id: vendorSheetEventId,
        }),
      });
      setVendorSheetEventId(null);
      setVendorForm(DEFAULT_VENDOR_FORM);
      // Refresh vendors for this event
      await loadVendorsAndStocks(vendorSheetEventId);
    } catch (err: any) {
      alert(`Failed to save vendor: ${err.message}`);
    } finally {
      setSavingVendor(false);
    }
  };

  // ── Handlers: Stock ──────────────────────────────────────
  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setStockForm({
      product_id: product.id,
      product_name: product.name,
      initial_stock: "",
      price: String(product.gpm_price ?? product.price),
    });
  };

  const handleSaveStock = async () => {
    if (!stockSheetTarget) return;
    const { eventId, vendor } = stockSheetTarget;

    if (!stockForm.product_id || !stockForm.initial_stock) {
      alert("Product and Stock Quantity are required.");
      return;
    }
    const qty = parseInt(stockForm.initial_stock, 10);
    if (isNaN(qty) || qty <= 0) {
      alert("Stock quantity must be a positive number.");
      return;
    }
    setSavingStock(true);
    try {
      await fetchApi("/gpm/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          vendor_id: vendor.id,
          product_id: stockForm.product_id,
          product_name: stockForm.product_name,
          initial_stock: qty,
          price: parseFloat(stockForm.price) || 0,
        }),
      });
      setStockSheetTarget(null);
      setStockForm(DEFAULT_STOCK_FORM);
      await loadVendorsAndStocks(eventId);
    } catch (err: any) {
      alert(`Failed to save stock: ${err.message}`);
    } finally {
      setSavingStock(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  const getVendorStocks = (eventId: string, vendorId: string): Stock[] =>
    (stockMap[eventId] || []).filter((s) => s.vendor_id === vendorId);

  const statusColor = (s: string) => {
    if (s === "active") return "default";
    if (s === "closed") return "destructive";
    return "secondary";
  };

  // ── Render ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12 px-4">
        <span className="animate-spin">⏳</span> Loading stocks data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">GPM Vendor & Stocks Allocation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage participating vendors and initial product stocks per active event.
        </p>
      </div>

      {events.length === 0 && (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-4">There are no active or draft GPM events.</p>
          <Button variant="outline" onClick={() => (window.location.href = "/gpm/events")}>
            Go to Events to create one
          </Button>
        </div>
      )}

      {events.map((ev) => {
        const vendors = vendorMap[ev.id] || [];
        return (
          <Card key={ev.id} className="mb-6">
            {/* Event Card Header */}
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{ev.name}</CardTitle>
                    <Badge variant={statusColor(ev.status)}>{ev.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    📍 {ev.location} &nbsp;·&nbsp; 📅{" "}
                    {new Date(ev.event_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setVendorSheetEventId(ev.id);
                    setVendorForm(DEFAULT_VENDOR_FORM);
                  }}
                >
                  + Add Vendor
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {vendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                  No vendors allocated yet. Click <strong>"+ Add Vendor"</strong> to register a participating distributor.
                </div>
              ) : (
                <div className="space-y-6">
                  {vendors.map((vendor) => {
                    const vendorStocks = getVendorStocks(ev.id, vendor.id);
                    return (
                      <div key={vendor.id} className="border rounded-lg overflow-hidden">
                        {/* Vendor Sub-header */}
                        <div className="flex justify-between items-center px-4 py-3 bg-muted/20 border-b">
                          <div>
                            <p className="font-semibold text-foreground">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              PIC: {vendor.pic || "—"} &nbsp;|&nbsp; 📞 {vendor.phone || "—"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setStockSheetTarget({ eventId: ev.id, vendor });
                              setStockForm(DEFAULT_STOCK_FORM);
                            }}
                          >
                            + Allocate Stock
                          </Button>
                        </div>

                        {/* Stocks Table */}
                        {vendorStocks.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-muted-foreground italic">
                            No stock allocated to this vendor yet.
                          </p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">GPM Price</TableHead>
                                <TableHead className="text-right">Initial Stock</TableHead>
                                <TableHead className="text-right">Sold</TableHead>
                                <TableHead className="text-right">Remaining</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {vendorStocks.map((stock) => {
                                const pct =
                                  stock.initial_stock > 0
                                    ? Math.round((stock.sold_qty / stock.initial_stock) * 100)
                                    : 0;
                                const stockStatus =
                                  stock.remaining_stock === 0
                                    ? "Habis"
                                    : stock.remaining_stock < stock.initial_stock * 0.2
                                    ? "Kritis"
                                    : "Tersedia";
                                const statusVariant =
                                  stockStatus === "Habis"
                                    ? "destructive"
                                    : stockStatus === "Kritis"
                                    ? "secondary"
                                    : "default";
                                return (
                                  <TableRow key={stock.id}>
                                    <TableCell className="font-medium">{stock.product_name}</TableCell>
                                    <TableCell className="text-right">
                                      Rp {(stock.price || 0).toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell className="text-right">{stock.initial_stock}</TableCell>
                                    <TableCell className="text-right text-amber-600">
                                      {stock.sold_qty} ({pct}%)
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                      {stock.remaining_stock}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={statusVariant}>{stockStatus}</Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* ── Sheet: Add Vendor ── */}
      <Sheet
        open={!!vendorSheetEventId}
        onOpenChange={(open) => !open && setVendorSheetEventId(null)}
      >
        <SheetContent className="sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>Tambah Vendor / Distributor</SheetTitle>
            <SheetDescription>
              Daftarkan distributor yang berpartisipasi di event ini.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">
                Nama Vendor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendor-name"
                placeholder="e.g. Bulog, Toko Sembako Berkah"
                value={vendorForm.name}
                onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-pic">Nama PIC (Penanggung Jawab)</Label>
              <Input
                id="vendor-pic"
                placeholder="e.g. Budi Santoso"
                value={vendorForm.pic}
                onChange={(e) => setVendorForm({ ...vendorForm, pic: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-phone">Nomor Telepon</Label>
              <Input
                id="vendor-phone"
                placeholder="e.g. 08123456789"
                value={vendorForm.phone}
                onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
              />
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleSaveVendor}
              disabled={savingVendor}
            >
              {savingVendor ? "Menyimpan..." : "Simpan Vendor"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Sheet: Allocate Stock ── */}
      <Sheet
        open={!!stockSheetTarget}
        onOpenChange={(open) => !open && setStockSheetTarget(null)}
      >
        <SheetContent className="sm:max-w-[440px]">
          <SheetHeader>
            <SheetTitle>Alokasi Stok Produk</SheetTitle>
            <SheetDescription>
              Tentukan produk dan kuota awal stok untuk{" "}
              <strong>{stockSheetTarget?.vendor.name}</strong>.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label>
                Pilih Produk <span className="text-destructive">*</span>
              </Label>
              <select
                className="w-full border rounded-md h-10 px-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={stockForm.product_id}
                onChange={(e) => handleProductSelect(e.target.value)}
              >
                <option value="" disabled>
                  -- Pilih produk --
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GPM Price */}
            <div className="space-y-2">
              <Label htmlFor="stock-price">
                Harga Subsidi GPM (Rp) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock-price"
                type="number"
                placeholder="e.g. 12000"
                value={stockForm.price}
                onChange={(e) =>
                  setStockForm({ ...stockForm, price: e.target.value })
                }
              />
              {stockForm.product_id && (
                <p className="text-xs text-muted-foreground">
                  Harga normal produk:{" "}
                  <strong>
                    Rp{" "}
                    {(
                      products.find((p) => p.id === stockForm.product_id)?.price ?? 0
                    ).toLocaleString("id-ID")}
                  </strong>
                </p>
              )}
            </div>

            {/* Initial Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock-qty">
                Kuota Stok Awal (unit) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock-qty"
                type="number"
                placeholder="e.g. 100"
                value={stockForm.initial_stock}
                onChange={(e) =>
                  setStockForm({ ...stockForm, initial_stock: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleSaveStock}
              disabled={savingStock}
            >
              {savingStock ? "Menyimpan..." : "Simpan Alokasi Stok"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
