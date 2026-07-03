import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { submitSfzRequest } from "@/lib/sfz.functions";

export const Route = createFileRoute("/request-sfz")({
  head: () => ({
    meta: [
      { title: "Request an SFZ Session — Oneness Generation" },
      { name: "description", content: "Request a Stress Free Zone session for your group or organization." },
    ],
  }),
  component: RequestSfzPage,
});

const schema = z.object({
  group_name: z.string().trim().min(1, "Group / organization name is required").max(200),
  contact_name: z.string().trim().min(1, "Contact name is required").max(200),
  contact_phone: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, "Enter a valid phone number (7–15 digits)"),
  contact_email: z.string().trim().email("Enter a valid email address").max(255),
  group_size: z.coerce.number().int().min(1, "Must be at least 1 person").max(10000),
  date_requested: z.string().min(1, "Date is required"),
  attendance_type: z.enum(["in_person", "online"]),
  location: z.string().trim().max(300).optional(),
  preferred_time: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type FormValues = z.input<typeof schema>;

function RequestSfzPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { attendance_type: "in_person" },
  });
  const attendance = watch("attendance_type");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await submitSfzRequest({
        data: {
          ...values,
          group_size: Number(values.group_size),
          location: values.location || null,
          preferred_time: values.preferred_time || null,
          notes: values.notes || null,
        },
      });
      toast.success("Request submitted successfully!");
      navigate({ to: "/sfz" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const labelCls = "block font-medium mb-1 text-sm sm:text-base";
  const inputCls =
    "w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brown/40";

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-4 sm:p-6 my-8">
      <div className="flex items-center justify-between pb-4">
        <button
          type="button"
          className="text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 grid place-content-center transition"
          onClick={() => navigate({ to: "/sfz" })}
          aria-label="Back to SFZ"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-tanAccent font-semibold text-center">
          Request SFZ Session
        </h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div>
            <label className={labelCls}>Name of group / organization</label>
            <input
              type="text"
              placeholder="Enter group or organization name"
              {...register("group_name")}
              className={inputCls}
            />
            {errors.group_name && <p className="text-red-500 text-sm mt-1">{errors.group_name.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Name of contact</label>
            <input
              type="text"
              placeholder="Enter contact name"
              {...register("contact_name")}
              className={inputCls}
            />
            {errors.contact_name && <p className="text-red-500 text-sm mt-1">{errors.contact_name.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Contact phone number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              {...register("contact_phone")}
              className={inputCls}
            />
            {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Contact email</label>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("contact_email")}
              className={inputCls}
            />
            {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Group size</label>
            <input
              type="number"
              placeholder="Enter number of people"
              {...register("group_size")}
              className={inputCls}
            />
            {errors.group_size && <p className="text-red-500 text-sm mt-1">{errors.group_size.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Date requested</label>
            <input type="date" {...register("date_requested")} className={inputCls} />
            {errors.date_requested && <p className="text-red-500 text-sm mt-1">{errors.date_requested.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Attendance type</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="in_person" {...register("attendance_type")} />
                In person
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="online" {...register("attendance_type")} />
                Online
              </label>
            </div>
          </div>

          {attendance === "in_person" && (
            <div className="md:col-span-2">
              <label className={labelCls}>Location</label>
              <input
                type="text"
                placeholder="Address or city"
                {...register("location")}
                className={inputCls}
              />
            </div>
          )}

          <div>
            <label className={labelCls}>Preferred time</label>
            <input
              type="text"
              placeholder="e.g. Weekday evenings"
              {...register("preferred_time")}
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Additional notes</label>
            <textarea
              rows={4}
              placeholder="Anything else you'd like us to know"
              {...register("notes")}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-brown text-white font-medium px-8 py-3 rounded-2xl hover:bg-yellow-800 transition-colors duration-200 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
