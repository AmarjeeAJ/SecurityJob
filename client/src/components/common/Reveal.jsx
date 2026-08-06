/**
 * Staggered fade-up entrance, driven purely by CSS animation (see .reveal in
 * index.css) so content always ends up visible regardless of scroll timing.
 */
export default function Reveal({ children, delayMs = 0, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`reveal ${className}`} style={{ animationDelay: `${delayMs}ms` }}>
      {children}
    </Tag>
  );
}
