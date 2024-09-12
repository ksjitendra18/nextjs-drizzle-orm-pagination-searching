"use client";

import { Loader2, SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ search }: { search: string | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    startTransition(() => {
      if (value) {
        router.push(`${pathname}/?q=${value}`);
      } else {
        router.push(`${pathname}`);
      }
      setIsLoading(false);
    });
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    debouncedSearch(event.target.value);
  };

  return (
    <div className="relative mt-1 rounded-md shadow-sm border-2 border-gray-300">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        defaultValue={search}
        className="block w-full rounded-md border-gray-300 pl-10 text-sm focus:border-gray-400 focus:outline-none focus:ring-0 py-2"
        placeholder="Search"
        onChange={handleSearchChange}
      />

      {isLoading && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Loader2
            className="h-5 w-5 text-gray-400 animate-spin"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
