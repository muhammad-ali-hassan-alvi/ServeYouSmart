"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Save, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Gadget {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}

export default function EditGadgetPage() {
  const router = useRouter();
  const { id } = useParams();
  const [gadget, setGadget] = useState<Gadget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchGadget = async () => {
      try {
        const response = await fetch(`https://serveyousmartbe-production.up.railway.app/api/gadgets/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch gadget");
        }
        const data = await response.json();
        setGadget(data);
      } catch (error) {
        toast.error("Failed to load gadget");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGadget();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gadget) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", gadget.name);
      formData.append("description", gadget.description);
      formData.append("price", gadget.price.toString());
      formData.append("category", gadget.category);
      formData.append("stock", gadget.stock.toString());
      
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch(`https://serveyousmartbe-production.up.railway.app/api/gadgets/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update gadget");
      }

      toast.success("Gadget updated successfully!");
      router.push("/admin");
    } catch (error) {
      toast.error("Failed to update gadget");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://serveyousmartbe-production.up.railway.app/api/gadgets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete gadget");
      }

      toast.success("Gadget deleted successfully!");
      router.push("/admin/gadgets");
    } catch (error) {
      toast.error("Failed to delete gadget");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!gadget) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Gadget not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Edit Gadget</h1>
          <p className="text-sm text-gray-500">Update gadget details</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Gadget
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Product Image</Label>
              <div className="mt-2 flex flex-col items-center rounded-lg border border-dashed border-gray-300 p-6">
                {imagePreview || gadget.images[0] ? (
                  <div className="relative w-full h-64 rounded-md overflow-hidden">
                    <Image
                      src={imagePreview || gadget.images[0]}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="h-12 w-12" />
                    <p className="mt-2 text-sm">Upload an image</p>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-4 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={gadget.name}
                onChange={(e) => setGadget({...gadget, name: e.target.value})}
                placeholder="Enter gadget name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={gadget.description}
                onChange={(e) => setGadget({...gadget, description: e.target.value})}
                placeholder="Enter detailed description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={gadget.price}
                  onChange={(e) => setGadget({...gadget, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={gadget.stock}
                  onChange={(e) => setGadget({...gadget, stock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={gadget.category}
                onChange={(e) => setGadget({...gadget, category: e.target.value})}
                placeholder="Enter category"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/gadgets")}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${deleteDialogOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Delete Gadget</h2>
            <p>Are you sure you want to delete this gadget? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}