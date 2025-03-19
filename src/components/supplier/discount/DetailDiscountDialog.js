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

export default function DetailDiscountDialog({ isOpen, onClose, discount }) {
  const [detailDiscount, setDetailDiscount] = useState(discount);

  useEffect(() => {
    setDetailDiscount(discount);
  }, [discount]);

  if (!discount) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full h-auto max-h-[90vh] overflow-y-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Discount</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="detail-code">Code</Label>
            <Input id="detail-code" value={detailDiscount?.code} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-percentage">Percentage</Label>
            <Input
              id="detail-percentage"
              value={`${detailDiscount?.percentage}%`}
              disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="detail-start_date">Start Date</Label>
              <Input
                id="detail-start_date"
                type="date"
                value={detailDiscount?.start_date}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-end_date">End end_date</Label>
              <Input
                id="detail-end_date"
                type="date"
                value={detailDiscount?.end_date}
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-description">Description</Label>
            <Textarea
              id="detail-description"
              value={detailDiscount?.description}
              disabled
            />
          </div>
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
