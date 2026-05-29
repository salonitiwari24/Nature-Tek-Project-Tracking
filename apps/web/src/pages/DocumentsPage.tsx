import { useEffect, useState } from 'react';
import { Search, UploadCloud, Folder, Plus, X } from 'lucide-react';
import { DocumentDetail, DocumentService, GetDocumentsFilters } from '../services/documentService';
import { ProjectService } from '../services/projectService';
import { DocumentTable } from '../components/documents/DocumentTable';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DocumentViewer } from '../components/documents/DocumentViewer';

const DOC_CATEGORIES = [
  { value: 'ALL', label: 'All Vault Folders' },
  { value: 'SURVEY_REPORTS', label: 'Survey Reports' },
  { value: 'DESIGN_DRAWINGS', label: 'Design CAD Drawings' },
  { value: 'CUSTOMER_AGREEMENTS', label: 'Customer SLAs / Contracts' },
  { value: 'GOVERNMENT_APPROVALS', label: 'Government NOCs' },
  { value: 'SAFETY_CHECKLISTS', label: 'Safety Checklists' },
  { value: 'INSTALLATION_REPORTS', label: 'Installation Logs' },
  { value: 'COMPLETION_CERTIFICATES', label: 'Completion Certs' },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentDetail[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Sidebar Category & search
  const [filters, setFilters] = useState<GetDocumentsFilters>({
    search: '',
    category: 'ALL',
    status: 'ALL',
    projectId: 'ALL',
    page: 1,
    limit: 10,
  });

  // Slide-over selected doc
  const [selectedDoc, setSelectedDoc] = useState<DocumentDetail | null>(null);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [projectsList, setProjectsList] = useState<{ id: string; name: string }[]>([]);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'DESIGN_DRAWINGS',
    projectId: '',
    stage: 'DESIGN_APPROVAL',
    uploadedBy: '',
    size: '2.5 MB',
  });

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const result = await DocumentService.getDocuments(filters);
      setDocuments(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);

      // Re-read selected doc if open, to display new version history timeline
      if (selectedDoc) {
        const fresh = await DocumentService.getDocumentById(selectedDoc.id);
        if (fresh) {
          setSelectedDoc(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to load document index:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [filters]);

  useEffect(() => {
    const loadProjectsList = async () => {
      try {
        const response = await ProjectService.getProjects({ limit: 100 });
        setProjectsList(response.data.map((p) => ({ id: p.id, name: p.name })));
        if (response.data.length > 0) {
          setUploadForm((prev) => ({ ...prev, projectId: response.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load projects list:', err);
      }
    };
    loadProjectsList();
  }, []);

  const handleFilterChange = (name: keyof GetDocumentsFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === 'page' ? (value as number) : 1,
    }));
  };

  // APPROVAL ACTIONS (Requirement 2)
  const handleApprove = async (id: string) => {
    try {
      await DocumentService.updateDocument(id, {
        approvalStatus: 'APPROVED',
        approvalTimeMinutes: Math.floor(Math.random() * 180) + 30, // 30 mins to 3 hours
      });
      alert('Vault file approved cleanly and signed-off.');
      loadDocuments();
    } catch (err) {
      console.error('Failed to approve document:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await DocumentService.updateDocument(id, { approvalStatus: 'REJECTED' });
      alert('Vault file rejected and marked for revision correction.');
      loadDocuments();
    } catch (err) {
      console.error('Failed to reject document:', err);
    }
  };

  // UPLOAD SIMULATION SUBMISSION
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name.trim() || !uploadForm.uploadedBy.trim()) {
      alert('Please fill out all upload fields.');
      return;
    }

    try {
      await DocumentService.createDocument({
        name: uploadForm.name.trim(),
        category: uploadForm.category as any,
        projectId: uploadForm.projectId,
        stage: uploadForm.stage,
        approvalStatus: 'PENDING',
        size: uploadForm.size,
        uploadedBy: uploadForm.uploadedBy.trim(),
      });
      alert('New vault file uploaded cleanly and queued for inspector sign-off.');
      setUploadModalOpen(false);
      setUploadForm((prev) => ({
        ...prev,
        name: '',
        uploadedBy: '',
      }));
      loadDocuments();
    } catch (err) {
      console.error('Failed to simulate file upload:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Document Vault & Stage Gate Manager</h1>
          <p className="text-sm text-zinc-500">Host blueprints, customer SLAs, survey logs, and manage approval operations</p>
        </div>
        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <UploadCloud className="h-4.5 w-4.5" />
          Upload Document
        </button>
      </div>

      {/* SEARCH AND VIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Category Mappings Sidebar (7 Mapped categories) */}
        <div className="lg:col-span-1 rounded-xl border border-zinc-250 bg-white p-4 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
            <Folder className="h-4 w-4 text-brand-600" />
            Vault Directories
          </h3>

          <nav className="flex flex-col gap-1 text-xs">
            {DOC_CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleFilterChange('category', cat.value)}
                  className={`w-full text-left rounded-lg px-3 py-2 font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-brand-50 text-brand-750'
                      : 'text-zinc-600 hover:bg-zinc-55 hover:text-zinc-950'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Spreadsheet/Registry columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* SEARCH & STATUS FILTER */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by file name, project, or uploader..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-lg border border-zinc-250 bg-white pl-9.5 pr-4 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="rounded border border-zinc-250 bg-white p-1.5 outline-none focus:border-brand-500 font-bold"
              >
                <option value="ALL">All Sign-offs</option>
                <option value="PENDING">Pending Only</option>
                <option value="APPROVED">Approved Only</option>
                <option value="REJECTED">Rejected Only</option>
              </select>

              {/* View Switches */}
              <select
                value={filters.projectId}
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
                className="rounded border border-zinc-250 bg-white p-1.5 outline-none focus:border-brand-500 font-bold max-w-[150px]"
              >
                <option value="ALL">All Projects</option>
                {projectsList.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SPREADSHEETS GRID */}
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-250 bg-white shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-650" />
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm overflow-hidden">
              {viewMode === 'list' ? (
                <DocumentTable
                  documents={documents}
                  onViewDetails={setSelectedDoc}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2">
                  {documents.map((d) => (
                    <DocumentCard
                      key={d.id}
                      document={d}
                      onViewDetails={setSelectedDoc}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAGINATION PANEL */}
          {!loading && total > 0 && (
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 flex-wrap gap-2.5">
              <span>
                Showing <strong className="text-zinc-800">{(filters.page! - 1) * filters.limit! + 1}</strong> to{' '}
                <strong className="text-zinc-800">
                  {Math.min(filters.page! * filters.limit!, total)}
                </strong>{' '}
                of <strong className="text-zinc-800">{total}</strong> vault documents
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange('page', filters.page! - 1)}
                  className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={filters.page === totalPages}
                  onClick={() => handleFilterChange('page', filters.page! + 1)}
                  className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 font-bold shadow-xs hover:bg-zinc-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MOCK UPLOAD DRAWER MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-150 bg-zinc-50 px-5 py-4">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <UploadCloud className="h-4.5 w-4.5 text-brand-650" />
                Upload New Vault Document
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-650 uppercase tracking-wide mb-1">Document File Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Single Line Diagram.dwg"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-250 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-650 uppercase tracking-wide mb-1">Directory Category *</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
                  >
                    <option value="SURVEY_REPORTS">Survey Report</option>
                    <option value="DESIGN_DRAWINGS">Design CAD Drawing</option>
                    <option value="CUSTOMER_AGREEMENTS">Customer Agreement</option>
                    <option value="GOVERNMENT_APPROVALS">Government Approval NOC</option>
                    <option value="SAFETY_CHECKLISTS">Safety Checklist</option>
                    <option value="INSTALLATION_REPORTS">Installation Log</option>
                    <option value="COMPLETION_CERTIFICATES">Completion Cert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-650 uppercase tracking-wide mb-1">File Size *</label>
                  <input
                    type="text"
                    value={uploadForm.size}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, size: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-250 px-3 py-2 text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Document Lifecycle Integration (Requirement 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-zinc-150 p-3 rounded-lg bg-zinc-50/50">
                <div>
                  <label className="block font-bold text-zinc-600 uppercase tracking-wide mb-1">Related Project *</label>
                  <select
                    value={uploadForm.projectId}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, projectId: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
                  >
                    {projectsList.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-600 uppercase tracking-wide mb-1">Lifecycle Stage Mapping *</label>
                  <select
                    value={uploadForm.stage}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, stage: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
                  >
                    <option value="PROJECT_CREATED">Project Created</option>
                    <option value="SITE_SURVEY">Site Survey</option>
                    <option value="DESIGN_APPROVAL">Design Approval</option>
                    <option value="MATERIAL_PROCUREMENT">Material Procurement</option>
                    <option value="STRUCTURE_INSTALLATION">Structure Installation</option>
                    <option value="PANEL_MOUNTING">Panel Mounting</option>
                    <option value="ELECTRICAL_WIRING">Electrical Wiring</option>
                    <option value="GRID_APPROVAL">Grid Approval</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-655 uppercase tracking-wide mb-1">Uploaded By (Author) *</label>
                <input
                  type="text"
                  placeholder="e.g. Vivek Kulkarni"
                  value={uploadForm.uploadedBy}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, uploadedBy: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-250 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-zinc-150">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 font-bold text-zinc-650 hover:bg-zinc-55 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-700 shadow-sm"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW REVISION DETAILED SLIDE-OVER DRAWER */}
      {selectedDoc && (
        <DocumentViewer
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onRefresh={loadDocuments}
        />
      )}

    </div>
  );
}
