
import { GamificationLevel } from './types';
import type { User, Car, Quest, MarketplaceCar, Post, AutomotiveEvent } from './types';
import { User as UserIcon, Wrench, Landmark, Zap, Camera, Share2 } from 'lucide-react';

export const MOCK_USER: User = {
  name: 'Alex Johnson',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  bio: 'Apaixonado por carros clássicos e tecnologia. Sempre em busca da próxima road trip.',
  location: 'São Paulo, SP',
  instagram: '@alex_cars',
  coverUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  isPublicProfile: true,
  email: 'alex.johnson@example.com',
  phone: '(11) 99999-8888',
  cpf: '123.456.789-00',
  birthDate: '1990-05-15',
  monthlyIncome: 8500,
  occupation: 'Desenvolvedor de Software',
  gamification: {
    level: GamificationLevel.Silver,
    points: 1250,
    pointsToNextLevel: 2000,
    streak: 5,
  },
  completedQuests: ['q1'],
};

export const MOCK_EVENTS: AutomotiveEvent[] = [
    {
        id: 'e1',
        title: 'Encontro de Superesportivos',
        date: '15 AGO • 09:00',
        location: 'Autódromo de Interlagos, SP',
        imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80',
        attendees: 1240,
        price: 'Grátis'
    },
    {
        id: 'e2',
        title: 'Track Day Night Run',
        date: '20 AGO • 19:00',
        location: 'Kartódromo da Granja Viana',
        imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        attendees: 56,
        price: 'R$ 150,00'
    },
    {
        id: 'e3',
        title: 'Feirão de Clássicos',
        date: '02 SET • 10:00',
        location: 'Estádio do Pacaembu, SP',
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
        attendees: 3500,
        price: 'Grátis'
    }
];

export const MOCK_CAR: Car = {
  make: 'Volkswagen',
  model: 'Golf GTI',
  year: 2019,
  imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  licensePlate: 'ABC-1234',
  vin: '9BWAA000000001234',
};

export const MOCK_MARKETPLACE_CARS: MarketplaceCar[] = [
  {
    id: '1',
    make: 'BMW',
    model: '320i M Sport',
    year: 2021,
    price: 285000,
    imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba95452e10?auto=format&fit=crop&w=1200&q=80',
    description: 'BMW Série 3 em estado impecável. Único dono, todas as revisões feitas na concessionária. Pacote M Sport completo, teto solar.',
    mileage: 25000,
    color: 'Azul Portimao',
    fuelType: 'Flex',
    likes: 42,
    isLiked: false,
    comments: [
        {
            id: 'c1',
            authorName: 'Fernando Torres',
            authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
            content: 'Aceita troca em um Corolla 2020 + volta?',
            timestamp: 'Há 2 horas'
        },
        {
            id: 'c2',
            authorName: 'AutoVendas',
            authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
            content: 'O carro está disponível para visitação neste sábado?',
            timestamp: 'Há 5 horas'
        }
    ]
  },
  {
    id: '2',
    make: 'Jeep',
    model: 'Compass Limited',
    year: 2022,
    price: 168000,
    imageUrl: 'https://images.unsplash.com/photo-1633505062755-29472b44ce60?auto=format&fit=crop&w=1200&q=80',
    description: 'Jeep Compass Diesel 4x4. Carro de família, muito espaçoso e confortável. Multimídia de 10 polegadas, painel digital.',
    mileage: 15000,
    color: 'Branco Polar',
    fuelType: 'Diesel',
    likes: 28,
    isLiked: true,
    comments: []
  },
  {
    id: '3',
    make: 'Honda',
    model: 'Civic Touring',
    year: 2020,
    price: 145000,
    imageUrl: 'https://images.unsplash.com/photo-1606152421811-aba947e8b892?auto=format&fit=crop&w=1200&q=80',
    description: 'Civic Touring Turbo. O melhor sedã da categoria. Teto solar, sistema de som premium, Honda Sensing.',
    mileage: 42000,
    color: 'Cinza Barium',
    fuelType: 'Gasolina',
    likes: 115,
    isLiked: false,
    comments: [
         {
            id: 'c3',
            authorName: 'Julia Silva',
            authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
            content: 'Qual o consumo dele na cidade?',
            timestamp: 'Ontem'
        }
    ]
  },
  {
    id: '4',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2020,
    price: 950000,
    imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1200&q=80',
    description: 'Ícone automotivo. Performance impressionante. Cor exclusiva, interior em couro preto. Escapamento esportivo original.',
    mileage: 8000,
    color: 'Amarelo Racing',
    fuelType: 'Gasolina',
    likes: 340,
    isLiked: false,
    comments: []
  },
];

export const MOCK_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Perfil Completo',
    description: 'Preencha todos os dados do seu perfil para ganhar pontos.',
    points: 500,
    icon: UserIcon,
  },
  {
    id: 'q2',
    title: 'Primeiro Diagnóstico',
    description: 'Use a IA para diagnosticar um problema no seu carro.',
    points: 300,
    icon: Wrench,
  },
  {
    id: 'q3',
    title: 'Simulação Financeira',
    description: 'Faça uma simulação de financiamento ou seguro.',
    points: 200,
    icon: Landmark,
  },
  {
    id: 'q4',
    title: 'Compartilhar Conquista',
    description: 'Compartilhe sua evolução na comunidade.',
    points: 100,
    icon: Share2,
  }
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        authorName: 'Auto Enthusiast',
        authorHandle: '@carlover99',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        content: 'Acabei de ver o novo lançamento da BMW. O design está incrível! O que acharam?',
        imageUrl: 'https://images.unsplash.com/photo-1555215696-b979000963ed?auto=format&fit=crop&w=800&q=80',
        likes: 156,
        comments: [
            {
                id: 'c1',
                authorName: 'Maria Garcia',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
                content: 'Realmente, a grade frontal ficou polêmica mas eu gostei.',
                timestamp: '2h'
            }
        ],
        timestamp: '4h',
        isLiked: false
    },
    {
        id: 'p2',
        authorName: 'Track Day Official',
        authorHandle: '@trackdaybr',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        content: 'Resultados da volta rápida de hoje em Interlagos. O Porsche GT3 RS voou baixo!',
        likes: 892,
        comments: [],
        timestamp: '1d',
        isLiked: true
    }
];
