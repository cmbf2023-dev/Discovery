// app/page/create/page.tsx
// Facebook-style Create Page Page with multi-step form, branding, categories, and settings

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface PageFormData {
  // Basic Info
  name: string;
  username: string;
  description: string;
  category: string;
  subcategory: string;
  
  // Branding
  avatar: string | null;
  coverImage: string | null;
  coverPosition: number;
  
  // Business Info
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  founded?: string;
  
  // Settings
  pageType: "business" | "brand" | "artist" | "community" | "public_figure";
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  allowMessages: boolean;
  allowPosts: boolean;
  ageRestriction: "none" | "18+" | "21+";
  
  // Token Economy (Optional)
  enableTokens: boolean;
  tokenName?: string;
  tokenSymbol?: string;
  tokenPrice?: number;
  
  // Social Links
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  
  // Call to Action
  ctaEnabled: boolean;
  ctaType?: "book" | "shop" | "signup" | "contact" | "learn_more";
  ctaLabel?: string;
  ctaLink?: string;
}

// ------------------------------------------------------------
// Mock Data - Page Categories
// ------------------------------------------------------------
const pageCategories = [
  {
    id: "business",
    name: "Business",
    icon: "💼",
    description: "Local business, company, or organization",
    subcategories: ["Local Business", "Company", "Agency", "Consulting", "E-commerce", "Real Estate", "Automotive", "Professional Services"],
  },
  {
    id: "brand",
    name: "Brand",
    icon: "🏷️",
    description: "Product brand or consumer goods",
    subcategories: ["Fashion", "Beauty", "Food & Beverage", "Electronics", "Home Goods", "Sports Equipment", "Toys", "Luxury"],
  },
  {
    id: "artist",
    name: "Artist",
    icon: "🎨",
    description: "Musician, visual artist, or creative",
    subcategories: ["Musician", "Painter", "Photographer", "Sculptor", "Digital Artist", "Illustrator", "Writer", "Performer"],
  },
  {
    id: "community",
    name: "Community",
    icon: "👥",
    description: "Non-profit, cause, or community group",
    subcategories: ["Non-profit", "Charity", "Sports Team", "Club", "Religious Organization", "Social Cause", "Neighborhood", "Alumni"],
  },
  {
    id: "public_figure",
    name: "Public Figure",
    icon: "⭐",
    description: "Influencer, creator, or public personality",
    subcategories: ["Influencer", "Content Creator", "Journalist", "Author", "Speaker", "Politician", "Athlete", "Entertainer"],
  },
];

// Username suggestions
const usernameSuggestions = [
  "techreviews",
  "officialtech",
  "techhub",
  "techcommunity",
  "techworld",
];

