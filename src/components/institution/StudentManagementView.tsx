import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  CheckCircle2,
  GraduationCap,
  ExternalLink,
  Award,
  Briefcase,
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockCandidates } from '../../data/mockData';
import { Candidate } from '../../types';
import { api } from '../../services/api';

export const StudentManagementView: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [inspectedStudent, setInspectedStudent] = useState<Candidate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 25;

  // Debounced database query against SQLite database
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      api.students.getCandidates({
        q: searchQuery.trim() || undefined,
        department: selectedDept !== 'All' ? selectedDept : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined
      }).then(res => {
        if (res && res.candidates) {
          setCandidates(res.candidates);
        }
      }).catch(err => {
        console.warn('Could not load candidates from backend, using fallback:', err);
      }).finally(() => {
        setIsLoading(false);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDept, selectedStatus]);

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Analytics & Management'
  ];

  const filteredStudents = candidates.filter(st => {
    if (selectedDept !== 'All' && st.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && st.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/^#/, '');
      const matchId = (st.studentId && st.studentId.toLowerCase().includes(cleanQ)) || (st.id && st.id.toLowerCase().includes(cleanQ));
      const matchName = st.name.toLowerCase().includes(q);
      const matchSkills = Array.isArray(st.topSkills) && st.topSkills.some(s => s.toLowerCase().includes(q));
      const matchCollege = st.college?.toLowerCase().includes(q);
      const matchDept = st.department?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchSkills && !matchCollege && !matchDept) return false;
    }
    return true;
  });

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDeptChange = (val: string) => {
    setSelectedDept(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            Institutional Student Database
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Student Skill &amp; Placement Directory ({candidates.length} Profiles)
          </h1>
          <p className="text-xs text-slate-500">
            Search student database in real-time by Student ID, Roll No, Name, or acquired competencies across departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-400 block">Database Query Results</span>
            <span className="text-base font-black text-blue-600">{filteredStudents.length} Students Matching</span>
          </div>
          <button
            onClick={() => alert(`Exporting ${filteredStudents.length} student placement profiles to Excel/CSV...`)}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Cohort
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Student ID (#8492019482), Name, Roll No, or Skills (Python, React, SolidWorks)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => handleDeptChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none w-full md:w-auto"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none w-full md:w-auto"
          >
            <option value="All">All Placement Statuses</option>
            <option value="Available">Available for Placement</option>
            <option value="Shortlisted">Shortlisted by Company</option>
            <option value="In Interview">In Final Interviews</option>
            <option value="Offered">Offer Letter Extended</option>
            <option value="Placed">Placed & Joined</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>
            {isLoading ? 'Querying institutional database...' : `Showing ${filteredStudents.length} students matching database filters`}
          </span>
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-6">Student &amp; ID</th>
                <th className="p-4">Department &amp; Degree</th>
                <th className="p-4">Skill Score</th>
                <th className="p-4">Internship Record</th>
                <th className="p-4">Placement Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No students match your query. Try searching by Student ID (#8492019482), Name, or broadening department filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => {
                  const studentIdDisplay = st.studentId || (st.id ? `#84920${String(st.id).replace(/\D/g, '').padStart(5, '0')}` : '#8492019482');

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img src={st.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-1">
                              {st.name}
                              {st.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 font-mono text-[10px] font-bold rounded">
                                ID: {studentIdDisplay}
                              </span>
                              <span className="text-[11px] text-slate-400">CGPA: {st.cgpa}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800 font-semibold">{st.department}</p>
                        <p className="text-[11px] text-slate-400">{st.degree}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-blue-600 text-sm">{st.skillScore}%</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-[11px] text-slate-600 font-medium">
                        {st.internshipExperience || 'Academic Capstone & Lab Projects'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          st.status === 'Shortlisted'
                            ? 'bg-purple-100 text-purple-800'
                            : st.status === 'In Interview' || st.status === 'Interviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : st.status === 'Offered' || st.status === 'Placed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setInspectedStudent(st)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors"
                        >
                          View Portfolio
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredStudents.length > PAGE_SIZE && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-800">{Math.min(startIndex + PAGE_SIZE, filteredStudents.length)}</span> of{' '}
              <span className="font-bold text-slate-800">{filteredStudents.length}</span> students
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-slate-50 rounded-lg font-bold text-slate-700 border border-slate-200">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Quick Inspection Modal */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <img src={inspectedStudent.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectedStudent.name}</h3>
                <p className="text-slate-500">{inspectedStudent.degree} • {inspectedStudent.department}</p>
                <p className="text-blue-600 font-semibold mt-0.5">CGPA: {inspectedStudent.cgpa} • Score: {inspectedStudent.skillScore}%</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-700">Core Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(inspectedStudent.topSkills) && inspectedStudent.topSkills.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <p><strong>Internship History:</strong> {inspectedStudent.internshipExperience}</p>
              <p><strong>Certifications:</strong> {inspectedStudent.certificationsCount} Certifications</p>
              <p><strong>Placement Pipeline:</strong> {inspectedStudent.status}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedStudent(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
