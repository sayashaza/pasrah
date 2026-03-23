"use client";

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Pencil, Trash2 } from "lucide-react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchApi('/brands')
      .then(setBrands)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (brand: any) => {
    setEditingId(brand.id);
    setFormData({ name: brand.name, slug: brand.slug });
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
      await fetchApi(`/brands/${deletingId}`, { method: 'DELETE' });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete brand.');
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
      if (imageFile) formToSend.append('image', imageFile);

      if (editingId) {
        await fetchApi(`/brands/${editingId}`, {
          method: 'PUT',
          body: formToSend
        });
      } else {
        await fetchApi('/brands', {
          method: 'POST',
          body: formToSend
        });
      }

      setIsSheetOpen(false);
      setEditingId(null);
      setFormData({ name: '', slug: '' });
      setImageFile(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save brand.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && brands.length === 0) return <div className="text-muted-foreground">Loading brands...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Brands</h1>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({ name: '', slug: '' });
          setImageFile(null);
          setIsSheetOpen(true);
        }}>Add Brand</Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Brand" : "Add New Brand"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Modify the brand details below." : "Provide details to list a new brand."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input id="name" required value={formData.name} onChange={e => {
                const val = e.target.value;
                setFormData({...formData, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')});
              }} placeholder="e.g. Apple" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug Identifier</Label>
              <Input id="slug" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. apple" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Brand Logo/Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
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
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Brand' : 'Save Brand')}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand?</DialogTitle>
            <DialogDescription>
              This will permanently delete the brand and cannot be undone.
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
                <TableHead>Brand Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No brands found.</TableCell>
                </TableRow>
              ) : (
                brands.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell className="text-muted-foreground">{b.slug}</TableCell>
                    <TableCell>
                      {b.image ? <img src={b.image} alt={b.name} className="h-8 w-8 object-contain" /> : <span className="text-xs text-muted-foreground">None</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</TableCell>
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
