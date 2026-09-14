import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SUPPORTED_CURRENCIES = [
  "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "EUR", "GBP",
  "HKD", "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR",
  "NOK", "NZD", "PHP", "PLN", "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR",
];

export function Profile() {
  const { user, checkAuth } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.preferredCurrency) {
      setSelectedCurrency(user.preferredCurrency);
    }
  }, [user]);

  if (!user) return null;

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
        await checkAuth(); // refresh auth context to get updated multiplier and pref
      }
    } catch (error) {
      console.error('Failed to update currency', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center text-white mt-10">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white shadow-xl">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
            <AvatarFallback className="bg-slate-700 text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
            <CardDescription className="text-slate-400 mt-1">{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Preferred Currency</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-full bg-slate-950 border-slate-700 text-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-60">
                {SUPPORTED_CURRENCIES.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={handleSave}
            disabled={isSaving || selectedCurrency === user?.preferredCurrency}
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
