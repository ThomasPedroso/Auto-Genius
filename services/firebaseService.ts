
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, setDoc, writeBatch, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; 
import type { User, MarketplaceCar, Post, Car, AutomotiveEvent } from "../types";
import { MOCK_MARKETPLACE_CARS, MOCK_USER, MOCK_CAR, MOCK_POSTS, MOCK_EVENTS } from "../constants";

const getCurrentUserId = () => {
    const user = auth.currentUser;
    if (!user) {
        console.warn("No user logged in, using Demo ID");
        return 'current_user_demo';
    }
    return user.uid;
}

// --- SYSTEM STATUS ---
export const checkDatabaseConnection = async (): Promise<'connected' | 'denied' | 'error'> => {
  try {
    const testRef = doc(db, "_healthcheck", "status");
    await setDoc(testRef, { lastCheck: new Date().toISOString() });
    return 'connected';
  } catch (error: any) {
    if (error.code === 'permission-denied') return 'denied';
    console.error("DB Connection Check Error:", error);
    return 'error';
  }
};

// --- USERS ---

export const getUserProfile = async (userId?: string): Promise<User | null> => {
  const targetUid = userId || getCurrentUserId();
  try {
    const docRef = doc(db, "users", targetUid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } 
    
    // Only create default for CURRENT user if missing
    if (!userId || userId === getCurrentUserId()) {
      const firebaseUser = auth.currentUser;
      const newUserProfile = {
          ...MOCK_USER,
          name: firebaseUser?.displayName || MOCK_USER.name,
          email: firebaseUser?.email || MOCK_USER.email,
          avatarUrl: firebaseUser?.photoURL || MOCK_USER.avatarUrl
      };
      await setDoc(docRef, newUserProfile);
      return newUserProfile;
    }
    return null;
  } catch (error: any) {
    console.warn(`Firebase Error (User): ${error.code || error.message}. Using Mock.`);
    if (!userId) return MOCK_USER;
    return null;
  }
};

export const updateUserProfile = async (data: Partial<User>) => {
  const uid = getCurrentUserId();
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
  } catch (error: any) {
    console.error("Error updating profile:", error);
  }
};

// --- GARAGE (List of Cars) ---

export const subscribeToGarage = (userId: string | undefined, callback: (garage: Car[]) => void) => {
    const targetUid = userId || getCurrentUserId();
    const garageRef = collection(db, "users", targetUid, "garage");
    const q = query(garageRef);
    
    return onSnapshot(q, (snapshot) => {
        const garage: Car[] = [];
        snapshot.forEach((doc) => {
            garage.push({ id: doc.id, ...doc.data() } as Car);
        });
        callback(garage);
    }, (error) => {
        console.warn("Error subscribing to garage:", error);
    });
};

export const getUserGarage = async (userId?: string): Promise<Car[]> => {
  const targetUid = userId || getCurrentUserId();
  try {
    const garageRef = collection(db, "users", targetUid, "garage");
    const querySnapshot = await getDocs(garageRef);
    
    const garage: Car[] = [];
    querySnapshot.forEach((doc) => {
      garage.push({ id: doc.id, ...doc.data() } as Car);
    });

    return garage;
  } catch (error) {
    console.warn("Error fetching garage:", error);
    return [];
  }
};

export const addCarToGarage = async (car: Car): Promise<Car | null> => {
    const uid = getCurrentUserId();
    try {
        const garageRef = collection(db, "users", uid, "garage");
        const docRef = await addDoc(garageRef, car);
        return { ...car, id: docRef.id };
    } catch (error) {
        console.error("Error adding car to garage:", error);
        return null;
    }
}

export const updateGarageCar = async (carId: string, data: Partial<Car>) => {
    const uid = getCurrentUserId();
    try {
        const carRef = doc(db, "users", uid, "garage", carId);
        await updateDoc(carRef, data);
    } catch (error) {
        console.error("Error updating garage car:", error);
    }
}

export const deleteGarageCar = async (carId: string) => {
    const uid = getCurrentUserId();
    try {
        const carRef = doc(db, "users", uid, "garage", carId);
        await deleteDoc(carRef);
    } catch (error) {
        console.error("Error deleting garage car:", error);
    }
}

