import { create } from 'zustand';

const SEED_PROJECT = {
  id: 'seed-refund',
  clientName: 'Acme Logistics',
  processName: 'Refund request handling',
  goal: 'Understand how refund requests are processed end to end',
  status: 'complete',
  contextBlob: '',
  goals: [
    { id: '1', text: 'Map the end-to-end flow from request submission to resolution', covered: true },
    { id: '2', text: 'Identify actors and their roles at each step', covered: true },
    { id: '3', text: 'Surface systems and tools involved', covered: true },
    { id: '4', text: 'Capture decision points and exceptions', covered: true },
  ],
  kb: [],
  meetUrl: '',
  interviewMode: 'voice',
  outputs: {
    flowchart: { nodes: [], edges: [] },
    sipoc: null,
    sop: null,
    transcript: { turns: [] },
  },
  pctUnderstood: 100,
  lastActivity: 'Mar 14',
  seed: true,
};

export const useStore = create((set, get) => ({
  projects: [SEED_PROJECT],
  currentProjectId: null,

  createProject: (clientName, processName, goal) => {
    const id = crypto.randomUUID();
    const project = {
      id,
      clientName,
      processName,
      goal,
      status: 'setup',
      contextBlob: '',
      goals: [],
      kb: [],
      meetUrl: '',
      interviewMode: 'voice',
      outputs: {
        flowchart: { nodes: [], edges: [] },
        sipoc: null,
        sop: null,
        transcript: { turns: [] },
      },
      pctUnderstood: 0,
      lastActivity: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      seed: false,
    };
    set(s => ({ projects: [...s.projects, project], currentProjectId: id }));
    return id;
  },

  setCurrentProject: (id) => set({ currentProjectId: id }),

  updateProject: (id, patch) =>
    set(s => ({
      projects: s.projects.map(p => p.id === id ? { ...p, ...patch } : p),
    })),

  currentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find(p => p.id === currentProjectId) ?? null;
  },

  setContextBlob: (id, blob) => {
    get().updateProject(id, { contextBlob: blob });
  },

  setGoals: (id, goals) => {
    get().updateProject(id, { goals });
  },

  setMeetUrl: (id, url) => {
    get().updateProject(id, { meetUrl: url });
  },

  setInterviewMode: (id, mode) => {
    get().updateProject(id, { interviewMode: mode });
  },
}));
