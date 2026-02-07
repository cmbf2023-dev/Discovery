"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Gift,
  TrendingUp,
  History,
  Shield,
  ChevronRight,
  Coins,
  DollarSign,
  Clock,
  Check,
  AlertCircle,
  Send,
  QrCode,
  Banknote,
  Smartphone,
} from "lucide-react"

interface Transaction {
  id: string
  type: "credit" | "debit" | "gift" | "withdrawal" | "purchase"
  amount: number
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  from?: string
  to?: string
}

interface PaymentMethod {
  id: string
  type: "card" | "bank" | "paypal"
  name: string
  last4: string
  isDefault: boolean
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "credit", amount: 500, description: "Top up via Credit Card", timestamp: "Today, 2:30 PM", status: "completed" },
  { id: "2", type: "gift", amount: 50, description: "Gift from @musiclover", timestamp: "Today, 11:15 AM", status: "completed", from: "musiclover" },
  { id: "3", type: "purchase", amount: -25, description: "Sponsorship Slot Purchase", timestamp: "Yesterday", status: "completed" },
  { id: "4", type: "debit", amount: -100, description: "Sent to @dancequeen", timestamp: "Yesterday", status: "completed", to: "dancequeen" },
  { id: "5", type: "credit", amount: 1250, description: "Creator Earnings - Week 48", timestamp: "Dec 1", status: "completed" },
  { id: "6", type: "withdrawal", amount: -800, description: "Withdrawal to Bank Account", timestamp: "Nov 28", status: "completed" },
  { id: "7", type: "gift", amount: 25, description: "Gift from @gamerpro", timestamp: "Nov 27", status: "completed", from: "gamerpro" },
  { id: "8", type: "purchase", amount: -15, description: "Shop Item: Premium Badge", timestamp: "Nov 25", status: "completed" },
]

const mockPaymentMethods: PaymentMethod[] = [
  { id: "1", type: "card", name: "Visa ending in", last4: "4242", isDefault: true },
  { id: "2", type: "card", name: "Mastercard ending in", last4: "8888", isDefault: false },
  { id: "3", type: "bank", name: "Chase Bank ending in", last4: "1234", isDefault: false },
]

export function WalletPlatform() {
  const { user } = useAuth()
  const [balance] = useState(2847.50)
  const [pendingBalance] = useState(350.00)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "credit": return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "debit": return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "gift": return <Gift className="h-4 w-4 text-pink-500" />
      case "withdrawal": return <Banknote className="h-4 w-4 text-blue-500" />
      case "purchase": return <CreditCard className="h-4 w-4 text-amber-500" />
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700">Completed</Badge>
      case "pending": return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
      case "failed": return <Badge className="bg-red-100 text-red-700">Failed</Badge>
    }
  }

  const filteredTransactions = mockTransactions.filter(t => {
    if (selectedTab === "all") return true
    if (selectedTab === "income") return t.amount > 0
    if (selectedTab === "expenses") return t.amount < 0
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Wallet</h1>
            <p className="text-amber-300 text-sm">Manage your funds</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <History className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 border-0 mb-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-white/30">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-white">{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/70 text-sm">Available Balance</p>
                <p className="text-3xl font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-4 w-4 text-white/70" />
              <span className="text-white/70 text-sm">Pending: </span>
              <span className="text-white font-medium">${pendingBalance.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="0.00" className="pl-10 text-2xl h-14" type="number" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 100, 500].map((amount) => (
                        <Button key={amount} variant="outline" size="sm">
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Method</label>
                      {mockPaymentMethods.slice(0, 2).map((method) => (
                        <button
                          key={method.id}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                            method.isDefault ? "border-amber-500 bg-amber-50" : "border-border"
                          }`}
                        >
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1 text-left">{method.name} {method.last4}</span>
                          {method.isDefault && <Check className="h-4 w-4 text-amber-500" />}
                        </button>
                      ))}
                    </div>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                      Add Funds
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showSend} onOpenChange={setShowSend}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Money</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recipient</label>
                      <Input placeholder="@username or email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="0.00" className="pl-10" type="number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Note (optional)</label>
                      <Input placeholder="Add a message" />
                    </div>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                      Send Money
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <Banknote className="h-4 w-4 mr-1" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        Minimum withdrawal is $50. Processing takes 1-3 business days.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="0.00" className="pl-10" type="number" />
                      </div>
                      <p className="text-xs text-muted-foreground">Available: ${balance.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Withdraw to</label>
                      {mockPaymentMethods.filter(m => m.type === "bank" || m.type === "paypal").map((method) => (
                        <button
                          key={method.id}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-amber-500"
                        >
                          <Banknote className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1 text-left">{method.name} {method.last4}</span>
                        </button>
                      ))}
                    </div>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                      Withdraw Funds
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-slate-400 text-sm">This Month</span>
              </div>
              <p className="text-xl font-bold text-white">+$1,825.00</p>
              <p className="text-xs text-green-400">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-pink-400" />
                <span className="text-slate-400 text-sm">Gifts Received</span>
              </div>
              <p className="text-xl font-bold text-white">$425.00</p>
              <p className="text-xs text-slate-400">From 23 supporters</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <QrCode className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-xs text-slate-300">Scan</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-xs text-slate-300">Pay</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Gift className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-xs text-slate-300">Gift</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-xs text-slate-300">Earn</span>
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">Payment Methods</h2>
          <Button variant="ghost" size="sm" className="text-amber-400">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {mockPaymentMethods.map((method) => (
            <Card key={method.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  {method.type === "card" ? (
                    <CreditCard className="h-5 w-5 text-slate-300" />
                  ) : (
                    <Banknote className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{method.name} {method.last4}</p>
                  {method.isDefault && (
                    <p className="text-xs text-amber-400">Default</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-slate-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 py-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">Transaction History</h2>
          <Button variant="ghost" size="sm" className="text-amber-400">
            See all
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-slate-800 mb-4">
            <TabsTrigger value="all" className="flex-1" onClick={() => setSelectedTab("all")}>All</TabsTrigger>
            <TabsTrigger value="income" className="flex-1" onClick={() => setSelectedTab("income")}>Income</TabsTrigger>
            <TabsTrigger value="expenses" className="flex-1" onClick={() => setSelectedTab("expenses")}>Expenses</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? "bg-green-500/20" : "bg-slate-700"
                }`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{transaction.description}</p>
                  <p className="text-xs text-slate-400">{transaction.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.amount > 0 ? "text-green-400" : "text-white"}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
