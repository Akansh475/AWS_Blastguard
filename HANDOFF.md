# BlastGuard Handoff Guide for Person 2 (Frontend & Application Layer)

Welcome to the BlastGuard Core Intelligence integration package! This guide provides everything required to connect your frontend UI, graphs, and dashboards directly to the deterministic backend engine.

---

## 1. Quick Start & Operating Modes

The backend supports two operating modes selected via the `BLASTGUARD_MODE` environment variable. Both modes use the exact same API contract, data models, and decision pipelines:

### Mock Mode (Recommended for Frontend Dev & Hackathon Demo)
```bash
# Set environment
export BLASTGUARD_MODE=mock
export AWS_REGION=ap-south-1
export PORT=3000

# Start server
npm run dev
```
*Server runs at `http://localhost:3000/api` with 20 pre-configured AWS resources.*

### Live AWS Mode (Read-Only Live Discovery)
```bash
# Set environment
export BLASTGUARD_MODE=aws
export AWS_REGION=ap-south-1
export AWS_ACCESS_KEY_ID=your-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-key
# (Or attach an IAM execution role to the EC2/ECS container)

npm run dev
```
*Strict Safety Guarantee: The backend provider is 100% read-only (`Describe*`, `List*`, `Get*`). It will NEVER execute deletions or modifications.*

---

## 2. API Endpoints Summary

All routes are mounted under `/api`:

| Method | Route | Description | Typical Use Case |
|---|---|---|---|
| `GET` | `/api/health` | Service health, mode (`mock`/`aws`), region | System status indicator |
| `POST` | `/api/requests` | Propose an infrastructure modification | "Propose Change" modal |
| `GET` | `/api/requests` | List all submitted change requests | Change requests history table |
| `GET` | `/api/requests/:id` | Fetch specific change request | Change request detail view |
| `GET` | `/api/requests/:id/impact`| Blast radius topology graph (`nodes`, `edges`) | Pre-analysis topology visualizer |
| `POST` | `/api/requests/:id/analyze`| **Core Pipeline**: Run full deterministic risk analysis | "Analyze Risk" button |
| `GET` | `/api/resources` | List all discovered resources | Resource inventory dropdown |
| `GET` | `/api/resources/:id` | Fetch single resource attributes | Resource inspection panel |
| `GET` | `/api/resources/:id/dependencies` | Direct dependency relations | Dependency list panel |

---

## 3. The Critical Demo: `DELETE subnet-07`

When an engineer proposes deleting `subnet-07`, the system deterministically derives:

- **Risk Score**: `87 / 100`
- **Severity**: `CRITICAL`
- **Decision**: `BLOCK`
- **Affected Resources**: `11`
- **Critical Services Affected**: `3` (`payment-api`, `payment-worker`, `payment-notifier`)
- **External Dependencies Severed**: `2` (`production-load-balancer`, `external-payment-gateway`)
- **Risk Breakdown**:
  - `dependencyRisk`: `25`
  - `criticalityRisk`: `25`
  - `securityRisk`: `15`
  - `policyRisk`: `15`
  - `environmentRisk`: `7`
  - `total`: `87`

### Sample Flow via cURL:

#### 1. Propose Deletion:
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "action": "DELETE",
    "resourceId": "subnet-07",
    "resourceType": "Subnet",
    "region": "ap-south-1",
    "environment": "PRODUCTION",
    "details": { "reason": "Decommission legacy payment subnet" }
  }'
