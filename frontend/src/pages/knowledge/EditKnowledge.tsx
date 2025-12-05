/* ===================================
   编辑知识页面组件 - Edit Knowledge Page Component
   ===================================
   
   说明：
   - 复用 CreateKnowledge 组件
   - 通过 URL 参数中的 id 区分创建和编辑模式
   
   ================================== */

import CreateKnowledge from './CreateKnowledge';

// EditKnowledge 使用相同的 CreateKnowledge 组件
// 通过 URL 参数中的 id 来区分是创建还是编辑模式
const EditKnowledge = CreateKnowledge;

export default EditKnowledge;
