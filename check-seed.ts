import { seed } from "./packages/db/src/seed";

async function main() {
  console.log("Before seed");
  await seed();
  console.log("After seed");
}

main().catch((error) => {
 console.error("Error during seeding:", error);
  console.error(error);
  process.exit(1);
});