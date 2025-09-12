import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";

export function TaskListTable({ tableData }) {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200 ";
      case "pending":
        return "bg-purple-100 text-purple-800 border border-purple-200 ";
      case "in progress":
        return "bg-cyan-100 text-cyan-800 border border-cyan-200 ";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200 ";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border border-red-200 ";
      case "medium":
        return "bg-orange-100 text-orange-800 border border-orange-200 ";
      case "low":
        return "bg-green-100 text-green-800 border border-green-200 ";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200 ";
    }
  };

  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow className="overflow-hidden">
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right">Created on</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((task) => (
          <TableRow key={task._id}>
            <TableCell>{task.title}</TableCell>

            <TableCell>
              <span
                className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </TableCell>

            <TableCell className="px-2 py-1">
              <span
                className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(
                  task.priority
                )}`}
              >
                {" "}
                {task.priority}
              </span>
            </TableCell>

            <TableCell className="text-right">
              {task.createdAt
                ? moment(task.createdAt).format("Do MMM YYYY")
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={4}></TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
  );
}
