import { users } from "@/db/schema";
import { db } from "@/db/setup";
import { like, sql } from "drizzle-orm";
import Link from "next/link";
import Search from "@/components/search";

interface SearchParamsProps {
  searchParams: {
    page: string;
    q: string;
  };
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const searchQuery = typeof searchParams.q === "string" ? searchParams.q : "";
  const pageNumber = Math.max(1, Number(searchParams.page ?? 1));
  const numberOfItems = 6;

  const totalUsers = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(like(users.name, `%${searchQuery}%`));

  const totalCount = totalUsers[0].count;
  const numberOfPages = Math.max(1, Math.ceil(totalCount / numberOfItems));

  const safePageNumber = Math.min(pageNumber, numberOfPages);
  const offsetItems = (safePageNumber - 1) * numberOfItems;

  const allUsers = await db
    .select()
    .from(users)
    .limit(numberOfItems)
    .offset(offsetItems)
    .where(like(users.name, `%${searchQuery}%`));

  const prevSearchParams = new URLSearchParams(searchParams);
  const nextSearchParams = new URLSearchParams(searchParams);

  if (safePageNumber > 1) {
    prevSearchParams.set("page", `${safePageNumber - 1}`);
  } else {
    prevSearchParams.delete("page");
  }

  if (safePageNumber < numberOfPages) {
    nextSearchParams.set("page", `${safePageNumber + 1}`);
  } else {
    nextSearchParams.set("page", `${numberOfPages}`);
  }

  const generatePaginationArray = (current: number, max: number) => {
    if (max <= 7) return Array.from({ length: max }, (_, i) => i + 1);

    if (current <= 4) return [1, 2, 3, 4, 5, "...", max];
    if (current >= max - 3)
      return [1, "...", max - 4, max - 3, max - 2, max - 1, max];

    return [1, "...", current - 1, current, current + 1, "...", max];
  };

  const paginationArray = generatePaginationArray(pageNumber, numberOfPages);

  const createPageUrl = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    return `/users?${params.toString()}`;
  };

  return (
    <main className="max-w-7xl my-5 mx-auto px-3">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-bold my-5">Users </h2>
        <Search search={searchParams.q} />
      </div>
      {allUsers.length > 0 ? (
        <>
          <div className=" relative  overflow-hidden ">
            <table className=" border-2  rounded-xl border-slate-700 table-fixed w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-slate-700  font-medium p-4 pl-8  pb-3 text-left">
                    ID
                  </th>
                  <th className="border-b-2 border-slate-700 font-medium p-4 pl-8  pb-3 text-left">
                    Name
                  </th>
                  <th className="border-b-2 border-slate-700 font-medium p-4 pl-8  pb-3 text-left">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b border-slate-700  p-4 pl-8  ">
                      {user.id}
                    </td>
                    <td className="border-b border-slate-700  p-4 pl-8  ">
                      {user.name}
                    </td>
                    <td className="border-b border-slate-700  p-4 pl-8  ">
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex my-5 justify-center items-center gap-2">
            <Link
              href={createPageUrl(safePageNumber - 1)}
              className={`px-3 py-1 rounded border ${
                pageNumber === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              Prev
            </Link>

            {paginationArray.map((item, index) =>
              item === "..." ? (
                <span key={index} className="px-3 py-1">
                  ...
                </span>
              ) : (
                <Link
                  key={index}
                  href={createPageUrl(item)}
                  className={`px-3 py-1 rounded border ${
                    pageNumber === item
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item}
                </Link>
              )
            )}

            <Link
              href={createPageUrl(Math.min(numberOfPages, safePageNumber + 1))}
              className={`px-3 py-1 rounded border ${
                pageNumber === numberOfPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              Next
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center text-xl mt-10">No users found</p>
      )}
    </main>
  );
}
