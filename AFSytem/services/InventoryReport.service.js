const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const ExcelJS = require("exceljs");

exports.generateInventoryReport = async () => {
  let products;
  try {
    const response = await fetch("http://192.168.1.60:3001/api/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    products = await response.json();
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw error;
  }

  // Generate the HTML report
  let report =
    '<h1 style="text-align: center; color: #333;">Inventory Report</h1>';

  for (const product of products) {
    report += `
    <div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; width: 100%; margin: auto; margin-bottom: 2rem; padding: 2px 16px;">
      <h2 style="font-weight: bold;">${product.displayName}</h2>
      <p>Units On Hand: ${product.unitsOnHand}</p>
      <p>Cost: ${product.cost}</p>
    </div>`;
  }

  // Create a new workbook and a new worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Inventory Report");

  // Add the headers
  worksheet.columns = [
    { header: "Product", key: "displayName", width: 30 },
    { header: "Units On Hand", key: "unitsOnHand", width: 15 },
    { header: "Cost", key: "cost", width: 15 },
  ];

  // Add the product data
  for (const product of products) {
    worksheet.addRow(product);
  }

  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  // Write the workbook to a file
  const excelFilePath = `InventoryReport_${dateString}.xlsx`;
  await workbook.xlsx.writeFile(excelFilePath);

  // Return the HTML report and the path to the Excel file
  return { htmlReport: report, excelFilePath };
};
