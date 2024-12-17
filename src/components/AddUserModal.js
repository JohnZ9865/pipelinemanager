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
  const [status, setStatus] = useState(collectionNames[0]); // Default to the first value in collectionNames

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
      setStatus(collectionNames[0]); // Reset to the first value
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Add New Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Follow-up Date
            </label>
            <DatePicker
              selected={followUpDate}
              onChange={(date) => setFollowUpDate(date)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            >
              {collectionNames.map((name) => (
                <option key={name} value={name}>
                  {formalwords.get(name)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded border px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
