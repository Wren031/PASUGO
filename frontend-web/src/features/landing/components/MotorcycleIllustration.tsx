export default function MotorcycleIllustration() {
  return (
    <svg viewBox="0 0 640 300" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      <rect x="0" y="228" width="640" height="72" fill="url(#roadGradient)" />
      <line x1="0" y1="258" x2="640" y2="258" stroke="#F8FAFC" strokeWidth="8" strokeDasharray="40 28" />

      <circle cx="140" cy="222" r="46" fill="#1E293B" />
      <circle cx="140" cy="222" r="30" fill="#475569" />
      <circle cx="140" cy="222" r="16" fill="#94A3B8" />

      <circle cx="470" cy="222" r="46" fill="#1E293B" />
      <circle cx="470" cy="222" r="30" fill="#475569" />
      <circle cx="470" cy="222" r="16" fill="#94A3B8" />

      <path
        d="M 160 150 L 250 130 Q 275 124 285 140 L 300 168 L 300 190 L 160 190 Z"
        fill="#F97316"
      />
      <path d="M 300 190 L 470 190 L 470 176 Q 420 160 380 150 L 340 150 Q 310 150 300 168 Z" fill="#0F172A" />
      <path d="M 470 190 L 505 190 L 505 182 Q 505 172 492 168 L 470 176 Z" fill="#64748B" />

      <rect x="150" y="120" width="22" height="42" rx="6" fill="#334155" transform="rotate(-16 161 141)" />
      <rect x="132" y="118" width="20" height="10" rx="4" fill="#1E293B" transform="rotate(-16 142 123)" />
      <circle cx="212" cy="196" r="7" fill="#0F172A" />

      <path d="M 262 190 L 262 196 Q 262 206 274 206 L 316 206" fill="none" stroke="#0F172A" strokeWidth="6" />
      <path d="M 274 206 L 282 214 L 300 212" fill="none" stroke="#0F172A" strokeWidth="6" />

      <g>
        <circle cx="212" cy="118" r="17" fill="#0F172A" />
        <path d="M 196 126 Q 205 132 220 124 Q 228 118 228 104 Q 212 108 196 118 Z" fill="#F8FAFC" />
        <path d="M 190 132 Q 185 138 186 146 Q 205 140 214 132 Z" fill="#F97316" />
      </g>

      <g>
        <circle cx="282" cy="118" r="17" fill="#0F172A" />
        <path d="M 266 126 Q 275 132 290 124 Q 298 118 298 104 Q 282 108 266 118 Z" fill="#F8FAFC" />
        <path d="M 260 132 Q 255 138 256 146 Q 275 140 284 132 Z" fill="#38BDF8" />
      </g>

      <path d="M 258 152 Q 282 148 300 152 L 298 158 Q 282 154 260 158 Z" fill="#F8FAFC" />
      <path d="M 252 170 Q 282 164 306 170 L 304 176 Q 282 170 254 176 Z" fill="#F8FAFC" />

      <rect x="380" y="196" width="26" height="14" rx="3" fill="#CBD5E1" transform="rotate(-8 393 203)" />

      <circle cx="305" cy="132" r="3" fill="#F97316" />
      <circle cx="305" cy="132" r="7" fill="#F97316" opacity="0.3" />
    </svg>
  );
}
