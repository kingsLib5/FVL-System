// src/api/customerApi.js
export const fetchCustomerRecords = async (customerId) => {
  try {
    const res = await fetch(`https://fvl-system-backend.onrender.com/api/customers/${customerId}/records`);
    if (!res.ok) throw new Error("Failed to fetch records");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
