"use client";

import { useNavigate } from "react-router";
import { CustomerForm } from "~/components/forms/customer-form";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "~/lib/validations/customer";
import type { CustomerFormData } from "~/types/customer";
import type { Route } from "./+types/create";
import { createCustomer } from "~/services/customer.services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Customer" },
    { name: "description", content: "Create Customer" },
  ];
}

const CreateCustomer = () => {
  const navigate = useNavigate();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {},
  });

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      const response = await createCustomer(data);
      if (response === 201) {
        navigate("/admin/customers");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CustomerForm form={form} title="Create Customer" />
        </form>
      </Form>
    </div>
  );
};

export default CreateCustomer;
