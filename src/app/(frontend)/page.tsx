import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import './styles.css'

// Always read fresh from the database so admin edits show on refresh.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const { isEnabled: draft } = await draftMode()

  const [{ docs: trips }, home, header] = await Promise.all([
    payload.find({
      collection: 'trips',
      sort: 'order',
      limit: 12,
    }),
    // `draft: true` returns the unpublished version when one exists.
    payload.findGlobal({ slug: 'home', draft }),
    payload.findGlobal({ slug: 'header', draft }),
  ])
  return (
    <div className="page">
      <Navbar data={header} />

      {draft && (
        <div className="draftbar">
          Draft preview — not visible to the public.
          <a href="/next/exit-preview">Exit</a>
        </div>
      )}

      <Hero initialData={home} />

      <section className="catalogue" id="catalogue">
        <header className="catalogue__head">
          <h2>Journeys leaving soon</h2>
          <p>Three departures with places still open this season.</p>
        </header>

        {trips.length === 0 && (
          <p className="empty">
            No trips yet — add one in the <a href="/admin/collections/trips">admin panel</a>.
          </p>
        )}

        <div className="grid">
          {trips.map((trip) => {
            const photo = typeof trip.photo === 'object' && trip.photo !== null ? trip.photo : null

            return (
            <article className={`card card--${trip.tone}`} key={trip.id}>
              <div className="card__media">
                {photo?.url && <img src={photo.url} alt={photo.alt ?? ''} className="card__img" />}
                <span className="card__rating">★ {trip.rating}</span>
              </div>

              <div className="card__body">
                <p className="card__country">{trip.country}</p>
                <h3 className="card__place">{trip.place}</h3>
                <p className="card__summary">{trip.summary}</p>

                <div className="card__foot">
                  <div className="card__price">
                    <span className="card__amount">€{trip.price.toLocaleString('en-GB')}</span>
                    <span className="card__meta">{trip.nights} nights · per person</span>
                  </div>
                  <a className="btn btn--small" href="#">
                    Details
                  </a>
                </div>
              </div>
            </article>
            )
          })}
        </div>
      </section>

      <footer className="foot">
        <p>Meridian Travel · Lisbon &amp; Copenhagen</p>
        <p className="foot__note">Mockup — content is hardcoded, not yet coming from Payload.</p>
      </footer>
    </div>
  )
}
