# CivicPulse 🏙️
### *Turning Civic Problems into Action.*
**A Real-Time Smart City Management Platform for Indian Municipal Corporations**

---

## 🌟 Executive Overview
**CivicPulse** is a production-ready, full-stack civic operations platform connecting **Citizens**, **Municipal Officials**, **Field Workers**, and **City Administrators** into a transparent, measurable digital ecosystem.

Unlike traditional static complaint portals, CivicPulse provides:
1. **Under 30-Second Issue Filing**: Multi-step intuitive wizard with GPS pin-drop, photographic evidence, and automatic department routing.
2. **Deterministic Priority Engine (Zero AI Dependency)**: Transparent, formula-based scoring based on category weights, severity level, crowd-affected multiplier, and reopening history.
3. **Live GIS Fleet Radar**: Real-time vector map tracking active municipal complaints, field worker locations, and zone clusters in Jaipur.
4. **Transparent 6-Stage Operational Audit Trail**: Complete historical trail from Citizen Submission → Official Verification → Field Crew Assignment → Work In Progress → Photo Evidence Resolution → **Citizen Sign-Off Verification**.
5. **Mandatory Citizen Verification**: Complaints cannot be closed by officials alone; citizens must rate work quality or reopen if issues persist.
6. **Municipal What-If Scenario Simulator**: Algorithmic policy simulator allowing administrators to project the impact of workforce fleet expansion, monsoon climate stress shocks, and emergency budgets on city SLA compliance.
7. **City Health Score Index**: Multi-pillar index computed dynamically from SLA compliance rate, resolution speed, and citizen satisfaction ratings.
8. **City-Wide Emergency Protocol**: Rapid emergency broadcast system with automatic high-priority ticket escalation and public notice banners.

---

## 👥 Demo User Personas & Credentials
Switch between all 4 personas instantly using the **Demo Persona Switcher bar** at the top of the app:

| Role | Persona | Email | Demo Focus |
|---|---|---|---|
| **Citizen** | Rahul Sharma | `citizen@civicpulse.gov.in` | File complaint, drop GPS pin, view live timeline, confirm/upvote, **Verify & Close** with rating or Reopen |
| **Official** | Rajesh Kumar Sharma (Roads Dept) | `official@civicpulse.gov.in` | Dispatch queue, verify tickets, assign field crews with instructions, SLA breach monitoring |
| **Field Worker** | Amit Kumar (Repair Crew) | `worker@civicpulse.gov.in` | Mobile-first terminal, start work order, upload photo proof upon completion |
| **Admin** | Vikramaditya Rathore (Commissioner) | `admin@civicpulse.gov.in` | City Health Score radar, Department SLA matrix, What-If Simulator, Emergency Alert broadcast |

---

## ⚙️ Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Zustand, Lucide Icons, Leaflet GIS vector map, Radix UI.
- **Backend**: Spring Boot 3.3 / Java 21, Spring Security with JWT, Spring Data JPA, PostGIS Spatial Engine, WebSocket STOMP.
- **Database**: PostgreSQL 17 + PostGIS 3.5 with Flyway versioned migrations (V1 to V10).
- **Containerization**: Multi-service Docker & Docker Compose setup (`postgis_db`, `redis`, `backend`, `frontend`).

---

## 🚀 Quick Start Guide

### Option 1: Run Frontend Locally (Fastest)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Run Full Stack via Docker Compose
```bash
docker compose up --build
```
- **Frontend Web App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **Database (PostgreSQL + PostGIS)**: `localhost:5432`

---

## 📐 Algorithmic Scoring Formulas

### 1. Deterministic Priority Engine
$$\text{Total Score} = (\text{Category Weight} \times 20) + (\text{Severity Score} \times 15 \times \text{Crowd Multiplier}) + (\text{Reopened Count} \times 25)$$
- **Score $\ge$ 80**: `CRITICAL`
- **Score $\ge$ 55**: `HIGH`
- **Score $\ge$ 30**: `MEDIUM`
- **Score $<$ 30**: `LOW`

### 2. City Health Score Index
$$\text{Health Index} = (\text{SLA Compliance \%} \times 0.35) + (\text{Speed Score} \times 0.25) + (\text{Citizen Satisfaction} \times 0.25) + (\text{Backlog Health} \times 0.15)$$

---

## 🏆 Hackathon Demo Script (3-Minute Winning Flow)
1. **Public Portal (`/`)**: Show the live Jaipur City GIS Map with real-time active tickets and fleet locations. Point out the dynamic Jaipur City Health Index (87.4/100).
2. **Citizen Persona**: Click **"Citizen"** in the top switcher bar. Click **"Report Issue"**. Select *Water Pipe Rupture*, set severity to *Critical*, and see the Priority Engine dynamically compute *CRITICAL*. Submit and watch it appear in the live feed.
3. **Official Persona**: Switch to **"Official"**. Open the Command Queue, click **"Assign Crew"**, and assign the ticket to nearest available field worker *Amit Kumar*.
4. **Field Worker Persona**: Switch to **"Field Worker"**. View the mobile duty terminal. Click **"Start Repair Work"** $\rightarrow$ Click **"Submit Proof & Resolve"** with photographic evidence.
5. **Citizen Verification & Closure**: Switch back to **"Citizen"**. Notice the ticket is in *Resolved (Pending Verification)* status. Click **"Verify & Close"**, give 5 stars, and finalize ticket resolution.
6. **Executive Admin (`/admin`)**: Switch to **"Admin"**. Run the **"What-If Simulator"** to demonstrate how adding +30% field workers raises city SLA compliance to 95.8% and reduces backlog by 14%. Trigger the **"Emergency Alert"** broadcast to show live city-wide crisis mode.
