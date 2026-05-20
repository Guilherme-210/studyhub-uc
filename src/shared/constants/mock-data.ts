/**
 * Mock Data Constants
 * Centralized mock data for development and testing
 */

import type { Conversation } from '@/types/groups'

// Mock de conversas
export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-1',
        type: 'direct',
        name: 'Maria Santos',
        avatar: undefined,
        participants: [
            { id: 'current-user', name: 'Você', online: true },
            { id: '2', name: 'Maria Santos', online: true, lastSeen: new Date().toISOString() },
        ],
        lastMessage: {
            content: 'Oi!  viu a lista de exercícios?',
            senderId: '2',
            senderName: 'Maria Santos',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        unreadCount: 2,
        messages: [
            {
                id: 'm1',
                senderId: '2',
                senderName: 'Maria Santos',
                content: 'Oi! Tudo bem?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            },
            {
                id: 'm2',
                senderId: 'current-user',
                senderName: 'Você',
                content: 'Tudo sim! E você?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            },
            {
                id: 'm3',
                senderId: '2',
                senderName: 'Maria Santos',
                content: 'Bem também! Você viu a lista de exercícios que o professor passou?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            },
            {
                id: 'm4',
                senderId: '2',
                senderName: 'Maria Santos',
                content: 'Oi! Você viu a lista de exercícios?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            },
        ],
        createdAt: '2024-01-15',
        updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'conv-2',
        type: 'direct',
        name: 'João Pedro',
        avatar: undefined,
        participants: [
            { id: 'current-user', name: 'Você', online: true },
            { id: '3', name: 'João Pedro', online: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
        ],
        lastMessage: {
            content: 'Combinado então!',
            senderId: 'current-user',
            senderName: 'Você',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        unreadCount: 0,
        messages: [
            {
                id: 'm1',
                senderId: '3',
                senderName: 'João Pedro',
                content: 'E aí, vamos estudar amanhã?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            },
            {
                id: 'm2',
                senderId: 'current-user',
                senderName: 'Você',
                content: 'Bora! Que horas?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
            },
            {
                id: 'm3',
                senderId: '3',
                senderName: 'João Pedro',
                content: 'Às 14h na biblioteca?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2).toISOString(),
            },
            {
                id: 'm4',
                senderId: 'current-user',
                senderName: 'Você',
                content: 'Combinado então!',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            },
        ],
        createdAt: '2024-02-01',
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: 'conv-3',
        type: 'group',
        name: 'Cálculo Avançado - Turma 2024',
        groupId: '1',
        avatar: undefined,
        participants: [
            { id: 'current-user', name: 'Você', online: true },
            { id: '1', name: 'Prof. Silva', online: false },
            { id: '2', name: 'Maria Santos', online: true },
            { id: '3', name: 'João Pedro', online: false },
        ],
        lastMessage: {
            content: 'Alguém entendeu a questão 5?',
            senderId: '2',
            senderName: 'Maria Santos',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        unreadCount: 5,
        messages: [
            {
                id: 'm1',
                senderId: '1',
                senderName: 'Prof. Silva',
                content: 'Pessoal, a prova será na próxima semana. Estudem os capítulos 5 e 6.',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
            {
                id: 'm2',
                senderId: '3',
                senderName: 'João Pedro',
                content: 'Professor, terá revisão antes da prova?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
            },
            {
                id: 'm3',
                senderId: '1',
                senderName: 'Prof. Silva',
                content: 'Sim, faremos uma revisão na sexta-feira.',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            },
            {
                id: 'm4',
                senderId: '2',
                senderName: 'Maria Santos',
                content: 'Alguém entendeu a questão 5?',
                type: 'text',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            },
        ],
        createdAt: '2024-01-15',
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
]

// Mock de contatos para nova conversa
export const MOCK_CONTACTS = [
    { id: '2', name: 'Maria Santos', avatar: undefined, online: true },
    { id: '3', name: 'João Pedro', avatar: undefined, online: false },
    { id: '4', name: 'Ana Clara', avatar: undefined, online: true },
    { id: '5', name: 'Lucas Mendes', avatar: undefined, online: false },
    { id: '6', name: 'Carla Souza', avatar: undefined, online: true },
]
