"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  MessageSquare,
  Briefcase,
  Target,
  BarChart3,
  Globe,
  CheckCircle2,
  Send,
  Filter,
  Plus,
  Eye,
  Heart,
  Share2,
  Calendar,
  Clock,
  ArrowUpRight,
  Sparkles,
  Award,
  FileText,
  Video,
  Megaphone,
} from "lucide-react"

const featuredCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahjcreates",
    avatar: "/placeholder.svg",
    category: "Lifestyle",
    followers: "2.5M",
    engagement: "8.2%",
    verified: true,
    rating: 4.9,
    completedDeals: 156,
    avgDealValue: "$5,000",
    specialties: ["Product Reviews", "Brand Ambassadorship", "Live Shopping"],
  },
  {
    id: 2,
    name: "Mike Chen",
    username: "@mikefoodie",
    avatar: "/placeholder.svg",
    category: "Food & Dining",
    followers: "3.8M",
    engagement: "6.5%",
    verified: true,
    rating: 4.8,
    completedDeals: 203,
    avgDealValue: "$8,500",
    specialties: ["Restaurant Reviews", "Recipe Creation", "Cooking Streams"],
  },
  {
    id: 3,
    name: "TechGuru Alex",
    username: "@techalexreviews",
    avatar: "/placeholder.svg",
    category: "Technology",
    followers: "1.9M",
    engagement: "9.1%",
    verified: true,
    rating: 4.9,
    completedDeals: 89,
    avgDealValue: "$12,000",
    specialties: ["Tech Reviews", "Unboxing", "Tutorials"],
  },
  {
    id: 4,
    name: "Fitness Maya",
    username: "@mayafitlife",
    avatar: "/placeholder.svg",
    category: "Health & Fitness",
    followers: "4.2M",
    engagement: "7.8%",
    verified: true,
    rating: 4.7,
    completedDeals: 178,
    avgDealValue: "$6,200",
    specialties: ["Workout Programs", "Supplement Reviews", "Wellness Tips"],
  },
]

const activeCampaigns = [
  {
    id: 1,
    title: "Summer Collection Launch",
    brand: "Fashion Forward",
    budget: "$25,000",
    creators: 5,
    status: "active",
    progress: 65,
    startDate: "Jan 15",
    endDate: "Feb 28",
    views: "2.5M",
    engagement: "185K",
  },
  {
    id: 2,
    title: "New Product Reveal",
    brand: "TechCorp",
    budget: "$50,000",
    creators: 8,
    status: "active",
    progress: 40,
    startDate: "Jan 20",
    endDate: "Mar 15",
    views: "1.8M",
    engagement: "142K",
  },
  {
    id: 3,
    title: "Health Awareness Week",
    brand: "WellnessPlus",
    budget: "$15,000",
    creators: 3,
    status: "pending",
    progress: 0,
    startDate: "Feb 1",
    endDate: "Feb 7",
    views: "0",
    engagement: "0",
  },
]

const opportunities = [
  {
    id: 1,
    business: "Nike",
    logo: "/placeholder.svg",
    title: "Athletic Wear Campaign",
    budget: "$10,000 - $25,000",
    type: "Product Placement",
    duration: "3 months",
    requirements: ["500K+ followers", "Sports/Fitness niche", "High engagement"],
    applicants: 45,
    deadline: "Feb 15, 2026",
  },
  {
    id: 2,
    business: "Samsung",
    logo: "/placeholder.svg",
    title: "Galaxy S26 Launch",
    budget: "$15,000 - $40,000",
    type: "Review & Unboxing",
    duration: "1 month",
    requirements: ["1M+ followers", "Tech niche", "Video content"],
    applicants: 89,
    deadline: "Feb 10, 2026",
  },
  {
    id: 3,
    business: "Starbucks",
    logo: "/placeholder.svg",
    title: "Spring Menu Promotion",
    budget: "$5,000 - $12,000",
    type: "Brand Ambassador",
    duration: "2 months",
    requirements: ["250K+ followers", "Lifestyle/Food niche"],
    applicants: 156,
    deadline: "Feb 20, 2026",
  },
]

const messages = [
  {
    id: 1,
    from: "Nike Marketing",
    avatar: "/placeholder.svg",
    message: "We're interested in collaborating with you for our upcoming campaign...",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    from: "Samsung Partners",
    avatar: "/placeholder.svg",
    message: "Thank you for your application. We'd like to schedule a call...",
    time: "5h ago",
    unread: true,
  },
  {
    id: 3,
    from: "Local Coffee Co.",
    avatar: "/placeholder.svg",
    message: "Your content was amazing! We'd love to extend our partnership...",
    time: "1d ago",
    unread: false,
  },
]

