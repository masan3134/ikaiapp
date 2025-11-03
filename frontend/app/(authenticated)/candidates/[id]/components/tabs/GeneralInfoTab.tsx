'use client';

import { Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import type { Candidate } from '../../types';

interface GeneralInfoTabProps {
  candidate: Candidate;
}

export default function GeneralInfoTab({ candidate }: GeneralInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Contact Info Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {candidate.email && (
          <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Email</p>
              <p className="text-base font-semibold text-gray-900">{candidate.email}</p>
            </div>
          </div>
        )}
        {candidate.phone && (
          <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Telefon</p>
              <p className="text-base font-semibold text-gray-900">{candidate.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Address */}
      {candidate.address && (
        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <MapPin className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Adres</p>
            <p className="text-base font-semibold text-gray-900">{candidate.address}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {candidate.experience && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Deneyim
          </h3>
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
            <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
              {candidate.experience}
            </p>
          </div>
        </div>
      )}

      {/* Education */}
      {candidate.education && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Eğitim
          </h3>
          <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
            <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
              {candidate.education}
            </p>
          </div>
        </div>
      )}

      {/* General Comments */}
      {candidate.generalComment && (
        <div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">Genel Yorumlar</h3>
          <div className="bg-gray-50 border border-gray-300 p-5 rounded-lg">
            <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
              {candidate.generalComment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
