import { Search, MoreHorizontal, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
// import { attendees } from '../data/attendees'

dayjs.extend(relativeTime).locale('pt-br')

interface Attendee {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  checkedInAt: string | null
}

export function AttendeeList() {
  const [search, setSearch] = useState(()=> {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') || ''
    }

    return ''
  })
  const [page, setPage] = useState(()=> {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [total, setTotal] = useState(0)
  const [attendees, setAttendees] = useState<Attendee[]>([])

  const totalPages = Math.ceil(total / 10)

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAttendees(data.attendees)
        setTotal(data.total)
      })
  }, [page, search])

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url.toString())
    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, '', url.toString())
    setSearch(search)
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function goToNextPage() {
    // if (page === totalPages) return
    // setPage(page + 1)
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    if (page === 1) return
    setCurrentPage(page - 1)
  }

  function goToFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }



  return (
    <div className='flex flex-col gap-4'>
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10  rounded-lg text-sm flex gap-3">
          <Search className='size-4 text-emerald-300' />
          <input
            onChange={onSearchInputChanged}
            value={search}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder='Buscar participante...'
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className='border-b border-white/1'>
            <TableHeader style={{ width: 48 }}>
              <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participantes</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }} className="py-3 px-4 text-sm font-semibold text-left"></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell>
                <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
              </TableCell>
              <TableCell>{attendee.id}</TableCell>
              <TableCell>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold text-white'>{attendee.name}</span>
                  <span>{attendee.email}</span>
                </div>
              </TableCell>
              <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
              <TableCell>
                {attendee.checkedInAt === null
                  ? <span className='text-zinc-400'>Não fez check-in</span> 
                  : dayjs().to(attendee.checkedInAt)}</TableCell>
              <TableCell>
                <IconButton transparent>
                  <MoreHorizontal className='size-4' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {total} itens
            </TableCell>
            <TableCell colSpan={3} className="text-right">
              <div className='inline-flex items-center gap-8'>
                <span>Página {page} de {totalPages | 1}</span>

                <div className='flex gap-1.5'>
                  <IconButton onClick={goToFirstPage} disabled={page === 1 || totalPages === 0}>
                    <ChevronsLeft className='size-4' />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1 || totalPages === 0}>
                    <ChevronLeft className='size-4' />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={page === totalPages || totalPages === 0}>
                    <ChevronRight className='size-4' />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages || totalPages === 0}>
                    <ChevronsRight className='size-4' />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}