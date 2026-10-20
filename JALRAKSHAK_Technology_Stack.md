# JALRAKSHAK --- Technology Stack

## 1. Project Overview

**JALRAKSHAK** is an AI-assisted irrigation decision-support module
within KRISHISETU. It uses farm, crop, soil, and weather information to
help farmers decide whether to irrigate, wait, or consider partial
irrigation.

The stack below is the selected implementation plan for building
JALRAKSHAK from scratch.

## 2. Selected Technology Stack

  -------------------------------------------------------------------------
  Layer                     Technology              Purpose
  ------------------------- ----------------------- -----------------------
  Frontend                  React.js + JavaScript   Build the farmer
                                                    dashboard, forms,
                                                    recommendations, and
                                                    history screens

  Frontend tooling          Vite                    Run the development
                                                    server and build the
                                                    React application

  UI styling                HTML5 + CSS3            Create responsive
                                                    layouts and accessible
                                                    interface elements

  Frontend routing          React Router            Navigate between
                                                    dashboard, farm setup,
                                                    recommendations, and
                                                    history

  API communication         Axios or Fetch          Send requests from
                                                    React to the Spring
                                                    Boot API

  Main backend              Java + Spring Boot      Implement business
                                                    logic and expose REST
                                                    APIs

  API layer                 Spring Web (REST)       Handle HTTP requests
                                                    and return JSON
                                                    responses

  Database integration      Spring Data MongoDB     Read and write
                                                    application data in
                                                    MongoDB

  Database                  MongoDB                 Store farmer profiles,
                                                    farms, crop cycles,
                                                    weather observations,
                                                    soil readings,
                                                    recommendations, and
                                                    farmer feedback

  AI/ML service             Python + FastAPI        Expose prediction
                                                    functionality through
                                                    HTTP endpoints

  ML/data processing        Pandas + NumPy          Clean, transform, and
                                                    prepare data for model
                                                    inputs

  Machine learning          Scikit-learn and/or     Train and evaluate
                            XGBoost                 irrigation-need
                                                    prediction models

  Authentication/security   Spring Security + JWT   Protect APIs and
                                                    authenticate users

  Weather integration       Weather/forecast API    Retrieve current
                                                    weather and forecast
                                                    data

  Charts                    Recharts (recommended)  Visualize weather, soil
                                                    readings, and
                                                    irrigation history

  API testing               Postman                 Test backend and
                                                    ML-service endpoints

  Version control           Git + GitHub            Track code changes and
                                                    collaborate

  Containerization          Docker (optional for    Package services
                            MVP)                    consistently for
                                                    deployment

  Optional hardware         Soil-moisture sensor /  Supply real-time
                            IoT gateway             soil-moisture readings
                                                    where available
  -------------------------------------------------------------------------

## 3. High-Level Architecture

``` mermaid
flowchart TD
    A[Farmer] --> B[React.js Frontend]
    B -->|REST API / JSON| C[Java Spring Boot Backend]
    C --> D[(MongoDB)]
    C --> E[Weather / Forecast API]
    C -->|Prediction request| F[Python FastAPI ML Service]
    F --> G[Trained ML Model]
    G --> F
    F -->|Prediction + confidence / metadata| C
    C --> H[Decision Engine + Agronomic Rules]
    H -->|Recommendation + explanation| C
    C --> B
    I[Optional Soil-Moisture Sensor] -->|Readings via supported ingestion path| C
```

## 4. Responsibilities by Service

### React.js Frontend

-   Farmer registration and sign-in screens.
-   Farm location, area, crop, soil, and irrigation-method forms.
-   Dashboard showing current conditions and irrigation recommendations.
-   Recommendation explanations, history, and farmer feedback.
-   Clear states for missing, stale, or unavailable data.

### Java + Spring Boot Backend

-   REST APIs for users, farms, crop cycles, readings, recommendations,
    and feedback.
-   Input validation and access control.
-   Fetch weather data from the selected provider.
-   Store and retrieve data through Spring Data MongoDB.
-   Call the Python FastAPI service for predictions.
-   Combine predictions with validated agronomic rules and weather
    risks.
-   Return a clear recommendation such as `IRRIGATE`, `WAIT`,
    `PARTIAL_IRRIGATION`, or `INSUFFICIENT_DATA`.

### MongoDB

Suggested collections: - `users` - `farms` - `crop_cycles` -
`weather_observations` - `soil_moisture_readings` -
`irrigation_recommendations` - `farmer_actions` - `model_metadata` (if
needed)

Use consistent identifiers, timestamps, units, and schema validation.
Add indexes for frequently queried fields such as user ID, farm ID, and
observation time.

### Python + FastAPI ML Service

