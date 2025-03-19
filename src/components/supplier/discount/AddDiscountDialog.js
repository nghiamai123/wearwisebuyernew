"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useNotification } from "@/apiServices/NotificationService";

export default function AddProductDialog({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    start_date: "",
    end_date: "",
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const notify = useNotification();
  const [errors, setErrors] = useState({});
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleAddDiscount = async () => {
    setLoading(true);
    setErrors({});
    try {
      const form = new FormData();
      form.append("code", formData.code);
      form.append("percentage", formData.percentage);
      form.append("start_date", formData.start_date);
      form.append("end_date", formData.end_date);
      form.append("description", formData.description);

      const response = await fetch(`${API_BASE_URL}/api/discounts`, {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        notify("✅ Add discount successful!", "success");
        onAdd(result.data);
        setFormData({
          code: "",
          description: "",
          start_date: "",
          end_date: "",
          percentage: 0,
        });
        onClose();
      } else {
        notify(" Error adding discount!", "error");
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
          <DialogTitle className="text-xl">Add New Discount</DialogTitle>
          <DialogDescription className="text-gray-500">
            Enter the details below to add a discount to the inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
            {errors.code && <p className="text-red-500">{errors.code[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
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
          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage</Label>
            <Input
              id="percentage"
              type="number"
              value={formData.percentage}
              onChange={(e) =>
                setFormData({ ...formData, percentage: e.target.value })
              }
            />
            {errors.percentage && (
              <p className="text-red-500">{errors.percentage[0]}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
              {errors.start_date && (
                <p className="text-red-500">{errors.start_date[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
              {errors.end_date && (
                <p className="text-red-500">{errors.end_date[0]}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleAddDiscount} disabled={loading}>
            {loading ? "Adding..." : "Add Discount"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
