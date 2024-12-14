'use client';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../app/firebase/firebaseConfig';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { collectionNames } from '../app/constants';

const ContactCard = ({ contact, collection, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [localFollowUpDate, setLocalFollowUpDate] = useState(
    contact.tofollowup ? new Date(contact.tofollowup.seconds * 1000) : new Date()
  );
  const statusOptions = collectionNames;

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'None';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === collection || isUpdating) return; // Avoid redundant updates
    setIsUpdating(true);
    try {
      await onStatusChange(contact, collection, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  

  const updateLocalStorage = (collection, contactId, updatedField) => {
    const cachedData = localStorage.getItem('firestore_data');
    if (!cachedData) return;
  
    const parsedData = JSON.parse(cachedData);
    const data = JSON.parse(parsedData.data);
  
    if (data[collection]) {
      const contactIndex = data[collection].findIndex((c) => c.id === contactId);
      if (contactIndex !== -1) {
        Object.assign(data[collection][contactIndex], updatedField);
        localStorage.setItem(
          'firestore_data',
          JSON.stringify({
            data: JSON.stringify(data),
            timestamp: new Date().getTime(),
          })
        );
      }
    }
  };
  
  const handleDateChange = async (selectedDate) => {
    if (
      !selectedDate ||
      isUpdating ||
      (contact.tofollowup &&
        contact.tofollowup.seconds === Math.floor(selectedDate.getTime() / 1000))
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
      console.error('Error updating follow-up date:', error);
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
        className="bg-white p-2 rounded-lg shadow-sm mb-2 text-xs sm:text-sm hover:bg-gray-50 cursor-pointer border-2"
        onClick={() => setShowModal(true)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="grow min-w-0 w-full sm:w-1/3">
            <div className="font-medium truncate">{contact.company || 'None'}</div>
            <div className="text-gray-600 truncate">{contact.name || 'None'}</div>
          </div>

          <div className="flex w-full sm:w-auto grow-0 gap-2 items-center" onClick={(e) => e.stopPropagation()}>
            <DatePicker
              selected={localFollowUpDate}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-1 sm:py-2 px-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-6 sm:h-8"
              dateFormat="MMM d"
              minDate={new Date()}
              disabled={isUpdating}
            />
            <select
              className="border rounded p-1 text-xs bg-white"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Contact Details</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-medium">Name:</label>
                <p>{contact.name || 'None'}</p>
              </div>
              <div>
                <label className="font-medium">Company:</label>
                <p>{contact.company || 'None'}</p>
              </div>
              <div>
                <label className="font-medium">Status:</label>
                <p className="capitalize">{collection}</p>
              </div>
              <div>
                <label className="font-medium">Follow-up Date:</label>
                <p>{formatDate(contact.tofollowup)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
