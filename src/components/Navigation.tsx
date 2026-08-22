import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          Aqua<span>Guardian</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#mission">Mission</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#impact">Impact</a></li>
          <li><a href="#team">Team</a></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>
      </div>
    </nav>
  )
}
