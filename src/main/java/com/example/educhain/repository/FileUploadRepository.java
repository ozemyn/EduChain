package com.example.educhain.repository;

import com.example.educhain.entity.FileUpload;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** 文件上传数据访问层 */
@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {

  /** 根据上传者ID查找文件 */
  Page<FileUpload> findByUploaderIdAndStatus(Long uploaderId, Integer status, Pageable pageable);

  /** 根据知识内容ID查找文件 */
  List<FileUpload> findByKnowledgeIdAndStatus(Long knowledgeId, Integer status);

  /** 根据文件类型查找文件 */
  Page<FileUpload> findByFileTypeAndStatus(String fileType, Integer status, Pageable pageable);

  /** 根据文件哈希查找文件（用于去重） */
  Optional<FileUpload> findByFileHashAndStatus(String fileHash, Integer status);

  /** 根据存储名称查找文件 */
  Optional<FileUpload> findByStoredNameAndStatus(String storedName, Integer status);

  /** 根据文件路径查找文件 */
  Optional<FileUpload> findByFilePathAndStatus(String filePath, Integer status);

  /** 根据原始文件名模糊查询 */
  Page<FileUpload> findByOriginalNameContainingIgnoreCaseAndStatus(
      String originalName, Integer status, Pageable pageable);

  /** 根据文件大小范围查找文件 */
  Page<FileUpload> findByFileSizeBetweenAndStatus(
      Long minSize, Long maxSize, Integer status, Pageable pageable);

  /** 查找最近上传的文件 */
  @Query("SELECT f FROM FileUpload f WHERE f.status = :status ORDER BY f.createdAt DESC")
  Page<FileUpload> findRecentUploads(@Param("status") Integer status, Pageable pageable);

  /** 查找热门文件（按下载次数排序） */
  @Query("SELECT f FROM FileUpload f WHERE f.status = :status ORDER BY f.downloadCount DESC")
  Page<FileUpload> findPopularFiles(@Param("status") Integer status, Pageable pageable);

  /** 查找大文件 */
  @Query(
      "SELECT f FROM FileUpload f WHERE f.status = :status AND f.fileSize > :sizeThreshold ORDER BY f.fileSize DESC")
  Page<FileUpload> findLargeFiles(
      @Param("status") Integer status,
      @Param("sizeThreshold") Long sizeThreshold,
      Pageable pageable);

  /** 查找孤儿文件（未关联知识内容的文件） */
  @Query("SELECT f FROM FileUpload f WHERE f.status = :status AND f.knowledgeId IS NULL")
  Page<FileUpload> findOrphanFiles(@Param("status") Integer status, Pageable pageable);

  /** 查找长时间未访问的文件 */
  @Query(
      "SELECT f FROM FileUpload f WHERE f.status = :status AND (f.lastAccessedAt IS NULL OR f.lastAccessedAt < :before)")
  Page<FileUpload> findInactiveFiles(
      @Param("status") Integer status, @Param("before") LocalDateTime before, Pageable pageable);

  /** 统计用户上传的文件数量 */
  @Query(
      "SELECT COUNT(f) FROM FileUpload f WHERE f.uploaderId = :uploaderId AND f.status = :status")
  Long countByUploaderIdAndStatus(
      @Param("uploaderId") Long uploaderId, @Param("status") Integer status);

  /** 统计用户上传的文件总大小 */
  @Query(
      "SELECT SUM(f.fileSize) FROM FileUpload f WHERE f.uploaderId = :uploaderId AND f.status = :status")
  Long sumFileSizeByUploaderIdAndStatus(
      @Param("uploaderId") Long uploaderId, @Param("status") Integer status);

  /** 统计各文件类型的数量 */
  @Query(
      "SELECT f.fileType, COUNT(f) FROM FileUpload f WHERE f.status = :status GROUP BY f.fileType")
  List<Object[]> countByFileTypeAndStatus(@Param("status") Integer status);

  /** 统计各文件类型的总大小 */
  @Query(
      "SELECT f.fileType, SUM(f.fileSize) FROM FileUpload f WHERE f.status = :status GROUP BY f.fileType")
  List<Object[]> sumFileSizeByFileTypeAndStatus(@Param("status") Integer status);

  /** 获取总文件数量 */
  @Query("SELECT COUNT(f) FROM FileUpload f WHERE f.status = :status")
  Long getTotalFileCount(@Param("status") Integer status);

  /** 获取总文件大小 */
  @Query("SELECT SUM(f.fileSize) FROM FileUpload f WHERE f.status = :status")
  Long getTotalFileSize(@Param("status") Integer status);

  /** 获取总下载次数 */
  @Query("SELECT SUM(f.downloadCount) FROM FileUpload f WHERE f.status = :status")
  Long getTotalDownloadCount(@Param("status") Integer status);

  /** 增加下载次数 */
  @Modifying
  @Query(
      "UPDATE FileUpload f SET f.downloadCount = f.downloadCount + 1, f.lastAccessedAt = :now WHERE f.id = :fileId")
  int incrementDownloadCount(@Param("fileId") Long fileId, @Param("now") LocalDateTime now);

  /** 批量更新状态 */
  @Modifying
  @Query("UPDATE FileUpload f SET f.status = :newStatus WHERE f.id IN :fileIds")
  int updateStatusByIds(
      @Param("fileIds") List<Long> fileIds, @Param("newStatus") Integer newStatus);

  /** 批量删除孤儿文件 */
  @Modifying
  @Query(
      "UPDATE FileUpload f SET f.status = 0 WHERE f.knowledgeId IS NULL AND f.createdAt < :before")
  int deleteOrphanFilesBefore(@Param("before") LocalDateTime before);

  /** 查找重复文件（相同哈希值） */
  @Query(
      "SELECT f.fileHash, COUNT(f) FROM FileUpload f WHERE f.status = :status AND f.fileHash IS NOT NULL GROUP BY f.fileHash HAVING COUNT(f) > 1")
  List<Object[]> findDuplicateFiles(@Param("status") Integer status);

  /** 根据哈希值查找所有文件 */
  List<FileUpload> findByFileHashAndStatusOrderByCreatedAtAsc(String fileHash, Integer status);

  /** 查找指定时间范围内上传的文件 */
  Page<FileUpload> findByCreatedAtBetweenAndStatus(
      LocalDateTime startTime, LocalDateTime endTime, Integer status, Pageable pageable);

  /** 查找用户在指定时间范围内上传的文件 */
  Page<FileUpload> findByUploaderIdAndCreatedAtBetweenAndStatus(
      Long uploaderId,
      LocalDateTime startTime,
      LocalDateTime endTime,
      Integer status,
      Pageable pageable);
}
