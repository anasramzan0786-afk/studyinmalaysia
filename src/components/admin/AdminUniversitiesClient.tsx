'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  X, 
  AlertCircle,
  Globe,
  MapPin,
  DollarSign,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatMYR } from '@/lib/utils';

interface UniversityWithCount {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: string;
  qsRank: string | null;
  location: string;
  city?: string | null;
  state?: string | null;
  image?: string | null;
  logo?: string | null;
  websiteUrl?: string | null;
  emgsFeeMYR?: number | null;
  miscFeesMYR?: number | null;
  totalInitialMYR: number | null;
  tuitionBachelor?: string | null;
  tuitionMaster?: string | null;
  tuitionPhd?: string | null;
  hostelMonthly?: string | null;
  livingCostTier?: string | null;
  livingCostMonthly?: number | null;
  intakeMonths?: string | null;
  description?: string | null;
  highlights?: string | null;
  featured?: boolean;
  _count: { programs: number };
}

const PRESET_IMAGES = [
  { label: 'Modern Campus Park', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80' },
  { label: 'Academic High-Rise', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80' },
  { label: 'Grand University Hall', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80' },
  { label: 'Futuristic Tech Campus', url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80' },
];

export function AdminUniversitiesClient({
  initialUniversities,
}: {
  initialUniversities: UniversityWithCount[];
}) {
  const searchParams = useSearchParams();
  const [universities, setUniversities] = useState<UniversityWithCount[]>(initialUniversities);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<UniversityWithCount | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [type, setType] = useState('Private Premier');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [qsRank, setQsRank] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [logo, setLogo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [emgsFeeMYR, setEmgsFeeMYR] = useState(3500);
  const [miscFeesMYR, setMiscFeesMYR] = useState(6000);
  const [tuitionBachelor, setTuitionBachelor] = useState('RM 55,000 - RM 75,000');
  const [tuitionMaster, setTuitionMaster] = useState('RM 30,000 - RM 45,000');
  const [tuitionPhd, setTuitionPhd] = useState('RM 45,000 - RM 60,000');
  const [hostelMonthly, setHostelMonthly] = useState('RM 600 - RM 1,100 /mo');
  const [livingCostTier, setLivingCostTier] = useState('Moderate');
  const [intakeMonths, setIntakeMonths] = useState('January, May, September');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState('MQA & MOHE Accredited\nHigh Visa Approval Ratio for Pakistan\nDirect Admissions Assistance\nModern Campus Facilities');
  const [featured, setFeatured] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-open modal if ?add=true in query param
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenAddModal();
    }
  }, [searchParams]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingUni(null);
    setName('');
    setShortName('');
    setType('Private Premier');
    setLocation('Kuala Lumpur / Selangor');
    setCity('Kuala Lumpur');
    setStateName('Wilayah Persekutuan');
    setQsRank('');
    setImage(PRESET_IMAGES[0].url);
    setLogo('');
    setWebsiteUrl('');
    setEmgsFeeMYR(3500);
    setMiscFeesMYR(6000);
    setTuitionBachelor('RM 55,000 - RM 75,000');
    setTuitionMaster('RM 30,000 - RM 45,000');
    setTuitionPhd('RM 45,000 - RM 60,000');
    setHostelMonthly('RM 600 - RM 1,100 /mo');
    setLivingCostTier('Moderate');
    setIntakeMonths('January, May, September');
    setDescription('');
    setHighlights('MQA & MOHE Accredited\nHigh Visa Approval Ratio for Pakistan\nDirect Admissions Assistance\nModern Campus Facilities');
    setFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (uni: UniversityWithCount) => {
    setEditingUni(uni);
    setName(uni.name);
    setShortName(uni.shortName);
    setType(uni.type);
    setLocation(uni.location);
    setCity(uni.city || '');
    setStateName(uni.state || '');
    setQsRank(uni.qsRank || '');
    setImage(uni.image || PRESET_IMAGES[0].url);
    setLogo(uni.logo || '');
    setWebsiteUrl(uni.websiteUrl || '');
    setEmgsFeeMYR(uni.emgsFeeMYR || 3500);
    setMiscFeesMYR(uni.miscFeesMYR || 6000);
    setTuitionBachelor(uni.tuitionBachelor || 'RM 55,000 - RM 75,000');
    setTuitionMaster(uni.tuitionMaster || 'RM 30,000 - RM 45,000');
    setTuitionPhd(uni.tuitionPhd || 'RM 45,000 - RM 60,000');
    setHostelMonthly(uni.hostelMonthly || 'RM 600 - RM 1,100 /mo');
    setLivingCostTier(uni.livingCostTier || 'Moderate');
    setIntakeMonths(uni.intakeMonths || 'January, May, September');
    setDescription(uni.description || '');

    let hlStr = '';
    if (uni.highlights) {
      try {
        const parsed = JSON.parse(uni.highlights);
        hlStr = Array.isArray(parsed) ? parsed.join('\n') : uni.highlights;
      } catch {
        hlStr = uni.highlights;
      }
    }
    setHighlights(hlStr);
    setFeatured(Boolean(uni.featured));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, uniName: string) => {
    if (!confirm(`Are you sure you want to delete "${uniName}"? This will remove the university and associated listings from the database.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/universities?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-confirm': 'true' },
      });
      if (res.ok) {
        setUniversities((prev) => prev.filter((u) => u.id !== id));
        showNotification(`"${uniName}" deleted successfully.`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete university');
      }
    } catch {
      alert('Failed to delete university due to network error.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortName.trim() || !location.trim()) {
      alert('Please fill in the University Name, Short Name, and Campus Location.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name,
      shortName,
      type,
      location,
      city,
      state: stateName,
      qsRank,
      image,
      logo,
      websiteUrl,
      emgsFeeMYR: Number(emgsFeeMYR),
      miscFeesMYR: Number(miscFeesMYR),
      tuitionBachelor,
      tuitionMaster,
      tuitionPhd,
      hostelMonthly,
      livingCostTier,
      intakeMonths,
      description,
      highlights,
      featured,
    };

    try {
      if (editingUni) {
        // Update
        const res = await fetch('/api/universities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingUni.id, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.university) {
          setUniversities((prev) =>
            prev.map((u) => (u.id === editingUni.id ? { ...u, ...data.university } : u))
          );
          setIsModalOpen(false);
          showNotification(`"${data.university.name}" updated successfully.`);
        } else {
          alert(data.error || 'Failed to update university');
        }
      } else {
        // Create
        const res = await fetch('/api/universities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.university) {
          setUniversities((prev) => [data.university, ...prev]);
          setIsModalOpen(false);
          showNotification(`"${data.university.name}" added successfully to universities list!`);
        } else {
          alert(data.error || 'Failed to create university');
        }
      }
    } catch {
      alert('An unexpected error occurred while saving university.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = universities.filter((u) => {
    if (selectedType !== 'All' && u.type !== selectedType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        (u.qsRank && u.qsRank.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCalculatedInitial = (Number(emgsFeeMYR) || 0) + (Number(miscFeesMYR) || 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B2553] text-white px-5 py-3 rounded-xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0B2553]">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0B2553] tracking-tight">
                Manage Universities
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {universities.length} accredited institutions configured in the database.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="btn-meezab-gold inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New University</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search universities by name, acronym, location, or QS rank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Type:
          </span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Categories ({universities.length})</option>
            <option value="Private Premier">Private Premier</option>
            <option value="Public Research">Public Research</option>
            <option value="International Branch">International Branch</option>
          </select>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">University Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">QS Rank</th>
                <th className="py-3.5 px-4">Programs</th>
                <th className="py-3.5 px-4">Upfront Package</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No universities match your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the search filters or add a new university.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {u.logo ? (
                          <img
                            src={u.logo}
                            alt=""
                            className="w-8 h-8 rounded-lg object-contain border border-slate-200 bg-white p-0.5 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center font-bold text-blue-700 text-xs shrink-0">
                            {u.shortName.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.featured && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Acronym: {u.shortName} • {u.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px] whitespace-nowrap">
                        {u.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{u.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-amber-700">
                      {u.qsRank || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                        {u._count.programs} courses
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatMYR(u.totalInitialMYR || 11000)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/universities/${u.slug}`}
                          target="_blank"
                          title="View Public Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit University"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          title="Delete University"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit University Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-[#0B2553] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base">
                    {editingUni ? `Edit Institution: ${editingUni.name}` : 'Add New University'}
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    Configure institutional parameters, statutory upfront fees, and academic profile.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Section 1: Basic Institutional Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5 text-xs uppercase tracking-wider text-[#0B2553]">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>1. Institutional Identity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full University Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunway University"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Short Name / Acronym *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunway"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Institution Category *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600 bg-white"
                    >
                      <option value="Private Premier">Private Premier</option>
                      <option value="Public Research">Public Research</option>
                      <option value="International Branch">International Branch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Campus Location / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bandar Sunway, Subang Jaya, Selangor"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Subang Jaya"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Selangor"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Accreditation & Rankings */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5 text-xs uppercase tracking-wider text-[#0B2553]">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>2. Accreditation &amp; Online Presence</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      QS World / Asian Ranking
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. QS #580 Worldwide / 5-Star SETARA"
                      value={qsRank}
                      onChange={(e) => setQsRank(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official University Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://university.edu.my"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="featuredCheckbox" className="font-bold text-slate-700 cursor-pointer">
                    Feature on Homepage &amp; Top Recommendations
                  </label>
                </div>
              </div>

              {/* Section 3: Upfront Financial Package */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5 text-xs uppercase tracking-wider text-[#0B2553]">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>3. Statutory Upfront Package (MYR)</span>
                </h4>

                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/60 mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-emerald-900 block text-xs">
                        Calculated Initial Upfront Package:
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        EMGS statutory fees + University admin &amp; bond fees
                      </span>
                    </div>
                    <span className="text-lg font-black text-emerald-800">
                      {formatMYR(totalCalculatedInitial)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      EMGS Visa &amp; Medical Fee (MYR)
                    </label>
                    <input
                      type="number"
                      value={emgsFeeMYR}
                      onChange={(e) => setEmgsFeeMYR(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600 font-mono"
                    />
                    <span className="text-[10px] text-slate-400">Standard statutory range: RM 3,000 - RM 4,500</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Misc / Registration &amp; Bond Fee (MYR)
                    </label>
                    <input
                      type="number"
                      value={miscFeesMYR}
                      onChange={(e) => setMiscFeesMYR(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600 font-mono"
                    />
                    <span className="text-[10px] text-slate-400">University initial admin package: RM 5,000 - RM 8,000</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Tuition & Living Estimates */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5 text-xs uppercase tracking-wider text-[#0B2553]">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>4. Tuition &amp; Living Estimates</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bachelor's Range
                    </label>
                    <input
                      type="text"
                      placeholder="RM 60k - 85k"
                      value={tuitionBachelor}
                      onChange={(e) => setTuitionBachelor(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Master's Range
                    </label>
                    <input
                      type="text"
                      placeholder="RM 35k - 45k"
                      value={tuitionMaster}
                      onChange={(e) => setTuitionMaster(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      PhD Range
                    </label>
                    <input
                      type="text"
                      placeholder="RM 50k - 65k"
                      value={tuitionPhd}
                      onChange={(e) => setTuitionPhd(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Monthly Hostel
                    </label>
                    <input
                      type="text"
                      placeholder="RM 600 - RM 1,100 /mo"
                      value={hostelMonthly}
                      onChange={(e) => setHostelMonthly(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Living Cost Tier
                    </label>
                    <select
                      value={livingCostTier}
                      onChange={(e) => setLivingCostTier(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600 bg-white"
                    >
                      <option value="Low-Mod">Low-Moderate (RM 1,200 - 1,500)</option>
                      <option value="Moderate">Moderate (RM 1,500 - 1,800)</option>
                      <option value="High">High (RM 1,800 - 2,500)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Intake Cycles
                    </label>
                    <input
                      type="text"
                      placeholder="January, May, September"
                      value={intakeMonths}
                      onChange={(e) => setIntakeMonths(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Media & Description */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b pb-1.5 text-xs uppercase tracking-wider text-[#0B2553]">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>5. Branding &amp; Campus Narrative</span>
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Campus Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600 mb-2"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-400">Presets:</span>
                    {PRESET_IMAGES.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImage(p.url)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          image === p.url
                            ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Logo Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://.../logo.png"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Campus Overview &amp; Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Overview of faculties, campus atmosphere, hospital affiliations, dual degree options..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Key Highlights (One point per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="5-Star SETARA Rated&#10;Direct Hospital Clinical Placements&#10;High Visa Approval Track for Pakistan"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-600 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-meezab-navy px-6 py-2.5 rounded-xl font-bold text-white shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? 'Saving University...'
                    : editingUni
                    ? 'Update University'
                    : 'Save & Publish University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
