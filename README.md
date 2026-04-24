# CareerMatch 求职管理小程序

**智能简历管理 · 职位追踪 · AI 匹配分析**

---

## 项目简介

CareerMatch 是一款专为求职者打造的微信小程序，帮助用户高效管理求职全流程。通过智能匹配算法，将简历与职位进行多维度分析，快速找到最适合的工作机会。

### 核心特性

- **简历管理** - 完整维护个人信息、技能标签、工作经历、教育背景
- **职位追踪** - 添加、编辑、筛选职位，记录投递状态流转
- **智能匹配** - 五维匹配算法（技能/职位/薪资/地点/关键词），精准推荐
- **数据可视化** - 匹配度环形分数、进度条分析、等级评定
- **精美主题** - Catppuccin Mocha 暗色主题，护眼舒适

---

## 快速开始

### 环境要求

- 微信开发者工具 v1.06.2206020 或更高版本
- 微信小程序 AppID（测试可使用测试号）

### 安装运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd career

# 2. 使用微信开发者工具打开项目
# 文件 - 打开文件夹 - 选择 career 目录

# 3. 在开发者工具中点击"编译"即可预览
```

### 项目结构

```
career/
├── app.js                  # 小程序入口逻辑
├── app.json                # 全局配置（页面路由、导航栏、TabBar）
├── app.wxss                # 全局样式（Catppuccin Mocha 主题）
├── sitemap.json            # 搜索索引配置
│
├── pages/                  # 页面目录
│   ├── index/              # 首页 - 概览统计、快捷入口、最佳匹配
│   ├── resume/             # 简历页 - 个人信息、技能、经历
│   ├── jobs/               # 职位列表 - 浏览、筛选、搜索
│   ├── job-add/            # 职位详情 - 添加/编辑/查看/匹配分析
│   ├── match/              # 智能匹配 - 全量匹配分析、维度展开
│   └── settings/           # 设置页 - 阈值调节、数据管理
│
├── utils/                  # 工具函数
│   ├── storage.js          # 本地存储封装（简历/职位/设置）
│   └── match.js            # 匹配算法（五维评分引擎）
│
└── docs/                   # 文档资源
```

---

## 功能说明

### 1. 首页 (pages/index)

- **欢迎区**：显示用户名和待处理职位数
- **统计卡片**：职位总数、高匹配数、进行中数
- **快捷操作**：一键跳转简历/添加职位/智能匹配
- **最佳匹配**：TOP 3 推荐职位，按匹配度排序

### 2. 简历页 (pages/resume)

| 模块 | 内容 |
|------|------|
| 基本信息 | 姓名、电话、邮箱、当前职位、期望薪资 |
| 个人简介 | 专业背景与职业目标 |
| 技能标签 | 动态添加/删除，用于匹配计算 |
| 目标职位 | 期望岗位类型 |
| 目标城市 | 期望工作地点 |
| 工作经历 | 公司、职位、时间段、描述 |
| 教育经历 | 学校、专业、学历、时间段 |

### 3. 职位列表 (pages/jobs)

- **搜索**：支持公司、职位、地点模糊搜索
- **筛选**：按投递状态过滤（新职位/已投递/面试中/已录用/已结束）
- **排序**：默认按匹配度降序排列
- **操作**：点击进入详情，长按编辑/删除

### 4. 职位详情 (pages/job-add)

**查看模式：**
- 职位基本信息展示
- 匹配度环形分数（>=80绿色/60-79黄色/<60红色）
- 五维匹配分析（技能40%/职位20%/薪资15%/地点15%/关键词10%）
- 已匹配技能 vs 缺失技能对比
- 职位描述、技能要求、福利待遇

**编辑模式：**
- 完整表单编辑
- 动态添加/删除技能要求和福利标签
- 投递状态选择器

### 5. 智能匹配 (pages/match)

- 全量职位匹配度排序
- 筛选：高匹配(>=80)/中匹配(60-79)/低匹配(<60)
- 统计概览：各等级职位数量
- 展开详情：查看五维进度条、技能对比
- 未完善简历提示

### 6. 设置 (pages/settings)

- **匹配阈值**：滑动调节（0-100%），控制推荐严格度
- **自动匹配**：开关控制页面自动计算
- **数据管理**：
  - 重置演示数据（恢复默认示例）
  - 清空职位数据（保留简历）
  - 清除所有数据（完全重置）

---

## 匹配算法

### 五维评分模型

```
总匹配度 = 技能匹配*40% + 职位匹配*20% + 薪资匹配*15% + 地点匹配*15% + 关键词匹配*10%
```

| 维度 | 权重 | 计算方式 |
|------|------|----------|
| **技能匹配** | 40% | 简历技能与职位要求的交集比例 |
| **职位匹配** | 20% | 目标职位/当前职位与职位标题的相似度 |
| **薪资匹配** | 15% | 期望薪资区间与职位薪资的重叠度 |
| **地点匹配** | 15% | 目标城市与工作地点的匹配，支持一线/新一线模糊匹配 |
| **关键词匹配** | 10% | 简历内容（技能/简介/经历）与 JD 的关键词重合度 |

### 等级评定

| 分数 | 等级 | 颜色 |
|------|------|------|
| >=90 | S | 绿色 |
| >=80 | A | 绿色 |
| >=70 | B | 黄色 |
| >=60 | C | 黄色 |
| >=50 | D | 红色 |
| <50 | F | 红色 |

---

## 设计规范

### 主题配色（Catppuccin Mocha）

```css
--base: #1e1e2e        /* 页面背景 */
--surface0: #313244    /* 卡片背景 */
--surface1: #45475a    /* 输入框背景 */
--text: #cdd6f4        /* 主文字 */
--subtext0: #a6adc8    /* 次要文字 */
--blue: #89b4fa        /* 主色调/按钮 */
--green: #a6e3a1       /* 成功/高匹配 */
--yellow: #f9e2af      /* 警告/中匹配 */
--red: #f38ba8         /* 错误/低匹配/删除 */
--peach: #fab387       /* 强调 */
--mauve: #cba6f7       /* 标签 */
```

### 组件规范

| 组件 | 样式 |
|------|------|
| 卡片 (.card) | 圆角 16rpx，背景 surface0，内边距 30rpx |
| 按钮 (.btn) | 圆角 12rpx，字体 30rpx，居中 |
| 标签 (.tag) | 圆角 8rpx，字体 24rpx，内边距 8rpx 20rpx |
| 分数环 (.score-circle) | 圆形，直径 120rpx，粗体 40rpx |
| 输入框 (.input) | 圆角 12rpx，背景 surface1，内边距 20rpx 24rpx |

---

## 开发指南

### 数据存储

使用微信小程序本地存储进行持久化：

```javascript
const storage = require('./utils/storage');

