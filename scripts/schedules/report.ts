import { FS, Query, log } from "@yao/runtime";

/**
 * Generate a report for the given date.
 * Tests:
 *   yao run scripts.schedules.report.Generate "2024-11-25"
 *   yao run scripts.schedules.report.Generate "2024-11-18"
 * @param date The date to generate the report for. If not provided, today's date is used.
 */
function Generate(date?: string) {
  // Parse the date and get the start and end of the day
  const time = date ? new Date(date) : new Date();
  const day = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
  const from = `${day} 00:00:00`;
  const to = `${day} 23:59:59`;

  // Log the date range
  console.log(`Generating report for ${day}...`);
  log.Trace("Generating report for %s...", day);

  // Query data from database
  // For details, please refer to Query DSL reference
  const qb = new Query("default");
  const rows = qb.Get({
    from: "pets",
    debug: true,
    select: [
      "category_id",
      "category.category_name",
      ":COUNT(pets.id) as total",
    ],
    joins: [
      {
        left: true,
        from: "pet_categories as category",
        key: "category_id",
        foreign: "category.id",
      },
    ],
    wheres: [
      { field: "pets.created_at", ">=": from },
      { field: "pets.created_at", "<=": to },
    ],
    groups: ["category_id"],
  });

  // Save the report to a file
  // For details, please refer to Yao Runtime API reference
  const fs = new FS("data");
  const file = `/reports/${day}.csv`; // eg /data/reports/2024-11-25.csv
  const content = rows
    .map(
      (row: Record<string, any>) =>
        `${row.category_id},${row.category_name},${row.total}`
    )
    .join("\n");

  fs.WriteFile(file, content);

  console.log(`Report generated at ${file}`);
  log.Trace("Report generated at %s", file);
}
