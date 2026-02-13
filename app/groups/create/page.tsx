// app/groups/create/page.tsx
// Facebook-style Create Group Page with multi-step form, privacy settings, and customization

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface GroupFormData {
  // Basic Info
  name: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  
  // Privacy & Settings
  privacy: "Public" | "Private" | "Hidden";
  visible: boolean;
  postPermissions: "members" | "admins" | "moderators";
  joinApproval: "anyone" | "admin_approval" | "invite_only";
  
  // Branding
  avatar: string | null;
  coverImage: string | null;
  coverPosition: number;
  
  // Location
  locationType: "online" | "local" | "global";
  location?: string;
  
  // Topics
  topics: string[];
  
  // Token Economy (Optional)
  enableTokens: boolean;
  tokenName?: string;
  tokenSymbol?: string;
  
  // Rules
  rules: { id: string; rule: string }[];
}

// ------------------------------------------------------------
// Mock Data - Categories
// ------------------------------------------------------------
const categories = [
  {
    id: "tech",
    name: "Technology",
    icon: "💻",
    subcategories: ["Artificial Intelligence", "Software Development", "Hardware", "Cybersecurity", "Data Science", "Web3", "Gaming", "Robotics"],
  },
  {
    id: "photography",
    name: "Photography",
    icon: "📸",
    subcategories: ["Portrait", "Landscape", "Street", "Wedding", "Product", "Film", "Digital Art", "Editing"],
  },
  {
    id: "music",
    name: "Music",
    icon: "🎵",
    subcategories: ["Production", "Instruments", "Vocals", "Mixing", "Songwriting", "Live Performance", "DJ", "Music Theory"],
  },
  {
    id: "art",
    name: "Art & Design",
    icon: "🎨",
    subcategories: ["Digital Art", "Traditional Art", "Graphic Design", "Illustration", "Sculpture", "Animation", "Typography", "UI/UX"],
  },
  {
    id: "business",
    name: "Business",
    icon: "💼",
    subcategories: ["Entrepreneurship", "Marketing", "Finance", "Sales", "Leadership", "Startups", "E-commerce", "Consulting"],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "🌟",
    subcategories: ["Fitness", "Travel", "Food", "Fashion", "Wellness", "Parenting", "Relationships", "Home Decor"],
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    subcategories: ["PC Gaming", "Console", "Mobile", "Esports", "Game Dev", "Retro", "Strategy", "RPG"],
  },
  {
    id: "education",
    name: "Education",
    icon: "📚",
    subcategories: ["K-12", "Higher Education", "Online Learning", "Language Learning", "STEM", "Humanities", "Test Prep", "Tutoring"],
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    subcategories: ["Football", "Basketball", "Soccer", "Tennis", "Running", "Cycling", "Swimming", "Martial Arts"],
  },
  {
    id: "health",
    name: "Health & Wellness",
    icon: "🧘",
    subcategories: ["Mental Health", "Nutrition", "Yoga", "Meditation", "Physical Therapy", "Alternative Medicine", "Recovery", "Seniors"],
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    subcategories: ["Biology", "Chemistry", "Physics", "Astronomy", "Environmental", "Neuroscience", "Genetics", "Research"],
  },
  {
    id: "other",
    name: "Other",
    icon: "📌",
    subcategories: ["Custom", "Hobbies", "Collectibles", "Pets", "Automotive", "DIY", "Gardening", "Books"],
  },
];

// Popular tags for suggestions
const popularTags = [
  "technology", "photography", "music", "art", "design", "coding", "marketing", 
  "fitness", "travel", "food", "gaming", "education", "science", "startup",
  "community", "support", "networking", "events", "tutorials", "resources"
];

