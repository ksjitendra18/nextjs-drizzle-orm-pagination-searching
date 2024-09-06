import Search from "@/components/search";
import { users } from "@/db/schema";
import { db } from "@/db/setup";

export default async function Home() {
  const allUsers = await db.select().from(users);
  return (
    <main className="max-w-7xl my-5 mx-auto px-3">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-bold my-5">Users </h2>
        <Search />
      </div>

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
    </main>
  );
}
