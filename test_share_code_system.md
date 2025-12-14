# Base58 + Snowflake ID 分享码系统测试指南

## 测试环境准备

### 1. 数据库迁移
```bash
# 执行数据库迁移脚本
mysql -u root -p educhain_db < db/migration_add_share_code.sql
```

### 2. 启动后端服务
```bash
# 启动Spring Boot应用
./mvnw spring-boot:run
```

### 3. 启动前端服务
```bash
# 启动React开发服务器
cd frontend
npm run dev
```

## 功能测试清单

### ✅ 后端API测试

#### 1. 创建知识内容（自动生成分享码）
```bash
curl -X POST http://localhost:8080/api/knowledge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "测试知识内容",
    "content": "这是一个测试内容",
    "type": "TEXT",
    "categoryId": 1,
    "tags": "测试,分享码"
  }'
```

**预期结果**: 返回的数据包含 `shareCode` 字段，格式为 `EK` + Base58编码

#### 2. 通过分享码获取知识详情
```bash
curl -X GET http://localhost:8080/api/knowledge/share/EK2VfUX \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**预期结果**: 成功返回知识详情

#### 3. 通过ID获取知识详情（兼容性测试）
```bash
curl -X GET http://localhost:8080/api/knowledge/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**预期结果**: 成功返回知识详情，包含 `shareCode` 字段

### ✅ 前端功能测试

#### 1. 知识列表页面
- 访问: `http://localhost:3000/knowledge`
- 点击知识卡片标题
- **预期**: URL变为 `http://localhost:3000/knowledge/EK2VfUX` 格式

#### 2. 知识详情页面
- 直接访问: `http://localhost:3000/knowledge/EK2VfUX`
- **预期**: 正常显示知识详情

#### 3. 分享功能测试
- 在知识详情页面点击分享按钮
- **预期**: 复制的链接格式为 `http://localhost:3000/knowledge/EK2VfUX`

#### 4. 编辑功能测试
- 在知识详情页面点击编辑按钮
- **预期**: 跳转到编辑页面，URL使用分享码

### ✅ Mock模式测试

#### 1. 启用Mock模式
```bash
cd frontend
npm run dev
# 确保 .env.development 中设置了 VITE_USE_MOCK=true
```

#### 2. 测试Mock数据
- 访问: `http://localhost:3000/knowledge`
- 点击任意知识卡片
- **预期**: URL使用Mock生成的分享码格式

### ✅ 分享码格式验证

#### 1. 有效分享码格式
- `EK2VfUX` - 正常格式
- `EKaBc3dEf` - 较长格式
- `EK123` - 较短格式

#### 2. 无效分享码格式
- `EK` - 缺少编码部分
- `AB2VfUX` - 错误前缀
- `EK0OIl` - 包含易混淆字符
- `EK@#$` - 包含特殊字符

**测试方法**: 直接访问 `http://localhost:3000/knowledge/[分享码]`

**预期结果**: 
- 有效格式：正常显示内容
- 无效格式：跳转到404页面或显示错误信息

## 性能测试

### 1. 分享码生成性能
```java
// 在后端添加性能测试代码
@Test
public void testShareCodeGenerationPerformance() {
    long startTime = System.currentTimeMillis();
    for (int i = 0; i < 10000; i++) {
        shareCodeService.generateShareCode();
    }
    long endTime = System.currentTimeMillis();
    System.out.println("生成10000个分享码耗时: " + (endTime - startTime) + "ms");
}
```

### 2. 分享码查询性能
```sql
-- 测试分享码索引性能
EXPLAIN SELECT * FROM knowledge_items WHERE share_code = 'EK2VfUX';
```

**预期**: 使用索引查询，type为const或ref

## 兼容性测试

### 1. 旧链接兼容性
- 访问旧格式链接: `http://localhost:3000/knowledge/1`
- **预期**: 仍能正常访问（如果保留了兼容路由）

### 2. API兼容性
- 调用旧API: `GET /api/knowledge/1`
- **预期**: 返回数据包含新的 `shareCode` 字段

## 安全测试

### 1. 分享码猜测测试
- 尝试访问连续的分享码
- **预期**: 无法通过简单规律猜测到有效分享码

### 2. 分享码碰撞测试
```sql
-- 检查分享码唯一性
SELECT share_code, COUNT(*) 
FROM knowledge_items 
GROUP BY share_code 
HAVING COUNT(*) > 1;
```

**预期**: 无重复分享码

## 错误处理测试

### 1. 无效分享码处理
- 访问不存在的分享码
- **预期**: 返回404错误，前端显示友好错误页面

### 2. 分享码格式错误处理
- 访问格式错误的分享码
- **预期**: 前端验证失败，跳转到404页面

## 测试报告模板

```markdown
## 测试结果

### 后端测试
- [ ] 分享码生成功能
- [ ] 通过分享码查询功能
- [ ] API兼容性
- [ ] 数据库索引性能

### 前端测试
- [ ] 知识列表链接更新
- [ ] 知识详情页面访问
- [ ] 分享功能
- [ ] 编辑功能

### Mock测试
- [ ] Mock数据分享码
- [ ] Mock API接口

### 性能测试
- [ ] 分享码生成性能: ___ms/10000次
- [ ] 分享码查询性能: ___ms
- [ ] 数据库索引效果: ___

### 安全测试
- [ ] 分享码唯一性
- [ ] 分享码不可猜测性
- [ ] 错误处理完整性

### 发现的问题
1. 
2. 
3. 

### 建议改进
1. 
2. 
3. 
```

## 部署前检查清单

- [ ] 数据库迁移脚本已执行
- [ ] 后端分享码服务正常工作
- [ ] 前端路由更新完成
- [ ] Mock数据更新完成
- [ ] 所有测试用例通过
- [ ] 性能指标满足要求
- [ ] 错误处理机制完善
- [ ] 文档更新完成