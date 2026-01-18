import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '6px',
        }}
      >
        <svg
          width="20"
          height="20"
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
            strokeWidth="2"
            fill="none"
          />
          {/* Calendar header */}
          <path
            d="M3 10h18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Calendar dots (appointments) */}
          <circle cx="8" cy="14" r="1" fill="white" />
          <circle cx="12" cy="14" r="1" fill="white" />
          <circle cx="16" cy="14" r="1" fill="white" />
          <circle cx="12" cy="17" r="1" fill="white" />
          {/* Calendar top markers */}
          <path
            d="M7 4v4M17 4v4"
            stroke="white"
            strokeWidth="2"
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
