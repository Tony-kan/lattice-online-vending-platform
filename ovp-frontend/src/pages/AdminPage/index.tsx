import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getAllUsers, addUser, updateUser, deleteUser } from "@/api/AdminApi";

import ModuleLayout from "@/components/layout/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { BreadcrumbItem, INewUser, IUser } from "@/types/type";

import UserForm from "@/components/forms/UserForm";
import { formatDateTime } from "@/lib/utils";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Modules", href: "/modules" },
  { label: "Admin", href: "/admin" },
];

interface ApiError {
  error: string;
}

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // 1. Fetching Data with useQuery
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<IUser[], Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // 2. Mutation for Adding a User
  const addUserMutation = useMutation<IUser, AxiosError<ApiError>, INewUser>({
    mutationFn: addUser,
    onSuccess: () => {
      // When a user is added, invalidate the 'users' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsFormOpen(false); // Close the dialog on success
    },
  });

  // 3. Mutation for Updating a User
  const updateUserMutation = useMutation<
    IUser,
    AxiosError<ApiError>,
    { id: string | number; data: Partial<INewUser> }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsFormOpen(false);
      setSelectedUser(null);
    },
  });

  // 4. Mutation for Deleting a User
  const deleteUserMutation = useMutation<
    void,
    AxiosError<ApiError>,
    string | number
  >({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (userId: string | number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const filteredUsers =
    users?.filter(
      (user: IUser) =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <ModuleLayout title="Admin : User Management" breadcrumbs={breadcrumbItems}>
      <div className="space-y-4 mt-10">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          />
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-amber-500 rounded-sm mr-6 text-white font-extrabold border-2 border-transparent hover:border-amber-500 hover:text-amber-500 hover:bg-transparent active:bg-amber-600 active:text-white"
                onClick={() => setSelectedUser(null)}
              >
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-amber-500 rounded-sm">
              <DialogHeader>
                <DialogTitle>
                  {selectedUser ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>
              <UserForm
                user={selectedUser}
                onSave={(data) => {
                  if (selectedUser) {
                    updateUserMutation.mutate({ id: selectedUser.id, data });
                  } else {
                    addUserMutation.mutate(data);
                  }
                }}
                isLoading={
                  addUserMutation.isPending || updateUserMutation.isPending
                }
                error={addUserMutation.error || updateUserMutation.error}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* User Table */}
        {isLoading && <p>Loading users...</p>}
        {isError && (
          <p className="text-red-500">Error fetching users: {error.message}</p>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user: IUser) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{formatDateTime(user.created_at)}</TableCell>
                <TableCell>{formatDateTime(user.updated_at)}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white rounded-sm w-16 border-2 border-transparent hover:border-green-500 hover:text-green-500 hover:bg-transparent active:bg-amber-600 active:text-white"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 rounded-sm border-2 border-transparent hover:border-red-500 hover:text-red-500 hover:bg-transparent active:bg-red-600 active:text-white"
                    onClick={() => handleDeleteClick(user.id)}
                    disabled={deleteUserMutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ModuleLayout>
  );
};

export default AdminPage;