// Default group rules template
const defaultRules = [
  "Be respectful to all members",
  "No spam or self-promotion",
  "Stay on topic",
  "No harassment or hate speech",
  "Follow our community guidelines",
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
            alt={type === "avatar" ? "Group avatar" : "Group cover"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
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
        relative border-2 border-dashed rounded-lg p-6 text-center transition
        ${type === "avatar" ? "w-32 h-32 rounded-full" : "w-full h-48"}
        ${isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 bg-muted/30'
        }
        flex flex-col items-center justify-center cursor-pointer
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

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

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
          <label className="text-sm font-medium mb-2 block">Category</label>
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
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition
                  ${selectedCategory === category.id
                    ? 'bg-primary/10 border border-primary/30 text-primary'
                    : 'hover:bg-muted border border-transparent'
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="flex-1 font-medium">{category.name}</span>
                {selectedCategory === category.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
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

function TagInput({ tags, onAddTag, onRemoveTag }: { tags: string[]; onAddTag: (tag: string) => void; onRemoveTag: (tag: string) => void }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 10) {
        onAddTag(tag);
        setInput("");
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="hover:text-primary/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">#</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter or comma to add)"
          disabled={tags.length >= 10}
          className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {tags.length}/10 tags added. Tags help people discover your group.
      </p>
    </div>
  );
}

function PrivacyOption({
  value,
  label,
  description,
  icon,
  selected,
  onSelect,
}: {
  value: string;
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

function RulesBuilder({ rules, onAddRule, onUpdateRule, onRemoveRule }: {
  rules: { id: string; rule: string }[];
  onAddRule: () => void;
  onUpdateRule: (id: string, rule: string) => void;
  onRemoveRule: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <div key={rule.id} className="flex items-start gap-2">
            <span className="text-sm font-medium mt-2.5 w-6">{index + 1}.</span>
            <div className="flex-1">
              <input
                type="text"
                value={rule.rule}
                onChange={(e) => onUpdateRule(rule.id, e.target.value)}
                placeholder={`Rule ${index + 1}`}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveRule(rule.id)}
              className="p-2 text-muted-foreground hover:text-foreground transition"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddRule}
        disabled={rules.length >= 10}
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-50 disabled:no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add a rule
      </button>
    </div>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function CreateGroupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    tags: [],
    privacy: "Public",
    visible: true,
    postPermissions: "members",
    joinApproval: "anyone",
    avatar: null,
    coverImage: null,
    coverPosition: 0.5,
    locationType: "online",
    location: "",
    topics: [],
    enableTokens: false,
    tokenName: "",
    tokenSymbol: "",
    rules: defaultRules.map((rule, i) => ({ id: `rule-${i}`, rule })),
  });

  const steps = [
    { id: 1, label: "Basics" },
    { id: 2, label: "Privacy & Settings" },
    { id: 3, label: "Branding" },
    { id: 4, label: "Topics & Tags" },
    { id: 5, label: "Rules & Guidelines" },
    { id: 6, label: "Review" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleAddTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleAddRule = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, { id: `rule-${Date.now()}`, rule: "" }],
    }));
  };

  const handleUpdateRule = (id: string, rule: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.map(r => r.id === id ? { ...r, rule } : r),
    }));
  };

  const handleRemoveRule = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push("/groups");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length >= 3 && formData.description.length >= 10 && formData.category;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return formData.rules.every(r => r.rule.trim().length > 0);
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/groups"
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
              <h1 className="text-xl font-semibold">Create new group</h1>
              <p className="text-sm text-muted-foreground">
                Build a community around your interests
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
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Basic information</h2>
                
                {/* Group Name */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="name" className="text-sm font-medium">
                    Group name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Photography Enthusiasts"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose a name that represents your community. You can change it later.
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
                    placeholder="Tell people what your group is about. What topics will you discuss? Who is this group for?"
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

          {/* Step 2: Privacy & Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Privacy Type */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Privacy settings</h2>
                
                <div className="space-y-4">
                  <PrivacyOption
                    value="Public"
                    label="Public group"
                    description="Anyone can see who's in the group and what they post. This group is visible in search and recommendations."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
                      </svg>
                    }
                    selected={formData.privacy === "Public"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "Public" }))}
                  />

                  <PrivacyOption
                    value="Private"
                    label="Private group"
                    description="Anyone can find the group and see who's in it, but only members can see posts."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    }
                    selected={formData.privacy === "Private"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "Private" }))}
                  />

                  <PrivacyOption
                    value="Hidden"
                    label="Hidden group"
                    description="Only members can find the group. It won't appear in search or recommendations."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    }
                    selected={formData.privacy === "Hidden"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "Hidden" }))}
                  />
                </div>
              </div>

              {/* Membership Settings */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Membership settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Who can join?
                    </label>
                    <select
                      name="joinApproval"
                      value={formData.joinApproval}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="anyone">Anyone can join</option>
                      <option value="admin_approval">Admin approval required</option>
                      <option value="invite_only">Invite only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Who can post?
                    </label>
                    <select
                      name="postPermissions"
                      value={formData.postPermissions}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="members">All members</option>
                      <option value="moderators">Moderators and admins</option>
                      <option value="admins">Only admins</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Location</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {["online", "local", "global"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, locationType: type as any }))}
                        className={`
                          flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize
                          ${formData.locationType === type
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/30'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {formData.locationType === "local" && (
                    <div>
                      <label htmlFor="location" className="text-sm font-medium block mb-2">
                        City or region
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Group images</h2>
                
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
                      Group avatar
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

              {/* Token Economy (Optional) */}
              <div className="bg-card border border-border rounded-radius p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Token economy</h2>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableTokens}
                      onChange={(e) => setFormData(prev => ({ ...prev, enableTokens: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {formData.enableTokens && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enable tokens for your community. Members can earn and spend tokens within your group.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tokenName" className="text-sm font-medium block mb-2">
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
                        <label htmlFor="tokenSymbol" className="text-sm font-medium block mb-2">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Topics & Tags */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Tags</h2>
                <TagInput
                  tags={formData.tags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />
              </div>

              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Popular tags</h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!formData.tags.includes(tag) && formData.tags.length < 10) {
                          handleAddTag(tag);
                        }
                      }}
                      disabled={formData.tags.includes(tag) || formData.tags.length >= 10}
                      className={`
                        text-xs px-3 py-1.5 rounded-full transition
                        ${formData.tags.includes(tag)
                          ? 'bg-primary/10 text-primary cursor-default'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Rules & Guidelines */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  <h2 className="text-lg font-medium">Group rules</h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Set clear expectations for members. Good rules help build a healthy community.
                </p>

                <RulesBuilder
                  rules={formData.rules}
                  onAddRule={handleAddRule}
                  onUpdateRule={handleUpdateRule}
                  onRemoveRule={handleRemoveRule}
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-radius p-4">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <p className="text-xs text-muted-foreground">
                    Groups with clear rules have 40% more engaged members. Take time to write thoughtful guidelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Review your group</h2>
                
                <div className="space-y-4">
                  {/* Preview Card */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        {formData.avatar ? (
                          <Image
                            src={formData.avatar}
                            alt="Group avatar"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.5L9.07 3.67A2 2 0 0 0 7.64 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {formData.name || "Your Group Name"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {formData.description || "Group description will appear here."}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${formData.privacy === 'Public' ? 'bg-green-500/10 text-green-600' : ''}
                            ${formData.privacy === 'Private' ? 'bg-amber-500/10 text-amber-600' : ''}
                            ${formData.privacy === 'Hidden' ? 'bg-gray-500/10 text-gray-600' : ''}
                          `}>
                            {formData.privacy}
                          </span>
                          {formData.category && (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                              {categories.find(c => c.id === formData.category)?.name}
                              {formData.subcategory && ` · ${formData.subcategory}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Membership</p>
                      <p className="font-medium">
                        {formData.joinApproval === "anyone" && "Anyone can join"}
                        {formData.joinApproval === "admin_approval" && "Admin approval required"}
                        {formData.joinApproval === "invite_only" && "Invite only"}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Posting</p>
                      <p className="font-medium capitalize">
                        {formData.postPermissions === "members" && "All members"}
                        {formData.postPermissions === "moderators" && "Moderators & admins"}
                        {formData.postPermissions === "admins" && "Only admins"}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {formData.tags.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map(tag => (
                          <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rules */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Group rules</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {formData.rules.filter(r => r.rule.trim()).slice(0, 3).map((rule) => (
                        <li key={rule.id} className="text-sm text-muted-foreground">
                          {rule.rule}
                        </li>
                      ))}
                      {formData.rules.filter(r => r.rule.trim()).length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          +{formData.rules.filter(r => r.rule.trim()).length - 3} more rules
                        </li>
                      )}
                    </ol>
                  </div>
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
                href="/groups"
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
                    'Create Group'
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