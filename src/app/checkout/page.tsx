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
  QrCode,
  Building,
  Receipt,
  Check,
} from 'lucide-react';

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi-NCR',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'Uttar Pradesh',
  'Haryana',
  'West Bengal',
  'Kerala',
  'Rajasthan',
  'Punjab',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Goa',
  'Other States & UTs',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isCrateUpgrade, crateUpgradeCost, discountAmount, finalTotal, clearCart } =
    useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State localized for India
  const [formData, setFormData] = useState({
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@aerotech-india.com',
    phone: '+91 98765 43210',
    address: '#42, 4th Cross, 100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    isGstInvoice: false,
    gstin: '',
    companyName: '',
    shippingMethod: 'bluedart-express',
    certificateOwnerName: 'Aarav Sharma Robotics Lab',
    paymentMethod: 'upi',
    upiId: 'aaravsharma@okhdfcbank',
    bankName: 'HDFC Bank',
    cardNumber: '•••• •••• •••• 5421',
    cardExpiry: '09/28',
    cardCvc: '458',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      clearCart();
      showToast('Payment Authorized via ' + formData.paymentMethod.toUpperCase(), '3D print production queued at Bengaluru Hub (BLR-01).', 'success');
      router.push('/order-success');
    }, 1500);
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-display font-bold text-white mb-2">No Items In Cart</h2>
          <p className="text-xs text-neutral-400 mb-6">
            Please select precision 3D components or configure custom CAD prints before checking out.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase"
          >
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-white transition-all duration-500 -z-0"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center z-10">
              <button
                onClick={() => setStep(1)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step >= 1
                    ? 'bg-white text-black shadow-md'
                    : 'bg-neutral-900 border border-neutral-700 text-neutral-400'
                }`}
              >
                01
              </button>
              <span className="text-[10px] font-mono mt-1 text-neutral-300">SHIPPING</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center z-10">
              <button
                onClick={() => setStep(2)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step >= 2
                    ? 'bg-white text-black shadow-md'
                    : 'bg-neutral-900 border border-neutral-700 text-neutral-400'
                }`}
              >
                02
              </button>
              <span className="text-[10px] font-mono mt-1 text-neutral-300">CERTIFICATION</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center z-10">
              <button
                onClick={() => setStep(3)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step >= 3
                    ? 'bg-white text-black shadow-md'
                    : 'bg-neutral-900 border border-neutral-700 text-neutral-400'
                }`}
              >
                03
              </button>
              <span className="text-[10px] font-mono mt-1 text-neutral-300">PAYMENT</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Form Content */}
          <div className="lg:col-span-7">
            <form onSubmit={step === 3 ? handleSubmitOrder : (e) => { e.preventDefault(); setStep((step + 1) as any); }}>
              {/* STEP 1: Shipping Details (Pan-India) */}
              {step === 1 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <Truck className="w-4 h-4" />
                      <span>STEP 1: PAN-INDIA DESTINATION</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                      🇮🇳 19,000+ PIN CODES COVERED
                    </span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-white">
                    Delivery Address &amp; Contact
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">FIRST NAME</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">LAST NAME</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">EMAIL FOR DISPATCH TELEMETRY</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">PHONE NUMBER (DELIVERY CONTACT)</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">STREET ADDRESS / FLAT / TECH PARK</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">CITY</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">STATE</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st} className="bg-neutral-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-300 block mb-1">PIN CODE</label>
                      <input
                        type="text"
                        maxLength={6}
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white font-mono"
                      />
                    </div>
                  </div>

                  {/* B2B GST Tax Invoicing Section */}
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-xs font-semibold text-white">
                            Claim 18% GST Input Tax Credit (B2B Tax Invoice)
                          </span>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            HSN Code 8477 / 3926 for Indian business filings
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        name="isGstInvoice"
                        checked={formData.isGstInvoice}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-white rounded cursor-pointer"
                      />
                    </label>

                    {formData.isGstInvoice && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                            GSTIN (15 DIGITS)
                          </label>
                          <input
                            type="text"
                            maxLength={15}
                            name="gstin"
                            placeholder="29AAAAA0000A1Z5"
                            value={formData.gstin}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                            REGISTERED ENTITY / COMPANY NAME
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            placeholder="e.g. Bharat Dynamics Labs"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 shadow-md"
                    >
                      <span>Continue to Verification &amp; Inspection Specs</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Certification / Specification */}
              {step === 2 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>STEP 2: ADDITIVE FABRICATION &amp; METROLOGY SPEC</span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-white">
                    Production Lot &amp; Certification Tag
                  </h2>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Each component manufactured at our Indian additive facilities (Bengaluru &amp; Pune) includes a calibrated QA report, dimensional tolerance verification sheet, and laser-marked serial provenance.
                  </p>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">
                      CLIENT / PROJECT REFERENCE LABEL (ENGRAVED ON COMPONENT FLIGHT TAG)
                    </label>
                    <input
                      type="text"
                      name="certificateOwnerName"
                      required
                      value={formData.certificateOwnerName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white font-mono uppercase"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                      Will be permanently printed on the dimensional inspection sheet and packaging.
                    </p>
                  </div>

                  {/* Production Hub Routing Card */}
                  <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <span className="font-mono font-bold text-xs tracking-widest text-emerald-400">
                        🇮🇳 AETHERIS ADDITIVE HUB: BLR-01 (BENGALURU)
                      </span>
                      <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>

                    <div className="py-4 space-y-1 font-mono">
                      <p className="text-[10px] text-neutral-400">REGISTERED CLIENT LAB</p>
                      <p className="text-sm font-bold text-white uppercase tracking-wider">
                        {formData.certificateOwnerName || 'CLIENT REFERENCE SPECIFIED'}
                      </p>
                      <p className="text-[10px] text-neutral-400 pt-1">
                        DISPATCH ROUTE: BLR-01 &rarr; {formData.city.toUpperCase()} ({formData.postalCode}) VIA BLUEDART AIR
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 shadow-md"
                    >
                      <span>Proceed to Indian Payment Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Indian Payment Gateway */}
              {step === 3 && (
                <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Lock className="w-4 h-4" />
                    <span>STEP 3: SECURE INDIAN PAYMENT GATEWAY</span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-white">
                    Select Payment Option
                  </h2>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                      { id: 'netbanking', label: 'NetBanking', icon: Building },
                      { id: 'card', label: 'RuPay / Cards', icon: CreditCard },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                          formData.paymentMethod === m.id
                            ? 'border-white bg-white text-black shadow-md'
                            : 'border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* UPI Payment Option */}
                  {formData.paymentMethod === 'upi' && (
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-3">
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Instant UPI Payment (GPay, PhonePe, Paytm, BHIM)</span>
                        <span className="text-emerald-400 font-mono text-[11px]">0% Surcharge</span>
                      </div>
                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1">
                          ENTER UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@okhdfcbank"
                          className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400 font-mono">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>A UPI collect request will be sent to your app upon confirmation.</span>
                      </div>
                    </div>
                  )}

                  {/* NetBanking Option */}
                  {formData.paymentMethod === 'netbanking' && (
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-3">
                      <label className="text-xs font-mono text-neutral-300 block mb-1">
                        SELECT INDIAN BANK
                      </label>
                      <select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                      </select>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Direct seamless authentication via your bank&apos;s corporate or retail portal.
                      </p>
                    </div>
                  )}

                  {/* Card Form */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                        <span>Accepted: RuPay, Visa, Mastercard, Corporate Credit Cards</span>
                      </div>
                      <div>
                        <label className="text-xs font-mono text-neutral-300 block mb-1">CARD NUMBER</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-neutral-300 block mb-1">EXPIRY</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-neutral-300 block mb-1">CVV CODE</label>
                          <input
                            type="text"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:border-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Processing Indian Gateway Authorization...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Authorize Payment ({formatPrice(finalTotal)})</span>
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
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-4">
              <h3 className="text-base font-display font-bold text-white pb-3 border-b border-neutral-800">
                Order Summary ({items.length} Items)
              </h3>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-950 border border-neutral-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {item.selectedScale} • {item.quantity}x
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="space-y-2 pt-3 border-t border-neutral-800 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {isCrateUpgrade && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Flight-Ready Protective Crate</span>
                    <span>+{formatPrice(crateUpgradeCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Pan-India Express Air Dispatch (BlueDart)</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>GST Compliance (18% B2B)</span>
                  <span className="text-white">Included (HSN 8477)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="text-xl font-display text-white">
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
