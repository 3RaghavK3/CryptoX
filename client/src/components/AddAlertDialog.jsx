import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

import { formatCurrency } from "../lib/currency";

export function AddAlertDialog({ coinId, currentPrice }) {
  const { user } = useAuth();
  const prefCurrency = user?.preferredCurrency || "USD";
  const multiplier = user?.currencyMultiplier || 1;
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(currentPrice ? (currentPrice * multiplier * 1.05).toFixed(2) : "");
  const [type, setType] = useState("Goes Above");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error("Please enter a valid target price");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          coin_id: coinId,
          type: type === "Goes Above" ? "PRICE_ABOVE" : "PRICE_BELOW",
          price: Number(price) / multiplier,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add alert");

      setOpen(false);
      navigate("/profile?tab=alerts");
      toast.success("Alert created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<button type="button" className="flex items-center justify-center p-0 m-0 bg-transparent border-none outline-none"><Bell className="cursor-pointer text-slate-400 hover:text-yellow-400 transition-colors" size={20} /></button>}
      />
      <DialogContent className="bg-[#0d1421] text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Set Alert for {coinId}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Alert Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="Goes Above">Price Goes Above</SelectItem>
                <SelectItem value="Goes Below">Price Goes Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Target Price ({prefCurrency})</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              step="any"
            />
            <p className="text-xs text-slate-500">Current Price: {formatCurrency(currentPrice, prefCurrency, multiplier)}</p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
            {loading ? "Saving..." : "Create Alert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
