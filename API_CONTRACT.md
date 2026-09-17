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
Initiate comprehensive infrastructure safety analysis. In Stage 3, executes the pipeline:
`ChangeRequest → ResourceProvider → Dependency analysis → Topology → Security → Impact → Policy → BlastRadius`.
Populates real `securityFindings` and `policyViolations` completely deterministically without AI.

- **Method**: `POST`
- **Route**: `/api/requests/:requestId/analyze`

#### Success Response (200 OK)
For `DELETE subnet-07`:
```json
{
  "data": {
    "id": "an-cr-a1b2c3d4",
    "requestId": "cr-a1b2c3d4",
    "status": "BLOCKED",
    "decision": "BLOCK",
    "riskScore": 95,
    "riskLevel": "CRITICAL",
    "blastRadius": 11,
    "impactGraph": {
      "rootResourceId": "subnet-07",
      "blastRadiusCount": 11,
      "directImpactCount": 2,
      "indirectImpactCount": 8,
      "criticalServicesCount": 3,
      "externalDependenciesCount": 2,
      "affectedNodes": [...],
      "criticalNodes": [...],
      "externalNodes": [...]
    },
    "securityFindings": [
      {
        "id": "sec-prod-boundary-subnet-07",
        "severity": "HIGH",
        "title": "Production Network Boundary Disruption",
        "description": "Target resource subnet-07 operates in PRODUCTION and encapsulates mission-critical infrastructure.",
        "resourceId": "subnet-07"
      },
      {
        "id": "sec-net-isolation-subnet-07",
        "severity": "CRITICAL",
        "title": "Hosted Workload Network Isolation",
        "description": "Deleting subnet-07 removes network interfaces (ENIs) for 2 hosted compute service(s).",
        "resourceId": "subnet-07"
      },
      {
        "id": "sec-db-disruption-payment-db",
        "severity": "CRITICAL",
        "title": "Transactional Database Connectivity Severed",
        "description": "Database payment-db (RDS) will lose network and client connectivity, risking transactional data pipeline failures.",
        "resourceId": "payment-db"
      },
      {
        "id": "sec-ingress-exposure-production-load-balancer",
        "severity": "HIGH",
        "title": "Public Ingress Gateway Disruption",
        "description": "Internet-facing entrypoint production-load-balancer will fail health checks and produce 502/504 gateway failures to public users.",
        "resourceId": "production-load-balancer"
      },
      {
        "id": "sec-ext-partner-external-payment-gateway",
        "severity": "HIGH",
        "title": "External Partner Integration Severed",
        "description": "External banking/partner integration external-payment-gateway will experience ungraceful connection drops and transaction timeouts.",
        "resourceId": "external-payment-gateway"
      },
      {
        "id": "sec-sg-orphaned-payment-security-group",
        "severity": "MEDIUM",
        "title": "Security Group Firewall Boundary Severed",
        "description": "Firewall rules in payment-security-group will be detached and orphaned from runtime workloads.",
        "resourceId": "payment-security-group"
      },
      {
        "id": "sec-iam-severed-iam-payment-role",
        "severity": "HIGH",
        "title": "IAM Execution Role Context Interrupted",
        "description": "Execution privilege context iam-payment-role will be severed from application workloads.",
        "resourceId": "iam-payment-role"
      },
      {
        "id": "sec-storage-pipeline-payment-data-bucket",
        "severity": "HIGH",
        "title": "Sensitive Storage Ingestion Pipeline Halt",
        "description": "Audit and compliance data storage in payment-data-bucket will be interrupted as writers lose execution access.",
        "resourceId": "payment-data-bucket"
      }
    ],
    "policyViolations": [
      {
        "policyId": "POLICY-001",
        "policyName": "Production Change Governance",
        "severity": "HIGH",
        "message": "Production infrastructure changes require formal approval before application. Target subnet-07 is in PRODUCTION.",
        "resourceId": "subnet-07"
      },
      {
        "policyId": "POLICY-002",
        "policyName": "Critical Resource Deletion Guardrail",
        "severity": "CRITICAL",
        "message": "Critical resource subnet-07 (Subnet) cannot be deleted automatically. Manual change approval required.",
        "resourceId": "subnet-07"
      },
      {
        "policyId": "POLICY-003",
        "policyName": "Critical Dependency Review Guardrail",
        "severity": "CRITICAL",
        "message": "Changes to subnet-07 affect 3 critical downstream service(s) (payment-api, payment-worker, payment-notifier) and require mandatory architectural review.",
        "resourceId": "subnet-07"
      },
      {
        "policyId": "POLICY-004",
        "policyName": "External Attack Surface & Dependency Protection",
        "severity": "HIGH",
        "message": "Changes to subnet-07 affect 2 external-facing dependency(ies) (production-load-balancer, external-payment-gateway) and require external gateway approval.",
        "resourceId": "subnet-07"
      }
    ],
    "summary": "Deterministic analysis for DELETE on Subnet (subnet-07) in PRODUCTION. Total affected: 11, critical services: 3, external dependencies: 2, security risk: CRITICAL. Policy violations: 4.",
    "recommendations": [
      "[POLICY-001] Resolve: Production infrastructure changes require formal approval before application. Target subnet-07 is in PRODUCTION.",
      "[POLICY-002] Resolve: Critical resource subnet-07 (Subnet) cannot be deleted automatically. Manual change approval required.",
      "[POLICY-003] Resolve: Changes to subnet-07 affect 3 critical downstream service(s) (payment-api, payment-worker, payment-notifier) and require mandatory architectural review.",
      "[POLICY-004] Resolve: Changes to subnet-07 affect 2 external-facing dependency(ies) (production-load-balancer, external-payment-gateway) and require external gateway approval.",
      "Coordinate maintenance windows for 2 external dependencies: production-load-balancer, external-payment-gateway.",
      "Architectural review mandatory for 3 critical services: payment-api, payment-worker, payment-notifier."
    ],
    "analyzedAt": "2026-09-17T08:00:05.123Z",
    "metadata": {
      "stage": 3,
      "productionImpact": true,
      "securityRisk": "CRITICAL",
      "policiesPassed": false
    }
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
