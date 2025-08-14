import type { Customer, Quotation, ApprovalRequest, User, EmailRequest } from "./types"

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@acmecorp.com",
    company: "Acme Corporation",
    phone: "+1-555-0123",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@techstart.com",
    company: "TechStart Inc",
    phone: "+1-555-0456",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@globalltd.com",
    company: "Global Solutions Ltd",
    createdAt: new Date("2024-03-10"),
  },
]

export const mockQuotations: Quotation[] = [
  {
    id: "Q-2024-001",
    customerId: "1",
    customer: mockCustomers[0],
    items: [
      {
        id: "1",
        description: "Enterprise Software License",
        quantity: 100,
        unitPrice: 50000,
        total: 5000000,
      },
    ],
    subtotal: 5000000,
    tax: 500000,
    total: 5500000,
    status: "pending",
    requiresApproval: true,
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    emailRequest: "Need quote for 100 enterprise licenses for our new project",
    notes: "High-value client, priority processing required",
  },
  {
    id: "Q-2024-002",
    customerId: "2",
    customer: mockCustomers[1],
    items: [
      {
        id: "2",
        description: "Consulting Services",
        quantity: 40,
        unitPrice: 15000,
        total: 600000,
      },
      {
        id: "3",
        description: "Training Package",
        quantity: 1,
        unitPrice: 50000,
        total: 50000,
      },
    ],
    subtotal: 650000,
    tax: 65000,
    total: 715000,
    status: "approved",
    requiresApproval: false,
    approvedBy: "manager-1",
    approvedAt: new Date("2024-03-14"),
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-14"),
    emailRequest: "Looking for consulting help and training for our team",
  },
  {
    id: "Q-2024-003",
    customerId: "3",
    customer: mockCustomers[2],
    items: [
      {
        id: "4",
        description: "Custom Development",
        quantity: 1,
        unitPrice: 3200000,
        total: 3200000,
      },
    ],
    subtotal: 3200000,
    tax: 320000,
    total: 3520000,
    status: "pending",
    requiresApproval: true,
    createdAt: new Date("2024-03-16"),
    updatedAt: new Date("2024-03-16"),
    emailRequest: "Need custom software development for our enterprise platform",
  },
]

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alice Manager",
    email: "alice@company.com",
    role: "manager",
    canApprove: true,
  },
  {
    id: "user-2",
    name: "Bob Sales",
    email: "bob@company.com",
    role: "sales",
    canApprove: false,
  },
  {
    id: "user-3",
    name: "Carol Admin",
    email: "carol@company.com",
    role: "admin",
    canApprove: true,
  },
]

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: "AR-001",
    quotationId: "Q-2024-001",
    requestedBy: "user-2",
    reason: "Amount exceeds 2M threshold - requires management approval",
    status: "pending",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "AR-002",
    quotationId: "Q-2024-003",
    requestedBy: "user-2",
    reason: "High-value custom development project",
    status: "pending",
    createdAt: new Date("2024-03-16"),
  },
]

export const mockEmailRequests: EmailRequest[] = [
  {
    id: "email-001",
    from: "john@acmecorp.com",
    subject: "Quote Request for Enterprise Software Licenses",
    body: "Hi, we need a quote for 100 enterprise software licenses for our new project. We're looking to implement this by Q2 2024. Please include training and support packages. Our budget is around $5-6 million. Thanks, John Smith, Acme Corporation",
    processedAt: new Date("2024-03-15T10:30:00Z"),
    quotationId: "Q-2024-001",
    status: "processed",
    createdAt: new Date("2024-03-15T09:15:00Z"),
  },
  {
    id: "email-002",
    from: "sarah@techstart.com",
    subject: "Consulting Services Quote",
    body: "Hello, we're a startup looking for consulting services to help us scale our platform. We need about 40 hours of consulting work and would like to include a training package for our team. Can you provide a quote? Best regards, Sarah Johnson, TechStart Inc",
    processedAt: new Date("2024-03-12T14:20:00Z"),
    quotationId: "Q-2024-002",
    status: "processed",
    createdAt: new Date("2024-03-12T13:45:00Z"),
  },
  {
    id: "email-003",
    from: "michael@globalltd.com",
    subject: "Custom Development Project Quote",
    body: "We need a quote for custom software development for our enterprise platform. This is a large-scale project that will require significant development resources. We're looking at a timeline of 6-8 months. Please provide detailed pricing. Michael Chen, Global Solutions Ltd",
    processedAt: new Date("2024-03-16T11:15:00Z"),
    quotationId: "Q-2024-003",
    status: "processed",
    createdAt: new Date("2024-03-16T10:30:00Z"),
  },
  {
    id: "email-004",
    from: "lisa@newcompany.com",
    subject: "Urgent: Need Quote for Cloud Migration",
    body: "Hi there, we urgently need a quote for migrating our entire infrastructure to the cloud. We have about 200 servers and need this done within the next 3 months. Please prioritize this request. Lisa Wong, New Company Inc",
    status: "pending",
    createdAt: new Date("2024-03-17T08:45:00Z"),
  },
  {
    id: "email-005",
    from: "david@enterprise.com",
    subject: "Re: Follow-up on Previous Quote",
    body: "Following up on our previous discussion about the enterprise solution. We've decided to move forward but need some modifications to the original quote. Can we schedule a call to discuss? David Brown, Enterprise Corp",
    status: "pending",
    createdAt: new Date("2024-03-17T15:20:00Z"),
  },
]
