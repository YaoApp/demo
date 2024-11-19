import { Process, log } from "@yao/runtime";

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
