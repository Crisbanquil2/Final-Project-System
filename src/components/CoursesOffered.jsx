import { useEffect, useMemo, useState } from 'react'
import { get } from '../services/api'
import FilterBar from './FilterBar'
import './ProgramList.css'

const PAGE_SIZE = 10

export default function CoursesOffered() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await get('/programs')
        setCourses(data)
      } catch (e) {
        setError(e.message || 'Failed to load courses.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return courses
    return courses.filter(
      (c) =>
        (c.code || '').toLowerCase().includes(q) ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.department || '').toLowerCase().includes(q)
    )
  }, [courses, search])

  const totalCount = filteredCourses.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pageIndex = Math.min(currentPage, totalPages)
  const startItem = totalCount === 0 ? 0 : (pageIndex - 1) * PAGE_SIZE + 1
  const endItem = Math.min(pageIndex * PAGE_SIZE, totalCount)

  const paginatedCourses = useMemo(() => {
    return filteredCourses.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE)
  }, [filteredCourses, pageIndex])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="program-list-page">
      <header className="page-header">
        <h1>Courses Offered</h1>
        <p className="page-subtitle">List of courses across departments</p>
      </header>

      {loading && <p className="page-status">Loading courses...</p>}
      {error && <p className="page-status page-status-error">{error}</p>}

      {!loading && !error && (
        <>
          <FilterBar
            searchPlaceholder="Search by code, name, or department..."
            searchValue={search}
            onSearchChange={setSearch}
          />
          <div className="table-card">
            <div className="pagination-bar">
              <span className="pagination-info">
                Showing {startItem}-{endItem} of {totalCount}
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
                    <th>Code</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Units</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.code}</td>
                      <td>{c.name}</td>
                      <td>{c.department}</td>
                      <td>{c.units}</td>
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

