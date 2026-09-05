import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchCandidateDetails, deleteCandidate } from '../api/ownerCandidates.js';
import apiClient from '../api/client.js';
import { Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';

import OwnerHeader from '../components/owner/OwnerHeader.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import ErrorBanner from '../components/form/ErrorBanner.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

const DOCUMENT_TYPE_LABELS = {
  aadhaar_front: 'Aadhaar Front',
  aadhaar_back: 'Aadhaar Back',
};

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-navy-900">{value || value === 0 ? value : '—'}</p>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/15 text-gold-600">{icon}</div>
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function getDocumentUrls(doc, candidateId) {
  if (!doc) return [];
  const urls = [];
  const apiBase = apiClient.defaults.baseURL || '';
  const isAbsoluteApi = apiBase.startsWith('http://') || apiBase.startsWith('https://');
  const backendBase = isAbsoluteApi ? apiBase.replace(/\/api\/?$/, '') : '';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  // 1. Dedicated view_url from backend if available, or constructed authenticated API route
  const docPath = doc.view_url || (candidateId && doc.id ? `/api/owner/candidates/${candidateId}/documents/${doc.id}` : null);
  if (docPath) {
    if (backendBase) {
      urls.push(`${backendBase}${docPath}`);
    }
    urls.push(docPath);
    if (currentOrigin && !docPath.startsWith('http')) {
      urls.push(`${currentOrigin}${docPath}`);
    }
  }

  // 2. /api/uploads/ relative to backend or current domain (reverse-proxied /api)
  if (doc.file_url) {
    const rawFileUrl = doc.file_url.startsWith('/') ? doc.file_url : `/${doc.file_url}`;
    const apiUploadPath = rawFileUrl.startsWith('/uploads')
      ? `/api${rawFileUrl}`
      : `/api/uploads${rawFileUrl}`;

    if (backendBase) {
      urls.push(`${backendBase}${apiUploadPath}`);
    }
    urls.push(apiUploadPath);
    if (currentOrigin) {
      urls.push(`${currentOrigin}${apiUploadPath}`);
    }

    // 3. Direct static /uploads/
    if (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) {
      urls.push(rawFileUrl);
    } else {
      if (backendBase) {
        urls.push(`${backendBase}${rawFileUrl}`);
      }
      urls.push(rawFileUrl);
      if (currentOrigin) {
        urls.push(`${currentOrigin}${rawFileUrl}`);
      }
    }
  }

  return [...new Set(urls.filter(Boolean))];
}

function DocumentPreviewModal({ doc, initialUrl, candidateId, onClose }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const isImage = doc.mime_type?.startsWith('image/');

  const apiBase = apiClient.defaults.baseURL || '';
  const isAbsoluteApi = apiBase.startsWith('http://') || apiBase.startsWith('https://');
  const backendBase = isAbsoluteApi ? apiBase.replace(/\/api\/?$/, '') : '';
  const downloadPath = doc.download_url || (candidateId && doc.id ? `/api/owner/candidates/${candidateId}/documents/${doc.id}?download=1` : initialUrl);
  const downloadUrl = backendBase && !downloadPath.startsWith('http') ? `${backendBase}${downloadPath}` : downloadPath;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6">
      <div className="relative flex flex-col max-h-[92vh] max-w-4xl w-full rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs">{doc.original_file_name || 'Document File'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isImage && (
              <>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  title="Zoom Out"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <span className="text-xs text-slate-500 font-mono w-9 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  title="Zoom In"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  title="Rotate"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v5h-5" />
                  </svg>
                </button>
              </>
            )}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              download={doc.original_file_name || `${doc.document_type || 'document'}.jpg`}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-8 flex items-center justify-center min-h-[350px] max-h-[72vh]">
          {isImage ? (
            <img
              src={initialUrl}
              alt={DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                transition: 'transform 0.2s ease-out',
              }}
              className="max-h-[60vh] max-w-full rounded-lg shadow-2xl object-contain"
            />
          ) : (
            <div className="text-center text-white space-y-3">
              <svg viewBox="0 0 24 24" className="mx-auto h-16 w-16 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-sm font-medium">{doc.original_file_name || 'Document'}</p>
              <a
                href={initialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Open File in New Tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ doc, candidateId, onPreview }) {
  const candidateUrls = useMemo(() => getDocumentUrls(doc, candidateId), [doc, candidateId]);
  const [urlIndex, setUrlIndex] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUrl = candidateUrls[urlIndex] || doc.file_url;
  const isImage = doc.mime_type?.startsWith('image/');

  const handleImageError = () => {
    if (urlIndex + 1 < candidateUrls.length) {
      setUrlIndex((prev) => prev + 1);
    } else {
      setLoadFailed(true);
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
    setLoadFailed(false);
  };

  return (
    <div className="group relative w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
      <div
        onClick={() => onPreview(doc, currentUrl)}
        className="relative h-28 w-full cursor-pointer overflow-hidden bg-slate-100 flex items-center justify-center"
      >
        {isImage && !loadFailed ? (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            )}
            <img
              src={currentUrl}
              alt={DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
              onError={handleImageError}
              onLoad={handleImageLoad}
              className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                loading ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                View
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-center text-slate-400 space-y-1">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className="text-[10px] font-semibold text-slate-500">
              {loadFailed ? 'Image file unavailable' : 'Document File'}
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-xs font-bold text-slate-900 truncate">
          {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
        </p>
        <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px]">
          <button
            type="button"
            onClick={() => onPreview(doc, currentUrl)}
            className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Inspect
          </button>
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-500 hover:text-blue-600 flex items-center gap-0.5"
            title="Open direct file in new tab"
          >
            <span>Direct</span>
            <span className="text-xs leading-none">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const ICONS = {
  user: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 20c0-4 3.5-6 8-6s8 2 8 6" /></svg>,
  briefcase: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2" /><path strokeLinecap="round" d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  shield: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" /></svg>,
  trending: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M21 7v6h-6" /></svg>,
};

export default function CandidateDetailsPage() {
  useNoIndex();
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleDeleteCandidate() {
    if (!candidate) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteCandidate(candidate.id);
      setShowDeleteModal(false);
      navigate('/owner/candidates', {
        replace: true,
        state: {
          successMessage: `Candidate ${candidate.full_name} (${candidate.candidate_code || 'ID: ' + candidate.id}) deleted successfully.`
        }
      });
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete candidate record. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchCandidateDetails(id)
      .then((data) => {
        if (!cancelled) setCandidate(data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Candidate not found.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="bg-mesh-light min-h-screen">
      <OwnerHeader />

      {previewDoc && (
        <DocumentPreviewModal
          doc={previewDoc.doc}
          initialUrl={previewDoc.url}
          candidateId={candidate?.id}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {showDeleteModal && candidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4 shadow-inner">
              <Trash2 className="h-7 w-7 text-red-600" />
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Delete Candidate Record?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete this record? This permanently removes testing or duplicate data.
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Candidate Name:</span>
                <span className="font-bold text-slate-900">{candidate.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Candidate Code:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {candidate.candidate_code || `ID: ${candidate.id}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Mobile Number:</span>
                <span className="font-medium text-slate-700">{candidate.mobile_number}</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-amber-800 bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>This action will permanently delete this record, registration details, and uploaded document files. This action cannot be undone.</span>
            </div>

            {deleteError && (
              <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-2.5 font-medium">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError('');
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteCandidate}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/owner/candidates"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Candidate Records
          </Link>

          {candidate && (
            <button
              type="button"
              onClick={() => {
                setDeleteError('');
                setShowDeleteModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2 text-xs font-bold text-red-600 shadow-2xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer"
              title="Delete this candidate record"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Record</span>
            </button>
          )}
        </div>

        {loading && <Card><LoadingSkeleton rows={10} /></Card>}
        {error && <ErrorBanner message={error} />}

        {candidate && (
          <div className="flex flex-col gap-5">
            <Card className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-800 text-xl font-bold text-gold-300">
                  {candidate.full_name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-xl font-bold text-navy-900">{candidate.full_name}</h1>
                  <p className="mt-0.5 font-mono text-xs text-slate-400">{candidate.candidate_code}</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      candidate.consent_given ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {candidate.consent_given ? 'Consent Given' : 'No Consent'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError('');
                      setShowDeleteModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer"
                    title="Delete this candidate record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                <Field label="Mobile Number" value={candidate.mobile_number} />
                <Field label="WhatsApp Number" value={candidate.whatsapp_number} />
                <Field label="Age" value={candidate.age} />
                <Field label="Gender" value={candidate.gender} />
                <Field label="Current City" value={candidate.current_city} />
                <Field label="Current Area" value={candidate.current_area} />
                <Field label="State" value={candidate.state} />
                <Field label="Qualification" value={candidate.highest_qualification} />
              </div>
            </Card>

            <SectionCard icon={ICONS.briefcase} title="Job Preferences & Experience">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="Preferred Roles" value={candidate.roles.map((r) => r.role_name).join(' | ')} />
                <Field label="Preferred Locations" value={candidate.preferredLocations.join(' | ')} />
                <Field label="Experienced" value={candidate.is_experienced ? 'Yes' : 'No (Fresher)'} />
                {candidate.is_experienced && (
                  <>
                    <Field label="Security Experience" value={`${candidate.security_experience_months} months`} />
                    <Field label="Employment Status" value={candidate.current_employment_status} />
                    <Field label="Joining Availability" value={candidate.joining_availability} />
                    <Field label="Duty-Hour Preference" value={candidate.duty_hour_preference} />
                  </>
                )}
                <Field label="Aadhaar Available" value={candidate.aadhaar_available ? 'Yes' : 'No'} />
              </div>
            </SectionCard>

            {(candidate.additional_message) && (
              <SectionCard icon={ICONS.shield} title="Documents & Notes">
                {/* Aadhaar document cards temporarily disabled — re-enable by
                    uncommenting this block when the feature is ready to come back.
                {candidate.documents.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {candidate.documents.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        candidateId={candidate.id}
                        onPreview={(d, url) => setPreviewDoc({ doc: d, url })}
                      />
                    ))}
                  </div>
                )}
                */}

                {candidate.additional_message && (
                  <div className={candidate.documents.length > 0 ? 'mt-4 border-t border-slate-100 pt-4' : ''}>
                    <Field label="Additional Message" value={candidate.additional_message} />
                  </div>
                )}
              </SectionCard>
            )}

            <SectionCard icon={ICONS.trending} title="Campaign Sources">
              <div className="flex flex-col gap-2">
                {candidate.sources.map((s, i) => (
                  <div key={i} className="flex flex-wrap justify-between gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-navy-900">{s.source} / {s.medium} / {s.campaign}</span>
                    <span className="text-slate-500">
                      {s.submission_count}x &middot; last {formatDateTime(s.last_seen_at)}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="mb-2 mt-5 text-sm font-bold text-navy-900">Submission History</h3>
              <div className="flex flex-col gap-2">
                {candidate.submissions.map((s, i) => (
                  <div key={i} className="flex flex-wrap justify-between gap-1 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-600">
                    <span>{s.landing_page_slug} — {s.source} / {s.medium}</span>
                    <span>{formatDateTime(s.submitted_at)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <Field label="First Registered" value={formatDateTime(candidate.first_registered_at)} />
                <Field label="Latest Submission" value={formatDateTime(candidate.last_submitted_at)} />
              </div>
            </SectionCard>
          </div>
        )}
      </main>
    </div>
  );
}
