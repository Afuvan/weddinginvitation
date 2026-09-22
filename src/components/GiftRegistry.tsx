import React, { useState } from 'react';
import {
  Gift,
  Building2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  QrCode,
  Eye,
  EyeOff,
  Sparkles,
  Edit3,
  CreditCard,
  ShoppingBag,
  Heart,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { WeddingData, RegistryLink } from '../types';

interface GiftRegistryProps {
  weddingData: WeddingData;
  onOpenCustomizer?: () => void;
}

export const GiftRegistry: React.FC<GiftRegistryProps> = ({
  weddingData,
  onOpenCustomizer,
}) => {
  const { giftRegistry, theme } = weddingData;
  const { colors } = theme;

  const [activeTab, setActiveTab] = useState<'bank' | 'registries' | 'charity'>('bank');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAccountMasked, setIsAccountMasked] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // If entire registry is disabled in customizer, do not render
  if (giftRegistry && giftRegistry.enabled === false) {
    return null;
  }

  // Safe defaults if custom data lacks fields
  const registryConfig = giftRegistry || {
    enabled: true,
    sectionTitle: 'Wedding Gift Registry & Blessings',
    sectionSubtitle: 'With Gratitude & Warm Hearts',
    blessingMessage:
      'Your presence and heartfelt du’as are the greatest gift we could ever ask for as we begin our blessed journey. For beloved family and friends wishing to celebrate us with a gift, we have prepared our registry links and banking details below.',
    enableBankTransfer: true,
    bankDetails: {
      accountHolderName: `${weddingData.groom.callingName} & ${weddingData.bride.callingName}`,
      accountNumber: '50200088997766',
      bankName: 'HDFC Bank Ltd.',
      branchName: 'Main Branch',
      ifscOrSwiftCode: 'HDFC0001786',
      upiOrZelleId: 'suhail.wedding@okhdfcbank',
      accountType: 'Wedding Joint Account',
      note: 'Please include your name in the payment remarks/memo.',
    },
    enableRegistryLinks: true,
    registryLinks: [],
    enableCharityOption: true,
    charityName: 'Sadaqah Jariyah — Water Well Project',
    charityUrl: 'https://www.islamic-relief.org',
    charityDescription:
      'In honor of our sacred union, consider making a charitable donation to provide clean water to families in need on our behalf.',
  };

  const { bankDetails, registryLinks } = registryConfig;

  // Robust secure copy with iframe fallback
  const handleSecureCopy = async (textToCopy: string, fieldLabel: string, keyIdentifier: string) => {
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } else {
        // Fallback for non-secure contexts or certain iframe security policies
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        textArea.remove();
      }
    } catch {
      // Fallback attempt
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        success = document.execCommand('copy');
        textArea.remove();
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopiedKey(keyIdentifier);
      setToastMessage(`✓ ${fieldLabel} copied securely!`);
      setTimeout(() => {
        setCopiedKey(null);
        setToastMessage(null);
      }, 2500);
    } else {
      setToastMessage(`Failed to copy. Please manually select the text.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Copy complete banking invoice/details formatted block
  const handleCopyAllBankDetails = () => {
    const fullText = [
      `═══════════════════════════════════════`,
      `WEDDING GIFT BANK DETAILS — ${weddingData.groom.callingName.toUpperCase()} & ${weddingData.bride.callingName.toUpperCase()}`,
      `═══════════════════════════════════════`,
      `Account Name : ${bankDetails.accountHolderName}`,
      `Bank Name    : ${bankDetails.bankName}${bankDetails.branchName ? ` (${bankDetails.branchName})` : ''}`,
      `Account No.  : ${bankDetails.accountNumber}`,
      `Account Type : ${bankDetails.accountType || 'Savings Account'}`,
      bankDetails.ifscOrSwiftCode ? `IFSC / SWIFT : ${bankDetails.ifscOrSwiftCode}` : null,
      bankDetails.iban ? `IBAN Code    : ${bankDetails.iban}` : null,
      bankDetails.routingOrSortCode ? `Routing/Sort : ${bankDetails.routingOrSortCode}` : null,
      bankDetails.upiOrZelleId ? `UPI / Zelle  : ${bankDetails.upiOrZelleId}` : null,
      bankDetails.note ? `Note         : ${bankDetails.note}` : null,
      `═══════════════════════════════════════`,
      `Thank you with warmest prayers and gratitude!`,
    ]
      .filter(Boolean)
      .join('\n');

    handleSecureCopy(fullText, 'Complete Banking Details', 'all-banking');
  };

  // Mask account number representation (e.g. •••• •••• 7766)
  const formatAccountNumber = (acc: string) => {
    if (!isAccountMasked) return acc;
    if (acc.length <= 4) return acc;
    const lastFour = acc.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  return (
    <section
      id="registry"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: colors.creamBg }}
    >
      {/* Subtle Background Flourish */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.accentGold}18` }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.primaryMaroon}12` }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border shadow-xs"
            style={{
              backgroundColor: `${colors.accentGold}15`,
              color: colors.primaryMaroon,
              borderColor: `${colors.accentGold}40`,
            }}
          >
            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{registryConfig.sectionSubtitle || 'With Gratitude & Warm Hearts'}</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight"
            style={{ color: colors.primaryMaroon }}
          >
            {registryConfig.sectionTitle || 'Wedding Gift Registry & Blessings'}
          </h2>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="h-px w-12 sm:w-16 bg-[#D4AF37]/50" />
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="h-px w-12 sm:w-16 bg-[#D4AF37]/50" />
          </div>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light">
            {registryConfig.blessingMessage}
          </p>

          {/* Quick Customizer Jump */}
          {onOpenCustomizer && (
            <div className="pt-1">
              <button
                onClick={onOpenCustomizer}
                className="inline-flex items-center gap-1.5 text-xs text-amber-800/80 hover:text-amber-900 underline font-medium cursor-pointer transition-colors"
                title="Edit gift registries and bank transfer accounts"
              >
                <Edit3 className="w-3 h-3" />
                <span>Customize Registry &amp; Bank Details</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Floating Toast Alert for Copy Confirmation */}
        {toastMessage && (
          <div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 text-white animate-fade-in"
            style={{
              backgroundColor: colors.primaryMaroon,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${colors.accentGold}`,
            }}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex p-1 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: `${colors.accentGold}40`,
            }}
          >
            {registryConfig.enableBankTransfer && (
              <button
                onClick={() => setActiveTab('bank')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'bank'
                    ? 'shadow-sm text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                style={
                  activeTab === 'bank'
                    ? { backgroundColor: colors.primaryMaroon }
                    : {}
                }
              >
                <Building2 className="w-4 h-4" />
                <span>Direct Bank Transfer</span>
              </button>
            )}

            {registryConfig.enableRegistryLinks && (
              <button
                onClick={() => setActiveTab('registries')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'registries'
                    ? 'shadow-sm text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                style={
                  activeTab === 'registries'
                    ? { backgroundColor: colors.primaryMaroon }
                    : {}
                }
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Gift Registries ({registryLinks?.length || 0})</span>
              </button>
            )}

            {registryConfig.enableCharityOption && (
              <button
                onClick={() => setActiveTab('charity')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'charity'
                    ? 'shadow-sm text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                style={
                  activeTab === 'charity'
                    ? { backgroundColor: colors.primaryMaroon }
                    : {}
                }
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Sadaqah / Charity</span>
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            TAB 1: BANK ACCOUNT & WIRE TRANSFER DETAILS
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'bank' && registryConfig.enableBankTransfer && (
          <div className="space-y-6">
            <div
              className="bg-white rounded-3xl border shadow-lg overflow-hidden relative"
              style={{ borderColor: `${colors.accentGold}40` }}
            >
              {/* Card Header Banner */}
              <div
                className="px-6 py-5 border-b flex flex-wrap items-center justify-between gap-4"
                style={{
                  backgroundColor: `${colors.primaryMaroon}08`,
                  borderColor: `${colors.accentGold}25`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: colors.primaryMaroon }}
                  >
                    <Building2 className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                      {bankDetails.bankName || 'HDFC Bank Ltd.'}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {bankDetails.accountType || 'Wedding Joint Savings Account'} &bull; {bankDetails.branchName || 'Main Branch'}
                    </p>
                  </div>
                </div>

                {/* Right utility buttons: Mask toggle & Copy All */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAccountMasked(!isAccountMasked)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                    title={isAccountMasked ? 'Reveal full account number' : 'Mask account number for privacy'}
                  >
                    {isAccountMasked ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden sm:inline">Reveal</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden sm:inline">Mask</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyAllBankDetails}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer text-stone-900 active:scale-95"
                    style={{
                      backgroundColor: colors.accentGold,
                    }}
                  >
                    {copiedKey === 'all-banking' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#781729]" />
                        <span>All Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#781729]" />
                        <span>Copy All Details</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Bank Grid Details */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* 1. Account Holder Name */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                    <div className="min-w-0 pr-3">
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block font-semibold">
                        Account Holder / Beneficiary
                      </span>
                      <span className="font-serif font-bold text-base sm:text-lg text-stone-900 block truncate">
                        {bankDetails.accountHolderName}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleSecureCopy(bankDetails.accountHolderName, 'Account Holder Name', 'holder')
                      }
                      className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#D4AF37] text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Copy account holder name"
                    >
                      {copiedKey === 'holder' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-stone-500" />
                      )}
                    </button>
                  </div>

                  {/* 2. Account Number */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                    <div className="min-w-0 pr-3">
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block font-semibold flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3 text-[#D4AF37]" />
                        Account Number
                      </span>
                      <span className="font-mono font-bold text-base sm:text-lg text-stone-900 tracking-wide block truncate">
                        {formatAccountNumber(bankDetails.accountNumber)}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleSecureCopy(bankDetails.accountNumber, 'Account Number', 'acc-num')
                      }
                      className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#D4AF37] text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Copy account number"
                    >
                      {copiedKey === 'acc-num' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-stone-500" />
                      )}
                    </button>
                  </div>

                  {/* 3. IFSC / SWIFT / BIC Code */}
                  {bankDetails.ifscOrSwiftCode && (
                    <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                      <div className="min-w-0 pr-3">
                        <span className="text-[11px] uppercase tracking-wider text-stone-500 block font-semibold">
                          IFSC / SWIFT / BIC Code
                        </span>
                        <span className="font-mono font-bold text-base sm:text-lg text-stone-900 tracking-wide block truncate">
                          {bankDetails.ifscOrSwiftCode}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleSecureCopy(bankDetails.ifscOrSwiftCode || '', 'IFSC / SWIFT Code', 'swift')
                        }
                        className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#D4AF37] text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Copy IFSC / SWIFT Code"
                      >
                        {copiedKey === 'swift' ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-stone-500" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* 4. UPI ID / Zelle Handle / PayPal */}
                  {bankDetails.upiOrZelleId && (
                    <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                      <div className="min-w-0 pr-3">
                        <span className="text-[11px] uppercase tracking-wider text-stone-500 block font-semibold flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-[#D4AF37]" />
                          UPI ID / Zelle / Digital Payment
                        </span>
                        <span className="font-mono font-bold text-base sm:text-lg text-stone-900 tracking-wide block truncate">
                          {bankDetails.upiOrZelleId}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleSecureCopy(bankDetails.upiOrZelleId || '', 'UPI / Zelle ID', 'upi')
                        }
                        className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#D4AF37] text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Copy UPI / Zelle ID"
                      >
                        {copiedKey === 'upi' ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-stone-500" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* 5. International IBAN (If Available) */}
                  {bankDetails.iban && (
                    <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors md:col-span-2">
                      <div className="min-w-0 pr-3">
                        <span className="text-[11px] uppercase tracking-wider text-stone-500 block font-semibold">
                          International Bank Account Number (IBAN)
                        </span>
                        <span className="font-mono font-bold text-sm sm:text-base text-stone-900 tracking-wider block truncate">
                          {bankDetails.iban}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleSecureCopy(bankDetails.iban || '', 'IBAN Number', 'iban')
                        }
                        className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#D4AF37] text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Copy IBAN number"
                      >
                        {copiedKey === 'iban' ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-stone-500" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Helpful Note & Security Guarantee */}
                {bankDetails.note && (
                  <div
                    className="mt-6 p-4 rounded-2xl border text-xs sm:text-sm text-stone-700 flex items-start gap-3"
                    style={{
                      backgroundColor: `${colors.softCream}70`,
                      borderColor: `${colors.accentGold}30`,
                    }}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900 block mb-0.5">
                        Transfer Memo / Remarks Reminder:
                      </span>
                      <p className="leading-relaxed text-stone-600">
                        {bankDetails.note}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: CURATED ONLINE GIFT REGISTRIES
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'registries' && registryConfig.enableRegistryLinks && (
          <div className="space-y-6">
            {(!registryLinks || registryLinks.length === 0) ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
                <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-stone-800">
                  No External Registries Added Yet
                </h4>
                <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  You can easily link your Amazon, Crate &amp; Barrel, or Honeyfund registries using the customizer.
                </p>
                {onOpenCustomizer && (
                  <button
                    onClick={onOpenCustomizer}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-stone-900 shadow-sm cursor-pointer"
                    style={{ backgroundColor: colors.accentGold }}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Add Registry Links Now</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registryLinks.map((item: RegistryLink, idx: number) => {
                  const cardCopiedKey = `reg-url-${item.id}`;
                  const regIdCopiedKey = `reg-id-${item.id}`;

                  return (
                    <div
                      key={item.id || idx}
                      className="bg-white rounded-3xl border shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
                      style={{ borderColor: `${colors.accentGold}40` }}
                    >
                      {/* Top Accent Strip */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5"
                        style={{ backgroundColor: colors.accentGold }}
                      />

                      <div>
                        {/* Platform & Badge Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${colors.primaryMaroon}10`,
                              color: colors.primaryMaroon,
                            }}
                          >
                            {item.platform || 'Gift Registry'}
                          </span>

                          {item.badge && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-stone-800"
                              style={{ backgroundColor: colors.accentGold }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
                          {item.title}
                        </h4>

                        {/* Description */}
                        {item.description && (
                          <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed font-light">
                            {item.description}
                          </p>
                        )}

                        {/* Optional Registry ID / Number with instant copy */}
                        {item.registryNumber && (
                          <div className="mb-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                            <span className="text-stone-500 font-mono">
                              ID: <strong className="text-stone-800">{item.registryNumber}</strong>
                            </span>
                            <button
                              onClick={() =>
                                handleSecureCopy(item.registryNumber || '', `Registry ID (${item.platform})`, regIdCopiedKey)
                              }
                              className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-semibold cursor-pointer"
                              title="Copy Registry ID"
                            >
                              {copiedKey === regIdCopiedKey ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy ID</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action CTAs: Visit & Copy Link */}
                      <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white transition-all shadow-xs active:scale-95 text-center"
                          style={{ backgroundColor: colors.primaryMaroon }}
                        >
                          <span>Visit Registry</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </a>

                        <button
                          onClick={() =>
                            handleSecureCopy(item.url, `${item.platform} Registry Link`, cardCopiedKey)
                          }
                          className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Copy direct registry link"
                        >
                          {copiedKey === cardCopiedKey ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3: CHARITY / SADAQAH JARIYAH OPTION
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'charity' && registryConfig.enableCharityOption && (
          <div
            className="bg-white rounded-3xl border shadow-lg p-6 sm:p-10 relative overflow-hidden"
            style={{ borderColor: `${colors.accentGold}40` }}
          >
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div
                className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: colors.primaryMaroon }}
              >
                <HeartHandshake className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block"
                style={{
                  backgroundColor: `${colors.accentGold}20`,
                  color: colors.primaryMaroon,
                }}
              >
                Enduring Blessings (Barakah)
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {registryConfig.charityName || 'Sadaqah Jariyah in the Couple’s Honor'}
              </h3>

              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                {registryConfig.charityDescription ||
                  'The Prophet Muhammad ﷺ said: "When a person dies, all their deeds end except three: a continuing charity (Sadaqah Jariyah), beneficial knowledge, and a righteous child who prays for them." In lieu of a physical gift, you are warmly invited to make a donation in our honor to provide clean water or orphan care.'}
              </p>

              {registryConfig.charityUrl && (
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={registryConfig.charityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-stone-900 shadow-md transition-all transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: colors.accentGold }}
                  >
                    <span>Contribute to Sadaqah Jariyah</span>
                    <ExternalLink className="w-4 h-4 text-[#781729]" />
                  </a>

                  <button
                    onClick={() =>
                      handleSecureCopy(
                        registryConfig.charityUrl || '',
                        'Charity Donation Link',
                        'charity-link'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'charity-link' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Charity Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
