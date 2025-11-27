package com.example.educhain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 知识内容版本历史实体类
 */
@Entity
@Table(name = "knowledge_versions", indexes = {
    @Index(name = "idx_knowledge_id", columnList = "knowledge_id"),
    @Index(name = "idx_version_number", columnList = "version_number"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_editor_id", columnList = "editor_id")
})
@EntityListeners(AuditingEntityListener.class)
public class KnowledgeVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "knowledge_id", nullable = false)
    private Long knowledgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knowledge_id", insertable = false, updatable = false)
    @JsonIgnore
    private KnowledgeItem knowledgeItem;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(nullable = false, length = 200)
    @NotBlank(message = "标题不能为空")
    @Size(min = 1, max = 200, message = "标题长度必须在1-200个字符之间")
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private KnowledgeItem.ContentType type;

    @Column(name = "media_urls", columnDefinition = "JSON")
    private String mediaUrlsJson;

    @Transient
    private List<String> mediaUrls = new ArrayList<>();

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(length = 500)
    private String tags;

    @Column(name = "editor_id", nullable = false)
    private Long editorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "editor_id", insertable = false, updatable = false)
    @JsonIgnore
    private User editor;

    @Column(name = "change_summary", length = 500)
    private String changeSummary;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_type", nullable = false, length = 20)
    private ChangeType changeType = ChangeType.UPDATE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 变更类型枚举
    public enum ChangeType {
        CREATE("创建"),
        UPDATE("更新"),
        DELETE("删除"),
        RESTORE("恢复");

        private final String description;

        ChangeType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 默认构造函数
    public KnowledgeVersion() {}

    // 构造函数
    public KnowledgeVersion(Long knowledgeId, Integer versionNumber, String title, String content, 
                           KnowledgeItem.ContentType type, Long editorId, ChangeType changeType) {
        this.knowledgeId = knowledgeId;
        this.versionNumber = versionNumber;
        this.title = title;
        this.content = content;
        this.type = type;
        this.editorId = editorId;
        this.changeType = changeType;
    }

    // 从KnowledgeItem创建版本
    public static KnowledgeVersion fromKnowledgeItem(KnowledgeItem item, Integer versionNumber, 
                                                    Long editorId, ChangeType changeType, String changeSummary) {
        KnowledgeVersion version = new KnowledgeVersion();
        version.setKnowledgeId(item.getId());
        version.setVersionNumber(versionNumber);
        version.setTitle(item.getTitle());
        version.setContent(item.getContent());
        version.setType(item.getType());
        version.setMediaUrls(new ArrayList<>(item.getMediaUrls()));
        version.setLinkUrl(item.getLinkUrl());
        version.setTags(item.getTags());
        version.setEditorId(editorId);
        version.setChangeType(changeType);
        version.setChangeSummary(changeSummary);
        return version;
    }

    // JSON 处理方法
    @PostLoad
    @PostPersist
    @PostUpdate
    private void deserializeMediaUrls() {
        if (mediaUrlsJson != null && !mediaUrlsJson.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.mediaUrls = mapper.readValue(mediaUrlsJson, new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                this.mediaUrls = new ArrayList<>();
            }
        } else {
            this.mediaUrls = new ArrayList<>();
        }
    }

    @PrePersist
    @PreUpdate
    private void serializeMediaUrls() {
        if (mediaUrls != null && !mediaUrls.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.mediaUrlsJson = mapper.writeValueAsString(mediaUrls);
            } catch (JsonProcessingException e) {
                this.mediaUrlsJson = "[]";
            }
        } else {
            this.mediaUrlsJson = "[]";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getKnowledgeId() {
        return knowledgeId;
    }

    public void setKnowledgeId(Long knowledgeId) {
        this.knowledgeId = knowledgeId;
    }

    public KnowledgeItem getKnowledgeItem() {
        return knowledgeItem;
    }

    public void setKnowledgeItem(KnowledgeItem knowledgeItem) {
        this.knowledgeItem = knowledgeItem;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public KnowledgeItem.ContentType getType() {
        return type;
    }

    public void setType(KnowledgeItem.ContentType type) {
        this.type = type;
    }

    public String getMediaUrlsJson() {
        return mediaUrlsJson;
    }

    public void setMediaUrlsJson(String mediaUrlsJson) {
        this.mediaUrlsJson = mediaUrlsJson;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Long getEditorId() {
        return editorId;
    }

    public void setEditorId(Long editorId) {
        this.editorId = editorId;
    }

    public User getEditor() {
        return editor;
    }

    public void setEditor(User editor) {
        this.editor = editor;
    }

    public String getChangeSummary() {
        return changeSummary;
    }

    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
    }

    public ChangeType getChangeType() {
        return changeType;
    }

    public void setChangeType(ChangeType changeType) {
        this.changeType = changeType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // 便利方法
    public String getContentSnapshot() {
        return this.content;
    }

    @Override
    public String toString() {
        return "KnowledgeVersion{" +
                "id=" + id +
                ", knowledgeId=" + knowledgeId +
                ", versionNumber=" + versionNumber +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", editorId=" + editorId +
                ", changeType=" + changeType +
                ", createdAt=" + createdAt +
                '}';
    }
}