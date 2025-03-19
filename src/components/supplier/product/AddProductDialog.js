 "use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSizes } from "@/apiServices/size/page";
import { getColors } from "@/apiServices/colors/page";
import { X } from "lucide-react";
import { getSupplierByUserID } from "@/apiServices/suppliers/page";
import { useNotification } from "@/apiServices/NotificationService";
import { getDiscounts } from "@/apiServices/discounts/page";
import { useData } from "@/Context/DataContext";

export default function AddProductDialog({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    quantity: 0,
    supplier_id: "",
    images: [],
    main_image: "",
    colors: [],
    sizes: [],
    discounts: [],
  });
  const [loading, setLoading] = useState(false);
  const notify = useNotification();
  const [errors, setErrors] = useState({});
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { sizes, colors, discounts } = useData();

  useEffect(() => {
    const fetchSupplier = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      try {
        const user = JSON.parse(userData);
        const supplier = await getSupplierByUserID(user.id);
        setFormData((prev) => ({
          ...prev,
          supplier_id: supplier.id,
        }));
      } catch (error) {
        console.error("Fetch supplier error:", error);
      }
    };
    fetchSupplier();
  }, []);

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "main") {
      setFormData({ ...formData, main_image: files[0] });
    } else {
      setFormData({
        ...formData,
        images: files.slice(0, 3),
      });
    }
  };

  const removeSubImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const removeImage = (type, index = null) => {
    if (type === "main") {
      setFormData({ ...formData, main_image: null });
    } else {
      const updatedImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: updatedImages });
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    setErrors({});
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", Number(formData.price));
      form.append("quantity", Number(formData.quantity));
      form.append("category", formData.category);
      form.append("supplier_id", formData.supplier_id);
      if (Array.isArray(formData.sizes) && formData.sizes.length > 0) {
        formData.sizes.forEach((size) => {
          if (size.value !== undefined) {
            form.append("sizes[]", size.value);
          }
        });
      } else {
        console.warn("⚠️ formData.sizes is empty or invalid!");
      }
      if (Array.isArray(formData.colors) && formData.colors.length > 0) {
        formData.colors.forEach((color) => {
          if (color.value !== undefined) {
            form.append("colors[]", color.value);
          }
        });
      } else {
        console.warn("⚠️ formData.colors is empty or invalid!");
      }

      if (Array.isArray(formData.discounts) && formData.discounts.length > 0) {
        formData.discounts.forEach((discount) => {
          if (discount.value !== undefined) {
            form.append("discounts[]", discount.value);
          }
        });
      } else {
        console.warn("⚠️ formData.discounts is empty or invalid!");
      }
      if (formData.main_image) {
        form.append("main_image", formData.main_image);
      } else {
        console.warn("⚠️ main_image is missing!");
      }

      if (Array.isArray(formData.images) && formData.images.length > 0) {
        formData.images.forEach((img) => {
          form.append("images[]", img);
        });
      } else {
        console.warn("⚠️ images is empty or not an array!");
      }

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        notify("✅ Add product successful!", "success");
        onAdd(result.data);
        setFormData({
          name: "",
          category: "",
          price: "",
          quantity: "",
          sizes: [],
          colors: [],
          discounts: [],
          main_image: null,
          images: [],
          description: "",
          supplier_id: "",
        });
        onClose();
      } else {
        notify(" Error adding product!", "error");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      notify(" Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full h-auto max-h-[90vh] overflow-y-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Product</DialogTitle>
          <DialogDescription className="text-gray-500">
            Enter the details below to add a product to the inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              {errors.category && (
                <p className="text-red-500">{errors.category[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discounts">Discount</Label>
              <MultiSelect
                id="discounts"
                options={discounts.map((discount) => ({
                  label: `${discount.code} - ${Math.round(
                    discount.percentage
                  )}%`,
                  value: discount.id,
                }))}
                value={formData.discounts}
                onChange={(values) =>
                  setFormData({ ...formData, discounts: values })
                }
              />
              {errors.discounts && (
                <p className="text-red-500">{errors.discounts[0]}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              {errors.price && (
                <p className="text-red-500">{errors.price[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              {errors.quantity && (
                <p className="text-red-500">{errors.quantity[0]}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sizes">Size</Label>
              <MultiSelect
                id="sizes"
                options={sizes.map((size) => ({
                  label: size.name,
                  value: size.id,
                }))}
                value={formData.sizes}
                onChange={(values) =>
                  setFormData({ ...formData, sizes: values })
                }
              />
              {errors.sizes && (
                <p className="text-red-500">{errors.sizes[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="colors">Color</Label>
              <MultiSelect
                id="colors"
                options={colors.map((color) => ({
                  label: color.name,
                  value: color.id,
                }))}
                value={formData.colors}
                onChange={(values) =>
                  setFormData({ ...formData, colors: values })
                }
              />
              {errors.colors && (
                <p className="text-red-500">{errors.colors[0]}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Main Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "main")}
            />
            {formData.main_image && (
              <div className="relative w-32 h-32 mt-2">
                <img
                  src={URL.createObjectURL(formData.main_image)}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={() => removeImage("main")}
                >
                  {" "}
                  <X size={16} />{" "}
                </button>
              </div>
            )}
            {errors.main_image && (
              <p className="text-red-500">{errors.main_image[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Additional Images (Max 3)</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e, "sub")}
            />
            <div className="flex gap-2 mt-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="Sub"
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeSubImage(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {errors.images && (
                <p className="text-red-500">{errors.images[0]}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500">{errors.description[0]}</p>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleAddProduct} disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
