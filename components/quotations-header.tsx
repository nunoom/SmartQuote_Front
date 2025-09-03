// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Search, Filter } from "lucide-react"

// export function QuotationsHeader() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
//         <Button className="bg-blue-600 hover:bg-blue-700">
//           <Plus className="h-4 w-4 mr-2" />
//           New Quotation
//         </Button>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input placeholder="Search quotations..." className="pl-10" />
//         </div>

//         <Select defaultValue="all">
//           <SelectTrigger className="w-40">
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="draft">Draft</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="rejected">Rejected</SelectItem>
//             <SelectItem value="sent">Sent</SelectItem>
//           </SelectContent>
//         </Select>

//         <Select defaultValue="all-approval">
//           <SelectTrigger className="w-48">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all-approval">All Approvals</SelectItem>
//             <SelectItem value="requires-approval">Requires Approval</SelectItem>
//             <SelectItem value="no-approval">No Approval Needed</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   )
// }

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"

export function QuotationsHeader() {
  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-200">Quotations</h1>
        <Button className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full">
          <Plus className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
          New Quotation
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />
          <Input
            placeholder="Search quotations..."
            className="pl-10 bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
          />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-neutral-900 border-yellow-900/30 text-gray-200">
            <Filter className="h-4 w-4 mr-2 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="all" className="hover:bg-yellow-900/20">All Status</SelectItem>
            <SelectItem value="draft" className="hover:bg-yellow-900/20">Draft</SelectItem>
            <SelectItem value="pending" className="hover:bg-yellow-900/20">Pending</SelectItem>
            <SelectItem value="approved" className="hover:bg-yellow-900/20">Approved</SelectItem>
            <SelectItem value="rejected" className="hover:bg-yellow-900/20">Rejected</SelectItem>
            <SelectItem value="sent" className="hover:bg-yellow-900/20">Sent</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-approval">
          <SelectTrigger className="w-48 bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="all-approval" className="hover:bg-yellow-900/20">All Approvals</SelectItem>
            <SelectItem value="requires-approval" className="hover:bg-yellow-900/20">Requires Approval</SelectItem>
            <SelectItem value="no-approval" className="hover:bg-yellow-900/20">No Approval Needed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
