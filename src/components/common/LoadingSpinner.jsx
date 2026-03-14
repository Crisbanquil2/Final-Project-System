import Skeleton from '@mui/material/Skeleton';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div style={{ padding: '0.5rem 0' }} role="status" aria-live="polite">
      <Skeleton variant="text" width={180} height={28} />
      <Skeleton variant="rounded" height={12} style={{ marginTop: 8, maxWidth: 520 }} />
      <span className="loading-label" style={{ display: 'inline-block', marginTop: 10 }}>
        {label}
      </span>
    </div>
  );
}

