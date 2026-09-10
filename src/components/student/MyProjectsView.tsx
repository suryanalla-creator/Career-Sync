import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Plus,
  CheckCircle2,
  Sparkles,
  Code2,
  Layers,
  Award
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { useApp } from '../../context/AppContext';

import { api } from '../../services/api';

export const MyProjectsView: React.FC = () => {
  const { triggerConfetti } = useApp();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load from database
  React.useEffect(() => {
    api.projects.getAll().then(dbProjects => {
      setProjectsList(dbProjects || []);
    }).catch(err => console.warn('Could not load projects from database:', err));
  }, []);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic' | 'Industry' | 'Hackathon' | 'Capstone' | 'Open Source'>('Capstone');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newGithub, setNewGithub] = useState('');

  const categories = ['All', 'Capstone', 'Industry', 'Hackathon', 'Academic', 'Open Source'];

  const filteredProjects = projectsList.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'A modern engineering solution built with enterprise code practices.',
      technologies: newTech.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: newGithub.trim() || undefined,
      demoUrl: 'https://demo.app',
      skillsDemonstrated: ['Software Design', 'Version Control'],
      completionDate: 'Sep 2026',
      verified: true
    };

    setProjectsList([newProject, ...projectsList]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setNewGithub('');
    triggerConfetti();

    try {
      await api.projects.create({
        title: newProject.title,
        category: newProject.category,
        description: newProject.description,
        technologies: newProject.technologies,
        githubUrl: newProject.githubUrl,
        demoUrl: newProject.demoUrl
      });
    } catch (err) {
      console.error('Failed to save project to database:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
            Verified Project Showcase
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            My Engineering & Research Projects
          </h1>
          <p className="text-xs text-slate-500">
            Showcasing Capstones, industry sponsorships, hackathon prototypes, and open-source contributions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid or Clean Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {projectsList.length === 0
              ? "You haven't added any engineering or capstone projects yet. Showcase your technical depth to recruiters by adding your projects."
              : `No projects found under category "${activeCategory}".`}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Verification Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                  {proj.category}
                </span>
                {proj.verified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Repo
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1.5">{proj.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>

              {/* Technologies */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Demonstrated */}
              {proj.skillsDemonstrated && proj.skillsDemonstrated.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Competencies Proven
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.skillsDemonstrated.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-md border border-blue-100"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Links Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{proj.completionDate}</span>
              <div className="flex items-center gap-2">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" /> Source
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    Live Demo <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Add New Project to Portfolio
            </h2>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Task Queue in Go"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Capstone">Capstone Project</option>
                  <option value="Industry">Industry Project</option>
                  <option value="Hackathon">Hackathon Project</option>
                  <option value="Academic">Academic Project</option>
                  <option value="Open Source">Open Source Contribution</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Tailwind, Docker"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the architectural problem, your solution, and impact..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
