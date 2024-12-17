import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../app/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { collectionNames, formalwords } from "../app/constants";

const AddUserModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [status, setStatus] = useState(collectionNames[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docData = {
        name,
        company,
        tofollowup: Timestamp.fromDate(followUpDate),
        status,
      };

      await addDoc(collection(db, status), docData);
      onClose();
      setName("");
      setCompany("");
      setFollowUpDate(new Date());
      setStatus(collectionNames[0]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 text-gray-300">
      <div className="w-96 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-white">Add New Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-200">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-200">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-200">Follow-up Date</label>
            <DatePicker
              selected={followUpDate}
              onChange={(date) => setFollowUpDate(date)}
              className="w-full rounded border border-gray-700 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-200">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {collectionNames.map((name) => (
                <option key={name} value={name} className="text-gray-800">
                  {formalwords.get(name)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
