import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Palette,
  Type,
  Users,
  Calendar,
  MapPin,
  Camera,
  Heart,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Download,
  Share2,
  Upload,
  BookOpen,
  MailCheck,
  Gift,
  Building2,
  ShoppingBag,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';
import { WeddingData, WeddingEvent, GalleryPhoto, RsvpResponse, RegistryLink } from '../types';
import { THEME_PRESETS, initialWeddingData } from '../data/defaultWeddingData';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  onUpdateWeddingData: (updated: WeddingData) => void;
  initialTab?: string;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  weddingData,
  onUpdateWeddingData,
  initialTab = 'couple',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  // Helper to update root data
  const updateData = (updater: (prev: WeddingData) => WeddingData) => {
    const updated = updater(weddingData);
    onUpdateWeddingData(updated);
    triggerToast();
  };

  // Preset Color Selector
  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    updateData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        presetName: preset.name,
        colors: { ...preset.colors },
      },
    }));
  };

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'groom' | 'bride') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateData((prev) => ({
          ...prev,
          [target]: {
            ...prev[target],
            photoUrl: result,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Event
  const handleAddEvent = () => {
    const newEvent: WeddingEvent = {
      id: `event-${Date.now()}`,
      title: 'New Celebration Ceremony',
      subtitle: 'Festive Gathering & Dinner',
      date: 'Thursday, 19th November 2026',
      time: '7:00 PM Onwards',
      venueName: weddingData.venueName,
      venueAddress: weddingData.venueAddress,
      dressCode: 'Formal / Traditional',
      description: 'Join us for an evening of warm blessings, joy, and memories.',
      badge: 'Festive Gathering',
      iconType: 'sparkles',
    };
    updateData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  // Delete Event
  const handleDeleteEvent = (id: string) => {
    updateData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  // Add Gallery Photo
  const handleAddGalleryPhoto = () => {
    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      caption: 'A blessed moment of smiles & togetherness',
      category: 'Couple',
    };
    updateData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newPhoto],
    }));
  };

  // Add Registry Link
  const handleAddRegistryLink = () => {
    const newLink: RegistryLink = {
      id: `reg-${Date.now()}`,
      title: 'Our Wishlist',
      platform: 'Amazon Wedding',
      url: 'https://www.amazon.com',
      registryNumber: '',
      description: 'Heirloom essentials and cookware for our new home.',
      badge: 'Home Essentials',
    };
    updateData((prev) => ({
      ...prev,
      giftRegistry: {
        ...(prev.giftRegistry || initialWeddingData.giftRegistry),
        registryLinks: [
          ...((prev.giftRegistry && prev.giftRegistry.registryLinks) || []),
          newLink,
        ],
      },
    }));
  };

  // Delete Registry Link
  const handleDeleteRegistryLink = (id: string) => {
    updateData((prev) => ({
      ...prev,
      giftRegistry: {
        ...(prev.giftRegistry || initialWeddingData.giftRegistry),
        registryLinks: (prev.giftRegistry?.registryLinks || []).filter((r) => r.id !== id),
      },
    }));
  };

  // Reset to default Suhail & Sana
  const handleResetToDefault = () => {
    if (window.confirm('Reset all details back to the default Suhail & Sana template?')) {
      onUpdateWeddingData(initialWeddingData);
      triggerToast();
    }
  };

  // Export RSVPs to CSV
  const handleExportRsvps = () => {
    try {
      const stored = localStorage.getItem('wedding_rsvps');
      const rsvps: RsvpResponse[] = stored ? JSON.parse(stored) : [];
      if (rsvps.length === 0) {
        alert('No RSVPs have been submitted yet. Test submit one in the RSVP section below!');
        return;
      }
      const headers = ['Name', 'Contact', 'Status', 'Guests Count', 'Events', 'Dietary/Notes', 'Dua/Message', 'Submitted At'];
      const rows = rsvps.map((r) => [
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.emailOrPhone.replace(/"/g, '""')}"`,
        `"${r.attendingStatus}"`,
        r.guestsCount,
        `"${(r.attendingEvents || []).join(', ').replace(/"/g, '""')}"`,
        `"${(r.dietaryOrNotes || '').replace(/"/g, '""')}"`,
        `"${(r.duaOrMessage || '').replace(/"/g, '""')}"`,
        `"${r.submittedAt}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${weddingData.groom.callingName}_${weddingData.bride.callingName}_Wedding_RSVPs.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Could not export RSVPs.');
    }
  };

  // Copy Share Link
  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Get current stored RSVPs for view
  let storedRsvps: RsvpResponse[] = [];
  try {
    const raw = localStorage.getItem('wedding_rsvps');
    if (raw) storedRsvps = JSON.parse(raw);
  } catch {
    storedRsvps = [];
  }

  const tabs = [
    { id: 'couple', label: 'Bride & Groom', icon: Heart },
    { id: 'family', label: 'Families & Elders', icon: Users },
    { id: 'date-venue', label: 'Date & Venue', icon: MapPin },
    { id: 'events', label: 'Event Schedule', icon: Calendar },
    { id: 'theme', label: 'Theme & Fonts', icon: Palette },
    { id: 'gallery', label: 'Photos', icon: Camera },
    { id: 'registry', label: 'Gift Registry', icon: Gift },
    { id: 'rsvps', label: `RSVPs (${storedRsvps.length})`, icon: MailCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Website Live Changes Applied!</span>
        </div>
      )}

      {/* Slide-over Drawer Panel */}
      <div
        className="w-full max-w-2xl h-full bg-[#FAF6EE] text-[#2C1810] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#D4AF37]/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/30 bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#781729] text-[#FAF6EE] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Customize Everything
              </h3>
              <p className="text-[11px] text-stone-500">
                Live interactive editor — changes reflect on the page instantly!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              title="Reset to default Suhail & Sana data"
              className="p-1.5 rounded-lg border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-stone-200 overflow-x-auto bg-stone-100/60 scrollbar-none text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#781729] text-[#FAF6EE] shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: BRIDE & GROOM */}
          {activeTab === 'couple' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                ✨ Edit names, nicknames, bios, titles, and photos for both Groom &amp; Bride. Changes appear immediately in the hero, story cards, and cards.
              </div>

              {/* Groom Details */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729] flex items-center justify-between">
                  <span>Groom Information</span>
                  <span className="text-xs text-stone-400 font-sans font-normal">Primary</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Full Formal Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.groom.fullName}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, fullName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Short / Calling Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.groom.callingName}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, callingName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Title / Role
                    </label>
                    <input
                      type="text"
                      value={weddingData.groom.title}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Education / Profession
                    </label>
                    <input
                      type="text"
                      value={weddingData.groom.educationOrProfession || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, educationOrProfession: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Groom&apos;s Parents Lineage
                  </label>
                  <input
                    type="text"
                    value={weddingData.groom.parents}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groom: { ...prev.groom, parents: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Groom Bio / Quote
                  </label>
                  <textarea
                    rows={2}
                    value={weddingData.groom.bio}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groom: { ...prev.groom, bio: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50 resize-none"
                  />
                </div>

                {/* Groom Photo URL + Upload file */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Groom Photo (Image URL or Upload from Computer)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={weddingData.groom.photoUrl}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          groom: { ...prev.groom, photoUrl: e.target.value },
                        }))
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      placeholder="Paste Image URL"
                    />
                    <label className="px-3 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'groom')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Bride Details */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729] flex items-center justify-between">
                  <span>Bride Information</span>
                  <span className="text-xs text-stone-400 font-sans font-normal">Primary</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Full Formal Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.bride.fullName}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, fullName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Short / Calling Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.bride.callingName}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, callingName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Title / Role
                    </label>
                    <input
                      type="text"
                      value={weddingData.bride.title}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                      Education / Profession
                    </label>
                    <input
                      type="text"
                      value={weddingData.bride.educationOrProfession || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, educationOrProfession: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Bride&apos;s Parents Lineage
                  </label>
                  <input
                    type="text"
                    value={weddingData.bride.parents}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        bride: { ...prev.bride, parents: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Bride Bio / Quote
                  </label>
                  <textarea
                    rows={2}
                    value={weddingData.bride.bio}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        bride: { ...prev.bride, bio: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50 resize-none"
                  />
                </div>

                {/* Bride Photo URL + Upload */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Bride Photo (Image URL or Upload from Computer)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={weddingData.bride.photoUrl}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          bride: { ...prev.bride, photoUrl: e.target.value },
                        }))
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      placeholder="Paste Image URL"
                    />
                    <label className="px-3 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'bride')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Hashtag & Subtitle */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Hashtag &amp; Invitation Motto
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Wedding Hashtag
                  </label>
                  <input
                    type="text"
                    value={weddingData.heroHashtag}
                    onChange={(e) =>
                      updateData((prev) => ({ ...prev, heroHashtag: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={weddingData.heroSubtitle}
                    onChange={(e) =>
                      updateData((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FAMILIES & ELDERS */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              {/* Groom's Family */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729]">
                  Groom&apos;s Family Details
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Family Name Heading
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomFamily.familyName}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groomFamily: { ...prev.groomFamily, familyName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Parents
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomFamily.parents}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groomFamily: { ...prev.groomFamily, parents: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Elders / Grandparents
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomFamily.grandparents || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groomFamily: { ...prev.groomFamily, grandparents: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Residence / City
                  </label>
                  <input
                    type="text"
                    value={weddingData.groomFamily.residence}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groomFamily: { ...prev.groomFamily, residence: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Cordial Welcome Message
                  </label>
                  <textarea
                    rows={2}
                    value={weddingData.groomFamily.welcomeMessage}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        groomFamily: { ...prev.groomFamily, welcomeMessage: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>
              </div>

              {/* Bride's Family */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729]">
                  Bride&apos;s Family Details
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Family Name Heading
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideFamily.familyName}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        brideFamily: { ...prev.brideFamily, familyName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Parents
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideFamily.parents}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        brideFamily: { ...prev.brideFamily, parents: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Elders / Grandparents
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideFamily.grandparents || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        brideFamily: { ...prev.brideFamily, grandparents: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Residence / City
                  </label>
                  <input
                    type="text"
                    value={weddingData.brideFamily.residence}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        brideFamily: { ...prev.brideFamily, residence: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Cordial Welcome Message
                  </label>
                  <textarea
                    rows={2}
                    value={weddingData.brideFamily.welcomeMessage}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        brideFamily: { ...prev.brideFamily, welcomeMessage: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATE & VENUE */}
          {activeTab === 'date-venue' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729]">
                  Main Wedding Date &amp; Countdown Target
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    ISO Date &amp; Time (Controls Countdown &amp; Calendar)
                  </label>
                  <input
                    type="datetime-local"
                    value={weddingData.weddingDate.slice(0, 16)}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        weddingDate: e.target.value + ':00',
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Formatted Date Text (Displayed in Scratch Card &amp; Hero)
                  </label>
                  <input
                    type="text"
                    value={weddingData.weddingDateFormatted}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        weddingDateFormatted: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Ceremony Time Text
                  </label>
                  <input
                    type="text"
                    value={weddingData.weddingTime}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        weddingTime: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729]">
                  Venue Information &amp; Google Maps
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Venue / Palace Name
                  </label>
                  <input
                    type="text"
                    value={weddingData.venueName}
                    onChange={(e) =>
                      updateData((prev) => ({ ...prev, venueName: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Street Address &amp; Gate Landmark
                  </label>
                  <input
                    type="text"
                    value={weddingData.venueAddress}
                    onChange={(e) =>
                      updateData((prev) => ({ ...prev, venueAddress: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={weddingData.venueCity}
                    onChange={(e) =>
                      updateData((prev) => ({ ...prev, venueCity: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={weddingData.googleMapsUrl}
                    onChange={(e) =>
                      updateData((prev) => ({ ...prev, googleMapsUrl: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-stone-50"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVENT SCHEDULE */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {weddingData.events.length} Events Configured
                </span>
                <button
                  onClick={handleAddEvent}
                  className="px-3 py-1.5 rounded-full bg-[#781729] text-[#FAF6EE] text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ceremony</span>
                </button>
              </div>

              {weddingData.events.map((ev, idx) => (
                <div key={ev.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 relative">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-[#781729]">
                      Event {idx + 1}: {ev.title}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Delete this event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.map((x) => (x.id === ev.id ? { ...x, title: val } : x)),
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500">
                        Badge (e.g. Main Wedding Day)
                      </label>
                      <input
                        type="text"
                        value={ev.badge || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.map((x) => (x.id === ev.id ? { ...x, badge: val } : x)),
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500">
                        Date Text
                      </label>
                      <input
                        type="text"
                        value={ev.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.map((x) => (x.id === ev.id ? { ...x, date: val } : x)),
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500">
                        Time
                      </label>
                      <input
                        type="text"
                        value={ev.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            events: prev.events.map((x) => (x.id === ev.id ? { ...x, time: val } : x)),
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-500">
                      Dress Code / Attire Recommendation
                    </label>
                    <input
                      type="text"
                      value={ev.dressCode || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          events: prev.events.map((x) => (x.id === ev.id ? { ...x, dressCode: val } : x)),
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-500">
                      Ceremony Description
                    </label>
                    <textarea
                      rows={2}
                      value={ev.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          events: prev.events.map((x) => (x.id === ev.id ? { ...x, description: val } : x)),
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: THEME, COLORS & FONTS */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Color Presets */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif font-bold text-base text-[#781729]">
                  Luxury Color Palette Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = weddingData.theme.presetName === preset.name;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#781729] bg-amber-50/50 shadow-xs'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-semibold block text-stone-800">
                            {preset.name.split('(')[0]}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {preset.name.includes('(') ? preset.name.split('(')[1].replace(')', '') : 'Luxury Palette'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.colors.primaryMaroon }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.colors.accentGold }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.colors.creamBg }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Custom Color Pickers
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Primary Royal Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={weddingData.theme.colors.primaryMaroon}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              colors: { ...prev.theme.colors, primaryMaroon: e.target.value },
                            },
                          }))
                        }
                        className="w-9 h-9 rounded-lg border border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono">{weddingData.theme.colors.primaryMaroon}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Accent Gold / Metallic
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={weddingData.theme.colors.accentGold}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              colors: { ...prev.theme.colors, accentGold: e.target.value },
                            },
                          }))
                        }
                        className="w-9 h-9 rounded-lg border border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono">{weddingData.theme.colors.accentGold}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Family Choice */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Typography Pairing
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'cormorant', name: 'Cormorant Garamond (Royal French Serif)' },
                    { id: 'playfair', name: 'Playfair Display (Bold Editorial)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() =>
                        updateData((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, fontFamily: f.id as 'cormorant' | 'playfair' },
                        }))
                      }
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        weddingData.theme.fontFamily === f.id
                          ? 'border-[#781729] bg-amber-50/50 font-bold'
                          : 'border-stone-200'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Islamic Elements & Bismillah */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#781729]">
                  Islamic Calligraphy &amp; Verses
                </h4>

                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weddingData.theme.enableBismillah}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, enableBismillah: e.target.checked },
                      }))
                    }
                    className="accent-[#781729] w-4 h-4"
                  />
                  <span>Show Bismillah Calligraphy in Hero Header</span>
                </label>

                <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weddingData.theme.enableIslamicVerse}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, enableIslamicVerse: e.target.checked },
                      }))
                    }
                    className="accent-[#781729] w-4 h-4"
                  />
                  <span>Show Quranic Matrimony Verse</span>
                </label>

                {weddingData.theme.enableIslamicVerse && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                        Verse Translation
                      </label>
                      <textarea
                        rows={2}
                        value={weddingData.theme.verseTranslation}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, verseTranslation: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                        Surah Reference
                      </label>
                      <input
                        type="text"
                        value={weddingData.theme.verseReference}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, verseReference: e.target.value },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: PHOTOS GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {weddingData.gallery.length} Photos in Gallery
                </span>
                <button
                  onClick={handleAddGalleryPhoto}
                  className="px-3 py-1.5 rounded-full bg-[#781729] text-[#FAF6EE] text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>

              {weddingData.gallery.map((photo, idx) => (
                <div key={photo.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-start gap-4">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={photo.url}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.map((p) => (p.id === photo.id ? { ...p, url: val } : p)),
                        }));
                      }}
                      placeholder="Photo URL"
                      className="w-full px-2 py-1 rounded-md border border-stone-300 text-xs bg-stone-50"
                    />
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.map((p) => (p.id === photo.id ? { ...p, caption: val } : p)),
                        }));
                      }}
                      placeholder="Caption"
                      className="w-full px-2 py-1 rounded-md border border-stone-300 text-xs bg-stone-50"
                    />
                  </div>
                  <button
                    onClick={() =>
                      updateData((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((p) => p.id !== photo.id),
                      }))
                    }
                    className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: GIFT REGISTRY & BANK TRANSFER DETAILS */}
          {activeTab === 'registry' && (
            <div className="space-y-6">
              {(() => {
                const regData = weddingData.giftRegistry || initialWeddingData.giftRegistry;
                const bank = regData.bankDetails;
                const links = regData.registryLinks || [];

                const updateReg = (updater: (prevReg: typeof regData) => typeof regData) => {
                  updateData((prev) => ({
                    ...prev,
                    giftRegistry: updater(prev.giftRegistry || initialWeddingData.giftRegistry),
                  }));
                };

                return (
                  <>
                    {/* Header Banner */}
                    <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                      <Gift className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Gift Registry &amp; Banking Details</strong>
                        <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                          Guests can view external registry links (Amazon, Crate &amp; Barrel, Honeyfund) or copy bank account &amp; UPI/Zelle numbers with one-click secure clipboard buttons.
                        </p>
                      </div>
                    </div>

                    {/* Master Enable/Disable */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <strong className="text-xs font-semibold text-stone-900 block">
                          Display Gift Registry Section
                        </strong>
                        <span className="text-[11px] text-stone-500">
                          Toggle visibility of the entire Gift Registry section on the website.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={regData.enabled !== false}
                        onChange={(e) =>
                          updateReg((r) => ({ ...r, enabled: e.target.checked }))
                        }
                        className="w-4 h-4 accent-[#781729] rounded cursor-pointer"
                      />
                    </div>

                    {/* Section Titles & Blessing Message */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        Section Heading &amp; Blessing Message
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Section Main Title
                          </label>
                          <input
                            type="text"
                            value={regData.sectionTitle}
                            onChange={(e) =>
                              updateReg((r) => ({ ...r, sectionTitle: e.target.value }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Section Subtitle / Badge
                          </label>
                          <input
                            type="text"
                            value={regData.sectionSubtitle}
                            onChange={(e) =>
                              updateReg((r) => ({ ...r, sectionSubtitle: e.target.value }))
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Gracious Message to Guests
                        </label>
                        <textarea
                          rows={3}
                          value={regData.blessingMessage}
                          onChange={(e) =>
                            updateReg((r) => ({ ...r, blessingMessage: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                        />
                      </div>
                    </div>

                    {/* Bank Transfer Details Form */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#781729]" />
                          <h4 className="font-serif font-bold text-sm text-stone-900">
                            Direct Bank &amp; UPI/Zelle Details
                          </h4>
                        </div>
                        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={regData.enableBankTransfer !== false}
                            onChange={(e) =>
                              updateReg((r) => ({ ...r, enableBankTransfer: e.target.checked }))
                            }
                            className="w-3.5 h-3.5 accent-[#781729] rounded"
                          />
                          <span>Enable Bank Details</span>
                        </label>
                      </div>

                      {regData.enableBankTransfer !== false && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Account Holder / Beneficiary Name
                            </label>
                            <input
                              type="text"
                              value={bank.accountHolderName}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, accountHolderName: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={bank.accountNumber}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, accountNumber: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={bank.bankName}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, bankName: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Branch Name / Location
                            </label>
                            <input
                              type="text"
                              value={bank.branchName || ''}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, branchName: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              IFSC / SWIFT / BIC Code
                            </label>
                            <input
                              type="text"
                              value={bank.ifscOrSwiftCode || ''}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, ifscOrSwiftCode: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-mono uppercase"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              UPI ID / Zelle Handle / PayPal
                            </label>
                            <input
                              type="text"
                              value={bank.upiOrZelleId || ''}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, upiOrZelleId: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                              placeholder="e.g. suhail@okhdfcbank or phone/email"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Account Type
                            </label>
                            <input
                              type="text"
                              value={bank.accountType || ''}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, accountType: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                              placeholder="e.g. Wedding Joint Savings Account"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              IBAN Code (International)
                            </label>
                            <input
                              type="text"
                              value={bank.iban || ''}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, iban: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                              placeholder="e.g. IN56 HDFC 0001 7865..."
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="font-semibold text-stone-600 block mb-1">
                              Payment Remarks / Memo Note Reminder
                            </label>
                            <input
                              type="text"
                              value={bank.note || ''}
                              onChange={(e) =>
                                updateReg((r) => ({
                                  ...r,
                                  bankDetails: { ...r.bankDetails, note: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                              placeholder="e.g. Kindly mention your name in remarks so we may thank you!"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Curated External Registry Links */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#781729]" />
                          <h4 className="font-serif font-bold text-sm text-stone-900">
                            Curated Gift Registry Links ({links.length})
                          </h4>
                        </div>
                        <button
                          onClick={handleAddRegistryLink}
                          className="px-3 py-1 rounded-full bg-[#D4AF37] text-stone-900 text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#e0bc46] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Registry</span>
                        </button>
                      </div>

                      {links.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">
                          No external registries added. Click &ldquo;Add Registry&rdquo; above to link your wishlist.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {links.map((link) => (
                            <div
                              key={link.id}
                              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2.5 relative"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#781729] uppercase tracking-wider">
                                  Registry Link Entry
                                </span>
                                <button
                                  onClick={() => handleDeleteRegistryLink(link.id)}
                                  className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                                  title="Delete Registry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                                    Platform / Store Name
                                  </label>
                                  <input
                                    type="text"
                                    value={link.platform}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateReg((r) => ({
                                        ...r,
                                        registryLinks: r.registryLinks.map((l) =>
                                          l.id === link.id ? { ...l, platform: val } : l
                                        ),
                                      }));
                                    }}
                                    placeholder="e.g. Amazon Wedding"
                                    className="w-full px-2.5 py-1 rounded border border-stone-300 bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                                    Wishlist / Registry Title
                                  </label>
                                  <input
                                    type="text"
                                    value={link.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateReg((r) => ({
                                        ...r,
                                        registryLinks: r.registryLinks.map((l) =>
                                          l.id === link.id ? { ...l, title: val } : l
                                        ),
                                      }));
                                    }}
                                    placeholder="e.g. Home Essentials"
                                    className="w-full px-2.5 py-1 rounded border border-stone-300 bg-white"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                                    Registry Direct URL
                                  </label>
                                  <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateReg((r) => ({
                                        ...r,
                                        registryLinks: r.registryLinks.map((l) =>
                                          l.id === link.id ? { ...l, url: val } : l
                                        ),
                                      }));
                                    }}
                                    placeholder="https://..."
                                    className="w-full px-2.5 py-1 rounded border border-stone-300 bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                                    Registry Number / ID (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={link.registryNumber || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateReg((r) => ({
                                        ...r,
                                        registryLinks: r.registryLinks.map((l) =>
                                          l.id === link.id ? { ...l, registryNumber: val } : l
                                        ),
                                      }));
                                    }}
                                    placeholder="e.g. WR-786-9021"
                                    className="w-full px-2.5 py-1 rounded border border-stone-300 bg-white font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                                    Category Badge (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={link.badge || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateReg((r) => ({
                                        ...r,
                                        registryLinks: r.registryLinks.map((l) =>
                                          l.id === link.id ? { ...l, badge: val } : l
                                        ),
                                      }));
                                    }}
                                    placeholder="e.g. Home Essentials, Decor"
                                    className="w-full px-2.5 py-1 rounded border border-stone-300 bg-white"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                                    Short Description
                                  </label>
                                  <input
                                    type="text"
                                    value={link.description || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateReg((r) => ({
                                        ...r,
                                        registryLinks: r.registryLinks.map((l) =>
                                          l.id === link.id ? { ...l, description: val } : l
                                        ),
                                      }));
                                    }}
                                    placeholder="Short message or description of items on this registry"
                                    className="w-full px-2.5 py-1 rounded border border-stone-300 bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Charity / Sadaqah Jariyah Option */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="w-4 h-4 text-[#781729]" />
                          <h4 className="font-serif font-bold text-sm text-stone-900">
                            Sadaqah Jariyah / Charitable Cause
                          </h4>
                        </div>
                        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={regData.enableCharityOption !== false}
                            onChange={(e) =>
                              updateReg((r) => ({ ...r, enableCharityOption: e.target.checked }))
                            }
                            className="w-3.5 h-3.5 accent-[#781729] rounded"
                          />
                          <span>Enable Charity Option</span>
                        </label>
                      </div>

                      {regData.enableCharityOption !== false && (
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Charity Cause / Campaign Name
                            </label>
                            <input
                              type="text"
                              value={regData.charityName || ''}
                              onChange={(e) =>
                                updateReg((r) => ({ ...r, charityName: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                              placeholder="e.g. Sadaqah Jariyah — Water Well Project"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Charity Organization Donation Link
                            </label>
                            <input
                              type="url"
                              value={regData.charityUrl || ''}
                              onChange={(e) =>
                                updateReg((r) => ({ ...r, charityUrl: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                              placeholder="https://www.islamic-relief.org"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-stone-600 block mb-1">
                              Charity Callout Description / Du’a
                            </label>
                            <textarea
                              rows={2}
                              value={regData.charityDescription || ''}
                              onChange={(e) =>
                                updateReg((r) => ({ ...r, charityDescription: e.target.value }))
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50"
                              placeholder="Explain why this charity brings Barakah to your marriage..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 8: RSVPS MANAGER */}
          {activeTab === 'rsvps' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    RSVP Responses ({storedRsvps.length})
                  </h4>
                  <p className="text-xs text-stone-500">
                    Total Attending Guests:{' '}
                    <strong className="text-emerald-700">
                      {storedRsvps.reduce((acc, curr) => acc + (curr.guestsCount || 0), 0)}
                    </strong>
                  </p>
                </div>

                <button
                  onClick={handleExportRsvps}
                  className="px-3.5 py-1.5 rounded-full bg-[#781729] text-[#FAF6EE] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {storedRsvps.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border text-center text-stone-500 text-xs">
                  No RSVPs have been submitted yet. Guests who fill out the RSVP form on the website will be logged here and can be exported as an Excel/CSV spreadsheet.
                </div>
              ) : (
                <div className="space-y-3">
                  {storedRsvps.map((rsvp) => (
                    <div key={rsvp.id} className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-semibold text-stone-900">{rsvp.name}</strong>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rsvp.attendingStatus === 'attending'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {rsvp.attendingStatus === 'attending' ? `${rsvp.guestsCount} Guests` : 'Declined'}
                        </span>
                      </div>
                      <p className="text-stone-500">Contact: {rsvp.emailOrPhone}</p>
                      {rsvp.duaOrMessage && (
                        <p className="text-stone-700 italic bg-amber-50/60 p-2 rounded-lg mt-1">
                          &ldquo;{rsvp.duaOrMessage}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#D4AF37]/30 bg-white/80 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyShareLink}
            className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Link Copied!' : 'Share Invitation'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5"
            style={{
              backgroundColor: weddingData.theme.colors.primaryMaroon,
              color: '#FAF6EE',
            }}
          >
            <Check className="w-4 h-4 text-[#D4AF37]" />
            <span>Done Customizing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
