# BlastGuard API Contract

> **Core statement**: *"Before you change production, know what will break."*

This document defines the strict HTTP API interface, payload schemas, and data models for BlastGuard Core Infrastructure Intelligence. All endpoints follow REST conventions and return JSON responses.

---

## 1. Protocol & Conventions

### Base URLs
- **Local Development**: `http://localhost:3000/api`
- **AWS API Gateway**: `https://{api-id}.execute-api.{region}.amazonaws.com/api`

### Success Response Envelope
All successful responses return HTTP status `200` (or `201` for creation) wrapped in a standard envelope:
```json
{
  "data": <PayloadObject | PayloadArray>,
  "meta": {
    "total": 123
  }
}
```

### Standard Error Envelope
All error responses return standard HTTP error status codes (`400`, `404`, `409`, `500`) with a consistent error structure:
```json
{
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | CONFLICT | INTERNAL_SERVER_ERROR",
    "message": "Human-readable description of error",
    "details": [
      {
        "field": "environment",
        "message": "environment must be one of: 'DEV', 'STAGING', 'PRODUCTION'"
      }
    ]
  }
}
```

---

## 2. API Endpoints

### 2.1 Health Check
Check operational status and deployment configuration of the BlastGuard API.

- **Method**: `GET`
- **Route**: `/api/health`
- **Authentication**: None

#### Success Response (200 OK)
```json
{
  "data": {
    "status": "OK",
    "service": "blastguard-core-api",
    "version": "1.0.0",
    "mode": "mock",
    "region": "ap-south-1",
    "uptimeSeconds": 142
  }
}
```

---

### 2.2 Create Proposed Change Request
Submit a new infrastructure modification proposal for analysis.

- **Method**: `POST`
- **Route**: `/api/requests`
- **Headers**: `Content-Type: application/json`

#### Request Body
| Field | Type | Required | Allowed Values / Description |
|---|---|---|---|
| `action` | string | Yes | `'CREATE'`, `'UPDATE'`, `'DELETE'` |
| `resourceId` | string | Yes | Non-empty AWS resource identifier (e.g. `subnet-07`, `vpc-prod-main`) |
| `resourceType` | string | Yes | `'VPC'`, `'Subnet'`, `'EC2'`, `'ECS'`, `'RDS'`, `'Lambda'`, `'S3'`, `'IAM'`, `'LoadBalancer'`, `'SecurityGroup'` |
| `region` | string | Yes | Target AWS region (e.g. `ap-south-1`) |
| `environment` | string | Yes | `'DEV'`, `'STAGING'`, `'PRODUCTION'` |
| `details` | object | No | Optional metadata / reason describing proposed change |

#### Example Request
```json
{
  "action": "DELETE",
  "resourceId": "subnet-07",
  "resourceType": "Subnet",
  "region": "ap-south-1",
  "environment": "PRODUCTION",
  "details": {
    "reason": "Decommissioning legacy private subnet"
  }
}
```

#### Success Response (201 Created)
```json
{
  "data": {
    "id": "cr-a1b2c3d4",
    "action": "DELETE",
    "resourceId": "subnet-07",
    "resourceType": "Subnet",
    "region": "ap-south-1",
    "environment": "PRODUCTION",
    "status": "PENDING",
    "createdAt": "2026-09-17T08:00:00.000Z",
    "updatedAt": "2026-09-17T08:00:00.000Z",
    "details": {
      "reason": "Decommissioning legacy private subnet"
    }
  }
}
```

---

### 2.3 List Change Requests
List all submitted change requests.

- **Method**: `GET`
- **Route**: `/api/requests`

