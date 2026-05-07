import { db } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { DAYS, TIME_SLOTS } from '../utils/constants';

const AVAILABILITY_COLLECTION = 'availability';

export const saveAvailability = async (lecturerId, schedule) => {
  try {
    const q = query(collection(db, AVAILABILITY_COLLECTION), where('lecturerId', '==', lecturerId));
    const querySnapshot = await getDocs(q);
    
    const availabilityData = {
      lecturerId,
      schedule,
      updatedAt: new Date().toISOString()
    };
    
    if (querySnapshot.empty) {
      // Create new
      const newDocRef = doc(collection(db, AVAILABILITY_COLLECTION));
      await setDoc(newDocRef, availabilityData);
      return { id: newDocRef.id, ...availabilityData };
    } else {
      // Update existing
      const docRef = doc(db, AVAILABILITY_COLLECTION, querySnapshot.docs[0].id);
      await updateDoc(docRef, availabilityData);
      return { id: querySnapshot.docs[0].id, ...availabilityData };
    }
  } catch (error) {
    console.error('Error saving availability:', error);
    throw error;
  }
};

export const getAvailabilityByLecturer = async (lecturerId) => {
  try {
    const q = query(collection(db, AVAILABILITY_COLLECTION), where('lecturerId', '==', lecturerId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Return empty schedule if none exists
      const emptySchedule = {};
      DAYS.forEach(day => { emptySchedule[day] = []; });
      return { schedule: emptySchedule };
    }
    
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
};

export const initializeLecturerAvailability = async (lecturerId) => {
  const existing = await getAvailabilityByLecturer(lecturerId);
  if (!existing.schedule || Object.keys(existing.schedule).length === 0) {
    const defaultSchedule = {};
    DAYS.forEach(day => { defaultSchedule[day] = [...TIME_SLOTS]; });
    return await saveAvailability(lecturerId, defaultSchedule);
  }
  return existing;
};