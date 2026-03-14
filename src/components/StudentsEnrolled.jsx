import { useEffect, useMemo, useState } from 'react'
import { get } from '../services/api'
import FilterBar from './FilterBar'
import './ProgramList.css'

const PAGE_SIZE = 10

export default function StudentsEnrolled() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await get('/students')
        setStudents(data)
      } catch (e) {
        setError(e.message || 'Failed to load students.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const courseOptions = useMemo(() => {
    const courses = [...new Set(students.map((s) => s.course).filter(Boolean))].sort()
    return courses.map((c) => ({ value: c, label: c }))
  }, [students])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase()
      const studentNo = (s.student_no || '').toLowerCase()
      const course = (s.course || '').toLowerCase()
      const dept = (s.department || '').toLowerCase()
      const q = search.toLowerCase().trim()
      const matchSearch = !q || name.includes(q) || studentNo.includes(q) || course.includes(q) || dept.includes(q)
      const matchCourse = !filterCourse || (s.course || '') === filterCourse
      return matchSearch && matchCourse
    })
  }, [students, search, filterCourse])

  const totalCount = filteredStudents.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pageIndex = Math.min(currentPage, totalPages)
  const startItem = (pageIndex - 1) * PAGE_SIZE + 1
  const endItem = Math.min(pageIndex * PAGE_SIZE, totalCount)

  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE)
  }, [filteredStudents, pageIndex])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterCourse])

  const filters = [
    { id: 'course', label: 'Course', value: filterCourse, options: courseOptions },
  ]

  const handleFilterChange = (id, value) => {
    if (id === 'course') setFilterCourse(value)
  }

  const goPrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1))
  }
  const goNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1))
  }

  return (
    <div className="program-list-page">
      <header className="page-header">
        <h1>Students Enrolled</h1>
        <p className="page-subtitle">List of enrolled students with demographics</p>
      </header>

      {loading && <p className="page-status">Loading students...</p>}
      {error && <p className="page-status page-status-error">{error}</p>}

      {!loading && !error && (
        <>
          <FilterBar
            searchPlaceholder="Search by name, student no., course..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <div className="table-card">
            <div className="pagination-bar">
              <span className="pagination-info">
                Showing {totalCount === 0 ? 0 : startItem}-{endItem} of {totalCount}
              </span>
              <div className="pagination-buttons">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goPrev}
                  disabled={pageIndex <= 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                <span className="pagination-page">
                  Page {pageIndex} of {totalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goNext}
                  disabled={pageIndex >= totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student No.</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Year</th>
                    <th>Course</th>
                    <th>Department</th>
                    <th>Enrolled At</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((s) => (
                    <tr key={s.id}>
                      <td>{s.student_no}</td>
                      <td>
                        {s.last_name}, {s.first_name}
                      </td>
                      <td>{s.gender || '-'}</td>
                      <td>{s.age || '-'}</td>
                      <td>{s.year_level || '-'}</td>
                      <td>{s.course || '-'}</td>
                      <td>{s.department}</td>
                      <td>{s.enrolled_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

