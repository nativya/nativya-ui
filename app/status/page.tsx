"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";

interface ContributionStatus {
  id: string;
  promptTitle: string;
  languageCode: string;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: Date;
  currentStep?: number;
  totalSteps?: number;
  stepName?: string;
  transactionHash?: string;
  fileId?: string;
  rewardAmount?: string;
}

export default function StatusPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [contributions, setContributions] = useState<ContributionStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const fetchContributions = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockData: ContributionStatus[] = [
          {
            id: "1",
            promptTitle: "Describe this image in your native language",
            languageCode: "hi",
            status: "processing",
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            currentStep: 3,
            totalSteps: 5,
            stepName: "Generating TEE Proof",
            transactionHash: "0x1234...5678",
            fileId: "12345",
          },
          {
            id: "2",
            promptTitle: "Read the following text aloud",
            languageCode: "bn",
            status: "completed",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            currentStep: 5,
            totalSteps: 5,
            stepName: "Reward Claimed",
            transactionHash: "0xabcd...efgh",
            fileId: "67890",
            rewardAmount: "0.05 ETH",
          },
          {
            id: "3",
            promptTitle: "Translate this sentence to your language",
            languageCode: "ta",
            status: "pending",
            timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            currentStep: 1,
            totalSteps: 5,
            stepName: "Uploading Data",
          },
        ];
        setContributions(mockData);
        setLoading(false);
      }, 1000);
    };

    if (isClient && status === "authenticated") {
      fetchContributions();
    }
  }, [isClient, status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "processing":
        return (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case "pending":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "failed":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (status === "loading" || !isClient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="animate-pulse">
          <div className="h-16 bg-white border-b border-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-64 bg-white rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Contribution Status
              </h1>
              <p className="text-slate-600 mt-1">
                Track your data contributions and rewards
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/contribution")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                New Contribution
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Contributions",
              value: contributions.length,
              color: "bg-blue-500",
            },
            {
              label: "Completed",
              value: contributions.filter((c) => c.status === "completed")
                .length,
              color: "bg-green-500",
            },
            {
              label: "Processing",
              value: contributions.filter((c) => c.status === "processing")
                .length,
              color: "bg-yellow-500",
            },
            {
              label: "Pending",
              value: contributions.filter((c) => c.status === "pending").length,
              color: "bg-gray-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${stat.color} mr-3`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contributions List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Contributions
            </h2>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : contributions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No contributions yet
              </h3>
              <p className="text-slate-600 mb-6">
                Start contributing to see your status here
              </p>
              <button
                onClick={() => router.push("/contribution")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Make Your First Contribution
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            contribution.status
                          )}`}
                        >
                          {getStatusIcon(contribution.status)}
                          {contribution.status.charAt(0).toUpperCase() +
                            contribution.status.slice(1)}
                        </span>
                        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                          {contribution.languageCode}
                        </span>
                      </div>

                      <h3 className="font-medium text-slate-900 mb-1">
                        {contribution.promptTitle}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {formatTimeAgo(contribution.timestamp)}
                      </p>

                      {/* Progress Bar for Processing */}
                      {contribution.status === "processing" &&
                        contribution.currentStep &&
                        contribution.totalSteps && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-slate-600">
                                {contribution.stepName}
                              </span>
                              <span className="text-xs text-slate-500">
                                {contribution.currentStep}/
                                {contribution.totalSteps}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    (contribution.currentStep /
                                      contribution.totalSteps) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        {contribution.fileId && (
                          <span>File ID: {contribution.fileId}</span>
                        )}
                        {contribution.transactionHash && (
                          <span>TX: {contribution.transactionHash}</span>
                        )}
                        {contribution.rewardAmount && (
                          <span className="text-green-600 font-medium">
                            Reward: {contribution.rewardAmount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      {contribution.status === "completed" && (
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
