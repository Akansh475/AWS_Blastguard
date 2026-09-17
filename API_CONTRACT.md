# BlastGuard API Contract

> **Core statement**: *"Before you change production, know what will break."*

This document defines the strict HTTP API interface, payload schemas, and data models for BlastGuard Core Infrastructure Intelligence (Stage 2). All endpoints follow REST conventions and return JSON responses.

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
| `resourceId` | string | Yes | Non-empty AWS resource identifier (e.g. `subnet-07`, `vpc-prod`) |
| `resourceType` | string | Yes | `'VPC'`, `'Subnet'`, `'EC2'`, `'ECS'`, `'RDS'`, `'Lambda'`, `'S3'`, `'IAM'`, `'LoadBalancer'`, `'SecurityGroup'`, `'External'` |
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

---

### 2.5 Calculate / Retrieve Impact Graph
Retrieve the dependency topology and blast radius graph for the resource referenced in the change request.
Generated deterministically by `TopologyAnalysisService` from graph traversal.

- **Method**: `GET`
- **Route**: `/api/requests/:requestId/impact`

#### Success Response (200 OK)
For `DELETE subnet-07`:
```json
{
  "data": {
    "rootResourceId": "subnet-07",
    "blastRadiusCount": 11,
    "directImpactCount": 2,
    "indirectImpactCount": 8,
    "depth": 2,
    "criticalServicesCount": 3,
    "externalDependenciesCount": 2,
    "affectedNodes": [
      {
        "id": "subnet-07",
        "name": "subnet-07",
        "type": "Subnet",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "payment-api",
        "name": "payment-api",
        "type": "ECS",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "payment-worker",
        "name": "payment-worker",
        "type": "EC2",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "payment-db",
        "name": "payment-db",
        "type": "RDS",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "payment-notifier",
        "name": "payment-notifier",
        "type": "Lambda",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "payment-security-group",
        "name": "payment-security-group",
        "type": "SecurityGroup",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "payment-data-bucket",
        "name": "payment-data-bucket",
        "type": "S3",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "iam-payment-role",
        "name": "iam-payment-role",
        "type": "IAM",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "order-service",
        "name": "order-service",
        "type": "ECS",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1"
      },
      {
        "id": "production-load-balancer",
        "name": "production-load-balancer",
        "type": "LoadBalancer",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1",
        "isExternal": true
      },
      {
        "id": "external-payment-gateway",
        "name": "external-payment-gateway",
        "type": "External",
        "criticality": "HIGH",
        "environment": "PRODUCTION",
        "region": "ap-south-1",
        "isExternal": true
      }
    ],
    "criticalNodes": [
      {
        "id": "payment-api",
        "name": "payment-api",
        "type": "ECS",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION"
      },
      {
        "id": "payment-worker",
        "name": "payment-worker",
        "type": "EC2",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION"
      },
      {
        "id": "payment-notifier",
        "name": "payment-notifier",
        "type": "Lambda",
        "criticality": "CRITICAL",
        "environment": "PRODUCTION"
      }
    ],
    "externalNodes": [
      {
        "id": "production-load-balancer",
        "name": "production-load-balancer",
        "type": "LoadBalancer",
        "criticality": "HIGH",
        "isExternal": true
      },
      {
        "id": "external-payment-gateway",
        "name": "external-payment-gateway",
        "type": "External",
        "criticality": "HIGH",
        "isExternal": true
      }
    ],
    "nodes": [...],
    "edges": [
      {
        "id": "edge-1",
        "source": "subnet-07",
        "target": "payment-api",
        "relationship": "HOSTS"
      },
      {
        "id": "edge-2",
        "source": "subnet-07",
        "target": "payment-worker",
        "relationship": "HOSTS"
      },
      {
        "id": "edge-3",
        "source": "production-load-balancer",
        "target": "payment-api",
        "relationship": "ROUTES_TO"
      },
      {
        "id": "edge-4",
        "source": "order-service",
        "target": "payment-api",
        "relationship": "CALLS"
      },
      {
        "id": "edge-5",
        "source": "payment-api",
        "target": "payment-db",
        "relationship": "CONNECTS_TO"
      },
      {
        "id": "edge-6",
        "source": "payment-api",
        "target": "payment-security-group",
        "relationship": "PROTECTED_BY"
      },
      {
        "id": "edge-7",
        "source": "payment-api",
        "target": "iam-payment-role",
        "relationship": "USES"
      },
      {
        "id": "edge-8",
        "source": "payment-api",
        "target": "payment-notifier",
        "relationship": "CALLS"
      },
      {
        "id": "edge-9",
        "source": "payment-api",
        "target": "external-payment-gateway",
        "relationship": "CALLS"
      },
      {
        "id": "edge-10",
        "source": "payment-api",
        "target": "payment-data-bucket",
        "relationship": "STORES_IN"
      }
    ]
  }
}
```

