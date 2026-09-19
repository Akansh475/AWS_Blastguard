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
5. Store `AnalysisResult` (in DynamoDB or In-Memory repository).
6. Update request status based on the deterministic decision (`SAFE`, `REVIEW`, `BLOCKED`).
7. If an error occurs, set status to `FAILED`. Never mark `SAFE` on failure.

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

### 3.5 Get Impact Graph
`GET /api/requests/:requestId/impact`

Returns Person 1's actual `ImpactGraph` for visualization in topological and blast radius graphs.

#### Response (200 OK)
```json
{
  "nodes": [
    {
      "id": "subnet-07",
      "name": "subnet-07 (PRODUCTION)",
      "type": "subnet",
      "status": "critical",
      "isOrigin": true
    },
    {
      "id": "payment-api",
      "name": "Payment API Service",
      "type": "service",
      "status": "critical",
      "isDirectImpact": true,
      "isCritical": true
    },
    {
      "id": "order-service",
      "name": "Order Service Core",
      "type": "service",
      "status": "warning",
      "isDirectImpact": true
    },
    {
      "id": "auth-broker",
      "name": "Auth Broker",
      "type": "auth",
      "status": "critical",
      "isDirectImpact": true,
      "isCritical": true
    },
    {
      "id": "aurora-db",
      "name": "Aurora PG Cluster",
      "type": "database",
      "status": "critical",
      "isIndirectImpact": true,
      "isCritical": true
    }
  ],
  "links": [
    {
      "id": "l1",
      "source": "subnet-07",
      "target": "payment-api",
      "isPrimaryDependency": true,
      "isImpactPath": true,
      "type": "network"
    },
    {
      "id": "l2",
      "source": "subnet-07",
      "target": "order-service",
      "isPrimaryDependency": true,
      "isImpactPath": true,
      "type": "network"
    },
    {
      "id": "l3",
      "source": "subnet-07",
      "target": "auth-broker",
      "isPrimaryDependency": true,
      "isImpactPath": true,
      "type": "network"
    },
    {
      "id": "l4",
      "source": "payment-api",
      "target": "aurora-db",
      "isPrimaryDependency": true,
      "isImpactPath": true,
      "type": "database"
    }
  ]
}
```

### 3.6 Generate / Retrieve AI Explanation
`POST /api/requests/:requestId/explain`

Generates (or returns cached) human-readable risk explanation using Amazon Bedrock. Requires that the request has completed Person 1 analysis.

#### Query Parameters / Body
- `force` *(optional)*: `true` to force re-generation with Bedrock even if cached.

#### Response (200 OK)
```json
{
  "requestId": "req_01",
  "explanation": {
    "summary": "Deleting subnet-07 in PRODUCTION is blocked due to critical risk (Score: 87/100) affecting 11 resources.",
    "whyBlocked": "Deleting subnet-07 is blocked because it is a critical production subnet providing active network interfaces for 3 revenue-critical services.",
    "impactExplanation": "11 downstream resources will lose network connectivity, directly impacting 3 critical services and 2 external dependencies.",
    "securityExplanation": "Active production Elastic Network Interfaces are bound to subnet-07 with no standby failover in alternate AZ.",
    "policyExplanation": "Violates PRODUCTION_CHANGE_REQUIRES_APPROVAL governance policy.",
    "recommendedAction": "Reroute payment-api and auth-broker network interfaces to alternate subnets before scheduling subnet decommission.",
    "keyReasons": [
      "PRODUCTION Subnet DELETE",
      "11 affected resources",
      "3 critical services impacted",
      "2 external dependencies",
      "Risk Score: 87/100 (CRITICAL)"
    ]
  },
  "generatedAt": "2026-09-17T10:05:00.000Z",
  "model": "anthropic.claude-3-5-sonnet-20240620-v1:0",
  "version": "1.0.0"
}
```

#### Error Responses
- **409 Conflict** (`ANALYSIS_REQUIRED`): Request has not been analyzed yet.
- **404 Not Found** (`REQUEST_NOT_FOUND`): Request ID does not exist.

---

### 3.7 Get Stored AI Explanation
`GET /api/requests/:requestId/explanation`

Retrieves a previously generated AI explanation for a change request.

#### Response (200 OK)
Returns the `ExplanationRecord` identical to `POST /explain`.

#### Error Response (404 Not Found)
```json
{
  "error": {
    "code": "EXPLANATION_NOT_FOUND",
    "message": "No AI explanation found for change request 'req_05'. Run POST /api/requests/req_05/explain first."
  }
}
```

---

## 4. DynamoDB Schema & Persistence Design

When running in AWS mode (`BLASTGUARD_MODE=aws`), requests, analysis results, and AI explanations persist into Amazon DynamoDB.

### 4.1 Table Schema (`BlastGuardRequests`)
- **Partition Key (PK)**: `requestId` (String)
- **Billing Mode**: `PAY_PER_REQUEST` (On-Demand)

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `requestId` | String (PK) | Unique identifier for change request (e.g. `req_01`) |
| `action` | String | `CREATE`, `UPDATE`, `DELETE` |
| `resourceId` | String | Target AWS resource ID (e.g. `subnet-07`) |
| `resourceType` | String | Target resource type (e.g. `Subnet`) |
| `region` | String | AWS region (e.g. `ap-south-1`) |
| `environment` | String | `DEV`, `STAGING`, `PRODUCTION` |
| `status` | String | `PENDING`, `ANALYZING`, `SAFE`, `REVIEW`, `BLOCKED`, `FAILED` |
| `riskScore` | Number | Calculated risk score (0-100) from Person 1 |
| `severity` | String | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `decision` | String | `ALLOW`, `REVIEW`, `BLOCK` |
| `affectedResources` | Number | Count of affected downstream resources |
| `criticalServices` | Number | Count of critical tier services impacted |
| `externalDependencies` | Number | Count of external dependency services impacted |
| `createdAt` | String | ISO 8601 creation timestamp |
| `updatedAt` | String | ISO 8601 update timestamp |
| `analyzedAt` | String | ISO 8601 analysis completion timestamp |
| `analysisResult` | Map | Full serialized `AnalysisResult` from Person 1 |
| `aiExplanation` | Map | Structured `ExplanationResult` generated by Amazon Bedrock |
| `aiExplanationGeneratedAt`| String | Timestamp of AI explanation generation |
| `aiModel` | String | Bedrock model identifier (e.g. `anthropic.claude-3-5-sonnet...`) |
| `aiExplanationVersion` | String | Explanation schema version (e.g. `1.0.0`) |

---

## 5. Standard Error Format

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
- `EXPLANATION_NOT_FOUND` (404) — AI explanation has not yet been generated.
- `ANALYSIS_REQUIRED` (409) — Analysis must be executed before generating AI explanation.
- `ANALYSIS_FAILED` (500) — Infrastructure analysis provider failure.
- `INTERNAL_SERVER_ERROR` (500) — Unexpected internal system error.

