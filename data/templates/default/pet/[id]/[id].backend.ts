import { Process, SuiRequest, Exception } from "@yao/runtime";

function Pet(r: SuiRequest) {
  // Get the pet ID from the request
  const id = r.params?.id;
  if (!id) {
    throw new Exception("Pet ID is required", 400);
  }

  const pets = Process("models.pets.Find", id, {
    select: ["id", "pet_name", "category_id"],
    withs: { category: { query: { select: ["id", "category_name"] } } }, // Use join query get the category name directly
  });
  return pets;
}
