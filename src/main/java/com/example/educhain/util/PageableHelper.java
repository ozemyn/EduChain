package com.example.educhain.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

/**
 * 分页工具类
 * 用于验证和创建Pageable对象，防止内存溢出
 */
@Component
public class PageableHelper {

    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MIN_PAGE_SIZE = 1;

    /**
     * 验证并创建Pageable对象
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @return 验证后的Pageable对象
     */
    public Pageable validateAndCreate(int page, int size) {
        // 页码不能小于0
        if (page < 0) {
            page = 0;
        }
        
        // 每页大小必须在合理范围内
        if (size <= 0) {
            size = DEFAULT_PAGE_SIZE;
        } else if (size > MAX_PAGE_SIZE) {
            size = MAX_PAGE_SIZE;
        }
        
        return PageRequest.of(page, size);
    }

    /**
     * 验证并创建带排序的Pageable对象
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @param sortBy 排序字段
     * @param sortDir 排序方向（asc/desc）
     * @return 验证后的Pageable对象
     */
    public Pageable validateAndCreate(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = validateAndCreate(page, size);
        
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
            Sort sort = Sort.by(direction, sortBy);
            return PageRequest.of(page, size, sort);
        }
        
        return pageable;
    }

    /**
     * 获取默认分页大小
     */
    public int getDefaultPageSize() {
        return DEFAULT_PAGE_SIZE;
    }

    /**
     * 获取最大分页大小
     */
    public int getMaxPageSize() {
        return MAX_PAGE_SIZE;
    }
}

