import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../context/AuthContext";

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState("");
  const [waterType, setWaterType] = useState("BAG");
  const [message, setMessage] = useState("");

  const addBatch = async () => {
  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    setMessage("Quantity must be positive!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/water", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ waterType, quantity: qty }),
    });

    if (!res.ok) throw new Error("Failed to create batch");

    const data = await res.json();
    setMessage(`Batch created successfully! Serial: ${data.serialCode}`);
    setQuantity("");
    setWaterType("BAG");
  } catch (err) {
    setMessage(err.message);
  }
};


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New Water Batch</h2>

      <input
        type="number"
        min="1"
        step="1"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border px-3 py-1 mb-2 mr-2"
      />

      <select
        value={waterType}
        onChange={(e) => setWaterType(e.target.value)}
        className="border px-3 py-1 mb-2 mr-2"
      >
        <option value="BAG">Bag</option>
        <option value="PACK">Pack</option>
      </select>

      <button
        onClick={addBatch}
        className="bg-blue-700 text-white px-4 py-1 rounded"
      >
        Add Batch
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default ProducerDashboard;
