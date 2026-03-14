import { useEffect, useMemo, useState } from 'react'
import { get } from '../services/api'
import FilterBar from './FilterBar'
import './ProgramList.css'

const PAGE_SIZE = 10

export default function SchoolDays() {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await get('/school-days')
        setDays(data)
      } catch (e) {
        setError(e.message || 'Failed to load school days.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredDays = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return days
    return days.filter(
      (d) =>
        (d.date || '').toLowerCase().includes(q) ||
        (d.type || '').toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q)
    )
  }, [days, search])

  const totalCount = filteredDays.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pageIndex = Math.min(currentPage, totalPages)
  const startItem = totalCount === 0 ? 0 : (pageIndex - 1) * PAGE_SIZE + 1
  const endItem = Math.min(pageIndex * PAGE_SIZE, totalCount)

  const paginatedDays = useMemo(() => {
    return filteredDays.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE)
  }, [filteredDays, pageIndex])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="program-list-page">
      <header className="page-header">
        <h1>School Days</h1>
        <p className="page-subtitle">Academic calendar with attendance, holidays, and events</p>
      </header>

      {loading && <p className="page-status">Loading school days...</p>}
      {error && <p className="page-status page-status-error">{error}</p>}

      {!loading && !error && (
        <>
          <FilterBar
            searchPlaceholder="Search by date, type, or description..."
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
                    <th>Date</th>
                    <th>Type</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDays.map((d) => (
                    <tr key={d.id}>
                      <td>{d.date}</td>
                      <td>{d.type}</td>
                      <td>{d.present_students ?? '-'}</td>
                      <td>{d.absent_students ?? '-'}</td>
                      <td>{d.description ?? '-'}</td>
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

