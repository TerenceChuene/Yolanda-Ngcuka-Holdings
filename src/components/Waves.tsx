import './Waves.css'

type WavesProps = {
  side?: 'left' | 'right'
}

export default function Waves({ side = 'left' }: WavesProps) {
  return (
    <div
      className={`page-waves${side === 'right' ? ' page-waves--right' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-20 120C40 70 90 160 160 100C230 40 280 90 340 55C380 32 410 20 450 40"
          stroke="var(--blue)"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        <path
          d="M-10 145C50 95 110 175 175 120C240 65 300 110 360 80C400 60 430 50 470 70"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
      </svg>
    </div>
  )
}
