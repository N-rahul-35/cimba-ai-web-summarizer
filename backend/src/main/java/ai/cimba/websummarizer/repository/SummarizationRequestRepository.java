// File: backend/src/main/java/ai/cimba/websummarizer/repository/SummarizationRequestRepository.java
package ai.cimba.websummarizer.repository;

import ai.cimba.websummarizer.model.SummarizationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SummarizationRequestRepository extends JpaRepository<SummarizationRequest, Long> {
    List<SummarizationRequest> findAllByOrderByTimestampDesc();
}