// CTA options
const ctaOptions = [
  { value: "book", label: "Book Now", icon: "📅" },
  { value: "shop", label: "Shop Now", icon: "🛍️" },
  { value: "signup", label: "Sign Up", icon: "📝" },
  { value: "contact", label: "Contact Us", icon: "📧" },
  { value: "learn_more", label: "Learn More", icon: "ℹ️" },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: { id: number; label: string }[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border-2 transition
                  ${currentStep > step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : currentStep === step.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-border text-muted-foreground bg-card'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`
                absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap
                ${currentStep === step.id ? 'text-foreground font-medium' : 'text-muted-foreground'}
              `}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition
                ${currentStep > step.id ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploader({
  type,
  image,
  onUpload,
  onRemove,
}: {
  type: "avatar" | "cover";
  image: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  if (image) {
    return (
      <div className="relative group">
        <div className={`
          relative overflow-hidden bg-muted
          ${type === "avatar" ? "w-32 h-32 rounded-full" : "w-full h-48 rounded-radius"}
        `}>
          <Image
            src={image}
            alt={type === "avatar" ? "Page avatar" : "Page cover"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById(`${type}-upload`)?.click()}
              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
              </svg>
            </button>
          </div>
        </div>
        <input
          id={`${type}-upload`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer
        ${type === "avatar" ? "w-32 h-32 rounded-full" : "w-full h-48"}
        ${isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 bg-muted/30'
        }
        flex flex-col items-center justify-center
      `}
      onClick={() => document.getElementById(`${type}-upload`)?.click()}
    >
      <div className={type === "avatar" ? "text-center" : "flex flex-col items-center"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={type === "avatar" ? 24 : 32}
          height={type === "avatar" ? 24 : 32}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground mb-2"
        >
          <rect x="2" y="2" width="20" height="20" rx="2.18" />
          <circle cx="12" cy="10" r="3" />
          <path d="M22 22l-6-6" />
        </svg>
        <p className="text-sm font-medium">
          {type === "avatar" ? "Upload avatar" : "Upload cover photo"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Click or drag and drop
        </p>
      </div>
      <input
        id={`${type}-upload`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function CategorySelector({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}: {
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectCategory: (category: string) => void;
  onSelectSubcategory: (subcategory: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = pageCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCategoryData = pageCategories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category <span className="text-destructive">*</span></label>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onSelectCategory(category.id);
                  onSelectSubcategory("");
                }}
                className={`
                  w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition
                  ${selectedCategory === category.id
                    ? 'bg-primary/10 border border-primary/30 text-primary'
                    : 'hover:bg-muted border border-transparent'
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <div className="flex-1">
                  <span className="font-medium block">{category.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5 block">
                    {category.description}
                  </span>
                </div>
                {selectedCategory === category.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        <div>
          <label className="text-sm font-medium mb-2 block">Subcategory (Optional)</label>
          {selectedCategoryData ? (
            <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
              <button
                type="button"
                onClick={() => onSelectSubcategory("")}
                className={`
                  w-full px-3 py-2.5 rounded-lg text-left transition
                  ${!selectedSubcategory
                    ? 'bg-muted font-medium'
                    : 'hover:bg-muted/50 text-muted-foreground'
                  }
                `}
              >
                None
              </button>
              {selectedCategoryData.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSelectSubcategory(sub)}
                  className={`
                    w-full px-3 py-2.5 rounded-lg text-left transition
                    ${selectedSubcategory === sub
                      ? 'bg-primary/10 border border-primary/30 text-primary font-medium'
                      : 'hover:bg-muted/50'
                    }
                  `}
                >
                  {sub}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-6 text-center text-muted-foreground">
              <p className="text-sm">Select a category first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsernameInput({
  value,
  onChange,
  onSuggestion,
}: {
  value: string;
  onChange: (value: string) => void;
  onSuggestion: (suggestion: string) => void;
}) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkAvailability = async (username: string) => {
    if (!username) return;
    setChecking(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAvailable(username.length >= 4 && !username.includes("admin"));
    setChecking(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          page/
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
            onChange(val);
            setIsAvailable(null);
          }}
          onBlur={() => checkAvailability(value)}
          placeholder="username"
          className="w-full bg-muted/50 border border-border rounded-lg pl-16 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {checking && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        )}
        {!checking && isAvailable === true && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        )}
        {!checking && isAvailable === false && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {usernameSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestion(suggestion)}
            className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition"
          >
            page/{suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function PageTypeOption({
  type,
  label,
  description,
  icon,
  selected,
  onSelect,
}: {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full flex items-start gap-4 p-4 rounded-lg border-2 transition text-left
        ${selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30'
        }
      `}
    >
      <div className={`
        p-2 rounded-full shrink-0
        ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
      `}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {selected && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Selected
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </button>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function CreatePagePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<PageFormData>({
    name: "",
    username: "",
    description: "",
    category: "",
    subcategory: "",
    avatar: null,
    coverImage: null,
    coverPosition: 0.5,
    website: "",
    email: "",
    phone: "",
    address: "",
    founded: "",
    pageType: "business",
    showEmail: true,
    showPhone: false,
    showAddress: false,
    allowMessages: true,
    allowPosts: true,
    ageRestriction: "none",
    enableTokens: false,
    tokenName: "",
    tokenSymbol: "",
    tokenPrice: 0.25,
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
    ctaEnabled: false,
    ctaType: "learn_more",
    ctaLabel: "Learn More",
    ctaLink: "",
  });

  const steps = [
    { id: 1, label: "Page Type" },
    { id: 2, label: "Basics" },
    { id: 3, label: "Branding" },
    { id: 4, label: "Contact" },
    { id: 5, label: "Settings" },
    { id: 6, label: "Review" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleImageUpload = (type: "avatar" | "cover", file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, [type]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (type: "avatar" | "cover") => {
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push(`/page/${formData.username || "pagename"}`);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !formData.pageType;
      case 2:
        return formData.name.length >= 3 && 
               formData.description.length >= 10 && 
               formData.category !== "" &&
               formData.username.length >= 4;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && isStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Preview URL
  const pageUrl = `page/${formData.username || "username"}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/pages"
              className="p-2 -ml-2 rounded-full hover:bg-muted transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Create new page</h1>
              <p className="text-sm text-muted-foreground">
                Build your presence and connect with your audience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Step 1: Page Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">What kind of page are you creating?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose the category that best describes your page. You can change this later.
                </p>
                
                <div className="space-y-3">
                  {pageCategories.map((category) => (
                    <PageTypeOption
                      key={category.id}
                      type={category.id}
                      label={category.name}
                      description={category.description}
                      icon={<span className="text-xl">{category.icon}</span>}
                      selected={formData.pageType === category.id}
                      onSelect={() => setFormData(prev => ({ ...prev, pageType: category.id as any }))}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Basics */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Basic information</h2>
                
                {/* Page Name */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="name" className="text-sm font-medium">
                    Page name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Gear Reviews"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose a name that represents your brand or identity. You can change it later.
                  </p>
                </div>

                {/* Username */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username <span className="text-destructive">*</span>
                  </label>
                  <UsernameInput
                    value={formData.username}
                    onChange={(val) => setFormData(prev => ({ ...prev, username: val }))}
                    onSuggestion={(sug) => setFormData(prev => ({ ...prev, username: sug }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your page URL will be: <span className="font-medium">{pageUrl}</span>
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell people what your page is about. What content do you share? Who is this page for?"
                    rows={4}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <CategorySelector
                    selectedCategory={formData.category}
                    selectedSubcategory={formData.subcategory}
                    onSelectCategory={(cat) => setFormData(prev => ({ ...prev, category: cat }))}
                    onSelectSubcategory={(sub) => setFormData(prev => ({ ...prev, subcategory: sub }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Page images</h2>
                
                <div className="space-y-6">
                  {/* Cover Photo */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Cover photo
                    </label>
                    <ImageUploader
                      type="cover"
                      image={formData.coverImage}
                      onUpload={(file) => handleImageUpload("cover", file)}
                      onRemove={() => handleImageRemove("cover")}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended size: 1200 x 400 pixels. Maximum file size: 10MB.
                    </p>
                  </div>

                  {/* Avatar */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Page avatar
                    </label>
                    <ImageUploader
                      type="avatar"
                      image={formData.avatar}
                      onUpload={(file) => handleImageUpload("avatar", file)}
                      onRemove={() => handleImageRemove("avatar")}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended size: 400 x 400 pixels. Maximum file size: 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Founded Year */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Page history</h2>
                
                <div>
                  <label htmlFor="founded" className="text-sm font-medium block mb-2">
                    Founded year (Optional)
                  </label>
                  <input
                    type="text"
                    id="founded"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g., 2019"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    When was your business, brand, or page established?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact & Social */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Contact information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="website" className="text-sm font-medium block mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.example.com"
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium block mb-2">
                      Email
                    </label>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="contact@example.com"
                          className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="showEmail"
                          name="showEmail"
                          checked={formData.showEmail}
                          onChange={handleInputChange}
                          className="rounded border-border"
                        />
                        <label htmlFor="showEmail" className="text-xs text-muted-foreground">
                          Show on page
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-sm font-medium block mb-2">
                      Phone
                    </label>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="showPhone"
                          name="showPhone"
                          checked={formData.showPhone}
                          onChange={handleInputChange}
                          className="rounded border-border"
                        />
                        <label htmlFor="showPhone" className="text-xs text-muted-foreground">
                          Show on page
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="text-sm font-medium block mb-2">
                      Address
                    </label>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="San Francisco, CA"
                          className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="showAddress"
                          name="showAddress"
                          checked={formData.showAddress}
                          onChange={handleInputChange}
                          className="rounded border-border"
                        />
                        <label htmlFor="showAddress" className="text-xs text-muted-foreground">
                          Show on page
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Social media links</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="facebook" className="text-xs font-medium block mb-1">
                      Facebook
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">fb.com/</span>
                      <input
                        type="text"
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="username"
                        className="w-full bg-muted/50 border border-border rounded-lg pl-16 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instagram" className="text-xs font-medium block mb-1">
                      Instagram
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="username"
                        className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="twitter" className="text-xs font-medium block mb-1">
                      Twitter
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="username"
                        className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="youtube" className="text-xs font-medium block mb-1">
                      YouTube
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">youtube.com/</span>
                      <input
                        type="text"
                        id="youtube"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleInputChange}
                        placeholder="@channel"
                        className="w-full bg-muted/50 border border-border rounded-lg pl-20 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tiktok" className="text-xs font-medium block mb-1">
                      TikTok
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">@</span>
                      <input
                        type="text"
                        id="tiktok"
                        name="tiktok"
                        value={formData.tiktok}
                        onChange={handleInputChange}
                        placeholder="username"
                        className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="text-xs font-medium block mb-1">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">linkedin.com/</span>
                      <input
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="company/name"
                        className="w-full bg-muted/50 border border-border rounded-lg pl-20 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Add links to your other social media profiles. These will appear on your page.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Settings */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Page Settings */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Page settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow messages</p>
                      <p className="text-xs text-muted-foreground">Let people send private messages to your page</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowMessages"
                        checked={formData.allowMessages}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow posts</p>
                      <p className="text-xs text-muted-foreground">Let others post on your page timeline</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowPosts"
                        checked={formData.allowPosts}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="ageRestriction" className="text-sm font-medium block mb-2">
                      Age restriction
                    </label>
                    <select
                      id="ageRestriction"
                      name="ageRestriction"
                      value={formData.ageRestriction}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="none">No age restriction</option>
                      <option value="18+">18+ only</option>
                      <option value="21+">21+ only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-card border border-border rounded-radius p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Call to action button</h2>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="ctaEnabled"
                      checked={formData.ctaEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {formData.ctaEnabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Button type
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {ctaOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                ctaType: option.value as any,
                                ctaLabel: option.label,
                              }));
                            }}
                            className={`
                              flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition
                              ${formData.ctaType === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                              }
                            `}
                          >
                            <span className="text-xl">{option.icon}</span>
                            <span className="text-xs">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ctaLink" className="text-sm font-medium block mb-2">
                        Button link
                      </label>
                      <input
                        type="url"
                        id="ctaLink"
                        name="ctaLink"
                        value={formData.ctaLink}
                        onChange={handleInputChange}
                        placeholder="https://www.example.com"
                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Token Economy */}
              <div className="bg-card border border-border rounded-radius p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium">Token economy</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create your own token for your page community
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="enableTokens"
                      checked={formData.enableTokens}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {formData.enableTokens && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="tokenName" className="text-xs font-medium block mb-1">
                          Token name
                        </label>
                        <input
                          type="text"
                          id="tokenName"
                          name="tokenName"
                          value={formData.tokenName}
                          onChange={handleInputChange}
                          placeholder="e.g., TechCoin"
                          className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label htmlFor="tokenSymbol" className="text-xs font-medium block mb-1">
                          Symbol
                        </label>
                        <input
                          type="text"
                          id="tokenSymbol"
                          name="tokenSymbol"
                          value={formData.tokenSymbol}
                          onChange={handleInputChange}
                          placeholder="e.g., TECH"
                          maxLength={5}
                          className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring uppercase"
                        />
                      </div>
                      <div>
                        <label htmlFor="tokenPrice" className="text-xs font-medium block mb-1">
                          Token value (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <input
                            type="number"
                            id="tokenPrice"
                            name="tokenPrice"
                            value={formData.tokenPrice}
                            onChange={handleInputChange}
                            placeholder="0.25"
                            step="0.01"
                            min="0"
                            className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Review your page</h2>
                
                <div className="space-y-6">
                  {/* Page Preview Card */}
                  <div className="bg-muted/30 rounded-lg overflow-hidden">
                    {/* Cover Preview */}
                    <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10">
                      {formData.coverImage && (
                        <Image
                          src={formData.coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Avatar and Info */}
                    <div className="px-6 pb-6">
                      <div className="flex items-end gap-4 -mt-8 mb-4">
                        <div className="relative w-20 h-20 rounded-full ring-4 ring-card bg-card overflow-hidden">
                          {formData.avatar ? (
                            <Image
                              src={formData.avatar}
                              alt="Avatar preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="text-muted-foreground"
                              >
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.5L9.07 3.67A2 2 0 0 0 7.64 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <h3 className="font-semibold text-lg">
                            {formData.name || "Your Page Name"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {pageUrl} · {pageCategories.find(c => c.id === formData.pageType)?.name}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {formData.description || "Page description will appear here."}
                      </p>

                      {/* CTA Button Preview */}
                      {formData.ctaEnabled && formData.ctaLabel && (
                        <div className="mt-4">
                          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium">
                            {formData.ctaLabel}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="font-medium">
                        {pageCategories.find(c => c.id === formData.category)?.name || "Not selected"}
                        {formData.subcategory && ` · ${formData.subcategory}`}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Contact</p>
                      <p className="font-medium">
                        {formData.showEmail && formData.email ? "Email visible" : "Email hidden"}
                        {formData.showPhone && formData.phone && " · Phone visible"}
                      </p>
                    </div>
                  </div>

                  {/* Token Summary */}
                  {formData.enableTokens && formData.tokenName && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">₿</span>
                        </div>
                        <div>
                          <p className="font-medium">{formData.tokenName} ({formData.tokenSymbol})</p>
                          <p className="text-xs text-muted-foreground">
                            1 {formData.tokenSymbol} = ${formData.tokenPrice} USD
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Links Summary */}
                  {Object.values(formData).some(val => 
                    typeof val === "string" && 
                    ["facebook", "instagram", "twitter", "youtube", "tiktok", "linkedin"].includes(val) && 
                    val.length > 0
                  ) && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2">Connected social accounts</p>
                      <div className="flex gap-2">
                        {formData.facebook && <span className="text-xs bg-muted px-2 py-1 rounded">Facebook</span>}
                        {formData.instagram && <span className="text-xs bg-muted px-2 py-1 rounded">Instagram</span>}
                        {formData.twitter && <span className="text-xs bg-muted px-2 py-1 rounded">Twitter</span>}
                        {formData.youtube && <span className="text-xs bg-muted px-2 py-1 rounded">YouTube</span>}
                        {formData.tiktok && <span className="text-xs bg-muted px-2 py-1 rounded">TikTok</span>}
                        {formData.linkedin && <span className="text-xs bg-muted px-2 py-1 rounded">LinkedIn</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href="/pages"
                className="px-6 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition"
              >
                Cancel
              </Link>
              {currentStep === steps.length ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Page'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}