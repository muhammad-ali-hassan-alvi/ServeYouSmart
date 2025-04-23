"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

interface Fragrance {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminFragranceTable() {
  const router = useRouter();
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fragranceToDelete, setFragranceToDelete] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFragrance, setNewFragrance] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Fragrance", // Fixed category
    stock: 0,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchFragrances = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/fragnance?pageNumber=${page}&keyword=${searchTerm}`
      );
      const data = await response.json();
      setFragrances(data.fragrances);
      setPages(data.pages);
    } catch{
      toast.error("Failed to fetch fragrances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFragrances();
  }, [page, searchTerm]);

  const handleDelete = async () => {
    if (!fragranceToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/fragnance/${fragranceToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Fragrance deleted successfully");
        fetchFragrances();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete fragrance");
      }
    } catch (error) {
      toast.error("Failed to delete fragrance");
    } finally {
      setDeleteDialogOpen(false);
      setFragranceToDelete(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFragrance({ ...newFragrance, image: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFragrance = async () => {
    if (!newFragrance.image) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newFragrance.name);
    formData.append("description", newFragrance.description);
    formData.append("price", newFragrance.price.toString());
    formData.append("category", newFragrance.category); // Always "Fragrance"
    formData.append("stock", newFragrance.stock.toString());
    formData.append("image", newFragrance.image);

    try {
      const response = await fetch("http://localhost:5000/api/fragnance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Fragrance added successfully");
        setAddModalOpen(false);
        setNewFragrance({
          name: "",
          description: "",
          price: 0,
          category: "Fragrance", // Reset to default
          stock: 0,
          image: null,
        });
        setImagePreview(null);
        fetchFragrances();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add fragrance");
      }
    } catch (error) {
      toast.error("Failed to add fragrance");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Fragrance Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search fragrances..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Fragrance
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : fragrances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No fragrances found
                </TableCell>
              </TableRow>
            ) : (
              fragrances.map((fragrance) => (
                <TableRow key={fragrance._id}>
                  <TableCell>
                    <div className="relative h-12 w-12">
                      <img
                        src={fragrance.images[0] || "/placeholder-fragrance.jpg"}
                        alt={fragrance.name}
                        className="rounded-md object-cover h-full w-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{fragrance.name}</TableCell>
                  <TableCell>Fragrance</TableCell> {/* Fixed category */}
                  <TableCell>${fragrance.price.toFixed(2)}</TableCell>
                  <TableCell>{fragrance.stock}</TableCell>
                  <TableCell>{formatDate(fragrance.createdAt)}</TableCell>
                  <TableCell>{formatDate(fragrance.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/fragnance/edit/${fragrance._id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setFragranceToDelete(fragrance._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            disabled={page === pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              fragrance and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Fragrance Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Fragrance</h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={newFragrance.name}
                  onChange={(e) => setNewFragrance({...newFragrance, name: e.target.value})}
                  placeholder="Fragrance name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={newFragrance.description}
                  onChange={(e) => setNewFragrance({...newFragrance, description: e.target.value})}
                  placeholder="Fragrance description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input
                    type="number"
                    value={newFragrance.price}
                    onChange={(e) => setNewFragrance({...newFragrance, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <Input
                    type="number"
                    value={newFragrance.stock}
                    onChange={(e) => setNewFragrance({...newFragrance, stock: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value="Fragrance"
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFragrance}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Fragrance
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}