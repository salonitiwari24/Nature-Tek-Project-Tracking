import { mockDocuments, DocumentDetail, DocCategory, DocApprovalStatus } from '../mocks/documentMockData';
import { ProjectService } from './projectService';

let localDocuments: DocumentDetail[] = [...mockDocuments];

export interface GetDocumentsFilters {
  search?: string;
  category?: string;
  status?: string;
  projectId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedDocuments {
  data: DocumentDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class DocumentService {
  private static LATENCY = 70;

  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // DYNAMIC APPROVAL ANALYTICS COMPUTATIONS (Requirement 2)
  static async getApprovalStats() {
    const docs = [...localDocuments];
    const pending = docs.filter((d) => d.approvalStatus === 'PENDING').length;
    const approved = docs.filter((d) => d.approvalStatus === 'APPROVED').length;
    const rejected = docs.filter((d) => d.approvalStatus === 'REJECTED').length;

    // Filter documents with completed approval times
    const approvedWithTime = docs.filter((d) => d.approvalStatus === 'APPROVED' && d.approvalTimeMinutes);
    const totalMinutes = approvedWithTime.reduce((sum, d) => sum + (d.approvalTimeMinutes ?? 0), 0);
    const averageTimeMinutes = approvedWithTime.length > 0 ? Math.round(totalMinutes / approvedWithTime.length) : 0;

    return {
      pending,
      approved,
      rejected,
      averageTimeMinutes,
    };
  }

  static async getDocuments(filters: GetDocumentsFilters = {}): Promise<PaginatedDocuments> {
    await this.delay(this.LATENCY);

    const { search = '', category = 'ALL', status = 'ALL', projectId = 'ALL', page = 1, limit = 10 } = filters;

    let filtered = [...localDocuments];

    // Apply Search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.projectName.toLowerCase().includes(q) ||
          d.uploadedBy.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }

    // Apply Category
    if (category && category !== 'ALL') {
      filtered = filtered.filter((d) => d.category === category);
    }

    // Apply Status
    if (status && status !== 'ALL') {
      filtered = filtered.filter((d) => d.approvalStatus === status as DocApprovalStatus);
    }

    // Apply Project
    if (projectId && projectId !== 'ALL') {
      filtered = filtered.filter((d) => d.projectId === projectId);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async getDocumentById(id: string): Promise<DocumentDetail | null> {
    await this.delay(this.LATENCY);
    const found = localDocuments.find((d) => d.id === id);
    return found ? { ...found } : null;
  }

  static async createDocument(
    data: Omit<DocumentDetail, 'id' | 'projectName' | 'uploadedAt' | 'version' | 'versionHistory' | 'filePath'>
  ): Promise<DocumentDetail> {
    await this.delay(this.LATENCY);

    const proj = await ProjectService.getProjectById(data.projectId);
    const projectName = proj ? proj.name : 'Unknown Solar Project';

    const id = `d-${localDocuments.length + 101}`;
    const newDoc: DocumentDetail = {
      ...data,
      id,
      projectName,
      version: 'v1.0.0',
      filePath: `/vault/${data.projectId}/${data.name.toLowerCase().replace(/\s+/g, '_')}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      versionHistory: [
        {
          version: 'v1.0.0',
          updatedBy: data.uploadedBy,
          updatedAt: new Date().toISOString().split('T')[0],
          comments: 'Initial blueprint package upload.'
        }
      ]
    };

    localDocuments.push(newDoc);
    return newDoc;
  }

  static async updateDocument(id: string, updates: Partial<DocumentDetail>): Promise<DocumentDetail | null> {
    await this.delay(this.LATENCY);
    const index = localDocuments.findIndex((d) => d.id === id);
    if (index < 0) return null;

    const current = localDocuments[index];
    const updated: DocumentDetail = {
      ...current,
      ...updates,
      id: current.id,
      projectId: current.projectId,
    };

    localDocuments[index] = updated;
    return updated;
  }

  static async addVersion(id: string, newVersion: { version: string; updatedBy: string; comments: string }) {
    await this.delay(this.LATENCY);
    const index = localDocuments.findIndex((d) => d.id === id);
    if (index < 0) return null;

    const current = localDocuments[index];
    const historyItem = {
      ...newVersion,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const updated: DocumentDetail = {
      ...current,
      version: newVersion.version,
      versionHistory: [historyItem, ...current.versionHistory],
    };

    localDocuments[index] = updated;
    return updated;
  }

  static async deleteDocument(id: string): Promise<boolean> {
    await this.delay(this.LATENCY);
    const before = localDocuments.length;
    localDocuments = localDocuments.filter((d) => d.id !== id);
    return localDocuments.length < before;
  }
}
