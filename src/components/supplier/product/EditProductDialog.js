"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { useNotification } from "@/apiServices/NotificationService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { X } from "lucide-react";
import { updateProduct } from "@/apiServices/products/page"; 
import { useNotification } from "@/apiServices/NotificationService";
import { useData } from "@/Context/DataContext";


export default function EditProductDialog({
  isOpen,
  onClose,
  onEdit,
  product,
}) {
  const [editedProduct, setEditedProduct] = useState(product);
  const { sizes, colors, discounts } = useData();
  const notify = useNotification();
  // const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleEditProduct = async () => {
    try {
      const formData = new FormData();

      const hasChanged = (original, edited) => {
        if (Array.isArray(original) && Array.isArray(edited)) {
          const origIds = (original || []).map((item) => item.id).sort();
          const editIds = (edited || []).map((item) => item.id).sort();
          return JSON.stringify(origIds) !== JSON.stringify(editIds);
        }
        return original !== edited && edited !== undefined && edited !== null;
      };

      if (hasChanged(product.name, editedProduct.name)) {
        formData.append("name", editedProduct.name || "");
      }

      if (hasChanged(product.description, editedProduct.description)) {
        formData.append("description", editedProduct.description || "");
      }

      if (hasChanged(product.price, editedProduct.price)) {
        formData.append("price", editedProduct.price || 0);
      }

      if (hasChanged(product.quantity, editedProduct.quantity)) {
        formData.append("quantity", editedProduct.quantity || 0);
      }

      if (
        hasChanged(product.supplier_id, editedProduct.supplier_id) &&
        editedProduct.supplier_id
      ) {
        formData.append("supplier_id", editedProduct.supplier_id);
      }

      if (
        hasChanged(product.sizes, editedProduct.sizes) &&
        editedProduct.sizes?.length
      ) {
        editedProduct.sizes.forEach((size) => {
          formData.append("sizes[]", size.id);
        });
      }

      if (
        hasChanged(product.colors, editedProduct.colors) &&
        editedProduct.colors?.length
      ) {
        editedProduct.colors.forEach((color) => {
          formData.append("colors[]", color.id);
        });
      }

      if (
        hasChanged(product.discounts, editedProduct.discounts) &&
        editedProduct.discounts?.length
      ) {
        editedProduct.discounts.forEach((discount) => {
          formData.append("discounts[]", discount.id);
        });
      }

      // Xử lý main_image
      if (editedProduct.main_image instanceof File) {
        formData.append("main_image", editedProduct.main_image);
      }

      // Xử lý additional images
      if (editedProduct.images?.length) {
        editedProduct.images.forEach((image) => {
          if (image.file instanceof File) {
            formData.append("images[]", image.file);
          }
        });
      }

      if (formData.entries().next().done === false) {
        await updateProduct(editedProduct.id, formData);
      } else {
        console.log("No changes detected, skipping API call.");
      }
      onEdit(editedProduct);
      notify("Product updated successfully! ✅", "success");
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      notify("Failed to update product! ❌", "error");
    }
  };

  const selectedDiscounts = editedProduct?.discounts?.map((discount) => ({
    value: discount.id,
    label: `${discount.code} - ${Math.round(discount.percentage)}%`,
  }));

  const selectedSizes = editedProduct?.sizes?.map((size) => ({
    value: size.id,
    label: size.name,
  }));

  const selectedColors = editedProduct?.colors?.map((color) => ({
    value: color.id,
    label: color.name,
  }));
  const handleImageChange = (e, type) => {
    if (!e) {
      setEditedProduct((prev) => ({
        ...prev,
        main_image: null,
      }));
      return;
    }

    const file = e.target.files[0];
    if (file) {
      setEditedProduct((prev) => ({
        ...prev,
        main_image: file,
        main_image_preview: URL.createObjectURL(file), // Add preview URL
      }));
    }
  };

  const handleRemoveSubImage = (index) => {
    setEditedProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file: file,
        url: URL.createObjectURL(file), // Create preview URL
      }));

      setEditedProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full h-auto max-h-[90vh] overflow-y-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Product</DialogTitle>
          <DialogDescription className="text-gray-500">
            Update the product details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Product Name</Label>
            <Input
              id="edit-name"
              value={editedProduct?.name}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={editedProduct?.category}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount">Discount</Label>
              <MultiSelect
                id="edit-discount"
                options={discounts.map((discount) => ({
                  label: `${discount.code} - ${Math.round(
                    discount.percentage
                  )}%`,
                  value: discount.id,
                }))}
                value={selectedDiscounts}
                onChange={(values) => {
                  setEditedProduct({
                    ...editedProduct,
                    discounts: values.map((v) =>
                      discounts.find((d) => d.id === v.value)
                    ),
                  });
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (VND)</Label>
              <Input
                id="edit-price"
                type="number"
                value={editedProduct?.price || 0}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={editedProduct?.quantity}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-size">Size</Label>
              <MultiSelect
                id="edit-size"
                options={sizes.map((size) => ({
                  label: size.name,
                  value: size.id,
                }))}
                value={selectedSizes}
                onChange={(values) => {
                  setEditedProduct({
                    ...editedProduct,
                    sizes: values.map((v) =>
                      sizes.find((s) => s.id === v.value)
                    ),
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <MultiSelect
                id="edit-color"
                options={colors.map((color) => ({
                  label: color.name,
                  value: color.id,
                }))}
                value={selectedColors}
                onChange={(values) => {
                  setEditedProduct({
                    ...editedProduct,
                    colors: values.map((v) =>
                      colors.find((c) => c.id === v.value)
                    ),
                  });
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editedProduct?.description}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Main Image</Label>
            {editedProduct?.main_image ? (
              <div className="relative w-fit">
                <img
                  src={
                    editedProduct.main_image_preview || editedProduct.main_image
                  }
                  alt="Main"
                  className="max-h-48 object-contain rounded-lg shadow-md"
                />
                <button
                  onClick={() => handleImageChange(null, "mainImage")}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                >
                  <X className="w-6 h-6 text-red-500" size={16} />
                </button>
              </div>
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "mainImage")}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="flex gap-2 flex-wrap">
              {editedProduct?.images?.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt="Sub"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleRemoveSubImage(index)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSubImageChange}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleEditProduct}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
