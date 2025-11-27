package com.example.educhain.repository;

import com.example.educhain.entity.KnowledgeVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 知识内容版本历史数据访问层
 */
@Repository
public interface KnowledgeVersionRepository extends JpaRepository<KnowledgeVersion, Long> {

    /**
     * 根据知识内容ID查找所有版本
     */
    List<KnowledgeVersion> findByKnowledgeIdOrderByVersionNumberDesc(Long knowledgeId);

    /**
     * 根据知识内容ID分页查找版本历史
     */
    Page<KnowledgeVersion> findByKnowledgeIdOrderByVersionNumberDesc(Long knowledgeId, Pageable pageable);

    /**
     * 根据知识内容ID和版本号查找特定版本
     */
    Optional<KnowledgeVersion> findByKnowledgeIdAndVersionNumber(Long knowledgeId, Integer versionNumber);

    /**
     * 查找知识内容的最新版本
     */
    @Query("SELECT kv FROM KnowledgeVersion kv WHERE kv.knowledgeId = :knowledgeId ORDER BY kv.versionNumber DESC LIMIT 1")
    Optional<KnowledgeVersion> findLatestVersionByKnowledgeId(@Param("knowledgeId") Long knowledgeId);

    /**
     * 查找知识内容的最大版本号
     */
    @Query("SELECT MAX(kv.versionNumber) FROM KnowledgeVersion kv WHERE kv.knowledgeId = :knowledgeId")
    Optional<Integer> findMaxVersionNumberByKnowledgeId(@Param("knowledgeId") Long knowledgeId);

    /**
     * 根据编辑者ID查找版本历史
     */
    Page<KnowledgeVersion> findByEditorIdOrderByCreatedAtDesc(Long editorId, Pageable pageable);

    /**
     * 根据变更类型查找版本历史
     */
    Page<KnowledgeVersion> findByChangeTypeOrderByCreatedAtDesc(KnowledgeVersion.ChangeType changeType, Pageable pageable);

    /**
     * 根据时间范围查找版本历史
     */
    Page<KnowledgeVersion> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 统计知识内容的版本数量
     */
    @Query("SELECT COUNT(kv) FROM KnowledgeVersion kv WHERE kv.knowledgeId = :knowledgeId")
    Long countByKnowledgeId(@Param("knowledgeId") Long knowledgeId);

    /**
     * 统计编辑者的编辑次数
     */
    @Query("SELECT COUNT(kv) FROM KnowledgeVersion kv WHERE kv.editorId = :editorId")
    Long countByEditorId(@Param("editorId") Long editorId);

    /**
     * 查找最近的版本变更
     */
    @Query("SELECT kv FROM KnowledgeVersion kv WHERE kv.createdAt >= :since ORDER BY kv.createdAt DESC")
    Page<KnowledgeVersion> findRecentChanges(@Param("since") LocalDateTime since, Pageable pageable);

    /**
     * 查找特定知识内容的版本变更统计
     */
    @Query("SELECT kv.changeType, COUNT(kv) FROM KnowledgeVersion kv WHERE kv.knowledgeId = :knowledgeId GROUP BY kv.changeType")
    List<Object[]> getChangeTypeStatsByKnowledgeId(@Param("knowledgeId") Long knowledgeId);

    /**
     * 查找编辑者的版本变更统计
     */
    @Query("SELECT kv.changeType, COUNT(kv) FROM KnowledgeVersion kv WHERE kv.editorId = :editorId GROUP BY kv.changeType")
    List<Object[]> getChangeTypeStatsByEditorId(@Param("editorId") Long editorId);

    /**
     * 删除指定知识内容的所有版本历史
     */
    void deleteByKnowledgeId(Long knowledgeId);

    /**
     * 删除指定时间之前的版本历史
     */
    @Query("DELETE FROM KnowledgeVersion kv WHERE kv.createdAt < :before")
    int deleteVersionsBefore(@Param("before") LocalDateTime before);

    /**
     * 查找需要清理的旧版本（保留最新的N个版本）
     */
    @Query("SELECT kv FROM KnowledgeVersion kv WHERE kv.knowledgeId = :knowledgeId AND " +
           "kv.versionNumber <= (SELECT MAX(kv2.versionNumber) - :keepCount FROM KnowledgeVersion kv2 WHERE kv2.knowledgeId = :knowledgeId)")
    List<KnowledgeVersion> findOldVersionsToCleanup(@Param("knowledgeId") Long knowledgeId, @Param("keepCount") Integer keepCount);
}