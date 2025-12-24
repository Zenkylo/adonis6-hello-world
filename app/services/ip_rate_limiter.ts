export class IpRateLimiter {
  private static instance: IpRateLimiter
  private ipList: string[] = []
  private lastReset: Date = new Date()
  private readonly maxIps = 1000

  private constructor() {}

  public static getInstance(): IpRateLimiter {
    if (!IpRateLimiter.instance) {
      IpRateLimiter.instance = new IpRateLimiter()
    }
    return IpRateLimiter.instance
  }

  private shouldResetDaily(): boolean {
    const now = new Date()
    const diffInHours = (now.getTime() - this.lastReset.getTime()) / (1000 * 60 * 60)
    return diffInHours >= 24
  }

  private resetIfNeeded(): void {
    if (this.shouldResetDaily()) {
      this.ipList = []
      this.lastReset = new Date()
      console.log('IP rate limiter reset - daily cleanup performed')
    }
  }

  public canSubmit(ip: string): boolean {
    this.resetIfNeeded()

    // Check if IP is already in the list
    if (this.ipList.includes(ip)) {
      return false
    }

    // Add IP to the list (FIFO)
    this.ipList.push(ip)

    // Maintain max size - remove oldest if needed
    if (this.ipList.length > this.maxIps) {
      this.ipList.shift() // Remove first (oldest) element
    }

    return true
  }

  // Debug methods
  public getStats(): { count: number; lastReset: Date } {
    return {
      count: this.ipList.length,
      lastReset: this.lastReset,
    }
  }
}
