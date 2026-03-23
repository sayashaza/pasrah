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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', slug: '', isActive: true });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchApi('/categories')
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug, isActive: category.isActive !== undefined ? category.isActive : true });
    setImageFile(null); // Optional: Provide a way to keep existing image if unchanged
    setIsSheetOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!deletingId) return;
    try {
      await fetchApi(`/categories/${deletingId}`, { method: 'DELETE' });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
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
        await fetchApi(`/categories/${editingId}`, {
          method: 'PUT',
          body: formToSend
        });
      } else {
        await fetchApi('/categories', {
          method: 'POST',
          body: formToSend
        });
      }

      setIsSheetOpen(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', isActive: true });
      setImageFile(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && categories.length === 0) return <div className="text-muted-foreground">Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({ name: '', slug: '', isActive: true });
          setImageFile(null);
          setIsSheetOpen(true);
        }}>Add Category</Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Category" : "Add New Category"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Modify the category details below." : "Provide details to create a new category."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" required value={formData.name} onChange={e => {
                const val = e.target.value;
                setFormData({...formData, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')});
              }} placeholder="e.g. Fresh Produce" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug Identifier</Label>
              <Input id="slug" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. fresh-produce" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
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
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Category' : 'Save Category')}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the category and remove its data from our servers.
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
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No categories found.</TableCell>
                </TableRow>
              ) : (
                categories.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                    <TableCell>
                      {c.image ? <img src={c.image} alt={c.name} className="h-8 w-8 object-cover rounded" /> : <span className="text-xs text-muted-foreground">None</span>}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {c.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => confirmDelete(c.id)}>
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
