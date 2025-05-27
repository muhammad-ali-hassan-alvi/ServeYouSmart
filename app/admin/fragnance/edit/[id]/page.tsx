"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Save, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming these paths are correct
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Interface for Fragrance, matching your backend model structure
interface Fragrance {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // Array of image URLs
  category: string; // e.g., "Eau de Parfum", "Men's", "Floral"
  stock: number;
  // You might add other fragrance-specific fields here if they exist
  // e.g., brand: string; notes: string[]; concentration: string;
}

export default function EditFragrancePage() {
  const router = useRouter();
  const { id } = useParams(); // id will be the fragrance ID from the URL
  const [fragrance, setFragrance] = useState<Fragrance | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      toast.error("Fragrance ID is missing.");
      router.push("/admin"); // Or your fragrance listing page
      return;
    }

    const fetchFragrance = async () => {
      try {
        // Using the fragrance API endpoint
        const response = await fetch(`http://localhost:5000/api/fragnance/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Fragrance not found.");
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch fragrance");
          }
          router.push("/admin");
          return;
        }
        const data = await response.json();
        setFragrance(data);
        if (data.images && data.images.length > 0) {
          setImagePreview(data.images[0]);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load fragrance");
        console.error(error);
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchFragrance();
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewImageFile(null);
      setImagePreview(fragrance?.images?.[0] || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fragrance) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", fragrance.name);
      formData.append("description", fragrance.description);
      formData.append("price", fragrance.price.toString());
      formData.append("category", fragrance.category);
      formData.append("stock", fragrance.stock.toString());
      // Add other fragrance-specific fields to formData if they exist in your state

      if (newImageFile) {
        formData.append("image", newImageFile); // Backend expects 'image'
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        setSaving(false);
        router.push("/login"); // Or your login page
        return;
      }

      const response = await fetch(`http://localhost:5000/api/fragrances/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update fragrance");
      }

      toast.success("Fragrance updated successfully!");
      router.push("/admin"); // Redirect to fragrance list page
    } catch (error: any) {
      toast.error(error.message || "Failed to update fragrance");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!fragrance) return;
    setDeleteDialogOpen(false);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        router.push("/login");
        return;
      }
      const response = await fetch(`http://localhost:5000/api/fragrances/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete fragrance");
      }

      toast.success("Fragrance deleted successfully!");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete fragrance");
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

  if (!fragrance) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Fragrance not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Edit Fragrance</h1>
          <p className="text-sm text-gray-500">Update fragrance details</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Fragrance
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Fragrance Image</Label>
              <div className="mt-2 flex flex-col items-center rounded-lg border border-dashed border-gray-300 p-6">
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-md overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Fragrance preview"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 h-64">
                    <ImageIcon className="h-12 w-12" />
                    <p className="mt-2 text-sm">Upload an image</p>
                    <p className="text-xs text-gray-500">(e.g., bottle shot)</p>
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
                {imagePreview && !newImageFile && fragrance.images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">Current image. Select a new file to replace it.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={fragrance.name}
                onChange={(e) => setFragrance({...fragrance, name: e.target.value})}
                placeholder="Enter fragrance name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={fragrance.description}
                onChange={(e) => setFragrance({...fragrance, description: e.target.value})}
                placeholder="Enter detailed description (e.g., notes, inspiration)"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={fragrance.price}
                  onChange={(e) => setFragrance({...fragrance, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={fragrance.stock}
                  onChange={(e) => setFragrance({...fragrance, stock: parseInt(e.target.value, 10) || 0})}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={fragrance.category}
                onChange={(e) => setFragrance({...fragrance, category: e.target.value})}
                placeholder="e.g., Eau de Parfum, Floral, Men's"
                required
              />
            </div>
            {/* Add inputs for other fragrance-specific fields here if needed */}
            {/* Example:
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={fragrance.brand || ""}
                onChange={(e) => setFragrance({...fragrance, brand: e.target.value})}
                placeholder="Enter brand name"
              />
            </div>
            */}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={saving || loading}>
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
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ease-in-out scale-100">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Delete Fragrance</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete the fragrance "<strong>{fragrance.name}</strong>"? This action cannot be undone.
              </p>
              
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
      )}
    </div>
  );
}