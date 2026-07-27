export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  quiz: Quiz[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  image: string;
}

export const coursesData: Course[] = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Learn Python programming from scratch with hands-on exercises',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Python',
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Python?',
            content: `Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python emphasizes code readability with its use of significant whitespace.

Key Features:
• Easy to learn and use
• Versatile - used in web dev, AI, data science, automation
• Large standard library
• Active community support
• Cross-platform compatibility

Python is widely used by companies like Google, Netflix, Instagram, and NASA.`,
            quiz: [
              {
                id: 'q1',
                question: 'Who created Python?',
                options: ['James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup'],
                correctAnswer: 1
              },
              {
                id: 'q2',
                question: 'What type of programming language is Python?',
                options: ['Compiled', 'Interpreted', 'Assembly', 'Machine'],
                correctAnswer: 1
              }
            ]
          },
          {
            id: 'lesson-2',
            title: 'Variables and Data Types',
            content: `In Python, variables are containers for storing data. You don't need to declare the type - Python infers it automatically.

Basic Data Types:
• int - Integer numbers (e.g., 42)
• float - Decimal numbers (e.g., 3.14)
• str - Text strings (e.g., "Hello")
• bool - True or False values
• list - Ordered collection [1, 2, 3]
• dict - Key-value pairs {"name": "John"}

Examples:
name = "Alice"
age = 25
height = 5.6
is_student = True

Python uses dynamic typing, so you can reassign variables to different types.`,
            quiz: [
              {
                id: 'q3',
                question: 'Which of these is NOT a valid Python data type?',
                options: ['int', 'float', 'char', 'str'],
                correctAnswer: 2
              },
              {
                id: 'q4',
                question: 'What is the data type of True in Python?',
                options: ['int', 'str', 'bool', 'binary'],
                correctAnswer: 2
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Fundamentals',
    description: 'Master the basics of cybersecurity and ethical hacking',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Cybersecurity',
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Cybersecurity?',
            content: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks aim to access, change, or destroy sensitive information, extort money, or interrupt normal business processes.

Key Concepts:
• CIA Triad: Confidentiality, Integrity, Availability
• Threats: Malware, phishing, ransomware, DDoS
• Defense strategies: Firewalls, encryption, MFA
• Ethical hacking and penetration testing
• Security policies and compliance

The cybersecurity field is growing rapidly, with high demand for skilled professionals.`,
            quiz: [
              {
                id: 'q1',
                question: 'What does CIA stand for in cybersecurity?',
                options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Computer Information Access', 'Certified Internet Authentication'],
                correctAnswer: 1
              },
              {
                id: 'q2',
                question: 'Which of these is a type of cyberattack?',
                options: ['Firewall', 'Phishing', 'Encryption', 'Authentication'],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai-introduction',
    title: 'AI Introduction',
    description: 'Explore the fundamentals of Artificial Intelligence',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    modules: [
      {
        id: 'module-1',
        title: 'Understanding AI',
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Artificial Intelligence?',
            content: `Artificial Intelligence (AI) is the simulation of human intelligence by machines. AI systems can learn, reason, and self-correct.

Types of AI:
• Narrow AI - Specialized in one task (Siri, ChatGPT)
• General AI - Human-level intelligence (theoretical)
• Super AI - Surpasses human intelligence (future)

Key Technologies:
• Machine Learning - Learning from data
• Neural Networks - Mimicking brain structure
• Natural Language Processing - Understanding language
• Computer Vision - Analyzing images

AI is transforming industries from healthcare to finance, creating new opportunities and challenges.`,
            quiz: [
              {
                id: 'q1',
                question: 'What type of AI is ChatGPT?',
                options: ['Narrow AI', 'General AI', 'Super AI', 'Weak AI'],
                correctAnswer: 0
              },
              {
                id: 'q2',
                question: 'Which AI technology helps computers understand images?',
                options: ['NLP', 'Computer Vision', 'Machine Learning', 'Deep Learning'],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build modern websites with HTML, CSS, and JavaScript',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    modules: [
      {
        id: 'module-1',
        title: 'Web Basics',
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introduction to Web Development',
            content: `Web development is the work involved in developing websites for the Internet. It ranges from simple static pages to complex web applications.

Core Technologies:
• HTML - Structure and content
• CSS - Styling and layout
• JavaScript - Interactivity and logic

Frontend vs Backend:
• Frontend - What users see (UI/UX)
• Backend - Server, database, APIs
• Full-stack - Both frontend and backend

Modern Tools:
• React, Vue, Angular (frameworks)
• Node.js (backend JavaScript)
• Git (version control)
• VS Code (code editor)

Web development offers diverse career paths and remote work opportunities.`,
            quiz: [
              {
                id: 'q1',
                question: 'Which language is used for webpage structure?',
                options: ['CSS', 'JavaScript', 'HTML', 'Python'],
                correctAnswer: 2
              },
              {
                id: 'q2',
                question: 'What does CSS stand for?',
                options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Code Style Syntax'],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'networking',
    title: 'Computer Networking',
    description: 'Understand networks, protocols, and internet infrastructure',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    modules: [
      {
        id: 'module-1',
        title: 'Networking Fundamentals',
        lessons: [
          {
            id: 'lesson-1',
            title: 'Introduction to Networking',
            content: `Computer networking is the practice of connecting computers and devices to share resources and communicate.

Network Types:
• LAN - Local Area Network (home, office)
• WAN - Wide Area Network (internet)
• MAN - Metropolitan Area Network (city)
• PAN - Personal Area Network (Bluetooth)

Key Concepts:
• IP Address - Unique device identifier
• DNS - Domain Name System (converts names to IPs)
• TCP/IP - Internet protocol suite
• HTTP/HTTPS - Web protocols
• Router - Directs network traffic
• Switch - Connects devices in a network

Understanding networking is essential for IT careers and cybersecurity.`,
            quiz: [
              {
                id: 'q1',
                question: 'What does LAN stand for?',
                options: ['Large Area Network', 'Local Access Network', 'Local Area Network', 'Limited Area Network'],
                correctAnswer: 2
              },
              {
                id: 'q2',
                question: 'Which protocol ensures reliable data delivery?',
                options: ['UDP', 'TCP', 'HTTP', 'FTP'],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  }
];
