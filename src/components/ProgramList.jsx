import { useEffect, useMemo, useState } from 'react';
import { get, post } from '../services/api';
import FilterBar from './FilterBar';
import ProgramCard from './ProgramCard';
import './ProgramList.css';

function mapCourseToProgram(c) {
  return {
    id: c.id,
    code: c.code,
    name: c.name,
    type: c.type || "Bachelor's",
    duration: c.duration || '4 years',
    totalUnits: c.units,
    status: c.status || 'active',
    description: c.department ?? c.description ?? '',
    addedDate: c.created_at ?? '',
  };
}

export default function ProgramList() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState("Bachelor's");
  const [formDuration, setFormDuration] = useState('');
  const [formUnits, setFormUnits] = useState(168);
  const [formStatus, setFormStatus] = useState('active');
  const [formDescription, setFormDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadPrograms = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/programs');
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setPrograms(list.map(mapCourseToProgram));
    } catch (e) {
      setError(e.message || 'Failed to load programs.');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        !search ||
        (p.code && p.code.toLowerCase().includes(search.toLowerCase())) ||
        (p.name && p.name.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = !filterStatus || p.status === filterStatus;
      const matchesType = !filterType || p.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [programs, search, filterStatus, filterType]);

  const statusOptions = [...new Set(programs.map((p) => p.status))].map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1).replace(' ', ' '),
  }));

  const typeOptions = [...new Set(programs.map((p) => p.type))].map((t) => ({
    value: t,
    label: t,
  }));

  const filters = [
    { id: 'status', label: 'Status', value: filterStatus, options: statusOptions },
    { id: 'type', label: 'Program Type', value: filterType, options: typeOptions },
  ];

  const handleFilterChange = (id, value) => {
    if (id === 'status') setFilterStatus(value);
    if (id === 'type') setFilterType(value);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    setError('');
    if (!formCode || !formName) {
      setError('Program code and name are required.');
      return;
    }
    setIsSaving(true);
    try {
      const data = await post('/programs', {
        code: formCode.trim(),
        name: formName.trim(),
        type: formType,
        duration: formDuration || '4 years',
        units: Number(formUnits) || 168,
        status: formStatus,
        description: formDescription,
        department: formDescription?.trim() || 'IT',
      });
      const c = data.course || data;
      const newProgram = mapCourseToProgram({
        ...c,
        type: formType,
        status: formStatus,
        duration: formDuration || '4 years',
        description: formDescription || c.department,
      });
      setPrograms((prev) => [...prev, newProgram]);
      setShowAddModal(false);
      setFormCode('');
      setFormName('');
      setFormDuration('');
      setFormDescription('');
      await loadPrograms();
    } catch (e) {
      setError(e.message || 'Failed to save program.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="program-list-page">
      <header className="page-header page-header-row">
        <div>
          <h1>Program Offerings</h1>
          <p className="page-subtitle">Browse and manage academic programs</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Program
        </button>
      </header>

      {loading && <p className="page-status">Loading programs...</p>}
      {error && <p className="page-status page-status-error">{error}</p>}

      {!loading && (
        <FilterBar
          searchPlaceholder="Search by program code or name..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {!loading && !error && (
        <div className="program-grid">
          {filteredPrograms.map((program, i) => (
            <ProgramCard key={program.id} program={program} index={i} />
          ))}
        </div>
      )}

      {!loading && !error && filteredPrograms.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">◉</span>
          <p>
            {programs.length === 0
              ? "No programs yet. Click '+ Add Program' to add one, or seed the database (see below)."
              : 'No programs match your filters.'}
          </p>
          {programs.length > 0 && (
            <button type="button" className="btn btn-ghost empty-state-clear" onClick={() => { setSearch(''); setFilterStatus(''); setFilterType(''); }}>
              Clear filters
            </button>
          )}
          {programs.length === 0 && (
            <p className="empty-state-hint">To add sample programs: open terminal in <code>it15-backend</code> and run <code>php artisan db:seed</code></p>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-form program-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Program</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)} aria-label="Close">×</button>
            </div>
            <form className="modal-body" onSubmit={handleSaveProgram}>
              <div className="form-group">
                <label>Program Code</label>
                <input
                  type="text"
                  placeholder="e.g. BSIT"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Program Name</label>
                <input
                  type="text"
                  placeholder="Full program name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Program Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)}>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 years"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Units</label>
                  <input
                    type="number"
                    placeholder="168"
                    value={formUnits}
                    onChange={(e) => setFormUnits(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                    <option value="active">active</option>
                    <option value="under review">under review</option>
                    <option value="phased out">phased out</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Program description..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
