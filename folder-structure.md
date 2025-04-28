websummarizer/
├── build.gradle                 # Root project build file
├── settings.gradle              # Project settings file
├── scalaSummarizerAPI/          # Scala library module
│   ├── build.gradle
│   └── src/main/scala/ai/cimba/scalaSummarizer/
│       └── SummarizerApp.scala  
├── backend/                     # Spring Boot backend module
│   ├── build.gradle
│   ├── src/main/java/ai/cimba/websummarizer/
│   │   ├── WebSummarizerApplication.java
│   │   ├── controller/
│   │   │   └── SummarizerController.java
│   │   ├── model/
│   │   │   └── SummarizationRequest.java
│   │   ├── repository/
│   │   │   └── SummarizationRequestRepository.java
│   │   └── service/
│   │       └── ScalaLibraryService.java
│   └── src/main/resources/
│       └── application.properties
├── python-service/              # Python FastAPI service
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── pages/
│   │       ├── SummarizerPage.js
│   │       └── HistoryPage.js
│   ├── package.json
│   └── Dockerfile
└── k8s/                         # Kubernetes deployment files
    ├── postgres-deployment.yaml
    ├── python-service-deployment.yaml
    ├── backend-deployment.yaml
    └── frontend-deployment.yaml