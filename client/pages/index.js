import Link from 'next/link'

export default function Home() {
  return (
    <main className="container">
      <header className="hero">
        <h1>Trip — Modern Travel Booking</h1>
        <p>Welcome to your upgraded travel site. Explore, book, and pay securely.</p>
        <nav>
          <Link href="/about">About</Link> |{' '}
          <Link href="/booknow">Book Now</Link> |{' '}
          <Link href="/blog">Blog</Link> |{' '}
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
    </main>
  )
}
