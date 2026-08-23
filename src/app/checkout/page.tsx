'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useToast } from '@/context/ToastContext';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Box,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ChevronLeft,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isCrateUpgrade, crateUpgradeCost, discountAmount, finalTotal, clearCart } =
    useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Lord Henrik',
    lastName: 'Von Berg',
    email: 'h.vonberg@zurich-gallery.ch',
    phone: '+41 44 215 5000',
    address: 'Bahnhofstrasse 45, Suite 800',
    city: 'Zurich',
    postalCode: '8001',
    country: 'Switzerland',
    shippingMethod: 'white-glove',
    certificateOwnerName: 'Henrik Von Berg Collection',
    paymentMethod: 'card',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '08/29',
    cardCvc: '888',
    cryptoCoin: 'ETH',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      clearCart();
      showToast('Masterwork Transaction Authorized', 'Your 16K SLA print queue is initialized.', 'gold');
      router.push('/order-success');
    }, 1500);
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-obsidian-950 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">No Items In Cart</h2>
          <p className="text-xs text-titanium-400 mb-6">
            Please add a statue to your vault before checking out.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase"
          >
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-obsidian-800 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gold-500 transition-all duration-500 -z-0"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center z-10">
              <button
                onClick={() => setStep(1)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step >= 1
                    ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
                    : 'bg-obsidian-900 border border-obsidian-700 text-titanium-400'
                }`}
              >
                01
              </button>
              <span className="text-[10px] font-mono mt-1 text-titanium-300">SHIPPING</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center z-10">
              <button
                onClick={() => setStep(2)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step >= 2
                    ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
                    : 'bg-obsidian-900 border border-obsidian-700 text-titanium-400'
                }`}
              >
                02
              </button>
              <span className="text-[10px] font-mono mt-1 text-titanium-300">CERTIFICATION</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center z-10">
              <button
                onClick={() => setStep(3)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step >= 3
                    ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
                    : 'bg-obsidian-900 border border-obsidian-700 text-titanium-400'
                }`}
              >
                03
              </button>
              <span className="text-[10px] font-mono mt-1 text-titanium-300">PAYMENT</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Form Content */}
          <div className="lg:col-span-7">
            <form onSubmit={step === 3 ? handleSubmitOrder : (e) => { e.preventDefault(); setStep((step + 1) as any); }}>
              {/* STEP 1: Shipping & White-Glove Details */}
              {step === 1 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                    <Truck className="w-4 h-4" />
                    <span>STEP 1: COLLECTOR DESTINATION</span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-foreground">
                    Secure Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">FIRST NAME</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">LAST NAME</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">EMAIL FOR DISPATCH TELEMETRY</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">PHONE NUMBER (COURIER CONTACT)</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-titanium-300 block mb-1">STREET ADDRESS &amp; SUITE</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">CITY</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">POSTAL CODE</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-titanium-300 block mb-1">COUNTRY</label>
                      <input
                        type="text"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-obsidian-800">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow"
                    >
                      <span>Continue to Certificate Customization</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: NFC Certificate Personalization */}
              {step === 2 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                    <Sparkles className="w-4 h-4" />
                    <span>STEP 2: ENCRYPTED NFC AUTHENTICITY REGISTRATION</span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-foreground">
                    Certificate of Authenticity Plaque
                  </h2>

                  <p className="text-xs text-titanium-300 leading-relaxed">
                    Each statue includes a heavy brushed-titanium certificate with an embedded cryptographic NFC chip linked to our decentralized collector ledger.
                  </p>

                  <div>
                    <label className="text-xs font-mono text-titanium-300 block mb-1">
                      REGISTERED OWNER NAME (ENGRAVED ON METAL CARD)
                    </label>
                    <input
                      type="text"
                      name="certificateOwnerName"
                      required
                      value={formData.certificateOwnerName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50 font-mono uppercase"
                    />
                    <p className="text-[10px] text-titanium-500 mt-1 font-mono">
                      Will be permanently laser-etched onto the solid metal Authenticity Card.
                    </p>
                  </div>

                  {/* Visual Preview of Metal NFC Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-obsidian-850 via-obsidian-950 to-obsidian-850 border border-gold-500/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between pb-3 border-b border-obsidian-800">
                      <span className="font-display font-bold text-xs tracking-widest text-gold-400">
                        AETHERIS ATELIER • CERTIFICATE OF AUTHENTICITY
                      </span>
                      <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>

                    <div className="py-4 space-y-1">
                      <p className="text-[10px] font-mono text-titanium-400">AUTHENTICATED OWNER</p>
                      <p className="text-sm font-mono font-bold text-foreground uppercase tracking-wider">
                        {formData.certificateOwnerName || 'COLLECTOR SPECIFIED NAME'}
                      </p>
                      <p className="text-[10px] font-mono text-gold-400 pt-1">
                        CRYPTOGRAPHIC NFC ID: ATH-0x7F4A-2026 • 16K SLA CERTIFIED
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-obsidian-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl bg-obsidian-950 border border-obsidian-700 text-titanium-400 hover:text-white text-xs font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow"
                    >
                      <span>Proceed to Payment Method</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                    <Lock className="w-4 h-4" />
                    <span>STEP 3: SECURE ACQUISITION AUTHORIZATION</span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-foreground">
                    Payment Method
                  </h2>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'apple-pay', label: 'Apple Pay', icon: Box },
                      { id: 'crypto', label: 'Crypto (ETH/BTC)', icon: Cpu },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                          formData.paymentMethod === m.id
                            ? 'border-gold-500 bg-gold-500/10 text-gold-300 shadow-gold-glow/20'
                            : 'border-obsidian-700 bg-obsidian-950 text-titanium-400 hover:text-white'
                        }`}
                      >
                        <m.icon className="w-4 h-4 text-gold-400" />
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Card Form */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs font-mono text-titanium-300 block mb-1">CARD NUMBER</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-titanium-300 block mb-1">EXPIRY</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-titanium-300 block mb-1">CVC CODE</label>
                          <input
                            type="text"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:border-gold-500/50 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'crypto' && (
                    <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs font-mono space-y-2">
                      <p className="text-titanium-300">Pay using Web3 Wallet or direct contract deposit:</p>
                      <p className="text-gold-400 font-bold">ATH-VAULT: 0x98A1...E72D</p>
                      <p className="text-[10px] text-titanium-500">Supports Ethereum (USDT/USDC/ETH) and Bitcoin.</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-obsidian-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xl bg-obsidian-950 border border-obsidian-700 text-titanium-400 hover:text-white text-xs font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Initializing 16K SLA Print Queue...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Authorize Acquisition ({formatPrice(finalTotal)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-4">
              <h3 className="text-base font-display font-bold text-foreground pb-3 border-b border-obsidian-800">
                Allocation Summary ({items.length} Statues)
              </h3>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-obsidian-950 border border-obsidian-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                      <p className="text-[10px] text-titanium-400 font-mono">
                        {item.selectedScale} • {item.quantity}x
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-400">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="space-y-2 pt-3 border-t border-obsidian-800 text-xs font-mono">
                <div className="flex justify-between text-titanium-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Code Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {isCrateUpgrade && (
                  <div className="flex justify-between text-gold-400">
                    <span>Pine Display Crate</span>
                    <span>+{formatPrice(crateUpgradeCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-titanium-400">
                  <span>White-Glove Insured Air Freight</span>
                  <span className="text-emerald-400">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-obsidian-800">
                  <span>Total Due</span>
                  <span className="text-xl font-display text-gold-400">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
