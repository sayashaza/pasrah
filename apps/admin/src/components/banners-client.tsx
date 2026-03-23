"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function BannersClient() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonTitle: "",
    buttonHref: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/banners");
      setBanners(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (banner: any) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      buttonTitle: banner.buttonTitle || "",
      buttonHref: banner.buttonHref || "",
    });
    setImageFile(null);
    setIsSheetOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!deletingId) return;
    try {
      await fetchApi(`/banners/${deletingId}`, { method: "DELETE" });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formToSend.append(key, String(value));
      });
      if (imageFile) formToSend.append("image", imageFile);

      if (editingId) {
        await fetchApi(`/banners/${editingId}`, {
          method: "PUT",
          body: formToSend,
        });
      } else {
        await fetchApi("/banners", {
          method: "POST",
          body: formToSend,
        });
      }

      setIsSheetOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        buttonTitle: "",
        buttonHref: "",
      });
      setImageFile(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && banners.length === 0)
    return <div className="text-muted-foreground">Loading banners...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Banners</h1>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({
            title: "",
            description: "",
            buttonTitle: "",
            buttonHref: "",
          });
          setImageFile(null);
          setIsSheetOpen(true);
        }}>Add Banner</Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-[90vw] sm:max-w-[600px] p-5">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Banner" : "Add New Banner"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Modify the banner details below." : "Fill out the details to add a new banner for the mobile app."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 pb-12">
            <div className="space-y-2">
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. 20% off on your first purchase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonTitle">Button Text</Label>
                <Input
                  id="buttonTitle"
                  value={formData.buttonTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonTitle: e.target.value })
                  }
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonHref">Button Link</Label>
                <Input
                  id="buttonHref"
                  value={formData.buttonHref}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonHref: e.target.value })
                  }
                  placeholder="e.g. /products?sale=true"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Banner Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <div className="mt-2 flex justify-center border rounded-md p-2 bg-muted/20">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-32 w-auto object-contain rounded-sm" />
                </div>
              )}
              {editingId && !imageFile && (
                <p className="text-xs text-muted-foreground mt-2">Leave empty to keep existing image</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : (editingId ? "Update Banner" : "Save Banner")}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner?</DialogTitle>
            <DialogDescription>
              This will permanently delete the selected banner. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={executeDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Button</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground h-24"
                  >
                    No banners found.
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      {b.image ? (
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-10 w-20 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell>{b.buttonTitle}</TableCell>
                    <TableCell>{b.buttonHref}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(b)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => confirmDelete(b.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
