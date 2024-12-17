"use client";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../app/firebase/firebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collectionNames } from "../app/constants";

const ContactCard = ({ contact, collection, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [localFollowUpDate, setLocalFollowUpDate] = useState(
    contact.tofollowup
      ? new Date(contact.tofollowup.seconds * 1000)
      : new Date(),
  );
  const statusOptions = collectionNames;

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "None";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === collection || isUpdating) return; // Avoid redundant updates
    setIsUpdating(true);
    try {
      await onStatusChange(contact, collection, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLocalStorage = (collection, contactId, updatedField) => {
    const cachedData = localStorage.getItem("firestore_data");
    if (!cachedData) return;

    const parsedData = JSON.parse(cachedData);
    const data = JSON.parse(parsedData.data);

    if (data[collection]) {
      const contactIndex = data[collection].findIndex(
        (c) => c.id === contactId,
      );
      if (contactIndex !== -1) {
        Object.assign(data[collection][contactIndex], updatedField);
        localStorage.setItem(
          "firestore_data",
          JSON.stringify({
            data: JSON.stringify(data),
            timestamp: new Date().getTime(),
          }),
        );
      }
    }
  };

  const handleDateChange = async (selectedDate) => {
    if (
      !selectedDate ||
      isUpdating ||
      (contact.tofollowup &&
        contact.tofollowup.seconds ===
          Math.floor(selectedDate.getTime() / 1000))
    ) {
      return; // Skip if same date or already updating
    }

    setIsUpdating(true);
    const newDate = {
      seconds: Math.floor(selectedDate.getTime() / 1000),
      nanoseconds: 0,
    };

    try {
      // Update Firebase
      const docRef = doc(db, collection, contact.id);
      await updateDoc(docRef, { tofollowup: newDate });

      // Update local state after successful Firebase write
      setLocalFollowUpDate(selectedDate);

      // Update local storage
      updateLocalStorage(collection, contact.id, { tofollowup: newDate });
    } catch (error) {
      console.error("Error updating follow-up date:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!contact.tofollowup || !contact.tofollowup.seconds) {
    return null; // Don't render cards without follow-up dates
  }

  return (
    <>
      <div
        className="mb-2 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-2 text-xs shadow-md hover:bg-gray-700 sm:text-sm"
        onClick={() => setShowModal(true)}
      >
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="w-full min-w-0 grow sm:w-1/3">
            <div className="truncate font-medium text-gray-100">
              {contact.company || "None"}
            </div>
            <div className="truncate text-gray-400">
              {contact.name || "None"}
            </div>
          </div>

          <div
            className="flex w-full grow-0 items-center gap-2 sm:w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker
              selected={localFollowUpDate}
              onChange={handleDateChange}
              className="focus:shadow-outline h-6 w-full appearance-none rounded border border-gray-700 bg-gray-800 px-2 py-1 leading-tight text-gray-100 shadow focus:outline-none sm:h-8 sm:px-3 sm:py-2"
              dateFormat="MMM d"
              minDate={new Date()}
              disabled={isUpdating}
            />
            <select
              className="rounded border border-gray-700 bg-gray-800 p-1 text-xs text-gray-100"
              value={collection}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-lg rounded-lg border border-gray-700 bg-gray-800 p-6">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-semibold text-gray-100">
                Contact Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-medium text-gray-100">Name:</label>
                <p className="text-gray-300">{contact.name || "None"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-100">Company:</label>
                <p className="text-gray-300">{contact.company || "None"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-100">Status:</label>
                <p className="capitalize text-gray-300">{collection}</p>
              </div>
              <div>
                <label className="font-medium text-gray-100">
                  Follow-up Date:
                </label>
                <p className="text-gray-300">
                  {formatDate(contact.tofollowup)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
