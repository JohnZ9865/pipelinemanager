"use client";
import { useEffect, useState } from "react";
import ContactCard from "./ContactCard";
import AddUserModal from "./AddUserModal";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../app/firebase/firebaseConfig";
import { updateCache } from "../app/firebase/firebasefunctions";
import { collectionNames, formalwords, columnObjects, totalRows } from "../app/constants";

const PipelineDashboard = ({ data, isExtendedView }) => {
  const [pipelineData, setPipelineData] = useState({
    initialconnect: [],
    inconvo: [],
    postcall: [],
    booked: [],
    longterm: [],
    dead: [],
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setPipelineData(parsed);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [data]);

  const handleStatusChange = async (contact, oldStatus, newStatus) => {
    try {
      // Optimistically update UI first
      const updatedContact = { ...contact, status: newStatus };
      setPipelineData((prevData) => {
        let newData = { ...prevData };
        // Remove from old status
        newData[oldStatus] = prevData[oldStatus].filter(
          (c) => c.id !== contact.id,
        );
        // Add to new status
        newData[newStatus] = [...(prevData[newStatus] || []), updatedContact];

        // Update cache immediately
        updateCache(oldStatus, newData[oldStatus]);
        updateCache(newStatus, newData[newStatus]);

        return newData;
      });

      // Then update database
      await Promise.all([
        deleteDoc(doc(db, oldStatus, contact.id)),
        setDoc(doc(db, newStatus, contact.id), {
          ...contact,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        }),
      ]);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
      // Revert the optimistic update on error
      setPipelineData((prevData) => {
        const newData = { ...prevData };
        // Remove from new status
        newData[newStatus] = prevData[newStatus].filter(
          (c) => c.id !== contact.id,
        );
        // Add back to old status
        newData[oldStatus] = [...prevData[oldStatus], contact];

        // Update cache with reverted data
        updateCache(oldStatus, newData[oldStatus]);
        updateCache(newStatus, newData[newStatus]);

        return newData;
      });
    }
  };

  return (
    <div className="bg-gray-900 p-2 sm:p-6">
      {Array.from({ length: totalRows }, (_, currentRow) => currentRow + 1).map(
      (currentRow) => (
        <div
          key={`row-${currentRow}`}
          className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {columnObjects
            .filter((colItem) => colItem.row === currentRow) // Filter items matching current row
            .map((colItem) => (
              <div
                key={colItem.name}
                className={`relative flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-md sm:p-4 max-h-[60vh] md:max-h-[90vh]`}
              >
                <h2 className="sticky top-0 z-10 mb-2 bg-gray-800 text-lg font-bold text-gray-100 sm:mb-4 sm:text-xl">
                  {colItem.formalwords}
                </h2>
                <div className="overflow-y-auto">
                  {pipelineData[colItem.name]
                    ?.filter(
                      (contact) =>
                        contact.tofollowup && contact.tofollowup.seconds,
                    )
                    .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
                    .map((contact) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        collection={colItem.name}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      ),
    )}

      {/* Add User Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Add New Contact
        </button>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default PipelineDashboard;
