export interface ScamReport {
  id: string;
  type: "call" | "text" | "email";
  content: string;
  sender?: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  category?: string;
  redFlags?: string[];
  aiAnalysis?: string;
  action?: string;
  createdAt: string;
}

export interface TrackedSubscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: "monthly" | "yearly" | "weekly";
  renewalDate?: string;
  status: "active" | "paused" | "cancelled" | "flagged";
  category?: string;
  cancellationUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface DataBroker {
  id: string;
  brokerName: string;
  status: "pending" | "submitted" | "confirmed" | "re-listed";
  submittedDate?: string;
  confirmedDate?: string;
  lastChecked?: string;
  optOutUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface PriceWatch {
  id: string;
  productName: string;
  productUrl: string;
  currentPrice?: number;
  lowestPrice?: number;
  highestPrice?: number;
  priceSnapshots?: PriceSnapshot[];
  flagged: boolean;
  notes?: string;
  createdAt: string;
}

export interface PriceSnapshot {
  price: number;
  date: string;
  context?: string;
}

export interface AlertLog {
  id: string;
  type: "scam" | "subscription" | "privacy" | "price" | "system";
  title: string;
  body: string;
  actionable: boolean;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "scam" | "subscription" | "privacy" | "price" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardStats {
  protectionScore: number;
  scamsBlocked: number;
  moneySaved: number;
  brokersOptedOut: number;
  activeSubscriptions: number;
  monthlySpend: number;
  recentAlerts: AlertLog[];
}

export interface ScamAnalysisResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  category: string;
  redFlags: string[];
  analysis: string;
  recommendedAction: string;
}

export interface UserSubscriptionData {
  id: string;
  plan: "free" | "solo" | "family";
  status: "active" | "trialing" | "canceled" | "expired";
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  canceledAt?: string;
}

export interface UserSettingsData {
  notifications: {
    scams: boolean;
    subscriptions: boolean;
    privacy: boolean;
    priceWatch: boolean;
  };
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
  plan: string;
}
