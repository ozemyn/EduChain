/**
 * Python 编程基础教程
 */

import { generateMockShareCode } from '../../utils/shareCode';

export const pythonBasicsKnowledge = {
  id: 8,
  shareCode: generateMockShareCode(8),
  title: 'Python 编程基础教程 - 从零开始学Python',
  content: `# Python 编程基础教程 - 从零开始学Python

## 🐍 引言

Python 是一种简单易学、功能强大的编程语言，广泛应用于 Web 开发、数据分析、人工智能、自动化脚本等领域。它的语法简洁优雅，是初学者的最佳选择。

### Python 的优势

✅ **简单易学** - 语法简洁，接近自然语言
✅ **功能强大** - 丰富的标准库和第三方库
✅ **跨平台** - 支持 Windows、Linux、macOS
✅ **应用广泛** - Web、数据科学、AI、自动化
✅ **社区活跃** - 大量学习资源和开源项目

---

## 📚 基础语法

### 1. 变量和数据类型

\`\`\`python
# 数字类型
integer_num = 42
float_num = 3.14
complex_num = 1 + 2j

# 字符串
name = "Python"
message = 'Hello, World!'
multi_line = """
This is a
multi-line string
"""

# 布尔类型
is_active = True
is_deleted = False

# 列表（可变）
fruits = ['apple', 'banana', 'orange']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'two', 3.0, True]

# 元组（不可变）
coordinates = (10, 20)
rgb = (255, 0, 0)

# 字典
user = {
    'name': 'John',
    'age': 30,
    'email': 'john@example.com'
}

# 集合
tags = {'python', 'programming', 'tutorial'}
\`\`\`

### 2. 控制流

\`\`\`python
# if-elif-else
age = 18
if age < 18:
    print("未成年")
elif age < 60:
    print("成年人")
else:
    print("老年人")

# for 循环
for i in range(5):
    print(i)

for fruit in fruits:
    print(fruit)

for key, value in user.items():
    print(f"{key}: {value}")

# while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# break 和 continue
for i in range(10):
    if i == 3:
        continue  # 跳过 3
    if i == 7:
        break  # 在 7 处停止
    print(i)
\`\`\`

### 3. 函数

\`\`\`python
# 基础函数
def greet(name):
    return f"Hello, {name}!"

# 默认参数
def power(base, exponent=2):
    return base ** exponent

# 可变参数
def sum_all(*args):
    return sum(args)

def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Lambda 表达式
square = lambda x: x ** 2
add = lambda x, y: x + y

# 装饰器
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"执行时间: {end - start}秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "完成"
\`\`\`

### 4. 面向对象

\`\`\`python
# 类的定义
class Person:
    # 类变量
    species = "Homo sapiens"
    
    # 构造函数
    def __init__(self, name, age):
        self.name = name  # 实例变量
        self.age = age
    
    # 实例方法
    def introduce(self):
        return f"我是 {self.name}，{self.age} 岁"
    
    # 类方法
    @classmethod
    def from_birth_year(cls, name, birth_year):
        age = 2025 - birth_year
        return cls(name, age)
    
    # 静态方法
    @staticmethod
    def is_adult(age):
        return age >= 18
    
    # 特殊方法
    def __str__(self):
        return f"Person({self.name}, {self.age})"
    
    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age})"

# 继承
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
    
    def introduce(self):
        return f"{super().introduce()}，学号 {self.student_id}"

# 使用
person = Person("John", 30)
print(person.introduce())

student = Student("Alice", 20, "S001")
print(student.introduce())
\`\`\`

---

## 🔧 常用库

### 1. 标准库

\`\`\`python
# os - 操作系统接口
import os
print(os.getcwd())  # 当前目录
os.makedirs('new_folder', exist_ok=True)

# sys - 系统相关
import sys
print(sys.version)
print(sys.argv)  # 命令行参数

# datetime - 日期时间
from datetime import datetime, timedelta
now = datetime.now()
tomorrow = now + timedelta(days=1)
print(now.strftime('%Y-%m-%d %H:%M:%S'))

# json - JSON 处理
import json
data = {'name': 'John', 'age': 30}
json_str = json.dumps(data)
parsed = json.loads(json_str)

# re - 正则表达式
import re
pattern = r'\d+'
text = "我有 3 个苹果和 5 个香蕉"
numbers = re.findall(pattern, text)
\`\`\`

### 2. 数据处理

\`\`\`python
# NumPy - 数值计算
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean())  # 平均值
print(arr.std())   # 标准差

# Pandas - 数据分析
import pandas as pd
df = pd.DataFrame({
    'name': ['John', 'Jane', 'Bob'],
    'age': [30, 25, 35],
    'city': ['NY', 'LA', 'SF']
})
print(df.describe())  # 统计信息
print(df[df['age'] > 28])  # 筛选

# Matplotlib - 数据可视化
import matplotlib.pyplot as plt
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
plt.plot(x, y)
plt.xlabel('X轴')
plt.ylabel('Y轴')
plt.title('示例图表')
plt.show()
\`\`\`

### 3. Web 开发

\`\`\`python
# Flask - 轻量级 Web 框架
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/api/users', methods=['GET'])
def get_users():
    users = [
        {'id': 1, 'name': 'John'},
        {'id': 2, 'name': 'Jane'}
    ]
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    return jsonify({'id': 3, **data}), 201

if __name__ == '__main__':
    app.run(debug=True)

# FastAPI - 现代 API 框架
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    age: int
    email: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/users")
async def create_user(user: User):
    return {"id": 1, **user.dict()}
\`\`\`

---

## 🛠️ 实战案例

### 案例 1: 文件处理

\`\`\`python
# 读取文件
with open('data.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = f.readlines()

# 写入文件
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write('Hello, World!\n')
    f.writelines(['Line 1\n', 'Line 2\n'])

# CSV 处理
import csv

# 读取 CSV
with open('data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['name'], row['age'])

# 写入 CSV
with open('output.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerow({'name': 'John', 'age': 30})
\`\`\`

### 案例 2: 网络请求

\`\`\`python
import requests

# GET 请求
response = requests.get('https://api.example.com/users')
if response.status_code == 200:
    users = response.json()
    print(users)

# POST 请求
data = {'name': 'John', 'age': 30}
response = requests.post('https://api.example.com/users', json=data)
print(response.json())

# 带参数的请求
params = {'page': 1, 'size': 10}
response = requests.get('https://api.example.com/users', params=params)

# 带请求头
headers = {'Authorization': 'Bearer token123'}
response = requests.get('https://api.example.com/users', headers=headers)
\`\`\`

### 案例 3: 数据库操作

\`\`\`python
import sqlite3

# 连接数据库
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# 创建表
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        email TEXT UNIQUE
    )
''')

# 插入数据
cursor.execute('INSERT INTO users (name, age, email) VALUES (?, ?, ?)',
               ('John', 30, 'john@example.com'))

# 查询数据
cursor.execute('SELECT * FROM users WHERE age > ?', (25,))
users = cursor.fetchall()

# 更新数据
cursor.execute('UPDATE users SET age = ? WHERE name = ?', (31, 'John'))

# 删除数据
cursor.execute('DELETE FROM users WHERE id = ?', (1,))

# 提交和关闭
conn.commit()
conn.close()
\`\`\`

---

## 📋 最佳实践

1. **代码风格**
   - 遵循 PEP 8 编码规范
   - 使用有意义的变量名
   - 添加适当的注释和文档字符串

2. **虚拟环境**
   - 使用 venv 或 conda 管理环境
   - 隔离项目依赖
   - 使用 requirements.txt 管理依赖

3. **错误处理**
   - 使用 try-except 捕获异常
   - 提供有意义的错误信息
   - 记录错误日志

4. **类型提示**
   - 使用类型注解提高代码可读性
   - 使用 mypy 进行类型检查

5. **测试**
   - 编写单元测试（unittest、pytest）
   - 保持高测试覆盖率
   - 使用持续集成

---

## 🎓 总结

Python 是一门优秀的编程语言，适合初学者入门，也能满足专业开发需求。通过本指南，你应该已经了解了：

- Python 的基础语法和数据类型
- 函数和面向对象编程
- 常用库和实战案例
- 最佳实践

继续实践，你会发现 Python 让编程变得简单有趣！

---

**参考资源：**
- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [Python 教程](https://docs.python.org/zh-cn/3/tutorial/)
- [Real Python](https://realpython.com/)`,
  type: 'TEXT' as const,
  uploaderId: 15,
  uploaderName: '高六',
  uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gaoliu',
  categoryId: 23,
  categoryName: 'Python',
  tags: 'Python,编程基础,后端开发',
  status: 1,
  createdAt: '2025-12-08T12:45:00Z',
  updatedAt: '2025-12-26T14:15:00Z',
  contentHash: 'hash_python_ml_intro',
};
