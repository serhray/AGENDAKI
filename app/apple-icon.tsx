import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '40px',
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Calendar outline */}
          <rect
            x="3"
            y="6"
            width="18"
            height="15"
            rx="2"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Calendar header */}
          <path
            d="M3 10h18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Calendar dots (appointments) */}
          <circle cx="8" cy="14" r="0.8" fill="white" />
          <circle cx="12" cy="14" r="0.8" fill="white" />
          <circle cx="16" cy="14" r="0.8" fill="white" />
          <circle cx="12" cy="17" r="0.8" fill="white" />
          {/* Calendar top markers */}
          <path
            d="M7 4v4M17 4v4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