#### Success Response (200 OK)
```json
{
  "data": [
    {
      "id": "cr-a1b2c3d4",
      "action": "DELETE",
      "resourceId": "subnet-07",
      "resourceType": "Subnet",
      "region": "ap-south-1",
      "environment": "PRODUCTION",
      "status": "PENDING",
      "createdAt": "2026-09-17T08:00:00.000Z",
      "updatedAt": "2026-09-17T08:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

---

### 2.4 Get Change Request by ID
Retrieve details and current status of a single change request.

- **Method**: `GET`
- **Route**: `/api/requests/:requestId`

#### Success Response (200 OK)
```json
{
  "data": {
    "id": "cr-a1b2c3d4",
    "action": "DELETE",
    "resourceId": "subnet-07",
    "resourceType": "Subnet",
    "region": "ap-south-1",
    "environment": "PRODUCTION",
    "status": "PENDING",
    "createdAt": "2026-09-17T08:00:00.000Z",
    "updatedAt": "2026-09-17T08:00:00.000Z"
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "ChangeRequest with ID 'cr-unknown' not found"
  }
}
```

---

### 2.5 Calculate / Retrieve Impact Graph
Retrieve the dependency topology and blast radius graph for the resource referenced in the change request.

- **Method**: `GET`
- **Route**: `/api/requests/:requestId/impact`

#### Success Response (200 OK)
```json
{
  "data": {
    "rootResourceId": "subnet-07",
    "blastRadiusCount": 4,
    "directImpactCount": 3,
    "indirectImpactCount": 1,
    "depth": 2,
    "nodes": [
      {
        "id": "subnet-07",
        "label": "private-app-subnet-07",
        "type": "Subnet",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION",
        "region": "ap-south-1",
        "data": {
          "arn": "arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-07"
        }
      },
      {
        "id": "ec2-order-processor",
        "label": "order-processing-instance",
        "type": "EC2",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "rds-main-postgres",
        "label": "primary-orders-postgres",
        "type": "RDS",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "vpc-prod-main",
        "label": "production-primary-vpc",
        "type": "VPC",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      }
    ],
    "edges": [
      {
        "id": "edge-direct-1",
        "source": "ec2-order-processor",
        "target": "subnet-07",
        "relationship": "DEPENDS_ON",
        "label": "EC2 instance resides within subnet-07"
      },
      {
        "id": "edge-direct-2",
        "source": "rds-main-postgres",
        "target": "subnet-07",
        "relationship": "DEPENDS_ON",
        "label": "RDS Database primary subnet member subnet-07"
      },
      {
        "id": "edge-direct-3",
        "source": "subnet-07",
        "target": "vpc-prod-main",
        "relationship": "CONTAINS",
        "label": "Subnet 07 is contained inside VPC"
      }
    ]
  }
}
```

---

### 2.6 Trigger Analysis for Change Request
Initiate comprehensive infrastructure safety analysis. In Stage 1, returns the structured baseline contract with calculated blast radius graph and placeholder fields ready for Stage 2 intelligence engines.

- **Method**: `POST`
- **Route**: `/api/requests/:requestId/analyze`

#### Success Response (200 OK)
```json
{
  "data": {
    "id": "an-cr-a1b2c3d4",
    "requestId": "cr-a1b2c3d4",
    "status": "REVIEW",
    "decision": "REVIEW",
    "riskScore": 60,
    "riskLevel": "HIGH",
    "blastRadius": 4,
    "impactGraph": {
      "rootResourceId": "subnet-07",
      "blastRadiusCount": 4,
      "directImpactCount": 3,
      "indirectImpactCount": 1,
      "depth": 2,
      "nodes": [...],
      "edges": [...]
    },
    "securityFindings": [],
    "policyViolations": [],
    "summary": "Stage 1 baseline analysis for DELETE on Subnet (subnet-07) in PRODUCTION. Direct dependencies: 3, total blast radius: 4 resources.",
    "recommendations": [
      "Assess the 3 directly connected resources before executing DELETE.",
      "Full Stage 2 intelligence engine with multi-agent Bedrock analysis will compute deep policy/security checks."
    ],
    "analyzedAt": "2026-09-17T08:00:05.123Z",
    "metadata": {
      "stage": 1,
      "engineStatus": "placeholder_active"
    }
  }
}
```

---

## 3. Data Contracts

### 3.1 ChangeRequest
```typescript
interface ChangeRequest {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  resourceId: string;
  resourceType: 'VPC' | 'Subnet' | 'EC2' | 'ECS' | 'RDS' | 'Lambda' | 'S3' | 'IAM' | 'LoadBalancer' | 'SecurityGroup';
  region: string;
  environment: 'DEV' | 'STAGING' | 'PRODUCTION';
  status: 'PENDING' | 'ANALYZING' | 'SAFE' | 'REVIEW' | 'BLOCKED' | 'FAILED';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  details?: Record<string, unknown>;
}
```

### 3.2 ImpactGraph
```typescript
interface ImpactGraph {
  rootResourceId: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  blastRadiusCount: number;
  directImpactCount: number;
  indirectImpactCount: number;
  depth?: number;
}

interface TopologyNode {
  id: string;
  label: string;
  type: ResourceType;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  environment: 'DEV' | 'STAGING' | 'PRODUCTION';
  region: string;
  data?: Record<string, unknown>;
}

interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'CONTAINS' | 'DEPENDS_ON' | 'CONNECTS_TO' | 'ATTACHED_TO' | 'ROUTES_TO' | 'SECURED_BY' | 'PERMITS' | string;
  label?: string;
}
```

### 3.3 AnalysisResult
> **Person 2 Compatibility Guarantee**: `AnalysisResult` is locked with optional extensions in `metadata` and typed arrays for `securityFindings` and `policyViolations`. Subsequent stages will populate these fields without altering the existing schema or breaking client integrations.

```typescript
interface AnalysisResult {
  id: string;
  requestId: string;
  status: 'PENDING' | 'ANALYZING' | 'SAFE' | 'REVIEW' | 'BLOCKED' | 'FAILED';
  decision: 'SAFE' | 'REVIEW' | 'BLOCK';
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blastRadius: number;
  impactGraph: ImpactGraph;
  securityFindings: SecurityFinding[];
  policyViolations: PolicyViolation[];
  summary: string;
  recommendations: string[];
  analyzedAt: string; // ISO 8601
  metadata?: Record<string, unknown>;
}

interface SecurityFinding {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  affectedResourceId: string;
  remediation?: string;
  ruleId?: string;
}

interface PolicyViolation {
  id: string;
  policyId: string;
  policyName: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  nonCompliantResource: string;
  guidelineUrl?: string;
}
```
