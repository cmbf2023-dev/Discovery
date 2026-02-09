"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Shield,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  images: string[]
  category: string
  tags: string[]
  inventory_quantity: number
  is_available: boolean
  rating: number
  review_count: number
  shop: {
    id: string
    name: string
    logo_url?: string
    is_verified: boolean
  }
  created_at: string
}

interface Review {
  id: string
  rating: number
  title?: string
  content?: string
  images?: string[]
  created_at: string
  user: {
    id: string
    username: string
    avatar_url?: string
  }
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Review form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchReviews()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          shops (
            id,
            name,
            logo_url,
            is_verified
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
     toast({
    title: "Error",
    description:'Failed to load product details',
    duration: 3000,
   })
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedReviews: Review[] = data.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        images: review.images,
        created_at: review.created_at,
        user: {
          id: review.profiles.id,
          username: review.profiles.username,
          avatar_url: review.profiles.avatar_url,
        }
      }))

      setReviews(formattedReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to leave a review",
        duration: 3000,
      })
      return
    }

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        duration: 3000,
      })
      return
    }

    setSubmittingReview(true)
    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: id,
          user_id: user.id,
          rating: reviewRating,
          title: reviewTitle.trim(),
          content: reviewContent.trim(),
        })

      if (error) throw error

      // Update product's rating and review count
      await updateProductRating()

      toast({
    title: "Review submitted Successfully!",
    description: "Thanks for your feedback.",
     duration: 3000,
 })
      setShowReviewForm(false)
      setReviewTitle("")
      setReviewContent("")
      setReviewRating(5)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        duration: 3000,
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const updateProductRating = async () => {
    try {
      // Get all reviews for this product
      const { data: allReviews, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', id)

      if (error) throw error

      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0

      // Update product
      await supabase
        .from('products')
        .update({
          rating: averageRating,
          review_count: allReviews.length
        })
        .eq('id', id)

      // Update local state
      if (product) {
        setProduct({
          ...product,
          rating: averageRating,
          review_count: allReviews.length
        })
      }
    } catch (error) {
      console.error('Error updating product rating:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count} reviews)
                  </span>
                </div>
                <Badge variant={product.is_available ? "default" : "secondary"}>
                  {product.is_available ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.compare_at_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compare_at_price}
                  </span>
                )}
              </div>
            </div>

            {/* Shop Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.shop.logo_url} />
                    <AvatarFallback>{product.shop.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{product.shop.name}</h3>
                      {product.shop.is_verified && (
                        <Shield className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Seller</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Visit Shop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" disabled={!product.is_available}>
                {product.is_available ? "Buy Now" : "Out of Stock"}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                Save
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Reviews ({product.review_count})</h2>
            {user && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                Write a Review
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  {renderStars(reviewRating, true, setReviewRating)}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Review title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Review</label>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={submitReview} disabled={submittingReview}>
                    {submittingReview && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Review
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar_url} />
                        <AvatarFallback>{review.user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.user.username}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        {review.title && (
                          <h4 className="font-semibold mb-2">{review.title}</h4>
                        )}
                        {review.content && (
                          <p className="text-muted-foreground">{review.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">Be the first to review this product!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
