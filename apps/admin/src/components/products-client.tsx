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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    brandId: "",
    is_gpm_product: false,
    regular_price: "",
    gpm_price: "",
    vendor_id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, bRes] = await Promise.all([
        fetchApi("/products"),
        fetchApi("/categories"),
        fetchApi("/brands"),
      ]);
      setProducts(pRes);
      setCategories(cRes);
      setBrands(bRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      categoryId: product.category || "",
      brandId: product.brand || "",
      is_gpm_product: product.is_gpm_product || false,
      regular_price: product.regular_price?.toString() || "",
      gpm_price: product.gpm_price?.toString() || "",
      vendor_id: product.vendor_id || "",
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
      await fetchApi(`/products/${deletingId}`, { method: "DELETE" });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const category = categories.find((c) => c.name === formData.categoryId);
      const brand = brands.find((b) => b.name === formData.brandId);

      const formToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formToSend.append(key, String(value));
      });
      formToSend.append("category", category?.name || formData.categoryId || "Uncategorized");
      formToSend.append("brand", brand?.name || formData.brandId || "Unknown");
      if (imageFile) formToSend.append("image", imageFile);

      if (editingId) {
        await fetchApi(`/products/${editingId}`, {
          method: "PUT",
          body: formToSend,
        });
      } else {
        await fetchApi("/products", {
          method: "POST",
          body: formToSend,
        });
      }

      setIsSheetOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        brandId: "",
        is_gpm_product: false,
        regular_price: "",
        gpm_price: "",
        vendor_id: "",
      });
      setImageFile(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && products.length === 0)
    return <div className="text-muted-foreground">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({
            name: "",
            slug: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            brandId: "",
          });
          setImageFile(null);
          setIsSheetOpen(true);
        }}>Add Product</Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-[90vw] sm:max-w-[600px] p-5">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Product" : "Add New Product"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Modify the product details below." : "Fill out the details to add a new product to the catalog."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 pb-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') });
                  }}
                  placeholder="e.g. iPhone 15 Pro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g. iphone-15-pro"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, categoryId: v || "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, brandId: v || "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-md bg-muted/10">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isGpm" 
                  className="h-4 w-4"
                  checked={formData.is_gpm_product}
                  onChange={(e) => setFormData({ ...formData, is_gpm_product: e.target.checked })}
                />
                <Label htmlFor="isGpm" className="font-semibold text-primary">Is GPM Product (Gerakan Pangan Murah)</Label>
              </div>
              
              {formData.is_gpm_product && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="regularPrice">Regular Price (IDR)</Label>
                    <Input
                      id="regularPrice"
                      type="number"
                      value={formData.regular_price}
                      onChange={(e) => setFormData({ ...formData, regular_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpmPrice">GPM Price (IDR)</Label>
                    <Input
                      id="gpmPrice"
                      type="number"
                      required={formData.is_gpm_product}
                      value={formData.gpm_price}
                      onChange={(e) => setFormData({ ...formData, gpm_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="vendorId">Vendor ID (Distributor)</Label>
                    <Input
                      id="vendorId"
                      placeholder="Optional. ID of the vendor/distributor"
                      value={formData.vendor_id}
                      onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                    />
                  </div>
                </div>
              )}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
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
              {isSubmitting ? "Saving..." : (editingId ? "Update Product" : "Save Product")}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
            <DialogDescription>
              This will permanently delete the selected product from the catalog. This action cannot be undone.
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
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground h-24"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.brand}</TableCell>
                    <TableCell className="text-primary font-semibold">
                      Rp{p.price?.toLocaleString('id-ID')}
                      {p.is_gpm_product && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          GPM
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{p.stock} units</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => confirmDelete(p.id)}>
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
