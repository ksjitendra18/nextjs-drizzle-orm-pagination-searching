import { faker } from "@faker-js/faker";
import { db } from "@/db/setup";
import { users } from "@/db/schema";

const seedData = async () => {
  faker.seed(123);
  console.log("Starting Seeding Database 🚀");
  try {
    for (let i = 0; i < 500; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      await db.insert(users).values({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
      });
    }

    console.log("Data added successfully ✅");
  } catch (error) {
    console.log("Coudn't seed database ❌", error);
  } finally {
    process.exit();
  }
};

seedData();
