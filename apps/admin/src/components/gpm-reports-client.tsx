"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react";

interface EventSummary {
  total_initial_stock: number;
  total_sold: number;
  total_revenue: number;
  vendor_sales: Record<string, { total_sold: number; total_revenue: number }>;
}

interface GpmEvent {
  id: string;
  name: string;
  location: string;
  event_date: string;
  status: "draft" | "active" | "closed";
  opened_at?: string;
  closed_at?: string;
}

export default function GpmReportsClient() {
  const [events, setEvents] = useState<GpmEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<GpmEvent | null>(null);
  const [summary, setSummary] = useState<EventSummary | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetchApi("/gpm/events");
      setEvents(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadSummary = async (event: GpmEvent) => {
    setSelectedEvent(event);
    setSummary(null);
    setLoadingSummary(true);
    try {
      const res = await fetchApi(`/gpm/events/${event.id}/summary`);
      setSummary(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleCloseEvent = async () => {
    if (!selectedEvent) return;
    setIsClosing(true);
    try {
      await fetchApi(`/gpm/events/${selectedEvent.id}/close`, { method: "POST" });
      setConfirmClose(false);
      await loadEvents();
      // Refresh summary to reflect closed state
      await loadSummary({ ...selectedEvent, status: "closed" });
    } catch (err) {
      console.error(err);
      alert("Failed to close event.");
    } finally {
      setIsClosing(false);
    }
  };

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const handleExportCSV = () => {
    if (!selectedEvent || !summary) return;

    const rows: string[][] = [];
    rows.push(["GPM Event Report"]);
    rows.push(["Event", selectedEvent.name]);
    rows.push(["Lokasi", selectedEvent.location]);
    rows.push(["Tanggal", new Date(selectedEvent.event_date).toLocaleDateString("id-ID")]);
    rows.push(["Status", selectedEvent.status.toUpperCase()]);
    if (selectedEvent.closed_at) rows.push(["Ditutup", new Date(selectedEvent.closed_at).toLocaleString("id-ID")]);
    rows.push([]);
    rows.push(["=== RINGKASAN ==="]);
    rows.push(["Total Stok Awal", summary.total_initial_stock.toString()]);
    rows.push(["Total Terjual", summary.total_sold.toString()]);
    rows.push(["Sisa Stok", (summary.total_initial_stock - summary.total_sold).toString()]);
    rows.push(["Total Pendapatan (IDR)", summary.total_revenue.toString()]);
    rows.push(["Tingkat Penjualan (%)", saleRate]);
    rows.push([]);
    rows.push(["=== PER VENDOR ==="]);
    rows.push(["Vendor ID", "Pendapatan (IDR)"]);
    for (const [vid, data] of Object.entries(summary.vendor_sales)) {
      rows.push([vid, data.total_revenue.toString()]);
    }

    const csvContent = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GPM-Report-${selectedEvent.name.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Closed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
    }
  };

  const saleRate =
    summary && summary.total_initial_stock > 0
      ? ((summary.total_sold / summary.total_initial_stock) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">GPM Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rekap penjualan dan penutupan event Gerakan Pangan Murah
          </p>
        </div>
        <div className="flex gap-2">
          {selectedEvent && summary && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={loadEvents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Pilih Event
          </h2>
          {loadingEvents ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center border rounded-lg bg-muted/10">
              Belum ada event GPM.
            </div>
          ) : (
            events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => loadSummary(ev)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedEvent?.id === ev.id
                    ? "border-orange-400 bg-orange-50 shadow-sm"
                    : "border-border bg-card hover:border-orange-200 hover:bg-orange-50/30"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{ev.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{ev.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ev.event_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="shrink-0">{getStatusBadge(ev.status)}</div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-2">
          {!selectedEvent ? (
            <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10 py-24">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Pilih event di sebelah kiri untuk melihat laporan
                </p>
              </div>
            </div>
          ) : loadingSummary ? (
            <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10 py-24">
              <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : summary ? (
            <div className="space-y-4">
              {/* Event Header */}
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selectedEvent.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                      {selectedEvent.closed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ditutup:{" "}
                          {new Date(selectedEvent.closed_at).toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(selectedEvent.status)}
                      {selectedEvent.status !== "closed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmClose(true)}
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Tutup Event
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stok Terjual</p>
                        <p className="text-2xl font-bold text-foreground">
                          {summary.total_sold.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          dari {summary.total_initial_stock.toLocaleString("id-ID")} unit ({saleRate}%)
                        </p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(Number(saleRate), 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Pendapatan</p>
                        <p className="text-xl font-bold text-foreground">
                          {formatIDR(summary.total_revenue)}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Dari {Object.keys(summary.vendor_sales).length} vendor aktif
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Remaining Stock Alert */}
              {summary.total_initial_stock - summary.total_sold > 0 &&
                selectedEvent.status !== "closed" && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4 pb-3 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                      <p className="text-sm text-yellow-800">
                        Masih ada{" "}
                        <strong>
                          {(summary.total_initial_stock - summary.total_sold).toLocaleString("id-ID")} unit
                        </strong>{" "}
                        stok yang belum terjual. Pastikan semua transaksi sudah selesai sebelum menutup event.
                      </p>
                    </CardContent>
                  </Card>
                )}

              {selectedEvent.status === "closed" && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-4 pb-3 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-800 font-medium">
                      Event ini sudah ditutup. Data laporan di bawah bersifat final.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Per-Vendor Breakdown */}
              {Object.keys(summary.vendor_sales).length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Rekap Per Vendor/Distributor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor ID</TableHead>
                          <TableHead className="text-right">Pendapatan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(summary.vendor_sales).map(([vendorId, data]) => (
                          <TableRow key={vendorId}>
                            <TableCell className="font-mono text-sm">{vendorId}</TableCell>
                            <TableCell className="text-right font-semibold text-green-700">
                              {formatIDR(data.total_revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10 py-24">
              <p className="text-sm text-muted-foreground">Gagal memuat data summary.</p>
            </div>
          )}
        </div>
      </div>

      {/* Close Event Confirmation Dialog */}
      <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Tutup Event GPM?
            </DialogTitle>
            <DialogDescription className="pt-2 space-y-2">
              <p>
                Anda akan menutup event <strong>{selectedEvent?.name}</strong>. Setelah ditutup:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Pelanggan tidak bisa lagi memesan barang GPM dari event ini</li>
                <li>Kasir tidak bisa memproses pesanan baru untuk event ini</li>
                <li>Data laporan akan dikunci sebagai laporan final</li>
              </ul>
              {summary && summary.total_initial_stock - summary.total_sold > 0 && (
                <p className="text-yellow-700 text-sm font-medium mt-2">
                  ⚠ Perhatian: Masih ada {(summary.total_initial_stock - summary.total_sold).toLocaleString("id-ID")} unit stok yang belum terjual.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClose(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleCloseEvent} disabled={isClosing}>
              {isClosing ? "Menutup..." : "Ya, Tutup Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
