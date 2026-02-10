
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { api } from "./apiClient";
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
    const result = await api.get<{ status: string; dbConnection: string }>('/health');
    return result.dbConnection as 'connected' | 'denied' | 'error';
  } catch {
    return 'error';
  }
};

// --- USERS ---

export const getUserProfile = async (userId?: string): Promise<User | null> => {
  try {
    const path = userId && userId !== getCurrentUserId() ? `/users/${userId}` : '/users/me';
    return await api.get<User>(path);
  } catch (error: any) {
    console.warn(`API Error (User): ${error.message}. Using Mock.`);
    if (!userId) return MOCK_USER;
    return null;
  }
};

export const updateUserProfile = async (data: Partial<User>) => {
  try {
    await api.patch('/users/me', data);
  } catch (error: any) {
    console.error("Error updating profile:", error);
  }
};

// --- GARAGE (List of Cars) ---

// KEEP onSnapshot for real-time reads directly from Firestore (read-only on client)
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
  try {
    const path = userId && userId !== getCurrentUserId() ? `/users/${userId}/garage` : '/users/me/garage';
    return await api.get<Car[]>(path);
  } catch (error) {
    console.warn("Error fetching garage:", error);
    return [];
  }
};

export const addCarToGarage = async (car: Car): Promise<Car | null> => {
    try {
        return await api.post<Car>('/users/me/garage', car);
    } catch (error) {
        console.error("Error adding car to garage:", error);
        return null;
    }
}

export const updateGarageCar = async (carId: string, data: Partial<Car>) => {
    try {
        await api.patch(`/users/me/garage/${carId}`, data);
    } catch (error) {
        console.error("Error updating garage car:", error);
    }
}

export const deleteGarageCar = async (carId: string) => {
    try {
        await api.delete(`/users/me/garage/${carId}`);
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

export const getMarketplaceCars = async (): Promise<MarketplaceCar[]> => {
  try {
    return await api.get<MarketplaceCar[]>('/marketplace');
  } catch (error: any) {
    console.error("Error fetching marketplace cars:", error);
    return MOCK_MARKETPLACE_CARS;
  }
};

export const updateMarketplaceCar = async (carId: string, data: Partial<MarketplaceCar>) => {
    try {
        await api.patch(`/marketplace/${carId}`, data);
    } catch (error) {
        console.error("Error updating marketplace car:", error);
    }
}

// --- POSTS ---

export const getPosts = async (): Promise<Post[]> => {
    try {
        return await api.get<Post[]>('/posts');
    } catch (error) {
        console.error("Error fetching posts:", error);
        return MOCK_POSTS;
    }
}

export const createPost = async (post: Post) => {
    try {
        await api.post('/posts', post);
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

export const updatePost = async (post: Post) => {
    try {
        await api.patch(`/posts/${post.id}`, post);
    } catch (error) {
        console.error("Error updating post:", error);
    }
}

// --- EVENTS ---

export const getEvents = async (): Promise<AutomotiveEvent[]> => {
    try {
        return await api.get<AutomotiveEvent[]>('/events');
    } catch (error) {
        console.error("Error fetching events:", error);
        return MOCK_EVENTS;
    }
}

export const rsvpEvent = async (eventId: string, increment: boolean) => {
    try {
        await api.post(`/events/${eventId}/rsvp`, { increment });
    } catch (error) {
        console.error("Error RSVPing to event:", error);
    }
}

// --- IMAGES ---

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Get a signed URL from the backend
    const { signedUrl, publicUrl } = await api.post<{ signedUrl: string; publicUrl: string }>(
      '/storage/signed-url',
      { filePath: path, contentType: file.type }
    );

    // Upload directly to GCS using the signed URL
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    return publicUrl;
  } catch (error: any) {
    console.warn(`Upload Error: ${error.message}. Falling back to local object URL.`);
    return URL.createObjectURL(file);
  }
};
