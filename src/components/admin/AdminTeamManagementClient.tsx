'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Building2,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Plane,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  X,
  Download,
  Building,
  GraduationCap,
  Sparkles,
  MapPin,
  TrendingUp,
  History,
  ShieldCheck,
  Award,
  UserPlus
} from 'lucide-react';
import { PAKISTAN_BRANCHES, CASE_STAGES } from '@/lib/team-config';

interface TrackedCounselorItem {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  branch: string;
  active: boolean;
}

interface CaseTimelineItem {
  id: string;
  action: string;
  title: string;
  details: string | null;
  performedBy: string;
  createdAt: string | Date;
}

interface ReferralItem {
  id: string;
  caseId: string;
  fromBranch: string;
  toBranch: string;
  referredBy: string;
  handledBy: string | null;
  reason: string | null;
  status: string;
  transferDate: string | Date;
  notes: string | null;
  studentCase?: {
    id: string;
    studentName: string;
    phone: string;
    targetUniversity: string;
    targetProgram: string;
    status: string;
    counselorName: string | null;
    bookingDone: boolean;
  };
}

interface StudentCaseItem {
  id: string;
  studentName: string;
  passportNumber: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  counselorId: string | null;
  counselorName: string | null;
  branch: string;
  targetUniversity: string;
  targetProgram: string;
  intake: string;
  degreeLevel: string | null;
  status: string;
  bookingDone?: boolean;
  reachedMalaysia?: boolean;
  offerLetterStatus: string | null;
  emgsPaid: boolean;
  emgsPaymentDate: string | Date | null;
  emgsRefNumber: string | null;
  valPercentage: number | null;
  valStatus: string | null;
  valIssuedDate: string | Date | null;
  visaStatus: string | null;
  visaDate: string | Date | null;
  travelDate: string | Date | null;
  caseClosedDate: string | Date | null;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  referrals?: ReferralItem[];
  timelineLogs?: CaseTimelineItem[];
}

interface DirectPanelUniItem {
  id: string;
  name: string;
  shortName: string | null;
  contractType: string;
  contractStatus: string;
  directPortalUrl: string | null;
  focalPersonName: string | null;
  focalPersonEmail: string | null;
  focalPersonPhone: string | null;
  supportedIntakes: string | null;
  specialNotes: string | null;
  active: boolean;
}

interface Props {
  initialCases: StudentCaseItem[];
  counselors: TrackedCounselorItem[];
  initialReferrals: ReferralItem[];
  initialPanelUnis: DirectPanelUniItem[];
}

