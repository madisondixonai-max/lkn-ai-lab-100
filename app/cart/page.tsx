"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import {
  cartSubtotal,
  clearCart,
  formatPickupDate,
  getCart,
  getPickupDates,
  PICKUP_TIMES,
  removeCartItem,
  SHIPPING_FEE,
  type CartItem,
} from "@/lib/cart";
import {
  BACKGROUND,
  CARD_STYLE,
  INPUT_STYLE,
  PRIMARY_BUTTON,
} from "@/lib/theme";

type DeliveryType = "local" | "shipping" | null;
type Step = 1 | 2 | 3 | 4 | 5;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = cartSubtotal(cart);
  const shipping = deliveryType === "shipping" ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  const handleRemove = (id: string) => {
    removeCartItem(id);
    setCart(getCart());
  };

  const canContinueStep1 = cart.length > 0;
  const canContinueStep2 = email.trim().includes("@") && phone.trim().length >= 7;
  const canContinueStep3 = deliveryType !== null;
  const canContinueStep4 =
    deliveryType === "local"
      ? pickupDate !== null && pickupTime !== null
      : deliveryType === "shipping"
        ? shippingAddress.trim() && shippingCity.trim() && shippingZip.trim()
        : false;

  const goNext = () => {
    if (step === 3 && deliveryType === "local") setStep(4);
    else if (step === 3 && deliveryType === "shipping") setStep(4);
    else if (step < 5) setStep((s) => (s + 1) as Step);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const placeOrder = () => {
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
        <div className="max-w-lg mx-auto text-center">
          <BrandHeader cartCount={0} showCart />
          <div className={`${CARD_STYLE} p-8 mt-8`}>
            <h1 className="text-2xl font-bold mb-3">Order placed!</h1>
            <p className="text-purple-700 mb-6">
              Thanks! Madison will reach out at {email} to confirm your order.
            </p>
            <Link href="/shop" className={`inline-block px-6 py-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0 && step === 1) {
    return (
      <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
        <div className="max-w-lg mx-auto">
          <BrandHeader cartCount={0} showCart />
          <div className={`${CARD_STYLE} p-8 text-center mt-8`}>
            <p className="text-purple-600 mb-4">Your cart is empty.</p>
            <Link href="/shop" className={`inline-block px-6 py-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
              Go to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-lg mx-auto">
        <BrandHeader cartCount={cart.length} showCart />

        <h1 className="text-3xl font-bold mb-2">Cart</h1>
        <p className="text-sm text-purple-600 mb-6">Step {step} of 5</p>

        {/* Step 1: Cart review */}
        {step === 1 && (
          <div className={`${CARD_STYLE} p-4 space-y-4`}>
            <h2 className="font-semibold">Your items</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start border-b border-purple-200 pb-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-purple-500">{item.shape} · Size {item.size}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <p className="font-bold text-right">Subtotal: ${subtotal.toFixed(2)}</p>
            <button
              type="button"
              disabled={!canContinueStep1}
              onClick={goNext}
              className={`w-full p-3 rounded-lg font-semibold ${PRIMARY_BUTTON} disabled:opacity-40`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className={`${CARD_STYLE} p-4 space-y-4`}>
            <h2 className="font-semibold">Your contact info</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full p-3 rounded-lg ${INPUT_STYLE}`}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className={`w-full p-3 rounded-lg ${INPUT_STYLE}`}
            />
            <div className="flex gap-2">
              <button type="button" onClick={goBack} className="flex-1 p-3 rounded-lg border border-purple-400 text-purple-700">
                Back
              </button>
              <button
                type="button"
                disabled={!canContinueStep2}
                onClick={goNext}
                className={`flex-1 p-3 rounded-lg font-semibold ${PRIMARY_BUTTON} disabled:opacity-40`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Delivery type */}
        {step === 3 && (
          <div className={`${CARD_STYLE} p-4 space-y-4`}>
            <h2 className="font-semibold">How do you want your nails?</h2>
            <button
              type="button"
              onClick={() => setDeliveryType("local")}
              className={`w-full p-4 rounded-lg border text-left transition ${
                deliveryType === "local"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-purple-100 border-purple-400 text-purple-900 hover:bg-purple-200"
              }`}
            >
              <p className="font-semibold">Local pickup / meetup</p>
              <p className="text-sm opacity-80 mt-1">Free — pick a date & time</p>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType("shipping")}
              className={`w-full p-4 rounded-lg border text-left transition ${
                deliveryType === "shipping"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-purple-100 border-purple-400 text-purple-900 hover:bg-purple-200"
              }`}
            >
              <p className="font-semibold">Out of my local area</p>
              <p className="text-sm opacity-80 mt-1">Shipping — ${SHIPPING_FEE.toFixed(2)} fee</p>
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={goBack} className="flex-1 p-3 rounded-lg border border-purple-400 text-purple-700">
                Back
              </button>
              <button
                type="button"
                disabled={!canContinueStep3}
                onClick={goNext}
                className={`flex-1 p-3 rounded-lg font-semibold ${PRIMARY_BUTTON} disabled:opacity-40`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Local calendar OR Shipping */}
        {step === 4 && deliveryType === "local" && (
          <div className={`${CARD_STYLE} p-4 space-y-4`}>
            <h2 className="font-semibold">Pick a pickup date</h2>
            <div className="grid grid-cols-2 gap-2">
              {getPickupDates().map((date) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    setPickupDate(date);
                    setPickupTime(null);
                  }}
                  className={`p-2 rounded-lg text-sm font-medium border transition ${
                    pickupDate?.toDateString() === date.toDateString()
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-purple-100 border-purple-400 hover:bg-purple-200"
                  }`}
                >
                  {formatPickupDate(date)}
                </button>
              ))}
            </div>
            {pickupDate && (
              <>
                <h3 className="font-semibold text-sm mt-2">Pick a time</h3>
                <div className="flex flex-wrap gap-2">
                  {PICKUP_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setPickupTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                        pickupTime === time
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-purple-100 border-purple-400 hover:bg-purple-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={goBack} className="flex-1 p-3 rounded-lg border border-purple-400 text-purple-700">
                Back
              </button>
              <button
                type="button"
                disabled={!canContinueStep4}
                onClick={goNext}
                className={`flex-1 p-3 rounded-lg font-semibold ${PRIMARY_BUTTON} disabled:opacity-40`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && deliveryType === "shipping" && (
          <div className={`${CARD_STYLE} p-4 space-y-4`}>
            <h2 className="font-semibold">Shipping address</h2>
            <input
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Street address"
              className={`w-full p-3 rounded-lg ${INPUT_STYLE}`}
            />
            <input
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              placeholder="City"
              className={`w-full p-3 rounded-lg ${INPUT_STYLE}`}
            />
            <input
              value={shippingZip}
              onChange={(e) => setShippingZip(e.target.value)}
              placeholder="ZIP code"
              className={`w-full p-3 rounded-lg ${INPUT_STYLE}`}
            />
            <p className="text-sm text-purple-600">Shipping fee: ${SHIPPING_FEE.toFixed(2)}</p>
            <div className="flex gap-2">
              <button type="button" onClick={goBack} className="flex-1 p-3 rounded-lg border border-purple-400 text-purple-700">
                Back
              </button>
              <button
                type="button"
                disabled={!canContinueStep4}
                onClick={goNext}
                className={`flex-1 p-3 rounded-lg font-semibold ${PRIMARY_BUTTON} disabled:opacity-40`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className={`${CARD_STYLE} p-4 space-y-4`}>
            <h2 className="font-semibold">Order summary</h2>
            {cart.map((item) => (
              <p key={item.id} className="text-sm">
                {item.name} ({item.shape}, Size {item.size}) — ${item.price.toFixed(2)}
              </p>
            ))}
            <hr className="border-purple-200" />
            <p className="text-sm"><span className="font-medium">Email:</span> {email}</p>
            <p className="text-sm"><span className="font-medium">Phone:</span> {phone}</p>
            {deliveryType === "local" && pickupDate && pickupTime && (
              <p className="text-sm">
                <span className="font-medium">Pickup:</span> {formatPickupDate(pickupDate)} at {pickupTime}
              </p>
            )}
            {deliveryType === "shipping" && (
              <>
                <p className="text-sm">
                  <span className="font-medium">Ship to:</span> {shippingAddress}, {shippingCity} {shippingZip}
                </p>
                <p className="text-sm">Shipping: ${SHIPPING_FEE.toFixed(2)}</p>
              </>
            )}
            <p className="font-bold text-lg text-right">Total: ${total.toFixed(2)}</p>
            <div className="flex gap-2">
              <button type="button" onClick={goBack} className="flex-1 p-3 rounded-lg border border-purple-400 text-purple-700">
                Back
              </button>
              <button
                type="button"
                onClick={placeOrder}
                className={`flex-1 p-3 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
              >
                Place order
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
