import { Process } from "@yao/runtime";

function PetList() {
  const pets = Process("models.pets.Get", {
    select: ["id", "pet_name", "category_id", "age", "breed", "description"],
    withs: { category: { query: { select: ["id", "category_name"] } } }, // Use join query get the category name directly
  });
  return pets;
}
