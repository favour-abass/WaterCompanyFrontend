import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ProducerDashboard = () => {
  const [quantity, setQuantity] = useState("");
  const [waterType, setWaterType] = useState("BAG");
  const [message, setMessage] = useState("");

  const generateBatchNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `BATCH-${date}-${random}`;
  };

  const addBatch = async () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setMessage("Quantity must be a positive number!");
      return;
    }
    if (!quantity) {
      setMessage("Please enter quantity!");
      return;
    }

    const batchNumber = generateBatchNumber();
    const serialNumbers = Array.from(
      { length: Number(quantity) },
      () => `WAT-${uuidv4()}`
    );

    // Mock backend/blockchain call
    console.log({
      batchNumber,
      quantity,
      waterType,
      serialNumbers,
    });

    setMessage(
      `Batch ${batchNumber} (${waterType.toLowerCase()}) added with ${quantity} units!`
    );

    setQuantity("");
    setWaterType("BAG");
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
