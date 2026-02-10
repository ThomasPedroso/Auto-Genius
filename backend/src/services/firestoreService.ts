import * as admin from 'firebase-admin';
import type { User, MarketplaceCar, Post, Car, AutomotiveEvent } from '../types';

const db = admin.firestore();

// --- SEED DATA (used when collections are empty) ---

const MOCK_MARKETPLACE_CARS: MarketplaceCar[] = [
  {
    id: '1', make: 'BMW', model: '320i M Sport', year: 2021, price: 285000,
    imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba95452e10?auto=format&fit=crop&w=1200&q=80',
    description: 'BMW Série 3 em estado impecável. Único dono, todas as revisões feitas na concessionária. Pacote M Sport completo, teto solar.',
    mileage: 25000, color: 'Azul Portimao', fuelType: 'Flex', likes: 42, isLiked: false,
    comments: [
      { id: 'c1', authorName: 'Fernando Torres', authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80', content: 'Aceita troca em um Corolla 2020 + volta?', timestamp: 'Há 2 horas' },
      { id: 'c2', authorName: 'AutoVendas', authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80', content: 'O carro está disponível para visitação neste sábado?', timestamp: 'Há 5 horas' }
    ]
  },
  {
    id: '2', make: 'Jeep', model: 'Compass Limited', year: 2022, price: 168000,
    imageUrl: 'https://images.unsplash.com/photo-1633505062755-29472b44ce60?auto=format&fit=crop&w=1200&q=80',
    description: 'Jeep Compass Diesel 4x4. Carro de família, muito espaçoso e confortável. Multimídia de 10 polegadas, painel digital.',
    mileage: 15000, color: 'Branco Polar', fuelType: 'Diesel', likes: 28, isLiked: true, comments: []
  },
  {
    id: '3', make: 'Honda', model: 'Civic Touring', year: 2020, price: 145000,
    imageUrl: 'https://images.unsplash.com/photo-1606152421811-aba947e8b892?auto=format&fit=crop&w=1200&q=80',
    description: 'Civic Touring Turbo. O melhor sedã da categoria. Teto solar, sistema de som premium, Honda Sensing.',
    mileage: 42000, color: 'Cinza Barium', fuelType: 'Gasolina', likes: 115, isLiked: false,
    comments: [
      { id: 'c3', authorName: 'Julia Silva', authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', content: 'Qual o consumo dele na cidade?', timestamp: 'Ontem' }
    ]
  },
  {
    id: '4', make: 'Porsche', model: '911 Carrera S', year: 2020, price: 950000,
    imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1200&q=80',
    description: 'Ícone automotivo. Performance impressionante. Cor exclusiva, interior em couro preto. Escapamento esportivo original.',
    mileage: 8000, color: 'Amarelo Racing', fuelType: 'Gasolina', likes: 340, isLiked: false, comments: []
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1', authorName: 'Auto Enthusiast', authorHandle: '@carlover99',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    content: 'Acabei de ver o novo lançamento da BMW. O design está incrível! O que acharam?',
    imageUrl: 'https://images.unsplash.com/photo-1555215696-b979000963ed?auto=format&fit=crop&w=800&q=80',
    likes: 156,
    comments: [
      { id: 'c1', authorName: 'Maria Garcia', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', content: 'Realmente, a grade frontal ficou polêmica mas eu gostei.', timestamp: '2h' }
    ],
    timestamp: '4h', isLiked: false
  },
  {
    id: 'p2', authorName: 'Track Day Official', authorHandle: '@trackdaybr',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    content: 'Resultados da volta rápida de hoje em Interlagos. O Porsche GT3 RS voou baixo!',
    likes: 892, comments: [], timestamp: '1d', isLiked: true
  }
];

const MOCK_EVENTS: AutomotiveEvent[] = [
  { id: 'e1', title: 'Encontro de Superesportivos', date: '15 AGO • 09:00', location: 'Autódromo de Interlagos, SP', imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80', attendees: 1240, price: 'Grátis' },
  { id: 'e2', title: 'Track Day Night Run', date: '20 AGO • 19:00', location: 'Kartódromo da Granja Viana', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', attendees: 56, price: 'R$ 150,00' },
  { id: 'e3', title: 'Feirão de Clássicos', date: '02 SET • 10:00', location: 'Estádio do Pacaembu, SP', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80', attendees: 3500, price: 'Grátis' }
];

const DEFAULT_USER: Omit<User, 'name' | 'email' | 'avatarUrl'> = {
  bio: 'Apaixonado por carros clássicos e tecnologia. Sempre em busca da próxima road trip.',
  location: 'São Paulo, SP',
  instagram: '@alex_cars',
  coverUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  isPublicProfile: true,
  phone: '',
  cpf: '',
  birthDate: '',
  monthlyIncome: 0,
  occupation: '',
  gamification: { level: 'Prata' as any, points: 1250, pointsToNextLevel: 2000, streak: 5 },
  completedQuests: ['q1'],
};

// --- HEALTH CHECK ---

export const checkDatabaseConnection = async (): Promise<'connected' | 'denied' | 'error'> => {
  try {
    const testRef = db.collection('_healthcheck').doc('status');
    await testRef.set({ lastCheck: new Date().toISOString() });
    return 'connected';
  } catch (error: any) {
    if (error.code === 7) return 'denied'; // PERMISSION_DENIED
    console.error('DB Connection Check Error:', error);
    return 'error';
  }
};

// --- USERS ---

export const getUserProfile = async (uid: string, displayName?: string, email?: string, photoURL?: string): Promise<User | null> => {
  try {
    const docRef = db.collection('users').doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data() as User;
    }

    // Create default profile for new user
    const newUserProfile: User = {
      ...DEFAULT_USER,
      name: displayName || 'Novo Usuário',
      email: email || '',
      avatarUrl: photoURL || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    } as User;
    await docRef.set(newUserProfile);
    return newUserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const getPublicUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const docRef = db.collection('users').doc(uid);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    const user = docSnap.data() as User;
    if (!user.isPublicProfile) return null;
    return user;
  } catch (error) {
    console.error('Error getting public user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.set(data, { merge: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// --- GARAGE ---

export const getUserGarage = async (uid: string): Promise<Car[]> => {
  try {
    const garageRef = db.collection('users').doc(uid).collection('garage');
    const snapshot = await garageRef.get();
    const garage: Car[] = [];
    snapshot.forEach((doc) => {
      garage.push({ id: doc.id, ...doc.data() } as Car);
    });
    return garage;
  } catch (error) {
    console.error('Error fetching garage:', error);
    return [];
  }
};

export const addCarToGarage = async (uid: string, car: Car): Promise<Car | null> => {
  try {
    const garageRef = db.collection('users').doc(uid).collection('garage');
    const docRef = await garageRef.add(car);
    return { ...car, id: docRef.id };
  } catch (error) {
    console.error('Error adding car to garage:', error);
    return null;
  }
};

export const updateGarageCar = async (uid: string, carId: string, data: Partial<Car>): Promise<void> => {
  try {
    const carRef = db.collection('users').doc(uid).collection('garage').doc(carId);
    await carRef.update(data);
  } catch (error) {
    console.error('Error updating garage car:', error);
    throw error;
  }
};

export const deleteGarageCar = async (uid: string, carId: string): Promise<void> => {
  try {
    const carRef = db.collection('users').doc(uid).collection('garage').doc(carId);
    await carRef.delete();
  } catch (error) {
    console.error('Error deleting garage car:', error);
    throw error;
  }
};

// --- MARKETPLACE ---

const seedMarketplace = async (): Promise<void> => {
  try {
    const batch = db.batch();
    MOCK_MARKETPLACE_CARS.forEach((car) => {
      const carRef = db.collection('marketplace_cars').doc(car.id);
      batch.set(carRef, car, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Failed to seed marketplace:', error);
  }
};

export const getMarketplaceCars = async (): Promise<MarketplaceCar[]> => {
  try {
    const snapshot = await db.collection('marketplace_cars').get();
    const cars: MarketplaceCar[] = [];
    snapshot.forEach((doc) => {
      cars.push({ id: doc.id, ...doc.data() } as MarketplaceCar);
    });

    if (cars.length === 0) {
      await seedMarketplace();
      return MOCK_MARKETPLACE_CARS;
    }
    return cars;
  } catch (error) {
    console.error('Error fetching marketplace cars:', error);
    return MOCK_MARKETPLACE_CARS;
  }
};

export const updateMarketplaceCar = async (carId: string, data: Partial<MarketplaceCar>): Promise<void> => {
  try {
    const carRef = db.collection('marketplace_cars').doc(carId);
    await carRef.update(data);
  } catch (error) {
    console.error('Error updating marketplace car:', error);
    throw error;
  }
};

// --- POSTS ---

const seedPosts = async (): Promise<void> => {
  try {
    const batch = db.batch();
    MOCK_POSTS.forEach((post) => {
      const postRef = db.collection('posts').doc(post.id);
      batch.set(postRef, post, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Failed to seed posts:', error);
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const snapshot = await db.collection('posts').get();
    const posts: Post[] = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });

    if (posts.length === 0) {
      await seedPosts();
      return MOCK_POSTS;
    }
    return posts.sort((a, b) => b.id.localeCompare(a.id));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return MOCK_POSTS;
  }
};

export const createPost = async (uid: string, post: Post): Promise<void> => {
  try {
    const postRef = db.collection('posts').doc(post.id);
    await postRef.set({ ...post, userId: uid });
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (post: Post): Promise<void> => {
  try {
    const postRef = db.collection('posts').doc(post.id);
    await postRef.set(post, { merge: true });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// --- EVENTS ---

const seedEvents = async (): Promise<void> => {
  try {
    const batch = db.batch();
    MOCK_EVENTS.forEach((event) => {
      const eventRef = db.collection('events').doc(event.id);
      batch.set(eventRef, event, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Failed to seed events:', error);
  }
};

export const getEvents = async (): Promise<AutomotiveEvent[]> => {
  try {
    const snapshot = await db.collection('events').get();
    const events: AutomotiveEvent[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as AutomotiveEvent);
    });

    if (events.length === 0) {
      await seedEvents();
      return MOCK_EVENTS;
    }
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return MOCK_EVENTS;
  }
};

export const rsvpEvent = async (eventId: string, increment: boolean): Promise<void> => {
  try {
    const eventRef = db.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();
    if (eventSnap.exists) {
      const eventData = eventSnap.data() as AutomotiveEvent;
      const newCount = eventData.attendees + (increment ? 1 : -1);
      await eventRef.update({ attendees: newCount });
    }
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    throw error;
  }
};