-   Accept validated features from Spring Boot.
-   Apply the same preprocessing used during model training.
-   Run the trained model and return a prediction plus relevant
    metadata.
-   Version the model and record the training-data/version information.
-   Return an explicit error or insufficient-data result when inputs are
    invalid or outside supported conditions.

### Decision Engine

The ML prediction should **not** be the only basis for a real-world
irrigation instruction. Combine it with validated agronomic rules, crop
stage, weather forecasts, data freshness, and safety checks. If the
available data is insufficient, return that status instead of inventing
a water quantity.

## 5. Request and Data Flow

1.  The farmer enters farm, crop, soil, and irrigation details in React.
2.  React sends the input to a protected Spring Boot REST endpoint.
3.  Spring Boot validates the input and stores relevant records in
    MongoDB.
4.  Spring Boot obtains weather/forecast data from the chosen provider.
5.  Spring Boot sends the prepared prediction features to the Python
    FastAPI service.
6.  FastAPI runs the model and returns a prediction with metadata.
7.  Spring Boot applies the decision rules and checks whether the data
    is adequate and current.
8.  Spring Boot returns the recommendation and explanation to React.
9.  The farmer can record the action taken; the result is stored for
    monitoring and future evaluation.

## 6. Suggested API Boundaries

Example endpoint names for planning; finalize request/response schemas
during implementation.

### Spring Boot API

-   `POST /api/auth/register`
-   `POST /api/auth/login`
-   `GET /api/farms`
-   `POST /api/farms`
-   `GET /api/farms/{farmId}`
-   `POST /api/crop-cycles`
-   `GET /api/farms/{farmId}/recommendations/latest`
-   `GET /api/farms/{farmId}/recommendations`
-   `POST /api/recommendations/{recommendationId}/feedback`

### Python FastAPI service

-   `GET /health`
-   `POST /predict/irrigation-need`

Keep the ML service private to the backend where practical; the frontend
should normally call Spring Boot rather than calling the ML service
directly.

## 7. Development Order

1.  **Foundation:** Create the Git repository, React/Vite frontend,
    Spring Boot application, and Python/FastAPI service.
2.  **Data model:** Define MongoDB document structures and validation
    rules.
3.  **Backend vertical slice:** Build one end-to-end path for creating a
    farm and retrieving its details.
4.  **Weather integration:** Add a provider, error handling, timeouts,
    and data-freshness checks.
5.  **ML baseline:** Prepare representative data, define the target
    label, build a simple baseline, and evaluate it.
6.  **Prediction integration:** Connect Spring Boot to FastAPI and
    validate request/response contracts.
7.  **Decision rules:** Add agronomic checks, uncertainty handling, and
    an `INSUFFICIENT_DATA` outcome.
8.  **Frontend:** Build farm setup, dashboard, recommendation
    explanation, and history.
9.  **Security and tests:** Add JWT-based authentication, authorization,
    input validation, and automated/API tests.
10. **Pilot:** Test with a limited crop and region, obtain expert
    review, and validate recommendations before expanding.

## 8. Important Technical Decisions

-   **Database:** MongoDB is the selected primary database. Use Spring
    Data MongoDB, not JPA/Hibernate, for this database integration.
-   **Service boundary:** Spring Boot owns application workflows and
    authorization; FastAPI serves model inference.
-   **Model choice:** Start with a simple, explainable baseline. Choose
    Scikit-learn or XGBoost only after inspecting the dataset and
    defining an evaluation plan.
-   **Data quality:** Track source, units, timestamps, missing values,
    and freshness for each observation.
-   **Recommendation safety:** Do not display a precise water quantity
    unless the calculation is supported by validated agronomic logic and
    suitable inputs.
-   **Scope:** Start with one region and a small set of crops. Add IoT,
    satellite/remote-sensing data, and more languages only after the
    basic workflow is reliable.
-   **Evidence:** Model accuracy, water savings, and yield improvements
    must be measured during testing and field validation; they should
    not be claimed in advance.

## 9. MVP Deliverables

-   React.js farmer dashboard and farm setup screens.
-   Spring Boot REST API with authentication and authorization.
-   MongoDB collections and indexes for core records.
-   Weather/forecast API integration with failure handling.
-   Python FastAPI prediction endpoint.
-   Baseline ML model with documented evaluation.
-   Rule-based decision layer and recommendation explanations.
-   Recommendation history and farmer feedback.
-   API tests, setup instructions, and deployment notes.

------------------------------------------------------------------------

**Recommended MVP stack in one line:** React.js + JavaScript + Vite +
Java/Spring Boot + Spring Data MongoDB + MongoDB + Python/FastAPI +
Pandas/NumPy + Scikit-learn or XGBoost + Spring Security/JWT + Weather
API.
