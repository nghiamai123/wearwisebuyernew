"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNotification } from "@/apiServices/NotificationService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateDiscount } from "@/apiServices/discounts/page";

export default function EditDiscountDialog({
  isOpen,
  onClose,
  onEdit,
  discount,
}) {
  const [editedDiscount, setEditedDiscount] = useState(discount);
  const [errors, setErrors] = useState({});
  const notify = useNotification();

  useEffect(() => {
    setEditedDiscount(discount);
    setErrors({});
  }, [discount]);

  const handleEditDiscount = async () => {
    try {
      setErrors({}); // Xóa lỗi trước khi gửi

      const formData = new FormData();
      const hasChanged = (original, edited) =>
        original !== edited && edited !== undefined && edited !== null;

      if (hasChanged(discount.code, editedDiscount.code)) {
        formData.append("code", editedDiscount.code || "");
      }
      if (hasChanged(discount.description, editedDiscount.description)) {
        formData.append("description", editedDiscount.description || "");
      }
      if (hasChanged(discount.percentage, editedDiscount.percentage)) {
        formData.append("percentage", editedDiscount.percentage || "");
      }
      if (hasChanged(discount.start_date, editedDiscount.start_date)) {
        formData.append("start_date", editedDiscount.start_date || "");
      }
      if (hasChanged(discount.end_date, editedDiscount.end_date)) {
        formData.append("end_date", editedDiscount.end_date || "");
      }

      if (formData.entries().next().done === false) {
        await updateDiscount(editedDiscount.id, formData);
        onEdit(editedDiscount);
        notify("Discount updated successfully! ✅", "success");
        onClose();
      } else {
        console.log("No changes detected, skipping API call.");
      }
    } catch (error) {
      setErrors(error.data?.errors || {});

      notify(
        error.data?.errors
          ? "Please correct the errors and try again! ❌"
          : "Failed to update discount! ❌",
        "error"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full h-auto max-h-[90vh] overflow-y-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Discount</DialogTitle>
          <DialogDescription className="text-gray-500">
            Update the discount details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-code">Code</Label>
            <Input
              id="edit-code"
              value={editedDiscount?.code}
              onChange={(e) =>
                setEditedDiscount({ ...editedDiscount, code: e.target.value })
              }
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-percentage">Percentage</Label>
            <Input
              id="edit-percentage"
              type="number"
              value={editedDiscount?.percentage}
              onChange={(e) =>
                setEditedDiscount({
                  ...editedDiscount,
                  percentage: e.target.value,
                })
              }
            />
            {errors.percentage && (
              <p className="text-red-500 text-sm">{errors.percentage[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-start_date">Start Date</Label>
              <Input
                id="edit-start_date"
                type="date"
                value={editedDiscount?.start_date || ""}
                onChange={(e) =>
                  setEditedDiscount({
                    ...editedDiscount,
                    start_date: e.target.value,
                  })
                }
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">{errors.start_date[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-end_date">End Date</Label>
              <Input
                id="edit-end_date"
                type="date"
                value={editedDiscount?.end_date || ""}
                onChange={(e) =>
                  setEditedDiscount({
                    ...editedDiscount,
                    end_date: e.target.value,
                  })
                }
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm">{errors.end_date[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editedDiscount?.description}
              onChange={(e) =>
                setEditedDiscount({
                  ...editedDiscount,
                  description: e.target.value,
                })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description[0]}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleEditDiscount}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
