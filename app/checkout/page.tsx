"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useAddress } from "@/lib/address-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/lib/language-context";
import { getUserProfile } from "@/lib/api";
import { MobileBottomMenu } from "@/components/mobile-bottom-menu";
import { validatePromoCode } from "@/lib/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState, useCallback, useEffect } from "react";
import { CreditCard, Truck, FileText, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { address, setAddress } = useAddress();
  const { items, clearCart, isLoading } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComment, setOrderComment] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [appliedPromoCode, setAppliedPromoCode] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserProfile();
        setRecipientName(userData.name || "");
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const cartItems = Object.entries(items).map(([key, item]) => {
    return {
      id: item.id,
      name: item.name,
      unit: item.unit,
      size: item.size_name,
      brand: item.brand,
      image: item.image,
      price: item.price || 0,
      quantity: item.quantity,
      description: item.description,
      discountPercentage: item.discountPercentage,
    };
  });

  console.log(cartItems, "CART ITEMS");

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.price * (1 - (item.discountPercentage || 0) / 100);
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const calculateDiscount = useCallback(() => {
    if (!appliedPromoCode) return 0;
    const subtotal = calculateTotal();
    return (subtotal * appliedPromoCode.discount) / 100;
  }, [appliedPromoCode, calculateTotal]);

  const getDeliveryCost = useCallback(() => {
    const subtotal = calculateTotal();
    if (deliveryMethod === "pickup") return 0;
    // Free delivery for orders over 3000 RUB
    if (subtotal >= 3000) return 0;
    // Base delivery cost is 300 RUB
    return 300;
  }, [deliveryMethod, calculateTotal]);

  const calculateFinalTotal = useCallback(() => {
    const subtotal = calculateTotal();
    const discount = calculateDiscount();
    const deliveryCost = getDeliveryCost();
    return subtotal - discount + deliveryCost;
  }, [calculateTotal, calculateDiscount, getDeliveryCost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!recipientName || !address?.fullAddress) {
        throw new Error(t("checkoutpg.fillAllFields"));
      }

      // Here you would typically make an API call to submit the order
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await clearCart();
      router.push("/checkoutpg/success");
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode) return;

    setIsValidatingPromo(true);
    try {
      const response = await validatePromoCode(promoCode);
      if (response.valid) {
        setAppliedPromoCode({ code: promoCode, discount: response.discount });
        toast.success(t("checkoutpg.promoCodeApplied"));
        setPromoCode("");
      } else {
        toast.error(response.message || t("checkoutpg.promoCodeInvalid"));
      }
    } catch (error) {
      toast.error(t("checkoutpg.promoCodeInvalid"));
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold">{t("cartpg.empty")}</h1>
          <p className="text-gray-500">{t("cartpg.addItems")}</p>
          <Button onClick={() => router.push("/catalog")}>
            {t("cartpg.continueShopping")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkoutpg.orderInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">
                    {t("checkoutpg.recipientName")}
                  </Label>
                  <Input
                    id="recipientName"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={t("checkoutpg.enterRecipientName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">
                    {t("checkoutpg.orderComment")}
                  </Label>
                  <Textarea
                    id="comment"
                    value={orderComment}
                    onChange={(e) => setOrderComment(e.target.value)}
                    placeholder={t("checkoutpg.enterOrderComment")}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("checkoutpg.deliveryAddress")}</Label>
                  <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="space-y-1 flex-1">
                      {address?.fullAddress ? (
                        <>
                          <p className="text-sm font-medium">
                            {address.fullAddress}
                          </p>
                          {address.details && (
                            <p className="text-sm text-muted-foreground">
                              {address.details}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t("checkoutpg.noAddressSelected")}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      {address?.fullAddress
                        ? t("checkoutpg.changeAddress")
                        : t("checkoutpg.selectAddress")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkoutpg.paymentMethod")}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label
                      htmlFor="credit_card"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      {t("checkoutpg.creditCard")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label
                      htmlFor="cash"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      {t("checkoutpg.cash")}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkoutpg.deliveryMethod")}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={setDeliveryMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="courier" id="courier" />
                    <Label
                      htmlFor="courier"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Truck className="h-4 w-4" />
                      {t("checkoutpg.courier")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label
                      htmlFor="pickup"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <MapPin className="h-4 w-4" />
                      {t("checkoutpg.pickup")}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{t("checkoutpg.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.id}`} className="flex gap-4">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {typeof item.size === "string"
                              ? item.size
                              : item.size.size}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm">
                              {new Intl.NumberFormat("ru-RU", {
                                style: "currency",
                                currency: "RUB",
                              }).format(
                                item.price *
                                  (1 - (item.discountPercentage || 0) / 100)
                              )}
                            </p>
                            <span className="text-sm text-muted-foreground">
                              ×
                            </span>
                            <p className="text-sm">{item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("checkoutpg.subtotal")}</span>
                    <span>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                      }).format(calculateTotal())}
                    </span>
                  </div>

                  {/* Promo Code Section */}
                  {appliedPromoCode ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {t("checkoutpg.promoCode")}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {appliedPromoCode.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePromoCode}
                          className="h-auto p-1 text-muted-foreground hover:text-destructive"
                        >
                          {t("checkoutpg.removePromoCode")}
                        </Button>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("checkoutpg.promoCodeDiscount")}</span>
                        <span className="text-green-600">
                          -
                          {new Intl.NumberFormat("ru-RU", {
                            style: "currency",
                            currency: "RUB",
                          }).format(calculateDiscount())}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("checkoutpg.enterPromoCode")}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="secondary"
                        onClick={handleApplyPromoCode}
                        disabled={!promoCode || isValidatingPromo}
                      >
                        {isValidatingPromo ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                        ) : (
                          t("checkoutpg.applyPromoCode")
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>{t("checkoutpg.deliveryCost")}</span>
                    {getDeliveryCost() === 0 ? (
                      <span className="text-green-600">
                        {t("checkoutpg.freeDelivery")}
                      </span>
                    ) : (
                      <span>
                        {new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                        }).format(getDeliveryCost())}
                      </span>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>{t("checkoutpg.total")}</span>
                    <span>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                      }).format(calculateFinalTotal())}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={
                    !isSubmitting || !recipientName || !address?.fullAddress
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t("checkoutpg.processing")}
                    </>
                  ) : (
                    t("checkoutpg.placeOrder")
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <MobileBottomMenu />
    </div>
  );
}
