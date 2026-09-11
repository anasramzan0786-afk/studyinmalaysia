import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Hamza Farooq',
    from: 'Islamabad, Pakistan',
    course: 'B.Sc Computer Science (AI)',
    uni: 'Asia Pacific University (APU)',
    intake: 'September 2025 Intake',
    quote:
      'Meezab consultancy made my admission and eVAL process completely transparent. They charged RM 0 extra fees and provided the exact EMGS breakdown. My visa was approved in just 4 weeks!',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80',
  },
  {
    name: 'Ayesha Siddiqui',
    from: 'Karachi, Pakistan',
    course: 'Doctor of Medicine (MD)',
    uni: 'Lincoln University College (LUC)',
    intake: 'March 2025 Intake',
    quote:
      'Finding a PMDC and WHO recognized medical college with affordable clinical rotations was tough until I contacted Meezab. Their Pakistan desk guided my parents on every step of the fee transfer.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    name: 'Bilal Malik',
    from: 'Lahore, Pakistan',
    course: 'UK Degree Transfer (Law LLB)',
    uni: 'Brickfields Asia College (BAC)',
    intake: 'January 2026 Intake',
    quote:
      'Studying for a UK Law degree in Malaysia saved me 60% of the cost compared to London. Meezab issued my conditional offer letter in 48 hours without any hassle.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
];

export function StudentTestimonials() {
  return (
    <section className="py-20 bg-slate-100/60 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Verified Admissions Track Record
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hear from Pakistani Students in Malaysia
          </h2>
          <p className="text-sm text-slate-600">
            Over 1,400+ Pakistani students successfully guided through EMGS visa processing and university enrollments across Kuala Lumpur and Selangor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-[11px] text-slate-500">{t.from}</p>
                  <p className="text-[10px] text-blue-700 font-semibold mt-0.5">
                    {t.course} • {t.uni}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

