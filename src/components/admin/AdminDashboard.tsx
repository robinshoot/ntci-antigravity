'use client';

import { generateQrCodeSvg, extractNraFromQrData, playScanBeepSound } from '@/lib/qrcode';
import jsQR from 'jsqr';
import React, { useState, useRef, useEffect } from 'react';
import { MemberData, ChapterData, EventData, ArticleData, DocumentData, MerchandiseData, SponsorData, EmergencyContactData, ChapterOfficer } from '@/lib/mockData';
import { Shield, Users, MapPin, Calendar, FileText, ShoppingBag, PhoneCall, Plus, Trash2, CheckCircle, Clock, AlertTriangle, Eye, Lock, Edit3, X, Sparkles, UserCheck, QrCode, Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminDashboardProps {
  initialMembers: MemberData[];
  initialChapters: ChapterData[];
  initialEvents: EventData[];
  initialArticles: ArticleData[];
  initialDocuments: DocumentData[];
  initialMerch: MerchandiseData[];
  initialSponsors: SponsorData[];
  initialEmergency: EmergencyContactData[];
}

export default function AdminDashboard({
  initialMembers,
  initialChapters,
  initialEvents,
  initialArticles,
  initialDocuments,
  initialMerch,
  initialSponsors,
  initialEmergency,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'CHAPTERS' | 'EVENTS' | 'ARTICLES' | 'MERCH' | 'EMERGENCY'>('MEMBERS');

  // State Management for Local CMS Actions
  const [members, setMembers] = useState<MemberData[]>(initialMembers);
  const [chapters, setChapters] = useState<ChapterData[]>(initialChapters);
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles);
  const [merch, setMerch] = useState<MerchandiseData[]>(initialMerch);
  const [emergency, setEmergency] = useState<EmergencyContactData[]>(initialEmergency);

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for adding items
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState<MemberData | null>(null);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showEditChapterModal, setShowEditChapterModal] = useState<ChapterData | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState<EventData | null>(null);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [showEditArticleModal, setShowEditArticleModal] = useState<ArticleData | null>(null);
  const [showAddMerchModal, setShowAddMerchModal] = useState(false);
  const [showEditMerchModal, setShowEditMerchModal] = useState<MerchandiseData | null>(null);
  const [showAddEmergencyModal, setShowAddEmergencyModal] = useState(false);
  const [showEditEmergencyModal, setShowEditEmergencyModal] = useState<EmergencyContactData | null>(null);
  const [showAuthorizeModal, setShowAuthorizeModal] = useState<MemberData | null>(null);
  const [authChapterName, setAuthChapterName] = useState('NTCI Chapter Jakarta Raya');
  const [authNra, setAuthNra] = useState('');

  // Event Presensi State & Attendance Records
  const [showPresensiModal, setShowPresensiModal] = useState<EventData | null>(null);
  const [presensiInput, setPresensiInput] = useState('');
  const [scanSuccessMsg, setScanSuccessMsg] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const [scannedEffect, setScannedEffect] = useState(false);

  useEffect(() => {
    if (isWebcamActive && mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [isWebcamActive, mediaStream]);

  // Turn off camera stream when modal is closed
  useEffect(() => {
    if (!showPresensiModal && isWebcamActive) {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
      setIsWebcamActive(false);
    }
  }, [showPresensiModal, isWebcamActive, mediaStream]);

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setMediaStream(stream);
        setIsWebcamActive(true);
      } catch (err) {
        alert('Kamera tidak dapat diakses atau izin kamera ditolak di browser.');
      }
    }
  };
  const [attendanceLogs, setAttendanceLogs] = useState<
    Record<string, { memberId: string; fullName: string; nra: string; chapterName: string; avatarUrl: string; checkInTime: string }[]>
  >({
    'ev-1': [
      {
        memberId: 'mem-1',
        fullName: 'Bambang "Turbo" Wijaya',
        nra: 'NT-001',
        chapterName: 'NTCI Chapter Jakarta Raya',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        checkInTime: '14:30 WIB',
      },
      {
        memberId: 'mem-2',
        fullName: 'Dicky Hendrawan',
        nra: 'NT-002',
        chapterName: 'NTCI Chapter Bandung Juara',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        checkInTime: '15:10 WIB',
      },
    ],
  });

  // Handler for Member Check-In & QR Code Parsing
  const handleCheckInMember = (rawInput: string) => {
    if (!rawInput.trim() || !showPresensiModal) return;

    const raw = rawInput.trim();
    const extractedNra = extractNraFromQrData(raw);
    const queryLower = raw.toLowerCase();
    const nraLower = extractedNra.toLowerCase();

    const found = members.find((m) => {
      if (!m.isVerified) return false;
      const mNra = m.nra ? m.nra.toLowerCase() : '';
      const mId = m.id.toLowerCase();
      const mName = m.fullName.toLowerCase();

      return (
        (mNra && (mNra === nraLower || mNra === queryLower)) ||
        mId === queryLower ||
        mId === nraLower ||
        (queryLower.length >= 3 && mName.includes(queryLower))
      );
    });

    if (found) {
      const evId = showPresensiModal.id;
      const currentList = attendanceLogs[evId] || [];
      const isAlreadyCheckedIn = currentList.some((item) => item.memberId === found.id);

      if (isAlreadyCheckedIn) {
        setScanSuccessMsg(`⚠ ${found.fullName} (${found.nra || 'OFFICIAL'}) sudah pernah presensi di event ini.`);
      } else {
        const newRecord = {
          memberId: found.id,
          fullName: found.fullName,
          nra: found.nra || 'NT-OFFICIAL',
          chapterName: found.chapterName,
          avatarUrl: found.avatarUrl,
          checkInTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        };
        setAttendanceLogs((prev) => ({
          ...prev,
          [evId]: [newRecord, ...(prev[evId] || [])],
        }));
        playScanBeepSound();
        setScanSuccessMsg(`✓ PRESENSI BERHASIL: ${found.fullName} (${found.nra || 'OFFICIAL'})! +50 Poin Keaktifan Ditambahkan.`);
      }
      setPresensiInput('');
    } else {
      setScanSuccessMsg(`❌ Data QR/NRA "${raw}" tidak ditemukan / anggota belum terverifikasi.`);
    }
  };

  // Real-time Optical Frame Decoder for Webcam Video Feed
  useEffect(() => {
    if (!isWebcamActive || !mediaStream || !showPresensiModal) return;

    let animId: number;

    const scanFrame = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data && code.data.trim()) {
            const now = Date.now();
            if (now - lastScannedTimeRef.current > 2200) {
              lastScannedTimeRef.current = now;
              setScannedEffect(true);
              setTimeout(() => setScannedEffect(false), 800);
              handleCheckInMember(code.data);
            }
          }
        }
      }
      animId = requestAnimationFrame(scanFrame);
    };

    animId = requestAnimationFrame(scanFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isWebcamActive, mediaStream, showPresensiModal, members, attendanceLogs]);

  // Form Inputs: Member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberDomicile, setNewMemberDomicile] = useState('');
  const [newMemberPlate, setNewMemberPlate] = useState('');
  const [newMemberChapter, setNewMemberChapter] = useState(initialChapters[0]?.name || 'NTCI Chapter Jakarta Raya');
  const [newMemberMotor, setNewMemberMotor] = useState('Nmax Turbo Tech MAX');
  const [newMemberVerified, setNewMemberVerified] = useState<boolean>(false);

  // Form Inputs: Chapter
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterRegion, setNewChapterRegion] = useState('Jawa Barat');
  const [newChapterStatus, setNewChapterStatus] = useState<'DECLARED' | 'EMBRYO'>('DECLARED');
  const [newChapterLeader, setNewChapterLeader] = useState('');
  const [newChapterViceLeader, setNewChapterViceLeader] = useState('');
  const [newChapterSecretary, setNewChapterSecretary] = useState('');
  const [newChapterTreasurer, setNewChapterTreasurer] = useState('');
  const [newChapterTouring, setNewChapterTouring] = useState('');
  const [newChapterHumas, setNewChapterHumas] = useState('');
  const [newChapterKopdar, setNewChapterKopdar] = useState('');

  // Form Inputs: Event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<EventData['category']>('TOURING');
  const [newEventChapter, setNewEventChapter] = useState<string>('NTCI Chapter Jakarta Raya');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-09-25');

  // Form Inputs: Article
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState<ArticleData['category']>('TECH_TIPS');
  const [newArticleAuthor, setNewArticleAuthor] = useState('Divisi Teknik NTCI');
  const [newArticleExcerpt, setNewArticleExcerpt] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');
  const [newArticleCoverImage, setNewArticleCoverImage] = useState('');

  // Form Inputs: Merch
  const [newMerchName, setNewMerchName] = useState('');
  const [newMerchPrice, setNewMerchPrice] = useState('250000');
  const [newMerchCategory, setNewMerchCategory] = useState('Apparel');

  // Form Inputs: Emergency
  const [newEmergencyPerson, setNewEmergencyPerson] = useState('');
  const [newEmergencyRole, setNewEmergencyRole] = useState('Storing & Towing Team');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('+62 812-9999-8888');

  // Actions: Member Management
  const handleVerifyMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextNraNumber = Math.floor(100 + Math.random() * 900);
          return {
            ...m,
            isVerified: true,
            nra: `NTCI-${m.chapterSlug.substring(0, 3).toUpperCase()}-${nextNraNumber}`,
          };
        }
        return m;
      })
    );
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Hapus anggota ini dari database NTCI?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleToggleMemberStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditMemberModal) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === showEditMemberModal.id ? showEditMemberModal : m))
    );
    setShowEditMemberModal(null);
  };

  const handleSaveEditChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditChapterModal) return;
    setChapters((prev) =>
      prev.map((c) => (c.id === showEditChapterModal.id ? showEditChapterModal : c))
    );
    setShowEditChapterModal(null);
  };

  const handleSaveEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditEventModal) return;
    setEvents((prev) =>
      prev.map((ev) => (ev.id === showEditEventModal.id ? showEditEventModal : ev))
    );
    setShowEditEventModal(null);
  };

  const handleSaveEditArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditArticleModal) return;
    setArticles((prev) =>
      prev.map((art) => (art.id === showEditArticleModal.id ? showEditArticleModal : art))
    );
    setShowEditArticleModal(null);
  };

  const handleSaveEditMerch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditMerchModal) return;
    setMerch((prev) =>
      prev.map((item) => (item.id === showEditMerchModal.id ? showEditMerchModal : item))
    );
    setShowEditMerchModal(null);
  };

  const handleSaveEditEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditEmergencyModal) return;
    setEmergency((prev) =>
      prev.map((em) => (em.id === showEditEmergencyModal.id ? showEditEmergencyModal : em))
    );
    setShowEditEmergencyModal(null);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    let memberNra: string | undefined = undefined;
    let assignedChapterName = 'Belum Ditentukan';
    let assignedChapterSlug = 'pusat';

    if (newMemberVerified) {
      const selectedCh = chapters.find((c) => c.name === newMemberChapter) || chapters[0];
      assignedChapterName = selectedCh.name;
      assignedChapterSlug = selectedCh.slug;

      // Auto-calculate sequential NT-xxx (e.g. NT-001, NT-093, NT-205)
      let maxNum = 0;
      members.forEach((mem) => {
        if (mem.nra && mem.isVerified) {
          const match = mem.nra.match(/NT-?(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
      memberNra = `NT-${String(maxNum + 1).padStart(3, '0')}`;
    }

    const newMem: MemberData = {
      id: `mem-${Date.now()}`,
      fullName: newMemberName,
      nra: memberNra ? memberNra : 'Menunggu Admin (NRA)',
      email: newMemberEmail || `${Date.now()}@ntci.or.id`,
      phone: newMemberPhone || '+62 812-0000-1111',
      domicile: newMemberDomicile || undefined,
      role: 'MEMBER',
      isVerified: newMemberVerified,
      chapterName: assignedChapterName,
      chapterSlug: assignedChapterSlug,
      motorModel: newMemberMotor,
      motorYear: '2024',
      motorPlate: newMemberPlate || 'B 9999 NTCI',
      motorColor: 'Magma Black',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Hari Ini',
    };
    setMembers([newMem, ...members]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setNewMemberDomicile('');
    setNewMemberPlate('');
    setShowAddMemberModal(false);
  };

  const handleAuthorizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAuthorizeModal) return;

    try {
      const res = await fetch('/api/admin/authorize-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: showAuthorizeModal.id,
          chapterName: authChapterName,
          nra: authNra,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal melakukan otorisasi');

      setMembers((prev) =>
        prev.map((m) =>
          m.id === showAuthorizeModal.id
            ? {
                ...m,
                isVerified: true,
                chapterName: authChapterName,
                nra: authNra,
              }
            : m
        )
      );

      const waPhone = showAuthorizeModal.phone.replace(/[^0-9]/g, '');
      const waText = encodeURIComponent(
        `Selamat Bro/Sis ${showAuthorizeModal.fullName}!\n\nPendaftaran keanggotaan NTCI Anda telah resmi DIVERIFIKASI.\n\n📌 Chapter: ${authChapterName}\n📌 NRA Resmi: ${authNra}\n📌 Status E-KTA: AKTIF\n\nSilakan cek profil dan E-KTA digital Anda di: https://ntci.or.id/anggota/${authNra}\n\nSalam Satu Aspal,\nNmax Turbo Club Indonesia`
      );
      const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

      setShowAuthorizeModal(null);
      if (confirm(`Berhasil! Anggota ${showAuthorizeModal.fullName} telah diotorisasi ke ${authChapterName} dengan NRA ${authNra}.\n\nBuka WhatsApp sekarang untuk mengirim pesan notifikasi verifikasi ke ${showAuthorizeModal.fullName}?`)) {
        window.open(waUrl, '_blank');
      }
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  // Actions: Chapter & Officer Management
  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName) return;

    const slug = newChapterName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const officersList: ChapterOfficer[] = [];

    if (newChapterLeader) {
      officersList.push({
        role: 'Ketua Chapter',
        name: newChapterLeader,
        nra: `NTCI-${slug.substring(0, 3).toUpperCase()}-001`,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        phone: '+62 812-3456-7890',
      });
    }

    if (newChapterViceLeader) {
      officersList.push({
        role: 'Wakil Ketua Chapter',
        name: newChapterViceLeader,
        nra: `NTCI-${slug.substring(0, 3).toUpperCase()}-002`,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        phone: '+62 812-1111-2222',
      });
    }

    if (newChapterSecretary) {
      officersList.push({
        role: 'Sekretaris Chapter',
        name: newChapterSecretary,
        nra: `NTCI-${slug.substring(0, 3).toUpperCase()}-003`,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        phone: '+62 812-3333-4444',
      });
    }

    if (newChapterTreasurer) {
      officersList.push({
        role: 'Bendahara Chapter',
        name: newChapterTreasurer,
        nra: `NTCI-${slug.substring(0, 3).toUpperCase()}-004`,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        phone: '+62 812-5555-6666',
      });
    }

    const newCh: ChapterData = {
      id: `ch-${Date.now()}`,
      name: newChapterName,
      slug: slug,
      region: newChapterRegion,
      city: newChapterRegion,
      leaderName: newChapterLeader || 'Bro Leader',
      viceLeaderName: newChapterViceLeader || undefined,
      secretaryName: newChapterSecretary || undefined,
      treasurerName: newChapterTreasurer || undefined,
      touringOfficerName: newChapterTouring || undefined,
      humasOfficerName: newChapterHumas || undefined,
      contactPhone: '+62 812-3456-7890',
      kopdarLocation: newChapterKopdar || 'Alun-alun Kota / Rest Area',
      kopdarSchedule: 'Sabtu Malam (20:00 WIB)',
      status: newChapterStatus,
      memberCount: officersList.length > 0 ? officersList.length : 1,
      officers: officersList,
    };

    setChapters([...chapters, newCh]);
    setNewChapterName('');
    setShowAddChapterModal(false);
  };

  const handleUpdateChapterOfficers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditChapterModal) return;

    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === showEditChapterModal.id) {
          return showEditChapterModal;
        }
        return ch;
      })
    );
    setShowEditChapterModal(null);
  };

  // Actions: Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const selectedCh = chapters.find((c) => c.name === newEventChapter);
    const chSlug = selectedCh ? selectedCh.slug : newEventChapter.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newEv: EventData = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      slug: newEventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: newEventCategory,
      description: 'Kegiatan resmi komunitas Nmax Turbo Club Indonesia.',
      location: newEventLocation || 'Jakarta',
      meetingPoint: 'Basecamp NTCI',
      startDate: new Date(newEventDate).toISOString(),
      chapterName: newEventChapter,
      chapterSlug: chSlug,
      bannerUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      attendingCount: 12,
    };
    setEvents([newEv, ...events]);
    setNewEventTitle('');
    setShowAddEventModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Hapus event ini dari kalender agenda?')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Actions: Article
  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle) return;
    const newArt: ArticleData = {
      id: `art-${Date.now()}`,
      title: newArticleTitle,
      slug: newArticleTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: newArticleCategory,
      excerpt: newArticleExcerpt || 'Tips dan warta informasi terbaru seputar Nmax Turbo dan kegiatan klub.',
      content: newArticleContent || newArticleExcerpt || 'Isi warta artikel resmi NTCI.',
      authorName: newArticleAuthor || 'Divisi Teknik NTCI',
      authorRole: 'Pengurus Pusat',
      coverImage: newArticleCoverImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      createdAt: 'Hari Ini',
      readTime: '3 Menit Baca',
    };
    setArticles([newArt, ...articles]);
    setNewArticleTitle('');
    setNewArticleExcerpt('');
    setNewArticleContent('');
    setNewArticleCoverImage('');
    setShowAddArticleModal(false);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Hapus artikel warta ini?')) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Actions: Merch
  const handleCreateMerch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchName) return;
    const newM: MerchandiseData = {
      id: `m-${Date.now()}`,
      name: newMerchName,
      price: parseInt(newMerchPrice) || 150000,
      category: newMerchCategory,
      description: 'Merchandise resmi Nmax Turbo Club Indonesia.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      buyUrl: 'https://wa.me/6281234567890',
      isAvailable: true,
    };
    setMerch([newM, ...merch]);
    setNewMerchName('');
    setShowAddMerchModal(false);
  };

  const handleDeleteMerch = (id: string) => {
    if (confirm('Hapus produk merchandise ini?')) {
      setMerch((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Actions: Emergency
  const handleCreateEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmergencyPerson) return;
    const newEm: EmergencyContactData = {
      id: `em-${Date.now()}`,
      contactPerson: newEmergencyPerson,
      roleOrLocation: newEmergencyRole,
      chapterName: 'NTCI Chapter Daerah',
      phone: newEmergencyPhone,
    };
    setEmergency([newEm, ...emergency]);
    setNewEmergencyPerson('');
    setShowAddEmergencyModal(false);
  };

  const handleDeleteEmergency = (id: string) => {
    if (confirm('Hapus kontak emergency SOS ini?')) {
      setEmergency((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B0A] text-slate-200 flex flex-col pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        
        {/* Top Header Banner */}
        <div className="p-6 rounded-3xl bg-[#171210] border border-[#332722] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F0C05A] via-[#D4AF37] to-[#8C6B1C] p-0.5 shadow-xl">
              <div className="w-full h-full bg-[#171210] rounded-[14px] flex items-center justify-center text-[#D4AF37]">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white">PANEL ADMIN CMS NTCI</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E5C158] text-[10px] font-bold border border-[#D4AF37]/40 uppercase">
                  TECH MAX CMS
                </span>
              </div>
              <p className="text-xs text-[#A39690]">
                Pusat Kontrol Keanggotaan, Verifikasi E-KTA, Pengurus Chapter, Agenda Event & Content Management System.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-[#0D0B0A] hover:text-white border border-[#332722]"
            >
              Lihat Portal Publik
            </Link>
          </div>
        </div>

        {/* Tab Switcher Buttons - Scrollable on mobile */}
        <div className="flex items-center gap-2 border-b border-[#332722] pb-4 overflow-x-auto pt-1 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              activeTab === 'MEMBERS'
                ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-lg ring-2 ring-[#D4AF37]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Anggota ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CHAPTERS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              activeTab === 'CHAPTERS'
                ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-lg ring-2 ring-[#D4AF37]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Kelola Chapter & Pengurus ({chapters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              activeTab === 'EVENTS'
                ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-lg ring-2 ring-[#D4AF37]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda & Event ({events.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ARTICLES')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              activeTab === 'ARTICLES'
                ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-lg ring-2 ring-[#D4AF37]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Warta & Tips ({articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MERCH')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              activeTab === 'MERCH'
                ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-lg ring-2 ring-[#D4AF37]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Merchandise ({merch.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EMERGENCY')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              activeTab === 'EMERGENCY'
                ? 'bg-[#D9383A] text-white shadow-lg ring-2 ring-[#D9383A]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D9383A]/40'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-[#D9383A]" />
            <span>Emergency SOS ({emergency.length})</span>
          </button>
        </div>

        {/* TAB 1: MEMBERS MANAGEMENT */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Cari anggota, NRA, atau chapter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 rounded-xl bg-[#171210] border border-[#332722] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Anggota Baru</span>
              </button>
            </div>

            {/* Members Table */}
            <div className="rounded-2xl bg-[#171210] border border-[#332722] overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0D0B0A] text-[#E5C158] font-bold border-b border-[#332722] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Anggota</th>
                    <th className="p-4">NRA / Status</th>
                    <th className="p-4">Chapter</th>
                    <th className="p-4">Motor & Plat</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#332722]">
                  {members
                    .filter((m) => m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || m.nra.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((m) => (
                      <tr key={m.id} className="hover:bg-[#241D1A]/50 transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/40 shrink-0">
                            <Image src={m.avatarUrl} alt={m.fullName} fill sizes="40px" className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">{m.fullName}</span>
                            <span className="text-[10px] text-[#A39690] block">{m.phone} {m.domicile ? `• ${m.domicile}` : ''}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs font-bold text-[#E5C158] block">
                            {m.isVerified && m.nra ? m.nra : 'Menunggu Admin (NRA)'}
                          </span>
                          <div className="flex items-center space-x-1 mt-0.5">
                            {m.isVerified ? (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                VERIFIED
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                PENDING
                              </span>
                            )}
                            {m.status === 'INACTIVE' ? (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                NONAKTIF
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                AKTIF
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-200">
                          {m.chapterName && m.chapterName !== 'Belum Ditentukan' ? m.chapterName : <span className="text-amber-400 font-bold">Belum Ada Chapter</span>}
                        </td>
                        <td className="p-4">
                          <span className="text-white block font-medium">{m.motorModel}</span>
                          <span className="font-mono text-[#D4AF37] text-[11px] font-bold">{m.motorPlate}</span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          {!m.isVerified && (
                            <button
                              onClick={() => {
                                setShowAuthorizeModal(m);
                                const defaultCh = m.chapterName && m.chapterName !== 'Pengurus Pusat' && m.chapterName !== 'Belum Ditentukan'
                                  ? m.chapterName
                                  : chapters[0]?.name || 'NTCI Chapter Jakarta Raya';
                                setAuthChapterName(defaultCh);
                                
                                // Auto-calculate sequential NT-xxx (e.g. NT-001, NT-093, NT-205)
                                let maxNum = 0;
                                members.forEach((mem) => {
                                  if (mem.nra && mem.isVerified) {
                                    const match = mem.nra.match(/NT-?(\d+)/i);
                                    if (match) {
                                      const num = parseInt(match[1], 10);
                                      if (num > maxNum) maxNum = num;
                                    }
                                  }
                                });
                                const seqNra = `NT-${String(maxNum + 1).padStart(3, '0')}`;
                                setAuthNra(m.nra && m.nra.startsWith('NT-') ? m.nra : seqNra);
                              }}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 shadow-md"
                            >
                              Verifikasi
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleMemberStatus(m.id)}
                            title="Ubah Status Aktif/Nonaktif"
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                              m.status === 'INACTIVE'
                                ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30'
                                : 'text-slate-400 bg-slate-800/80 hover:bg-slate-700 border-slate-700'
                            }`}
                          >
                            {m.status === 'INACTIVE' ? 'Aktifkan' : 'Nonaktifkan'}
                          </button>
                          <button
                            onClick={() => setShowEditMemberModal(m)}
                            title="Edit Data Anggota"
                            className="p-1.5 rounded-lg text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 inline-flex items-center"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/anggota/${m.nra}`}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722] inline-block"
                          >
                            Profil
                          </Link>
                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#D9383A] bg-[#0D0B0A] hover:bg-[#D9383A]/10 border border-[#332722]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CHAPTERS & LEADERSHIP OFFICERS */}
        {activeTab === 'CHAPTERS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Kelola Chapter & Struktur Pengurus Daerah</h3>
              <button
                onClick={() => setShowAddChapterModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Chapter Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((ch) => (
                <div key={ch.id} className="p-6 rounded-3xl bg-[#171210] border border-[#332722] space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {ch.status === 'DECLARED' ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          DEKLARASI RESMI
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          CHAPTER EMBRIO
                        </span>
                      )}
                      <span className="text-xs text-[#E5C158] font-bold">{ch.memberCount} Biker</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#A39690] font-mono uppercase">{ch.region}</span>
                      <h4 className="font-bold text-white text-base">{ch.name}</h4>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 border-t border-[#332722] pt-3">
                      <p className="flex justify-between"><span className="text-[#A39690]">Ketua:</span> <span className="text-white font-bold">{ch.leaderName}</span></p>
                      {ch.viceLeaderName && <p className="flex justify-between"><span className="text-[#A39690]">Wakil:</span> <span className="text-slate-200">{ch.viceLeaderName}</span></p>}
                      {ch.secretaryName && <p className="flex justify-between"><span className="text-[#A39690]">Sekretaris:</span> <span className="text-slate-200">{ch.secretaryName}</span></p>}
                      {ch.treasurerName && <p className="flex justify-between"><span className="text-[#A39690]">Bendahara:</span> <span className="text-slate-200">{ch.treasurerName}</span></p>}
                      <p className="text-[11px] text-[#A39690] pt-1">Sekre: {ch.kopdarLocation}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#332722] flex gap-2">
                    <Link
                      href={`/chapter/${ch.slug}`}
                      className="w-full py-2 rounded-xl text-xs font-bold text-center text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722]"
                    >
                      Lihat Halaman Chapter
                    </Link>
                    <button
                      onClick={() => setShowEditChapterModal(ch)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-center text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Pengurus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVENTS MANAGEMENT */}
        {activeTab === 'EVENTS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Agenda & Event Komunitas</h3>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Event Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="p-6 rounded-3xl bg-[#171210] border border-[#332722] space-y-3 shadow-xl flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40">
                      {ev.category}
                    </span>
                    <h4 className="font-bold text-white text-base">{ev.title}</h4>
                    <p className="text-xs text-[#A39690]">Lokasi: {ev.location}</p>
                    <p className="text-xs text-[#D9383A] font-semibold">
                      Tanggal: {new Date(ev.startDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setShowPresensiModal(ev);
                        setPresensiInput('');
                        setScanSuccessMsg('');
                      }}
                      title="Presensi / Check-in QR Anggota"
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 shadow-md flex items-center space-x-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Presensi QR ({attendanceLogs[ev.id]?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => setShowEditEventModal(ev)}
                      title="Edit Event"
                      className="p-2 rounded-xl text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      title="Hapus Event"
                      className="p-2 rounded-xl text-slate-400 hover:text-[#D9383A] bg-[#0D0B0A] border border-[#332722]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ARTICLES MANAGEMENT */}
        {activeTab === 'ARTICLES' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Kelola Warta & Tips Teknis</h3>
              <button
                onClick={() => setShowAddArticleModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Warta Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((art) => (
                <div key={art.id} className="p-6 rounded-3xl bg-[#171210] border border-[#332722] space-y-3 shadow-xl flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{art.category}</span>
                    <h4 className="font-bold text-white text-base">{art.title}</h4>
                    <p className="text-xs text-[#A39690]">Penulis: {art.authorName} ({art.authorRole})</p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setShowEditArticleModal(art)}
                      title="Edit Artikel"
                      className="p-2 rounded-xl text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      title="Hapus Artikel"
                      className="p-2 rounded-xl text-slate-400 hover:text-[#D9383A] bg-[#0D0B0A] border border-[#332722]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MERCHANDISE */}
        {activeTab === 'MERCH' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Katalog Merchandise Store</h3>
              <button
                onClick={() => setShowAddMerchModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {merch.map((m) => (
                <div key={m.id} className="p-5 rounded-3xl bg-[#171210] border border-[#332722] space-y-3 shadow-xl flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#E5C158] uppercase">{m.category}</span>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <p className="text-xs font-black text-[#E5C158]">Rp {m.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setShowEditMerchModal(m)}
                      title="Edit Produk"
                      className="p-2 rounded-xl text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMerch(m.id)}
                      title="Hapus Produk"
                      className="p-2 rounded-xl text-slate-400 hover:text-[#D9383A] bg-[#0D0B0A] border border-[#332722]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EMERGENCY */}
        {activeTab === 'EMERGENCY' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Kontak Bantuan SOS Storing</h3>
              <button
                onClick={() => setShowAddEmergencyModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#D9383A] hover:opacity-90 flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kontak Storing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergency.map((em) => (
                <div key={em.id} className="p-5 rounded-3xl bg-[#171210] border border-[#332722] space-y-2 shadow-xl flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">{em.contactPerson}</h4>
                    <p className="text-xs text-[#A39690]">{em.chapterName} - {em.roleOrLocation}</p>
                    <p className="text-xs font-extrabold text-[#D9383A]">{em.phone}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setShowEditEmergencyModal(em)}
                      title="Edit Kontak Emergency"
                      className="p-2 rounded-xl text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmergency(em.id)}
                      title="Hapus Kontak Emergency"
                      className="p-2 rounded-xl text-slate-400 hover:text-[#D9383A] bg-[#0D0B0A] border border-[#332722]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD MEMBER */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Tambah Anggota Baru</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Lengkap (Sesuai KTP)</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Contoh: Bro Andi Saputra"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Aktif</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="andi@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">WhatsApp</label>
                  <input
                    type="text"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E5C158] font-bold mb-1">Kota / Domisili</label>
                  <input
                    type="text"
                    value={newMemberDomicile}
                    onChange={(e) => setNewMemberDomicile(e.target.value)}
                    placeholder="Bandung / Solo"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Plat Nomor (Nopol)</label>
                  <input
                    type="text"
                    value={newMemberPlate}
                    onChange={(e) => setNewMemberPlate(e.target.value)}
                    placeholder="D 1234 NTCI"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Status Verifikasi Anggota</label>
                <select
                  value={newMemberVerified ? 'true' : 'false'}
                  onChange={(e) => setNewMemberVerified(e.target.value === 'true')}
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-semibold focus:outline-none"
                >
                  <option value="false" className="bg-[#171210] text-amber-300 font-bold">
                    ⏳ PENDING (Belum Diverifikasi - Tanpa NRA & Tanpa Chapter)
                  </option>
                  <option value="true" className="bg-[#171210] text-emerald-400 font-bold">
                    ✓ VERIFIED (Langsung Verifikasi & Terbitkan NRA NT-xxx)
                  </option>
                </select>
              </div>

              {newMemberVerified ? (
                <div>
                  <label className="block text-[#E5C158] font-bold mb-1">Penugasan Chapter NTCI</label>
                  <select
                    value={newMemberChapter}
                    onChange={(e) => setNewMemberChapter(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-semibold focus:outline-none"
                  >
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.name} className="bg-[#171210] text-white">
                        {ch.name} ({ch.status === 'DECLARED' ? 'Deklarasi' : 'Embrio'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                  * Anggota baru akan masuk daftar <strong>PENDING</strong>. Penentuan Chapter dan penerbitan NRA resmi (misal NT-093) dilakukan oleh Admin saat tombol <strong>Verifikasi</strong> diklik.
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CHAPTER */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Tambah Chapter Baru & Pengurus</h3>
              <button onClick={() => setShowAddChapterModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChapter} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Chapter</label>
                  <input
                    type="text"
                    required
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    placeholder="NTCI Chapter Solo Raya"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Wilayah / Provinsi</label>
                  <input
                    type="text"
                    value={newChapterRegion}
                    onChange={(e) => setNewChapterRegion(e.target.value)}
                    placeholder="Jawa Tengah"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Status Chapter</label>
                <select
                  value={newChapterStatus}
                  onChange={(e) => setNewChapterStatus(e.target.value as 'DECLARED' | 'EMBRYO')}
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="DECLARED">DEKLARASI RESMI (DECLARED)</option>
                  <option value="EMBRYO">CHAPTER EMBRIO (PROSPEK)</option>
                </select>
              </div>

              <div className="border-t border-[#332722] pt-3 space-y-2">
                <h4 className="font-bold text-[#E5C158]">Struktur Pengurus Daerah</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Ketua Chapter</label>
                    <input
                      type="text"
                      value={newChapterLeader}
                      onChange={(e) => setNewChapterLeader(e.target.value)}
                      placeholder="Nama Ketua"
                      className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Wakil Ketua</label>
                    <input
                      type="text"
                      value={newChapterViceLeader}
                      onChange={(e) => setNewChapterViceLeader(e.target.value)}
                      placeholder="Nama Wakil"
                      className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Sekretaris</label>
                    <input
                      type="text"
                      value={newChapterSecretary}
                      onChange={(e) => setNewChapterSecretary(e.target.value)}
                      placeholder="Nama Sekretaris"
                      className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Bendahara</label>
                    <input
                      type="text"
                      value={newChapterTreasurer}
                      onChange={(e) => setNewChapterTreasurer(e.target.value)}
                      placeholder="Nama Bendahara"
                      className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lokasi Sekre (Sekretariat Chapter)</label>
                <input
                  type="text"
                  value={newChapterKopdar}
                  onChange={(e) => setNewChapterKopdar(e.target.value)}
                  placeholder="Alun-Alun Solo"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CHAPTER OFFICERS */}
      {showEditChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Edit Pengurus {showEditChapterModal.name}</h3>
              <button onClick={() => setShowEditChapterModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditChapter} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Status Chapter</label>
                <select
                  value={showEditChapterModal.status}
                  onChange={(e) =>
                    setShowEditChapterModal({
                      ...showEditChapterModal,
                      status: e.target.value as 'DECLARED' | 'EMBRYO' | 'INACTIVE',
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="DECLARED">DEKLARASI RESMI (DECLARED)</option>
                  <option value="EMBRYO">CHAPTER EMBRIO (PROSPEK)</option>
                  <option value="INACTIVE">CHAPTER NONAKTIF (INACTIVE)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Ketua Chapter</label>
                <input
                  type="text"
                  value={showEditChapterModal.leaderName}
                  onChange={(e) =>
                    setShowEditChapterModal({
                      ...showEditChapterModal,
                      leaderName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Wakil Ketua Chapter</label>
                <input
                  type="text"
                  value={showEditChapterModal.viceLeaderName || ''}
                  onChange={(e) =>
                    setShowEditChapterModal({
                      ...showEditChapterModal,
                      viceLeaderName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sekretaris Chapter</label>
                <input
                  type="text"
                  value={showEditChapterModal.secretaryName || ''}
                  onChange={(e) =>
                    setShowEditChapterModal({
                      ...showEditChapterModal,
                      secretaryName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Bendahara Chapter</label>
                <input
                  type="text"
                  value={showEditChapterModal.treasurerName || ''}
                  onChange={(e) =>
                    setShowEditChapterModal({
                      ...showEditChapterModal,
                      treasurerName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditChapterModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Buat Agenda Event Baru</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Judul Event</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Kopdar Gabungan & Bakti Sosial"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Kategori Event</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value as EventData['category'])}
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="TOURING">TOURING AKBAR</option>
                  <option value="KOPDAR">KOPDAR RUTIN</option>
                  <option value="WORKSHOP">WORKSHOP TEKNIK Y-CVT</option>
                  <option value="SOCIAL_CSR">BAKTI SOSIAL / CSR</option>
                  <option value="ANNIVERSARY">ANNIVERSARY & JAMNAS</option>
                </select>
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Chapter Tuan Rumah (Host Event)</label>
                <select
                  value={newEventChapter}
                  onChange={(e) => setNewEventChapter(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="Pengurus Pusat NTCI">Pengurus Pusat NTCI (Nasional)</option>
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.name} className="bg-[#171210] text-white">
                      {ch.name} ({ch.status === 'DECLARED' ? 'Deklarasi' : 'Embrio'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lokasi Event</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="Pantai Pangandaran"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ARTICLE */}
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Tambah Warta & Tips Teknis Baru</h3>
              <button onClick={() => setShowAddArticleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  placeholder="Tips Perawatan Motor Y-CVT Saat Hujan"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E5C158] font-bold mb-1">Kategori Warta</label>
                  <select
                    value={newArticleCategory}
                    onChange={(e) => setNewArticleCategory(e.target.value as ArticleData['category'])}
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                  >
                    <option value="TECH_TIPS">TIPS TEKNIS Y-CVT</option>
                    <option value="TOURING_REPORT">LAPORAN TOURING</option>
                    <option value="SAFETY_RIDING">SAFETY RIDING</option>
                    <option value="NEWS">BERITA KLUB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Penulis</label>
                  <input
                    type="text"
                    value={newArticleAuthor}
                    onChange={(e) => setNewArticleAuthor(e.target.value)}
                    placeholder="Divisi Teknik NTCI"
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  value={newArticleExcerpt}
                  onChange={(e) => setNewArticleExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Isi Lengkap Artikel (Konten / Paragraf)</label>
                <textarea
                  rows={6}
                  required
                  value={newArticleContent}
                  onChange={(e) => setNewArticleContent(e.target.value)}
                  placeholder="Tuliskan isi lengkap artikel, langkah-langkah tips teknis, atau berita selengkapnya di sini..."
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL Cover Gambar (Opsional)</label>
                <input
                  type="text"
                  value={newArticleCoverImage}
                  onChange={(e) => setNewArticleCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-xxx"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Terbitkan Warta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MERCH */}
      {showAddMerchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Tambah Merchandise Produk</h3>
              <button onClick={() => setShowAddMerchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMerch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={newMerchName}
                  onChange={(e) => setNewMerchName(e.target.value)}
                  placeholder="Rompi Touring Premium NTCI"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={newMerchPrice}
                  onChange={(e) => setNewMerchPrice(e.target.value)}
                  placeholder="250000"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMerchModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMERGENCY */}
      {showAddEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Tambah Kontak Storing Emergency SOS</h3>
              <button onClick={() => setShowAddEmergencyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmergency} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Petugas / Kontak</label>
                <input
                  type="text"
                  required
                  value={newEmergencyPerson}
                  onChange={(e) => setNewEmergencyPerson(e.target.value)}
                  placeholder="Bro Hendra Storing"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Peran / Area Coverage</label>
                <input
                  type="text"
                  value={newEmergencyRole}
                  onChange={(e) => setNewEmergencyRole(e.target.value)}
                  placeholder="Storing Towing Area Solo Raya"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nomor Telepon Emergency</label>
                <input
                  type="tel"
                  value={newEmergencyPhone}
                  onChange={(e) => setNewEmergencyPhone(e.target.value)}
                  placeholder="+62 812-9999-8888"
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmergencyModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D9383A] text-white font-extrabold"
                >
                  Simpan Kontak SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MEMBER */}
      {showEditMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Edit Data & Status Anggota</h3>
              <button onClick={() => setShowEditMemberModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={showEditMemberModal.fullName}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, fullName: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Telepon (WhatsApp)</label>
                  <input
                    type="text"
                    value={showEditMemberModal.phone}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, phone: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#E5C158] font-bold mb-1">Status Keanggotaan</label>
                  <select
                    value={showEditMemberModal.status || 'ACTIVE'}
                    onChange={(e) =>
                      setShowEditMemberModal({
                        ...showEditMemberModal,
                        status: e.target.value as 'ACTIVE' | 'INACTIVE',
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                  >
                    <option value="ACTIVE">AKTIF (ACTIVE)</option>
                    <option value="INACTIVE">TIDAK AKTIF / NONAKTIF (INACTIVE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#E5C158] font-bold mb-1">Verifikasi Kartu Anggota</label>
                  <select
                    value={showEditMemberModal.isVerified ? 'true' : 'false'}
                    onChange={(e) =>
                      setShowEditMemberModal({
                        ...showEditMemberModal,
                        isVerified: e.target.value === 'true',
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                  >
                    <option value="true">VERIFIED (Resmi Terverifikasi)</option>
                    <option value="false">PENDING (Belum Verifikasi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Registrasi (NRA)</label>
                  <input
                    type="text"
                    value={showEditMemberModal.nra}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, nra: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={showEditMemberModal.email}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Chapter NTCI</label>
                <select
                  value={showEditMemberModal.chapterName}
                  onChange={(e) => {
                    const sel = chapters.find((c) => c.name === e.target.value);
                    setShowEditMemberModal({
                      ...showEditMemberModal,
                      chapterName: e.target.value,
                      chapterSlug: sel ? sel.slug : 'pusat',
                    });
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white font-bold"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.name}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Model Motor</label>
                  <input
                    type="text"
                    value={showEditMemberModal.motorModel}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, motorModel: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tahun Motor</label>
                  <input
                    type="text"
                    value={showEditMemberModal.motorYear}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, motorYear: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Plat Nomor</label>
                  <input
                    type="text"
                    value={showEditMemberModal.motorPlate}
                    onChange={(e) =>
                      setShowEditMemberModal({ ...showEditMemberModal, motorPlate: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowEditMemberModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EVENT */}
      {showEditEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Edit Event Agenda</h3>
              <button onClick={() => setShowEditEventModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Judul Event</label>
                <input
                  type="text"
                  required
                  value={showEditEventModal.title}
                  onChange={(e) =>
                    setShowEditEventModal({ ...showEditEventModal, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Kategori Event</label>
                <select
                  value={showEditEventModal.category}
                  onChange={(e) =>
                    setShowEditEventModal({
                      ...showEditEventModal,
                      category: e.target.value as EventData['category'],
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="TOURING">TOURING AKBAR</option>
                  <option value="KOPDAR">KOPDAR RUTIN</option>
                  <option value="WORKSHOP">WORKSHOP TEKNIK Y-CVT</option>
                  <option value="SOCIAL_CSR">BAKTI SOSIAL / CSR</option>
                  <option value="ANNIVERSARY">ANNIVERSARY & JAMNAS</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lokasi Event</label>
                <input
                  type="text"
                  value={showEditEventModal.location}
                  onChange={(e) =>
                    setShowEditEventModal({ ...showEditEventModal, location: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowEditEventModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ARTICLE */}
      {showEditArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Edit Warta & Tips</h3>
              <button onClick={() => setShowEditArticleModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditArticle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={showEditArticleModal.title}
                  onChange={(e) =>
                    setShowEditArticleModal({ ...showEditArticleModal, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Kategori Warta</label>
                <select
                  value={showEditArticleModal.category}
                  onChange={(e) =>
                    setShowEditArticleModal({
                      ...showEditArticleModal,
                      category: e.target.value as ArticleData['category'],
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="TECH_TIPS">TIPS TEKNIS Y-CVT</option>
                  <option value="TOURING_REPORT">LAPORAN TOURING</option>
                  <option value="SAFETY_RIDING">SAFETY RIDING</option>
                  <option value="NEWS">BERITA KLUB</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  value={showEditArticleModal.excerpt}
                  onChange={(e) =>
                    setShowEditArticleModal({ ...showEditArticleModal, excerpt: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Isi Lengkap Artikel</label>
                <textarea
                  rows={5}
                  value={showEditArticleModal.content}
                  onChange={(e) =>
                    setShowEditArticleModal({ ...showEditArticleModal, content: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowEditArticleModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MERCH */}
      {showEditMerchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Edit Merchandise Produk</h3>
              <button onClick={() => setShowEditMerchModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMerch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={showEditMerchModal.name}
                  onChange={(e) =>
                    setShowEditMerchModal({ ...showEditMerchModal, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={showEditMerchModal.price}
                  onChange={(e) =>
                    setShowEditMerchModal({ ...showEditMerchModal, price: parseInt(e.target.value) || 0 })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Ketersediaan Stok</label>
                <select
                  value={showEditMerchModal.isAvailable ? 'true' : 'false'}
                  onChange={(e) =>
                    setShowEditMerchModal({
                      ...showEditMerchModal,
                      isAvailable: e.target.value === 'true',
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  <option value="true">Tersedia (In Stock)</option>
                  <option value="false">Habis / Out of Stock</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowEditMerchModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black font-extrabold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EMERGENCY */}
      {showEditEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <h3 className="font-bold text-white text-lg">Edit Kontak SOS Emergency</h3>
              <button onClick={() => setShowEditEmergencyModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmergency} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Petugas / Kontak</label>
                <input
                  type="text"
                  required
                  value={showEditEmergencyModal.contactPerson}
                  onChange={(e) =>
                    setShowEditEmergencyModal({ ...showEditEmergencyModal, contactPerson: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Peran / Area Coverage</label>
                <input
                  type="text"
                  value={showEditEmergencyModal.roleOrLocation}
                  onChange={(e) =>
                    setShowEditEmergencyModal({ ...showEditEmergencyModal, roleOrLocation: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nomor Telepon Emergency</label>
                <input
                  type="tel"
                  value={showEditEmergencyModal.phone}
                  onChange={(e) =>
                    setShowEditEmergencyModal({ ...showEditEmergencyModal, phone: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowEditEmergencyModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D9383A] text-white font-extrabold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OTORISASI ANGGOTA & SET CHAPTER */}
      {showAuthorizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">Otorisasi & Penentuan Chapter</h3>
                <p className="text-xs text-[#A39690]">Pemohon: <span className="text-white font-bold">{showAuthorizeModal.fullName}</span></p>
              </div>
              <button onClick={() => setShowAuthorizeModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthorizeSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0D0B0A] border border-[#332722] space-y-1">
                <p className="text-slate-400">Email: <span className="text-white font-medium">{showAuthorizeModal.email}</span></p>
                <p className="text-slate-400">WhatsApp: <span className="text-white font-medium">{showAuthorizeModal.phone}</span></p>
                <p className="text-[#E5C158] font-bold">Kota Domisili: <span className="text-white font-extrabold">{showAuthorizeModal.domicile || 'Belum Diisi'}</span></p>
                <p className="text-slate-400 font-medium">Unit Motor: <span className="text-white font-medium">{showAuthorizeModal.motorModel} ({showAuthorizeModal.motorPlate})</span></p>
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Penugasan Chapter NTCI</label>
                <select
                  value={authChapterName}
                  onChange={(e) => {
                    setAuthChapterName(e.target.value);
                    const chapterCode = e.target.value.replace('NTCI Chapter ', '').slice(0, 3).toUpperCase();
                    const randomNum = String(Math.floor(Math.random() * 800) + 100).padStart(3, '0');
                    setAuthNra(`NTCI-${chapterCode}-${randomNum}`);
                  }}
                  className="w-full p-3 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-bold"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.name}>
                      {ch.name} ({ch.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nomor Registrasi Anggota (NRA)</label>
                <input
                  type="text"
                  required
                  value={authNra}
                  onChange={(e) => setAuthNra(e.target.value)}
                  placeholder="NTCI-JKT-045"
                  className="w-full p-3 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white font-mono font-bold text-sm tracking-wider"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                <button
                  type="button"
                  onClick={() => setShowAuthorizeModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] font-extrabold shadow-lg hover:opacity-90"
                >
                  Otorisasi & Terbitkan E-KTA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRESENSI & SCANNER EVENT */}
      {showPresensiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#171210] border border-[#332722] rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#332722] pb-3">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40 uppercase">
                  MODUL ABSENSI & PRESENSI QR
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{showPresensiModal.title}</h3>
                <p className="text-xs text-[#A39690]">{showPresensiModal.location} • {new Date(showPresensiModal.startDate).toLocaleDateString('id-ID')}</p>
              </div>
              <button onClick={() => setShowPresensiModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanner Viewfinder Box HUD */}
            <div className="p-5 rounded-2xl bg-[#0D0B0A] border border-[#332722] text-center space-y-3">
              <div
                className={`relative w-56 h-56 mx-auto rounded-2xl bg-black border-2 transition-all duration-300 p-2 overflow-hidden shadow-2xl flex flex-col items-center justify-center group ${
                  scannedEffect
                    ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.8)] scale-105'
                    : isWebcamActive
                    ? 'border-[#E5C158] shadow-[0_0_20px_rgba(229,193,88,0.3)]'
                    : 'border-[#D4AF37]/50'
                }`}
              >
                {/* HUD Corner Targets */}
                <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 transition-colors z-20 ${scannedEffect ? 'border-emerald-400' : 'border-[#E5C158]'}`} />
                <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 transition-colors z-20 ${scannedEffect ? 'border-emerald-400' : 'border-[#E5C158]'}`} />
                <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 transition-colors z-20 ${scannedEffect ? 'border-emerald-400' : 'border-[#E5C158]'}`} />
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 transition-colors z-20 ${scannedEffect ? 'border-emerald-400' : 'border-[#E5C158]'}`} />

                {/* Laser Scanning Line Animation */}
                <div className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E5C158] to-transparent shadow-[0_0_20px_#E5C158] z-20 ${isWebcamActive ? 'animate-bounce' : 'opacity-40'}`} />

                {isWebcamActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl z-10" />
                ) : (
                  <div className="text-center space-y-2 z-10 p-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto animate-pulse">
                      <QrCode className="w-6 h-6 text-[#E5C158]" />
                    </div>
                    <span className="text-[10px] font-mono font-extrabold text-[#E5C158] tracking-widest block uppercase">
                      SCANNER KAMERA OPTIK LIVE
                    </span>
                    <span className="text-[9px] text-slate-400 block font-medium">
                      Aktifkan kamera laptop/HP untuk memindai QR Code E-KTA secara otomatis
                    </span>
                  </div>
                )}
              </div>

              {/* Webcam Control Button & Quick Sample Check-in Badges */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={toggleWebcam}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md inline-flex items-center space-x-2 ${
                    isWebcamActive
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] hover:opacity-90'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isWebcamActive ? 'Matikan Kamera' : '🎥 Buka Kamera Laptop / HP Live'}</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#A39690] font-semibold mr-1">Simulasi Quick Scan:</span>
                  {members.filter((m) => m.isVerified && m.nra).slice(0, 4).map((mem) => (
                    <button
                      key={mem.id}
                      type="button"
                      onClick={() => {
                        handleCheckInMember(`NTCI_VERIFIED_${mem.nra}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#171210] hover:bg-[#241D1A] border border-[#D4AF37]/40 text-[#E5C158] text-[10px] font-mono font-bold transition-all"
                    >
                      + Scan {mem.nra} ({mem.fullName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {scanSuccessMsg && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 font-bold animate-fadeIn ${
                scanSuccessMsg.startsWith('✓')
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : scanSuccessMsg.startsWith('⚠')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <CheckCircle className="w-4 h-4 shrink-0 text-current" />
                <span>{scanSuccessMsg}</span>
              </div>
            )}

            {/* Check-in Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckInMember(presensiInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={presensiInput}
                onChange={(e) => setPresensiInput(e.target.value)}
                placeholder="Scan QR Code atau Ketik NRA Anggota (misal: NT-001, NT-002)..."
                className="flex-1 p-3 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#E5C158]"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] text-xs font-extrabold shadow-md hover:opacity-90 shrink-0"
              >
                Check-in Anggota
              </button>
            </form>

            {/* Attendance Roster Table */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Peserta yang Sudah Presensi ({attendanceLogs[showPresensiModal.id]?.length || 0} Rider)</span>
                </h4>
              </div>

              <div className="rounded-2xl bg-[#0D0B0A] border border-[#332722] overflow-hidden max-h-56 overflow-y-auto">
                {attendanceLogs[showPresensiModal.id]?.length ? (
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#171210] text-[#E5C158] font-bold border-b border-[#332722] text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Anggota</th>
                        <th className="p-3">NRA</th>
                        <th className="p-3">Chapter</th>
                        <th className="p-3 text-right">Waktu Presensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#332722]">
                      {attendanceLogs[showPresensiModal.id].map((rec, idx) => (
                        <tr key={idx} className="hover:bg-[#241D1A]/50">
                          <td className="p-3 flex items-center space-x-2.5">
                            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-[#D4AF37]/40 shrink-0">
                              <Image src={rec.avatarUrl} alt={rec.fullName} fill sizes="28px" className="object-cover" />
                            </div>
                            <span className="font-bold text-white text-xs">{rec.fullName}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#E5C158]">{rec.nra}</td>
                          <td className="p-3 text-slate-300">{rec.chapterName}</td>
                          <td className="p-3 text-right font-mono text-emerald-400 font-semibold">{rec.checkInTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    Belum ada anggota yang melakukan presensi di event ini.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#332722]">
              <button
                type="button"
                onClick={() => setShowPresensiModal(null)}
                className="px-5 py-2 rounded-xl bg-[#0D0B0A] text-slate-300 border border-[#332722] text-xs font-bold"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
