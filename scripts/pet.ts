import { Process, QueryParam, SearchResult, log } from "@yao/runtime";

type Option = { label: string; value: number | string };

/**
 * Get pet categories and return as options for select input.
 */
function FetchCategoryOptions(): Option[] {
  // The Process function, provided by the Yao Runtime, executes processes and returns results.
  // It's similar to the 'yao run' command.
  // You can also use FS, HTTP, and other Yao Runtime APIs.
  // For more details, see the Runtime References.
  const categories = Process("models.pet.categories.Get", {
    select: ["id", "category_name"],
    limit: 100,
  });

  // console.log used to output information to the terminal.
  // Because the script runs on the server side, the console output appears in the terminal, not in the browser.
  console.log(categories);

  // log.Info used to output information to the terminal.
  log.Info("Categories: %s", JSON.stringify(categories));

  // Return the categories as options for select input.
  return categories.map(
    (category) =>
      ({ label: category.category_name, value: category.id } as Option)
  );
}

/**
 * BeforeSearch hook for the pet search process.
 * @param query Query parameters for the pet search process.
 * @param page Current page number.
 * @param pagesize Number of items per page.
 * @returns [QueryParam,number,number] fixed query, page, and pagesize.
 */
function BeforeSearch(query: QueryParam, page, pagesize: number) {
  // Join the category table to get the category name.
  query.withs = { category: { query: { select: ["id", "category_name"] } } };
  console.log(query, page, pagesize);
  return [query, page, pagesize];
}

/**
 * AfterSearch hook for the pet search process.
 * @param response Search result of the pet search process.
 * @returns SearchResult<Record<string, any>> Modified search result.
 */
function AfterSearch(response: SearchResult<Record<string, any>>) {
  // Flatten the category object and add the category name to the pet object.
  response.data?.forEach((pet: Record<string, any>) => {
    pet.category_name = pet.category.category_name;
  });
  console.log(response);
  return response;
}

/**
 * Save pet data. custom process for saving pet data.
 * @param data
 * @returns
 */
function Save(payload: Record<string, any>) {
  console.log(payload);
  return Process("models.pets.Save", payload);
}
