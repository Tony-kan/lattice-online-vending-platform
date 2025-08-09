import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IUser, INewUser, UserRole } from "@/types/type";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

interface UserFormProps {
  user?: IUser | null;
  onSave: (data: INewUser) => void;
  isLoading: boolean;
  error: AxiosError<ApiError> | null;
}

const UserForm = ({ user, onSave, isLoading, error }: UserFormProps) => {
  const [formData, setFormData] = useState<INewUser>({
    name: "",
    email: "",
    password: "",
    role: "BILLING_CLERK",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "", // Don't pre-fill password for editing
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    // Don't send an empty password field during an update
    if (user && !dataToSave.password) {
      delete dataToSave.password;
    }
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          placeholder={user ? "Leave blank to keep current password" : ""}
          value={formData.password}
          onChange={handleChange}
          required={!user} // Password is only required when creating a new user
        />
      </div>
      <div className="space-y-2 ">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="rounded-sm">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="bg-white border-amber-500">
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="INVENTORY_MANAGER">Inventory Manager</SelectItem>
            <SelectItem value="BILLING_CLERK">Billing Clerk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <p className="text-sm text-center text-red-500 capitalize">
          {error.response?.data?.error || "An unexpected error occurred."}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-500 rounded-sm text-white font-extrabold border-2 border-transparent hover:border-amber-500 hover:text-amber-500 hover:bg-transparent active:bg-amber-600 active:text-white"
      >
        {isLoading ? "Saving..." : "Save User"}
      </Button>
    </form>
  );
};

export default UserForm;
