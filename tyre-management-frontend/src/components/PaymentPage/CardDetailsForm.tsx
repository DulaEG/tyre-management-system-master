import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPayment } from "@/api/paymentApi";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

// Define validation schema using Zod
const paymentSchema = z
  .object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Invalid email address"),
    contactNumber: z
      .string()
      .min(10, "Contact number must be at least 10 digits"),
    paymentType: z.enum(["cod", "card"]),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    cardHolder: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentType === "card") {
        return (
          !!data.cardNumber &&
          !!data.expiryDate &&
          !!data.cvv &&
          !!data.cardHolder
        );
      }
      return true;
    },
    {
      message: "Card details are required for card payments",
      path: ["cardNumber"], // This will show the error on the cardNumber field
    }
  );

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CardDetailsFormProps {
  customerId: string;
  paidAmount: number;
  createOrder: () => Promise<void>;
}

const CardDetailsForm = ({
  customerId,
  paidAmount,
  createOrder,
}: CardDetailsFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: "cod", // Default to COD
    },
  });

  const [paymentType, setPaymentType] = useState("cod");

  const onSubmit: SubmitHandler<PaymentFormData> = async (data) => {
    try {
      // Create payment data
      const paymentData = {
        customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        contactNumber: data.contactNumber,
        paidAmount,
        status: "pending",
        paymentType: data.paymentType,
        paidDate: new Date().toISOString(),
      };

      // Create payment
      await createPayment(paymentData);
      toast.success("Payment successful!");

      // Create order
      await createOrder();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Customer Name */}
      <div>
        <Label className="text-white mb-2" htmlFor="customerName">
          Customer Name
        </Label>
        <Input
          id="customerName"
          type="text"
          placeholder="John Doe"
          className="bg-gray-800 text-white border-gray-700"
          {...register("customerName")}
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.customerName.message}
          </p>
        )}
      </div>

      {/* Customer Email */}
      <div>
        <Label className="text-white mb-2" htmlFor="customerEmail">
          Customer Email
        </Label>
        <Input
          id="customerEmail"
          type="email"
          placeholder="john.doe@example.com"
          className="bg-gray-800 text-white border-gray-700"
          {...register("customerEmail")}
        />
        {errors.customerEmail && (
          <p className="text-red-500 text-sm mt-1">
            {errors.customerEmail.message}
          </p>
        )}
      </div>

      {/* Contact Number */}
      <div>
        <Label className="text-white mb-2" htmlFor="contactNumber">
          Contact Number
        </Label>
        <Input
          id="contactNumber"
          type="text"
          placeholder="1234567890"
          className="bg-gray-800 text-white border-gray-700"
          {...register("contactNumber")}
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contactNumber.message}
          </p>
        )}
      </div>

      {/* Payment Type */}
      <div>
        <Label className="text-white mb-2">Payment Type</Label>
        <RadioGroup
          defaultValue="cod"
          className="flex space-x-4"
          {...register("paymentType")}
          onValueChange={(val) => {
            setPaymentType(val);
            setValue("paymentType", val);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="text-white">
              Cash on Delivery (COD)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="text-white">
              Credit/Debit Card
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Card Details (Conditional) */}
      {paymentType === "card" && (
        <>
          <div>
            <Label className="text-white mb-2" htmlFor="cardNumber">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              className="bg-gray-800 text-white border-gray-700"
              {...register("cardNumber")}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardNumber.message}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label className="text-white mb-2" htmlFor="expiryDate">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                className="bg-gray-800 text-white border-gray-700"
                {...register("expiryDate")}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Label className="text-white mb-2" htmlFor="cvv">
                CVV
              </Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                className="bg-gray-800 text-white border-gray-700"
                {...register("cvv")}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cvv.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label className="text-white mb-2" htmlFor="cardHolder">
              Card Holder Name
            </Label>
            <Input
              id="cardHolder"
              type="text"
              placeholder="John Doe"
              className="bg-gray-800 text-white border-gray-700"
              {...register("cardHolder")}
            />
            {errors.cardHolder && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardHolder.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
};

export default CardDetailsForm;