---

### 2.6 Trigger Analysis for Change Request
Initiate infrastructure safety analysis. In Stage 2, calculates blast radius and evaluates placeholder risk metrics.

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
    "riskScore": 85,
    "riskLevel": "HIGH",
    "blastRadius": 11,
    "impactGraph": { ... },
    "securityFindings": [],
    "policyViolations": [],
    "summary": "Stage 1/2 baseline analysis for DELETE on Subnet (subnet-07) in PRODUCTION. Direct dependencies: 2, total blast radius: 11 resources.",
    "recommendations": [
      "Assess the 2 directly connected resources before executing DELETE.",
      "Full Stage 3 intelligence engine with multi-agent Bedrock analysis will compute deep policy/security checks."
    ],
    "analyzedAt": "2026-09-17T08:00:05.123Z"
  }
}
```

---

### 2.7 Get Resource by ID
Look up a specific resource directly from the infrastructure provider catalog.

- **Method**: `GET`
- **Route**: `/api/resources/:resourceId`

#### Success Response (200 OK)
```json
{
  "data": {
    "id": "subnet-07",
    "name": "subnet-07",
    "type": "Subnet",
    "region": "ap-south-1",
    "environment": "PRODUCTION",
    "criticality": "CRITICAL",
    "arn": "arn:aws:ec2:ap-south-1:123456789012:subnet/subnet-07",
    "tags": {
      "Environment": "production",
      "Tier": "private-app",
      "Workload": "payments"
    },
    "metadata": {
      "vpcId": "vpc-prod",
      "cidrBlock": "10.0.7.0/24"
    }
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource with ID 'subnet-nonexistent' not found"
  }
}
```

---

### 2.8 List Resources
List all resources in the inventory.

- **Method**: `GET`
- **Route**: `/api/resources`

#### Success Response (200 OK)
```json
{
  "data": [ ... ],
  "meta": {
    "total": 20
  }
}
```

---

## 3. Data Contracts

### 3.1 Dependency Relationships
Supported relationships:
- `HOSTS`: Subnet / VPC hosting a compute, database, or network workload
- `DEPENDS_ON`: Resource depending directly on network / parent resource
- `CONNECTS_TO`: Workload connecting to database, cache, or datastore
- `USES`: Workload using an IAM role or encryption key
- `ROUTES_TO`: Ingress Load Balancer forwarding traffic to an internal target group
- `PROTECTED_BY`: Workload protected by a Security Group
- `STORES_IN`: Workload storing objects in an S3 bucket
- `CALLS`: Service invoking another service, Lambda, or external API

### 3.2 ImpactGraph
```typescript
interface ImpactGraph {
  rootResourceId: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  affectedNodes: TopologyNode[];
  criticalNodes: TopologyNode[];
  externalNodes: TopologyNode[];
  blastRadiusCount: number;
  directImpactCount: number;
  indirectImpactCount: number;
  criticalServicesCount?: number;
  externalDependenciesCount?: number;
  depth?: number;
}

interface TopologyNode {
  id: string;
  name: string;
  type: ResourceType;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  environment: 'DEV' | 'STAGING' | 'PRODUCTION';
  region?: string;
  isExternal?: boolean;
  label?: string;
  data?: Record<string, unknown>;
}

interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'HOSTS' | 'DEPENDS_ON' | 'CONNECTS_TO' | 'USES' | 'ROUTES_TO' | 'PROTECTED_BY' | 'STORES_IN' | 'CALLS' | string;
  label?: string;
}
```
