"use client";
import { Button } from "@/components/button";
import { DataViewLayout } from "@/components/data-view";
import { FormInputLayout } from "@/components/form-input";
import Search from "@/components/search";
import { TabNavigation } from "@/components/tab-navigation";
import { Suspense, useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"input" | "lihat">("input");

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-black mb-6 text-center">
        Sistem Pendataan Product
      </h1>
      <div className="w-full max-w-3xl bg-gray-50 rounded-md overflow-hidden shadow">
        <Suspense fallback={<p>Loading feed...</p>}>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </Suspense>
        <div className="p-6">
          {activeTab === "input" ? (
            <Suspense fallback={<p>Loading feed...</p>}>
              {" "}
              <FormInputLayout />
            </Suspense>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <Search />
                <Button onClick={() => setActiveTab("input")}>
                  + Tambah Data Baru
                </Button>
              </div>
              <DataViewLayout />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
