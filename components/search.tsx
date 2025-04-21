"use client";
import { IoSearch } from "react-icons/io5";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const SearchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(term);
    const params = new URLSearchParams(SearchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="relative text-black flex flex-1">
      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />

      <input
        type="text"
        className="w-full border border-gray-200 py-2 pl-10 text-sm outline-2 rounded-sm"
        placeholder="Cari data siswa..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={SearchParams.get("query")?.toString()}
      />
    </div>
  );
}
