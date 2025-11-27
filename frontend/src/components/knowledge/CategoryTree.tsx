import React, { useState, useEffect } from 'react';
import { Tree, Card, Space, Typography, Button, Input, Modal, Form, message, Tooltip } from 'antd';
import {
  FolderOutlined,

  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import type { Category } from '@/types';

const { Text, Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

interface CategoryTreeProps {
  categories?: Category[];
  onCategorySelect?: (categoryId: number | null, category: Category | null) => void;
  onCategoryCreate?: (parentId: number | null, categoryData: { name: string; description?: string }) => Promise<void>;
  onCategoryUpdate?: (categoryId: number, categoryData: { name?: string; description?: string }) => Promise<void>;
  onCategoryDelete?: (categoryId: number) => Promise<void>;
  selectedCategoryId?: number | null;
  showActions?: boolean;
  showSearch?: boolean;
  showStats?: boolean;
}

interface CategoryFormData {
  name: string;
  description?: string;
  sortOrder?: number;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories = [],
  onCategorySelect,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  selectedCategoryId,
  showActions = false,
  showSearch = true,
  showStats = true,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [form] = Form.useForm<CategoryFormData>();

  // 转换为Tree组件需要的数据格式
  const convertToTreeData = (categories: Category[]): DataNode[] => {
    return categories.map(category => ({
      title: renderTreeNode(category),
      key: category.id,
      icon: <FolderOutlined />,
      children: category.children ? convertToTreeData(category.children) : undefined,
    }));
  };

  // 渲染树节点
  const renderTreeNode = (category: Category) => {
    const isSelected = selectedCategoryId === category.id;
    
    return (
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          padding: '2px 0',
        }}
      >
        <Space>
          <Text 
            strong={isSelected}
            style={{ 
              color: isSelected ? '#1890ff' : undefined,
              fontSize: 14,
            }}
          >
            {category.name}
          </Text>
          {showStats && category.knowledgeCount !== undefined && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({category.knowledgeCount})
            </Text>
          )}
        </Space>
        
        {showActions && (
          <Space size="small" onClick={(e) => e.stopPropagation()}>
            <Tooltip title="添加子分类">
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => handleCreateCategory(category)}
              />
            </Tooltip>
            <Tooltip title="编辑分类">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditCategory(category)}
              />
            </Tooltip>
            <Tooltip title="删除分类">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteCategory(category)}
              />
            </Tooltip>
          </Space>
        )}
      </div>
    );
  };

  // 搜索过滤
  const filterCategories = (categories: Category[], searchValue: string): Category[] => {
    if (!searchValue) return categories;
    
    return categories.reduce<Category[]>((filtered, category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           (category.description && category.description.toLowerCase().includes(searchValue.toLowerCase()));
      
      const filteredChildren = category.children ? filterCategories(category.children, searchValue) : [];
      
      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...category,
          children: filteredChildren.length > 0 ? filteredChildren : category.children,
        });
      }
      
      return filtered;
    }, []);
  };

  // 获取所有匹配的节点key
  const getMatchedKeys = (categories: Category[], searchValue: string): React.Key[] => {
    const keys: React.Key[] = [];
    
    const traverse = (cats: Category[]) => {
      cats.forEach(category => {
        const matches = category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                       (category.description && category.description.toLowerCase().includes(searchValue.toLowerCase()));
        
        if (matches) {
          keys.push(category.id);
        }
        
        if (category.children) {
          traverse(category.children);
        }
      });
    };
    
    traverse(categories);
    return keys;
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    if (value) {
      const filtered = filterCategories(categories, value);
      setFilteredCategories(filtered);
      
      // 展开所有匹配的节点
      const matchedKeys = getMatchedKeys(categories, value);
      setExpandedKeys(matchedKeys);
    } else {
      setFilteredCategories(categories);
      setExpandedKeys([]);
    }
  };

  // 处理节点选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    const categoryId = selectedKeys[0] as number;
    const category = findCategoryById(categories, categoryId);
    onCategorySelect?.(categoryId || null, category);
  };

  // 查找分类
  const findCategoryById = (categories: Category[], id: number): Category | null => {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // 处理创建分类
  const handleCreateCategory = (parent?: Category) => {
    setModalType('create');
    setParentCategory(parent || null);
    setCurrentCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑分类
  const handleEditCategory = (category: Category) => {
    setModalType('edit');
    setCurrentCategory(category);
    setParentCategory(null);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      sortOrder: category.sortOrder,
    });
    setModalVisible(true);
  };

  // 处理删除分类
  const handleDeleteCategory = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasContent = category.knowledgeCount && category.knowledgeCount > 0;
    
    let content = `确定要删除分类"${category.name}"吗？`;
    if (hasChildren) {
      content += '\n\n注意：删除后其子分类也将被删除。';
    }
    if (hasContent) {
      content += `\n\n该分类下有 ${category.knowledgeCount} 个内容，删除后这些内容将变为未分类状态。`;
    }
    
    confirm({
      title: '确认删除分类',
      icon: <ExclamationCircleOutlined />,
      content,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await onCategoryDelete?.(category.id);
          message.success('分类删除成功');
        } catch (error) {
          console.error('Delete category failed:', error);
          message.error('删除分类失败');
        }
      },
    });
  };

  // 处理表单提交
  const handleFormSubmit = async (values: CategoryFormData) => {
    try {
      if (modalType === 'create') {
        await onCategoryCreate?.(parentCategory?.id || null, values);
        message.success('分类创建成功');
      } else {
        await onCategoryUpdate?.(currentCategory!.id, values);
        message.success('分类更新成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Category operation failed:', error);
      message.error(modalType === 'create' ? '创建分类失败' : '更新分类失败');
    }
  };

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const treeData = convertToTreeData(filteredCategories);

  return (
    <Card 
      title={
        <Space>
          <Title level={5} style={{ margin: 0 }}>分类管理</Title>
          {showActions && (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleCreateCategory()}
            >
              新建分类
            </Button>
          )}
        </Space>
      }
      size="small"
    >
      {showSearch && (
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索分类..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>
      )}

      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
        onExpand={setExpandedKeys}
        onSelect={handleSelect}
        showIcon
        blockNode
        style={{ fontSize: 14 }}
      />

      {/* 分类编辑弹窗 */}
      <Modal
        title={modalType === 'create' ? '创建分类' : '编辑分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          {modalType === 'create' && parentCategory && (
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <Text type="secondary">
                将在 <Text strong>"{parentCategory.name}"</Text> 下创建子分类
              </Text>
            </div>
          )}
          
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '分类名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
            rules={[
              { max: 200, message: '分类描述不能超过200个字符' },
            ]}
          >
            <Input.TextArea 
              placeholder="请输入分类描述（可选）" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="排序顺序"
            rules={[
              { type: 'number', min: 0, max: 999, message: '排序顺序必须在0-999之间' },
            ]}
          >
            <Input 
              type="number" 
              placeholder="数字越小排序越靠前（可选）"
              min={0}
              max={999}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryTree;