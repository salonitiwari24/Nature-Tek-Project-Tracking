# API Design

## Nature Tek Solar PMS – REST API v1

Base URL: `/api/v1`  
Format: JSON  
Errors: [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) Problem Details

---

## 1. Conventions

| Topic | Standard |
|-------|----------|
| Auth header | `Authorization: Bearer <access_token>` |
| Correlation | `X-Correlation-Id` (echoed in response) |
| Pagination | `?cursor=&limit=20` or `?page=1&limit=20` |
| Sorting | `?sort=-createdAt` |
| Filtering | `?status=ACTIVE&stage=SITE_SURVEY` |
| Dates | ISO 8601 UTC |
| IDs | UUID v4 |

### 1.1 Standard Response Envelope

```json
{
  "data": { },
  "meta": { "cursor": "...", "hasMore": true }
}
```

### 1.2 Error Example

```json
{
  "type": "https://api.naturetek.com/errors/validation",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Stage advance blocked",
  "errors": [
    { "field": "milestones", "message": "Site survey milestone incomplete" }
  ]
}
```

---

## 2. Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email + password → `{ accessToken, user }` + refresh cookie |
| POST | `/auth/refresh` | Rotate access token |
| POST | `/auth/logout` | Invalidate refresh token |
| GET | `/auth/me` | Current user profile |

---

## 3. Users & Organization (Admin)

| Method | Path | Roles |
|--------|------|-------|
| GET | `/users` | ADMIN |
| POST | `/users` | ADMIN (invite) |
| GET | `/users/:id` | ADMIN |
| PATCH | `/users/:id` | ADMIN |
| DELETE | `/users/:id` | ADMIN (soft) |
| GET | `/organization` | ADMIN, PM |
| PATCH | `/organization` | ADMIN |

---

## 4. Projects

| Method | Path | Roles |
|--------|------|-------|
| GET | `/projects` | PM+, project members see assigned |
| POST | `/projects` | ADMIN, PM |
| GET | `/projects/:id` | Project ACL |
| PATCH | `/projects/:id` | ADMIN, PM |
| DELETE | `/projects/:id` | ADMIN |
| GET | `/projects/:id/dashboard` | Project ACL |
| POST | `/projects/:id/members` | ADMIN, PM |
| DELETE | `/projects/:id/members/:userId` | ADMIN, PM |
| GET | `/projects/:id/lifecycle/history` | Project ACL |
| POST | `/projects/:id/lifecycle/advance` | ADMIN, PM |
| POST | `/projects/:id/lifecycle/rollback` | ADMIN, PM (with reason) |

### 4.1 Advance Stage Request

```json
POST /api/v1/projects/{id}/lifecycle/advance
{
  "targetStage": "SITE_SURVEY",
  "reason": "Survey team scheduled"
}
```

Response 422 if gate checks fail with `errors[]` listing blockers.

---

## 5. Tasks

| Method | Path | Roles |
|--------|------|-------|
| GET | `/projects/:projectId/tasks` | Project ACL |
| POST | `/projects/:projectId/tasks` | ADMIN, PM, SUPERVISOR |
| GET | `/tasks/my` | Authenticated (assignee) |
| GET | `/tasks/:id` | Project ACL |
| PATCH | `/tasks/:id` | Assignee, PM, SUPERVISOR, ADMIN |
| DELETE | `/tasks/:id` | PM, ADMIN |
| POST | `/tasks/:id/comments` | Project ACL |

---

## 6. Milestones

| Method | Path | Roles |
|--------|------|-------|
| GET | `/projects/:projectId/milestones` | Project ACL |
| POST | `/projects/:projectId/milestones` | PM, ADMIN |
| PATCH | `/milestones/:id` | PM, SUPERVISOR, ADMIN |

---

## 7. Documents

| Method | Path | Roles |
|--------|------|-------|
| GET | `/projects/:projectId/documents` | Project ACL |
| POST | `/projects/:projectId/documents` | Project ACL (write roles) |
| POST | `/documents/:id/versions/upload-url` | Presigned URL for S3 |
| POST | `/documents/:id/versions/confirm` | Confirm upload, create version |
| GET | `/documents/:id/versions/:versionId/download-url` | Presigned GET |

---

## 8. Approvals

| Method | Path | Roles |
|--------|------|-------|
| GET | `/projects/:projectId/approvals` | Project ACL |
| POST | `/projects/:projectId/approvals` | PM, role-specific |
| GET | `/approvals/pending` | Current user as approver |
| POST | `/approvals/:id/steps/:stepId/approve` | Assigned approver |
| POST | `/approvals/:id/steps/:stepId/reject` | Assigned approver |

---

## 9. Resources

| Method | Path | Roles |
|--------|------|-------|
| GET | `/projects/:projectId/materials` | Project ACL |
| POST | `/projects/:projectId/materials` | PM, PROCUREMENT, ADMIN |
| PATCH | `/materials/:id` | PM, PROCUREMENT, ADMIN |

---

## 10. Notifications

| Method | Path | Roles |
|--------|------|-------|
| GET | `/notifications` | Authenticated |
| PATCH | `/notifications/:id/read` | Owner |
| POST | `/notifications/read-all` | Owner |

---

## 11. Reports & Analytics

| Method | Path | Roles |
|--------|------|-------|
| GET | `/reports/project-status` | PM, ADMIN, EXEC |
| GET | `/reports/overdue-tasks` | PM, ADMIN, SUPERVISOR |
| GET | `/reports/stage-pipeline` | PM, ADMIN, EXEC |
| GET | `/analytics/dashboard` | PM, ADMIN, EXEC |
| GET | `/analytics/cycle-time` | PM, ADMIN, EXEC |

Export: `?format=csv` on report endpoints.

---

## 12. Audit (Admin)

| Method | Path | Roles |
|--------|------|-------|
| GET | `/audit-logs` | ADMIN |

Query: `?entityType=project&entityId=...`

---

## 13. OpenAPI

Swagger UI mounted at `/api/docs` in non-production (Phase 3 implementation).

---

*Phase 2 defines contracts; controllers implemented incrementally in Phase 3.*
