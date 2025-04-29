import { supabase } from "~/supabase-client";
import { toast } from "sonner";
import type { CustomerFormData } from "~/types/customer";

export const getCustomers = async () => {
  const { data, error } = await supabase.from("customers").select("*");
  if (error) {
    toast.error(error.message);
    throw error;
  }
  return data;
};

export const getCustomerById = async (id: number) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    toast.error(error.message);
    throw error;
  }
  return data;
};

export const createCustomer = async (customer: CustomerFormData) => {
  const { error, status } = await supabase.from("customers").insert(customer);
  if (error) {
    toast.error(error.message);
    throw error;
  }
  toast.success("Customer created successfully");
  return status;
};

export const updateCustomer = async (
  id: number,
  customer: CustomerFormData
) => {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id);
  if (error) {
    toast.error(error.message);
    throw error;
  }
  toast.success("Customer updated successfully");
  return data;
};

export const deleteCustomer = async (id: number) => {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) {
    toast.error(error.message);
    throw error;
  }
  toast.success("Customer deleted successfully");
};
