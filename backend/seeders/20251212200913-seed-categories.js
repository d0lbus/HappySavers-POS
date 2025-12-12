export async function up(queryInterface) {
  const names = ["Chocolates", "Snacks", "Drinks", "Household", "Personal Care"];

  await queryInterface.bulkInsert(
    "categories",
    names.map((name) => ({
      name,
      created_at: new Date(),
      updated_at: new Date(),
    }))
  );
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("categories", null, {});
}
