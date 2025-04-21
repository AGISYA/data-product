"use client";

import { Suspense } from "react";

interface TabNavigationProps {
  activeTab: "input" | "lihat";
  setActiveTab: (tab: "input" | "lihat") => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "input"
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("input")}
        >
          Input Data
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "lihat"
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("lihat")}
        >
          Lihat Data
        </button>
      </div>
    </Suspense>
  );
}
