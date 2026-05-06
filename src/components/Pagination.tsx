interface PaginationProps {
  page: number
  canPrevious: boolean
  canNext: boolean
  onPrevious: () => void
  onNext: () => void
  total?: number
}

export function Pagination({ page, canPrevious, canNext, onPrevious, onNext, total }: PaginationProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid var(--border)',
    }}>
      <button
        onClick={onPrevious}
        disabled={!canPrevious}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid var(--border-2)',
          background: canPrevious ? 'var(--surface)' : 'transparent',
          color: canPrevious ? 'var(--text-2)' : 'var(--text-3)',
          cursor: canPrevious ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.05em',
          transition: 'all 0.15s',
        }}
      >
        ← PREV
      </button>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
        PAGE {page + 1}{total !== undefined ? ` · ${total} RECORDS` : ''}
      </div>

      <button
        onClick={onNext}
        disabled={!canNext}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid var(--border-2)',
          background: canNext ? 'var(--surface)' : 'transparent',
          color: canNext ? 'var(--text-2)' : 'var(--text-3)',
          cursor: canNext ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.05em',
          transition: 'all 0.15s',
        }}
      >
        NEXT →
      </button>
    </div>
  )
}
