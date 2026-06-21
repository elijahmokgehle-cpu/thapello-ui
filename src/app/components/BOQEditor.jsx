"use client";

export default function BOQEditor({ boq, updateItem, addItem, deleteItem, currency }) {
  const units = [
    "m²",
    "m³",
    "m",
    "kg",
    "tons",
    "pcs",
    "item",
  ];

  if (!boq || boq.length === 0) return null;

  return (
    <>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {boq.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
              </td>

              <td>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(index, "qty", e.target.value)}
                />
              </td>

              <td>
                <select
                  value={item.unit}
                  onChange={(e) => updateItem(index, "unit", e.target.value)}
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(index, "rate", e.target.value)}
                />
              </td>

              <td>
                {currency}
                {Number(item.total || 0).toFixed(2)}
              </td>

              <td>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={addItem}>Add BOQ Item</button>
      </div>
    </>
  );
}
