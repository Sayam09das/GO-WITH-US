import { hash } from "argon2";
import type { CatalogIds } from "./helpers.js";

const DEMO_USERS = [
  { email: "maya.reed@example.com", fullName: "Maya Reed" },
  { email: "jonah.patel@example.com", fullName: "Jonah Patel" },
  { email: "elena.sato@example.com", fullName: "Elena Sato" },
  { email: "noah.bennett@example.com", fullName: "Noah Bennett" },
  { email: "sofia.martin@example.com", fullName: "Sofia Martin" },
  { email: "liam.chen@example.com", fullName: "Liam Chen" },
  { email: "ava.dubois@example.com", fullName: "Ava Dubois" },
  { email: "ethan.okonkwo@example.com", fullName: "Ethan Okonkwo" },
  { email: "isla.murphy@example.com", fullName: "Isla Murphy" },
  { email: "mateo.alvarez@example.com", fullName: "Mateo Alvarez" },
  { email: "chloe.nguyen@example.com", fullName: "Chloe Nguyen" },
  { email: "daniel.khan@example.com", fullName: "Daniel Khan" },
  { email: "harper.rossi@example.com", fullName: "Harper Rossi" },
  { email: "oliver.jensen@example.com", fullName: "Oliver Jensen" },
  { email: "amelia.kowalski@example.com", fullName: "Amelia Kowalski" },
] as const;

const DEMO_PASSWORD = "CatalogReview123!";

export async function seedDemoUsers(
  prisma: import("../../generated/client.js").PrismaClient,
  ids: CatalogIds,
): Promise<void> {
  const passwordHash = await hash(DEMO_PASSWORD);

  for (const user of DEMO_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        emailVerified: true,
      },
      create: {
        email: user.email,
        fullName: user.fullName,
        passwordHash,
        emailVerified: true,
        travelStyles: ["Culture", "Food"],
        budgetPreference: "moderate",
      },
    });

    ids.users.set(user.email, record.id);
  }
}
