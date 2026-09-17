# BlastGuard API Contract (v1)

This document defines the REST API contract for BlastGuard, the AWS infrastructure safety system.

**Core Mission Statement:**  
> *"Before you change production, know what will break."*

---

## 1. Overview & Architecture

The BlastGuard Application Layer connects client applications (e.g., BlastGuard Dashboard) with Person 1's Infrastructure Intelligence Analysis Engine.

```
Frontend (http://localhost:5173)
  ↓ HTTP JSON
Backend API (Express / Node.js)
  ↓
RequestService & RequestRepository
  ↓
AnalysisOrchestrator
  ↓
Person 1 Infrastructure Intelligence Provider
(Dependency → Topology → Security → Impact → Policy → Risk → Decision)
  ↓
AnalysisResult (Source of Truth)
  ↓
ResponseMapper
  ↓
Frontend
```

---

## 2. Common Data Types & Enums

### 2.1 Action
- `CREATE`
- `UPDATE`
- `DELETE`

### 2.2 Environment
- `DEV`
- `STAGING`
- `PRODUCTION`

### 2.3 Request Status
- `PENDING` — Request submitted, awaiting analysis.
- `ANALYZING` — Infrastructure intelligence engine is evaluating blast radius.
- `SAFE` — Analysis completed: low risk (<30/100), approved.
- `REVIEW` — Analysis completed: medium risk (30–69/100), requires human sign-off.
- `BLOCKED` — Analysis completed: critical risk (≥70/100) or Cedar policy violation.
- `FAILED` — Analysis failed due to infrastructure provider or system failure.

### 2.4 Decision
- `ALLOW` (maps to status `SAFE`)
- `REVIEW` (maps to status `REVIEW`)
- `BLOCK` (maps to status `BLOCKED`)

### 2.5 Severity
- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

---

## 3. Endpoints

### 3.1 Create Change Request
`POST /api/requests`

Creates a new change request in `PENDING` status.

#### Request Body
```json
{
  "action": "DELETE",
  "resourceId": "subnet-07",
  "resourceType": "Subnet",
  "region": "ap-south-1",
  "environment": "PRODUCTION"
}
```

#### Response (201 Created)
```json
{
  "requestId": "req_1726569600000_a1b2c",
  "status": "PENDING"
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "environment must be one of: DEV, STAGING, PRODUCTION"
  }
}
```

---

### 3.2 List Change Requests
`GET /api/requests`

Returns the list of recent change requests, supporting basic status filtering.

#### Query Parameters
- `status` *(optional)*: `PENDING`, `ANALYZING`, `SAFE`, `REVIEW`, `BLOCKED`, `FAILED`

#### Response (200 OK)
```json
[
  {
    "requestId": "req_01",
    "resourceId": "subnet-07",
    "action": "DELETE",
    "resourceType": "Subnet",
    "region": "ap-south-1",
    "environment": "PRODUCTION",
    "status": "BLOCKED",
    "riskScore": 87,
    "createdAt": "2026-09-17T07:30:00.000Z",
    "updatedAt": "2026-09-17T07:30:05.000Z"
  }
]
```

---

### 3.3 Get Change Request by ID
`GET /api/requests/:requestId`

Returns full metadata and analysis details for the specified change request.

#### Response (200 OK - Analyzed Request)
```json
{
  "requestId": "req_01",
  "resourceId": "subnet-07",
  "action": "DELETE",
  "resourceType": "Subnet",
  "region": "ap-south-1",
  "environment": "PRODUCTION",
  "status": "BLOCKED",
  "createdAt": "2026-09-17T07:30:00.000Z",
  "updatedAt": "2026-09-17T07:30:05.000Z",
  "analysis": {
    "riskScore": 87,
    "severity": "CRITICAL",
    "decision": "BLOCK",
    "affectedResources": 11,
    "criticalServices": 3,
    "externalDependencies": 2,
    "summary": "This change will delete a subnet in a production VPC and impact 11 resources across 3 critical services.",
    "policyViolations": [
      {
        "policyId": "POL-001",
        "policyName": "PRODUCTION_CHANGE_REQUIRES_APPROVAL",
        "severity": "CRITICAL",
        "description": "Deleting subnet-07 severs ENIs for production services."
      }
    ],
    "securityFindings": [
      {
        "category": "PERIMETER_ISOLATION",
        "severity": "HIGH",
        "details": "Active production ENI interfaces bound to subnet-07 with no failover route."
      }
    ],
    "impactGraph": {
      "nodes": [
        {
          "id": "subnet-07",
          "name": "subnet-07 (Prod-Network)",
          "type": "subnet",
          "status": "critical",
          "isOrigin": true
        }
      ],
      "links": [
        {
          "id": "l1",
          "source": "subnet-07",
          "target": "payment-api",
          "type": "network"
        }
      ]
    },
    "analyzedAt": "2026-09-17T07:30:05.000Z"
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "error": {
    "code": "REQUEST_NOT_FOUND",
    "message": "Change request 'req_999' was not found"
  }
}
```

---

### 3.4 Analyze Change Request
`POST /api/requests/:requestId/analyze`

Triggers infrastructure analysis for the request.

#### Execution Lifecycle:
1. Load request from repository.
2. Verify request exists (404 if not found).
3. Set status to `ANALYZING`.
4. Delegate to `AnalysisOrchestrator` → Person 1's Infrastructure Intelligence pipeline.
5. Store `AnalysisResult`.
6. Update request status based on the deterministic decision (`SAFE`, `REVIEW`, `BLOCKED`).
7. If an error occurs, set status to `FAILED`.

#### Response (200 OK)
```json
{
  "requestId": "req_01",
  "resourceId": "subnet-07",
  "action": "DELETE",
  "status": "BLOCKED",
  "riskScore": 87,
  "severity": "CRITICAL",
  "decision": "BLOCK",
  "affectedResources": 11,
  "criticalServices": 3,
  "externalDependencies": 2,
  "summary": "This change will delete a subnet in a production VPC and impact 11 resources across 3 critical services.",
  "policyViolations": [...],
  "securityFindings": [...],
  "impactGraph": { ... },
  "analyzedAt": "2026-09-17T07:30:05.000Z"
}
```

---

## 4. Standard Error Format

All error responses strictly adhere to the following JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable explanation"
  }
}
```

### Standard Error Codes:
- `INVALID_REQUEST` (400) — Validation failure on input parameters.
- `REQUEST_NOT_FOUND` (404) — Requested resource does not exist.
- `ANALYSIS_FAILED` (500) — Infrastructure analysis provider failure.
- `INTERNAL_SERVER_ERROR` (500) — Unexpected internal system error.
