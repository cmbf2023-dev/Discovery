"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Search,
  Star,
  Users,
  TrendingUp,
  Send,
  DollarSign,
  Calendar,
  FileText,
  Handshake,
  Crown,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Creator {
  id: string
  username: string
  displayName: string
  avatar: string
  followers: number
  rating: number
  category: string
  isVerified: boolean
  bio: string
  avgViews: number
  engagementRate: number
}

interface SponsorshipDeal {
  targetCreatorId: string
  duration: {
    startDate: string
    endDate: string
    durationMonths: number
  }
  financial: {
    totalAmount: number
    paymentSchedule: "monthly" | "milestone" | "upfront"
    profitSharingPercentage: number
    bonusIncentives: string
  }
  content: {
    maxPromotedContent: number
    contentTypes: string[]
    approvalRequired: boolean
    brandingRequirements: string
  }
  collaboration: {
    jointContent: boolean
    contentCreationSupport: string
    resourcesProvided: string
    meetingFrequency: string
  }
  clientManagement: {
    leadSharing: boolean
    clientHandlingProcess: string
    revenueFromClients: number
  }
  terms: {
    exclusivityClause: boolean
    terminationClause: string
    performanceMetrics: string
    additionalTerms: string
  }
}

export default function CreateSponsorshipPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dealData, setDealData] = useState<SponsorshipDeal>({
    targetCreatorId: "",
    duration: {
      startDate: "",
      endDate: "",
      durationMonths: 3,
    },
    financial: {
      totalAmount: 0,
      paymentSchedule: "monthly",
      profitSharingPercentage: 20,
      bonusIncentives: "",
    },
    content: {
      maxPromotedContent: 10,
      contentTypes: ["streams", "posts"],
      approvalRequired: true,
      brandingRequirements: "",
    },
    collaboration: {
      jointContent: false,
      contentCreationSupport: "",
      resourcesProvided: "",
      meetingFrequency: "weekly",
    },
    clientManagement: {
      leadSharing: false,
      clientHandlingProcess: "",
      revenueFromClients: 50,
    },
    terms: {
      exclusivityClause: false,
      terminationClause: "",
      performanceMetrics: "",
      additionalTerms: "",
    },
  })
  const { user } = useAuth()
  const router = useRouter()

  // Mock creators data
  const availableCreators: Creator[] = [
    {
      id: "creator_1",
      username: "sarah_music",
      displayName: "Sarah Music",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: 12500,
      rating: 4.8,
      category: "Music",
      isVerified: true,
      bio: "Professional musician and live performer",
      avgViews: 2500,
      engagementRate: 8.5,
    },
    {
      id: "creator_2",
      username: "chef_marco",
      displayName: "Chef Marco",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: 8200,
      rating: 4.9,
      category: "Cooking",
      isVerified: true,
      bio: "Italian chef sharing authentic recipes",
      avgViews: 1800,
      engagementRate: 12.3,
    },
    {
      id: "creator_3",
      username: "dance_queen",
      displayName: "Dance Queen",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: 25100,
      rating: 4.7,
      category: "Dance",
      isVerified: true,
      bio: "Professional dancer and choreographer",
      avgViews: 4200,
      engagementRate: 9.8,
    },
    {
      id: "creator_4",
      username: "tech_guru",
      displayName: "Tech Guru",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: 15600,
      rating: 4.6,
      category: "Technology",
      isVerified: false,
      bio: "Tech reviews and tutorials",
      avgViews: 3100,
      engagementRate: 7.2,
    },
  ]

  const filteredCreators = availableCreators.filter(
    (creator) =>
      creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const keys = field.split(".")
      setDealData((prev) => {
        const updated = { ...prev }
        let current = updated as any
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        return updated
      })
    } else {
      setDealData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleCreatorSelect = (creator: Creator) => {
    setSelectedCreator(creator)
    setDealData((prev) => ({
      ...prev,
      targetCreatorId: creator.id,
    }))
    setCurrentStep(2)
  }

  const handleSubmitDeal = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Sending sponsorship deal:", dealData)
      router.push("/sponsorship/sent")
    } catch (error) {
      console.error("Error sending deal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Check if user is verified
  if (!user?.isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Verification Required</h2>
            <p className="text-gray-600 mb-4">
              Only verified creators can create sponsorship deals. Get verified to unlock this feature.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Handshake className="w-6 h-6 text-purple-500" />
            <h1 className="text-xl font-bold">Create Sponsorship Deal</h1>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step <= currentStep ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Select Creator</span>
          <span>Duration & Finance</span>
          <span>Content Terms</span>
          <span>Collaboration</span>
          <span>Review & Send</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Creator to Sponsor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Creators List */}
              <div className="space-y-3">
                {filteredCreators.map((creator) => (
                  <Card
                    key={creator.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      !creator.isVerified ? "opacity-60" : ""
                    }`}
                    onClick={() => creator.isVerified && handleCreatorSelect(creator)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{creator.displayName}</h3>
                            {creator.isVerified && <Badge className="bg-blue-100 text-blue-700">✓ Verified</Badge>}
                            <Badge variant="outline">{creator.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">@{creator.username}</p>
                          <p className="text-sm text-gray-500 mb-2">{creator.bio}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {creator.followers.toLocaleString()} followers
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {creator.rating}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {creator.avgViews.toLocaleString()} avg views
                            </div>
                          </div>
                        </div>
                        {!creator.isVerified && (
                          <Badge variant="secondary" className="text-gray-500">
                            Not Verified
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && selectedCreator && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Duration & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dealData.duration.startDate}
                      onChange={(e) => handleInputChange("duration.startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dealData.duration.endDate}
                      onChange={(e) => handleInputChange("duration.endDate", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="durationMonths">Duration (Months)</Label>
                  <Input
                    id="durationMonths"
                    type="number"
                    min="1"
                    max="24"
                    value={dealData.duration.durationMonths}
                    onChange={(e) => handleInputChange("duration.durationMonths", Number.parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="totalAmount">Total Sponsorship Amount ($)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={dealData.financial.totalAmount}
                    onChange={(e) => handleInputChange("financial.totalAmount", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Payment Schedule</Label>
                  <div className="flex gap-2 mt-2">
                    {["monthly", "milestone", "upfront"].map((schedule) => (
                      <Button
                        key={schedule}
                        variant={dealData.financial.paymentSchedule === schedule ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("financial.paymentSchedule", schedule)}
                        className="capitalize"
                      >
                        {schedule}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="profitSharing">Profit Sharing Percentage (%)</Label>
                  <Input
                    id="profitSharing"
                    type="number"
                    min="0"
                    max="100"
                    value={dealData.financial.profitSharingPercentage}
                    onChange={(e) =>
                      handleInputChange("financial.profitSharingPercentage", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bonusIncentives">Bonus Incentives</Label>
                  <Textarea
                    id="bonusIncentives"
                    placeholder="Describe any performance bonuses or incentives..."
                    value={dealData.financial.bonusIncentives}
                    onChange={(e) => handleInputChange("financial.bonusIncentives", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxContent">Maximum Promoted Content</Label>
                <Input
                  id="maxContent"
                  type="number"
                  min="1"
                  value={dealData.content.maxPromotedContent}
                  onChange={(e) => handleInputChange("content.maxPromotedContent", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Content Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["streams", "posts", "stories", "videos", "photos"].map((type) => (
                    <Button
                      key={type}
                      variant={dealData.content.contentTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentTypes = dealData.content.contentTypes
                        const newTypes = currentTypes.includes(type)
                          ? currentTypes.filter((t) => t !== type)
                          : [...currentTypes, type]
                        handleInputChange("content.contentTypes", newTypes)
                      }}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={dealData.content.approvalRequired}
                  onCheckedChange={(checked) => handleInputChange("content.approvalRequired", checked)}
                />
                <Label>Content approval required before posting</Label>
              </div>
              <div>
                <Label htmlFor="brandingRequirements">Branding Requirements</Label>
                <Textarea
                  id="brandingRequirements"
                  placeholder="Specify any branding guidelines, logos, or mentions required..."
                  value={dealData.content.brandingRequirements}
                  onChange={(e) => handleInputChange("content.brandingRequirements", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={dealData.collaboration.jointContent}
                    onCheckedChange={(checked) => handleInputChange("collaboration.jointContent", checked)}
                  />
                  <Label>Joint content creation</Label>
                </div>
                <div>
                  <Label htmlFor="contentSupport">Content Creation Support</Label>
                  <Textarea
                    id="contentSupport"
                    placeholder="Describe how you'll support content creation (equipment, editing, etc.)..."
                    value={dealData.collaboration.contentCreationSupport}
                    onChange={(e) => handleInputChange("collaboration.contentCreationSupport", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="resourcesProvided">Resources Provided</Label>
                  <Textarea
                    id="resourcesProvided"
                    placeholder="List any resources, tools, or materials you'll provide..."
                    value={dealData.collaboration.resourcesProvided}
                    onChange={(e) => handleInputChange("collaboration.resourcesProvided", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Meeting Frequency</Label>
                  <div className="flex gap-2 mt-2">
                    {["weekly", "bi-weekly", "monthly", "as-needed"].map((frequency) => (
                      <Button
                        key={frequency}
                        variant={dealData.collaboration.meetingFrequency === frequency ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("collaboration.meetingFrequency", frequency)}
                        className="capitalize"
                      >
                        {frequency}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={dealData.clientManagement.leadSharing}
                    onCheckedChange={(checked) => handleInputChange("clientManagement.leadSharing", checked)}
                  />
                  <Label>Share client leads</Label>
                </div>
                <div>
                  <Label htmlFor="clientProcess">Client Handling Process</Label>
                  <Textarea
                    id="clientProcess"
                    placeholder="Describe how clients will be managed and handled..."
                    value={dealData.clientManagement.clientHandlingProcess}
                    onChange={(e) => handleInputChange("clientManagement.clientHandlingProcess", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="clientRevenue">Revenue Share from Clients (%)</Label>
                  <Input
                    id="clientRevenue"
                    type="number"
                    min="0"
                    max="100"
                    value={dealData.clientManagement.revenueFromClients}
                    onChange={(e) =>
                      handleInputChange("clientManagement.revenueFromClients", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 5 && selectedCreator && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creator Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedCreator.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedCreator.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedCreator.displayName}</h3>
                    <p className="text-sm text-gray-600">@{selectedCreator.username}</p>
                    <Badge className="bg-blue-100 text-blue-700">✓ Verified</Badge>
                  </div>
                </div>

                {/* Deal Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm">{dealData.duration.durationMonths} months</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="text-sm">${dealData.financial.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Schedule</Label>
                    <p className="text-sm capitalize">{dealData.financial.paymentSchedule}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Profit Sharing</Label>
                    <p className="text-sm">{dealData.financial.profitSharingPercentage}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Max Content</Label>
                    <p className="text-sm">{dealData.content.maxPromotedContent} pieces</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Content Types</Label>
                    <p className="text-sm">{dealData.content.contentTypes.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={dealData.terms.exclusivityClause}
                    onCheckedChange={(checked) => handleInputChange("terms.exclusivityClause", checked)}
                  />
                  <Label>Exclusivity clause (creator cannot work with competitors)</Label>
                </div>
                <div>
                  <Label htmlFor="terminationClause">Termination Clause</Label>
                  <Textarea
                    id="terminationClause"
                    placeholder="Specify conditions for early termination..."
                    value={dealData.terms.terminationClause}
                    onChange={(e) => handleInputChange("terms.terminationClause", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="performanceMetrics">Performance Metrics</Label>
                  <Textarea
                    id="performanceMetrics"
                    placeholder="Define success metrics and KPIs..."
                    value={dealData.terms.performanceMetrics}
                    onChange={(e) => handleInputChange("terms.performanceMetrics", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalTerms">Additional Terms</Label>
                  <Textarea
                    id="additionalTerms"
                    placeholder="Any other terms and conditions..."
                    value={dealData.terms.additionalTerms}
                    onChange={(e) => handleInputChange("terms.additionalTerms", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertDescription>
                This sponsorship deal will be sent to {selectedCreator.displayName} for review. They will have 7 days to
                accept or decline the offer.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          {currentStep < 5 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button
              onClick={handleSubmitDeal}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending Deal..." : "Send Sponsorship Deal"}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
