import { Process } from "@yao/runtime";

function PetList() {
  const pets = Process("models.pets.Get", {
    select: ["id", "pet_name", "category_id"],
    withs: { category: { query: { select: ["id", "category_name"] } } }, // Use join query get the category name directly
  });
  return pets;
}


this.__sui_page = '/pet/index';
this.__sui_constants = {};
this.__sui_helpers = [];

if (typeof Helpers === 'object') {
	this.__sui_helpers = Object.keys(Helpers);
}

if (typeof Constants === 'object') {
	this.__sui_constants = Constants;
}
