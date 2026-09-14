import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Bell, Globe, Key, Search, BellRing, LogOut, Trash2, Pencil, ArrowUp, ArrowDown, HelpCircle, ChevronRight, X, Loader2 } from "lucide-react";
import { CoinSearch } from './CoinSearch';
import { Loading } from './Loading';
import { formatCurrency } from '../lib/currency';
import { toast } from "sonner";

const SUPPORTED_CURRENCIES = [
  "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "EUR", "GBP",
  "HKD", "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR",
  "NOK", "NZD", "PHP", "PLN", "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR",
];

function GeneralTab({ user, checkAuth, logout }) {
  const [selectedCurrency, setSelectedCurrency] = useState(user?.preferredCurrency || "USD");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/currency`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency: selectedCurrency }),
        credentials: 'include',
      });
      if (res.ok) {
        await checkAuth(); // refresh auth context
        toast.success("Preferences saved successfully!");
      }
    } catch (error) {
      console.error('Failed to update currency', error);
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">General Settings</h2>
        <p className="text-slate-400">Manage your account details and preferences.</p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Account Details</h3>
          <p className="text-sm text-slate-400 mb-6">This information is tied to your account.</p>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <div className="bg-slate-900/50 p-3 rounded-md border border-slate-800 text-slate-400">{user.name}</div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="bg-slate-900/50 p-3 rounded-md border border-slate-800 text-slate-400">{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Preferred Currency</h3>
            <p className="text-sm text-slate-400 mb-4">Select the currency you want all prices, market caps, and volumes to be displayed in across the application.</p>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-full bg-slate-900/50 border-slate-800 text-white h-11">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-60">
                  {SUPPORTED_CURRENCIES.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">This will be used throughout the website.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Sign Out</h3>
            <p className="text-sm text-slate-400">Sign out of your account on this device.</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="outline" className="border-red-900/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-transparent gap-2 w-full md:w-auto">
                <LogOut size={16} /> Log Out
              </Button>
            }
          />
          <AlertDialogContent className="bg-[#0d1421] text-white border-slate-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign Out</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                Are you sure you want to sign out of your account on this device?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-slate-800">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout} className="bg-red-600 text-white hover:bg-red-700">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors h-11 px-6"
          onClick={handleSave}
          disabled={isSaving || selectedCurrency === user?.preferredCurrency}
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}

function AlertsTab({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlertCoin, setNewAlertCoin] = useState(null); // Holds the coin object
  const [newAlertType, setNewAlertType] = useState('Goes Above');
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [addingAlert, setAddingAlert] = useState(false);
  const [activeSort, setActiveSort] = useState('newest');
  const [pastSort, setPastSort] = useState('newest');
  const [editAlert, setEditAlert] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const prefCurrency = user?.preferredCurrency || "USD";
  const multiplier = user?.currencyMultiplier || 1;

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = async () => {
    if (!newAlertCoin || !newAlertPrice) {
      toast.error("Please select a coin and set a target price.");
      return;
    }
    
    const coinId = newAlertCoin.id;
    const isDuplicate = alerts.some(a => a.coin_id === coinId && a.type === newAlertType);
    if (isDuplicate) {
      toast.error("You already have an alert set for this coin and condition. Please edit or delete the existing one.");
      return;
    }

    setAddingAlert(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          coin_id: coinId,
          type: newAlertType === 'Goes Above' ? 'PRICE_ABOVE' : 'PRICE_BELOW',
          price: Number(newAlertPrice) / multiplier,
        }),
      });
      if (res.ok) {
        setNewAlertCoin(null);
        setNewAlertPrice('');
        toast.success("Alert created successfully!");
        setAlerts(prev => [{
            coin_id: coinId,
            type: newAlertType === 'Goes Above' ? 'PRICE_ABOVE' : 'PRICE_BELOW',
            price: Number(newAlertPrice) / multiplier,
            created_at: new Date().toISOString(),
            status: 'ACTIVE',
            coin_name: newAlertCoin.name,
            coin_symbol: newAlertCoin.symbol,
            coin_image: newAlertCoin.large || newAlertCoin.image_url,
            current_price: newAlertCoin.current_price,
            price_change_percentage_24h: newAlertCoin.price_change_percentage_24h
        }, ...prev]);
      } else {
        toast.error("Failed to create alert");
      }
    } catch {
      toast.error("Error creating alert");
    } finally {
      setAddingAlert(false);
    }
  };

  const handleUpdateAlert = async () => {
    if (!editPrice || isNaN(Number(editPrice)) || Number(editPrice) <= 0) return;
    setIsEditing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts/${editAlert.coin_id}/${editAlert.type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ price: Number(editPrice) / multiplier }),
      });
      if (res.ok) {
        toast.success("Alert updated");
        setAlerts(prev => prev.map(a => 
          (a.coin_id === editAlert.coin_id && a.type === editAlert.type) 
            ? { ...a, price: Number(editPrice) / multiplier } 
            : a
        ));
        setEditAlert(null);
      } else {
        toast.error("Failed to update alert");
      }
    } catch {
      toast.error("Error updating alert");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (coinId, type) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alerts/${coinId}/${type}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Alert deleted");
        setAlerts(prev => prev.filter(a => !(a.coin_id === coinId && a.type === type)));
      } else {
        toast.error("Failed to delete alert");
      }
    } catch {
      toast.error("Error deleting alert");
    }
  };

  const activeAlerts = alerts
    .filter(a => a.status === 'ACTIVE')
    .sort((a, b) => activeSort === 'newest' ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
  const pastAlerts = alerts
    .filter(a => a.status === 'COMPLETED')
    .sort((a, b) => pastSort === 'newest' ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const renderActiveTable = () => {
    if (loading) {
      return (
        <div className="p-12 flex justify-center items-center border-t border-slate-800">
          <Loading />
        </div>
      );
    }
    if (activeAlerts.length === 0) {
      return (
        <div className="p-8 text-center text-slate-500 border-t border-slate-800">
          No active alerts.
        </div>
      );
    }
    return (
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400 h-10 font-normal">Coin</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Condition</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Target Price ({prefCurrency})</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Current Price ({prefCurrency})</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Created At</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeAlerts.map((alert, idx) => (
            <TableRow key={idx} className="border-slate-800/50 hover:bg-slate-800/20">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  {alert.coin_image ? (
                    <img src={alert.coin_image} alt={alert.coin_name} className="w-8 h-8 rounded-full bg-slate-800" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                      {alert.coin_id.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{alert.coin_name || alert.coin_id}</span>
                    <span className="text-xs text-slate-400 uppercase">{alert.coin_symbol || alert.coin_id}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={`flex items-center gap-1.5 ${alert.type === 'PRICE_ABOVE' ? 'text-green-500' : 'text-red-500'}`}>
                  {alert.type === 'PRICE_ABOVE' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span>{alert.type === 'PRICE_ABOVE' ? 'Goes Above' : 'Goes Below'}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-white">{formatCurrency(alert.price, prefCurrency, multiplier)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-white">{alert.current_price ? formatCurrency(alert.current_price, prefCurrency, multiplier) : '-'}</span>
                  {alert.price_change_percentage_24h != null && (
                    <span className={`text-xs ${Number(alert.price_change_percentage_24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Number(alert.price_change_percentage_24h) > 0 ? '+' : ''}{Number(alert.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-slate-400">
                {new Date(alert.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditAlert(alert); setEditPrice((alert.price * multiplier).toFixed(2)); }} className="h-8 w-8 bg-transparent border-slate-700 text-slate-400 hover:text-white">
                    <Pencil size={14} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(alert.coin_id, alert.type)} className="h-8 w-8 bg-transparent border-red-900/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/30">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderPastTable = () => {
    if (loading) {
      return (
        <div className="p-12 flex justify-center items-center border-t border-slate-800">
          <Loading />
        </div>
      );
    }
    if (pastAlerts.length === 0) {
      return <div className="text-center p-8 text-slate-500 border-t border-slate-800">No past alerts found.</div>;
    }
    return (
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400 h-10 font-normal">Coin</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Condition</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Target Price ({prefCurrency})</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Triggered Price ({prefCurrency})</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Status</TableHead>
            <TableHead className="text-slate-400 h-10 font-normal">Triggered At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastAlerts.map((alert, idx) => (
            <TableRow key={idx} className="border-slate-800/50 hover:bg-slate-800/20">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  {alert.coin_image ? (
                    <img src={alert.coin_image} alt={alert.coin_name} className="w-8 h-8 rounded-full bg-slate-800" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                      {alert.coin_id.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{alert.coin_name || alert.coin_id}</span>
                    <span className="text-xs text-slate-400 uppercase">{alert.coin_symbol || alert.coin_id}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={`flex items-center gap-1.5 ${alert.type === 'PRICE_ABOVE' ? 'text-green-500' : 'text-red-500'}`}>
                  {alert.type === 'PRICE_ABOVE' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span>{alert.type === 'PRICE_ABOVE' ? 'Goes Above' : 'Goes Below'}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-white">{formatCurrency(alert.price, prefCurrency, multiplier)}</TableCell>
              <TableCell className="font-medium text-white">{alert.current_price ? formatCurrency(alert.current_price, prefCurrency, multiplier) : '-'}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 border border-green-500/20">
                  Triggered
                </span>
              </TableCell>
              <TableCell className="text-slate-400">
                {new Date(alert.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="max-w-5xl w-full mx-auto pb-12">
      <div className="flex items-center text-sm text-slate-400 mb-6">
        <span>Settings</span>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-white">Price Alerts</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Price Alerts</h2>
          <p className="text-slate-400">Set price alerts for your favorite assets and get notified when they reach your target.</p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline" className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 gap-2 shrink-0">
                <HelpCircle size={16} /> How it works?
              </Button>
            }
          />
          <DialogContent className="bg-[#0d1421] text-white border-slate-800">
            <DialogHeader>
              <DialogTitle>How Price Alerts Work</DialogTitle>
              <DialogDescription render={<div className="text-slate-400 pt-4 space-y-4" />}>
                <p>1. <strong>Set a condition:</strong> Choose a target coin and whether you want to be notified when it goes <em>above</em> or <em>below</em> your target price.</p>
                <p>2. <strong>Get notified:</strong> Once the coin crosses your specified threshold, you will receive an email notification.</p>
                <div className="p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-blue-300 text-sm mt-4">
                  <strong>Note:</strong> You will be mailed only once per alert to prevent bombarding. Once triggered, the alert moves to the Past Alerts tab.
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editAlert} onOpenChange={(open) => !open && setEditAlert(null)}>
        <DialogContent className="bg-[#0d1421] text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update the target price for your {editAlert?.coin_name || editAlert?.coin_id} alert.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-slate-400 block mb-2">Target Price ({prefCurrency})</label>
            <Input 
              type="number" 
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              step="any"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditAlert(null)} className="border-slate-700 bg-transparent text-white hover:bg-slate-800">Cancel</Button>
            <Button onClick={handleUpdateAlert} disabled={isEditing} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Create Alert Card */}
        <div id="create-alert" className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-1">Add New Alert</h3>
          <p className="text-sm text-slate-400 mb-6">Choose a coin, set a condition and target price. We'll notify you when it's reached.</p>
          
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Coin</label>
              {!newAlertCoin ? (
                <CoinSearch 
                  onSelect={(coin) => setNewAlertCoin(coin)} 
                  placeholder="Search or select a coin" 
                  className="w-full"
                />
              ) : (
                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl h-10 px-3 w-full">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={newAlertCoin.large} alt={newAlertCoin.name} className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-medium text-white truncate">{newAlertCoin.name}</span>
                    <span className="text-xs text-slate-500 uppercase">{newAlertCoin.symbol}</span>
                  </div>
                  <button onClick={() => setNewAlertCoin(null)} className="text-slate-400 hover:text-white p-1">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 w-full lg:max-w-[220px]">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Condition</label>
              <Select value={newAlertType} onValueChange={setNewAlertType}>
                <SelectTrigger className="bg-slate-900 border-slate-700 h-10 text-white rounded-xl focus:ring-slate-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white rounded-xl">
                  <SelectItem value="Goes Above">Goes Above</SelectItem>
                  <SelectItem value="Goes Below">Goes Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full lg:max-w-[220px]">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Target Price ({prefCurrency})</label>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={newAlertPrice} 
                  onChange={e => setNewAlertPrice(e.target.value)} 
                  className="bg-slate-900 border-slate-700 px-3 h-10 text-white rounded-xl focus-visible:ring-slate-500" 
                />
              </div>
            </div>
            <Button 
              onClick={handleAddAlert} 
              disabled={addingAlert} 
              className="w-full lg:w-auto h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
            >
              {addingAlert ? "Adding..." : "Add Alert"}
            </Button>
          </div>
        </div>

        {/* Active Alerts Card */}
        <div id="active-alerts" className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Active Alerts ({activeAlerts.length})</h3>
              <p className="text-sm text-slate-400">You'll be notified when these conditions are met.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-slate-400">Sort by</span>
              <Select value={activeSort} onValueChange={setActiveSort}>
                <SelectTrigger className="w-[130px] bg-slate-900 border-slate-800 h-9 text-sm text-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white rounded-lg">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {renderActiveTable()}
        </div>

        {/* Past Alerts Card */}
        <div id="past-alerts" className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Past Alerts ({pastAlerts.length})</h3>
              <p className="text-sm text-slate-400">Here's a history of your triggered or expired alerts.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-slate-400">Sort by</span>
              <Select value={pastSort} onValueChange={setPastSort}>
                <SelectTrigger className="w-[130px] bg-slate-900 border-slate-800 h-9 text-sm text-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white rounded-lg">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {renderPastTable()}
        </div>
      </div>
    </div>
  );
}

export function Profile() {
  const { user, checkAuth, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'alerts' ? 'alerts' : 'general';
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!user) return null;

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full bg-[#0d1421] text-white">
      <aside className="w-64 border-r border-slate-800 flex-shrink-0">
        <div className="bg-[#0d1421] text-white pt-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 px-6">
            <Avatar className="h-10 w-10 border border-slate-700">
              <AvatarFallback className="bg-slate-800 text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">{user.name}</span>
              <span className="text-xs text-slate-400 truncate">Personal Account</span>
            </div>
          </div>
          
          <div className="flex flex-col p-2 space-y-1">
            <Button 
              variant="ghost"
              onClick={() => setActiveTab('general')}
              className={`flex w-full justify-start items-center gap-3 rounded-md px-4 py-6 text-sm transition-colors ${activeTab === 'general' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Settings size={18} />
              <span>General</span>
            </Button>
            <div className="flex flex-col">
              <Button 
                variant="ghost"
                onClick={() => setActiveTab('alerts')}
                className={`flex w-full justify-start items-center gap-3 rounded-md px-4 py-6 text-sm transition-colors ${activeTab === 'alerts' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
              >
                <Bell size={18} />
                <span>Price Alerts</span>
              </Button>
              {activeTab === 'alerts' && (
                <div className="flex flex-col ml-11 mt-1 space-y-1">
                  <a href="#active-alerts" className="text-sm text-slate-400 hover:text-white py-1.5 transition-colors">Active Alerts</a>
                  <a href="#past-alerts" className="text-sm text-slate-400 hover:text-white py-1.5 transition-colors">Past Alerts</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === 'general' && <GeneralTab user={user} checkAuth={checkAuth} logout={logout} />}
        {activeTab === 'alerts' && <AlertsTab user={user} />}
      </main>
    </div>
  );
}
