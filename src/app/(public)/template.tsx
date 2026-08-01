/**
 * Re-mounts on every route change inside the public group, giving each page a
 * calm CSS-only entrance. Replaces the experimental React <ViewTransition>
 * crossfade, which threw InvalidStateError when the document was hidden.
 */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
