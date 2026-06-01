"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GpmStocksClient() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [vendorForm, setVendorForm] = useState({ name: "", pic: "", phone: "" });

  const handleSaveVendor = () => {
    alert("Vendor saved successfully! (Mock implementation)");
    setSelectedEventId(null);
    setVendorForm({ name: "", pic: "", phone: "" });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const evRes = await fetchApi("/gpm/events");
        setEvents(evRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading stocks data...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">GPM Vendor & Stocks Allocation</h1>
        <p className="text-sm text-muted-foreground">Manage participating vendors and initial product stocks per event.</p>
      </div>

      {events.filter(e => e.status !== 'closed').map(ev => (
        <Card key={ev.id} className="mb-6">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{ev.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{ev.location} - {new Date(ev.event_date).toLocaleDateString()}</p>
              </div>
              <Button size="sm" onClick={() => setSelectedEventId(ev.id)}>Add Vendor</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {/* Real implementation would map over ev.vendors and list stocks */}
            No vendors allocated to this event yet. Click "Add Vendor" to start allocating booths and stocks.
          </CardContent>
        </Card>
      ))}
      
      {events.filter(e => e.status !== 'closed').length === 0 && (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-4">There are no active or draft GPM events.</p>
          <Button variant="outline">Go to Events to create one</Button>
        </div>
      )}

      <Sheet open={!!selectedEventId} onOpenChange={(open) => !open && setSelectedEventId(null)}>
        <SheetContent className="sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Add Vendor to Event</SheetTitle>
            <SheetDescription>
              Register a participating vendor/distributor.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor Name</Label>
              <Input
                id="vendor-name"
                placeholder="e.g. Toko Sembako Berkah"
                value={vendorForm.name}
                onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-pic">PIC Name</Label>
              <Input
                id="vendor-pic"
                placeholder="e.g. Budi"
                value={vendorForm.pic}
                onChange={(e) => setVendorForm({ ...vendorForm, pic: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor-phone">Phone Number</Label>
              <Input
                id="vendor-phone"
                placeholder="e.g. 0812345678"
                value={vendorForm.phone}
                onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
              />
            </div>
            <Button className="w-full mt-4" onClick={handleSaveVendor}>
              Save Vendor
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
