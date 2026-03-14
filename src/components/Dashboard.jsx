import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { programs, subjects } from '../data/mockData';
import { get } from '../services/api';
import WeatherWidget from './weather/WeatherWidget';
import EnrollmentChart from './dashboard/EnrollmentChart';
import CourseDistributionChart from './dashboard/CourseDistributionChart';
import AttendanceChart from './dashboard/AttendanceChart';
import LoadingSpinner from './common/LoadingSpinner';
import './Dashboard.css';

export default function Dashboard() {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courseDistData, setCourseDistData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [enrollmentJson, coursesJson, attendanceJson] = await Promise.all([
          get('/dashboard/enrollment'),
          get('/dashboard/courses'),
          get('/dashboard/attendance'),
        ]);

        if (!isMounted) return;

        setEnrollmentData(
          enrollmentJson.map((item) => ({
            month: item.month,
            total: Number(item.total),
          })),
        );

        setCourseDistData(
          coursesJson.map((item) => ({
            name: item.name,
            value: Number(item.total),
          })),
        );

        setAttendanceData(
          attendanceJson.map((item) => ({
            date: item.date,
            present: Number(item.present_students ?? 0),
            absent: Number(item.absent_students ?? 0),
          })),
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Something went wrong while loading data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activePrograms = programs.filter((p) => p.status === 'active').length;
    const inactivePrograms = programs.length - activePrograms;
    const withPrereqs = subjects.filter((s) => s.prereqs?.length > 0).length;
    const bySemester = subjects.filter((s) => s.semesterType === 'semester').length;
    const byTerm = subjects.filter((s) => s.semesterType === 'term').length;
    const byBoth = subjects.filter((s) => s.semesterType === 'both').length;

    return {
      totalPrograms: programs.length,
      totalSubjects: subjects.length,
      activePrograms,
      inactivePrograms,
      subjectsWithPrereqs: withPrereqs,
      subjectsPerSemester: bySemester,
      subjectsPerTerm: byTerm,
      subjectsBoth: byBoth,
      recentlyAddedPrograms: [...programs]
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, 3),
      recentlyAddedSubjects: [...subjects]
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, 4),
    };
  }, []);

  const chartData = [
    { name: 'Semester', value: stats.subjectsPerSemester, color: '#14b8a6' },
    { name: 'Term', value: stats.subjectsPerTerm, color: '#38bdf8' },
    { name: 'Both', value: stats.subjectsBoth, color: '#f59e0b' },
  ];

  const statusChartData = [
    { name: 'Active', value: stats.activePrograms, color: '#22c55e' },
    { name: 'Inactive/Other', value: stats.inactivePrograms, color: '#64748b' },
  ];

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">
          Overview of enrollment, courses, and attendance
        </p>
      </header>

      {loading && <LoadingSpinner label="Loading dashboard data..." />}
      {error && !loading && <p className="page-status page-status-error">{error}</p>}

      <div className="stats-grid">
        <StatCard
          title="Total Programs"
          value={stats.totalPrograms}
          icon="◉"
          delay="0.1s"
        />
        <StatCard
          title="Total Subjects"
          value={stats.totalSubjects}
          icon="◇"
          delay="0.15s"
        />
        <StatCard
          title="Active Programs"
          value={stats.activePrograms}
          subValue={`${stats.inactivePrograms} inactive`}
          icon="✓"
          delay="0.2s"
        />
        <StatCard
          title="Subjects with Pre-requisites"
          value={stats.subjectsWithPrereqs}
          icon="→"
          delay="0.25s"
        />
      </div>

      <div className="charts-row">
        <WeatherWidget />
      </div>

      <div className="charts-row">
        <EnrollmentChart data={enrollmentData} />
        <CourseDistributionChart data={courseDistData} />
      </div>

      <div className="charts-row">
        <AttendanceChart data={attendanceData} />
      </div>

      <div className="recent-section">
        <div className="recent-card" style={{ animationDelay: '0.3s' }}>
          <div className="recent-header">
            <h3>Recently Added Programs</h3>
            <Link to="/programs" className="link-more">View all →</Link>
          </div>
          <ul className="recent-list">
            {stats.recentlyAddedPrograms.map((p, i) => (
              <li key={p.id} className="recent-item">
                <span className="recent-code">{p.code}</span>
                <span className="recent-name">{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="recent-card" style={{ animationDelay: '0.35s' }}>
          <div className="recent-header">
            <h3>Recently Added Subjects</h3>
            <Link to="/subjects" className="link-more">View all →</Link>
          </div>
          <ul className="recent-list">
            {stats.recentlyAddedSubjects.map((s, i) => (
              <li key={s.id} className="recent-item">
                <span className="recent-code">{s.code}</span>
                <span className="recent-name">{s.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon, delay }) {
  return (
    <div className="stat-card" style={{ animationDelay: delay }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-title">{title}</span>
        {subValue && <span className="stat-sub">{subValue}</span>}
      </div>
    </div>
  );
}