export function BusinessPlatform() {
  const [activeTab, setActiveTab] = useState("discover")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    "All",
    "Lifestyle",
    "Technology",
    "Fashion",
    "Food",
    "Fitness",
    "Gaming",
    "Music",
    "Travel",
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Business Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                2
              </span>
            </Button>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators, campaigns, or businesses..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="w-full grid grid-cols-4 h-auto p-1">
            <TabsTrigger value="discover" className="text-xs py-2">
              <Users className="h-4 w-4 mr-1" />
              Creators
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="text-xs py-2">
              <Megaphone className="h-4 w-4 mr-1" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="text-xs py-2">
              <Briefcase className="h-4 w-4 mr-1" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs py-2">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <Tabs value={activeTab} className="w-full">
          {/* Discover Creators Tab */}
          <TabsContent value="discover" className="m-0 p-4 space-y-4">
            {/* Category Filter */}
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat.toLowerCase() ? "default" : "outline"}
                    size="sm"
                    className={selectedCategory !== cat.toLowerCase() ? "bg-transparent" : ""}
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Partnerships</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold">$48.5K</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Creators */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Top Creators
                </h3>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {featuredCreators.map((creator) => (
                  <Card key={creator.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="h-14 w-14 border-2 border-primary/20">
                          <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold truncate">{creator.name}</span>
                            {creator.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{creator.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {creator.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {creator.rating}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" className="flex-shrink-0">
                          Connect
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t">
                        <div className="text-center">
                          <p className="font-semibold text-sm">{creator.followers}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-sm">{creator.engagement}</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-sm">{creator.completedDeals}</p>
                          <p className="text-xs text-muted-foreground">Deals</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-sm">{creator.avgDealValue}</p>
                          <p className="text-xs text-muted-foreground">Avg Value</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {creator.specialties.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="m-0 p-4 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-green-500">3</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-500">2</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-blue-500">15</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Campaigns */}
            <div>
              <h3 className="font-semibold mb-3">Your Campaigns</h3>
              <div className="space-y-3">
                {activeCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{campaign.title}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                        </div>
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={
                            campaign.status === "active"
                              ? "bg-green-500"
                              : ""
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>

                      {campaign.status === "active" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{campaign.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.creators} Creators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.views} views</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="m-0 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Available Opportunities</h3>
              <Badge variant="outline">{opportunities.length} Jobs</Badge>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => (
                <Card key={opp.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3 mb-3">
                      <Avatar className="h-12 w-12 rounded-lg">
                        <AvatarImage src={opp.logo || "/placeholder.svg"} />
                        <AvatarFallback className="rounded-lg">{opp.business[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{opp.title}</h4>
                        <p className="text-sm text-muted-foreground">{opp.business}</p>
                      </div>
                      <Badge variant="secondary">{opp.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{opp.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{opp.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-xs text-muted-foreground font-medium">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {opp.requirements.map((req) => (
                          <Badge key={req} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        <span className="text-foreground font-medium">{opp.applicants}</span> applicants
                        <span className="mx-2">•</span>
                        Deadline: {opp.deadline}
                      </div>
                      <Button size="sm">
                        Apply
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="m-0 p-4 space-y-4">
            {/* Performance Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Reach</p>
                    <p className="text-2xl font-bold">12.5M</p>
                    <p className="text-xs text-green-500">+23% vs last month</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">892K</p>
                    <p className="text-xs text-green-500">+15% vs last month</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">4.8%</p>
                    <p className="text-xs text-green-500">+0.5% vs last month</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold">285%</p>
                    <p className="text-xs text-green-500">+18% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-t from-primary/20 to-transparent rounded-lg flex items-end justify-around p-4">
                  {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                    <div
                      key={i}
                      className="w-8 bg-primary/80 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-around text-xs text-muted-foreground mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Content */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "Video", title: "Product Showcase", views: "2.3M", engagement: "185K" },
                  { type: "Post", title: "Behind the Scenes", views: "1.8M", engagement: "142K" },
                  { type: "Live", title: "Q&A Session", views: "950K", engagement: "89K" },
                ].map((content, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{content.title}</p>
                      <p className="text-xs text-muted-foreground">{content.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{content.views}</p>
                      <p className="text-xs text-muted-foreground">{content.engagement} engagements</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {/* Messages Sidebar Trigger */}
      <div className="fixed bottom-20 right-4">
        <Card className="w-72 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </span>
              <Badge variant="secondary">2 new</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {messages.slice(0, 2).map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted/50 ${
                  msg.unread ? "bg-primary/5" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{msg.from[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium truncate">{msg.from}</p>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                </div>
                {msg.unread && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
