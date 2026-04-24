App({
  onLaunch() {
    this.initStorage();
  },

  initStorage() {
    const resume = wx.getStorageSync('resume');
    if (!resume) {
      wx.setStorageSync('resume', {
        name: '',
        phone: '',
        email: '',
        title: '',
        summary: '',
        skills: [],
        experience: [],
        education: [],
        targetSalary: { min: 0, max: 0 },
        targetCities: [],
        targetRoles: []
      });
    }

    const jobs = wx.getStorageSync('jobs');
    if (!jobs) {
      wx.setStorageSync('jobs', []);
    }

    const hasDemoData = wx.getStorageSync('hasDemoData');
    if (!hasDemoData) {
      this.loadDemoData();
      wx.setStorageSync('hasDemoData', true);
    }
  },

  loadDemoData() {
    const demoJobs = [
      {
        id: 'job_1',
        company: '字节跳动',
        title: '高级前端工程师',
        department: '抖音电商',
        location: '北京',
        salaryMin: 35,
        salaryMax: 60,
        salaryUnit: 'k',
        type: '全职',
        jd: '负责抖音电商核心页面开发与优化。要求：3年以上前端经验，精通React/Vue，有大型项目架构经验，熟悉小程序开发。',
        requirements: ['React', 'Vue', 'TypeScript', '前端架构', '小程序', 'Node.js'],
        benefits: ['六险一金', '免费三餐', '租房补贴'],
        status: 'new',
        score: 0,
        createdAt: Date.now()
      },
      {
        id: 'job_2',
        company: '阿里巴巴',
        title: '全栈开发工程师',
        department: '淘宝技术部',
        location: '杭州',
        salaryMin: 30,
        salaryMax: 50,
        salaryUnit: 'k',
        type: '全职',
        jd: '参与淘宝核心业务系统的设计与开发。要求：熟练掌握Java/Node.js，熟悉微服务架构，具备前后端开发能力。',
        requirements: ['Java', 'Node.js', '微服务', 'MySQL', 'Redis', 'React'],
        benefits: ['年终奖', '股票期权', '体检'],
        status: 'new',
        score: 0,
        createdAt: Date.now() - 86400000
      },
      {
        id: 'job_3',
        company: '腾讯',
        title: '微信小程序工程师',
        department: '微信支付',
        location: '深圳',
        salaryMin: 25,
        salaryMax: 45,
        salaryUnit: 'k',
        type: '全职',
        jd: '负责微信支付相关小程序及H5页面开发。要求：精通微信小程序开发，熟悉前端性能优化，有支付相关经验优先。',
        requirements: ['微信小程序', 'JavaScript', '性能优化', '微信支付', 'React'],
        benefits: ['五险一金', '带薪年假', '餐补'],
        status: 'new',
        score: 0,
        createdAt: Date.now() - 172800000
      },
      {
        id: 'job_4',
        company: '美团',
        title: '后端开发工程师',
        department: '外卖技术部',
        location: '北京',
        salaryMin: 28,
        salaryMax: 48,
        salaryUnit: 'k',
        type: '全职',
        jd: '负责外卖订单系统的高并发服务开发。要求：熟悉Go/Java，有高并发系统设计经验，了解分布式系统原理。',
        requirements: ['Go', 'Java', '高并发', '分布式系统', 'MySQL', 'Kafka'],
        benefits: ['补充医疗', '健身房', '交通补贴'],
        status: 'new',
        score: 0,
        createdAt: Date.now() - 259200000
      },
      {
        id: 'job_5',
        company: '拼多多',
        title: '前端架构师',
        department: '用户增长',
        location: '上海',
        salaryMin: 40,
        salaryMax: 70,
        salaryUnit: 'k',
        type: '全职',
        jd: '主导用户增长相关前端架构设计与演进。要求：5年以上前端经验，有架构设计能力，熟悉工程化体系建设。',
        requirements: ['前端架构', '工程化', 'React', 'Vue', 'TypeScript', 'Webpack'],
        benefits: ['高薪', '年终奖', '免费住宿'],
        status: 'new',
        score: 0,
        createdAt: Date.now() - 345600000
      }
    ];
    wx.setStorageSync('jobs', demoJobs);

    const demoResume = {
      name: '张三',
      phone: '138****8888',
      email: 'zhangsan@example.com',
      title: '高级前端工程师',
      summary: '5年前端开发经验，精通React和Vue生态，熟悉微信小程序开发，有大型电商项目经验。擅长性能优化和前端工程化建设。',
      skills: ['React', 'Vue', 'TypeScript', '微信小程序', 'Node.js', 'Webpack', '前端架构', '性能优化'],
      experience: [
        {
          company: '某知名电商公司',
          title: '高级前端工程师',
          duration: '2021.06 - 至今',
          description: '负责核心交易链路前端开发，主导小程序性能优化项目，首屏加载时间减少40%。搭建前端组件库，覆盖20+业务线。'
        },
        {
          company: '某互联网创业公司',
          title: '前端工程师',
          duration: '2019.07 - 2021.05',
          description: '负责公司官网和后台管理系统开发，参与小程序从0到1建设，使用Vue技术栈。'
        }
      ],
      education: [
        {
          school: '某某大学',
          major: '计算机科学与技术',
          degree: '本科',
          duration: '2015.09 - 2019.06'
        }
      ],
      targetSalary: { min: 30, max: 50 },
      targetCities: ['北京', '杭州', '深圳'],
      targetRoles: ['高级前端工程师', '前端架构师', '全栈工程师']
    };
    wx.setStorageSync('resume', demoResume);
  }
});
