"use client";

import React, { useEffect, useState } from "react";
import { CustomerForm } from "~/components/forms/customer-form";
import { useNavigate } from "react-router";
import type { Route } from "./+types/customer";
import type { Customer, CustomerFormData } from "~/types/customer";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "~/lib/validations/customer";
import { getCustomerById, updateCustomer } from "~/services/customer.services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer Details" },
    { name: "description", content: "Customer Details" },
  ];
}
const CustomerDetails = ({ params }: Route.ComponentProps) => {
  const { customerId } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const customer = await getCustomerById(parseInt(customerId) || 0);
        if (customer) {
          setCustomer(customer as Customer);
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <CustomerEdit customer={customer} />;
};

const CustomerEdit = ({ customer }: { customer: Customer }) => {
  const navigate = useNavigate();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer,
  });

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await updateCustomer(customer.id, data);
      navigate("/admin/customers");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CustomerForm form={form} title="Edit Customer" />
        </form>
      </Form>
    </div>
  );
};

export default CustomerDetails;
