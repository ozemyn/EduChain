package com.example.educhain.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.example.educhain.dto.SearchRequest;
import com.example.educhain.dto.SearchResultDTO;
import com.example.educhain.entity.SearchIndex;
import com.example.educhain.repository.*;
import com.example.educhain.service.impl.SearchServiceImpl;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/** 搜索服务测试类 */
@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

  @Mock private SearchIndexRepository searchIndexRepository;

  @Mock private HotKeywordRepository hotKeywordRepository;

  @Mock private KnowledgeItemRepository knowledgeItemRepository;

  @Mock private UserRepository userRepository;

  @Mock private CategoryRepository categoryRepository;

  @Mock private UserInteractionRepository userInteractionRepository;

  @Mock private CommentRepository commentRepository;

  @InjectMocks private SearchServiceImpl searchService;

  private SearchIndex testSearchIndex;
  private List<SearchIndex> testSearchIndexes;

  @BeforeEach
  void setUp() {
    testSearchIndex = new SearchIndex();
    testSearchIndex.setId(1L);
    testSearchIndex.setKnowledgeId(1L);
    testSearchIndex.setTitle("Java编程基础");
    testSearchIndex.setContentSummary("Java是一种面向对象的编程语言...");
    testSearchIndex.setTags("Java,编程,基础");
    testSearchIndex.setCategoryId(1L);
    testSearchIndex.setCategoryName("编程语言");
    testSearchIndex.setUploaderId(1L);
    testSearchIndex.setUploaderName("张三");
    testSearchIndex.setViewCount(100L);
    testSearchIndex.setLikeCount(20L);
    testSearchIndex.setFavoriteCount(15L);
    testSearchIndex.setCommentCount(5L);
    testSearchIndex.setQualityScore(85.5);
    testSearchIndex.setStatus(1);
    testSearchIndex.setCreatedAt(LocalDateTime.now());
    testSearchIndex.setUpdatedAt(LocalDateTime.now());

    testSearchIndexes = Arrays.asList(testSearchIndex);
  }

  @Test
  void testFullTextSearch() {
    // Given
    String keyword = "Java";
    int page = 0;
    int size = 20;
    Pageable pageable = PageRequest.of(page, size);
    Page<SearchIndex> mockPage = new PageImpl<>(testSearchIndexes, pageable, 1);

    when(searchIndexRepository.fullTextSearch(eq("java"), eq(1), any(Pageable.class)))
        .thenReturn(mockPage);

    // When
    Page<SearchResultDTO> result = searchService.fullTextSearch(keyword, page, size);

    // Then
    assertNotNull(result);
    assertEquals(1, result.getTotalElements());
    assertEquals(1, result.getContent().size());

    SearchResultDTO resultDTO = result.getContent().get(0);
    assertEquals(testSearchIndex.getKnowledgeId(), resultDTO.getId());
    assertEquals(testSearchIndex.getTitle(), resultDTO.getTitle());
    assertEquals(testSearchIndex.getContentSummary(), resultDTO.getContentSummary());
    assertEquals(testSearchIndex.getQualityScore(), resultDTO.getQualityScore());

    verify(searchIndexRepository).fullTextSearch(eq("java"), eq(1), any(Pageable.class));
  }

  @Test
  void testAdvancedSearch() {
    // Given
    SearchRequest request = new SearchRequest();
    request.setKeyword("Java");
    request.setCategoryId(1L);
    request.setPage(0);
    request.setSize(20);

    Pageable pageable = PageRequest.of(0, 20);
    Page<SearchIndex> mockPage = new PageImpl<>(testSearchIndexes, pageable, 1);

    when(searchIndexRepository.advancedSearch(
            eq(1L), isNull(), isNull(), eq("java"), eq(1), any(Pageable.class)))
        .thenReturn(mockPage);

    // When
    Page<SearchResultDTO> result = searchService.advancedSearch(request);

    // Then
    assertNotNull(result);
    assertEquals(1, result.getTotalElements());
    assertEquals(1, result.getContent().size());

    SearchResultDTO resultDTO = result.getContent().get(0);
    assertEquals(testSearchIndex.getKnowledgeId(), resultDTO.getId());
    assertEquals(testSearchIndex.getTitle(), resultDTO.getTitle());

    verify(searchIndexRepository)
        .advancedSearch(eq(1L), isNull(), isNull(), eq("java"), eq(1), any(Pageable.class));
  }

  @Test
  void testSearchWithEmptyKeyword() {
    // Given
    SearchRequest request = new SearchRequest();
    request.setKeyword("");
    request.setPage(0);
    request.setSize(20);

    // When
    Page<SearchResultDTO> result = searchService.search(request);

    // Then
    assertNotNull(result);
    assertEquals(0, result.getTotalElements());
    assertTrue(result.getContent().isEmpty());

    // 验证没有调用搜索方法
    verify(searchIndexRepository, never())
        .fullTextSearch(anyString(), anyInt(), any(Pageable.class));
    verify(searchIndexRepository, never()).fuzzySearch(anyString(), anyInt(), any(Pageable.class));
  }

  @Test
  void testSearchWithNullKeyword() {
    // Given
    SearchRequest request = new SearchRequest();
    request.setKeyword(null);
    request.setPage(0);
    request.setSize(20);

    // When
    Page<SearchResultDTO> result = searchService.search(request);

    // Then
    assertNotNull(result);
    assertEquals(0, result.getTotalElements());
    assertTrue(result.getContent().isEmpty());

    // 验证没有调用搜索方法
    verify(searchIndexRepository, never())
        .fullTextSearch(anyString(), anyInt(), any(Pageable.class));
    verify(searchIndexRepository, never()).fuzzySearch(anyString(), anyInt(), any(Pageable.class));
  }

  @Test
  void testGetSuggestions() {
    // Given
    String prefix = "Ja";
    int limit = 10;

    // When
    List<String> result = searchService.getSuggestions(prefix, limit);

    // Then
    assertNotNull(result);
    // 由于我们没有mock HotKeywordRepository，结果应该是空的
    assertTrue(result.isEmpty());
  }

  @Test
  void testGetSuggestionsWithShortPrefix() {
    // Given
    String prefix = "J"; // 长度小于2
    int limit = 10;

    // When
    List<String> result = searchService.getSuggestions(prefix, limit);

    // Then
    assertNotNull(result);
    assertTrue(result.isEmpty());
  }

  @Test
  void testRecordSearch() {
    // Given
    String keyword = "Java编程";
    Long resultCount = 10L;
    Long categoryId = 1L;

    // When & Then - 应该不抛出异常
    assertDoesNotThrow(
        () -> {
          searchService.recordSearch(keyword, resultCount, categoryId);
        });
  }

  @Test
  void testRecordSearchWithEmptyKeyword() {
    // Given
    String keyword = "";
    Long resultCount = 0L;
    Long categoryId = null;

    // When & Then - 应该不抛出异常
    assertDoesNotThrow(
        () -> {
          searchService.recordSearch(keyword, resultCount, categoryId);
        });
  }

  @Test
  void testRecordKeywordClick() {
    // Given
    String keyword = "Java";

    // When & Then - 应该不抛出异常
    assertDoesNotThrow(
        () -> {
          searchService.recordKeywordClick(keyword);
        });
  }

  @Test
  void testGetSearchStatistics() {
    // When
    SearchService.SearchStatisticsDTO result = searchService.getSearchStatistics();

    // Then
    assertNotNull(result);
    // 由于没有实际数据，统计应该都是0或默认值
    assertNotNull(result.getTotalSearches());
    assertNotNull(result.getTotalKeywords());
    assertNotNull(result.getAverageResultCount());
  }
}
