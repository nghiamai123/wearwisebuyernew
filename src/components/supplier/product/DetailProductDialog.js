import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DetailProductDialog({
  isOpen,
  onClose,
  product,
}) {
  const [detailProduct, setDetailProduct] = useState(product);

  useEffect(() => {
    setDetailProduct(product);
  }, [product]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full h-auto max-h-[90vh] overflow-y-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="detail-name">Product Name</Label>
            <Input id="detail-name" value={detailProduct?.name} disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="detail-category">Category</Label>
              <Input
                id="detail-category"
                value={detailProduct?.category}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-discount">Discount</Label>
              <Input
                id="detail-discount"
                value={[
                  ...new Set(
                    product.discounts?.map(
                      (discount) => `${Math.round(discount.percentage)}%`
                    )
                  ),
                ].join(", ")}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="detail-price">Price</Label>
              <Input
                id="detail-price"
                type="text"
                value={`${detailProduct?.price || 0} VND`}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-quantity">Quantity</Label>
              <Input
                id="detail-quantity"
                type="number"
                value={detailProduct?.quantity}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="detail-size">Size</Label>
              <Input
                id="detail-size"
                value={[
                  ...new Set(detailProduct?.sizes?.map((size) => size?.name)),
                ].join(", ")}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-color">Color</Label>
              <Input
                id="detail-color"
                value={[
                  ...new Set(detailProduct?.colors?.map((color) => color.name)),
                ].join(", ")}
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-description">Description</Label>
            <Textarea
              id="detail-description"
              value={detailProduct?.description}
              disabled
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="detail-image">Image</Label>
          <img
            src={detailProduct?.main_image}
            alt={detailProduct?.name}
            className="max-h-48 object-contain rounded-lg shadow-md"
          />
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
