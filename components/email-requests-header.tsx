import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockEmailRequests } from "@/lib/mock-data"
import { Search, Filter, RefreshCw } from "lucide-react"

export function EmailRequestsHeader() {
  const pendingCount = mockEmailRequests.filter((email) => email.status === "pending").length
  const processedCount = mockEmailRequests.filter((email) => email.status === "processed").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Email Requests</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {pendingCount} Pending
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {processedCount} Processed
            </Badge>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Emails
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search emails..." className="pl-10" />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="recent">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="priority">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