export function AdminTeamManagementClient({
  initialCases,
  counselors: initialCounselors,
  initialReferrals,
  initialPanelUnis,
}: Props) {
  const [activeTab, setActiveTab] = useState<'cases' | 'referrals' | 'counselors' | 'panel'>('cases');
  const [cases, setCases] = useState<StudentCaseItem[]>(initialCases);
  const [counselors, setCounselors] = useState<TrackedCounselorItem[]>(initialCounselors);
  const [referrals, setReferrals] = useState<ReferralItem[]>(initialReferrals);
  const [panelUnis, setPanelUnis] = useState<DirectPanelUniItem[]>(initialPanelUnis);

  // Filters for Cases
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [filterBranch, setFilterBranch] = useState('ALL');
  const [filterCounselor, setFilterCounselor] = useState('ALL');

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditCaseModalOpen, setIsEditCaseModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isPanelModalOpen, setIsPanelModalOpen] = useState(false);
  const [isEditPanelModalOpen, setIsEditPanelModalOpen] = useState(false);
  const [isAddCounselorModalOpen, setIsAddCounselorModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<StudentCaseItem | null>(null);

  // Form states for New Case (Simplified student details: passport/EMGS optional)
  const [newCaseData, setNewCaseData] = useState({
    studentName: '',
    passportNumber: '',
    phone: '',
    email: '',
    city: '',
    counselorName: '',
    branch: 'Lahore (Head Office)',
    targetUniversity: '',
    targetProgram: '',
    intake: 'September 2025',
    degreeLevel: "Bachelor's Degree",
    status: 'APPLICATION_SUBMITTED',
    bookingDone: true,
    offerLetterStatus: 'PENDING',
    emgsPaid: false,
    valPercentage: 0,
    notes: '',
  });

  // Form states for Editing Full Case Details (Editable afterwards!)
  const [editingCaseData, setEditingCaseData] = useState({
    id: '',
    studentName: '',
    passportNumber: '',
    phone: '',
    email: '',
    city: '',
    counselorName: '',
    branch: 'Lahore (Head Office)',
    targetUniversity: '',
    targetProgram: '',
    intake: 'September 2025',
    degreeLevel: "Bachelor's Degree",
    bookingDone: true,
    notes: '',
  });

  // Form states for Updating Case Progress (Milestones)
  const [updateFormData, setUpdateFormData] = useState({
    status: '',
    counselorName: '',
    bookingDone: true,
    reachedMalaysia: false,
    offerLetterStatus: '',
    emgsPaid: false,
    emgsPaymentDate: '',
    emgsRefNumber: '',
    valPercentage: 0,
    valStatus: '',
    visaStatus: '',
    travelDate: '',
    notes: '',
    timelineNote: '',
  });

  // Form states for Branch Referral (Supports both Existing Case AND Direct Student Referral)
  const [referralMode, setReferralMode] = useState<'case' | 'direct'>('direct');
  const [referralFormData, setReferralFormData] = useState({
    caseId: '',
    fromBranch: 'Lahore (Head Office)',
    toBranch: 'Islamabad',
    referredBy: '',
    handledBy: '',
    reason: '',
    notes: '',
  });

  const [directReferralData, setDirectReferralData] = useState({
    studentName: '',
    phone: '',
    email: '',
    city: '',
    targetUniversity: '',
    targetProgram: '',
    intake: 'September 2025',
    fromBranch: 'Lahore (Head Office)',
    toBranch: 'Islamabad',
    referredBy: '',
    handledBy: '',
    reason: '',
    notes: '',
  });

  // Form states for Add Counselor to Tracking
  const [newCounselorData, setNewCounselorData] = useState({
    name: '',
    branch: 'Lahore (Head Office)',
    phone: '',
    email: '',
  });

  // Form states for Panel University (Add & Edit)
  const [panelSearchQuery, setPanelSearchQuery] = useState('');
  const [newUniData, setNewUniData] = useState({
    name: '',
    shortName: '',
    contractType: 'Direct Agreement',
    contractStatus: 'Active',
    directPortalUrl: '',
    focalPersonName: '',
    focalPersonEmail: '',
    focalPersonPhone: '',
    supportedIntakes: '',
    specialNotes: '',
  });

  const [editingUniData, setEditingUniData] = useState<DirectPanelUniItem | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Show transient feedback
  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = cases.length;
    // Cases currently under process (active applications)
    const inProcess = cases.filter((c) => c.status !== 'PROCESS_COMPLETED' && c.status !== 'DROPPED_REJECTED').length;
    
    // Cases Closed (Bookings Done / Process Started by Counselor)
    const casesClosed = cases.filter((c) => c.bookingDone !== false).length;

    // Process Completed (Reached Malaysia)
    const reachedMalaysia = cases.filter((c) => c.status === 'PROCESS_COMPLETED' || c.reachedMalaysia === true).length;

    const emgsPending = cases.filter((c) => c.status === 'EMGS_PENDING' || (!c.emgsPaid && c.status !== 'PROCESS_COMPLETED' && c.status !== 'DROPPED_REJECTED')).length;
    const emgsPaid = cases.filter((c) => c.emgsPaid).length;
    const valInProcess = cases.filter((c) => c.status === 'VAL_IN_PROCESS' || (c.valPercentage && c.valPercentage > 0 && c.valPercentage < 100)).length;
    const valApproved = cases.filter((c) => c.status === 'VAL_ISSUED' || c.valPercentage === 100).length;
    const totalReferrals = referrals.length;
    const directUnis = panelUnis.filter((u) => u.active).length;

    return {
      total,
      inProcess,
      casesClosed,
      reachedMalaysia,
      emgsPending,
      emgsPaid,
      valInProcess,
      valApproved,
      totalReferrals,
      directUnis,
      completionRate: casesClosed > 0 ? Math.round((reachedMalaysia / casesClosed) * 100) : 0,
    };
  }, [cases, referrals, panelUnis]);

  // Filtered Cases
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      if (filterStage !== 'ALL' && item.status !== filterStage) return false;
      if (filterBranch !== 'ALL' && item.branch !== filterBranch) return false;
      if (filterCounselor !== 'ALL' && item.counselorName !== filterCounselor) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.studentName.toLowerCase().includes(query);
        const matchPhone = item.phone.toLowerCase().includes(query);
        const matchUni = item.targetUniversity.toLowerCase().includes(query);
        const matchProg = item.targetProgram.toLowerCase().includes(query);
        const matchPassport = item.passportNumber?.toLowerCase().includes(query);
        const matchCounselor = item.counselorName?.toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchUni && !matchProg && !matchPassport && !matchCounselor) {
          return false;
        }
      }
      return true;
    });
  }, [cases, filterStage, filterBranch, filterCounselor, searchQuery]);

  // Counselor Metrics (Calculated for Admin's Tracked Counselors)
  const counselorPerformance = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      branch: string;
      totalBookings: number;
      underProcess: number;
      reachedMalaysia: number;
      emgsCount: number;
      valCount: number;
    }>();

    // Initialize with counselors Admin added
    counselors.forEach((c) => {
      map.set(c.name.toLowerCase().trim(), {
        id: c.id,
        name: c.name,
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        branch: c.branch,
        totalBookings: 0,
        underProcess: 0,
        reachedMalaysia: 0,
        emgsCount: 0,
        valCount: 0,
      });
    });

    // Count cases
    cases.forEach((c) => {
      const cNameKey = (c.counselorName || '').toLowerCase().trim();
      if (cNameKey && map.has(cNameKey)) {
        const record = map.get(cNameKey)!;
        record.totalBookings += 1;
        if (c.status === 'PROCESS_COMPLETED' || c.reachedMalaysia) {
          record.reachedMalaysia += 1;
        } else if (c.status !== 'DROPPED_REJECTED') {
          record.underProcess += 1;
        }
        if (c.emgsPaid) record.emgsCount += 1;
        if (c.valPercentage && c.valPercentage >= 35) record.valCount += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalBookings - a.totalBookings);
  }, [counselors, cases]);

  // Handle Add Counselor to Tracking
  const handleAddCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/counselors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCounselorData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add counselor');

      setCounselors((prev) => [...prev, data.counselor]);
      notify(`Counselor ${data.counselor.name} added to Team Management!`);
      setIsAddCounselorModalOpen(false);
      setNewCounselorData({
        name: '',
        branch: 'Lahore (Head Office)',
        phone: '',
        email: '',
      });
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Remove Counselor from Tracking
  const handleRemoveCounselor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from Team Tracking?`)) return;
    try {
      const res = await fetch(`/api/admin/counselors?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCounselors((prev) => prev.filter((c) => c.id !== id));
        notify(`Removed ${name} from tracking`);
      }
    } catch (err: any) {
      notify('Failed to remove counselor', 'error');
    }
  };

  // Handle Create Case
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCaseData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create case');

      setCases((prev) => [data.case, ...prev]);
      notify(`Case for ${data.case.studentName} added successfully!`);
      setIsNewCaseModalOpen(false);
      // Reset form
      setNewCaseData({
        studentName: '',
        passportNumber: '',
        phone: '',
        email: '',
        city: '',
        counselorName: '',
        branch: 'Lahore (Head Office)',
        targetUniversity: '',
        targetProgram: '',
        intake: 'September 2025',
        degreeLevel: "Bachelor's Degree",
        status: 'APPLICATION_SUBMITTED',
        bookingDone: true,
        offerLetterStatus: 'PENDING',
        emgsPaid: false,
        valPercentage: 0,
        notes: '',
      });
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Details Modal for a student case (Editable afterwards!)
  const openEditCaseDetailsModal = (item: StudentCaseItem) => {
    setSelectedCase(item);
    setEditingCaseData({
      id: item.id,
      studentName: item.studentName,
      passportNumber: item.passportNumber || '',
      phone: item.phone,
      email: item.email || '',
      city: item.city || '',
      counselorName: item.counselorName || '',
      branch: item.branch,
      targetUniversity: item.targetUniversity,
      targetProgram: item.targetProgram,
      intake: item.intake,
      degreeLevel: item.degreeLevel || "Bachelor's Degree",
      bookingDone: item.bookingDone !== false,
      notes: item.notes || '',
    });
    setIsEditCaseModalOpen(true);
  };

  // Handle Save Case Details (Full student details editing)
  const handleSaveCaseDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCaseData.id) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCaseData.id,
          studentName: editingCaseData.studentName.trim(),
          phone: editingCaseData.phone.trim(),
          email: editingCaseData.email ? editingCaseData.email.trim().toLowerCase() : null,
          passportNumber: editingCaseData.passportNumber ? editingCaseData.passportNumber.trim().toUpperCase() : null,
          city: editingCaseData.city ? editingCaseData.city.trim() : null,
          counselorName: editingCaseData.counselorName ? editingCaseData.counselorName.trim() : null,
          branch: editingCaseData.branch,
          targetUniversity: editingCaseData.targetUniversity.trim(),
          targetProgram: editingCaseData.targetProgram.trim(),
          intake: editingCaseData.intake.trim(),
          degreeLevel: editingCaseData.degreeLevel,
          bookingDone: editingCaseData.bookingDone,
          notes: editingCaseData.notes || null,
          timelineNote: 'Student details & academic program edited by Admin',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update case details');

      setCases((prev) => prev.map((c) => (c.id === editingCaseData.id ? data.case : c)));
      notify(`Case details updated for ${data.case.studentName}`);
      setIsEditCaseModalOpen(false);
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Case
  const handleDeleteCase = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the student case for "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/cases?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCases((prev) => prev.filter((c) => c.id !== id));
        notify(`Case for "${name}" deleted successfully`);
      }
    } catch {
      notify('Failed to delete student case', 'error');
    }
  };

  // Open Update Modal for a case (milestones & stages)
  const openUpdateModal = (item: StudentCaseItem) => {
    setSelectedCase(item);
    setUpdateFormData({
      status: item.status,
      counselorName: item.counselorName || '',
      bookingDone: item.bookingDone !== false,
      reachedMalaysia: item.reachedMalaysia || item.status === 'PROCESS_COMPLETED',
      offerLetterStatus: item.offerLetterStatus || 'PENDING',
      emgsPaid: item.emgsPaid,
      emgsPaymentDate: item.emgsPaymentDate ? new Date(item.emgsPaymentDate).toISOString().split('T')[0] : '',
      emgsRefNumber: item.emgsRefNumber || '',
      valPercentage: item.valPercentage || 0,
      valStatus: item.valStatus || 'NOT_APPLIED',
      visaStatus: item.visaStatus || 'NOT_APPLIED',
      travelDate: item.travelDate ? new Date(item.travelDate).toISOString().split('T')[0] : '',
      notes: item.notes || '',
      timelineNote: '',
    });
    setIsUpdateModalOpen(true);
  };

  // Handle Update Case Submit
  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setIsSubmitting(true);

    try {
      const finalStatus = updateFormData.reachedMalaysia ? 'PROCESS_COMPLETED' : updateFormData.status;
      const res = await fetch('/api/admin/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCase.id,
          status: finalStatus,
          counselorName: updateFormData.counselorName || null,
          bookingDone: updateFormData.bookingDone,
          reachedMalaysia: updateFormData.reachedMalaysia,
          offerLetterStatus: updateFormData.offerLetterStatus,
          emgsPaid: updateFormData.emgsPaid,
          emgsPaymentDate: updateFormData.emgsPaymentDate || null,
          emgsRefNumber: updateFormData.emgsRefNumber || null,
          valPercentage: Number(updateFormData.valPercentage),
          valStatus: updateFormData.valStatus,
          visaStatus: updateFormData.visaStatus,
          travelDate: updateFormData.travelDate || null,
          notes: updateFormData.notes,
          timelineNote: updateFormData.timelineNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update case');

      setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? data.case : c)));
      notify(`Progress updated for ${data.case.studentName}`);
      setIsUpdateModalOpen(false);
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick EMGS Toggle
  const handleToggleEmgs = async (item: StudentCaseItem) => {
    const newEmgs = !item.emgsPaid;
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          emgsPaid: newEmgs,
          timelineNote: newEmgs ? 'EMGS Marked as Paid by Admin' : 'EMGS Marked as Unpaid by Admin',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCases((prev) => prev.map((c) => (c.id === item.id ? data.case : c)));
      notify(newEmgs ? 'EMGS Marked as Paid!' : 'EMGS Status Reset');
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  // Handle Branch Referral Submit (Existing Case OR Direct Student Referral)
  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = referralMode === 'case' ? referralFormData : directReferralData;
      const res = await fetch('/api/admin/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create branch referral');

      setReferrals((prev) => [data.referral, ...prev]);

      if (data.newCase) {
        setCases((prev) => [data.newCase, ...prev]);
      } else if (referralFormData.caseId) {
        setCases((prev) =>
          prev.map((c) => (c.id === referralFormData.caseId ? { ...c, branch: referralFormData.toBranch } : c))
        );
      }

      notify(`Student successfully referred to ${payload.toBranch}!`);
      setIsReferralModalOpen(false);

      // Reset referral forms
      setReferralFormData({
        caseId: '',
        fromBranch: 'Lahore (Head Office)',
        toBranch: 'Islamabad',
        referredBy: '',
        handledBy: '',
        reason: '',
        notes: '',
      });
      setDirectReferralData({
        studentName: '',
        phone: '',
        email: '',
        city: '',
        targetUniversity: '',
        targetProgram: '',
        intake: 'September 2025',
        fromBranch: 'Lahore (Head Office)',
        toBranch: 'Islamabad',
        referredBy: '',
        handledBy: '',
        reason: '',
        notes: '',
      });
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Referral
  const handleDeleteReferral = async (id: string) => {
    if (!confirm('Are you sure you want to delete this referral record?')) return;
    try {
      const res = await fetch(`/api/admin/referrals?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReferrals((prev) => prev.filter((r) => r.id !== id));
        notify('Referral record deleted');
      }
    } catch {
      notify('Failed to delete referral', 'error');
    }
  };

  // Open Edit Panel University Modal
  const openEditUniModal = (uni: DirectPanelUniItem) => {
    setEditingUniData({ ...uni });
    setIsEditPanelModalOpen(true);
  };

  // Handle Update Panel University Submit
  const handleUpdatePanelUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUniData) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/panel-universities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUniData.id,
          name: editingUniData.name.trim(),
          shortName: editingUniData.shortName ? editingUniData.shortName.trim() : null,
          contractType: editingUniData.contractType,
          contractStatus: editingUniData.contractStatus,
          directPortalUrl: editingUniData.directPortalUrl ? editingUniData.directPortalUrl.trim() : null,
          supportedIntakes: editingUniData.supportedIntakes ? editingUniData.supportedIntakes.trim() : null,
          focalPersonName: editingUniData.focalPersonName ? editingUniData.focalPersonName.trim() : null,
          focalPersonEmail: editingUniData.focalPersonEmail ? editingUniData.focalPersonEmail.trim() : null,
          focalPersonPhone: editingUniData.focalPersonPhone ? editingUniData.focalPersonPhone.trim() : null,
          specialNotes: editingUniData.specialNotes || null,
          active: editingUniData.active,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update panel university');

      setPanelUnis((prev) => prev.map((u) => (u.id === editingUniData.id ? data.university : u)));
      notify(`${data.university.name} updated successfully!`);
      setIsEditPanelModalOpen(false);
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Panel University
  const handleDeletePanelUni = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from Direct Panel Universities?`)) return;
    try {
      const res = await fetch(`/api/admin/panel-universities?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPanelUnis((prev) => prev.filter((u) => u.id !== id));
        notify(`Removed "${name}" from panel universities`);
      }
    } catch {
      notify('Failed to delete university', 'error');
    }
  };

  // Handle Add Panel University
  const handleAddPanelUni = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/panel-universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUniData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add panel university');

      setPanelUnis((prev) => [...prev, data.university]);
      notify(`${data.university.name} added to direct panel!`);
      setIsPanelModalOpen(false);
      setNewUniData({
        name: '',
        shortName: '',
        contractType: 'Direct Agreement',
        contractStatus: 'Active',
        directPortalUrl: '',
        focalPersonName: '',
        focalPersonEmail: '',
        focalPersonPhone: '',
        supportedIntakes: '',
        specialNotes: '',
      });
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export to CSV
  const exportCasesCSV = () => {
    if (cases.length === 0) {
      alert('No cases to export');
      return;
    }
    const headers = [
      'Student Name',
      'Passport Number',
      'Phone',
      'Email',
      'City',
      'Assigned Counselor',
      'Branch',
      'University',
      'Program',
      'Intake',
      'Status',
      'Booking Done (Case Closed)',
      'Reached Malaysia',
      'EMGS Paid',
      'EMGS Ref',
      'VAL Progress %',
      'VAL Status',
      'Visa Status',
      'Travel Date',
    ];

    const rows = cases.map((c) => [
      `"${c.studentName || ''}"`,
      `"${c.passportNumber || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.city || ''}"`,
      `"${c.counselorName || 'Unassigned'}"`,
      `"${c.branch || ''}"`,
      `"${c.targetUniversity || ''}"`,
      `"${c.targetProgram || ''}"`,
      `"${c.intake || ''}"`,
      `"${c.status || ''}"`,
      `"${c.bookingDone !== false ? 'YES' : 'NO'}"`,
      `"${c.reachedMalaysia || c.status === 'PROCESS_COMPLETED' ? 'YES' : 'NO'}"`,
      `"${c.emgsPaid ? 'YES' : 'NO'}"`,
      `"${c.emgsRefNumber || ''}"`,
      `"${c.valPercentage || 0}%"`,
      `"${c.valStatus || ''}"`,
      `"${c.visaStatus || ''}"`,
      `"${c.travelDate ? new Date(c.travelDate).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Meezab_Student_Cases_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWhatsAppLink = (phone: string, studentName: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('03')) clean = '92' + clean.slice(1);
    const msg = encodeURIComponent(`Hello ${studentName}! This is Meezab Head Office regarding your Malaysia study application.`);
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const getStageBadge = (status: string) => {
    const stage = CASE_STAGES.find((s) => s.value === status);
    if (!stage) return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${stage.color}`}>
        {stage.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#08182b] via-[#0d2a4d] to-[#143d6b] rounded-2xl p-6 text-white shadow-md border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Admin Only Console
            </span>
            <span className="text-xs text-slate-300 font-medium">Head Office: Lahore &bull; 10 Regional Branches</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            Team Management &amp; Case Tracking System
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Monitor cases under process, bookings closed by counselors, students reached Malaysia, EMGS &amp; VAL milestones, and regional branch referrals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Student Case</span>
          </button>

          <button
            onClick={() => setIsReferralModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-600 transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Refer to Branch</span>
          </button>

          <button
            onClick={exportCasesCSV}
            title="Download CSV report of all cases"
            className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Updated with exact requested labels & boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* Box 1: Total Cases Under Process */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Cases Under Process</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.inProcess}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active applications</div>
        </div>

        {/* Box 2: Cases Closed (Booking Confirmed / Process Started) */}
        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Cases Closed</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{stats.casesClosed}</div>
          <div className="text-[10px] text-indigo-600 font-bold mt-0.5">
            Bookings confirmed
          </div>
        </div>

        {/* Box 3: Reached Malaysia / Process Completed (New Requested Card) */}
        <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Reached Malaysia</span>
            <Plane className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.reachedMalaysia}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
            Process completed
          </div>
        </div>

        {/* Box 4: EMGS Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">EMGS Paid</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-700">{stats.emgsPaid}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
            {stats.emgsPending} pending payments
          </div>
        </div>

        {/* Box 5: VAL Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">VAL In Process</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">{stats.valInProcess}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{stats.valApproved} VALs approved</div>
        </div>

        {/* Box 6: Branch Referrals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Referrals</span>
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{stats.totalReferrals}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across 10 branches</div>
        </div>

        {/* Box 7: Direct Panel Unis */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Direct Unis</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{stats.directUnis}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Direct panel contracts</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === 'cases'
              ? 'bg-[#08182b] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Student Cases Pipeline ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === 'referrals'
              ? 'bg-[#08182b] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-amber-400" />
          <span>Branch Referrals Hub ({referrals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('counselors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === 'counselors'
              ? 'bg-[#08182b] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Counselor Performance ({counselors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('panel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === 'panel'
              ? 'bg-[#08182b] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Direct Panel Universities ({panelUnis.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENT CASES PIPELINE */}
      {/* ========================================================================= */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, passport, phone, uni, program, counselor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Stage Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Stage:</span>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Stages ({cases.length})</option>
                  {CASE_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Branch:</span>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Branches</option>
                  {PAKISTAN_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Counselor Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Counselor:</span>
                <select
                  value={filterCounselor}
                  onChange={(e) => setFilterCounselor(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Counselors</option>
                  {counselors.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.branch})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {filteredCases.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No student cases found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery || filterStage !== 'ALL' || filterBranch !== 'ALL' || filterCounselor !== 'ALL'
                    ? 'Try adjusting your filters or search keywords.'
                    : 'Click "New Student Case" to register your first case into the pipeline.'}
                </p>
                <button
                  onClick={() => setIsNewCaseModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register First Case</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3.5">Student &amp; Contact</th>
                      <th className="p-3.5">Counselor &amp; Branch</th>
                      <th className="p-3.5">Target Uni &amp; Program</th>
                      <th className="p-3.5">Intake</th>
                      <th className="p-3.5">Status &amp; Milestones</th>
                      <th className="p-3.5">EMGS Fee</th>
                      <th className="p-3.5">VAL Progress</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Student */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-sm">{item.studentName}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                            <span>{item.phone}</span>
                            {item.email && <span className="text-slate-400">&bull; {item.email}</span>}
                          </div>
                          {item.passportNumber && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Passport: {item.passportNumber}
                            </div>
                          )}
                          {item.city && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.city}</div>
                          )}
                        </td>

                        {/* Counselor & Branch */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>{item.counselorName || 'Unassigned'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.branch}</span>
                          </div>
                        </td>

                        {/* University & Program */}
                        <td className="p-3.5 max-w-[220px]">
                          <div className="font-bold text-slate-900 truncate" title={item.targetUniversity}>
                            {item.targetUniversity}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate" title={item.targetProgram}>
                            {item.targetProgram}
                          </div>
                          {item.degreeLevel && (
                            <span className="inline-block mt-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold">
                              {item.degreeLevel}
                            </span>
                          )}
                        </td>

                        {/* Intake */}
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                            {item.intake}
                          </span>
                        </td>

                        {/* Status & Badges */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div>{getStageBadge(item.status)}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.bookingDone !== false && (
                                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-200">
                                  ✓ Booking Confirmed
                                </span>
                              )}
                              {(item.reachedMalaysia || item.status === 'PROCESS_COMPLETED') && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-300">
                                  ✈ Reached Malaysia
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* EMGS */}
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleEmgs(item)}
                            title="Click to toggle EMGS payment"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                              item.emgsPaid
                                ? 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.emgsPaid ? 'Paid' : 'Pending'}</span>
                          </button>
                        </td>

                        {/* VAL Progress */}
                        <td className="p-3.5">
                          <div className="w-24 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600">
                              <span>VAL</span>
                              <span>{item.valPercentage || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  (item.valPercentage || 0) >= 100
                                    ? 'bg-emerald-500'
                                    : (item.valPercentage || 0) >= 70
                                    ? 'bg-purple-600'
                                    : (item.valPercentage || 0) > 0
                                    ? 'bg-amber-500'
                                    : 'bg-slate-300'
                                }`}
                                style={{ width: `${item.valPercentage || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* WhatsApp Direct */}
                          <a
                            href={getWhatsAppLink(item.phone, item.studentName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg inline-flex items-center"
                            title="Chat with student on WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Edit Full Case Details Modal (Editable afterwards!) */}
                          <button
                            onClick={() => openEditCaseDetailsModal(item)}
                            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-blue-200 transition-all active:scale-95"
                            title="Edit Student Name, Phone, Target Uni, Program, Intake, Counselor..."
                          >
                            <Edit3 className="w-3 h-3 text-blue-600" />
                            <span>Edit Case</span>
                          </button>

                          {/* Stage Progress Modal */}
                          <button
                            onClick={() => openUpdateModal(item)}
                            className="inline-flex items-center gap-1 bg-[#08182b] hover:bg-[#143d6b] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95"
                            title="Update Milestones, VAL %, EMGS, Stage"
                          >
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>Progress</span>
                          </button>

                          {/* Delete Case */}
                          <button
                            onClick={() => handleDeleteCase(item.id, item.studentName)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg inline-flex items-center transition-colors"
                            title="Delete this student case"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BRANCH REFERRALS HUB */}
      {/* ========================================================================= */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-500" />
                Inter-Branch Student Referral Registry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full transparency on cases referred between Meezab Head Office (Lahore) and regional branches across Pakistan.
              </p>
            </div>
            <button
              onClick={() => setIsReferralModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#08182b] hover:bg-[#143d6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Initiate Branch Referral</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {referrals.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No branch referrals recorded yet. Click &quot;Initiate Branch Referral&quot; to transfer a student case.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Student &amp; Target</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Referred From</th>
                      <th className="p-3.5">Destination Branch</th>
                      <th className="p-3.5">Referred By</th>
                      <th className="p-3.5">Handled At Destination</th>
                      <th className="p-3.5">Reason &amp; Notes</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-slate-50/80">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{ref.studentCase?.studentName || 'Student Case'}</div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            {ref.studentCase?.phone}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {ref.studentCase?.targetUniversity}
                          </div>
                        </td>
                        <td className="p-3.5">
                          {ref.studentCase?.bookingDone === false ? (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                              Walk-in / Inquiry
                            </span>
                          ) : (
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                              Active Case
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{ref.fromBranch}</td>
                        <td className="p-3.5 font-bold text-blue-700">{ref.toBranch}</td>
                        <td className="p-3.5 text-slate-700">{ref.referredBy}</td>
                        <td className="p-3.5 text-slate-600">{ref.handledBy || 'Pending Assignment'}</td>
                        <td className="p-3.5 text-slate-600 max-w-xs">{ref.reason || ref.notes || 'N/A'}</td>
                        <td className="p-3.5">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            {ref.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteReferral(ref.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg inline-flex items-center transition-colors"
                            title="Delete this referral"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COUNSELOR PERFORMANCE (ADMIN-MANAGED COUNSELORS) */}
      {/* ========================================================================= */}
      {activeTab === 'counselors' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Tracked Counselors &amp; Operational Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add and track counselors of your choice. Monitor cases booked, active processing workload, and students reached Malaysia (No finances).
              </p>
            </div>

            {/* Admin Add Counselor Button */}
            <button
              onClick={() => setIsAddCounselorModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Counselor to Team</span>
            </button>
          </div>

          {counselors.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No counselors added to tracking yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Aap apni marzi se jin counselors ko track karna chahein, unko yahan add karein.
              </p>
              <button
                onClick={() => setIsAddCounselorModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Counselor Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {counselorPerformance.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  {/* Counselor Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{c.branch}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete Counselor Action */}
                    <button
                      onClick={() => handleRemoveCounselor(c.id, c.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove counselor from tracking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">Cases Closed</div>
                      <div className="text-base font-black text-indigo-700">{c.totalBookings}</div>
                      <div className="text-[8px] text-slate-400">Bookings</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">Under Process</div>
                      <div className="text-base font-black text-amber-600">{c.underProcess}</div>
                      <div className="text-[8px] text-slate-400">Active</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">Reached MY</div>
                      <div className="text-base font-black text-emerald-600">{c.reachedMalaysia}</div>
                      <div className="text-[8px] text-slate-400">Completed</div>
                    </div>
                  </div>

                  {/* Milestones count */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>EMGS Paid Cases:</span>
                      <span className="font-bold text-slate-900">{c.emgsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAL Advanced (&ge;35%):</span>
                      <span className="font-bold text-slate-900">{c.valCount}</span>
                    </div>
                  </div>

                  {/* Action filter */}
                  <button
                    onClick={() => {
                      setFilterCounselor(c.name);
                      setActiveTab('cases');
                    }}
                    className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    View {c.name}&apos;s Cases &rarr;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DIRECT PANEL UNIVERSITIES (EDITABLE & MANAGEABLE) */}
      {/* ========================================================================= */}
      {activeTab === 'panel' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" />
                Direct Panel Universities (Official Representations)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Malaysian universities with direct institutional agreements. Click &quot;Edit&quot; on any university to update its details, contacts, or status.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={panelSearchQuery}
                  onChange={(e) => setPanelSearchQuery(e.target.value)}
                  className="text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 w-44 md:w-56"
                />
              </div>
              <button
                onClick={() => setIsPanelModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#08182b] hover:bg-[#143d6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add University</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {panelUnis
              .filter((uni) => {
                if (!panelSearchQuery.trim()) return true;
                const q = panelSearchQuery.toLowerCase();
                return (
                  uni.name.toLowerCase().includes(q) ||
                  (uni.shortName && uni.shortName.toLowerCase().includes(q)) ||
                  (uni.contractType && uni.contractType.toLowerCase().includes(q))
                );
              })
              .map((uni) => (
              <div key={uni.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {uni.name}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                      {uni.contractStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {uni.contractType}
                    </span>
                    {uni.shortName && (
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        [{uni.shortName}]
                      </span>
                    )}
                  </div>

                  {uni.supportedIntakes && (
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-700">Intakes: </span>
                      <span>{uni.supportedIntakes}</span>
                    </div>
                  )}

                  {uni.specialNotes && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl italic">
                      &quot;{uni.specialNotes}&quot;
                    </div>
                  )}

                  {(uni.focalPersonName || uni.focalPersonEmail) && (
                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                      <div className="font-bold text-slate-700">Focal Representative:</div>
                      {uni.focalPersonName && <div className="text-slate-800 font-semibold">{uni.focalPersonName}</div>}
                      {uni.focalPersonEmail && <div className="text-slate-500 font-mono text-[11px]">{uni.focalPersonEmail}</div>}
                      {uni.focalPersonPhone && <div className="text-slate-500 text-[11px]">{uni.focalPersonPhone}</div>}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {uni.directPortalUrl ? (
                    <a
                      href={uni.directPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 truncate"
                    >
                      <span>Admissions Portal</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Direct Portal N/A</span>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Edit University Button */}
                    <button
                      type="button"
                      onClick={() => openEditUniModal(uni)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Edit University Details"
                    >
                      <Edit3 className="w-3 h-3 text-blue-600" />
                      <span>Edit</span>
                    </button>

                    {/* Delete University Button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePanelUni(uni.id, uni.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete this university from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD COUNSELOR TO TRACKING (ADMIN DECIDES WHO TO ADD) */}
      {/* ========================================================================= */}
      {isAddCounselorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Add Counselor to Team Management</span>
              </div>
              <button
                onClick={() => setIsAddCounselorModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCounselor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counselor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCounselorData.name}
                  onChange={(e) => setNewCounselorData({ ...newCounselorData, name: e.target.value })}
                  placeholder="e.g. Sir Asim, Miss Sana, Usman Ali"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Location *</label>
                <select
                  value={newCounselorData.branch}
                  onChange={(e) => setNewCounselorData({ ...newCounselorData, branch: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white font-bold"
                >
                  {PAKISTAN_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp (Optional)</label>
                <input
                  type="text"
                  value={newCounselorData.phone}
                  onChange={(e) => setNewCounselorData({ ...newCounselorData, phone: e.target.value })}
                  placeholder="e.g. 03001234567"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newCounselorData.email}
                  onChange={(e) => setNewCounselorData({ ...newCounselorData, email: e.target.value })}
                  placeholder="e.g. counselor@meezab.com"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCounselorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Counselor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: REGISTER NEW STUDENT CASE */}
      {/* ========================================================================= */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Register New Student Case</span>
              </div>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newCaseData.studentName}
                    onChange={(e) => setNewCaseData({ ...newCaseData, studentName: e.target.value })}
                    placeholder="e.g. Muhammad Hamza"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={newCaseData.phone}
                    onChange={(e) => setNewCaseData({ ...newCaseData, phone: e.target.value })}
                    placeholder="e.g. 03001234567"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={newCaseData.email}
                    onChange={(e) => setNewCaseData({ ...newCaseData, email: e.target.value })}
                    placeholder="e.g. hamza@gmail.com"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Origin Branch *</label>
                  <select
                    value={newCaseData.branch}
                    onChange={(e) => setNewCaseData({ ...newCaseData, branch: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    {PAKISTAN_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Counselor Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Counselor *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {counselors.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) setNewCaseData({ ...newCaseData, counselorName: e.target.value });
                        }}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium"
                      >
                        <option value="">-- Select Tracked Counselor --</option>
                        {counselors.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.branch})
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      required
                      value={newCaseData.counselorName}
                      onChange={(e) => setNewCaseData({ ...newCaseData, counselorName: e.target.value })}
                      placeholder="Or enter counselor name..."
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target University in Malaysia *</label>
                  <div className="space-y-1.5">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setNewCaseData({ ...newCaseData, targetUniversity: e.target.value });
                        }
                      }}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 font-medium"
                    >
                      <option value="">-- Choose from Direct Panel Unis or Type Below --</option>
                      {panelUnis.map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name} (Direct Panel)
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={newCaseData.targetUniversity}
                      onChange={(e) => setNewCaseData({ ...newCaseData, targetUniversity: e.target.value })}
                      placeholder="e.g. Asia Pacific University (APU)"
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Program / Degree *</label>
                  <input
                    type="text"
                    required
                    value={newCaseData.targetProgram}
                    onChange={(e) => setNewCaseData({ ...newCaseData, targetProgram: e.target.value })}
                    placeholder="e.g. BSc (Hons) in Software Engineering"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Intake *</label>
                  <input
                    type="text"
                    required
                    value={newCaseData.intake}
                    onChange={(e) => setNewCaseData({ ...newCaseData, intake: e.target.value })}
                    placeholder="e.g. September 2025"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Passport Number (Optional)</label>
                  <input
                    type="text"
                    value={newCaseData.passportNumber}
                    onChange={(e) => setNewCaseData({ ...newCaseData, passportNumber: e.target.value })}
                    placeholder="Optional (can be added later)"
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl px-3 py-2 uppercase focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Region (Optional)</label>
                  <input
                    type="text"
                    value={newCaseData.city}
                    onChange={(e) => setNewCaseData({ ...newCaseData, city: e.target.value })}
                    placeholder="e.g. Lahore, Rawalpindi"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Case Notes / Special Instructions</label>
                <textarea
                  rows={2}
                  value={newCaseData.notes}
                  onChange={(e) => setNewCaseData({ ...newCaseData, notes: e.target.value })}
                  placeholder="e.g. Student passed FSc with 78%, needs English exemption letter..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Student Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPDATE CASE STAGE / EMGS / VAL / REACHED MALAYSIA */}
      {/* ========================================================================= */}
      {isUpdateModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Update Case Progress: {selectedCase.studentName}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedCase.targetUniversity} &bull; Counselor: {selectedCase.counselorName || 'Unassigned'}
                </p>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="p-6 space-y-4">
              {/* Process Stage Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  Overall Process Milestone / Stage *
                </label>
                <select
                  value={updateFormData.status}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, status: e.target.value })}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {CASE_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Toggles: Case Closed (Booking Confirmed) & Reached Malaysia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={updateFormData.bookingDone}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, bookingDone: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900">Case Closed (Booking Done)</span>
                    <span className="block text-[10px] text-slate-500">Counselor has closed deal &amp; processing started</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={updateFormData.reachedMalaysia}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, reachedMalaysia: e.target.checked, status: e.target.checked ? 'PROCESS_COMPLETED' : updateFormData.status })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <div>
                    <span className="block text-xs font-extrabold text-emerald-900">Reached Malaysia</span>
                    <span className="block text-[10px] text-emerald-600 font-medium">Final process completed / enrolled in Malaysia</span>
                  </div>
                </label>
              </div>

              {/* Offer Letter & EMGS Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Offer Letter Status</label>
                  <select
                    value={updateFormData.offerLetterStatus}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, offerLetterStatus: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="PENDING">Pending from University</option>
                    <option value="CONDITIONAL">Conditional Offer Issued</option>
                    <option value="UNCONDITIONAL">Unconditional / Final Offer Issued</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">EMGS Fee Status</label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={updateFormData.emgsPaid}
                        onChange={(e) => setUpdateFormData({ ...updateFormData, emgsPaid: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className={updateFormData.emgsPaid ? 'text-emerald-700 font-extrabold' : 'text-slate-600'}>
                        {updateFormData.emgsPaid ? 'Fee Paid & Verified' : 'Fee Pending'}
                      </span>
                    </label>
                  </div>
                </div>

                {updateFormData.emgsPaid && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">EMGS Payment Date</label>
                      <input
                        type="date"
                        value={updateFormData.emgsPaymentDate}
                        onChange={(e) => setUpdateFormData({ ...updateFormData, emgsPaymentDate: e.target.value })}
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">EMGS Tracking / Ref Number</label>
                      <input
                        type="text"
                        value={updateFormData.emgsRefNumber}
                        onChange={(e) => setUpdateFormData({ ...updateFormData, emgsRefNumber: e.target.value })}
                        placeholder="e.g. EMGS-2025-99881"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* VAL Progress Section */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-900">
                    Visa Approval Letter (VAL / eVAL) Progress
                  </label>
                  <span className="text-xs font-extrabold text-purple-700">
                    {updateFormData.valPercentage}%
                  </span>
                </div>

                {/* Quick VAL Buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 15, 35, 70, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setUpdateFormData({
                          ...updateFormData,
                          valPercentage: pct,
                          valStatus: pct === 100 ? 'VAL_ISSUED' : pct > 0 ? 'IN_PROCESS' : 'NOT_APPLIED',
                        });
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        updateFormData.valPercentage === pct
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Visa & Travel Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visa / SEV Status</label>
                  <select
                    value={updateFormData.visaStatus}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, visaStatus: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="NOT_APPLIED">Not Applied Yet</option>
                    <option value="SEV_APPLIED">Single Entry Visa (SEV) Applied</option>
                    <option value="VISA_STICKER">Visa Sticker Stamped</option>
                    <option value="EVISA_RECEIVED">eVisa Approved &amp; Downloaded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flight / Travel Date</label>
                  <input
                    type="date"
                    value={updateFormData.travelDate}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, travelDate: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  />
                </div>
              </div>

              {/* Admin Timeline Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Timeline Update Reason / Note (Saved to History)
                </label>
                <input
                  type="text"
                  value={updateFormData.timelineNote}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, timelineNote: e.target.value })}
                  placeholder="e.g. Paid EMGS fee via standard chartered, submitted yellow slip..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Log Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INITIATE BRANCH REFERRAL (SUPPORTS DIRECT STUDENT & EXISTING CASES) */}
      {/* ========================================================================= */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Refer Student to Another Branch</span>
              </div>
              <button
                onClick={() => setIsReferralModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Referral Mode Tabs */}
            <div className="p-6 pb-0">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setReferralMode('direct')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    referralMode === 'direct'
                      ? 'bg-white text-blue-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Direct / Walk-in Referral
                </button>
                <button
                  type="button"
                  onClick={() => setReferralMode('case')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    referralMode === 'case'
                      ? 'bg-white text-blue-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Refer from Existing Cases
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateReferral} className="p-6 space-y-4">
              {referralMode === 'direct' ? (
                <>
                  <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-[11px] text-amber-900">
                    Aap direct kisi bhi student ya walk-in inquiry ko doosri branch refer kar sakty hyn, chahay unhon ne case start na bhi karwaya ho.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={directReferralData.studentName}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, studentName: e.target.value })}
                        placeholder="e.g. Ali Raza"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={directReferralData.phone}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, phone: e.target.value })}
                        placeholder="e.g. 03211234567"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={directReferralData.email}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, email: e.target.value })}
                        placeholder="e.g. ali@gmail.com"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City / Region (Optional)</label>
                      <input
                        type="text"
                        value={directReferralData.city}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, city: e.target.value })}
                        placeholder="e.g. Gujranwala"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target University (Optional)</label>
                    <div className="space-y-1.5">
                      <select
                        onChange={(e) => {
                          if (e.target.value) setDirectReferralData({ ...directReferralData, targetUniversity: e.target.value });
                        }}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 font-medium"
                      >
                        <option value="">-- Choose from Direct Panel Unis --</option>
                        {panelUnis.map((u) => (
                          <option key={u.id} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={directReferralData.targetUniversity}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, targetUniversity: e.target.value })}
                        placeholder="Or enter target university..."
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Program (Optional)</label>
                      <input
                        type="text"
                        value={directReferralData.targetProgram}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, targetProgram: e.target.value })}
                        placeholder="e.g. BBA, Computer Science"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Intake (Optional)</label>
                      <input
                        type="text"
                        value={directReferralData.intake}
                        onChange={(e) => setDirectReferralData({ ...directReferralData, intake: e.target.value })}
                        placeholder="e.g. September 2025"
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Student Case *</label>
                  <select
                    required
                    value={referralFormData.caseId}
                    onChange={(e) => {
                      const c = cases.find((item) => item.id === e.target.value);
                      setReferralFormData({
                        ...referralFormData,
                        caseId: e.target.value,
                        fromBranch: c ? c.branch : 'Lahore (Head Office)',
                        referredBy: c ? c.counselorName || 'Head Office Admin' : 'Admin',
                      });
                    }}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white font-bold"
                  >
                    <option value="">-- Choose Student Case --</option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.studentName} ({c.targetUniversity} - Currently at: {c.branch})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Referring Branch *</label>
                  <select
                    value={referralMode === 'case' ? referralFormData.fromBranch : directReferralData.fromBranch}
                    onChange={(e) => {
                      if (referralMode === 'case') {
                        setReferralFormData({ ...referralFormData, fromBranch: e.target.value });
                      } else {
                        setDirectReferralData({ ...directReferralData, fromBranch: e.target.value });
                      }
                    }}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    {PAKISTAN_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination Branch *</label>
                  <select
                    value={referralMode === 'case' ? referralFormData.toBranch : directReferralData.toBranch}
                    onChange={(e) => {
                      if (referralMode === 'case') {
                        setReferralFormData({ ...referralFormData, toBranch: e.target.value });
                      } else {
                        setDirectReferralData({ ...directReferralData, toBranch: e.target.value });
                      }
                    }}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white font-bold text-blue-700"
                  >
                    {PAKISTAN_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Referred By (Staff / Counselor) *</label>
                <input
                  type="text"
                  required
                  value={referralMode === 'case' ? referralFormData.referredBy : directReferralData.referredBy}
                  onChange={(e) => {
                    if (referralMode === 'case') {
                      setReferralFormData({ ...referralFormData, referredBy: e.target.value });
                    } else {
                      setDirectReferralData({ ...directReferralData, referredBy: e.target.value });
                    }
                  }}
                  placeholder="e.g. Sir Asim / Lahore Admin"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Receiving Staff at Destination</label>
                <input
                  type="text"
                  value={referralMode === 'case' ? referralFormData.handledBy : directReferralData.handledBy}
                  onChange={(e) => {
                    if (referralMode === 'case') {
                      setReferralFormData({ ...referralFormData, handledBy: e.target.value });
                    } else {
                      setDirectReferralData({ ...directReferralData, handledBy: e.target.value });
                    }
                  }}
                  placeholder="e.g. Miss Sana (Islamabad Desk)"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Referral Reason &amp; Notes</label>
                <textarea
                  rows={2}
                  value={referralMode === 'case' ? referralFormData.reason : directReferralData.reason}
                  onChange={(e) => {
                    if (referralMode === 'case') {
                      setReferralFormData({ ...referralFormData, reason: e.target.value, notes: e.target.value });
                    } else {
                      setDirectReferralData({ ...directReferralData, reason: e.target.value, notes: e.target.value });
                    }
                  }}
                  placeholder="e.g. Student walked into Lahore branch, needs physical counseling at Islamabad..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReferralModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Transferring...' : 'Transfer to Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD DIRECT PANEL UNIVERSITY */}
      {/* ========================================================================= */}
      {isPanelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Add Direct Panel University</span>
              </div>
              <button
                onClick={() => setIsPanelModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPanelUni} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  value={newUniData.name}
                  onChange={(e) => setNewUniData({ ...newUniData, name: e.target.value })}
                  placeholder="e.g. Universiti Tenaga Nasional (UNITEN)"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Name / Code</label>
                  <input
                    type="text"
                    value={newUniData.shortName}
                    onChange={(e) => setNewUniData({ ...newUniData, shortName: e.target.value })}
                    placeholder="e.g. UNITEN"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contract Type</label>
                  <select
                    value={newUniData.contractType}
                    onChange={(e) => setNewUniData({ ...newUniData, contractType: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Direct Agreement">Direct Agreement</option>
                    <option value="Preferred Tier-1">Preferred Tier-1</option>
                    <option value="Official Representative">Official Representative</option>
                    <option value="Govt MoA">Government MoA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Admission Portal URL</label>
                <input
                  type="url"
                  value={newUniData.directPortalUrl}
                  onChange={(e) => setNewUniData({ ...newUniData, directPortalUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supported Intakes</label>
                <input
                  type="text"
                  value={newUniData.supportedIntakes}
                  onChange={(e) => setNewUniData({ ...newUniData, supportedIntakes: e.target.value })}
                  placeholder="e.g. February, July, September"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focal Person Name</label>
                  <input
                    type="text"
                    value={newUniData.focalPersonName}
                    onChange={(e) => setNewUniData({ ...newUniData, focalPersonName: e.target.value })}
                    placeholder="e.g. Dr. Azman"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focal Person Email</label>
                  <input
                    type="email"
                    value={newUniData.focalPersonEmail}
                    onChange={(e) => setNewUniData({ ...newUniData, focalPersonEmail: e.target.value })}
                    placeholder="azman@uni.edu.my"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Panel Notes</label>
                <textarea
                  rows={2}
                  value={newUniData.specialNotes}
                  onChange={(e) => setNewUniData({ ...newUniData, specialNotes: e.target.value })}
                  placeholder="e.g. Direct agent code active. Fast offer processing within 48 hours..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPanelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add to Direct Panel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EDIT DIRECT PANEL UNIVERSITY */}
      {/* ========================================================================= */}
      {isEditPanelModalOpen && editingUniData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Edit University: {editingUniData.name}</span>
              </div>
              <button
                onClick={() => setIsEditPanelModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePanelUni} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  value={editingUniData.name}
                  onChange={(e) => setEditingUniData({ ...editingUniData, name: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Name / Code</label>
                  <input
                    type="text"
                    value={editingUniData.shortName || ''}
                    onChange={(e) => setEditingUniData({ ...editingUniData, shortName: e.target.value })}
                    placeholder="e.g. APU, Taylors"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contract Status</label>
                  <select
                    value={editingUniData.contractStatus}
                    onChange={(e) => setEditingUniData({ ...editingUniData, contractStatus: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Renewal">Under Renewal</option>
                    <option value="Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contract Type</label>
                  <select
                    value={editingUniData.contractType}
                    onChange={(e) => setEditingUniData({ ...editingUniData, contractType: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Direct Agreement">Direct Agreement</option>
                    <option value="Preferred Tier-1">Preferred Tier-1</option>
                    <option value="Official Representative">Official Representative</option>
                    <option value="Govt MoA">Government MoA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supported Intakes</label>
                  <input
                    type="text"
                    value={editingUniData.supportedIntakes || ''}
                    onChange={(e) => setEditingUniData({ ...editingUniData, supportedIntakes: e.target.value })}
                    placeholder="e.g. Feb, July, Sept"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Admission Portal URL</label>
                <input
                  type="url"
                  value={editingUniData.directPortalUrl || ''}
                  onChange={(e) => setEditingUniData({ ...editingUniData, directPortalUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focal Person Name</label>
                  <input
                    type="text"
                    value={editingUniData.focalPersonName || ''}
                    onChange={(e) => setEditingUniData({ ...editingUniData, focalPersonName: e.target.value })}
                    placeholder="Representative Name"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focal Email</label>
                  <input
                    type="email"
                    value={editingUniData.focalPersonEmail || ''}
                    onChange={(e) => setEditingUniData({ ...editingUniData, focalPersonEmail: e.target.value })}
                    placeholder="email@uni.edu.my"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focal Phone</label>
                  <input
                    type="text"
                    value={editingUniData.focalPersonPhone || ''}
                    onChange={(e) => setEditingUniData({ ...editingUniData, focalPersonPhone: e.target.value })}
                    placeholder="+60..."
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Panel Notes</label>
                <textarea
                  rows={2}
                  value={editingUniData.specialNotes || ''}
                  onChange={(e) => setEditingUniData({ ...editingUniData, specialNotes: e.target.value })}
                  placeholder="Special instructions or notes..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditPanelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Updating...' : 'Save University Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: EDIT FULL STUDENT CASE DETAILS (EDITABLE AFTERWARDS) */}
      {/* ========================================================================= */}
      {isEditCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-[#08182b] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span>Edit Student Case Details</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Update student name, phone, academic target, counselor, branch, or notes
                </p>
              </div>
              <button
                onClick={() => setIsEditCaseModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCaseDetails} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCaseData.studentName}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, studentName: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingCaseData.phone}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, phone: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={editingCaseData.email}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, email: e.target.value })}
                    placeholder="e.g. hamza@gmail.com"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Handling Branch *</label>
                  <select
                    value={editingCaseData.branch}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, branch: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    {PAKISTAN_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Counselor Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Counselor</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {counselors.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) setEditingCaseData({ ...editingCaseData, counselorName: e.target.value });
                        }}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium"
                      >
                        <option value="">-- Choose Tracked Counselor --</option>
                        {counselors.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.branch})
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      value={editingCaseData.counselorName}
                      onChange={(e) => setEditingCaseData({ ...editingCaseData, counselorName: e.target.value })}
                      placeholder="Or counselor name..."
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target University in Malaysia *</label>
                  <div className="space-y-1.5">
                    <select
                      onChange={(e) => {
                        if (e.target.value) setEditingCaseData({ ...editingCaseData, targetUniversity: e.target.value });
                      }}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 font-medium"
                    >
                      <option value="">-- Select from Direct Panel Unis --</option>
                      {panelUnis.map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name} (Direct Panel)
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={editingCaseData.targetUniversity}
                      onChange={(e) => setEditingCaseData({ ...editingCaseData, targetUniversity: e.target.value })}
                      placeholder="e.g. Asia Pacific University (APU)"
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Program / Degree *</label>
                  <input
                    type="text"
                    required
                    value={editingCaseData.targetProgram}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, targetProgram: e.target.value })}
                    placeholder="e.g. BSc (Hons) in Software Engineering"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Intake *</label>
                  <input
                    type="text"
                    required
                    value={editingCaseData.intake}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, intake: e.target.value })}
                    placeholder="e.g. September 2025"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Passport Number (Optional)</label>
                  <input
                    type="text"
                    value={editingCaseData.passportNumber}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, passportNumber: e.target.value })}
                    placeholder="Optional (can be added later)"
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl px-3 py-2 uppercase focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Region (Optional)</label>
                  <input
                    type="text"
                    value={editingCaseData.city}
                    onChange={(e) => setEditingCaseData({ ...editingCaseData, city: e.target.value })}
                    placeholder="e.g. Lahore, Islamabad"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Case Notes / Special Instructions</label>
                <textarea
                  rows={2}
                  value={editingCaseData.notes}
                  onChange={(e) => setEditingCaseData({ ...editingCaseData, notes: e.target.value })}
                  placeholder="Case notes, remarks, student background..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditCaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Case Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
