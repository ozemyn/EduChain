/* ===================================
   分类管理页面 - Category Management Page
   ===================================
   
   完整功能的分类管理系统
   使用统一服务层，支持环境切换
   
   ================================== */

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Tree,
  Row,
  Col,
  Typography,
  InputNumber,
  Card,
  Statistic,
} from 'antd';
import {
  FolderOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  SortAscendingOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import dayjs from 'dayjs';
import { adminService } from '@/services/admin';
import type { Category, CategoryDetail } from '@/types/api';
import './CategoryManagement.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * 分类管理页面组件
 */
const CategoryManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [parentFilter, setParentFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetail | null>(null);
  const [categoryDetailVisible, setCategoryDetailVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [treeModalVisible, setTreeModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [form] = Form.useForm();

  // 加载分类列表
  const loadCategories = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1, // 后端从0开始
        size: pageSize,
        search: searchKeyword || undefined,
        parentId: parentFilter
          ? parentFilter === 'root'
            ? undefined
            : Number(parentFilter)
          : undefined,
      };

      const response = await adminService.getAdminCategories(params);
      if (response.success && response.data) {
        setCategories(response.data.content || []);
        setTotal(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error('加载分类列表失败');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, parentFilter]);

  // 加载分类树
  const loadCategoryTree = async () => {
    try {
      const response = await adminService.getCategoryTree();
      if (response.success && response.data) {
        setCategoryTree(response.data);
      }
    } catch (error) {
      console.error('Failed to load category tree:', error);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadCategories();
    loadCategoryTree();
  }, [currentPage, pageSize, searchKeyword, parentFilter, loadCategories]);

  // 查看分类详情
  const handleViewCategory = async (category: Category) => {
    setSelectedCategory(category);
    setCategoryDetailVisible(true);

    try {
      const response = await adminService.getCategoryDetail(category.id);
      if (response.success && response.data) {
        setSelectedCategory(response.data);
      }
    } catch (error) {
      console.error('Failed to load category detail:', error);
    }
  };

  // 编辑分类
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      sortOrder: category.sortOrder,
    });
    setEditModalVisible(true);
  };

  // 保存分类编辑
  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();

      let response;
      if (selectedCategory) {
        // 更新分类
        response = await adminService.updateCategory(
          selectedCategory.id,
          values
        );
      } else {
        // 创建分类
        response = await adminService.createCategory(values);
      }

      if (response.success) {
        message.success(selectedCategory ? '分类更新成功' : '分类创建成功');
        setEditModalVisible(false);
        loadCategories();
        loadCategoryTree();
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      message.error('保存失败');
    }
  };

  // 删除分类
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await adminService.deleteCategory(categoryId);
      if (response.success) {
        message.success('分类删除成功');
        loadCategories();
        loadCategoryTree();
      }
    } catch (error: unknown) {
      console.error('Failed to delete category:', error);
      const errorMessage = error instanceof Error ? error.message : '删除失败';
      message.error(errorMessage);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的分类');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个分类吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const categoryIds = selectedRowKeys.map(key => Number(key));
          const response =
            await adminService.batchDeleteCategories(categoryIds);

          if (response.success) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            loadCategories();
            loadCategoryTree();
          }
        } catch (error: unknown) {
          console.error('Failed to batch delete:', error);
          const errorMessage =
            error instanceof Error ? error.message : '批量删除失败';
          message.error(errorMessage);
        }
      },
    });
  };

  // 移动分类
  const handleMoveCategory = (categoryId: number, targetParentId?: number) => {
    Modal.confirm({
      title: '移动分类确认',
      content: '确定要移动这个分类吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await adminService.moveCategory(
            categoryId,
            targetParentId
          );
          if (response.success) {
            message.success('分类移动成功');
            loadCategories();
            loadCategoryTree();
          }
        } catch (error: unknown) {
          console.error('Failed to move category:', error);
          const errorMessage =
            error instanceof Error ? error.message : '移动失败';
          message.error(errorMessage);
        }
      },
    });
  };

  // 构建树形数据
  const buildTreeData = (categories: Category[]): DataNode[] => {
    return categories.map(category => ({
      key: category.id,
      title: (
        <Space>
          <FolderOutlined />
          <span>{category.name}</span>
          <Tag color="blue">{category.knowledgeCount || 0}</Tag>
        </Space>
      ),
      children: category.children
        ? buildTreeData(category.children)
        : undefined,
    }));
  };

  // 获取父分类选项
  const getParentOptions = (categories: Category[], excludeId?: number) => {
    const options: Array<{ value: number | undefined; label: string }> = [
      { value: undefined, label: '无父分类（根分类）' },
    ];

    const addOptions = (cats: Category[], level = 0) => {
      cats.forEach(cat => {
        if (cat.id !== excludeId) {
          options.push({
            value: cat.id,
            label: '　'.repeat(level) + cat.name,
          });
          if (cat.children) {
            addOptions(cat.children, level + 1);
          }
        }
      });
    };

    addOptions(categories);
    return options;
  };

  // 表格列定义
  const columns: ColumnsType<Category> = [
    {
      title: '分类名称',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (_, category) => (
        <Space>
          <FolderOutlined style={{ color: 'var(--primary-600)' }} />
          <span className="category-name">{category.name}</span>
          {!category.parentId && <Tag color="gold">根分类</Tag>}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: description => description || '-',
    },
    {
      title: '父分类',
      key: 'parent',
      width: 150,
      render: (_, category) => {
        if (!category.parentId) return <Tag color="gold">根分类</Tag>;
        const parent = categories.find(c => c.id === category.parentId);
        return parent ? (
          <Tag color="blue">{parent.name}</Tag>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      render: sortOrder => <Tag color="green">{sortOrder}</Tag>,
    },
    {
      title: '知识数量',
      dataIndex: 'knowledgeCount',
      key: 'knowledgeCount',
      width: 120,
      render: count => (
        <Space>
          <FileTextOutlined />
          {count || 0}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render: (_, category) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewCategory(category)}
            className="hover-scale"
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(category)}
            className="hover-scale"
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SortAscendingOutlined />}
            onClick={() => handleMoveCategory(category.id)}
            className="hover-scale"
          >
            移动
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗？"
            description="删除后该分类下的内容将移动到未分类"
            onConfirm={() => handleDeleteCategory(category.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover-scale"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="category-management-page animate-fade-in">
      <div className="management-content container">
        {/* 页面头部 */}
        <header className="management-header glass-light animate-fade-in-up">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title gradient-text">
                <BranchesOutlined />
                分类管理
              </h1>
              <p className="page-subtitle">管理知识分类，组织内容结构</p>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <div className="management-main glass-card animate-fade-in-up delay-100">
          {/* 搜索和筛选 */}
          <div className="filter-section">
            <Row gutter={[16, 16]} align="middle">
              <Col flex="auto">
                <Space wrap size="middle">
                  <Search
                    placeholder="搜索分类名称或描述"
                    allowClear
                    style={{ width: 300 }}
                    onSearch={setSearchKeyword}
                    prefix={<SearchOutlined />}
                    className="search-input"
                  />
                  <Select
                    placeholder="选择父分类"
                    allowClear
                    style={{ width: 200 }}
                    value={parentFilter}
                    onChange={setParentFilter}
                    suffixIcon={<FilterOutlined />}
                  >
                    <Option value="root">根分类</Option>
                    {categoryTree.map(cat => (
                      <Option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button
                    type={viewMode === 'table' ? 'primary' : 'default'}
                    onClick={() => setViewMode('table')}
                    className="glass-button hover-scale"
                  >
                    表格视图
                  </Button>
                  <Button
                    type={viewMode === 'tree' ? 'primary' : 'default'}
                    onClick={() => setViewMode('tree')}
                    className="glass-button hover-scale"
                  >
                    树形视图
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {/* 操作按钮 */}
          <div className="action-section">
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  form.resetFields();
                  setSelectedCategory(null);
                  setEditModalVisible(true);
                }}
                className="glass-button glass-strong hover-lift active-scale"
              >
                新增分类
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
                className="glass-button hover-scale active-scale"
              >
                批量删除{' '}
                {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
              <Button
                icon={<FolderOpenOutlined />}
                onClick={() => setTreeModalVisible(true)}
                className="glass-button hover-scale active-scale"
              >
                分类树预览
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadCategories();
                  loadCategoryTree();
                }}
                className="glass-button hover-scale active-scale"
              >
                刷新
              </Button>
            </Space>
          </div>

          {/* 内容区域 */}
          {viewMode === 'table' ? (
            <div className="table-section">
              <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                rowSelection={rowSelection}
                scroll={{ x: 1200 }}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size || 10);
                  },
                }}
                className="category-table"
              />
            </div>
          ) : (
            <div className="tree-section">
              <Card className="tree-card glass-light">
                <Tree
                  treeData={buildTreeData(categoryTree)}
                  defaultExpandAll
                  showLine
                  showIcon
                  className="category-tree"
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* 分类详情抽屉 */}
      <Drawer
        title={
          <Space>
            <FolderOutlined />
            <span>分类详情</span>
          </Space>
        }
        placement="right"
        width={600}
        open={categoryDetailVisible}
        onClose={() => setCategoryDetailVisible(false)}
        className="category-detail-drawer"
      >
        {selectedCategory && (
          <div className="category-detail-content">
            <Descriptions column={1} bordered className="category-descriptions">
              <Descriptions.Item label="分类名称">
                {selectedCategory.name}
              </Descriptions.Item>
              <Descriptions.Item label="描述">
                {selectedCategory.description || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="父分类">
                {selectedCategory.parentId ? (
                  <Tag color="blue">
                    {categories.find(c => c.id === selectedCategory.parentId)
                      ?.name || '未知'}
                  </Tag>
                ) : (
                  <Tag color="gold">根分类</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="排序">
                {selectedCategory.sortOrder}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(selectedCategory.createdAt).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </Descriptions.Item>
            </Descriptions>

            <div className="category-stats">
              <Title level={4}>统计信息</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="stat-item glass-light">
                    <Statistic
                      title="直接知识数量"
                      value={selectedCategory.knowledgeCount || 0}
                      prefix={<FileTextOutlined />}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item glass-light">
                    <Statistic
                      title="总知识数量"
                      value={
                        selectedCategory.totalKnowledgeCount ||
                        selectedCategory.knowledgeCount ||
                        0
                      }
                      prefix={<FileTextOutlined />}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item glass-light">
                    <Statistic
                      title="子分类数量"
                      value={selectedCategory.children?.length || 0}
                      prefix={<FolderOutlined />}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {selectedCategory.children &&
              selectedCategory.children.length > 0 && (
                <div className="subcategories">
                  <Title level={4}>子分类</Title>
                  <div className="subcategory-list">
                    {selectedCategory.children.map((child: CategoryDetail) => (
                      <Tag
                        key={child.id}
                        color="blue"
                        className="subcategory-tag"
                      >
                        {child.name} ({child.knowledgeCount || 0})
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Drawer>

      {/* 编辑分类模态框 */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>{selectedCategory ? '编辑分类' : '新增分类'}</span>
          </Space>
        }
        open={editModalVisible}
        onOk={handleSaveCategory}
        onCancel={() => setEditModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
        className="edit-category-modal"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            sortOrder: 1,
          }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { min: 2, max: 50, message: '分类名称长度为2-50个字符' },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item name="description" label="分类描述">
            <TextArea
              rows={3}
              placeholder="请输入分类描述"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item name="parentId" label="父分类">
            <Select
              placeholder="请选择父分类（不选择则为根分类）"
              allowClear
              options={getParentOptions(categoryTree, selectedCategory?.id)}
            />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="排序"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <InputNumber
              min={1}
              max={9999}
              placeholder="请输入排序值"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分类树预览模态框 */}
      <Modal
        title={
          <Space>
            <BranchesOutlined />
            <span>分类树结构</span>
          </Space>
        }
        open={treeModalVisible}
        onCancel={() => setTreeModalVisible(false)}
        footer={null}
        width={800}
        className="tree-preview-modal"
      >
        <Tree
          treeData={buildTreeData(categoryTree)}
          defaultExpandAll
          showLine
          showIcon
          className="category-tree-preview"
        />
      </Modal>
    </div>
  );
};

export default CategoryManagement;
