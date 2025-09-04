"use client";
import React, { useState } from "react";
import { User, Organization } from "@/types/types";
import {
  SearchIcon,
  CheckIcon,
  ArrowLeftIcon,
  UsersIcon,
} from "@/components/icons";
import Link from "next/link";

// Mock organizations data - in production this would come from an API
const mockOrganizations = [
  {
    id: "org1",
    name: "React Core Team",
    description:
      "The official organization for the React JavaScript library for building user interfaces. Our mission is to make it painless to create interactive UIs.",
    members: 15700,
    avatar: "⚛️",
    tags: ["Open Source", "JavaScript", "UI"],
    established: "2013",
  },
  {
    id: "org2",
    name: "Vue.js Official",
    description:
      "The community for the progressive JavaScript framework for building applications and ambitious single-page applications.",
    members: 22300,
    avatar: "🗄️",
    tags: ["Open Source", "JavaScript", "Framework"],
    established: "2014",
  },
  {
    id: "org3",
    name: "The Rust Foundation",
    description:
      "Dedicated to stewarding the Rust programming language and ecosystem, with a focus on performance, reliability, and productivity.",
    members: 8900,
    avatar: "🦀",
    tags: ["Open Source", "Programming Language"],
    established: "2020",
  },
  {
    id: "org4",
    name: "Blender Community",
    description:
      "A community for artists and developers of the free and open source 3D creation suite. Share your work, get feedback, and learn from others.",
    members: 45000,
    avatar: "🎨",
    tags: ["Open Source", "3D", "Art"],
    established: "1998",
  },
  {
    id: "org5",
    name: "Figma Designers",
    description:
      "A public community for designers to share plugins, files, and best practices. A place to connect, learn, and grow as a designer.",
    members: 120000,
    avatar: "🧩",
    tags: ["Design", "Community", "UI/UX"],
    established: "2016",
  },
  {
    id: "org6",
    name: "Docker Community",
    description:
      "Connect with other developers, learn about Docker, and share your projects. Home to Docker Captains and community leaders.",
    members: 18500,
    avatar: "🐳",
    tags: ["Open Source", "DevOps", "Containers"],
    established: "2013",
  },
];

const OrganizationCard: React.FC<{
  org: Organization;
  onSelect: () => void;
}> = ({ org, onSelect }) => (
  <div
    onClick={onSelect}
    className="bg-dark-card border border-dark-border rounded-2xl p-4 flex flex-col hover:border-brand-purple transition-colors duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in"
  >
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-xl bg-dark-bg flex items-center justify-center text-3xl flex-shrink-0">
        {org.avatar}
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-white">{org.name}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {org.description}
        </p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {org.tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 text-xs bg-brand-purple/20 text-brand-purple-light rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
    <div className="flex-grow" />
    <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <UsersIcon className="w-4 h-4" />
        <span>
          {Intl.NumberFormat("en-US", { notation: "compact" }).format(
            org.members
          )}{" "}
          members
        </span>
      </div>
      <button className="px-4 py-1.5 text-sm font-semibold bg-white/5 text-white rounded-md hover:bg-white/10 transition-colors">
        View
      </button>
    </div>
  </div>
);

const OrganizationDetailView: React.FC<{
  org: Organization;
  onBack: () => void;
}> = ({ org, onBack }) => {
  const [joinStatus, setJoinStatus] = useState<
    "idle" | "requested" | "approved" | "denied"
  >("idle");

  const handleJoinRequest = () => {
    setJoinStatus("requested");
    setTimeout(() => {
      // In a real app, this would be handled by a backend
      // This is just for demonstration
      setJoinStatus("approved");
    }, 3000);
  };

  return (
    <div className="relative flex-grow flex flex-col h-full bg-dark-bg animate-fade-in">
      <header className="p-4 border-b border-dark-border flex-shrink-0 flex items-center gap-4">
        <button
          onClick={onBack}
          title="Back to explore"
          className="p-2 rounded-md hover:bg-white/10"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-lg">{org.name}</h2>
          <p className="text-sm text-gray-400">Organization details</p>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-dark-bg flex items-center justify-center text-5xl flex-shrink-0">
            {org.avatar}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{org.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {org.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs bg-brand-purple/20 text-brand-purple-light rounded-full font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h4 className="font-bold text-white mb-2">About</h4>
          <p className="text-gray-300 leading-relaxed">{org.description}</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-white text-sm text-gray-400">
              Members
            </h4>
            <p className="text-2xl font-semibold text-white">
              {Intl.NumberFormat("en-US").format(org.members)}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm text-gray-400">
              Established
            </h4>
            <p className="text-2xl font-semibold text-white">
              {org.established}
            </p>
          </div>
        </div>

        <button
          onClick={handleJoinRequest}
          disabled={joinStatus !== "idle"}
          className="w-full mt-4 py-3 rounded-lg font-semibold transition-colors bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {joinStatus === "idle" && "Request to Join"}
          {joinStatus === "requested" && (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          )}
          {joinStatus === "approved" && (
            <>
              <CheckIcon className="w-5 h-5" /> Request Approved!
            </>
          )}
          {joinStatus === "denied" && "Request Denied"}
        </button>

        {joinStatus === "approved" && (
          <div className="flex flex-col items-center justify-center p-6 bg-dark-card border border-green-500 rounded-2xl mt-4 animate-fade-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Welcome to {org.name}!
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Your membership has been approved. You can now access all
              organization resources.
            </p>
            <Link
              href="/dashboard"
              className="bg-brand-purple text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-purple-light transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>

      {joinStatus === "requested" && (
        <div className="absolute bottom-5 right-5 bg-brand-purple text-white px-5 py-3 rounded-lg shadow-lg animate-slide-up flex items-center gap-3">
          <span className="font-semibold">Join request sent successfully!</span>
        </div>
      )}
    </div>
  );
};

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  if (selectedOrg) {
    return (
      <OrganizationDetailView
        org={selectedOrg}
        onBack={() => setSelectedOrg(null)}
      />
    );
  }

  // Filter organizations based on search query and selected tag
  const filteredOrgs = mockOrganizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      !selectedTag ||
      org.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  // Get unique tags from all organizations
  const allTags = Array.from(
    new Set(mockOrganizations.flatMap((org) => org.tags))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-black/90 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Explore Organizations
              </h1>
              <p className="text-gray-400 mt-2">
                Discover and join public communities and open-source projects
              </p>
            </div>
            <Link
              href="/dashboard"
              className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Search and filter */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="relative flex-grow max-w-xl">
              <SearchIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-brand-purple text-white"
                      : "bg-dark-card border border-dark-border text-gray-300 hover:bg-dark-border"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </header>

        {filteredOrgs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-dark-card rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              No organizations found
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We couldn't find any organizations matching your search criteria.
              Try different keywords or remove filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
              className="bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <OrganizationCard
                key={org.id}
                org={org}
                onSelect={() => setSelectedOrg(org)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