// Deprecated Single Car Getter (kept for safety, but directs to list logic)
export const getUserCar = async (userId?: string): Promise<Car> => {
    const list = await getUserGarage(userId);
    return list.length > 0 ? list[0] : MOCK_CAR;
}

// --- MARKETPLACE ---

const seedDatabase = async () => {
  try {
    console.log("Seeding marketplace...");
    const batch = writeBatch(db);
    MOCK_MARKETPLACE_CARS.forEach((car) => {
      const carRef = doc(db, "marketplace_cars", car.id);
      batch.set(carRef, car, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error("Failed to seed marketplace:", error);
  }
};

export const getMarketplaceCars = async (): Promise<MarketplaceCar[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "marketplace_cars"));
    const cars: MarketplaceCar[] = [];
    querySnapshot.forEach((doc) => {
      cars.push({ id: doc.id, ...doc.data() } as MarketplaceCar);
    });

    if (cars.length === 0) {
      await seedDatabase();
      return MOCK_MARKETPLACE_CARS;
    }
    return cars;
  } catch (error: any) {
    console.error("Error fetching marketplace cars:", error);
    return MOCK_MARKETPLACE_CARS;
  }
};

export const updateMarketplaceCar = async (carId: string, data: Partial<MarketplaceCar>) => {
    try {
        const carRef = doc(db, "marketplace_cars", carId);
        await updateDoc(carRef, data);
    } catch (error) {
        console.error("Error updating marketplace car:", error);
    }
}

// --- POSTS ---

const seedPosts = async () => {
    try {
        const batch = writeBatch(db);
        MOCK_POSTS.forEach((post) => {
            const postRef = doc(db, "posts", post.id);
            batch.set(postRef, post, { merge: true });
        });
        await batch.commit();
    } catch (error) {
        console.error("Failed to seed posts:", error);
    }
}

export const getPosts = async (): Promise<Post[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as Post);
        });
        
        if (posts.length === 0) {
            await seedPosts();
            return MOCK_POSTS;
        }
        return posts.sort((a, b) => b.id.localeCompare(a.id)); 
    } catch (error) {
        console.error("Error fetching posts:", error);
        return MOCK_POSTS;
    }
}

export const createPost = async (post: Post) => {
    try {
        const postRef = doc(db, "posts", post.id);
        const uid = getCurrentUserId();
        await setDoc(postRef, { ...post, userId: uid });
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

export const updatePost = async (post: Post) => {
    try {
        const postRef = doc(db, "posts", post.id);
        await setDoc(postRef, post, { merge: true });
    } catch (error) {
        console.error("Error updating post:", error);
    }
}

// --- EVENTS ---

const seedEvents = async () => {
    try {
        const batch = writeBatch(db);
        MOCK_EVENTS.forEach((event) => {
            const eventRef = doc(db, "events", event.id);
            batch.set(eventRef, event, { merge: true });
        });
        await batch.commit();
    } catch (error) {
        console.error("Failed to seed events:", error);
    }
}

export const getEvents = async (): Promise<AutomotiveEvent[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const events: AutomotiveEvent[] = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as AutomotiveEvent);
        });
        
        if (events.length === 0) {
            await seedEvents();
            return MOCK_EVENTS;
        }
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        return MOCK_EVENTS;
    }
}

export const rsvpEvent = async (eventId: string, increment: boolean) => {
    try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
            const eventData = eventSnap.data() as AutomotiveEvent;
            const newCount = eventData.attendees + (increment ? 1 : -1);
            await updateDoc(eventRef, { attendees: newCount });
        }
    } catch (error) {
        console.error("Error RSVPing to event:", error);
    }
}

// --- IMAGES ---

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.warn(`Firebase Storage Error: ${error.code || error.message}`);
    if (error.code === 'storage/unauthorized' || error.code === 'storage/retry-limit-exceeded') {
        console.info("Storage permission denied. Falling back to local object URL for display.");
    }
    return URL.createObjectURL(file);
  }
};
