"use client";

import { useState } from "react";
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  HeartIcon,
  GlobeAltIcon,
  ClockIcon,
  EyeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AppLayout from "../components/layout/AppLayout";

type ContentType =
  | "stories"
  | "essays"
  | "poems"
  | "articles"
  | "research"
  | "creative"
  | "whatsapp"
  | "conversations"
  | "tutorials"
  | "cultural"
  | "multilingual";

interface ContentTypeOption {
  id: ContentType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const contentTypes: ContentTypeOption[] = [
  {
    id: "stories",
    label: "Stories",
    description: "Fictional narratives, short stories, and creative tales",
    icon: <BookOpenIcon className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "essays",
    label: "Essays",
    description: "Personal reflections, academic writing, and opinion pieces",
    icon: <AcademicCapIcon className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "poems",
    label: "Poems",
    description: "Poetry, verses, and lyrical expressions",
    icon: <HeartIcon className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "articles",
    label: "Articles",
    description: "Informative content, guides, and educational material",
    icon: <DocumentTextIcon className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: "research",
    label: "Research",
    description: "Academic papers, studies, and analytical content",
    icon: <LightBulbIcon className="w-6 h-6" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Experimental writing, scripts, and innovative content",
    icon: <GlobeAltIcon className="w-6 h-6" />,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Chats",
    description: "Conversational data, group chats, and chat exports",
    icon: (
      <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">W</span>
      </div>
    ),
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "conversations",
    label: "Other Chats",
    description: "Discord, Slack, Telegram, and other platform conversations",
    icon: (
      <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">C</span>
      </div>
    ),
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "tutorials",
    label: "Tutorials",
    description:
      "How-to guides, step-by-step instructions, and learning materials",
    icon: (
      <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">T</span>
      </div>
    ),
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    id: "cultural",
    label: "Cultural Content",
    description: "Folklore, traditional knowledge, and cultural expressions",
    icon: (
      <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">F</span>
      </div>
    ),
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: "multilingual",
    label: "Multilingual",
    description: "Content in multiple languages and translation pairs",
    icon: (
      <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">M</span>
      </div>
    ),
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export default function DocsPage() {
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType>("stories");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleFileSelect = (file: File) => {
    // Check file type based on selected content type
    if (["whatsapp", "conversations"].includes(selectedContentType)) {
      // Accept .txt files for chat exports
      if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
        setError(
          `Please select a .txt file for ${selectedContentType} exports`
        );
        return;
      }
    } else if (selectedContentType === "multilingual") {
      // Accept both .txt and .pdf for multilingual content
      if (
        file.type !== "application/pdf" &&
        file.type !== "text/plain" &&
        !file.name.endsWith(".pdf") &&
        !file.name.endsWith(".txt")
      ) {
        setError("Please select a .pdf or .txt file for multilingual content");
        return;
      }
    } else {
      // For other content types, require PDF
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB");
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Simulate upload process - replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadSuccess(true);
      setSelectedFile(null);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setUploadSuccess(false);
  };

  const selectedType = contentTypes.find(
    (type) => type.id === selectedContentType
  );

  return (
    <AppLayout>
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Content Types
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedContentType(type.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                    selectedContentType === type.id
                      ? `${type.bgColor} ${type.color} ring-2 ring-offset-2 ring-offset-white ring-current`
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.bgColor}`}>
                      <div className={type.color}>{type.icon}</div>
                    </div>
                    <div>
                      <div className="font-semibold">{type.label}</div>
                      <div className="text-sm opacity-80">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowStats(!showStats)}
                className="w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {showStats ? "Hide" : "Show"} Statistics
              </button>

              {showStats && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Uploads</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">This Month</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Your Uploads</span>
                    <span className="font-medium text-indigo-600">12</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${selectedType?.bgColor}`}>
                <div className={selectedType?.color}>{selectedType?.icon}</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Upload {selectedType?.label}
                </h1>
                <p className="text-slate-600">{selectedType?.description}</p>
              </div>
            </div>

            {/* Upload Area */}
            {!uploadSuccess ? (
              <>
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-indigo-400 bg-indigo-50"
                      : selectedFile
                      ? "border-green-400 bg-green-50"
                      : "border-slate-300 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-4">
                      <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={removeFile}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <DocumentArrowUpIcon className="w-16 h-16 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          Drop your PDF here
                        </p>
                        <p className="text-sm text-slate-500">
                          or click to browse files
                        </p>
                        {["whatsapp", "conversations"].includes(
                          selectedContentType
                        ) && (
                          <p className="text-xs text-slate-400 mt-1">
                            Accepts .txt files from chat exports
                          </p>
                        )}
                        {selectedContentType === "multilingual" && (
                          <p className="text-xs text-slate-400 mt-1">
                            Accepts .pdf or .txt files for multilingual content
                          </p>
                        )}
                      </div>
                      <input
                        type="file"
                        accept={
                          ["whatsapp", "conversations"].includes(
                            selectedContentType
                          )
                            ? ".txt"
                            : selectedContentType === "multilingual"
                            ? ".pdf,.txt"
                            : ".pdf"
                        }
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                      >
                        <DocumentTextIcon className="w-5 h-5" />
                        Choose{" "}
                        {["whatsapp", "conversations"].includes(
                          selectedContentType
                        )
                          ? "TXT"
                          : selectedContentType === "multilingual"
                          ? "PDF/TXT"
                          : "PDF"}{" "}
                        File
                      </label>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Upload Button */}
                {selectedFile && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <DocumentArrowUpIcon className="w-5 h-5" />
                          Upload {selectedType?.label}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Success State */
              <div className="text-center py-12">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Upload Successful!
                </h3>
                <p className="text-slate-600 mb-8">
                  Your {selectedType?.label?.toLowerCase()} has been uploaded
                  successfully. Thank you for contributing!
                </p>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Upload Another Document
                </button>
              </div>
            )}
          </div>

          {/* Content Guidelines */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Guidelines for {selectedType?.label}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-indigo-600" />
                  Recommended Length
                </h4>
                <p className="text-slate-600 text-sm">
                  {selectedContentType === "stories" &&
                    "Short stories: 1,000-7,500 words. Novellas: 7,500-40,000 words."}
                  {selectedContentType === "essays" &&
                    "Personal essays: 500-2,000 words. Academic essays: 1,500-5,000 words."}
                  {selectedContentType === "poems" &&
                    "Any length from haiku to epic poems. Focus on quality over quantity."}
                  {selectedContentType === "articles" &&
                    "Feature articles: 1,000-3,000 words. How-to guides: 500-2,000 words."}
                  {selectedContentType === "research" &&
                    "Research papers: 3,000-10,000 words. Include proper citations."}
                  {selectedContentType === "creative" &&
                    "Experimental pieces: Any length. Be innovative and original."}
                  {selectedContentType === "whatsapp" &&
                    "Chat exports: Any length. Include meaningful conversations and group discussions."}
                  {selectedContentType === "conversations" &&
                    "Chat exports: Any length. Focus on diverse topics and natural language patterns."}
                  {selectedContentType === "tutorials" &&
                    "Step-by-step guides: 500-5,000 words. Clear instructions with examples."}
                  {selectedContentType === "cultural" &&
                    "Cultural content: Any length. Traditional knowledge, folklore, and expressions."}
                  {selectedContentType === "multilingual" &&
                    "Multilingual content: Any length. Include language pairs and translations."}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-indigo-600" />
                  Quality Standards
                </h4>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Original content (no plagiarism)</li>
                  <li>• Proper grammar and spelling</li>
                  <li>• Clear structure and flow</li>
                  <li>• Engaging and meaningful content</li>
                  {selectedContentType === "whatsapp" && (
                    <>
                      <li>• Respect privacy - remove personal information</li>
                      <li>• Include diverse conversation topics</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* WhatsApp-specific instructions */}
            {selectedContentType === "whatsapp" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <GlobeAltIcon className="w-5 h-5" />
                  How to Export WhatsApp Chats
                </h4>
                <ol className="text-green-700 text-sm space-y-1 ml-6">
                  <li>
                    1. Open WhatsApp and go to the chat you want to export
                  </li>
                  <li>2. Tap the three dots menu → More → Export chat</li>
                  <li>3. Choose &quot;Without Media&quot; to get a smaller .txt file</li>
                  <li>4. Save the file and upload it here</li>
                </ol>
                <p className="text-green-600 text-xs mt-2">
                  💡 Tip: Group chats with diverse topics and conversations are
                  especially valuable for AI training!
                </p>
              </div>
            )}
          </div>

          {/* Recent Uploads Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Recent {selectedType?.label} Uploads
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <div className={`p-2 rounded-lg ${selectedType?.bgColor}`}>
                    <div className={selectedType?.color}>
                      {selectedType?.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      Sample {selectedType?.label?.slice(0, -1)} {item}
                    </h4>
                    <p className="text-sm text-slate-600">
                      Uploaded by User • 2 hours ago
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <EyeIcon className="w-4 h-4" />
                    <span>24</span>
                    <StarIcon className="w-4 h-4" />
                    <span>4.8</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
