import { useLocation, useSearch } from 'wouter'
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash'
import qs from 'qs'

import remote from '../remote'

const getParseQueryString = (searchString) => {
  return qs.parse(searchString)
}

function Pagination({ count, pageSize = 2, key = 'page', loadData }) {
  const searchString = useSearch()
  const [, setLocation] = useLocation()
  const [currentPage, setCurrentPage] = useState(0)
  const pageNumber = Math.ceil(count / pageSize)

  function handleQueryString() {
    if (!searchString) {
      setLocation(`/?${qs.stringify({ [key]: 1 })}`)
      setCurrentPage(1)
    }

    if (!currentPage) {
      const querystring = getParseQueryString(searchString)

      setCurrentPage(parseInt(querystring.page, 10))
    }
  }

  function handleClick(e, page) {
    const querystring = getParseQueryString(searchString)

    setCurrentPage(page)
    setLocation(`/?${qs.stringify(_.assign(querystring, { page }))
      }`)

    loadData({ page, size: pageSize })
  }

  function Button({ key, page, text }) {
    return <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
      key={key}
      onClick={e => handleClick(e, page)}
      disabled={currentPage === page}
    >{text || page}</button>
  }

  function Ellipsis({ key }) {
    return <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center" key={key}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-ellipsis h-4 w-4"
      >
        <circle cx={12} cy={12} r={1} />
        <circle cx={19} cy={12} r={1} />
        <circle cx={5} cy={12} r={1} />
      </svg>
      <span className="sr-only">More pages</span>
    </span>
  }

  function wrapPagination(pagination) {
    const previousPage = currentPage - 1 > 1 ? currentPage - 1 : 1
    const nextPage = currentPage + 1 > pageNumber ? pageNumber : currentPage + 1

    pagination.unshift(Button({ key: 'previousPage', page: previousPage, text: '<', cb: handleClick }))
    pagination.push(Button({ key: 'nextPage', page: nextPage, text: '>', cb: handleClick }))

    return pagination
  }

  const pagination = []

  handleQueryString()

  for (let i = 0; i < pageNumber; i++) {
    pagination.push(Button({
      key: `page${i}`, page: i + 1, cb: handleClick
    }))
  }

  if (pageNumber <= 6) { // min
    return wrapPagination(pagination)
  } else if (pageNumber - currentPage <= 3) { // right
    const previous = pagination.slice(0, 1)
    const last = pagination.slice(pagination.length - 5, pagination.length)

    previous.push(Ellipsis({ key: 'pageEllipsis' }))

    return wrapPagination(previous.concat(last))
  } else if (pageNumber - currentPage > 3 && currentPage < 5) { // left
    const previous = pagination.slice(0, 5)
    const last = pagination.slice(pagination.length - 1, pagination.length)

    last.unshift(Ellipsis({ key: 'pageEllipsis' }))

    return wrapPagination(previous.concat(last))
  } else { // middle
    const previous = pagination.slice(0, 1)
    const middle = pagination.slice(currentPage - 3, currentPage).concat(pagination.slice(currentPage, currentPage + 2))
    const last = pagination.slice(pagination.length - 1, pagination.length)

    previous.push(Ellipsis({ key: 'leftEllipsis' }))
    middle.push(Ellipsis({ key: 'rightEllipsis' }))


    return wrapPagination(previous.concat(middle).concat(last))
  }
}

function Posts({posts}) {
  return <div className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0">
    <div className="h-full w-full rounded-[inherit]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {
          posts.map((post, i) => {
            return (
              <button className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent" key={post.id}>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{post.title}</div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">{post.created}</div>
                  </div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {post.content}
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {post.tag.name}
                  </div>
                </div>
              </button>
            )
          })
        }
      </div>
    </div>
  </div>
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const hasFetched = useRef(false)
  const [location, setLocation] = useLocation()
  const searchString = useSearch()
  const pageSize = 2

  const LoadPosts = ({page = 1, size = 10}) => {
    remote.posts.list({page, size})
    .then(res => {

      // set res.data.count
      setPosts(res.data.list)
      setPageCount(res.data.count)
    })
    .catch(console.log)
  }

  useEffect(() => {
    if (hasFetched.current) {
      return
    }

    hasFetched.current = true

    setLoading(true)

    remote.users.getUser()
      .then(res => {
        setUser(res.data)
        setLoading(false)

        const querystring = getParseQueryString(searchString)

        LoadPosts({ page: _.get(querystring, 'page', 0), size: pageSize })
      })
      .catch(err => {
        if (err?.response?.status === 401) {
          return setLocation('/login')
        }

        setAlert(_.get(err, 'response.data.error', ''))
      })
  }, [])

  if (loading) {
    return <>Loading...</>
  }

  if (alert) {
    return <>{alert}</>
  }

  return <div className="flex w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-3xl"
      data-v0-t="card">
      <div className="flex flex-col p-6 space-y-1">
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold">LOGO</h1>
        </div>
        <div className="shrink-0 bg-border h-[1px] w-full"></div>
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                placeholder="Search"
              />
            </div>
          </form>
        </div>
        <Posts posts={posts} />
        <div className="flex items-center justify-between px-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {/* 0 of 100 row(s) selected. */}
          </div>
          <div className="flex items-center space-x-2">
            <Pagination count={pageCount} pageSize={pageSize} loadData={LoadPosts} />
          </div>
        </div>
      </div>
    </div>
  </div>
}