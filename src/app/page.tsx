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

  return (
    <main className="max-w-7xl my-5 mx-auto px-3">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-bold my-5">Users </h2>
        <Search search={searchParams.q} />
      </div>
      {allUsers.length > 0 ? (
        <>
          <div className="relative overflow-hidden">
            <table className="border-2 rounded-xl border-slate-700 table-fixed w-full text-sm">
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
          <div className="flex my-5 justify-end items-center gap-5">
            <Link
              href={`/?${prevSearchParams}`}
              className={`${
                safePageNumber === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              } px-5 py-2 rounded-md text-white`}
            >
              Previous
            </Link>
            <Link
              href={`/?${nextSearchParams}`}
              className={`${
                safePageNumber === numberOfPages
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              } px-5 py-2 rounded-md text-white`}
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
