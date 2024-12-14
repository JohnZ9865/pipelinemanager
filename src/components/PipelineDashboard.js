'use client';
import { useEffect, useState } from 'react';
import ContactCard from './ContactCard';
import AddUserModal from './AddUserModal';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../app/firebase/firebaseConfig';
import { updateCache } from '../app/firebase/firebasefunctions';

const PipelineDashboard = ({ data }) => {
  const [pipelineData, setPipelineData] = useState({
    initialconnect: [],
    inconvo: [],
    postcall: [],
    booked: [],
    longterm: [],
    dead: []
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        setPipelineData(parsed);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }, [data]);

  const handleStatusChange = async (contact, oldStatus, newStatus) => {
    try {
      // Optimistically update UI first
      const updatedContact = { ...contact, status: newStatus };
      setPipelineData(prevData => {
        let newData = { ...prevData };
        // Remove from old status
        newData[oldStatus] = prevData[oldStatus].filter(c => c.id !== contact.id);
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
          lastUpdated: new Date().toISOString()
        })
      ]);
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      // Revert the optimistic update on error
      setPipelineData(prevData => {
        const newData = { ...prevData };
        // Remove from new status
        newData[newStatus] = prevData[newStatus].filter(c => c.id !== contact.id);
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
    <div className="p-6">
      {/* First Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Initial Connect Column */}
        <div
          className="max-h-[50vh] overflow-y-auto bg-gray-50 p-4 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4">Initial Connect</h2>
          {pipelineData.initialconnect
            ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
            .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
            .map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                collection="initialconnect"
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>

        {/* In Conversation Column */}
        <div className="max-h-[50vh] overflow-y-auto bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">In Conversation</h2>
          {pipelineData.inconvo
            ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
            .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
            .map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                collection="inconvo"
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>
          
      
        {/* Booked Column */}
        <div
      className="max-h-[50vh] overflow-y-auto bg-gray-50 p-4 rounded-lg"
    >
          <h2 className="text-xl font-bold mb-4">Calls </h2>
          {pipelineData.booked
            ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
            .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
            .map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                collection="booked"
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>


      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Post Call Column */}
        <div
      className="max-h-[50vh] overflow-y-auto bg-gray-50 p-4 rounded-lg"
    >
          <h2 className="text-xl font-bold mb-4">Post Call</h2>
          {pipelineData.postcall
        ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
        .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
        .map(contact => (
          <ContactCard
            key={contact.id}
            contact={contact}
            collection="postcall"
            onStatusChange={handleStatusChange}
          />
        ))}
        </div>

        {/* Long Term Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Long Term</h2>
          {pipelineData.longterm
            ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
            .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
            .map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                collection="longterm"
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>

        </div>
        
        <div className='grid grid-cols-3 gap-4'>

        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Finished</h2>
            {pipelineData.finished
              ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
              .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
              .map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  collection="finished"
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>

            {/* Dead Column */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Dead</h2>
            {pipelineData.dead
              ?.filter(contact => contact.tofollowup && contact.tofollowup.seconds)
              .sort((a, b) => a.tofollowup.seconds - b.tofollowup.seconds)
              .map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  collection="dead"
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>

        
      </div>

      {/* Add User Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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