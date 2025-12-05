/**
 * 知识库数据统一导出
 */

import { reactHooksKnowledge } from './react-hooks';
import { typescriptGuideKnowledge } from './typescript-guide';
import { vue3CompositionKnowledge } from './vue3-composition';
import { dockerBasicsKnowledge } from './docker-basics';
import { springBootKnowledge } from './spring-boot';
import { mysqlOptimizationKnowledge } from './mysql-optimization';
import { redisCacheKnowledge } from './redis-cache';
import { pythonBasicsKnowledge } from './python-basics';
import { gitWorkflowKnowledge } from './git-workflow';
import { algorithmBasicsKnowledge } from './algorithm-basics';
import { cssFlexboxKnowledge } from './css-flexbox';
import { nodejsExpressKnowledge } from './nodejs-express';
import { webpackConfigKnowledge } from './webpack-config';
import { restfulApiKnowledge } from './restful-api';
import { mongodbGuideKnowledge } from './mongodb-guide';

export const cleanKnowledgeItems = [
  reactHooksKnowledge,
  typescriptGuideKnowledge,
  vue3CompositionKnowledge,
  dockerBasicsKnowledge,
  springBootKnowledge,
  mysqlOptimizationKnowledge,
  redisCacheKnowledge,
  pythonBasicsKnowledge,
  gitWorkflowKnowledge,
  algorithmBasicsKnowledge,
  cssFlexboxKnowledge,
  nodejsExpressKnowledge,
  webpackConfigKnowledge,
  restfulApiKnowledge,
  mongodbGuideKnowledge,
];

export * from './react-hooks';
export * from './typescript-guide';
export * from './vue3-composition';
export * from './docker-basics';
export * from './spring-boot';
export * from './mysql-optimization';
export * from './redis-cache';
export * from './python-basics';
export * from './git-workflow';
export * from './algorithm-basics';
export * from './css-flexbox';
export * from './nodejs-express';
export * from './webpack-config';
export * from './restful-api';
export * from './mongodb-guide';