```
*Returns `{ "data": { "id": "cr-12345", "status": "PENDING", ... } }`*

#### 2. Trigger Multi-Agent Deterministic Analysis:
```bash
curl -X POST http://localhost:3000/api/requests/cr-12345/analyze
```

#### 3. Response Payload (`AnalysisResult`):
```json
{
  "data": {
    "requestId": "cr-12345",
    "resourceId": "subnet-07",
    "riskScore": 87,
    "severity": "CRITICAL",
    "decision": "BLOCK",
    "affectedResources": 11,
    "criticalServices": 3,
    "externalDependencies": 2,
    "riskBreakdown": {
      "dependencyRisk": 25,
      "criticalityRisk": 25,
      "securityRisk": 15,
      "policyRisk": 15,
      "environmentRisk": 7,
      "total": 87
    },
    "reasons": [
      "CRITICAL POLICY VIOLATION: Critical resource subnet-07 (Subnet) cannot be deleted automatically. Manual change approval required.",
      "CRITICAL POLICY VIOLATION: Changes to subnet-07 affect 3 critical downstream service(s) (payment-api, payment-worker, payment-notifier) and require mandatory architectural review.",
      "HIGH POLICY VIOLATION: Production infrastructure changes require formal approval before application. Target subnet-07 is in PRODUCTION.",
      "HIGH POLICY VIOLATION: Changes to subnet-07 affect 2 external-facing dependency(ies) (production-load-balancer, external-payment-gateway) and require external gateway approval.",
      "Comprehensive risk score 87 meets or exceeds BLOCK threshold (66).",
      "Affects 11 dependent AWS resources in the blast radius.",
      "Directly disrupts 3 mission-critical compute service(s): payment-api, payment-worker, payment-notifier.",
      "Severed connections to 2 external/public dependency(ies): production-load-balancer, external-payment-gateway.",
      "Critical security disruption: database disruption or hosted compute isolation in PRODUCTION."
    ],
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
    "topology": {
      "nodes": [
        {
          "id": "subnet-07",
          "name": "subnet-07",
          "type": "Subnet",
          "criticality": "CRITICAL",
          "environment": "PRODUCTION"
        },
        {
          "id": "payment-api",
          "name": "payment-api",
          "type": "ECS",
          "criticality": "CRITICAL",
          "environment": "PRODUCTION"
        }
      ],
      "edges": [
        {
          "id": "edge-subnet-07-payment-api",
          "source": "subnet-07",
          "target": "payment-api",
          "relationship": "HOSTS"
        }
      ]
    },
    "id": "an-cr-12345",
    "status": "BLOCKED",
    "riskLevel": "CRITICAL",
    "blastRadius": 11,
    "summary": "Deterministic analysis for DELETE on Subnet (subnet-07) in PRODUCTION: Decision BLOCK (Score 87/100, CRITICAL). Total affected: 11, critical services: 3, external dependencies: 2. Violations: 4.",
    "recommendations": [
      "[POLICY-001] Resolve: Production infrastructure changes require formal approval before application. Target subnet-07 is in PRODUCTION.",
      "[POLICY-002] Resolve: Critical resource subnet-07 (Subnet) cannot be deleted automatically. Manual change approval required.",
      "[POLICY-003] Resolve: Changes to subnet-07 affect 3 critical downstream service(s) (payment-api, payment-worker, payment-notifier) and require mandatory architectural review.",
      "[POLICY-004] Resolve: Changes to subnet-07 affect 2 external-facing dependency(ies) (production-load-balancer, external-payment-gateway) and require external gateway approval."
    ],
    "analyzedAt": "2026-09-17T10:00:00.000Z"
  }
}
```

---

## 4. Key TypeScript Types for UI Integration

```typescript
// Decision & Severity Badges
export type RiskDecision = 'SAFE' | 'REVIEW' | 'BLOCK';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Visual Risk Breakdown Radar / Bar Chart
export interface RiskBreakdown {
  dependencyRisk: number;    // Max 25
  criticalityRisk: number;   // Max 25
  securityRisk: number;      // Max 20
  policyRisk: number;        // Max 20
  environmentRisk: number;   // Max 10
  total: number;             // Max 100
}

// Graph Visualization (React Flow, Vis.js, or Cytoscape)
export interface TopologyNode {
  id: string;
  name: string;
  type: string;
  criticality: RiskLevel;
  environment: string;
  isExternal?: boolean;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
}
```

---

## 5. Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `BLASTGUARD_MODE` | `mock` | Switch between `mock` (demo dataset) and `aws` (live AWS SDK discovery) |
| `AWS_REGION` | `ap-south-1` | AWS target region |
| `PORT` | `3000` | HTTP port for backend Express server |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin for Vite/React frontend |

---

## 6. Known Boundaries & Limitations

1. **Non-destructive Only**: The backend does NOT provide "Apply Change" execution endpoints. BlastGuard is purely an intelligence and safety verification gate.
2. **Deterministic Fact Guarantee**: No generative AI or LLM is involved in determining infrastructure topology or calculating risk scores. All scores and findings are reproducible and mathematically bounded.
