// Fix: Updated import path from '../types' to '../types/index' to correctly resolve the types module.
import { User, Room, Message, JoinRequest, Organization } from '../types/index';

export const currentUser: User = {
  name: 'Latish Adwani',
  email: 'lotishadwani70@gmail.com',
  avatar: 'L',
};

export const otherUser: User = {
  name: 'AI Assistant',
  email: 'ai@intellicollab.ai',
  avatar: 'AI',
};

export const mockRooms: Room[] = [
  { id: '1', name: 'Project Phoenix', unreadCount: 3 },
  { id: '2', name: 'Q3 Marketing Campaign' },
  { id: '3', name: 'UI/UX Redesign' },
  { id: '4', name: 'Backend Refactor', unreadCount: 1 },
];

export const mockMessages: { [key: string]: Message[] } = {
  '1': [
    { id: 'm1', user: { name: 'Jane Doe', email: 'jane@example.com', avatar: 'JD' }, text: "Let's review the latest mockups for the dashboard.", timestamp: '10:30 AM' },
    { id: 'm2', user: currentUser, text: 'Sounds good, I have them open now. I think we need to increase the contrast on the primary CTA.', timestamp: '10:31 AM' },
  ],
  '3': [
    { id: 'm3', user: { name: 'John Smith', email: 'john@example.com', avatar: 'JS' }, text: 'The new design system components are ready for integration.', timestamp: 'Yesterday' },
  ],
};

export const mockJoinRequests: JoinRequest[] = [
  { id: 'req1', user: { name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ' }, date: '2 hours ago' },
  { id: 'req2', user: { name: 'Maria Garcia', email: 'maria@example.com', avatar: 'MG' }, date: '1 day ago' },
];

export const mockOrganizations: Organization[] = [
    { id: 'org1', name: 'React Core Team', description: 'The official organization for the React JavaScript library for building user interfaces. Our mission is to make it painless to create interactive UIs.', members: 15700, avatar: '⚛️', tags: ['Open Source', 'JavaScript', 'UI'], established: '2013' },
    { id: 'org2', name: 'Vue.js Official', description: 'The community for the progressive JavaScript framework for building applications and ambitious single-page applications.', members: 22300, avatar: '🗄️', tags: ['Open Source', 'JavaScript', 'Framework'], established: '2014' },
    { id: 'org3', name: 'The Rust Foundation', description: 'Dedicated to stewarding the Rust programming language and ecosystem, with a focus on performance, reliability, and productivity.', members: 8900, avatar: '🦀', tags: ['Open Source', 'Programming Language'], established: '2020' },
    { id: 'org4', name: 'Blender Community', description: 'A community for artists and developers of the free and open source 3D creation suite. Share your work, get feedback, and learn from others.', members: 45000, avatar: '🎨', tags: ['Open Source', '3D', 'Art'], established: '1998' },
    { id: 'org5', name: 'Figma Designers', description: 'A public community for designers to share plugins, files, and best practices. A place to connect, learn, and grow as a designer.', members: 120000, avatar: '🧩', tags: ['Design', 'Community', 'UI/UX'], established: '2016' },
    { id: 'org6', name: 'Docker Community', description: 'Connect with other developers, learn about Docker, and share your projects. Home to Docker Captains and community leaders.', members: 18500, avatar: '🐳', tags: ['Open Source', 'DevOps', 'Containers'], established: '2013' },
];