// 读取简历
const resume = storage.getResume();

// 更新简历
storage.setResume({ ...resume, name: '张三' });

// 添加职位
storage.addJob({ company: '字节跳动', title: '前端工程师' });

// 更新职位状态
storage.updateJob('job_123', { status: 'applied' });

// 删除职位
storage.deleteJob('job_123');
```

### 匹配计算

```javascript
const matchUtil = require('./utils/match');

// 计算单个职位匹配度
const result = matchUtil.calculateMatch(resume, job);
// result = { total: 85, details: {...}, matchedSkills: [...], missingSkills: [...] }

// 获取等级和颜色
const label = matchUtil.getScoreLabel(85);   // 'A'
const color = matchUtil.getScoreColor(85);   // '#a6e3a1'
const level = matchUtil.getScoreLevel(85);   // 'high'
```

### 添加新页面

1. 在 app.json 的 pages 数组中添加路由
2. 创建 pages/new-page/ 目录
3. 创建四个文件：new-page.js / new-page.json / new-page.wxml / new-page.wxss
4. 在 app.wxss 中复用通用样式类

---

## 数据模型

### 简历 (Resume)

```typescript
interface Resume {
  name: string;           // 姓名
  phone: string;          // 电话
  email: string;          // 邮箱
  title: string;          // 当前职位
  summary: string;        // 个人简介
  skills: string[];       // 技能标签
  experience: Experience[];
  education: Education[];
  targetSalary: { min: number; max: number };
  targetCities: string[];
  targetRoles: string[];
}

interface Experience {
  company: string;
  title: string;
  duration: string;
  description: string;
}

interface Education {
  school: string;
  major: string;
  degree: string;
  duration: string;
}
```

### 职位 (Job)

```typescript
interface Job {
  id: string;             // 唯一标识 job_<timestamp>
  company: string;        // 公司
  title: string;          // 职位
  department: string;     // 部门
  location: string;       // 地点
  salaryMin: number;      // 最低薪资
  salaryMax: number;      // 最高薪资
  salaryUnit: string;     // 单位（k/万）
  type: string;           // 全职/兼职/实习/外包
  jd: string;             // 职位描述
  requirements: string[]; // 技能要求
  benefits: string[];     // 福利待遇
  status: JobStatus;      // 投递状态
  score: number;          // 匹配度（计算得出）
  createdAt: number;      // 创建时间戳
}

type JobStatus = 'new' | 'applied' | 'interviewing' | 'offer' | 'rejected';
```

### 设置 (Settings)

```typescript
interface Settings {
  matchThreshold: number;  // 匹配阈值（默认 60）
  autoMatch: boolean;      // 自动匹配开关（默认 true）
}
```

---

## 状态流转

职位投递状态流转：

```
新职位(new) -> 已投递(applied) -> 面试中(interviewing) -> 已录用(offer) -> 已结束(rejected)
     ^                                                                            |
     |----------------------------------------------------------------------------|
```

---

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：git checkout -b feature/xxx
3. 提交更改：git commit -m 'feat: add xxx'
4. 推送分支：git push origin feature/xxx
5. 创建 Pull Request

### 提交规范

- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式（不影响功能）
- refactor: 重构
- perf: 性能优化
- test: 测试相关

---

## 开源协议

本项目基于 MIT License 开源。
