import { users } from "@/db/schema";
import { db } from "@/db/setup";
import { sql } from "drizzle-orm";
import Link from "next/link";

interface SearchParamsProps {
  searchParams: {
    page: string;
  };
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const pageNumber = Number(searchParams.page ?? 1);

  const numberOfItems = 6;

  const totalUsers = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const numberOfPages = Math.ceil(totalUsers[0].count / numberOfItems);

  let safePageNumber = 1;

  if (pageNumber < 1) {
    safePageNumber = 1;
  } else if (pageNumber > numberOfPages) {
    safePageNumber = 1;
  } else {
    safePageNumber = pageNumber;
  }

  const offsetItems =
    safePageNumber > 1 ? (safePageNumber - 1) * numberOfItems : 0;

  const allUsers = await db.select().from(users).limit(6).offset(offsetItems);

  const prevSearchParams = new URLSearchParams();
  const nextSearchParams = new URLSearchParams();

  if (safePageNumber > 2) {
    prevSearchParams.set("page", `${safePageNumber - 1}`);
  } else {
    prevSearchParams.delete("page");
  }

  if (safePageNumber > 0) {
    if (safePageNumber === numberOfPages) {
      nextSearchParams.set("page", `${numberOfPages}`);
    } else {
      nextSearchParams.set("page", `${safePageNumber + 1}`);
    }
  } else {
    nextSearchParams.delete("page");
  }

  return (
    <main className="max-w-7xl my-5 mx-auto px-3">
      <h2 className="text-center text-2xl font-bold my-5">Users </h2>
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

      <div className="flex my-5 justify-end items-center gap-5">
        <Link
          href={`/?${prevSearchParams}`}
          className={`${
            safePageNumber < 2
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          } px-5 py-2 rounded-md text-white `}
        >
          Previous
        </Link>

        <Link
          href={`/?${nextSearchParams}`}
          className={`${
            safePageNumber >= numberOfPages
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          } px-5 py-2 rounded-md text-white `}
        >
          Next
        </Link>
      </div>
    </main>
  );
}
