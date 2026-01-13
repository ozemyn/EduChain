/**
 * Docker 集装箱化部署完整教程
 */

import { generateMockShareCode } from '../../utils/shareCodeGenerator';

export const dockerBasicsKnowledge = {
  id: 4,
  shareCode: generateMockShareCode(4),
  title: 'Docker 集装箱化部署完整教程',
  content: `Docker 是一个开源的应用容器引擎，让开发者可以打包应用及依赖到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 机器上。

核心概念：

1. 镜像（Image）
Docker 镜像是一个只读的模板，包含了运行应用所需的所有内容：代码、运行时、库、环境变量和配置文件。

2. 容器（Container）
容器是镜像的运行实例，可以被启动、停止、删除。每个容器都是相互隔离的、安全的平台。

3. 仓库（Repository）
Docker 仓库用来保存镜像，可以理解为代码仓库。Docker Hub 是最大的公共仓库。

常用命令：

镜像操作：
• docker pull - 拉取镜像
• docker images - 查看本地镜像
• docker rmi - 删除镜像
• docker build - 构建镜像

容器操作：
• docker run - 运行容器
• docker ps - 查看运行中的容器
• docker stop - 停止容器
• docker start - 启动容器
• docker rm - 删除容器
• docker exec - 在容器中执行命令

Dockerfile 编写：
Dockerfile 是用来构建镜像的文本文件，包含了一系列指令。

常用指令：
• FROM - 指定基础镜像
• RUN - 执行命令
• COPY - 复制文件
• WORKDIR - 设置工作目录
• EXPOSE - 声明端口
• CMD - 容器启动命令

最佳实践：
• 使用官方基础镜像
• 合并 RUN 指令减少层数
• 使用 .dockerignore 排除不需要的文件
• 多阶段构建减小镜像体积
• 不要在容器中存储数据
• 使用环境变量配置应用`,
  type: 'TEXT',
  uploaderId: 1,
  uploaderName: '张三',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
  categoryId: 22,
  categoryName: 'Node.js',
  tags: 'Docker,容器化,DevOps,部署',
  status: 1,
  createdAt: '2025-12-05T16:20:00Z',
  updatedAt: '2025-12-18T11:10:00Z',
  contentHash: 'hash_docker_deployment',
};
