"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle, XCircle, ArrowRight, Download } from "lucide-react";

export default function PayPage({ params }: { params: { invoiceId: string } }) {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [paymentRef, setPaymentRef] = useState("");

  const invoiceId = params.invoiceId;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        const data = await res.json();
        setInvoice(data);
        if (data.contact?.email) setEmail(data.contact.email);
      } catch {}
      setLoading(false);
    }
    load();
  }, [invoiceId]);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("reference");
    if (ref) {
      setPaymentRef(ref);
      verifyPayment(ref);
    }
  }, []);

  async function verifyPayment(reference: string) {
    setProcessing(true);
    setStatus("processing");
    try {
      const res = await fetch(`/api/payments/verify?reference=${reference}`);
      const data = await res.json();
      if (data.status === "success") {
        setStatus("success");
        setMessage("Payment successful! Your receipt is ready.");
      } else {
        setStatus("error");
        setMessage(data.status === "failed" ? "Payment failed. Please try again." : "Payment is still pending.");
      }
    } catch {
      setStatus("error");
      setMessage("Verification failed. Contact support.");
    }
    setProcessing(false);
  }

  async function handlePay() {
    if (!email.trim()) return;
    setProcessing(true);
    setStatus("processing");
    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: Number(invoiceId),
          email: email.trim(),
          callbackUrl: `${window.location.origin}/pay/${invoiceId}`,
        }),
      });
      const data = await res.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        setStatus("error");
        setMessage(data.error || "Payment initialization failed");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
    setProcessing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground">This invoice does not exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-950 dark:to-gray-900 p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-xs">{paymentRef}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">₦{Number(invoice.totalAmount).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <a href={`/api/payments/invoice/${invoiceId}/pdf?type=receipt`} download>
                <Download className="mr-2 h-4 w-4" /> Download Receipt
              </a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <CreditCard className="h-12 w-12 mx-auto text-primary mb-3" />
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <p className="text-muted-foreground">Pay securely with Paystack</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invoice</span>
            <span className="font-medium">{invoice.invoiceNumber || `#${invoiceId}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-2xl font-bold text-primary">₦{Number(invoice.totalAmount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="capitalize">{invoice.status}</span>
          </div>
        </div>

        {status === "error" && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm text-red-600 dark:text-red-400">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handlePay} disabled={processing || !email.trim()}>
            {processing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><ArrowRight className="mr-2 h-4 w-4" /> Pay ₦{Number(invoice.totalAmount).toLocaleString()}</>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secured by <span className="font-semibold">Paystack</span>. Your payment info is encrypted.
          </p>
        </div>
      </Card>
    </div>
  );
}
