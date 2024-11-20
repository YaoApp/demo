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


this.__sui_page = '/pet/[id]';
this.__sui_constants = {};
this.__sui_helpers = [];

if (typeof Helpers === 'object') {
	this.__sui_helpers = Object.keys(Helpers);
}

if (typeof Constants === 'object') {
	this.__sui_constants = Constants;
}
